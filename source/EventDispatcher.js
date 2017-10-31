/**
 * Created by Oleg Galaburda on 09.02.16.
 * @flow
 */

import type {
  EventObject,
  EventType,
  EventListener,
  EventProcessor,
  IEvent,
  IEventDispatcher,
} from './TypeDefinition';

const hasOwnProp = (target: any, name: string): boolean => (
  Object.prototype.hasOwnProperty.call(target, name)
);

export class Event implements IEvent {

  type: string;
  data: mixed;
  defaultPrevented: boolean;
  stopPropagation: ?() => void;
  stopImmediatePropagation: ?() => void;

  constructor(type: string, data: mixed = null) {
    this.type = type;
    this.data = data;
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
  [priority: string]: Array<EventListener>;
}

type EventTypesCollection = {
  [eventType: string]: EventPrioritiesCollection;
}

class ListenersRunner {
  index: number = -1;
  immediatelyStopped: boolean = false;
  listeners: EventListener[];
  onStopped: (runner: ListenersRunner) => void;
  onComplete: (runner: ListenersRunner) => void;

  constructor(
    listeners: EventListener[],
    onStopped: (runner: ListenersRunner) => void,
    onComplete: (runner: ListenersRunner) => void,
  ) {
    this.listeners = listeners;
    this.onStopped = onStopped;
    this.onComplete = onComplete;
  }

  stopImmediatePropagation = () => {
    this.immediatelyStopped = true;
  };

  run(event: EventObject, target: any) {
    let listener: EventListener;
    const { listeners } = this;
    this.augmentEvent(event);
    // TODO this has to be handled in separate object ListenersRunner that should be
    // created for each call() call and asked for index validation on each listener remove.
    for (this.index = 0; this.index < listeners.length; this.index++) {
      if (this.immediatelyStopped) break;
      listener = listeners[this.index];
      listener.call(target, event);
    }
    this.clearEvent(event);
    this.onComplete(this);
  }

  augmentEvent(eventObject: EventObject) {
    const event: EventObject = eventObject;
    event.stopPropagation = this.onStopped;
    event.stopImmediatePropagation = this.stopImmediatePropagation;
  }

  /* eslint class-methods-use-this: "off" */
  clearEvent(eventObject: EventObject) {
    const event: EventObject = eventObject;
    delete event.stopPropagation;
    delete event.stopImmediatePropagation;
  }

  listenerRemoved(listeners: EventListener[], index: number) {
    if (listeners === this.listeners && index <= this.index) {
      this.index--;
    }
  }
}

class EventListeners {
  /**
   * key - event Type
   * value - hash of priorities
   *    key - priority
   *    value - list of handlers
   * @type {Object<string, Object.<string, Array<number, Function>>>}
   * @private
   */
  _listeners: EventTypesCollection = {};
  _runners: ListenersRunner[] = [];

  createList(eventType: string, priorityOpt?: mixed): Array<EventListener> {
    const priority: number = parseInt(priorityOpt, 10);
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
      const { length } = list;
      for (let index = 0; index < length; index++) {
        const priority = list[index];
        const handlers = priorities[priority];
        const handlerIndex = handlers.indexOf(handler);
        if (handlerIndex >= 0) {
          handlers.splice(handlerIndex, 1);
          if (!handlers.length) {
            delete priorities[priority];
          }
          this._runners.forEach((runner) => {
            runner.listenerRemoved(handlers, handlerIndex);
          });
        }
      }
    }
  }

  removeAll(eventType: string) {
    delete this._listeners[eventType];
  }

  createRunner(handlers, onStopped) {
    const runner = new ListenersRunner(handlers, onStopped, this.removeRunner);
    this._runners.push(runner);
    return runner;
  }

  removeRunner = (runner) => {
    this._runners.splice(this._runners.indexOf(runner), 1);
  };

  call(event: EventObject, target: any) {
    const priorities = this.getPrioritiesByKey(event.type);
    let stopped = false;
    const stopPropagation = () => {
      stopped = true;
    };
    if (priorities) {
      // getOwnPropertyNames() or keys()?
      const list: string[] = Object
        .getOwnPropertyNames(priorities)
        .sort((a: any, b: any) => (a - b));
      const { length } = list;
      for (let index = 0; index < length; index++) {
        if (stopped) break;
        const handlers: Array<EventListener> = priorities[list[index]];
        // in case if all handlers of priority were removed while event
        // was dispatched and handlers become undefined.
        if (handlers) {
          const runner = this.createRunner(handlers, stopPropagation);
          runner.run(event, target);
          if (runner.immediatelyStopped) break;
        }
      }
    }
  }
}

class EventDispatcher implements IEventDispatcher {

  _listeners: EventListeners;
  _eventPreprocessor: EventProcessor;

  constructor(eventPreprocessor: EventProcessor = null, noInit: boolean = false) {
    if (!noInit) {
      this.initialize(eventPreprocessor);
    }
  }

  /**
   * @private
   */
  initialize(eventPreprocessor: EventProcessor = null) {
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
    return (event: any);
  }

  static create(eventPreprocessor: EventProcessor) {
    return new EventDispatcher(eventPreprocessor);
  }

  /* eslint no-undef: "off" */
  static Event: Class<Event>;
}

EventDispatcher.Event = Event;

export default EventDispatcher;
