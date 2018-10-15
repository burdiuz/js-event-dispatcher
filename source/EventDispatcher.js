/**
 * Created by Oleg Galaburda on 09.02.16.
 * @flow
 */
import { Event, getEvent } from './Event';
import { EventListeners } from './EventListeners';

import type { EventType, EventListener, EventProcessor, IEventDispatcher } from './TypeDefinition';

class EventDispatcher implements IEventDispatcher {
  _listeners: EventListeners;

  _eventPreprocessor: ?EventProcessor;

  constructor(eventPreprocessor: ?EventProcessor = null) {
    this._eventPreprocessor = eventPreprocessor;
    this._listeners = new EventListeners();
  }

  addEventListener(eventType: string, listener: EventListener, priority?: number = 0) {
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

  dispatchEvent(event: EventType, data: ?mixed) {
    let eventObject = getEvent(event, data);
    if (this._eventPreprocessor) {
      eventObject = this._eventPreprocessor.call(this, eventObject);
    }
    this._listeners.call(eventObject);
  }

  static create(eventPreprocessor: EventProcessor) {
    return new EventDispatcher(eventPreprocessor);
  }

  static Event: Class<Event> = Event; // eslint-disable-line
}

export default EventDispatcher;
