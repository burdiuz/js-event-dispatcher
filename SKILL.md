---
name: event-dispatcher
description: How to use @actualwave/event-dispatcher — a TypeScript EventDispatcher/EventTarget implementation. Use when working in projects that depend on this package, when adding event-based communication to JavaScript/TypeScript classes, or when a user asks about dispatching events, adding/removing listeners, or event propagation with this library.
license: MIT
metadata:
  package: "@actualwave/event-dispatcher"
  version: "1.3.1"
  repository: https://github.com/burdiuz/js-event-dispatcher
---

# @actualwave/event-dispatcher

A TypeScript EventDispatcher/EventTarget implementation for adding custom event support to classes.

## Installation

```bash
npm install @actualwave/event-dispatcher
# or
yarn add @actualwave/event-dispatcher
```

## Core concepts

- `EventDispatcher` — main class; can be instantiated standalone or extended
- `Event` — built-in event class with `type`, `data`, `preventDefault()`, `isDefaultPrevented()`
- Listeners receive a `DispatchedEvent` (event object augmented with `stopPropagation()` and `stopImmediatePropagation()` during dispatch; those methods are removed after the dispatch cycle completes)
- Listener execution order is controlled by `priority` (higher = earlier)

## Usage patterns

### 1. Standalone (composition)

```typescript
import EventDispatcher from '@actualwave/event-dispatcher';

class MyClass {
  private _dispatcher = new EventDispatcher();

  addListener(handler: (e: DispatchedEvent) => void) {
    this._dispatcher.addEventListener('didSomething', handler);
  }

  doSomething() {
    this._dispatcher.dispatchEvent('didSomething');
  }
}
```

### 2. Inheritance

```typescript
import EventDispatcher from '@actualwave/event-dispatcher';

class MyClass extends EventDispatcher {
  doSomething() {
    this.dispatchEvent('didSomething', { payload: 42 });
  }
}

const obj = new MyClass();
obj.addEventListener('didSomething', (event) => {
  console.log(event.type, event.data); // "didSomething" { payload: 42 }
});
obj.doSomething();
```

### 3. Factory function

```typescript
import { createEventDispatcher } from '@actualwave/event-dispatcher';

const dispatcher = createEventDispatcher();
dispatcher.addEventListener('change', handler);
dispatcher.dispatchEvent('change', newValue);
```

## Dispatching events

Three forms are accepted by `dispatchEvent()`:

```typescript
// 1. Type string only — EventDispatcher creates an Event internally
dispatcher.dispatchEvent('eventType');

// 2. Type string + data — data is attached to event.data
dispatcher.dispatchEvent('eventType', { myData: 'something' });

// 3. Pre-built event object — must have a `type` property
dispatcher.dispatchEvent({ type: 'eventType', data: 'optional' });
```

## Listener priority

```typescript
// Default priority is 0. Higher values fire first, lower values fire last.
dispatcher.addEventListener('click', handlerA);        // priority 0
dispatcher.addEventListener('click', handlerB, 1);     // fires before handlerA
dispatcher.addEventListener('click', handlerC, -1);    // fires after handlerA

// Same listener can be registered at multiple priorities
dispatcher.addEventListener('click', handlerA, 2);
```

## Stopping propagation

These methods are available on the event object only during the dispatch cycle:

```typescript
dispatcher.addEventListener('click', (event) => {
  event.stopPropagation();          // stops after all listeners at current priority
  event.stopImmediatePropagation(); // stops immediately, skips remaining listeners
});
```

## Preventing default

```typescript
dispatcher.addEventListener('submit', (event) => {
  event.preventDefault();
});

dispatcher.addEventListener('submit', (event) => {
  if (event.isDefaultPrevented()) {
    // skip default action
  }
});
```

## Event preprocessor

Pass a function to the constructor to transform every event before it reaches listeners:

```typescript
import EventDispatcher from '@actualwave/event-dispatcher';
import type { EventProcessor } from '@actualwave/event-dispatcher';

const preprocessor: EventProcessor = (event) => {
  event.data = { ...((event.data as object) ?? {}), timestamp: Date.now() };
  return event; // must return the event object
};

const dispatcher = new EventDispatcher(preprocessor);
dispatcher.dispatchEvent('action'); // listeners receive event with data.timestamp set
```

## Removing listeners

```typescript
dispatcher.removeEventListener('click', handler);       // remove one listener
dispatcher.removeAllEventListeners('click');             // remove all for a type
```

## Checking for listeners

```typescript
if (dispatcher.hasEventListener('click')) {
  // at least one listener is registered for 'click'
}
```

## Extending the Event class

`Event` is designed to be subclassed. Override `toJSON()` to control serialisation when the event crosses a `MessagePort` or `postMessage` boundary:

```typescript
import { Event } from '@actualwave/event-dispatcher';

class CustomEvent extends Event {
  constructor(
    type: string,
    public readonly source: string,
    data?: unknown,
  ) {
    super(type, data);
  }

  toJSON() {
    return { ...super.toJSON(), source: this.source };
  }
}
```

`Event.toJSON()` returns `{ type, data }` by default. The `defaultPrevented` boolean and any subclass-specific properties are **not** included automatically — add them in your override if they need to survive serialisation.

## Additional exports

```typescript
import {
  Event,      // base event class — extend this for custom event types
  getEvent,   // (eventOrType: EventType, data?: unknown) => EventObject
              //   normalises a string or EventObject into a plain EventObject
  isObject,   // (value: unknown) => value is object — utility re-exported from the package
} from '@actualwave/event-dispatcher';
```

## TypeScript types

```typescript
import type {
  EventObject,       // { type: string; data?: unknown }
  DispatchedEvent,   // EventObject + stopPropagation + stopImmediatePropagation
  EventType,         // string | EventObject
  EventListener,     // (event: DispatchedEvent) => void
  EventProcessor,    // (event: EventObject) => EventObject
  IEventDispatcher,  // interface with the 5 public methods
} from '@actualwave/event-dispatcher';
```

Use `IEventDispatcher` to type variables or parameters that should accept any compatible dispatcher without coupling to the concrete class.

**`DispatchedEvent` vs `Event`**: `DispatchedEvent` extends `EventObject` (plain `{ type, data }`) with `stopPropagation` and `stopImmediatePropagation`. It does **not** include `preventDefault` or `isDefaultPrevented` — those live on the `Event` class itself. If a listener needs to call `preventDefault`, type the parameter as `Event` (or a subclass) rather than `DispatchedEvent`.

## Common edge cases

- `stopPropagation()` and `stopImmediatePropagation()` exist **only during dispatch** — do not store a reference to call them later.
- `preventDefault()` and `isDefaultPrevented()` are on the `Event` class, not on the `DispatchedEvent` type. Listeners typed as `(e: DispatchedEvent) => void` cannot call `preventDefault` without a cast.
- `Event.defaultPrevented` is a public `boolean` property — read it directly if you need to check after dispatch completes.
- Priority accepts any integer (positive, zero, or negative). Non-integer values are treated as 0.
- Passing an object event to `dispatchEvent()` bypasses the `Event` constructor — the object is used as-is (after preprocessing).
- The same listener function added at **different** priorities creates **separate** registrations; `removeEventListener` removes only the registration matching both listener reference and event type (not priority-specific).
