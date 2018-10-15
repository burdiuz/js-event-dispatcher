/**
 * Created by Oleg Galaburda on 09.02.16.
 * @flow
 */
import type { EventObject, EventListener } from './TypeDefinition';

export class ListenersRunner {
  index: number = -1;

  immediatelyStopped: boolean = false;

  listeners: EventListener[];

  onStopped: (runner: ListenersRunner) => void;

  onComplete: (runner: ListenersRunner) => void;

  constructor(
    listeners: EventListener[],
    onStopped: (runner: ListenersRunner) => void,
    onComplete: (runner: ListenersRunner) => void,
  ) {
    this.listeners = listeners;
    this.onStopped = onStopped;
    this.onComplete = onComplete;
  }

  stopImmediatePropagation = () => {
    this.immediatelyStopped = true;
  };

  run(event: EventObject, target: any) {
    let listener: EventListener;
    const { listeners } = this;
    this.augmentEvent(event);
    // TODO this has to be handled in separate object ListenersRunner that should be
    // created for each call() call and asked for index validation on each listener remove.
    for (this.index = 0; this.index < listeners.length; this.index++) {
      if (this.immediatelyStopped) break;
      listener = listeners[this.index];
      listener.call(target, event);
    }
    this.clearEvent(event);
    this.onComplete(this);
  }

  augmentEvent(eventObject: EventObject) {
    const event: EventObject = eventObject;
    event.stopPropagation = this.onStopped;
    event.stopImmediatePropagation = this.stopImmediatePropagation;
  }

  /* eslint class-methods-use-this: "off" */
  clearEvent(eventObject: EventObject) {
    const event: EventObject = eventObject;
    delete event.stopPropagation;
    delete event.stopImmediatePropagation;
  }

  listenerRemoved(listeners: EventListener[], index: number) {
    if (listeners === this.listeners && index <= this.index) {
      this.index--;
    }
  }
}

export default ListenersRunner;
