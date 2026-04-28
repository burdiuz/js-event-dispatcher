import { isObject } from './utils';
import type { EventType, EventObject, IEvent } from './TypeDefinition';

export class Event implements IEvent {
  type: string;

  data: unknown;

  defaultPrevented: boolean;

  stopPropagation?: (() => void) | null;

  stopImmediatePropagation?: (() => void) | null;

  constructor(type: string, data: unknown = null) {
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

  preventDefault(): void {
    this.defaultPrevented = true;
  }
}

export const getEvent = (eventOrType: EventType, optionalData?: unknown): EventObject => {
  if (!isObject(eventOrType)) {
    return new Event(String(eventOrType), optionalData);
  }
  return eventOrType as EventObject;
};

export default Event;
