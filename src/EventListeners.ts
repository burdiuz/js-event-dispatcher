import { ListenersRunner } from './ListenersRunner';
import type { EventObject, EventListener } from './TypeDefinition';

type EventPrioritiesCollection = {
  [priority: string]: EventListener[];
};

type EventTypesCollection = {
  [eventType: string]: EventPrioritiesCollection;
};

export class EventListeners {
  private _listeners: EventTypesCollection = {};

  private _runners: ListenersRunner[] = [];

  private createList(eventType: string, priority: number): EventListener[] {
    const target = this.getPrioritiesByKey(eventType);
    const key = String(priority);
    if (Object.hasOwn(target, key)) {
      return target[key];
    }
    const value: EventListener[] = [];
    target[key] = value;
    return value;
  }

  private getPrioritiesByKey(key: string): EventPrioritiesCollection {
    if (Object.hasOwn(this._listeners, key)) {
      return this._listeners[key];
    }
    const value: EventPrioritiesCollection = {};
    this._listeners[key] = value;
    return value;
  }

  add(eventType: string, handler: EventListener, priority: number): void {
    const handlers = this.createList(eventType, priority);
    if (handlers.indexOf(handler) < 0) {
      handlers.push(handler);
    }
  }

  has(eventType: string): boolean {
    if (!Object.hasOwn(this._listeners, eventType)) {
      return false;
    }
    return Object.keys(this._listeners[eventType]).length > 0;
  }

  remove(eventType: string, handler: EventListener): void {
    if (!Object.hasOwn(this._listeners, eventType)) {
      return;
    }
    const priorities = this._listeners[eventType];
    const list = Object.getOwnPropertyNames(priorities);
    for (const priority of list) {
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

  removeAll(eventType: string): void {
    delete this._listeners[eventType];
  }

  private createRunner(handlers: EventListener[], onStopped: () => void): ListenersRunner {
    const runner = new ListenersRunner(handlers, onStopped, this.removeRunner);
    this._runners.push(runner);
    return runner;
  }

  private removeRunner = (runner: ListenersRunner): void => {
    this._runners.splice(this._runners.indexOf(runner), 1);
  };

  call(event: EventObject, target?: unknown): void {
    if (!Object.hasOwn(this._listeners, event.type)) {
      return;
    }
    const priorities = this._listeners[event.type];
    let stopped = false;
    const stopPropagation = () => {
      stopped = true;
    };
    const list = Object.getOwnPropertyNames(priorities).sort((a, b) => Number(a) - Number(b));
    for (const key of list) {
      if (stopped) break;
      const handlers = priorities[key];
      if (handlers) {
        const runner = this.createRunner(handlers, stopPropagation);
        runner.run(event, target);
        if (runner.immediatelyStopped) break;
      }
    }
  }
}

export default EventListeners;
