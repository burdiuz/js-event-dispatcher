import type { EventObject, EventListener } from './TypeDefinition';

export class ListenersRunner {
  index: number = -1;

  immediatelyStopped: boolean = false;

  listeners: EventListener[];

  onStopped: () => void;

  onComplete: (runner: ListenersRunner) => void;

  constructor(
    listeners: EventListener[],
    onStopped: () => void,
    onComplete: (runner: ListenersRunner) => void,
  ) {
    this.listeners = listeners;
    this.onStopped = onStopped;
    this.onComplete = onComplete;
  }

  stopImmediatePropagation = () => {
    this.immediatelyStopped = true;
  };

  run(event: EventObject, target?: unknown): void {
    const { listeners } = this;
    this.augmentEvent(event);
    for (this.index = 0; this.index < listeners.length; this.index++) {
      if (this.immediatelyStopped) break;
      listeners[this.index].call(target, event);
    }
    this.clearEvent(event);
    this.onComplete(this);
  }

  augmentEvent(event: EventObject): void {
    event.stopPropagation = this.onStopped;
    event.stopImmediatePropagation = this.stopImmediatePropagation;
  }

  clearEvent(event: EventObject): void {
    delete event.stopPropagation;
    delete event.stopImmediatePropagation;
  }

  listenerRemoved(listeners: EventListener[], index: number): void {
    if (listeners === this.listeners && index <= this.index) {
      this.index--;
    }
  }
}

export default ListenersRunner;
