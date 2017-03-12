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
