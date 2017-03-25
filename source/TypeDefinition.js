/**
 * @flow
 */

export type EventObject = {
  type: string;
  data?: mixed;
  stopPropagation?: ?Function;
  stopImmediatePropagation?: ?Function;
};

export type EventType = string | EventObject;

export type EventListener = (event?: EventObject) => void;

export type EventProcessor = (event: EventObject) => EventObject;

export interface IEvent {
  type: string;
  data: mixed;
  defaultPrevented: boolean;
  stopPropagation: ?() => void;
  stopImmediatePropagation: ?() => void;
  toJSON(): EventObject;
  isDefaultPrevented(): boolean;
  preventDefault(): void;
}

export interface IEventDispatcher {
  addEventListener(eventType: string, listener: EventListener, priority?: number): void;
  hasEventListener(eventType: string): boolean;
  removeEventListener(eventType: string, listener: EventListener): void;
  removeAllEventListeners(eventType: string): void;
  dispatchEvent(event: EventType, data: mixed): void;
}
