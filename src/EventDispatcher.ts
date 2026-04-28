import { getEvent } from './Event';
import { EventListeners } from './EventListeners';
import type { EventType, EventListener, EventProcessor, IEventDispatcher } from './TypeDefinition';

class EventDispatcher implements IEventDispatcher {
  private _listeners: EventListeners;

  private _eventPreprocessor: EventProcessor | null;

  constructor(eventPreprocessor: EventProcessor | null = null) {
    this._eventPreprocessor = eventPreprocessor;
    this._listeners = new EventListeners();
  }

  addEventListener(eventType: string, listener: EventListener, priority = 0): void {
    this._listeners.add(eventType, listener, -priority || 0);
  }

  hasEventListener(eventType: string): boolean {
    return this._listeners.has(eventType);
  }

  removeEventListener(eventType: string, listener: EventListener): void {
    this._listeners.remove(eventType, listener);
  }

  removeAllEventListeners(eventType: string): void {
    this._listeners.removeAll(eventType);
  }

  dispatchEvent(event: EventType, data?: unknown): void {
    let eventObject = getEvent(event, data);
    if (this._eventPreprocessor) {
      eventObject = this._eventPreprocessor.call(this, eventObject);
    }
    this._listeners.call(eventObject);
  }
}

export const createEventDispatcher = (eventPreprocessor?: EventProcessor): EventDispatcher =>
  new EventDispatcher(eventPreprocessor ?? null);

export default EventDispatcher;
