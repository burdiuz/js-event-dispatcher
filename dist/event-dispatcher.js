(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EventDispatcher"] = factory();
	else
		root["EventDispatcher"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8081/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Event = undefined;

var _EventDispatcher = __webpack_require__(1);

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _EventDispatcher2.default;
exports.Event = _EventDispatcher.Event;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hasOwnProp = function hasOwnProp(target, name) {
  return Object.prototype.hasOwnProperty.call(target, name);
}; /**
    * Created by Oleg Galaburda on 09.02.16.
    * 
    */

var Event = exports.Event = function () {
  function Event(type) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Event);

    this.type = type;
    this.data = data;
    this.defaultPrevented = false;
  }

  _createClass(Event, [{
    key: 'toJSON',
    value: function toJSON() {
      return { type: this.type, data: this.data };
    }
  }, {
    key: 'isDefaultPrevented',
    value: function isDefaultPrevented() {
      return this.defaultPrevented;
    }
  }, {
    key: 'preventDefault',
    value: function preventDefault() {
      this.defaultPrevented = true;
    }
  }]);

  return Event;
}();

var ListenersRunner = function () {
  function ListenersRunner(listeners, onStopped, onComplete) {
    var _this = this;

    _classCallCheck(this, ListenersRunner);

    this.index = -1;
    this.immediatelyStopped = false;

    this.stopImmediatePropagation = function () {
      _this.immediatelyStopped = true;
    };

    this.listeners = listeners;
    this.onStopped = onStopped;
    this.onComplete = onComplete;
  }

  _createClass(ListenersRunner, [{
    key: 'run',
    value: function run(event, target) {
      var listener = void 0;
      var listeners = this.listeners;

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
  }, {
    key: 'augmentEvent',
    value: function augmentEvent(eventObject) {
      var event = eventObject;
      event.stopPropagation = this.onStopped;
      event.stopImmediatePropagation = this.stopImmediatePropagation;
    }

    /* eslint class-methods-use-this: "off" */

  }, {
    key: 'clearEvent',
    value: function clearEvent(eventObject) {
      var event = eventObject;
      delete event.stopPropagation;
      delete event.stopImmediatePropagation;
    }
  }, {
    key: 'listenerRemoved',
    value: function listenerRemoved(listeners, index) {
      if (listeners === this.listeners && index <= this.index) {
        this.index--;
      }
    }
  }]);

  return ListenersRunner;
}();

var EventListeners = function () {
  function EventListeners() {
    var _this2 = this;

    _classCallCheck(this, EventListeners);

    this._listeners = {};
    this._runners = [];

    this.removeRunner = function (runner) {
      _this2._runners.splice(_this2._runners.indexOf(runner), 1);
    };
  }
  /**
   * key - event Type
   * value - hash of priorities
   *    key - priority
   *    value - list of handlers
   * @type {Object<string, Object.<string, Array<number, Function>>>}
   * @private
   */


  _createClass(EventListeners, [{
    key: 'createList',
    value: function createList(eventType, priorityOpt) {
      var priority = parseInt(priorityOpt, 10);
      var target = this.getPrioritiesByKey(eventType);
      var key = String(priority);
      var value = void 0;
      if (hasOwnProp(target, key)) {
        value = target[key];
      } else {
        value = [];
        target[key] = value;
      }
      return value;
    }
  }, {
    key: 'getPrioritiesByKey',
    value: function getPrioritiesByKey(key) {
      var value = void 0;
      if (hasOwnProp(this._listeners, key)) {
        value = this._listeners[key];
      } else {
        value = {};
        this._listeners[key] = value;
      }
      return value;
    }
  }, {
    key: 'add',
    value: function add(eventType, handler, priority) {
      var handlers = this.createList(eventType, priority);
      if (handlers.indexOf(handler) < 0) {
        handlers.push(handler);
      }
    }
  }, {
    key: 'has',
    value: function has(eventType) {
      var priority = void 0;
      var result = false;
      var priorities = this.getPrioritiesByKey(eventType);
      if (priorities) {
        for (priority in priorities) {
          if (hasOwnProp(priorities, priority)) {
            result = true;
            break;
          }
        }
      }
      return result;
    }
  }, {
    key: 'remove',
    value: function remove(eventType, handler) {
      var _this3 = this;

      var priorities = this.getPrioritiesByKey(eventType);
      if (priorities) {
        var list = Object.getOwnPropertyNames(priorities);
        var length = list.length;

        var _loop = function _loop(index) {
          var priority = list[index];
          var handlers = priorities[priority];
          var handlerIndex = handlers.indexOf(handler);
          if (handlerIndex >= 0) {
            handlers.splice(handlerIndex, 1);
            if (!handlers.length) {
              delete priorities[priority];
            }
            _this3._runners.forEach(function (runner) {
              runner.listenerRemoved(handlers, handlerIndex);
            });
          }
        };

        for (var index = 0; index < length; index++) {
          _loop(index);
        }
      }
    }
  }, {
    key: 'removeAll',
    value: function removeAll(eventType) {
      delete this._listeners[eventType];
    }
  }, {
    key: 'createRunner',
    value: function createRunner(handlers, onStopped) {
      var runner = new ListenersRunner(handlers, onStopped, this.removeRunner);
      this._runners.push(runner);
      return runner;
    }
  }, {
    key: 'call',
    value: function call(event, target) {
      var priorities = this.getPrioritiesByKey(event.type);
      var stopped = false;
      var stopPropagation = function stopPropagation() {
        stopped = true;
      };
      if (priorities) {
        // getOwnPropertyNames() or keys()?
        var list = Object.getOwnPropertyNames(priorities).sort(function (a, b) {
          return a - b;
        });
        var length = list.length;

        for (var index = 0; index < length; index++) {
          if (stopped) break;
          var _handlers = priorities[list[index]];
          // in case if all handlers of priority were removed while event
          // was dispatched and handlers become undefined.
          if (_handlers) {
            var _runner = this.createRunner(_handlers, stopPropagation);
            _runner.run(event, target);
            if (_runner.immediatelyStopped) break;
          }
        }
      }
    }
  }]);

  return EventListeners;
}();

var EventDispatcher = function () {
  function EventDispatcher() {
    var eventPreprocessor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var noInit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, EventDispatcher);

    if (!noInit) {
      this.initialize(eventPreprocessor);
    }
  }

  /**
   * @private
   */


  _createClass(EventDispatcher, [{
    key: 'initialize',
    value: function initialize() {
      var eventPreprocessor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this._eventPreprocessor = eventPreprocessor;
      this._listeners = new EventListeners();
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(eventType, listener) {
      var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      this._listeners.add(eventType, listener, -priority || 0);
    }
  }, {
    key: 'hasEventListener',
    value: function hasEventListener(eventType) {
      return this._listeners.has(eventType);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(eventType, listener) {
      this._listeners.remove(eventType, listener);
    }
  }, {
    key: 'removeAllEventListeners',
    value: function removeAllEventListeners(eventType) {
      this._listeners.removeAll(eventType);
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event, data) {
      var eventObject = EventDispatcher.getEvent(event, data);
      if (this._eventPreprocessor) {
        eventObject = this._eventPreprocessor.call(this, eventObject);
      }
      this._listeners.call(eventObject);
    }
  }], [{
    key: 'isObject',
    value: function isObject(value) {
      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
    }
  }, {
    key: 'getEvent',
    value: function getEvent(eventOrType, optionalData) {
      var event = eventOrType;
      if (!EventDispatcher.isObject(eventOrType)) {
        event = new EventDispatcher.Event(String(eventOrType), optionalData);
      }
      return event;
    }
  }, {
    key: 'create',
    value: function create(eventPreprocessor) {
      return new EventDispatcher(eventPreprocessor);
    }

    /* eslint no-undef: "off" */

  }]);

  return EventDispatcher;
}();

EventDispatcher.Event = Event;

exports.default = EventDispatcher;

/***/ })
/******/ ]);
});
//# sourceMappingURL=event-dispatcher.js.map