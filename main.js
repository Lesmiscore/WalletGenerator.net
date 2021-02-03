/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + chunkId + ".main.js"
/******/ 	}
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/init.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@nao20010128nao/void-fetch/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@nao20010128nao/void-fetch/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class VoidResponse {\n  constructor(url) {\n    this.headers = {};\n    this.ok = this.redirected = false;\n    this.status = 404;\n    this.url = url;\n    const self = this;\n    this.arrayBuffer = this.blob = this.formData = this.json = this.text = function() {\n      return Promise.reject(self.error());\n    };\n  }\n  error() {\n    return new Error(\"\");\n  }\n}\n\nmodule.exports = function fetch(url, opts) {\n  return Promise.resolve(new VoidResponse(url));\n};\n\n\n//# sourceURL=webpack:///./node_modules/@nao20010128nao/void-fetch/index.js?");

/***/ }),

/***/ "./node_modules/@nao20010128nao/void-xhr/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@nao20010128nao/void-xhr/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const EventEmitter = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n\nmodule.exports = class XMLHttpRequest extends EventEmitter {\n  constructor() {\n    super();\n    this.addEventListener = this.on;\n\n    const self = this;\n    this.on(\"loadstart\", function(res) {\n      if (self.onloadstart) self.onloadstart(res);\n    });\n    this.on(\"error\", function(res) {\n      if (self.onerror) self.onerror(res);\n    });\n  }\n  abort() {}\n  getAllResponseHeaders() {}\n  getResponseHeader() {}\n  open() {}\n  send() {\n    const self = this;\n    setTimeout(function() {\n      self.emit(\"loadstart\", {\n        type: \"loadstart\",\n        loaded: 0\n      });\n      setTimeout(function() {\n        self.emit(\"error\", {\n          type: \"error\",\n          loaded: 0\n        });\n      }, 0);\n    }, 0);\n  }\n};\n\n\n//# sourceURL=webpack:///./node_modules/@nao20010128nao/void-xhr/index.js?");

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar R = typeof Reflect === 'object' ? Reflect : null\nvar ReflectApply = R && typeof R.apply === 'function'\n  ? R.apply\n  : function ReflectApply(target, receiver, args) {\n    return Function.prototype.apply.call(target, receiver, args);\n  }\n\nvar ReflectOwnKeys\nif (R && typeof R.ownKeys === 'function') {\n  ReflectOwnKeys = R.ownKeys\n} else if (Object.getOwnPropertySymbols) {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target)\n      .concat(Object.getOwnPropertySymbols(target));\n  };\n} else {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target);\n  };\n}\n\nfunction ProcessEmitWarning(warning) {\n  if (console && console.warn) console.warn(warning);\n}\n\nvar NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {\n  return value !== value;\n}\n\nfunction EventEmitter() {\n  EventEmitter.init.call(this);\n}\nmodule.exports = EventEmitter;\nmodule.exports.once = once;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._eventsCount = 0;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nvar defaultMaxListeners = 10;\n\nfunction checkListener(listener) {\n  if (typeof listener !== 'function') {\n    throw new TypeError('The \"listener\" argument must be of type Function. Received type ' + typeof listener);\n  }\n}\n\nObject.defineProperty(EventEmitter, 'defaultMaxListeners', {\n  enumerable: true,\n  get: function() {\n    return defaultMaxListeners;\n  },\n  set: function(arg) {\n    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {\n      throw new RangeError('The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received ' + arg + '.');\n    }\n    defaultMaxListeners = arg;\n  }\n});\n\nEventEmitter.init = function() {\n\n  if (this._events === undefined ||\n      this._events === Object.getPrototypeOf(this)._events) {\n    this._events = Object.create(null);\n    this._eventsCount = 0;\n  }\n\n  this._maxListeners = this._maxListeners || undefined;\n};\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {\n  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {\n    throw new RangeError('The value of \"n\" is out of range. It must be a non-negative number. Received ' + n + '.');\n  }\n  this._maxListeners = n;\n  return this;\n};\n\nfunction _getMaxListeners(that) {\n  if (that._maxListeners === undefined)\n    return EventEmitter.defaultMaxListeners;\n  return that._maxListeners;\n}\n\nEventEmitter.prototype.getMaxListeners = function getMaxListeners() {\n  return _getMaxListeners(this);\n};\n\nEventEmitter.prototype.emit = function emit(type) {\n  var args = [];\n  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);\n  var doError = (type === 'error');\n\n  var events = this._events;\n  if (events !== undefined)\n    doError = (doError && events.error === undefined);\n  else if (!doError)\n    return false;\n\n  // If there is no 'error' event listener then throw.\n  if (doError) {\n    var er;\n    if (args.length > 0)\n      er = args[0];\n    if (er instanceof Error) {\n      // Note: The comments on the `throw` lines are intentional, they show\n      // up in Node's output if this results in an unhandled exception.\n      throw er; // Unhandled 'error' event\n    }\n    // At least give some kind of context to the user\n    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));\n    err.context = er;\n    throw err; // Unhandled 'error' event\n  }\n\n  var handler = events[type];\n\n  if (handler === undefined)\n    return false;\n\n  if (typeof handler === 'function') {\n    ReflectApply(handler, this, args);\n  } else {\n    var len = handler.length;\n    var listeners = arrayClone(handler, len);\n    for (var i = 0; i < len; ++i)\n      ReflectApply(listeners[i], this, args);\n  }\n\n  return true;\n};\n\nfunction _addListener(target, type, listener, prepend) {\n  var m;\n  var events;\n  var existing;\n\n  checkListener(listener);\n\n  events = target._events;\n  if (events === undefined) {\n    events = target._events = Object.create(null);\n    target._eventsCount = 0;\n  } else {\n    // To avoid recursion in the case that type === \"newListener\"! Before\n    // adding it to the listeners, first emit \"newListener\".\n    if (events.newListener !== undefined) {\n      target.emit('newListener', type,\n                  listener.listener ? listener.listener : listener);\n\n      // Re-assign `events` because a newListener handler could have caused the\n      // this._events to be assigned to a new object\n      events = target._events;\n    }\n    existing = events[type];\n  }\n\n  if (existing === undefined) {\n    // Optimize the case of one listener. Don't need the extra array object.\n    existing = events[type] = listener;\n    ++target._eventsCount;\n  } else {\n    if (typeof existing === 'function') {\n      // Adding the second element, need to change to array.\n      existing = events[type] =\n        prepend ? [listener, existing] : [existing, listener];\n      // If we've already got an array, just append.\n    } else if (prepend) {\n      existing.unshift(listener);\n    } else {\n      existing.push(listener);\n    }\n\n    // Check for listener leak\n    m = _getMaxListeners(target);\n    if (m > 0 && existing.length > m && !existing.warned) {\n      existing.warned = true;\n      // No error code for this since it is a Warning\n      // eslint-disable-next-line no-restricted-syntax\n      var w = new Error('Possible EventEmitter memory leak detected. ' +\n                          existing.length + ' ' + String(type) + ' listeners ' +\n                          'added. Use emitter.setMaxListeners() to ' +\n                          'increase limit');\n      w.name = 'MaxListenersExceededWarning';\n      w.emitter = target;\n      w.type = type;\n      w.count = existing.length;\n      ProcessEmitWarning(w);\n    }\n  }\n\n  return target;\n}\n\nEventEmitter.prototype.addListener = function addListener(type, listener) {\n  return _addListener(this, type, listener, false);\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.prependListener =\n    function prependListener(type, listener) {\n      return _addListener(this, type, listener, true);\n    };\n\nfunction onceWrapper() {\n  if (!this.fired) {\n    this.target.removeListener(this.type, this.wrapFn);\n    this.fired = true;\n    if (arguments.length === 0)\n      return this.listener.call(this.target);\n    return this.listener.apply(this.target, arguments);\n  }\n}\n\nfunction _onceWrap(target, type, listener) {\n  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };\n  var wrapped = onceWrapper.bind(state);\n  wrapped.listener = listener;\n  state.wrapFn = wrapped;\n  return wrapped;\n}\n\nEventEmitter.prototype.once = function once(type, listener) {\n  checkListener(listener);\n  this.on(type, _onceWrap(this, type, listener));\n  return this;\n};\n\nEventEmitter.prototype.prependOnceListener =\n    function prependOnceListener(type, listener) {\n      checkListener(listener);\n      this.prependListener(type, _onceWrap(this, type, listener));\n      return this;\n    };\n\n// Emits a 'removeListener' event if and only if the listener was removed.\nEventEmitter.prototype.removeListener =\n    function removeListener(type, listener) {\n      var list, events, position, i, originalListener;\n\n      checkListener(listener);\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      list = events[type];\n      if (list === undefined)\n        return this;\n\n      if (list === listener || list.listener === listener) {\n        if (--this._eventsCount === 0)\n          this._events = Object.create(null);\n        else {\n          delete events[type];\n          if (events.removeListener)\n            this.emit('removeListener', type, list.listener || listener);\n        }\n      } else if (typeof list !== 'function') {\n        position = -1;\n\n        for (i = list.length - 1; i >= 0; i--) {\n          if (list[i] === listener || list[i].listener === listener) {\n            originalListener = list[i].listener;\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0)\n          return this;\n\n        if (position === 0)\n          list.shift();\n        else {\n          spliceOne(list, position);\n        }\n\n        if (list.length === 1)\n          events[type] = list[0];\n\n        if (events.removeListener !== undefined)\n          this.emit('removeListener', type, originalListener || listener);\n      }\n\n      return this;\n    };\n\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\n\nEventEmitter.prototype.removeAllListeners =\n    function removeAllListeners(type) {\n      var listeners, events, i;\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      // not listening for removeListener, no need to emit\n      if (events.removeListener === undefined) {\n        if (arguments.length === 0) {\n          this._events = Object.create(null);\n          this._eventsCount = 0;\n        } else if (events[type] !== undefined) {\n          if (--this._eventsCount === 0)\n            this._events = Object.create(null);\n          else\n            delete events[type];\n        }\n        return this;\n      }\n\n      // emit removeListener for all listeners on all events\n      if (arguments.length === 0) {\n        var keys = Object.keys(events);\n        var key;\n        for (i = 0; i < keys.length; ++i) {\n          key = keys[i];\n          if (key === 'removeListener') continue;\n          this.removeAllListeners(key);\n        }\n        this.removeAllListeners('removeListener');\n        this._events = Object.create(null);\n        this._eventsCount = 0;\n        return this;\n      }\n\n      listeners = events[type];\n\n      if (typeof listeners === 'function') {\n        this.removeListener(type, listeners);\n      } else if (listeners !== undefined) {\n        // LIFO order\n        for (i = listeners.length - 1; i >= 0; i--) {\n          this.removeListener(type, listeners[i]);\n        }\n      }\n\n      return this;\n    };\n\nfunction _listeners(target, type, unwrap) {\n  var events = target._events;\n\n  if (events === undefined)\n    return [];\n\n  var evlistener = events[type];\n  if (evlistener === undefined)\n    return [];\n\n  if (typeof evlistener === 'function')\n    return unwrap ? [evlistener.listener || evlistener] : [evlistener];\n\n  return unwrap ?\n    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);\n}\n\nEventEmitter.prototype.listeners = function listeners(type) {\n  return _listeners(this, type, true);\n};\n\nEventEmitter.prototype.rawListeners = function rawListeners(type) {\n  return _listeners(this, type, false);\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  if (typeof emitter.listenerCount === 'function') {\n    return emitter.listenerCount(type);\n  } else {\n    return listenerCount.call(emitter, type);\n  }\n};\n\nEventEmitter.prototype.listenerCount = listenerCount;\nfunction listenerCount(type) {\n  var events = this._events;\n\n  if (events !== undefined) {\n    var evlistener = events[type];\n\n    if (typeof evlistener === 'function') {\n      return 1;\n    } else if (evlistener !== undefined) {\n      return evlistener.length;\n    }\n  }\n\n  return 0;\n}\n\nEventEmitter.prototype.eventNames = function eventNames() {\n  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];\n};\n\nfunction arrayClone(arr, n) {\n  var copy = new Array(n);\n  for (var i = 0; i < n; ++i)\n    copy[i] = arr[i];\n  return copy;\n}\n\nfunction spliceOne(list, index) {\n  for (; index + 1 < list.length; index++)\n    list[index] = list[index + 1];\n  list.pop();\n}\n\nfunction unwrapListeners(arr) {\n  var ret = new Array(arr.length);\n  for (var i = 0; i < ret.length; ++i) {\n    ret[i] = arr[i].listener || arr[i];\n  }\n  return ret;\n}\n\nfunction once(emitter, name) {\n  return new Promise(function (resolve, reject) {\n    function eventListener() {\n      if (errorListener !== undefined) {\n        emitter.removeListener('error', errorListener);\n      }\n      resolve([].slice.call(arguments));\n    };\n    var errorListener;\n\n    // Adding an error listener is not optional because\n    // if an error is thrown on an event emitter we cannot\n    // guarantee that the actual event we are waiting will\n    // be fired. The result could be a silent way to create\n    // memory or file descriptor leaks, which is something\n    // we should avoid.\n    if (name !== 'error') {\n      errorListener = function errorListener(err) {\n        emitter.removeListener(name, eventListener);\n        reject(err);\n      };\n\n      emitter.once('error', errorListener);\n    }\n\n    emitter.once(name, eventListener);\n  });\n}\n\n\n//# sourceURL=webpack:///./node_modules/events/events.js?");

