'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var hasOwn = _interopDefault(require('@actualwave/has-own'));

/**
 * Created by Oleg Galaburda on 09.02.16.
 *      
 */

class Event {

  constructor(type, data = null) {
    this.type = type;
    this.data = data;
    this.defaultPrevented = false;
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

class ListenersRunner {

  constructor(listeners, onStopped, onComplete) {
    this.index = -1;
    this.immediatelyStopped = false;

    this.stopImmediatePropagation = () => {
      this.immediatelyStopped = true;
    };

    this.listeners = listeners;
    this.onStopped = onStopped;
    this.onComplete = onComplete;
  }

  run(event, target) {
    let listener;
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

  augmentEvent(eventObject) {
    const event = eventObject;
    event.stopPropagation = this.onStopped;
    event.stopImmediatePropagation = this.stopImmediatePropagation;
  }

  /* eslint class-methods-use-this: "off" */
  clearEvent(eventObject) {
    const event = eventObject;
    delete event.stopPropagation;
    delete event.stopImmediatePropagation;
  }

  listenerRemoved(listeners, index) {
    if (listeners === this.listeners && index <= this.index) {
      this.index--;
    }
  }
}

class EventListeners {
  constructor() {
    this._listeners = {};
    this._runners = [];

    this.removeRunner = runner => {
      this._runners.splice(this._runners.indexOf(runner), 1);
    };
  }
  /**
   * key - event Type
   * value - hash of priorities
   *    key - priority
   *    value - list of handlers
   * @type {Object<string, Object.<string, Array<number, Function>>>}
   * @private
   */


  createList(eventType, priorityOpt) {
    const priority = parseInt(priorityOpt, 10);
    const target = this.getPrioritiesByKey(eventType);
    const key = String(priority);
    let value;
    if (hasOwn(target, key)) {
      value = target[key];
    } else {
      value = [];
      target[key] = value;
    }
    return value;
  }

  getPrioritiesByKey(key) {
    let value;
    if (hasOwn(this._listeners, key)) {
      value = this._listeners[key];
    } else {
      value = {};
      this._listeners[key] = value;
    }
    return value;
  }

  add(eventType, handler, priority) {
    const handlers = this.createList(eventType, priority);
    if (handlers.indexOf(handler) < 0) {
      handlers.push(handler);
    }
  }

  has(eventType) {
    let priority;
    let result = false;
    const priorities = this.getPrioritiesByKey(eventType);
    if (priorities) {
      for (priority in priorities) {
        if (hasOwn(priorities, priority)) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  remove(eventType, handler) {
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
          this._runners.forEach(runner => {
            runner.listenerRemoved(handlers, handlerIndex);
          });
        }
      }
    }
  }

  removeAll(eventType) {
    delete this._listeners[eventType];
  }

  createRunner(handlers, onStopped) {
    const runner = new ListenersRunner(handlers, onStopped, this.removeRunner);
    this._runners.push(runner);
    return runner;
  }

  call(event, target) {
    const priorities = this.getPrioritiesByKey(event.type);
    let stopped = false;
    const stopPropagation = () => {
      stopped = true;
    };
    if (priorities) {
      // getOwnPropertyNames() or keys()?
      const list = Object.getOwnPropertyNames(priorities).sort((a, b) => a - b);
      const { length } = list;
      for (let index = 0; index < length; index++) {
        if (stopped) break;
        const handlers = priorities[list[index]];
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

class EventDispatcher {

  constructor(eventPreprocessor = null, noInit = false) {
    if (!noInit) {
      this.initialize(eventPreprocessor);
    }
  }

  /**
   * @private
   */
  initialize(eventPreprocessor = null) {
    this._eventPreprocessor = eventPreprocessor;
    this._listeners = new EventListeners();
  }

  addEventListener(eventType, listener, priority = 0) {
    this._listeners.add(eventType, listener, -priority || 0);
  }

  hasEventListener(eventType) {
    return this._listeners.has(eventType);
  }

  removeEventListener(eventType, listener) {
    this._listeners.remove(eventType, listener);
  }

  removeAllEventListeners(eventType) {
    this._listeners.removeAll(eventType);
  }

  dispatchEvent(event, data) {
    let eventObject = EventDispatcher.getEvent(event, data);
    if (this._eventPreprocessor) {
      eventObject = this._eventPreprocessor.call(this, eventObject);
    }
    this._listeners.call(eventObject);
  }

  static isObject(value) {
    return typeof value === 'object' && value !== null;
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

  /* eslint no-undef: "off" */

}

EventDispatcher.Event = Event;

exports.default = EventDispatcher;
exports.Event = Event;
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=event-dispatcher.js.map
