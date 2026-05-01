import type { EventObject, DispatchedEvent, EventListener } from './TypeDefinition';

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

  run(event: EventObject): void {
    const dispatched = event as DispatchedEvent;
    dispatched.stopPropagation = this.onStopped;
    dispatched.stopImmediatePropagation = this.stopImmediatePropagation;
    for (this.index = 0; this.index < this.listeners.length; this.index++) {
      if (this.immediatelyStopped) break;
      this.listeners[this.index](dispatched);
    }
    delete (event as Partial<DispatchedEvent>).stopPropagation;
    delete (event as Partial<DispatchedEvent>).stopImmediatePropagation;
    this.onComplete(this);
  }

  listenerRemoved(listeners: EventListener[], index: number): void {
    if (listeners === this.listeners && index <= this.index) {
      this.index--;
    }
  }
}

export default ListenersRunner;
