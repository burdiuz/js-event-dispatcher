# EventDispatcher

[![Build Status](https://travis-ci.org/burdiuz/js-event-dispatcher.svg?branch=master)](https://travis-ci.org/burdiuz/js-event-dispatcher)
[![Coverage Status](https://coveralls.io/repos/github/burdiuz/js-event-dispatcher/badge.svg?branch=master)](https://coveralls.io/github/burdiuz/js-event-dispatcher?branch=master)

Just another EventDispatcher/[EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) implementation.

## API
### EventDispatcher
* `addEventListener(eventType:String, listener:Function, priority:int=0):void` -- Add listener to event type. Additionally priority can be set, higher values allow call listeners before others, lower -- after. Same listener can be added to event type using different priorities. By default, 0. 
* `hasEventListener(eventType:String):void` -- Check if listener was added to event type. 
* `removeEventListener(eventType:String, listener:Function):void` -- Remove event listener from event of specified type.
* `removeAllEventListeners(eventType:String):void` -- Remoe all listeners from event of specified type.
* `dispatchEvent(eventType:String, data:Object=null):void` -- Dispatch event of `eventType` and pass `data`. Will create object of built-in class Event and pass it as first argument  to listeners.
* `dispatchEvent(event:Object):void` -- Event object that should be fired, can be any object. Only requirement -- it must contain field `type` with event type.


### Event
Built-in class to represent dispatched event.
Objects of Event class are used when dispatchEvent() method is called with `eventType`. 
* `type:String` -- Event type.
* `data:Object` -- Data object passed to `EventDispatcher.dispatchEvent()` method.
* `preventDefault():void` -- Will change "prevented" flag from FALSE to TRUE, it can be requested via isDefaultPrevented() method.
* `isDefaultPrevented():Boolean` -- Will return TRUE if `preventDefault()` was called.

Any event(instance of built-in Event class or any other object passed as event) gains additional methods when its being dispatched. After cycle finished, these methods will be removed from event object.
* `stopPropagation():void` -- Stop event propagation after processing all listeners of same priority.
* `stopImmediatePropagation():void` -- Stop event propagation on current listener.
