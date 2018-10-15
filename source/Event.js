/**
 * Created by Oleg Galaburda on 09.02.16.
 * @flow
 */
import { isObject } from './utils';
import type { EventType, EventObject, IEvent } from './TypeDefinition';

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

export const getEvent = (eventOrType: EventType, optionalData: mixed): EventObject => {
  let event = eventOrType;
  if (!isObject(eventOrType)) {
    event = new Event(String(eventOrType), optionalData);
  }
  return (event: any);
};

export default Event;
