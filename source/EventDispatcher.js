/**
 * Created by Oleg Galaburda on 09.02.16.
 * @flow
 */

import type { EventObject, EventType, EventListener, EventProcessor } from './TypeDefinition';

const hasOwnProp = (target: any, name: string): boolean => (
  Object.prototype.hasOwnProperty.call(target, name)
);

export class Event {

  type: string;
  data: mixed;
  defaultPrevented: boolean;
  stopPropagation: ?Function;
  stopImmediatePropagation: ?Function;

  constructor(type: string, data: mixed) {
    this.type = type;
    this.data = data || null;
    this.defaultPrevented = false;
  }

  toJSON(): EventObject {
    return { type: this.type, data: this.data };
  }

  isDefaultPrevented(): boolean {
    return this.defaultPrevented;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

type EventPrioritiesCollection = {
  [priority:string]: Array<EventListener>;
}

type EventTypesCollection = {
  [eventType:string]: EventPrioritiesCollection;
}

class EventListeners {

  _listeners: EventTypesCollection;

  constructor() {
    /**
     * key - event Type
     * value - hash of priorities
     *    key - priority
     *    value - list of handlers
     * @type {Object<string, Object.<string, Array<number, Function>>>}
     * @private
     */
    this._listeners = {};
  }

  createList(eventType: string, priority: number): Array<EventListener> {
    priority = parseInt(priority, 10);
    const target: EventPrioritiesCollection = this.getPrioritiesByKey(eventType);
    const key: string = String(priority);
    let value: Array<EventListener>;
    if (hasOwnProp(target, key)) {
      value = target[key];
    } else {
      value = [];
      target[key] = value;
    }
    return value;
  }

  getPrioritiesByKey(key: string): EventPrioritiesCollection {
    let value: EventPrioritiesCollection;
    if (hasOwnProp(this._listeners, key)) {
      value = this._listeners[key];
    } else {
      value = {};
      this._listeners[key] = value;
    }
    return value;
  }

  add(eventType: string, handler: EventListener, priority: number) {
    const handlers = this.createList(eventType, priority);
    if (handlers.indexOf(handler) < 0) {
      handlers.push(handler);
    }
  }

  has(eventType: string): boolean {
    let priority: string;
    let result = false;
    const priorities = this.getPrioritiesByKey(eventType);
    if (priorities) {
      for (priority in priorities) {
        if (hasOwnProp(priorities, priority)) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  remove(eventType: string, handler) {
    const priorities = this.getPrioritiesByKey(eventType);
    if (priorities) {
      const list = Object.getOwnPropertyNames(priorities);
      const length = list.length;
      for (let index = 0; index < length; index++) {
        const priority = list[index];
        const handlers = priorities[priority];
        const handlerIndex = handlers.indexOf(handler);
        if (handlerIndex >= 0) {
          handlers.splice(handlerIndex, 1);
          if (!handlers.length) {
            delete priorities[priority];
          }
        }
      }
    }
  }

  removeAll(eventType: string) {
    delete this._listeners[eventType];
  }

  call(event: EventObject, target: any) {
    let handler: EventListener;
    let _stopped = false;
    let _immediatelyStopped = false;
    const stopPropagation = () => {
      _stopped = true;
    };
    const stopImmediatePropagation = () => {
      _immediatelyStopped = true;
    };
    event.stopPropagation = stopPropagation;
    event.stopImmediatePropagation = stopImmediatePropagation;
    const priorities = this.getPrioritiesByKey(event.type, this._listeners);
    if (priorities) {
      // getOwnPropertyNames() or keys()?
      const list: string[] = Object.getOwnPropertyNames(priorities).sort(
        (a: any, b: any) => (a - b),
      );
      const length = list.length;
      for (let index = 0; index < length; index++) {
        if (_stopped) break;
        const handlers: Array<EventListener> = priorities[list[index]];
        const handlersLength = handlers.length;
        for (let handlersIndex = 0; handlersIndex < handlersLength; handlersIndex++) {
          if (_immediatelyStopped) break;
          handler = handlers[handlersIndex];
          handler.call(target, event);
        }
      }
    }
    delete event.stopPropagation;
    delete event.stopImmediatePropagation;
  }
}

class EventDispatcher {

  _listeners: EventListeners;
  _eventPreprocessor: EventProcessor;

  constructor(eventPreprocessor: EventProcessor, noInit: boolean = false) {
    if (!noInit) {
      this.initialize(eventPreprocessor);
    }
  }

  /**
   * @private
   */
  initialize(eventPreprocessor: EventProcessor) {
    this._eventPreprocessor = eventPreprocessor;
    this._listeners = new EventListeners();
  }

  addEventListener(eventType: string, listener: EventListener, priority: number = 0) {
    this._listeners.add(eventType, listener, -priority || 0);
  }

  hasEventListener(eventType: string) {
    return this._listeners.has(eventType);
  }

  removeEventListener(eventType: string, listener: EventListener) {
    this._listeners.remove(eventType, listener);
  }

  removeAllEventListeners(eventType: string) {
    this._listeners.removeAll(eventType);
  }

  dispatchEvent(event: EventType, data: mixed) {
    let eventObject = EventDispatcher.getEvent(event, data);
    if (this._eventPreprocessor) {
      eventObject = this._eventPreprocessor.call(this, eventObject);
    }
    this._listeners.call(eventObject);
  }

  static isObject(value: mixed) {
    return (typeof value === 'object') && (value !== null);
  }

  static getEvent(eventOrType: EventType, optionalData: mixed): EventObject {
    let event = eventOrType;
    if (!EventDispatcher.isObject(eventOrType)) {
      event = new EventDispatcher.Event(String(eventOrType), optionalData);
    }
    return (event:any);
  }

  static create(eventPreprocessor: EventProcessor) {
    return new EventDispatcher(eventPreprocessor);
  }

  /* eslint no-undef: "off" */
  static Event: Class<Event>;
}

EventDispatcher.Event = Event;

export default EventDispatcher;
