/**
 * Created by Oleg Galaburda on 09.02.16.
 */

var Event = (function() {

  function toJSON() {
    return {type: this.type, data: this.data};
  }

  function Event(type, data) {
    var _defaultPrevented = false;

    function isDefaultPrevented() {
      return _defaultPrevented;
    }

    function preventDefault() {
      _defaultPrevented = true;
    }

    Object.defineProperties(this, {
      type: {
        value: type,
        enumerable: true
      },
      data: {
        value: data,
        enumerable: true
      }
    });
    this.preventDefault = preventDefault;
    this.isDefaultPrevented = isDefaultPrevented;
  }

  Event.prototype.toJSON = toJSON;

  return Event;
})();

function isObject(value) {
  return (typeof value === 'object') && (value !== null);
}

var EventListeners = (function() {
  function add(eventType, handler, priority) {
    var handlers = createList(eventType, priority, this._listeners);
    if (handlers.indexOf(handler) < 0) {
      handlers.push(handler);
    }
  }

  function has(eventType) {
    var result = false;
    var priorities = getHashByKey(eventType, this._listeners);
    if (priorities) {
      for (var priority in priorities) {
        if (priorities.hasOwnProperty(priority)) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  function remove(eventType, handler) {
    var priorities = getHashByKey(eventType, this._listeners);
    if (priorities) {
      var list = Object.getOwnPropertyNames(priorities);
      var length = list.length;
      for (var index = 0; index < length; index++) {
        var priority = list[index];
        var handlers = priorities[priority];
        var handlerIndex = handlers.indexOf(handler);
        if (handlerIndex >= 0) {
          handlers.splice(handlerIndex, 1);
          if (!handlers.length) {
            delete priorities[priority];
          }
        }
      }
    }
  }

  function removeAll(eventType) {
    delete this._listeners[eventType];
  }

  function call(event, target) {
    var _stopped = false;
    var _immediatelyStopped = false;

    function stopPropagation() {
      _stopped = true;
    }

    function stopImmediatePropagation() {
      _immediatelyStopped = true;
    }

    /*
     function StoppableEvent() {
     this.stopPropagation = stopPropagation;
     this.stopImmediatePropagation = stopImmediatePropagation;
     }
     StoppableEvent.prototype = event;
     StoppableEvent.prototype.constructor = event.constructor;
     event = new StoppableEvent();
     */

    event.stopPropagation = stopPropagation;
    event.stopImmediatePropagation = stopImmediatePropagation;

    var priorities = getHashByKey(event.type, this._listeners);
    if (priorities) {
      var list = Object.getOwnPropertyNames(priorities).sort(function(a, b) {
        return a - b;
      });
      var length = list.length;
      for (var index = 0; index < length; index++) {
        if (_stopped) break;
        var handlers = priorities[list[index]];
        var handlersLength = handlers.length;
        for (var handlersIndex = 0; handlersIndex < handlersLength; handlersIndex++) {
          if (_immediatelyStopped) break;
          var handler = handlers[handlersIndex];
          handler.call(target, event);
        }
      }
    }
  }

  function createList(eventType, priority, target) {
    var priorities = getHashByKey(eventType, target, Object);
    return getHashByKey(parseInt(priority), priorities, Array);
  }

  function getHashByKey(key, target, definition) {
    var value = null;
    if (target.hasOwnProperty(key)) {
      value = target[key];
    } else if (definition) {
      value = target[key] = new definition();
    }
    return value;
  }

  function EventListeners() {
    /**
     * key - event Type
     * value - hash of priorities
     *    key - priority
     *    value - list of handlers
     * @type {Object<string, Object.<string, Array<number, Function>>>}
     * @private
     */
    this._listeners = {};
  }

  EventListeners.prototype.add = add;
  EventListeners.prototype.has = has;
  EventListeners.prototype.remove = remove;
  EventListeners.prototype.removeAll = removeAll;
  EventListeners.prototype.call = call;

  return EventListeners;
})();

function EventDispatcher() {
  /**
   * @type {EventListeners}
   */
  var _listeners = new EventListeners();

  function addEventListener(eventType, listener, priority) {
    _listeners.add(eventType, listener, -priority);
  }

  function hasEventListener(eventType) {
    return _listeners.has(eventType);
  }

  function removeEventListener(eventType, listener) {
    _listeners.remove(eventType, listener);
  }

  function removeAllEventListeners(eventType) {
    _listeners.removeAll(eventType);
  }

  function dispatchEvent(event, data) {
    _listeners.call(EventDispatcher.getEvent(event, data));
  }

  this.addEventListener = addEventListener;
  this.hasEventListener = hasEventListener;
  this.removeEventListener = removeEventListener;
  this.removeAllEventListeners = removeAllEventListeners;
  this.dispatchEvent = dispatchEvent;
}

function getEvent(eventOrType, optionalData) {
  var event = eventOrType;
  if (!EventDispatcher.isObject(eventOrType)) {
    event = new EventDispatcher.Event(String(eventOrType), optionalData);
  }
  return event;
}

EventDispatcher.isObject = isObject;

EventDispatcher.getEvent = getEvent;
EventDispatcher.Event = Event;
