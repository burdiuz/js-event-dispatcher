/**
 * Created by Oleg Galaburda on 09.02.16.
 * @flow
 */
import hasOwn from '@actualwave/has-own';

import { ListenersRunner } from './ListenersRunner';

import type { EventObject, EventListener } from './TypeDefinition';

type EventPrioritiesCollection = {
  [priority: string]: Array<EventListener>,
};

type EventTypesCollection = {
  [eventType: string]: EventPrioritiesCollection,
};

export class EventListeners {
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
    if (hasOwn(target, key)) {
      value = target[key];
    } else {
      value = [];
      target[key] = value;
    }
    return value;
  }

  getPrioritiesByKey(key: string): EventPrioritiesCollection {
    let value: EventPrioritiesCollection;
    if (hasOwn(this._listeners, key)) {
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
        if (hasOwn(priorities, priority)) {
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
      const list: string[] = Object.getOwnPropertyNames(priorities).sort((a: any, b: any) => a - b);
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

export default EventListeners;
