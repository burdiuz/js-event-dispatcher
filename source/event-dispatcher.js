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
        value: data || null,
        enumerable: true
      }
    });
    this.preventDefault = preventDefault;
    this.isDefaultPrevented = isDefaultPrevented;
  }

  Event.prototype.toJSON = toJSON;

  return Event;
})();

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
     * Three ways to implement this
     * 1. As its now -- just assign and delete after event cycle finished
     * 2. Use EventDispatcher.setupOptional()
     * 3. In this method create function StoppableEvent that will extend from this event and add these functions,
     *    then instantiate it for this one cycle.
     */
    event.stopPropagation = stopPropagation;
    event.stopImmediatePropagation = stopImmediatePropagation;
    /*
     var rmStopPropagation = EventDispatcher.setupOptional(event, 'stopPropagation', stopPropagation);
     var rmStopImmediatePropagation = EventDispatcher.setupOptional(event, 'stopImmediatePropagation', stopImmediatePropagation);
     */
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
    delete event.stopPropagation;
    delete event.stopImmediatePropagation;
    /*
     rmStopPropagation();
     rmStopImmediatePropagation();
     */
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

var EVENTDISPATCHER_NOINIT = {};

/**
 *
 * @param eventPreprocessor {?Function}
 * @constructor
 */
var EventDispatcher = (function() {

  var LISTENERS_FIELD = Symbol('event.dispatcher::listeners');

  var PREPROCESSOR_FIELD = Symbol('event.dispatcher::preprocessor');

  function EventDispatcher(eventPreprocessor) {
    if (eventPreprocessor === EVENTDISPATCHER_NOINIT) {
      // create noinit prototype
      return;
    }
    /**
     * @type {EventListeners}
     */
    Object.defineProperty(this, LISTENERS_FIELD, {
      value: new EventListeners()
    });
    Object.defineProperty(this, PREPROCESSOR_FIELD, {
      value: eventPreprocessor
    });
  }


  function _addEventListener(eventType, listener, priority) {
    this[LISTENERS_FIELD].add(eventType, listener, -priority || 0);
  }

  function _hasEventListener(eventType) {
    return this[LISTENERS_FIELD].has(eventType);
  }

  function _removeEventListener(eventType, listener) {
    this[LISTENERS_FIELD].remove(eventType, listener);
  }

  function _removeAllEventListeners(eventType) {
    this[LISTENERS_FIELD].removeAll(eventType);
  }

  function _dispatchEvent(event, data) {
    var eventObject = EventDispatcher.getEvent(event, data);
    if (this[PREPROCESSOR_FIELD]) {
      eventObject = this[PREPROCESSOR_FIELD].call(this, eventObject);
    }
    this[LISTENERS_FIELD].call(eventObject);
  }

  EventDispatcher.prototype.addEventListener = _addEventListener;
  EventDispatcher.prototype.hasEventListener = _hasEventListener;
  EventDispatcher.prototype.removeEventListener = _removeEventListener;
  EventDispatcher.prototype.removeAllEventListeners = _removeAllEventListeners;
  EventDispatcher.prototype.dispatchEvent = _dispatchEvent;

  function EventDispatcher_isObject(value) {
    return (typeof value === 'object') && (value !== null);
  }

  function EventDispatcher_getEvent(eventOrType, optionalData) {
    var event = eventOrType;
    if (!EventDispatcher.isObject(eventOrType)) {
      event = new EventDispatcher.Event(String(eventOrType), optionalData);
    }
    return event;
  }

  function EventDispatcher_create(eventPreprocessor) {
    return new EventDispatcher(eventPreprocessor);
  }

  function EventDispatcher_createNoInitPrototype() {
    return new EventDispatcher(EVENTDISPATCHER_NOINIT);
  }

  /*
   function setupOptional(target, name, value) {
   var cleaner = null;
   if (name in target) {
   cleaner = function() {
   };
   } else {
   target[name] = value;
   cleaner = function() {
   delete target[name];
   };
   }
   return cleaner;
   }
   EventDispatcher.setupOptional = setupOptional;
   */

  EventDispatcher.isObject = EventDispatcher_isObject;

  EventDispatcher.getEvent = EventDispatcher_getEvent;
  EventDispatcher.create = EventDispatcher_create;
  EventDispatcher.createNoInitPrototype = EventDispatcher_createNoInitPrototype;
  EventDispatcher.Event = Event;
  return EventDispatcher;
})();