/***/ }),

/***/ "./src/init.js":
/*!*********************!*\
  !*** ./src/init.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* global BEGIN_AFTER_ONLOAD */\n// say goodbye to XHR and fetch\nwindow.XMLHttpRequest = __webpack_require__(/*! @nao20010128nao/void-xhr */ \"./node_modules/@nao20010128nao/void-xhr/index.js\");\nwindow.fetch = __webpack_require__(/*! @nao20010128nao/void-fetch */ \"./node_modules/@nao20010128nao/void-fetch/index.js\");\nPromise.resolve().then(() =>  false ? undefined : Promise.resolve()).then(() => __webpack_require__.e(/*! import() */ 53).then(__webpack_require__.bind(null, /*! ./main.styl */ \"./src/main.styl\"))).then(() => __webpack_require__.e(/*! import() */ 43).then(__webpack_require__.t.bind(null, /*! ./autogen/images */ \"./src/autogen/images.js\", 7))).then(images => {\n  //document.getElementById(\"coinLogoImg\").setAttribute(\"src\", coindex[\"logos/bitcoin\"]());\n  document.getElementById(\"siteTitle\").setAttribute(\"src\", images[\"banner\"]());\n  document.getElementById(\"foldingInstructions\").setAttribute(\"src\", images[\"foldinginstructions\"]());\n  document.getElementById(\"frontPageImage\").setAttribute(\"src\", images[\"overview\"]());\n}).then(() => __webpack_require__.e(/*! import() */ 67).then(__webpack_require__.t.bind(null, /*! ./handlers.js */ \"./src/handlers.js\", 7))).then(() => __webpack_require__.e(/*! import() */ 69).then(__webpack_require__.t.bind(null, /*! ./ninja.onload.js */ \"./src/ninja.onload.js\", 7))).then(() => document.getElementById(\"loadcover\").remove()).catch(err => {\n  document.getElementById(\"message1\").textContent = \"Error has occured while loading\";\n  document.getElementById(\"message2\").innerHTML = (\"\" + (err.stack ? err.stack : err)).replace(/\\n/g, \"<br />\");\n  console.error(err);\n});\n\n//# sourceURL=webpack:///./src/init.js?");

/***/ })

/******/ });