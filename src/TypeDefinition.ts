export type EventObject = {
  type: string;
  data?: unknown;
  stopPropagation?: (() => void) | null;
  stopImmediatePropagation?: (() => void) | null;
};

export interface IEvent {
  type: string;
  data: unknown;
  defaultPrevented: boolean;
  stopPropagation?: (() => void) | null;
  stopImmediatePropagation?: (() => void) | null;
  toJSON(): EventObject;
  isDefaultPrevented(): boolean;
  preventDefault(): void;
}

export type EventType = string | EventObject | IEvent;

export type EventListener = (event?: EventObject) => void;

export type EventProcessor = (event: EventObject) => EventObject;

export interface IEventDispatcher {
  addEventListener(eventType: string, listener: EventListener, priority?: number): void;
  hasEventListener(eventType: string): boolean;
  removeEventListener(eventType: string, listener: EventListener): void;
  removeAllEventListeners(eventType: string): void;
  dispatchEvent(event: EventType, data?: unknown): void;
}
