# EventDispatcher

[![Build Status](https://travis-ci.org/burdiuz/js-event-dispatcher.svg?branch=master)](https://travis-ci.org/burdiuz/js-event-dispatcher)
[![Coverage Status](https://coveralls.io/repos/github/burdiuz/js-event-dispatcher/badge.svg?branch=master)](https://coveralls.io/github/burdiuz/js-event-dispatcher?branch=master)

Just another EventDispatcher/[EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) implementation.

## Installation
`Note: Version 1.0.5 dropped bower support`  

Easy to install with [npm](https://www.npmjs.com/) package manager, by adding this repository to dependencies
```javascript
"dependencies": {
  "event-dispatcher": "git://github.com/burdiuz/js-event-dispatcher.git"
}
```

## Usage
`Note: In browser you have to use EventDispatcher.default path to get access to EventDispatcher class, because its exported as ES2015 module`  

EventDispatcher distribution package is wrapped into UMD wrapper, so it can be used with any AMD module loader, nodejs `require()` or without any.
To start using EventDispatcher, just instantiate it on its own
```javascript
class MyClass {
  constructor() {
    this._dispatcher = new EventDispatcher();
  }
  addListener(handler) {
    this._dispatcher.addEventListener('didSomething', handler);
  }
  doSomething() {
	  this._dispatcher.dispatchEvent('didSomething');
  }
}
```
extend it with your class
```javascript
class MyClass extends EventDispatcher {
  doSomething() {
    this.dispatchEvent('didSomething');
  }
}
```
After instantiating `MyClass`, every call of `doSomething()` will fire event `didSomething` and every listener attached to this event will be called with event object as argument.
```javascript
var myObj = new MyClass();
myObj.addEventListener('didSomething', function(event) {
  console.log('My Listener', event.type);
});
myObj.doSomething();
```
When adding listeners they will be executed in same order as they where added. To change order you can use optional `priority` argument to `addEventListener()` method.
```javascript
myObj.addEventListener('didSomething', function(event) {
  console.log('Prioritized Listener', event.type);
}, 1);
myObj.doSomething();
```
By default priority is set to 0, and you can specify higher priority >0 or lower <0, only integer values are allowed.

To fire event you should use `dispatchEvent()` method, it can be used in three ways:
You can pass only event type string. In this case event object will be created by `EventDispatcher`
```javascript
var dispatcher = new EventDispatcher();
dispatcher.dispatchEvent('eventType');
```
With event type you can specify any data, as second argument, that should be passed with event
```javascript
dispatcher.addEventListener('eventType', function(event) {
  console.log('My Listener', event.type, event.data);
});
dispatcher.dispatchEvent('eventType', {myData: 'something'});
```
Also you can pass event object, it must contain `type:String` property
```javascript
dispatcher.dispatchEvent({type: 'eventType', data: 'data is optional'});
```

If you want full control of events that fire from your EventDispatcher, you can specify event pre-processor function that will be called for each event before it fired. This function should return same or new event object.
```javascript
function eventPreprocessor(event){
  event.data = event.data || {};
  return event;
}
var dispatcher = new EventDispatcher(eventPreprocessor);
dispatcher.dispatchEvent('eventType');
```
`eventPreprocessor()` function will be called with event object and returned object will be used.  
  
Example available in project's `example` folder. To try example first run server
```javascript
npm server
```
And then go to [http://localhost:8081/example/index.html](http://localhost:8081/example/index.html)

## Extending custom classes
If you want to extend your classes with EventDispatcher functionality, I've prepared for this special method `EventDispatcher.createNoInitPrototype()`. Your classes can use its result as prototype.
```javascript
function MyClass(){
  EventDispatcher.apply(this);
}
MyClass.prototype = EventDispatcher.createNoInitPrototype();
MyClass.prototype.constructor = MyClass;

var instance = new MyClass();
console.log(instance instanceof EventDispatcher); // true
```
Instances of MyClass will be instances of EventDispatcher and each will have own listeners collection.
  
## API

### EventDispatcher
* **addEventListener**(eventType:String, listener:Function, priority:int=0):void - Add listener to event type. Additionally priority can be set, higher values allow call listeners before others, lower -- after. Same listener can be added to event type using different priorities. By default, 0. 
* **hasEventListener**(eventType:String):void - Check if listener was added to event type. 
* **removeEventListener**(eventType:String, listener:Function):void - Remove event listener from event of specified type.
* **removeAllEventListeners**(eventType:String):void - Remove all listeners from event of specified type.
* **dispatchEvent**(eventType:String, data:Object=null):void - Dispatch event of `eventType` and pass `data`. Will create object of built-in class Event and pass it as first argument  to listeners.
* **dispatchEvent**(event:Object):void - Event object that should be fired, can be any object. Only requirement -- it must contain field `type` with event type.

EventDispatcher constructor accepts optional argument `eventPreprocessor(event:Object):Object`, function that receive event object as argument and should return same or new/changed event object that will be passed to event listeners.    

### Event
Built-in class to represent dispatched event.
Objects of Event class are used when dispatchEvent() method is called with `eventType`. 
* **type**:String - Event type.
* **data**:Object - Data object passed to `EventDispatcher.dispatchEvent()` method.
* **preventDefault**():void - Will change "prevented" flag from FALSE to TRUE, it can be requested via `isDefaultPrevented()` method.
* **isDefaultPrevented**():Boolean - Will return TRUE if `preventDefault()` was called.

Any event(instance of built-in Event class or any other object passed as event) gains additional methods when its being dispatched. After cycle finished, these methods will be removed from event object.
* **stopPropagation**():void - Stop event propagation after processing all listeners of same priority.
* **stopImmediatePropagation**():void - Stop event propagation on current listener.  
  
  
> Written with [StackEdit](https://stackedit.io/).
