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
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventDispatcher = exports.Event = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Oleg Galaburda on 09.02.16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _SymbolImpl = __webpack_require__(1);

var _SymbolImpl2 = _interopRequireDefault(_SymbolImpl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = exports.Event = function () {
  function Event(type, data) {
    _classCallCheck(this, Event);

    this.type = type;
    this.data = data || null;
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
  }, {
    key: 'stopPropagation',
    value: function stopPropagation() {
      // dummy
    }
  }, {
    key: 'stopImmediatePropagation',
    value: function stopImmediatePropagation() {
      // dummy
    }
  }]);

  return Event;
}();

var EventListeners = function () {
  function EventListeners() {
    _classCallCheck(this, EventListeners);

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

  _createClass(EventListeners, [{
    key: 'createList',
    value: function createList(eventType, priority, target) {
      var priorities = this.getHashByKey(eventType, target, Object);
      return this.getHashByKey(parseInt(priority), priorities, Array);
    }
  }, {
    key: 'getHashByKey',
    value: function getHashByKey(key, target, definition) {
      var value = null;
      if (target.hasOwnProperty(key)) {
        value = target[key];
      } else if (definition) {
        value = target[key] = new definition();
      }
      return value;
    }
  }, {
    key: 'add',
    value: function add(eventType, handler, priority) {
      var handlers = this.createList(eventType, priority, this._listeners);
      if (handlers.indexOf(handler) < 0) {
        handlers.push(handler);
      }
    }
  }, {
    key: 'has',
    value: function has(eventType) {
      var result = false;
      var priorities = this.getHashByKey(eventType, this._listeners);
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
  }, {
    key: 'remove',
    value: function remove(eventType, handler) {
      var priorities = this.getHashByKey(eventType, this._listeners);
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
  }, {
    key: 'removeAll',
    value: function removeAll(eventType) {
      delete this._listeners[eventType];
    }
  }, {
    key: 'call',
    value: function call(event, target) {
      var _stopped = false;
      var _immediatelyStopped = false;
      var stopPropagation = function stopPropagation() {
        _stopped = true;
      };
      var stopImmediatePropagation = function stopImmediatePropagation() {
        _immediatelyStopped = true;
      };
      event.stopPropagation = stopPropagation;
      event.stopImmediatePropagation = stopImmediatePropagation;
      var priorities = this.getHashByKey(event.type, this._listeners);
      if (priorities) {
        var list = Object.getOwnPropertyNames(priorities).sort(function (a, b) {
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
            // FIXME why "handler" sometimes undefined?
            handler && handler.call(target, event);
          }
        }
      }
      delete event.stopPropagation;
      delete event.stopImmediatePropagation;
    }
  }]);

  return EventListeners;
}();

var LISTENERS_FIELD = (0, _SymbolImpl2.default)('event.dispatcher::listeners');
var PREPROCESSOR_FIELD = (0, _SymbolImpl2.default)('event.dispatcher::preprocessor');

var EventDispatcher = exports.EventDispatcher = function () {
  function EventDispatcher(eventPreprocessor) {
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
    value: function initialize(eventPreprocessor) {
      this[PREPROCESSOR_FIELD] = eventPreprocessor;
      this[LISTENERS_FIELD] = new EventListeners();
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(eventType, listener, priority) {
      this[LISTENERS_FIELD].add(eventType, listener, -priority || 0);
    }
  }, {
    key: 'hasEventListener',
    value: function hasEventListener(eventType) {
      return this[LISTENERS_FIELD].has(eventType);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(eventType, listener) {
      this[LISTENERS_FIELD].remove(eventType, listener);
    }
  }, {
    key: 'removeAllEventListeners',
    value: function removeAllEventListeners(eventType) {
      this[LISTENERS_FIELD].removeAll(eventType);
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event, data) {
      var eventObject = EventDispatcher.getEvent(event, data);
      if (this[PREPROCESSOR_FIELD]) {
        eventObject = this[PREPROCESSOR_FIELD].call(this, eventObject);
      }
      this[LISTENERS_FIELD].call(eventObject);
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
  }]);

  return EventDispatcher;
}();

EventDispatcher.Event = Event;

exports.default = EventDispatcher;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
		value: true
});
var SymbolImpl = void 0;

if (typeof Symbol === 'undefined') {
		SymbolImpl = function SymbolImpl(value) {
				var symbol = function symbol() {
						return '@@' + value + ':' + Math.random();
				};
				symbol.toString = symbol;
				symbol.valueOf = symbol;
				return symbol;
		};
} else {
		SymbolImpl = Symbol;
}

exports.default = SymbolImpl;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventDispatcher = __webpack_require__(0);

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _EventDispatcher2.default;

/***/ })
/******/ ]);
});