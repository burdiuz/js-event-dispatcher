export type EventObject = {
  type: string;
  data?: unknown;
};

export type DispatchedEvent = EventObject & {
  stopPropagation: () => void;
  stopImmediatePropagation: () => void;
};

export type EventType = string | EventObject;

export type EventListener = (event: DispatchedEvent) => void;

export type EventProcessor = (event: EventObject) => EventObject;

export interface IEventDispatcher {
  addEventListener(eventType: string, listener: EventListener, priority?: number): void;
  hasEventListener(eventType: string): boolean;
  removeEventListener(eventType: string, listener: EventListener): void;
  removeAllEventListeners(eventType: string): void;
  dispatchEvent(event: EventType, data?: unknown): void;
}
