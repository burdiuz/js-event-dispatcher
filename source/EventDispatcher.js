/**
 * Created by Oleg Galaburda on 09.02.16.
 */

'use strict';

import SymbolImpl from 'SymbolImpl';

export class Event {

  constructor(type, data) {
    this.type = type;
    this.data = data || null;
    this.defaultPrevented = false;
	this.stopPropagation;
	this.stopImmediatePropagation;
  }

  toJSON() {
    return { type: this.type, data: this.data };
  }

  isDefaultPrevented() {
    return this.defaultPrevented;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

class EventListeners {

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

  createList(eventType, priority, target) {
    const priorities = this.getHashByKey(eventType, target, Object);
    return this.getHashByKey(parseInt(priority), priorities, Array);
  }

  getHashByKey(key, target, definition) {
    let value = null;
    if (target.hasOwnProperty(key)) {
      value = target[key];
    } else if (definition) {
      value = target[key] = new definition();
    }
    return value;
  }

  add(eventType, handler, priority) {
    const handlers = this.createList(eventType, priority, this._listeners);
    if (handlers.indexOf(handler) < 0) {
      handlers.push(handler);
    }
  }

  has(eventType) {
    let result = false;
    const priorities = this.getHashByKey(eventType, this._listeners);
    if (priorities) {
      for (let priority in priorities) {
        if (priorities.hasOwnProperty(priority)) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  remove(eventType, handler) {
    const priorities = this.getHashByKey(eventType, this._listeners);
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

  removeAll(eventType) {
    delete this._listeners[eventType];
  }

  call(event, target) {
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
    const priorities = this.getHashByKey(event.type, this._listeners);
    if (priorities) {
      const list = Object.getOwnPropertyNames(priorities).sort((a, b) => (a - b));
      const length = list.length;
      for (let index = 0; index < length; index++) {
        if (_stopped) break;
        const handlers = priorities[list[index]];
        const handlersLength = handlers.length;
        for (let handlersIndex = 0; handlersIndex < handlersLength; handlersIndex++) {
          if (_immediatelyStopped) break;
          let handler = handlers[handlersIndex];
          // FIXME why "handler" sometimes undefined?
          handler && handler.call(target, event);
        }
      }
    }
    delete event.stopPropagation;
    delete event.stopImmediatePropagation;
  }
}

const LISTENERS_FIELD = SymbolImpl('event.dispatcher::listeners');
const PREPROCESSOR_FIELD = SymbolImpl('event.dispatcher::preprocessor');

export class EventDispatcher {

  constructor(eventPreprocessor, noInit = false) {
    if (!noInit) {
      this.initialize(eventPreprocessor);
    }
  }

  /**
   * @private
   */
  initialize(eventPreprocessor) {
	this[PREPROCESSOR_FIELD] = eventPreprocessor;
    this[LISTENERS_FIELD] = new EventListeners();
  }

  addEventListener(eventType, listener, priority) {
    this[LISTENERS_FIELD].add(eventType, listener, -priority || 0);
  }

  hasEventListener(eventType) {
    return this[LISTENERS_FIELD].has(eventType);
  }

  removeEventListener(eventType, listener) {
    this[LISTENERS_FIELD].remove(eventType, listener);
  }

  removeAllEventListeners(eventType) {
    this[LISTENERS_FIELD].removeAll(eventType);
  }

  dispatchEvent(event, data) {
    var eventObject = EventDispatcher.getEvent(event, data);
    if (this[PREPROCESSOR_FIELD]) {
      eventObject = this[PREPROCESSOR_FIELD].call(this, eventObject);
    }
    this[LISTENERS_FIELD].call(eventObject);
  }

  static isObject(value) {
    return (typeof value === 'object') && (value !== null);
  }

  static getEvent(eventOrType, optionalData) {
    let event = eventOrType;
    if (!EventDispatcher.isObject(eventOrType)) {
      event = new EventDispatcher.Event(String(eventOrType), optionalData);
    }
    return event;
  }

  static create(eventPreprocessor) {
    return new EventDispatcher(eventPreprocessor);
  }
}

EventDispatcher.Event = Event;

export default EventDispatcher;
