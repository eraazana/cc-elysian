(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-import-side-effect */
__export(__webpack_require__(1));
__export(__webpack_require__(2));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * =================================
 * PRIMARY CLASS
 * =================================
 * This entire file is a stand alone implementation of the Gw cross origin window messaging system.
 * It's sole purpose is to be used in a cross origin window environment for embedded applications.
 *
 * This Static Class is the only API, and this file relies on no other imports (apart from some TypeScript
 * type definitions, shared with the internal APIs)
 *
 * If the external application plans to support browsers or environments that don't natively support es6 Promise,
 * then it will need a Promise polyfill. GwPromise.ts is one option, and is a stand alone polyfill.
 */
var GwCrossOriginExternal = /** @class */ (function () {
    function GwCrossOriginExternal() {
        throw new Error("Static class. Use GwCrossOriginExternal.init()");
    }
    //==============================================
    //==== INITIALIZATION
    //==============================================
    /**
     * Required Initializer for the GwCrossOriginExternal API.
     * Adds a 'message' event listener to the global window
     * @param {string} originForGwApp - the origin of the window (running the GW Application) that spawned this window
     * @param {Window} forcedOwnerWindow - primarily used for testing and mocking. Replaces all calls to the global window.
     */
    GwCrossOriginExternal.init = function (originForGwApp, allowListedDomains, forcedOwnerWindow) {
        this.ownerWindow = forcedOwnerWindow || window.parent;
        this.allowListedDomains = allowListedDomains;
        this.originForGwApp = originForGwApp;
        this.initialized = true;
        this.messageEventListener = this.receiveMessageFromGwApp.bind(this);
        window.addEventListener("message", this.messageEventListener, false);
    };
    GwCrossOriginExternal.isInitialized = function () {
        return this.initialized;
    };
    /**
     * Disables the API. Removing any setup done in the init method.
     */
    GwCrossOriginExternal.kill = function () {
        this.initialized = false;
        this.originForGwApp = undefined;
        if (this.messageEventListener) {
            this.ownerWindow.removeEventListener("message", this.messageEventListener, false);
            this.messageEventListener = undefined;
        }
    };
    //==============================================
    //==== RECEIVE MESSAGES FROM GW APP
    //==============================================
    GwCrossOriginExternal.throwIfUntrustedOrigin = function (event) {
        if (this.ownerWindow !== event.source || this.originForGwApp !== event.origin) {
            throw new Error("Received untrusted message from origin: " + event.origin);
        }
        if (event.data.gwNonGwOriginIfAny) {
            if (this.allowListedDomains !== "*" && !this.allowListedDomains[event.data.gwNonGwOriginIfAny]) {
                throw new Error("Received message from trusted GW Application origin, but from an originating origin not on the allow list.");
            }
        }
    };
    /**
     * The Primary Router for All Messages Received from the GW Application
     * It is bound the "message" event listener on the parent window.
     *
     * THERE IS NO REASON TO CALL THIS METHOD DIRECTLY
     * @param {GwMessageEvent} event
     */
    GwCrossOriginExternal.receiveMessageFromGwApp = function (event) {
        if (!this.initialized) {
            return;
        }
        this.throwIfUntrustedOrigin(event);
        var data = event.data;
        switch (data.gwMessageType) {
            case 0 /* VALUES */:
                this.receiveValuesMessage(data);
                break;
            case 1 /* RESPONSE_FROM_NON_BLOCKING_SERVER_REQUEST */:
                this.receiveNonBlockingServerRequestReponseMessage(data);
                break;
            case 2 /* CONFIRMATION_ONLY */:
                this.receiveConfirmationOnlyMessage(data);
                break;
            case 3 /* RECEIVE_CROSS_ORIGIN_EVENT */:
                this.receiveCrossOriginEvent(data);
                break;
            case 4 /* RECEIVE_GW_NOTIFICATION */:
                this.receiveGwNotification(data);
                break;
            default:
                this.receiveNonConformingMessageTypeFromGwApp(event);
        }
    };
    /**
     * Helper. Retrieves GwMessageAwaitingResponseInfo while logging errors along the way
     * @param {GwMessageData} data
     * @returns {GwMessageAwaitingResponseInfo<any> | null}
     */
    GwCrossOriginExternal.getAwaitingInfoForCorrespondingMessageData = function (data) {
        var responseToMessageId = data.gwResponseToMessageId;
        if (!responseToMessageId && responseToMessageId !== 0) {
            console.error("Received values payload with no responseToMessageId identifier: ", data);
            return null;
        }
        var info = this.messagesAwaitingResponse[responseToMessageId];
        if (window.GwTestEnv) {
            return info;
        }
        if (!info) {
            console.error("Received values payload with a responseToMessageId: " + responseToMessageId + ". But could not locate a corresponding Promise. Data: ", data);
            return null;
        }
        return info;
    };
    /**
     * Promise Resolver.
     * Takes a GwMessageData object.
     * Locates locally stored promises relating the the message, and fires fulfil or reject based on message status.
     * @param {GwMessageData} data
     */
    GwCrossOriginExternal.receiveMessage = function (data) {
        var payload = data.gwPayload;
        var status = data.gwStatus;
        var info = this.getAwaitingInfoForCorrespondingMessageData(data);
        if (!info) {
            return;
        }
        var callback = (status === 2 /* FAILED */) ? info.reject : info.fulfill;
        if (callback) {
            callback(payload);
        }
    };
    GwCrossOriginExternal.receiveNonBlockingServerRequestReponseMessage = function (data) {
        this.receiveMessage(data);
    };
    GwCrossOriginExternal.receiveValuesMessage = function (data) {
        this.receiveMessage(data);
    };
    GwCrossOriginExternal.receiveConfirmationOnlyMessage = function (data) {
        this.receiveMessage(data);
    };
    GwCrossOriginExternal.receiveCrossOriginEvent = function (data) {
        var ev = data.gwPayload;
        var events = this.crossOriginEventCallbackByBroadcasterThenEvent[ev.broadcasterWindowId];
        if (!events) {
            console.warn("Received cross origin event from a broadcast window not currently being listened to.");
            return;
        }
        var eventListenerCallback = events[ev.eventName] || events["*"];
        if (!eventListenerCallback) {
            console.warn("Received cross origin event for an event type without a registered callback: " + ev.broadcasterWindowId + ":" + ev.eventName);
        }
        eventListenerCallback(ev);
    };
    GwCrossOriginExternal.receiveGwNotification = function (data) {
        var notification = data.gwPayload;
        var callback = this.gwNotificationListeners[notification.type];
        if (callback) {
            callback(notification);
        }
    };
    GwCrossOriginExternal.receiveNonConformingMessageTypeFromGwApp = function (event) {
        var possibleCustomMethodName = this[event.data.gwMessageType];
        if (typeof possibleCustomMethodName === "function") {
            this[possibleCustomMethodName](event);
            return;
        }
        console.warn("--- Received MessageEvent from GwApp without a gwMessageType that matched a method on GwCrossOriginExternal.\n" +
            "--- This is likely an Error.\n" +
            "--- However, receiveNonConformingMessageTypeFromGwApp can be overridden in GwCrossOriginExternal.\n" +
            "--- This allows custom logic based on any MessageEvent that does not implement GwMessageEvent. But consider MessageType.FIRE_CUSTOM_EVENT instead.");
    };
    //==============================================
    //==== SEND MESSAGES TO GW APP
    //==============================================
    /**
     * Private Primary router for all outgoing messages to the Gw Application.
     * @param {GwMessagesToGW} messageType
     * @param payload
     * @param {number | null} responseToMessageId
     * @returns {Promise<any>}
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.sendMessage = function (messageType, payload, responseToMessageId) {
        if (responseToMessageId === void 0) { responseToMessageId = null; }
        if (!this.ownerWindow) {
            return Promise.reject(new Error("Attempting to send a message to a null GwApp window. Ensure that this window was spawned by a Guidwire Application."));
        }
        var messageId = this.nextMessageId++;
        var data = {
            gwMessageType: messageType,
            gwPayload: payload,
            gwStatus: 3 /* PENDING */,
            gwMessageId: messageId,
            gwResponseToMessageId: responseToMessageId
        };
        var messageAwaitingResponse = {
            messageId: messageId,
            timestamp: window.performance.now()
        };
        this.messagesAwaitingResponse[messageId] = messageAwaitingResponse;
        try {
            var promise = new Promise(function (fulfill, reject) {
                messageAwaitingResponse.fulfill = fulfill;
                messageAwaitingResponse.reject = reject;
            });
            this.ownerWindow.postMessage(data, this.originForGwApp);
            return promise;
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    /**
     * Tells the GW Application to update the DOM Elements (for the widgets whose IDs correspond to the logical name mapping), with new values.
     * NOTE: this does not automatically update server values for the elements. Only the values in the DOM in the GW Application.
     * If the Page is in readonly mode, or the user cancels the changes, the changes will be lost.
     *
     * See: GwCrossOriginExternal.fireActionOnServer, or GwCrossOriginExternal.makeNonBlockingServerRequest for direct
     * communication with the Gw Application Server.
     *
     * The returned promise is only for confirmation that the message was successful
     *
     * @param {GwValueMap} logicalNameToValueMap - 'Logical Names' are exposed as a mapping in EmbeddingWidget API.
     * And correspond to a set of widget IDs in a given instance of the EmbeddingWidget. ie:
     * Logical Name: AddressLine1 => WidgetId-page9-panel8-addresssection7-addressline1.
     * Ligical Name: ZipCode => WidgetId-page9-panel8-addresssection7-zipcode.
     * See the PCF fields for EmbeddingWidget
     * @returns {Promise<GwValueMap>}
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.setValues = function (logicalNameToValueMap) {
        return this.sendMessage(0 /* SET_VALUES */, logicalNameToValueMap);
    };
    /**
     * Returns the values of the corresponding widgets as currently represented in the DOM.
     * Note: this returns the values as currently represented in the DOM. These values COULD be different
     * from the persisted server values for any number of reasons: the user modified them locally, client reflection
     * modified them, etc.
     *
     * The returned promise will contain the values when fulfilled
     * @param {string[]} logicalNames - 'Logical Names' are exposed as a mapping in EmbeddingWidget API.
     * And correspond to a set of widget IDs in a given instance of the EmbeddingWidget. ie:
     * Logical Name: AddressLine1 => WidgetId-page9-panel8-addresssection7-addressline1.
     * Ligical Name: ZipCode => WidgetId-page9-panel8-addresssection7-zipcode.
     * See the PCF fields for EmbeddingWidget
     * @returns {Promise<GwValueMap>}
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.getValues = function (logicalNames) {
        return this.sendMessage(1 /* GET_VALUES */, logicalNames);
    };
    /**
     * Calls the Embedded Widget's server side ACTION HANDLER with the given JSON
     * object as its argument. This will cause a full UI refresh.
     *
     * The returned promise is only for confirmation that the message was successful, not the result of the action on the server
     * @param {string} jsonPayload
     * @returns {Promise<any>}
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.fireActionOnServer = function (payload) {
        return this.sendMessage(2 /* FIRE_ACTION */, payload);
    };
    /**
     * Calls the Embedded Widget's server side UPDATE HANDLER with the given object
     * object as its argument. This will not block or refresh the GW Application UI.
     *
     * NOTE: The Promise returned by this method will contain the payload from this request.
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.makeNonBlockingServerRequest = function (payload) {
        return this.sendMessage(3 /* NON_BLOCKING_SERVER_REQUEST */, payload);
    };
    /**
     * Subscribe to another External Cross Origin window's messages.
     * Imagine that the Gw Application has 2 embedded iframe's. The Blue Window, and the Red Window.
     * Blue window can broadcast a custom cross origin event. Let's say "GO_BANANAS". And include some information: {numberOfBananas: 12}
     * Blue window will send that package to the GwApplication via broadcastCrossOriginEvent.
     * Red window will never hear about this message.
     *
     * But if Red Window calls addCrossOriginEventListener, passing "redWindow" and "GO_BANANAS" then the Gw Application
     * will route the message event to the blue window, and call the provided callback function.
     *
     * Like get/set values this function uses logical names, as given to the embedded widget via
     * the EmbeddedWidgetRef element. Though in this case the logical names refer to another
     * embedded widget rather than to an input.
     *
     * NOTE: to receive messages from any other external windows, they must be explicitly allow listed via the
     * GwCrossOriginExternal.init method, either by domain, or by specifying a wildcard domain.
     *
     * The returned promise is only for confirmation that the message was successful
     * @param broadcasterWindowName the logical name of the window you want to listen to
     * @param {string} eventName name of the event, or "*" to listen to any event
     * @param {GwEventInfoCallback} callback
     * @returns {Promise<any>}
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.addCrossOriginEventListener = function (broadcasterWindowName, eventName, callback) {
        var currentlyListenedToEvents = this.crossOriginEventCallbackByBroadcasterThenEvent[broadcasterWindowName] = this.crossOriginEventCallbackByBroadcasterThenEvent[broadcasterWindowName] || {};
        if (currentlyListenedToEvents["*"]) {
            return Promise.reject(new Error("There is already an 'all' listener (`*`) for this broadcaster. Remove it before adding any other listeners: " + broadcasterWindowName + ":" + eventName));
        }
        if (currentlyListenedToEvents[eventName]) {
            return Promise.reject(new Error("Cannot register multiple callbacks for the same broadcaster and event: " + broadcasterWindowName + ":" + eventName));
        }
        if (eventName === "*" && Object.keys(currentlyListenedToEvents).length > 0) {
            console.warn("Adding an 'all' listener of '*' to a broadcaster that already has more specific listener. All specific listeners will be removed. In order to avoid this warning, remove known listeners manually before adding.");
            currentlyListenedToEvents = this.crossOriginEventCallbackByBroadcasterThenEvent[broadcasterWindowName] = {};
        }
        currentlyListenedToEvents[eventName] = callback;
        return this.sendMessage(5 /* ADD_CROSS_ORIGIN_EVENT_LISTENER */, { broadcasterWindowName: broadcasterWindowName, eventName: eventName });
    };
    /**
     * Removes the Cross Origin Event Listener from the GW Application window
     * See GwCrossOriginExternal.addCrossOriginEventListener.
     *
     * Like get/set values this function uses logical names, as given to the embedded widget via
     * the EmbeddedWidgetRef element. Though in this case the logical names refer to another
     * embedded widget rather than to an input.
     *
     * The returned promise is only for confirmation that the message was successful
     * @param broadcasterWindowName the logical name of the window you want to stop listening to
     * @param {string} eventName name of the event, or "*" if registerd to listen to any event
     * @returns {Promise<any>}
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.removeCrossOriginEventListener = function (broadcasterWindowName, eventName) {
        var byBroadcaster = this.crossOriginEventCallbackByBroadcasterThenEvent[broadcasterWindowName];
        if (byBroadcaster) {
            if (eventName === "*") {
                delete this.crossOriginEventCallbackByBroadcasterThenEvent[broadcasterWindowName];
            }
            else {
                delete byBroadcaster[eventName];
            }
        }
        return this.sendMessage(6 /* REMOVE_CROSS_ORIGIN_EVENT_LISTENER */, { broadcasterWindowName: broadcasterWindowName, eventName: eventName });
    };
    /**
     * Broadcasts a Cross Origin Event (Message) to the GW Application client. The GW Application then routes the message event
     * and information package on to any other embedded windows in the application that are listening to the origin and event name.
     * See GwCrossOriginExternal.addCrossOriginEventListener.
     *
     * @param {string} eventName
     * @returns {Promise<any>}
     */
    // tslint:disable-next-line:promise-function-async
    GwCrossOriginExternal.broadcastCrossOriginEvent = function (eventName, info) {
        if (eventName.length === 0 || eventName === "*") {
            return Promise.reject(new Error("Illegal eventName passed to fireCrossOriginEvent. Cannot be empty or the single `*` character: " + eventName));
        }
        return this.sendMessage(4 /* BROADCAST_CROSS_ORIGIN_EVENT */, { eventName: eventName, info: info });
    };
    /**
     * The Gw Application sends 'events' for some predefined client related notifications, such as the Theme Changing, or the Locale changing.
     * There is also a GENERAL category that exists mainly for future proofing. Additional events may be configured in the future.
     * @param {GwNotificationType} notificationType
     * @param {GwNotificationCallback} callback
     */
    GwCrossOriginExternal.addCallbackForGwNotificationType = function (notificationType, callback) {
        if (this.gwNotificationListeners[notificationType]) {
            throw new Error("Attempting to load multiple callbacks for notification type: " + notificationType + ". call removeCallbackBackForGWNotificationType first.");
        }
        else if (this.gwNotificationListeners["*"]) {
            throw new Error("Attempting to load a notification listener when their is already a * listener. New listener: " + notificationType);
        }
        this.gwNotificationListeners[notificationType] = callback;
    };
    /**
     * The Gw Application sends 'events' for some predefined client related notifications, such as the Theme Changing, or the Locale changing.
     * There is also a GENERAL category that exists mainly for future proofing. Additional events may be configured in the future.
     * @param {GwNotificationType} notificationType
     * @param {GwNotificationCallback} callback
     */
    GwCrossOriginExternal.removeCallbackForGwNotificationType = function (notificationType) {
        if (!this.gwNotificationListeners[notificationType]) {
            console.warn("Attempting to remove a non existent notification listener for: " + notificationType);
        }
        delete this.gwNotificationListeners[notificationType];
    };
    GwCrossOriginExternal.nextMessageId = 1000;
    GwCrossOriginExternal.initialized = false;
    GwCrossOriginExternal.messagesAwaitingResponse = {};
    GwCrossOriginExternal.crossOriginEventCallbackByBroadcasterThenEvent = {};
    GwCrossOriginExternal.gwNotificationListeners = {};
    GwCrossOriginExternal.allowListedDomains = {};
    return GwCrossOriginExternal;
}());
exports.GwCrossOriginExternal = GwCrossOriginExternal;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file polyfills Promise on the window, if window.Promise is not of type 'function'
 * It's a stand alone file, without any imports, so can also be easily handed off to the embedded application if needed
 */
var GwPromise = /** @class */ (function () {
    function GwPromise(executor) {
        this.subscriberPackages = [];
        this.result = undefined;
        if (executor) {
            try {
                executor(this.beResolved.bind(this), this.beRejected.bind(this));
            }
            catch (e) {
                this.beRejected(e);
            }
        }
    }
    /**
     * From MDN: The static Promise.reject function returns a Promise that is rejected.
     * For debugging purposes and selective error catching, it is useful to make reason an instanceof Error
     * @param reason
     * @returns {GwPromise}
     */
    GwPromise.reject = function (reason) {
        var promise = new GwPromise(null);
        return promise.beRejected(reason);
    };
    /**
     * From MDN: The Promise.resolve(value) method returns a Promise object that is resolved with the given value.
     * If the value is a promise, that promise is returned; if the value is a thenable (i.e. has a "then" method),
     * the returned promise will "follow" that thenable, adopting its eventual state;
     * otherwise the returned promise will be fulfilled with the value.
     *
     * @param value
     * @returns {GwPromise}
     */
    GwPromise.resolve = function (thenableOrValue) {
        if (thenableOrValue instanceof GwPromise) {
            return thenableOrValue;
        }
        var promise = new GwPromise(null);
        return promise.beResolved(thenableOrValue);
    };
    /**
     * From MDN: The Promise.all(iterable) method returns a single Promise that resolves when all of the promises in the iterable argument have resolved
     * or when the iterable argument contains no promises.
     * It rejects with the reason of the first promise that rejects.
     *
     * Returns
     * - An already resolved Promise if the iterable passed is empty or contains no promises.
     * - A pending Promise in all other cases. This returned promise is then resolved/rejected asynchronously (as soon as the stack is empty)
     *   when all the promises in the given iterable have resolved,
     *   or if any of the promises reject.
     *
     * Returned values will be in order of the Promises passed, regardless of completion order.
     */
    GwPromise.all = function (promises) {
        var _this = this;
        if (promises.length === 0) {
            return GwPromise.resolve([]);
        }
        var results = [];
        var remaining = promises.length;
        var asyncMapperFulfill = function (i, value) {
            if (!returnPromise.isPending()) {
                return;
            }
            results[i] = value;
            remaining--;
            if (remaining === 0) {
                returnPromise.beResolved(results);
            }
        };
        var returnPromise = new GwPromise(function (notused, reject) {
            for (var i = 0; i < promises.length; i++) {
                var thenableOrVal = promises[i];
                if (GwPromise.isThenable(thenableOrVal)) {
                    thenableOrVal.then(asyncMapperFulfill.bind(_this, i), reject);
                }
                else {
                    asyncMapperFulfill(i, thenableOrVal);
                }
            }
        });
        return returnPromise;
    };
    /**
     * From MDN: The Promise.race(iterable) method returns a promise
     * that resolves or rejects as soon as one of the promises in the iterable resolves or rejects,
     * with the value or reason from that promise.
     *
     * If the iterable passed is empty, the promise returned will be forever pending.
     *
     * If the iterable contains one or more non-promise value and/or an already resolved/rejected promise,
     * then Promise.race will resolve to the first of these values found in the iterable.
     *
     * @param {GwPromise[]} promises
     * @returns {GwPromise}
     */
    GwPromise.race = function (promises) {
        var executor = function (resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                var thenableOrValue = promises[i];
                if (GwPromise.isThenable(thenableOrValue)) {
                    thenableOrValue.then(resolve, reject);
                }
                else {
                    resolve(thenableOrValue);
                }
            }
        };
        var returnPromise = new GwPromise(executor);
        return returnPromise;
    };
    /**
     * From MDN: Return A Promise in the pending state.
     * The handler function (onFulfilled or onRejected) then gets called asynchronously (as soon as the stack is empty).
     * After the invocation of the handler function, if the handler function:
     *
     * - returns a value, the promise returned by then gets resolved with the returned value as its value;
     * - throws an error, the promise returned by then gets rejected with the thrown error as its value;
     * - returns an already resolved promise, the promise returned by then gets resolved with that promise's value as its value;
     * - returns an already rejected promise, the promise returned by then gets rejected with that promise's value as its value.
     * - returns another pending promise object, the resolution/rejection of the promise returned by then will be subsequent to the resolution/rejection of the promise returned by the handler.
     *   Also, the value of the promise returned by then will be the same as the value of the promise returned by the handler.
     *
     * @param {GwCallbackOnFulfilled | undefined} onFulfill
     * @param {GwCallbackOnRejected} onReject
     * @returns {GwPromise}
     */
    GwPromise.prototype.then = function (onFulfill, onReject) {
        return this.addSubscriber(false, onFulfill, onReject);
    };
    /**
     * From MDN: The catch() method returns a Promise and deals with rejected cases only.
     * It behaves the same as calling Promise.prototype.then(undefined, onRejected)
     * (in fact, calling obj.catch(onRejected) internally calls obj.then(undefined, onRejected)).
     * @param {GwCallbackOnRejected} onError
     * @returns {GwPromise}
     */
    GwPromise.prototype.catch = function (onError) {
        return this.then(undefined, onError);
    };
    /**
     * From MDN: The finally() method can be useful if you want to do some processing or cleanup once the promise is settled, regardless of its outcome.
     * @param {Function} onFinally
     * @returns {GwPromise}
     */
    GwPromise.prototype.finally = function (onFinally) {
        var callOnFinally = function (val) {
            onFinally();
            return val;
        };
        return this.addSubscriber(true, callOnFinally, callOnFinally);
    };
    GwPromise.prototype.addSubscriber = function (isFinally, onFulfill, onReject) {
        var _this = this;
        var subscriber = new GwPromise(null);
        this.subscriberPackages.push({ subscriber: subscriber, isFinally: isFinally, onFulfill: onFulfill, onReject: onReject });
        if (this.isFulfilled() || this.isRejected()) {
            setTimeout(function () { return _this.notifySubscribers(); });
        }
        return subscriber;
    };
    GwPromise.prototype.notifySubscribers = function () {
        var _this = this;
        var propagateSuccess = this.state !== 2 /* REJECTED */;
        this.subscriberPackages.forEach(function (subscriberPackage) {
            var callback = propagateSuccess ? subscriberPackage.onFulfill : subscriberPackage.onReject;
            var error;
            var finalValue = _this.result;
            if (callback) {
                try {
                    finalValue = callback(_this.result);
                }
                catch (e) {
                    error = e;
                }
            }
            var subscriber = subscriberPackage.subscriber;
            if (error) {
                subscriber.beRejected(error);
            }
            else if (propagateSuccess) {
                subscriber.beResolved(finalValue);
            }
            else {
                subscriber.beRejected(finalValue, false, callback && !subscriberPackage.isFinally);
            }
        });
        this.subscriberPackages.length = 0;
    };
    /**
     * The specs require support for non Promise objects that still support calling .then()
     * @param value
     * @returns {value is IGwThenable}
     */
    GwPromise.isThenable = function (value) {
        return this.isObjectOrFunction(value) && this.isFunction(value.then);
    };
    /**
     * Uses "hidden" private variable to ensure that locking in is a one-way door
     * This is mostly just extra armor to ensure the guts of the promise are functioning correctly.
     */
    GwPromise.prototype.lockIn = function () {
        this._lockedIn = true;
    };
    GwPromise.prototype.isLockedIn = function () {
        return !!this._lockedIn;
    };
    Object.defineProperty(GwPromise.prototype, "state", {
        get: function () {
            return this._state || 0 /* PENDING */;
        },
        /**
         * Uses "hidden" private variable to ensure that setting state can only advance
         * Throws when trying to set state, and the state is already something other than pending
         * This is mostly just extra armor to ensure the guts of the promise are functioning correctly
         * @param {GwPromiseState} state
         */
        set: function (state) {
            if (this.isSettled()) {
                throw new Error("Attempted to set state on a promise that's already been settled.");
            }
            this._state = state;
            this.lockIn();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will be called recursively if the value in a thenable.
     * However, this could be called multiple times during a "race". But we only want the first one to proceed.
     * So we tell the promise that it's been "locked in" once this has been called once and we bail on subsequent calls.
     * But if the value is a promise...then it wants to call this recursively...so we give it the "forceToRunEvenIfLocked" option
     *
     * @param thenableOrValue
     * @param {boolean} forceToRunEvenIfLocked
     * @returns {this}
     */
    GwPromise.prototype.beResolved = function (thenableOrValue, forceToRunEvenIfLocked) {
        var _this = this;
        if (forceToRunEvenIfLocked === void 0) { forceToRunEvenIfLocked = false; }
        if (thenableOrValue === this) {
            throw new Error("Cannot resolve a promise with itself.");
        }
        //Unless the chain of resolution has called this method with "forceToRunEvenIfLocked" then bail if locked
        if (!forceToRunEvenIfLocked && this.isLockedIn()) {
            return this;
        }
        // Always bail if we're already settled
        if (this.isSettled()) {
            return this;
        }
        this.lockIn();
        if (GwPromise.isThenable(thenableOrValue)) {
            thenableOrValue.then(function (val) { return _this.beResolved(val, true); }, function (val) { return _this.beRejected(val, true); });
            return this;
        }
        this.state = 1 /* FULFILLED */;
        this.result = thenableOrValue;
        this.notifySubscribers();
        return this;
    };
    GwPromise.prototype.beRejected = function (reason, forceToRunEvenIfLocked, rejectionWasHandled) {
        if (forceToRunEvenIfLocked === void 0) { forceToRunEvenIfLocked = false; }
        if (rejectionWasHandled === void 0) { rejectionWasHandled = false; }
        if (reason === this) {
            throw new Error("Cannot resolve a promise with itself.");
        }
        //Unless the chain of resolution has called this method with "forceToRunEvenIfLocked" then bail if locked
        if (!forceToRunEvenIfLocked && this.isLockedIn()) {
            return this;
        }
        // Always bail if we're already settled
        if (this.isSettled()) {
            return this;
        }
        this.lockIn();
        this.state = rejectionWasHandled ? 3 /* REJECTED_BUT_HANDLED */ : 2 /* REJECTED */;
        this.result = reason;
        this.notifySubscribers();
        return this;
    };
    GwPromise.prototype.getResult = function () {
        return this.result;
    };
    GwPromise.prototype.isSettled = function () {
        return this.isFulfilled() || this.isRejected();
    };
    GwPromise.prototype.isPending = function () {
        return this.state === 0 /* PENDING */;
    };
    GwPromise.prototype.isFulfilled = function () {
        return this.state === 1 /* FULFILLED */;
    };
    GwPromise.prototype.isRejected = function () {
        return this.state === 2 /* REJECTED */ || this.state === 3 /* REJECTED_BUT_HANDLED */;
    };
    GwPromise.isObjectOrFunction = function (val) {
        if (val === null || val === undefined) {
            return false;
        }
        var type = typeof val;
        return val !== null && (type === "object" || type === "function");
    };
    GwPromise.isFunction = function (val) {
        return typeof val === "function";
    };
    return GwPromise;
}());
exports.GwPromise = GwPromise;
// Polyfill
if (window && typeof window.Promise !== "function") {
    window.Promise = GwPromise;
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwZjYwNDUzOGY5MWNiY2JjOGYxZiIsIndlYnBhY2s6Ly8vLi9idWlsZC9lbWJlZGRlZC1pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9lbWJlZGRlZC9Hd0Nyb3NzT3JpZ2luRXh0ZXJuYWwudHMiLCJ3ZWJwYWNrOi8vLy4vZW1iZWRkZWQvR3dQcm9taXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3REEsMENBQTBDO0FBQzFDLGlDQUFrRDtBQUNsRCxpQ0FBc0M7Ozs7Ozs7Ozs7QUNZdEM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0g7SUFZRTtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsZ0RBQWdEO0lBQ2hELHFCQUFxQjtJQUNyQixnREFBZ0Q7SUFFaEQ7Ozs7O09BS0c7SUFDSSwwQkFBSSxHQUFYLFVBQWEsY0FBc0IsRUFBRSxrQkFBMEMsRUFBRSxpQkFBMEI7UUFDekcs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QUFBRCxDQUFDO0FBblZZLDhCQUFTO0FBcVZ0QixXQUFXO0FBQ1gsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQVEsTUFBYyxDQUFDLE9BQU8sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzNELE1BQWMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLENBQUMiLCJmaWxlIjoiZ3ctZW1iZWRkZWQtdHMtZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZjYwNDUzOGY5MWNiY2JjOGYxZiIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWltcG9ydC1zaWRlLWVmZmVjdCAqL1xuZXhwb3J0ICogZnJvbSBcIi4uL2VtYmVkZGVkL0d3Q3Jvc3NPcmlnaW5FeHRlcm5hbFwiO1xuZXhwb3J0ICogZnJvbSBcIi4uL2VtYmVkZGVkL0d3UHJvbWlzZVwiO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2J1aWxkL2VtYmVkZGVkLWluZGV4LnRzIiwiaW1wb3J0IHtHd0V2ZW50TGlzdGVuZXIsIEd3VHlwZWRNYXB9IGZyb20gXCIuLi90eXBlcy9nd1R5cGVzXCI7XG5pbXBvcnQge1xuICBHd0Nyb3NzT3JpZ2luRXZlbnQsIEd3Q3Jvc3NPcmlnaW5FdmVudExpc3RlbmVyQ2FsbGJhY2ssIEd3Q3Jvc3NPcmlnaW5FdmVudE5hbWUsIEd3Q3Jvc3NPcmlnaW5XaW5kb3dOYW1lLFxuICBHd0tleVZhbHVlLCBHd01lc3NhZ2VEYXRhLCBHd01lc3NhZ2VFdmVudCwgR3dNZXNzYWdlc0Zyb21HVywgR3dNZXNzYWdlU3RhdHVzLFxuICBHd01lc3NhZ2VzVG9HVywgR3dOb3RpZmljYXRpb24sIEd3Tm90aWZpY2F0aW9uQ2FsbGJhY2ssIEd3Tm90aWZpY2F0aW9uVHlwZVxufSBmcm9tIFwiLi4vdHlwZXMvZ3dDcm9zc09yaWdpblR5cGVzXCI7XG5cbmludGVyZmFjZSBHd01lc3NhZ2VBd2FpdGluZ1Jlc3BvbnNlSW5mbyB7XG4gIG1lc3NhZ2VJZDogbnVtYmVyO1xuICBmdWxmaWxsPzogRnVuY3Rpb247XG4gIHJlamVjdD86IEZ1bmN0aW9uO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbn1cblxuLyoqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBSSU1BUlkgQ0xBU1NcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGhpcyBlbnRpcmUgZmlsZSBpcyBhIHN0YW5kIGFsb25lIGltcGxlbWVudGF0aW9uIG9mIHRoZSBHdyBjcm9zcyBvcmlnaW4gd2luZG93IG1lc3NhZ2luZyBzeXN0ZW0uXG4gKiBJdCdzIHNvbGUgcHVycG9zZSBpcyB0byBiZSB1c2VkIGluIGEgY3Jvc3Mgb3JpZ2luIHdpbmRvdyBlbnZpcm9ubWVudCBmb3IgZW1iZWRkZWQgYXBwbGljYXRpb25zLlxuICpcbiAqIFRoaXMgU3RhdGljIENsYXNzIGlzIHRoZSBvbmx5IEFQSSwgYW5kIHRoaXMgZmlsZSByZWxpZXMgb24gbm8gb3RoZXIgaW1wb3J0cyAoYXBhcnQgZnJvbSBzb21lIFR5cGVTY3JpcHRcbiAqIHR5cGUgZGVmaW5pdGlvbnMsIHNoYXJlZCB3aXRoIHRoZSBpbnRlcm5hbCBBUElzKVxuICpcbiAqIElmIHRoZSBleHRlcm5hbCBhcHBsaWNhdGlvbiBwbGFucyB0byBzdXBwb3J0IGJyb3dzZXJzIG9yIGVudmlyb25tZW50cyB0aGF0IGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgZXM2IFByb21pc2UsXG4gKiB0aGVuIGl0IHdpbGwgbmVlZCBhIFByb21pc2UgcG9seWZpbGwuIEd3UHJvbWlzZS50cyBpcyBvbmUgb3B0aW9uLCBhbmQgaXMgYSBzdGFuZCBhbG9uZSBwb2x5ZmlsbC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEd3Q3Jvc3NPcmlnaW5FeHRlcm5hbCB7XG4gIHByaXZhdGUgc3RhdGljIG5leHRNZXNzYWdlSWQ6IG51bWJlciA9IDEwMDA7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBzdGF0aWMgb3JpZ2luRm9yR3dBcHA6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgbWVzc2FnZXNBd2FpdGluZ1Jlc3BvbnNlOiBHd0tleVZhbHVlPEd3TWVzc2FnZUF3YWl0aW5nUmVzcG9uc2VJbmZvPiA9IHt9O1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBjcm9zc09yaWdpbkV2ZW50Q2FsbGJhY2tCeUJyb2FkY2FzdGVyVGhlbkV2ZW50OiBHd0tleVZhbHVlPEd3S2V5VmFsdWU8R3dDcm9zc09yaWdpbkV2ZW50TGlzdGVuZXJDYWxsYmFjaz4+ID0ge307XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGd3Tm90aWZpY2F0aW9uTGlzdGVuZXJzOiBHd0tleVZhbHVlPEd3Tm90aWZpY2F0aW9uQ2FsbGJhY2s+ID0ge307XG4gIHByaXZhdGUgc3RhdGljIGFsbG93TGlzdGVkRG9tYWluczogR3dLZXlWYWx1ZTx0cnVlPiB8IFwiKlwiID0ge307XG4gIHByaXZhdGUgc3RhdGljIG93bmVyV2luZG93OiBXaW5kb3c7XG4gIHByaXZhdGUgc3RhdGljIG1lc3NhZ2VFdmVudExpc3RlbmVyOiBHd0V2ZW50TGlzdGVuZXIgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3RhdGljIGNsYXNzLiBVc2UgR3dDcm9zc09yaWdpbkV4dGVybmFsLmluaXQoKVwiKTtcbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLz09PT0gSU5JVElBTElaQVRJT05cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIFJlcXVpcmVkIEluaXRpYWxpemVyIGZvciB0aGUgR3dDcm9zc09yaWdpbkV4dGVybmFsIEFQSS5cbiAgICogQWRkcyBhICdtZXNzYWdlJyBldmVudCBsaXN0ZW5lciB0byB0aGUgZ2xvYmFsIHdpbmRvd1xuICAgKiBAcGFyYW0ge3N0cmluZ30gb3JpZ2luRm9yR3dBcHAgLSB0aGUgb3JpZ2luIG9mIHRoZSB3aW5kb3cgKHJ1bm5pbmcgdGhlIEdXIEFwcGxpY2F0aW9uKSB0aGF0IHNwYXduZWQgdGhpcyB3aW5kb3dcbiAgICogQHBhcmFtIHtXaW5kb3d9IGZvcmNlZE93bmVyV2luZG93IC0gcHJpbWFyaWx5IHVzZWQgZm9yIHRlc3RpbmcgYW5kIG1vY2tpbmcuIFJlcGxhY2VzIGFsbCBjYWxscyB0byB0aGUgZ2xvYmFsIHdpbmRvdy5cbiAgICovXG4gIHN0YXRpYyBpbml0IChvcmlnaW5Gb3JHd0FwcDogc3RyaW5nLCBhbGxvd0xpc3RlZERvbWFpbnM6IEd3S2V5VmFsdWU8dHJ1ZT4gfCBcIipcIiwgZm9yY2VkT3duZXJXaW5kb3c/OiBXaW5kb3cpOiB2b2lkIHtcbiAgICB0aGlzLm93bmVyV2luZG93ID0gZm9yY2VkT3duZXJXaW5kb3cgfHwgd2luZG93LnBhcmVudDtcbiAgICB0aGlzLmFsbG93TGlzdGVkRG9tYWlucyA9IGFsbG93TGlzdGVkRG9tYWlucztcbiAgICB0aGlzLm9yaWdpbkZvckd3QXBwID0gb3JpZ2luRm9yR3dBcHA7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5tZXNzYWdlRXZlbnRMaXN0ZW5lciA9IHRoaXMucmVjZWl2ZU1lc3NhZ2VGcm9tR3dBcHAuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgdGhpcy5tZXNzYWdlRXZlbnRMaXN0ZW5lciEsIGZhbHNlKTtcbiAgfVxuXG4gIHN0YXRpYyBpc0luaXRpYWxpemVkICgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgQVBJLiBSZW1vdmluZyBhbnkgc2V0dXAgZG9uZSBpbiB0aGUgaW5pdCBtZXRob2QuXG4gICAqL1xuICBzdGF0aWMga2lsbCAoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMub3JpZ2luRm9yR3dBcHAgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMubWVzc2FnZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRoaXMub3duZXJXaW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgdGhpcy5tZXNzYWdlRXZlbnRMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgdGhpcy5tZXNzYWdlRXZlbnRMaXN0ZW5lciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy89PT09IFJFQ0VJVkUgTUVTU0FHRVMgRlJPTSBHVyBBUFBcbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgcHJpdmF0ZSBzdGF0aWMgdGhyb3dJZlVudHJ1c3RlZE9yaWdpbiAoZXZlbnQ6IEd3TWVzc2FnZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3duZXJXaW5kb3cgIT09IGV2ZW50LnNvdXJjZSB8fCB0aGlzLm9yaWdpbkZvckd3QXBwICE9PSBldmVudC5vcmlnaW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlJlY2VpdmVkIHVudHJ1c3RlZCBtZXNzYWdlIGZyb20gb3JpZ2luOiBcIiArIGV2ZW50Lm9yaWdpbik7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmRhdGEuZ3dOb25Hd09yaWdpbklmQW55KSB7XG4gICAgICBpZiAodGhpcy5hbGxvd0xpc3RlZERvbWFpbnMgIT09IFwiKlwiICYmICF0aGlzLmFsbG93TGlzdGVkRG9tYWluc1tldmVudC5kYXRhLmd3Tm9uR3dPcmlnaW5JZkFueV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUmVjZWl2ZWQgbWVzc2FnZSBmcm9tIHRydXN0ZWQgR1cgQXBwbGljYXRpb24gb3JpZ2luLCBidXQgZnJvbSBhbiBvcmlnaW5hdGluZyBvcmlnaW4gbm90IG9uIHRoZSBhbGxvdyBsaXN0LlwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIFByaW1hcnkgUm91dGVyIGZvciBBbGwgTWVzc2FnZXMgUmVjZWl2ZWQgZnJvbSB0aGUgR1cgQXBwbGljYXRpb25cbiAgICogSXQgaXMgYm91bmQgdGhlIFwibWVzc2FnZVwiIGV2ZW50IGxpc3RlbmVyIG9uIHRoZSBwYXJlbnQgd2luZG93LlxuICAgKlxuICAgKiBUSEVSRSBJUyBOTyBSRUFTT04gVE8gQ0FMTCBUSElTIE1FVEhPRCBESVJFQ1RMWVxuICAgKiBAcGFyYW0ge0d3TWVzc2FnZUV2ZW50fSBldmVudFxuICAgKi9cbiAgc3RhdGljIHJlY2VpdmVNZXNzYWdlRnJvbUd3QXBwIChldmVudDogR3dNZXNzYWdlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRocm93SWZVbnRydXN0ZWRPcmlnaW4oZXZlbnQpO1xuXG4gICAgY29uc3QgZGF0YTogR3dNZXNzYWdlRGF0YSA9IGV2ZW50LmRhdGE7XG5cbiAgICBzd2l0Y2ggKGRhdGEuZ3dNZXNzYWdlVHlwZSkge1xuICAgICAgY2FzZSBHd01lc3NhZ2VzRnJvbUdXLlZBTFVFUzpcbiAgICAgICAgdGhpcy5yZWNlaXZlVmFsdWVzTWVzc2FnZShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEd3TWVzc2FnZXNGcm9tR1cuUkVTUE9OU0VfRlJPTV9OT05fQkxPQ0tJTkdfU0VSVkVSX1JFUVVFU1Q6XG4gICAgICAgIHRoaXMucmVjZWl2ZU5vbkJsb2NraW5nU2VydmVyUmVxdWVzdFJlcG9uc2VNZXNzYWdlKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgR3dNZXNzYWdlc0Zyb21HVy5DT05GSVJNQVRJT05fT05MWTpcbiAgICAgICAgdGhpcy5yZWNlaXZlQ29uZmlybWF0aW9uT25seU1lc3NhZ2UoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBHd01lc3NhZ2VzRnJvbUdXLlJFQ0VJVkVfQ1JPU1NfT1JJR0lOX0VWRU5UOlxuICAgICAgICB0aGlzLnJlY2VpdmVDcm9zc09yaWdpbkV2ZW50KGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgR3dNZXNzYWdlc0Zyb21HVy5SRUNFSVZFX0dXX05PVElGSUNBVElPTjpcbiAgICAgICAgdGhpcy5yZWNlaXZlR3dOb3RpZmljYXRpb24oZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5yZWNlaXZlTm9uQ29uZm9ybWluZ01lc3NhZ2VUeXBlRnJvbUd3QXBwKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyLiBSZXRyaWV2ZXMgR3dNZXNzYWdlQXdhaXRpbmdSZXNwb25zZUluZm8gd2hpbGUgbG9nZ2luZyBlcnJvcnMgYWxvbmcgdGhlIHdheVxuICAgKiBAcGFyYW0ge0d3TWVzc2FnZURhdGF9IGRhdGFcbiAgICogQHJldHVybnMge0d3TWVzc2FnZUF3YWl0aW5nUmVzcG9uc2VJbmZvPGFueT4gfCBudWxsfVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0QXdhaXRpbmdJbmZvRm9yQ29ycmVzcG9uZGluZ01lc3NhZ2VEYXRhIChkYXRhOiBHd01lc3NhZ2VEYXRhKTogR3dNZXNzYWdlQXdhaXRpbmdSZXNwb25zZUluZm8gfCBudWxsIHtcbiAgICBjb25zdCByZXNwb25zZVRvTWVzc2FnZUlkID0gZGF0YS5nd1Jlc3BvbnNlVG9NZXNzYWdlSWQ7XG5cbiAgICBpZiAoIXJlc3BvbnNlVG9NZXNzYWdlSWQgJiYgcmVzcG9uc2VUb01lc3NhZ2VJZCAhPT0gMCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIHZhbHVlcyBwYXlsb2FkIHdpdGggbm8gcmVzcG9uc2VUb01lc3NhZ2VJZCBpZGVudGlmaWVyOiBcIiwgZGF0YSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpbmZvOiBHd01lc3NhZ2VBd2FpdGluZ1Jlc3BvbnNlSW5mbyA9IHRoaXMubWVzc2FnZXNBd2FpdGluZ1Jlc3BvbnNlW3Jlc3BvbnNlVG9NZXNzYWdlSWRdO1xuXG4gICAgaWYgKCh3aW5kb3cgYXMgYW55KS5Hd1Rlc3RFbnYpIHtcbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIGlmICghaW5mbykge1xuICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIHZhbHVlcyBwYXlsb2FkIHdpdGggYSByZXNwb25zZVRvTWVzc2FnZUlkOiBcIiArIHJlc3BvbnNlVG9NZXNzYWdlSWQgKyBcIi4gQnV0IGNvdWxkIG5vdCBsb2NhdGUgYSBjb3JyZXNwb25kaW5nIFByb21pc2UuIERhdGE6IFwiLCBkYXRhKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb21pc2UgUmVzb2x2ZXIuXG4gICAqIFRha2VzIGEgR3dNZXNzYWdlRGF0YSBvYmplY3QuXG4gICAqIExvY2F0ZXMgbG9jYWxseSBzdG9yZWQgcHJvbWlzZXMgcmVsYXRpbmcgdGhlIHRoZSBtZXNzYWdlLCBhbmQgZmlyZXMgZnVsZmlsIG9yIHJlamVjdCBiYXNlZCBvbiBtZXNzYWdlIHN0YXR1cy5cbiAgICogQHBhcmFtIHtHd01lc3NhZ2VEYXRhfSBkYXRhXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyByZWNlaXZlTWVzc2FnZSAoZGF0YTogR3dNZXNzYWdlRGF0YSk6IHZvaWQge1xuICAgIGNvbnN0IHBheWxvYWQ6IEd3S2V5VmFsdWU8YW55PiB8IEVycm9yIHwgbnVsbCA9IGRhdGEuZ3dQYXlsb2FkO1xuICAgIGNvbnN0IHN0YXR1czogR3dNZXNzYWdlU3RhdHVzID0gZGF0YS5nd1N0YXR1cztcblxuICAgIGNvbnN0IGluZm86IEd3TWVzc2FnZUF3YWl0aW5nUmVzcG9uc2VJbmZvIHwgbnVsbCA9IHRoaXMuZ2V0QXdhaXRpbmdJbmZvRm9yQ29ycmVzcG9uZGluZ01lc3NhZ2VEYXRhKGRhdGEpO1xuICAgIGlmICghaW5mbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbGxiYWNrID0gKHN0YXR1cyA9PT0gR3dNZXNzYWdlU3RhdHVzLkZBSUxFRCkgPyBpbmZvLnJlamVjdCA6IGluZm8uZnVsZmlsbDtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHBheWxvYWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHJlY2VpdmVOb25CbG9ja2luZ1NlcnZlclJlcXVlc3RSZXBvbnNlTWVzc2FnZSAoZGF0YTogR3dNZXNzYWdlRGF0YSk6IHZvaWQge1xuICAgIHRoaXMucmVjZWl2ZU1lc3NhZ2UoZGF0YSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyByZWNlaXZlVmFsdWVzTWVzc2FnZSAoZGF0YTogR3dNZXNzYWdlRGF0YSk6IHZvaWQge1xuICAgIHRoaXMucmVjZWl2ZU1lc3NhZ2UoZGF0YSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyByZWNlaXZlQ29uZmlybWF0aW9uT25seU1lc3NhZ2UgKGRhdGE6IEd3TWVzc2FnZURhdGEpOiB2b2lkIHtcbiAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKGRhdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVjZWl2ZUNyb3NzT3JpZ2luRXZlbnQgKGRhdGE6IEd3TWVzc2FnZURhdGEpOiB2b2lkIHtcbiAgICBjb25zdCBldjogR3dDcm9zc09yaWdpbkV2ZW50ID0gZGF0YS5nd1BheWxvYWQ7XG5cbiAgICBjb25zdCBldmVudHM6IEd3VHlwZWRNYXA8R3dDcm9zc09yaWdpbkV2ZW50TGlzdGVuZXJDYWxsYmFjaz4gPSB0aGlzLmNyb3NzT3JpZ2luRXZlbnRDYWxsYmFja0J5QnJvYWRjYXN0ZXJUaGVuRXZlbnRbZXYuYnJvYWRjYXN0ZXJXaW5kb3dJZF07XG5cbiAgICBpZiAoIWV2ZW50cykge1xuICAgICAgY29uc29sZS53YXJuKFwiUmVjZWl2ZWQgY3Jvc3Mgb3JpZ2luIGV2ZW50IGZyb20gYSBicm9hZGNhc3Qgd2luZG93IG5vdCBjdXJyZW50bHkgYmVpbmcgbGlzdGVuZWQgdG8uXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJDYWxsYmFjayA9IGV2ZW50c1tldi5ldmVudE5hbWVdIHx8IGV2ZW50c1tcIipcIl07XG5cbiAgICBpZiAoIWV2ZW50TGlzdGVuZXJDYWxsYmFjaykge1xuICAgICAgY29uc29sZS53YXJuKFwiUmVjZWl2ZWQgY3Jvc3Mgb3JpZ2luIGV2ZW50IGZvciBhbiBldmVudCB0eXBlIHdpdGhvdXQgYSByZWdpc3RlcmVkIGNhbGxiYWNrOiBcIiArIGV2LmJyb2FkY2FzdGVyV2luZG93SWQgKyBcIjpcIiArIGV2LmV2ZW50TmFtZSk7XG4gICAgfVxuXG4gICAgZXZlbnRMaXN0ZW5lckNhbGxiYWNrKGV2KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHJlY2VpdmVHd05vdGlmaWNhdGlvbiAoZGF0YTogR3dNZXNzYWdlRGF0YSk6IHZvaWQge1xuICAgIGNvbnN0IG5vdGlmaWNhdGlvbjogR3dOb3RpZmljYXRpb24gPSBkYXRhLmd3UGF5bG9hZDtcblxuICAgIGNvbnN0IGNhbGxiYWNrOiBHd05vdGlmaWNhdGlvbkNhbGxiYWNrID0gdGhpcy5nd05vdGlmaWNhdGlvbkxpc3RlbmVyc1tub3RpZmljYXRpb24udHlwZV07XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhub3RpZmljYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHJlY2VpdmVOb25Db25mb3JtaW5nTWVzc2FnZVR5cGVGcm9tR3dBcHAgKGV2ZW50OiBNZXNzYWdlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBwb3NzaWJsZUN1c3RvbU1ldGhvZE5hbWUgPSAodGhpcyBhcyBhbnkpW2V2ZW50LmRhdGEuZ3dNZXNzYWdlVHlwZV07XG5cbiAgICBpZiAodHlwZW9mIHBvc3NpYmxlQ3VzdG9tTWV0aG9kTmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAodGhpcyBhcyBhbnkpW3Bvc3NpYmxlQ3VzdG9tTWV0aG9kTmFtZV0oZXZlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCItLS0gUmVjZWl2ZWQgTWVzc2FnZUV2ZW50IGZyb20gR3dBcHAgd2l0aG91dCBhIGd3TWVzc2FnZVR5cGUgdGhhdCBtYXRjaGVkIGEgbWV0aG9kIG9uIEd3Q3Jvc3NPcmlnaW5FeHRlcm5hbC5cXG5cIiArXG4gICAgICAgIFwiLS0tIFRoaXMgaXMgbGlrZWx5IGFuIEVycm9yLlxcblwiICtcbiAgICAgICAgXCItLS0gSG93ZXZlciwgcmVjZWl2ZU5vbkNvbmZvcm1pbmdNZXNzYWdlVHlwZUZyb21Hd0FwcCBjYW4gYmUgb3ZlcnJpZGRlbiBpbiBHd0Nyb3NzT3JpZ2luRXh0ZXJuYWwuXFxuXCIgK1xuICAgICAgICBcIi0tLSBUaGlzIGFsbG93cyBjdXN0b20gbG9naWMgYmFzZWQgb24gYW55IE1lc3NhZ2VFdmVudCB0aGF0IGRvZXMgbm90IGltcGxlbWVudCBHd01lc3NhZ2VFdmVudC4gQnV0IGNvbnNpZGVyIE1lc3NhZ2VUeXBlLkZJUkVfQ1VTVE9NX0VWRU5UIGluc3RlYWQuXCJcbiAgICApO1xuICB9XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vPT09PSBTRU5EIE1FU1NBR0VTIFRPIEdXIEFQUFxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogUHJpdmF0ZSBQcmltYXJ5IHJvdXRlciBmb3IgYWxsIG91dGdvaW5nIG1lc3NhZ2VzIHRvIHRoZSBHdyBBcHBsaWNhdGlvbi5cbiAgICogQHBhcmFtIHtHd01lc3NhZ2VzVG9HV30gbWVzc2FnZVR5cGVcbiAgICogQHBhcmFtIHBheWxvYWRcbiAgICogQHBhcmFtIHtudW1iZXIgfCBudWxsfSByZXNwb25zZVRvTWVzc2FnZUlkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJvbWlzZS1mdW5jdGlvbi1hc3luY1xuICBwcml2YXRlIHN0YXRpYyBzZW5kTWVzc2FnZSAobWVzc2FnZVR5cGU6IEd3TWVzc2FnZXNUb0dXLCBwYXlsb2FkOiBhbnksIHJlc3BvbnNlVG9NZXNzYWdlSWQ6IG51bWJlciB8IG51bGwgPSBudWxsKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAoIXRoaXMub3duZXJXaW5kb3cpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJBdHRlbXB0aW5nIHRvIHNlbmQgYSBtZXNzYWdlIHRvIGEgbnVsbCBHd0FwcCB3aW5kb3cuIEVuc3VyZSB0aGF0IHRoaXMgd2luZG93IHdhcyBzcGF3bmVkIGJ5IGEgR3VpZHdpcmUgQXBwbGljYXRpb24uXCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlSWQgPSB0aGlzLm5leHRNZXNzYWdlSWQrKztcblxuICAgIGNvbnN0IGRhdGE6IEd3TWVzc2FnZURhdGEgPSB7XG4gICAgICBnd01lc3NhZ2VUeXBlOiBtZXNzYWdlVHlwZSxcbiAgICAgIGd3UGF5bG9hZDogcGF5bG9hZCxcbiAgICAgIGd3U3RhdHVzOiBHd01lc3NhZ2VTdGF0dXMuUEVORElORyxcbiAgICAgIGd3TWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICBnd1Jlc3BvbnNlVG9NZXNzYWdlSWQ6IHJlc3BvbnNlVG9NZXNzYWdlSWRcbiAgICB9O1xuXG4gICAgY29uc3QgbWVzc2FnZUF3YWl0aW5nUmVzcG9uc2U6IEd3TWVzc2FnZUF3YWl0aW5nUmVzcG9uc2VJbmZvID0ge1xuICAgICAgbWVzc2FnZUlkLFxuICAgICAgdGltZXN0YW1wOiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICB9O1xuICAgIHRoaXMubWVzc2FnZXNBd2FpdGluZ1Jlc3BvbnNlW21lc3NhZ2VJZF0gPSBtZXNzYWdlQXdhaXRpbmdSZXNwb25zZTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICBtZXNzYWdlQXdhaXRpbmdSZXNwb25zZS5mdWxmaWxsID0gZnVsZmlsbDtcbiAgICAgICAgbWVzc2FnZUF3YWl0aW5nUmVzcG9uc2UucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgfSk7XG4gICAgICB0aGlzLm93bmVyV2luZG93LnBvc3RNZXNzYWdlKGRhdGEsIHRoaXMub3JpZ2luRm9yR3dBcHAhKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGVsbHMgdGhlIEdXIEFwcGxpY2F0aW9uIHRvIHVwZGF0ZSB0aGUgRE9NIEVsZW1lbnRzIChmb3IgdGhlIHdpZGdldHMgd2hvc2UgSURzIGNvcnJlc3BvbmQgdG8gdGhlIGxvZ2ljYWwgbmFtZSBtYXBwaW5nKSwgd2l0aCBuZXcgdmFsdWVzLlxuICAgKiBOT1RFOiB0aGlzIGRvZXMgbm90IGF1dG9tYXRpY2FsbHkgdXBkYXRlIHNlcnZlciB2YWx1ZXMgZm9yIHRoZSBlbGVtZW50cy4gT25seSB0aGUgdmFsdWVzIGluIHRoZSBET00gaW4gdGhlIEdXIEFwcGxpY2F0aW9uLlxuICAgKiBJZiB0aGUgUGFnZSBpcyBpbiByZWFkb25seSBtb2RlLCBvciB0aGUgdXNlciBjYW5jZWxzIHRoZSBjaGFuZ2VzLCB0aGUgY2hhbmdlcyB3aWxsIGJlIGxvc3QuXG4gICAqXG4gICAqIFNlZTogR3dDcm9zc09yaWdpbkV4dGVybmFsLmZpcmVBY3Rpb25PblNlcnZlciwgb3IgR3dDcm9zc09yaWdpbkV4dGVybmFsLm1ha2VOb25CbG9ja2luZ1NlcnZlclJlcXVlc3QgZm9yIGRpcmVjdFxuICAgKiBjb21tdW5pY2F0aW9uIHdpdGggdGhlIEd3IEFwcGxpY2F0aW9uIFNlcnZlci5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIHByb21pc2UgaXMgb25seSBmb3IgY29uZmlybWF0aW9uIHRoYXQgdGhlIG1lc3NhZ2Ugd2FzIHN1Y2Nlc3NmdWxcbiAgICpcbiAgICogQHBhcmFtIHtHd1ZhbHVlTWFwfSBsb2dpY2FsTmFtZVRvVmFsdWVNYXAgLSAnTG9naWNhbCBOYW1lcycgYXJlIGV4cG9zZWQgYXMgYSBtYXBwaW5nIGluIEVtYmVkZGluZ1dpZGdldCBBUEkuXG4gICAqIEFuZCBjb3JyZXNwb25kIHRvIGEgc2V0IG9mIHdpZGdldCBJRHMgaW4gYSBnaXZlbiBpbnN0YW5jZSBvZiB0aGUgRW1iZWRkaW5nV2lkZ2V0LiBpZTpcbiAgICogTG9naWNhbCBOYW1lOiBBZGRyZXNzTGluZTEgPT4gV2lkZ2V0SWQtcGFnZTktcGFuZWw4LWFkZHJlc3NzZWN0aW9uNy1hZGRyZXNzbGluZTEuXG4gICAqIExpZ2ljYWwgTmFtZTogWmlwQ29kZSA9PiBXaWRnZXRJZC1wYWdlOS1wYW5lbDgtYWRkcmVzc3NlY3Rpb243LXppcGNvZGUuXG4gICAqIFNlZSB0aGUgUENGIGZpZWxkcyBmb3IgRW1iZWRkaW5nV2lkZ2V0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEd3VmFsdWVNYXA+fVxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByb21pc2UtZnVuY3Rpb24tYXN5bmNcbiAgc3RhdGljIHNldFZhbHVlcyAobG9naWNhbE5hbWVUb1ZhbHVlTWFwOiBHd0tleVZhbHVlPHN0cmluZz4pOiBQcm9taXNlPEd3S2V5VmFsdWU8c3RyaW5nPj4ge1xuICAgIHJldHVybiB0aGlzLnNlbmRNZXNzYWdlKEd3TWVzc2FnZXNUb0dXLlNFVF9WQUxVRVMsIGxvZ2ljYWxOYW1lVG9WYWx1ZU1hcCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWVzIG9mIHRoZSBjb3JyZXNwb25kaW5nIHdpZGdldHMgYXMgY3VycmVudGx5IHJlcHJlc2VudGVkIGluIHRoZSBET00uXG4gICAqIE5vdGU6IHRoaXMgcmV0dXJucyB0aGUgdmFsdWVzIGFzIGN1cnJlbnRseSByZXByZXNlbnRlZCBpbiB0aGUgRE9NLiBUaGVzZSB2YWx1ZXMgQ09VTEQgYmUgZGlmZmVyZW50XG4gICAqIGZyb20gdGhlIHBlcnNpc3RlZCBzZXJ2ZXIgdmFsdWVzIGZvciBhbnkgbnVtYmVyIG9mIHJlYXNvbnM6IHRoZSB1c2VyIG1vZGlmaWVkIHRoZW0gbG9jYWxseSwgY2xpZW50IHJlZmxlY3Rpb25cbiAgICogbW9kaWZpZWQgdGhlbSwgZXRjLlxuICAgKlxuICAgKiBUaGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGNvbnRhaW4gdGhlIHZhbHVlcyB3aGVuIGZ1bGZpbGxlZFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBsb2dpY2FsTmFtZXMgLSAnTG9naWNhbCBOYW1lcycgYXJlIGV4cG9zZWQgYXMgYSBtYXBwaW5nIGluIEVtYmVkZGluZ1dpZGdldCBBUEkuXG4gICAqIEFuZCBjb3JyZXNwb25kIHRvIGEgc2V0IG9mIHdpZGdldCBJRHMgaW4gYSBnaXZlbiBpbnN0YW5jZSBvZiB0aGUgRW1iZWRkaW5nV2lkZ2V0LiBpZTpcbiAgICogTG9naWNhbCBOYW1lOiBBZGRyZXNzTGluZTEgPT4gV2lkZ2V0SWQtcGFnZTktcGFuZWw4LWFkZHJlc3NzZWN0aW9uNy1hZGRyZXNzbGluZTEuXG4gICAqIExpZ2ljYWwgTmFtZTogWmlwQ29kZSA9PiBXaWRnZXRJZC1wYWdlOS1wYW5lbDgtYWRkcmVzc3NlY3Rpb243LXppcGNvZGUuXG4gICAqIFNlZSB0aGUgUENGIGZpZWxkcyBmb3IgRW1iZWRkaW5nV2lkZ2V0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEd3VmFsdWVNYXA+fVxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByb21pc2UtZnVuY3Rpb24tYXN5bmNcbiAgc3RhdGljIGdldFZhbHVlcyAobG9naWNhbE5hbWVzOiBzdHJpbmdbXSk6IFByb21pc2U8R3dLZXlWYWx1ZTxzdHJpbmc+PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZE1lc3NhZ2UoR3dNZXNzYWdlc1RvR1cuR0VUX1ZBTFVFUywgbG9naWNhbE5hbWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRW1iZWRkZWQgV2lkZ2V0J3Mgc2VydmVyIHNpZGUgQUNUSU9OIEhBTkRMRVIgd2l0aCB0aGUgZ2l2ZW4gSlNPTlxuICAgKiBvYmplY3QgYXMgaXRzIGFyZ3VtZW50LiBUaGlzIHdpbGwgY2F1c2UgYSBmdWxsIFVJIHJlZnJlc2guXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCBwcm9taXNlIGlzIG9ubHkgZm9yIGNvbmZpcm1hdGlvbiB0aGF0IHRoZSBtZXNzYWdlIHdhcyBzdWNjZXNzZnVsLCBub3QgdGhlIHJlc3VsdCBvZiB0aGUgYWN0aW9uIG9uIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGpzb25QYXlsb2FkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJvbWlzZS1mdW5jdGlvbi1hc3luY1xuICBzdGF0aWMgZmlyZUFjdGlvbk9uU2VydmVyIChwYXlsb2FkOiBHd0tleVZhbHVlPGFueT4pOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlbmRNZXNzYWdlKEd3TWVzc2FnZXNUb0dXLkZJUkVfQUNUSU9OLCBwYXlsb2FkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRW1iZWRkZWQgV2lkZ2V0J3Mgc2VydmVyIHNpZGUgVVBEQVRFIEhBTkRMRVIgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0XG4gICAqIG9iamVjdCBhcyBpdHMgYXJndW1lbnQuIFRoaXMgd2lsbCBub3QgYmxvY2sgb3IgcmVmcmVzaCB0aGUgR1cgQXBwbGljYXRpb24gVUkuXG4gICAqXG4gICAqIE5PVEU6IFRoZSBQcm9taXNlIHJldHVybmVkIGJ5IHRoaXMgbWV0aG9kIHdpbGwgY29udGFpbiB0aGUgcGF5bG9hZCBmcm9tIHRoaXMgcmVxdWVzdC5cbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcm9taXNlLWZ1bmN0aW9uLWFzeW5jXG4gIHN0YXRpYyBtYWtlTm9uQmxvY2tpbmdTZXJ2ZXJSZXF1ZXN0IChwYXlsb2FkOiBHd0tleVZhbHVlPGFueT4pOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlbmRNZXNzYWdlKEd3TWVzc2FnZXNUb0dXLk5PTl9CTE9DS0lOR19TRVJWRVJfUkVRVUVTVCwgcGF5bG9hZCk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIGFub3RoZXIgRXh0ZXJuYWwgQ3Jvc3MgT3JpZ2luIHdpbmRvdydzIG1lc3NhZ2VzLlxuICAgKiBJbWFnaW5lIHRoYXQgdGhlIEd3IEFwcGxpY2F0aW9uIGhhcyAyIGVtYmVkZGVkIGlmcmFtZSdzLiBUaGUgQmx1ZSBXaW5kb3csIGFuZCB0aGUgUmVkIFdpbmRvdy5cbiAgICogQmx1ZSB3aW5kb3cgY2FuIGJyb2FkY2FzdCBhIGN1c3RvbSBjcm9zcyBvcmlnaW4gZXZlbnQuIExldCdzIHNheSBcIkdPX0JBTkFOQVNcIi4gQW5kIGluY2x1ZGUgc29tZSBpbmZvcm1hdGlvbjoge251bWJlck9mQmFuYW5hczogMTJ9XG4gICAqIEJsdWUgd2luZG93IHdpbGwgc2VuZCB0aGF0IHBhY2thZ2UgdG8gdGhlIEd3QXBwbGljYXRpb24gdmlhIGJyb2FkY2FzdENyb3NzT3JpZ2luRXZlbnQuXG4gICAqIFJlZCB3aW5kb3cgd2lsbCBuZXZlciBoZWFyIGFib3V0IHRoaXMgbWVzc2FnZS5cbiAgICpcbiAgICogQnV0IGlmIFJlZCBXaW5kb3cgY2FsbHMgYWRkQ3Jvc3NPcmlnaW5FdmVudExpc3RlbmVyLCBwYXNzaW5nIFwicmVkV2luZG93XCIgYW5kIFwiR09fQkFOQU5BU1wiIHRoZW4gdGhlIEd3IEFwcGxpY2F0aW9uXG4gICAqIHdpbGwgcm91dGUgdGhlIG1lc3NhZ2UgZXZlbnQgdG8gdGhlIGJsdWUgd2luZG93LCBhbmQgY2FsbCB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqXG4gICAqIExpa2UgZ2V0L3NldCB2YWx1ZXMgdGhpcyBmdW5jdGlvbiB1c2VzIGxvZ2ljYWwgbmFtZXMsIGFzIGdpdmVuIHRvIHRoZSBlbWJlZGRlZCB3aWRnZXQgdmlhXG4gICAqIHRoZSBFbWJlZGRlZFdpZGdldFJlZiBlbGVtZW50LiBUaG91Z2ggaW4gdGhpcyBjYXNlIHRoZSBsb2dpY2FsIG5hbWVzIHJlZmVyIHRvIGFub3RoZXJcbiAgICogZW1iZWRkZWQgd2lkZ2V0IHJhdGhlciB0aGFuIHRvIGFuIGlucHV0LlxuICAgKlxuICAgKiBOT1RFOiB0byByZWNlaXZlIG1lc3NhZ2VzIGZyb20gYW55IG90aGVyIGV4dGVybmFsIHdpbmRvd3MsIHRoZXkgbXVzdCBiZSBleHBsaWNpdGx5IGFsbG93IGxpc3RlZCB2aWEgdGhlXG4gICAqIEd3Q3Jvc3NPcmlnaW5FeHRlcm5hbC5pbml0IG1ldGhvZCwgZWl0aGVyIGJ5IGRvbWFpbiwgb3IgYnkgc3BlY2lmeWluZyBhIHdpbGRjYXJkIGRvbWFpbi5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIHByb21pc2UgaXMgb25seSBmb3IgY29uZmlybWF0aW9uIHRoYXQgdGhlIG1lc3NhZ2Ugd2FzIHN1Y2Nlc3NmdWxcbiAgICogQHBhcmFtIGJyb2FkY2FzdGVyV2luZG93TmFtZSB0aGUgbG9naWNhbCBuYW1lIG9mIHRoZSB3aW5kb3cgeW91IHdhbnQgdG8gbGlzdGVuIHRvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgbmFtZSBvZiB0aGUgZXZlbnQsIG9yIFwiKlwiIHRvIGxpc3RlbiB0byBhbnkgZXZlbnRcbiAgICogQHBhcmFtIHtHd0V2ZW50SW5mb0NhbGxiYWNrfSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByb21pc2UtZnVuY3Rpb24tYXN5bmNcbiAgc3RhdGljIGFkZENyb3NzT3JpZ2luRXZlbnRMaXN0ZW5lciAoYnJvYWRjYXN0ZXJXaW5kb3dOYW1lOiBHd0Nyb3NzT3JpZ2luV2luZG93TmFtZSwgZXZlbnROYW1lOiBHd0Nyb3NzT3JpZ2luRXZlbnROYW1lLCBjYWxsYmFjazogR3dDcm9zc09yaWdpbkV2ZW50TGlzdGVuZXJDYWxsYmFjayk6IFByb21pc2U8YW55PiB7XG4gICAgbGV0IGN1cnJlbnRseUxpc3RlbmVkVG9FdmVudHMgPSB0aGlzLmNyb3NzT3JpZ2luRXZlbnRDYWxsYmFja0J5QnJvYWRjYXN0ZXJUaGVuRXZlbnRbYnJvYWRjYXN0ZXJXaW5kb3dOYW1lXSA9IHRoaXMuY3Jvc3NPcmlnaW5FdmVudENhbGxiYWNrQnlCcm9hZGNhc3RlclRoZW5FdmVudFticm9hZGNhc3RlcldpbmRvd05hbWVdIHx8IHt9O1xuXG4gICAgaWYgKGN1cnJlbnRseUxpc3RlbmVkVG9FdmVudHNbXCIqXCJdKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlcmUgaXMgYWxyZWFkeSBhbiAnYWxsJyBsaXN0ZW5lciAoYCpgKSBmb3IgdGhpcyBicm9hZGNhc3Rlci4gUmVtb3ZlIGl0IGJlZm9yZSBhZGRpbmcgYW55IG90aGVyIGxpc3RlbmVyczogXCIgKyBicm9hZGNhc3RlcldpbmRvd05hbWUgKyBcIjpcIiArIGV2ZW50TmFtZSkpO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50bHlMaXN0ZW5lZFRvRXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgcmVnaXN0ZXIgbXVsdGlwbGUgY2FsbGJhY2tzIGZvciB0aGUgc2FtZSBicm9hZGNhc3RlciBhbmQgZXZlbnQ6IFwiICsgYnJvYWRjYXN0ZXJXaW5kb3dOYW1lICsgXCI6XCIgKyBldmVudE5hbWUpKTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnROYW1lID09PSBcIipcIiAmJiBPYmplY3Qua2V5cyhjdXJyZW50bHlMaXN0ZW5lZFRvRXZlbnRzKS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJBZGRpbmcgYW4gJ2FsbCcgbGlzdGVuZXIgb2YgJyonIHRvIGEgYnJvYWRjYXN0ZXIgdGhhdCBhbHJlYWR5IGhhcyBtb3JlIHNwZWNpZmljIGxpc3RlbmVyLiBBbGwgc3BlY2lmaWMgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZC4gSW4gb3JkZXIgdG8gYXZvaWQgdGhpcyB3YXJuaW5nLCByZW1vdmUga25vd24gbGlzdGVuZXJzIG1hbnVhbGx5IGJlZm9yZSBhZGRpbmcuXCIpO1xuICAgICAgY3VycmVudGx5TGlzdGVuZWRUb0V2ZW50cyA9IHRoaXMuY3Jvc3NPcmlnaW5FdmVudENhbGxiYWNrQnlCcm9hZGNhc3RlclRoZW5FdmVudFticm9hZGNhc3RlcldpbmRvd05hbWVdID0ge307XG4gICAgfVxuXG4gICAgY3VycmVudGx5TGlzdGVuZWRUb0V2ZW50c1tldmVudE5hbWVdID0gY2FsbGJhY2s7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kTWVzc2FnZShHd01lc3NhZ2VzVG9HVy5BRERfQ1JPU1NfT1JJR0lOX0VWRU5UX0xJU1RFTkVSLCB7YnJvYWRjYXN0ZXJXaW5kb3dOYW1lLCBldmVudE5hbWV9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBDcm9zcyBPcmlnaW4gRXZlbnQgTGlzdGVuZXIgZnJvbSB0aGUgR1cgQXBwbGljYXRpb24gd2luZG93XG4gICAqIFNlZSBHd0Nyb3NzT3JpZ2luRXh0ZXJuYWwuYWRkQ3Jvc3NPcmlnaW5FdmVudExpc3RlbmVyLlxuICAgKlxuICAgKiBMaWtlIGdldC9zZXQgdmFsdWVzIHRoaXMgZnVuY3Rpb24gdXNlcyBsb2dpY2FsIG5hbWVzLCBhcyBnaXZlbiB0byB0aGUgZW1iZWRkZWQgd2lkZ2V0IHZpYVxuICAgKiB0aGUgRW1iZWRkZWRXaWRnZXRSZWYgZWxlbWVudC4gVGhvdWdoIGluIHRoaXMgY2FzZSB0aGUgbG9naWNhbCBuYW1lcyByZWZlciB0byBhbm90aGVyXG4gICAqIGVtYmVkZGVkIHdpZGdldCByYXRoZXIgdGhhbiB0byBhbiBpbnB1dC5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIHByb21pc2UgaXMgb25seSBmb3IgY29uZmlybWF0aW9uIHRoYXQgdGhlIG1lc3NhZ2Ugd2FzIHN1Y2Nlc3NmdWxcbiAgICogQHBhcmFtIGJyb2FkY2FzdGVyV2luZG93TmFtZSB0aGUgbG9naWNhbCBuYW1lIG9mIHRoZSB3aW5kb3cgeW91IHdhbnQgdG8gc3RvcCBsaXN0ZW5pbmcgdG9cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBuYW1lIG9mIHRoZSBldmVudCwgb3IgXCIqXCIgaWYgcmVnaXN0ZXJkIHRvIGxpc3RlbiB0byBhbnkgZXZlbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcm9taXNlLWZ1bmN0aW9uLWFzeW5jXG4gIHN0YXRpYyByZW1vdmVDcm9zc09yaWdpbkV2ZW50TGlzdGVuZXIgKGJyb2FkY2FzdGVyV2luZG93TmFtZTogR3dDcm9zc09yaWdpbldpbmRvd05hbWUsIGV2ZW50TmFtZTogR3dDcm9zc09yaWdpbkV2ZW50TmFtZSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgYnlCcm9hZGNhc3RlciA9IHRoaXMuY3Jvc3NPcmlnaW5FdmVudENhbGxiYWNrQnlCcm9hZGNhc3RlclRoZW5FdmVudFticm9hZGNhc3RlcldpbmRvd05hbWVdO1xuXG4gICAgaWYgKGJ5QnJvYWRjYXN0ZXIpIHtcbiAgICAgIGlmIChldmVudE5hbWUgPT09IFwiKlwiKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNyb3NzT3JpZ2luRXZlbnRDYWxsYmFja0J5QnJvYWRjYXN0ZXJUaGVuRXZlbnRbYnJvYWRjYXN0ZXJXaW5kb3dOYW1lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBieUJyb2FkY2FzdGVyW2V2ZW50TmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VuZE1lc3NhZ2UoR3dNZXNzYWdlc1RvR1cuUkVNT1ZFX0NST1NTX09SSUdJTl9FVkVOVF9MSVNURU5FUiwge2Jyb2FkY2FzdGVyV2luZG93TmFtZSwgZXZlbnROYW1lfSk7XG4gIH1cblxuICAvKipcbiAgICogQnJvYWRjYXN0cyBhIENyb3NzIE9yaWdpbiBFdmVudCAoTWVzc2FnZSkgdG8gdGhlIEdXIEFwcGxpY2F0aW9uIGNsaWVudC4gVGhlIEdXIEFwcGxpY2F0aW9uIHRoZW4gcm91dGVzIHRoZSBtZXNzYWdlIGV2ZW50XG4gICAqIGFuZCBpbmZvcm1hdGlvbiBwYWNrYWdlIG9uIHRvIGFueSBvdGhlciBlbWJlZGRlZCB3aW5kb3dzIGluIHRoZSBhcHBsaWNhdGlvbiB0aGF0IGFyZSBsaXN0ZW5pbmcgdG8gdGhlIG9yaWdpbiBhbmQgZXZlbnQgbmFtZS5cbiAgICogU2VlIEd3Q3Jvc3NPcmlnaW5FeHRlcm5hbC5hZGRDcm9zc09yaWdpbkV2ZW50TGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcm9taXNlLWZ1bmN0aW9uLWFzeW5jXG4gIHN0YXRpYyBicm9hZGNhc3RDcm9zc09yaWdpbkV2ZW50IChldmVudE5hbWU6IEd3Q3Jvc3NPcmlnaW5FdmVudE5hbWUsIGluZm86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKGV2ZW50TmFtZS5sZW5ndGggPT09IDAgfHwgZXZlbnROYW1lID09PSBcIipcIikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIklsbGVnYWwgZXZlbnROYW1lIHBhc3NlZCB0byBmaXJlQ3Jvc3NPcmlnaW5FdmVudC4gQ2Fubm90IGJlIGVtcHR5IG9yIHRoZSBzaW5nbGUgYCpgIGNoYXJhY3RlcjogXCIgKyBldmVudE5hbWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kTWVzc2FnZShHd01lc3NhZ2VzVG9HVy5CUk9BRENBU1RfQ1JPU1NfT1JJR0lOX0VWRU5ULCB7ZXZlbnROYW1lLCBpbmZvfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEd3IEFwcGxpY2F0aW9uIHNlbmRzICdldmVudHMnIGZvciBzb21lIHByZWRlZmluZWQgY2xpZW50IHJlbGF0ZWQgbm90aWZpY2F0aW9ucywgc3VjaCBhcyB0aGUgVGhlbWUgQ2hhbmdpbmcsIG9yIHRoZSBMb2NhbGUgY2hhbmdpbmcuXG4gICAqIFRoZXJlIGlzIGFsc28gYSBHRU5FUkFMIGNhdGVnb3J5IHRoYXQgZXhpc3RzIG1haW5seSBmb3IgZnV0dXJlIHByb29maW5nLiBBZGRpdGlvbmFsIGV2ZW50cyBtYXkgYmUgY29uZmlndXJlZCBpbiB0aGUgZnV0dXJlLlxuICAgKiBAcGFyYW0ge0d3Tm90aWZpY2F0aW9uVHlwZX0gbm90aWZpY2F0aW9uVHlwZVxuICAgKiBAcGFyYW0ge0d3Tm90aWZpY2F0aW9uQ2FsbGJhY2t9IGNhbGxiYWNrXG4gICAqL1xuICBzdGF0aWMgYWRkQ2FsbGJhY2tGb3JHd05vdGlmaWNhdGlvblR5cGUgKG5vdGlmaWNhdGlvblR5cGU6IEd3Tm90aWZpY2F0aW9uVHlwZSwgY2FsbGJhY2s6IEd3Tm90aWZpY2F0aW9uQ2FsbGJhY2spOiB2b2lkIHtcbiAgICBpZiAodGhpcy5nd05vdGlmaWNhdGlvbkxpc3RlbmVyc1tub3RpZmljYXRpb25UeXBlXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXR0ZW1wdGluZyB0byBsb2FkIG11bHRpcGxlIGNhbGxiYWNrcyBmb3Igbm90aWZpY2F0aW9uIHR5cGU6IFwiICsgbm90aWZpY2F0aW9uVHlwZSArIFwiLiBjYWxsIHJlbW92ZUNhbGxiYWNrQmFja0ZvckdXTm90aWZpY2F0aW9uVHlwZSBmaXJzdC5cIik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmd3Tm90aWZpY2F0aW9uTGlzdGVuZXJzW1wiKlwiXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXR0ZW1wdGluZyB0byBsb2FkIGEgbm90aWZpY2F0aW9uIGxpc3RlbmVyIHdoZW4gdGhlaXIgaXMgYWxyZWFkeSBhICogbGlzdGVuZXIuIE5ldyBsaXN0ZW5lcjogXCIgKyBub3RpZmljYXRpb25UeXBlKTtcbiAgICB9XG4gICAgdGhpcy5nd05vdGlmaWNhdGlvbkxpc3RlbmVyc1tub3RpZmljYXRpb25UeXBlXSA9IGNhbGxiYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBHdyBBcHBsaWNhdGlvbiBzZW5kcyAnZXZlbnRzJyBmb3Igc29tZSBwcmVkZWZpbmVkIGNsaWVudCByZWxhdGVkIG5vdGlmaWNhdGlvbnMsIHN1Y2ggYXMgdGhlIFRoZW1lIENoYW5naW5nLCBvciB0aGUgTG9jYWxlIGNoYW5naW5nLlxuICAgKiBUaGVyZSBpcyBhbHNvIGEgR0VORVJBTCBjYXRlZ29yeSB0aGF0IGV4aXN0cyBtYWlubHkgZm9yIGZ1dHVyZSBwcm9vZmluZy4gQWRkaXRpb25hbCBldmVudHMgbWF5IGJlIGNvbmZpZ3VyZWQgaW4gdGhlIGZ1dHVyZS5cbiAgICogQHBhcmFtIHtHd05vdGlmaWNhdGlvblR5cGV9IG5vdGlmaWNhdGlvblR5cGVcbiAgICogQHBhcmFtIHtHd05vdGlmaWNhdGlvbkNhbGxiYWNrfSBjYWxsYmFja1xuICAgKi9cbiAgc3RhdGljIHJlbW92ZUNhbGxiYWNrRm9yR3dOb3RpZmljYXRpb25UeXBlIChub3RpZmljYXRpb25UeXBlOiBHd05vdGlmaWNhdGlvblR5cGUpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZ3dOb3RpZmljYXRpb25MaXN0ZW5lcnNbbm90aWZpY2F0aW9uVHlwZV0pIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkF0dGVtcHRpbmcgdG8gcmVtb3ZlIGEgbm9uIGV4aXN0ZW50IG5vdGlmaWNhdGlvbiBsaXN0ZW5lciBmb3I6IFwiICsgbm90aWZpY2F0aW9uVHlwZSk7XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLmd3Tm90aWZpY2F0aW9uTGlzdGVuZXJzW25vdGlmaWNhdGlvblR5cGVdO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9lbWJlZGRlZC9Hd0Nyb3NzT3JpZ2luRXh0ZXJuYWwudHMiLCJleHBvcnQgdHlwZSBHd1Jlc29sdmUgPSAodmFsdWU6IGFueSkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIEd3UmVqZWN0ID0gKHJlYXNvbjogYW55KSA9PiBuZXZlcjtcbmV4cG9ydCB0eXBlIEd3Q2FsbGJhY2tPbkZ1bGZpbGxlZCA9ICh2YWx1ZTogYW55KSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgR3dDYWxsYmFja09uUmVqZWN0ZWQgPSAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBHV1Byb21pc2VFeGVjdXRvciA9IChyZXNvbHZlOiBHd1Jlc29sdmUsIHJlamVjdDogR3dSZWplY3QpID0+IHZvaWQ7XG5cbmV4cG9ydCBjb25zdCBlbnVtIEd3UHJvbWlzZVN0YXRlIHtcbiAgLyoqIFByb21pc2Ugbm90IHlldCByZXNvbHZlZCAqL1xuICBQRU5ESU5HID0gMCxcbiAgLyoqIFByb21pc2UgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5ICovXG4gIEZVTEZJTExFRCxcbiAgLyoqIFByb21pc2UgcmVqZWN0ZWQgKi9cbiAgUkVKRUNURUQsXG4gIC8qKiBQcm9taXNlIHJlamVjdGVkLCBidXQgdGhlIGVycm9yIHdhcyBoYW5kbGVkIHNvIGl0IHdvbid0IHByb3BhZ2F0ZSB0byBjaGFpbmVkIHByb21pc2VzICovXG4gIFJFSkVDVEVEX0JVVF9IQU5ETEVEXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3dTdWJzY3JpYmVyUGFja2FnZSB7XG4gIHN1YnNjcmliZXI6IEd3UHJvbWlzZTtcbiAgaXNGaW5hbGx5OiBib29sZWFuO1xuICBvbkZ1bGZpbGw6IEd3Q2FsbGJhY2tPbkZ1bGZpbGxlZCB8IHVuZGVmaW5lZDtcbiAgb25SZWplY3Q6IEd3Q2FsbGJhY2tPblJlamVjdGVkIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHd1RoZW5hYmxlIHtcbiAgdGhlbiAob25GdWxmaWxsOiBHd0NhbGxiYWNrT25GdWxmaWxsZWQsIG9uUmVqZWN0PzogR3dDYWxsYmFja09uUmVqZWN0ZWQpOiBJR3dUaGVuYWJsZTtcbn1cblxuLyoqXG4gKiBUaGlzIGZpbGUgcG9seWZpbGxzIFByb21pc2Ugb24gdGhlIHdpbmRvdywgaWYgd2luZG93LlByb21pc2UgaXMgbm90IG9mIHR5cGUgJ2Z1bmN0aW9uJ1xuICogSXQncyBhIHN0YW5kIGFsb25lIGZpbGUsIHdpdGhvdXQgYW55IGltcG9ydHMsIHNvIGNhbiBhbHNvIGJlIGVhc2lseSBoYW5kZWQgb2ZmIHRvIHRoZSBlbWJlZGRlZCBhcHBsaWNhdGlvbiBpZiBuZWVkZWRcbiAqL1xuZXhwb3J0IGNsYXNzIEd3UHJvbWlzZSBpbXBsZW1lbnRzIElHd1RoZW5hYmxlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBzdWJzY3JpYmVyUGFja2FnZXM6IEd3U3Vic2NyaWJlclBhY2thZ2VbXSA9IFtdO1xuICBwcml2YXRlIHJlc3VsdDogYW55ID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yIChleGVjdXRvcjogR1dQcm9taXNlRXhlY3V0b3IgfCBudWxsKSB7XG4gICAgaWYgKGV4ZWN1dG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBleGVjdXRvcih0aGlzLmJlUmVzb2x2ZWQuYmluZCh0aGlzKSwgdGhpcy5iZVJlamVjdGVkLmJpbmQodGhpcykpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmJlUmVqZWN0ZWQoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZyb20gTUROOiBUaGUgc3RhdGljIFByb21pc2UucmVqZWN0IGZ1bmN0aW9uIHJldHVybnMgYSBQcm9taXNlIHRoYXQgaXMgcmVqZWN0ZWQuXG4gICAqIEZvciBkZWJ1Z2dpbmcgcHVycG9zZXMgYW5kIHNlbGVjdGl2ZSBlcnJvciBjYXRjaGluZywgaXQgaXMgdXNlZnVsIHRvIG1ha2UgcmVhc29uIGFuIGluc3RhbmNlb2YgRXJyb3JcbiAgICogQHBhcmFtIHJlYXNvblxuICAgKiBAcmV0dXJucyB7R3dQcm9taXNlfVxuICAgKi9cbiAgc3RhdGljIHJlamVjdCAocmVhc29uOiBhbnkpOiBHd1Byb21pc2Uge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgR3dQcm9taXNlKG51bGwpO1xuICAgIHJldHVybiBwcm9taXNlLmJlUmVqZWN0ZWQocmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGcm9tIE1ETjogVGhlIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkgbWV0aG9kIHJldHVybnMgYSBQcm9taXNlIG9iamVjdCB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIGdpdmVuIHZhbHVlLlxuICAgKiBJZiB0aGUgdmFsdWUgaXMgYSBwcm9taXNlLCB0aGF0IHByb21pc2UgaXMgcmV0dXJuZWQ7IGlmIHRoZSB2YWx1ZSBpcyBhIHRoZW5hYmxlIChpLmUuIGhhcyBhIFwidGhlblwiIG1ldGhvZCksXG4gICAqIHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgXCJmb2xsb3dcIiB0aGF0IHRoZW5hYmxlLCBhZG9wdGluZyBpdHMgZXZlbnR1YWwgc3RhdGU7XG4gICAqIG90aGVyd2lzZSB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIGZ1bGZpbGxlZCB3aXRoIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEByZXR1cm5zIHtHd1Byb21pc2V9XG4gICAqL1xuICBzdGF0aWMgcmVzb2x2ZSAodGhlbmFibGVPclZhbHVlOiBhbnkpOiBHd1Byb21pc2Uge1xuICAgIGlmICh0aGVuYWJsZU9yVmFsdWUgaW5zdGFuY2VvZiBHd1Byb21pc2UpIHtcbiAgICAgIHJldHVybiB0aGVuYWJsZU9yVmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBHd1Byb21pc2UobnVsbCk7XG4gICAgcmV0dXJuIHByb21pc2UuYmVSZXNvbHZlZCh0aGVuYWJsZU9yVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZyb20gTUROOiBUaGUgUHJvbWlzZS5hbGwoaXRlcmFibGUpIG1ldGhvZCByZXR1cm5zIGEgc2luZ2xlIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIGFsbCBvZiB0aGUgcHJvbWlzZXMgaW4gdGhlIGl0ZXJhYmxlIGFyZ3VtZW50IGhhdmUgcmVzb2x2ZWRcbiAgICogb3Igd2hlbiB0aGUgaXRlcmFibGUgYXJndW1lbnQgY29udGFpbnMgbm8gcHJvbWlzZXMuXG4gICAqIEl0IHJlamVjdHMgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBmaXJzdCBwcm9taXNlIHRoYXQgcmVqZWN0cy5cbiAgICpcbiAgICogUmV0dXJuc1xuICAgKiAtIEFuIGFscmVhZHkgcmVzb2x2ZWQgUHJvbWlzZSBpZiB0aGUgaXRlcmFibGUgcGFzc2VkIGlzIGVtcHR5IG9yIGNvbnRhaW5zIG5vIHByb21pc2VzLlxuICAgKiAtIEEgcGVuZGluZyBQcm9taXNlIGluIGFsbCBvdGhlciBjYXNlcy4gVGhpcyByZXR1cm5lZCBwcm9taXNlIGlzIHRoZW4gcmVzb2x2ZWQvcmVqZWN0ZWQgYXN5bmNocm9ub3VzbHkgKGFzIHNvb24gYXMgdGhlIHN0YWNrIGlzIGVtcHR5KVxuICAgKiAgIHdoZW4gYWxsIHRoZSBwcm9taXNlcyBpbiB0aGUgZ2l2ZW4gaXRlcmFibGUgaGF2ZSByZXNvbHZlZCxcbiAgICogICBvciBpZiBhbnkgb2YgdGhlIHByb21pc2VzIHJlamVjdC5cbiAgICpcbiAgICogUmV0dXJuZWQgdmFsdWVzIHdpbGwgYmUgaW4gb3JkZXIgb2YgdGhlIFByb21pc2VzIHBhc3NlZCwgcmVnYXJkbGVzcyBvZiBjb21wbGV0aW9uIG9yZGVyLlxuICAgKi9cbiAgc3RhdGljIGFsbCAocHJvbWlzZXM6IEd3UHJvbWlzZVtdKTogR3dQcm9taXNlIHtcbiAgICBpZiAocHJvbWlzZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gR3dQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHM6IGFueVtdID0gW107XG4gICAgbGV0IHJlbWFpbmluZzogbnVtYmVyID0gcHJvbWlzZXMubGVuZ3RoO1xuXG4gICAgY29uc3QgYXN5bmNNYXBwZXJGdWxmaWxsID0gKGk6IG51bWJlciwgdmFsdWU6IGFueSkgPT4ge1xuICAgICAgaWYgKCFyZXR1cm5Qcm9taXNlLmlzUGVuZGluZygpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0c1tpXSA9IHZhbHVlO1xuICAgICAgcmVtYWluaW5nLS07XG4gICAgICBpZiAocmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIHJldHVyblByb21pc2UuYmVSZXNvbHZlZChyZXN1bHRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmV0dXJuUHJvbWlzZSA9IG5ldyBHd1Byb21pc2UoKG5vdHVzZWQ6IEd3UmVzb2x2ZSwgcmVqZWN0OiBHd1JlamVjdCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9taXNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0aGVuYWJsZU9yVmFsID0gcHJvbWlzZXNbaV07XG4gICAgICAgIGlmIChHd1Byb21pc2UuaXNUaGVuYWJsZSh0aGVuYWJsZU9yVmFsKSkge1xuICAgICAgICAgIHRoZW5hYmxlT3JWYWwudGhlbihhc3luY01hcHBlckZ1bGZpbGwuYmluZCh0aGlzLCBpKSwgcmVqZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhc3luY01hcHBlckZ1bGZpbGwoaSwgdGhlbmFibGVPclZhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXR1cm5Qcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZyb20gTUROOiBUaGUgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKSBtZXRob2QgcmV0dXJucyBhIHByb21pc2VcbiAgICogdGhhdCByZXNvbHZlcyBvciByZWplY3RzIGFzIHNvb24gYXMgb25lIG9mIHRoZSBwcm9taXNlcyBpbiB0aGUgaXRlcmFibGUgcmVzb2x2ZXMgb3IgcmVqZWN0cyxcbiAgICogd2l0aCB0aGUgdmFsdWUgb3IgcmVhc29uIGZyb20gdGhhdCBwcm9taXNlLlxuICAgKlxuICAgKiBJZiB0aGUgaXRlcmFibGUgcGFzc2VkIGlzIGVtcHR5LCB0aGUgcHJvbWlzZSByZXR1cm5lZCB3aWxsIGJlIGZvcmV2ZXIgcGVuZGluZy5cbiAgICpcbiAgICogSWYgdGhlIGl0ZXJhYmxlIGNvbnRhaW5zIG9uZSBvciBtb3JlIG5vbi1wcm9taXNlIHZhbHVlIGFuZC9vciBhbiBhbHJlYWR5IHJlc29sdmVkL3JlamVjdGVkIHByb21pc2UsXG4gICAqIHRoZW4gUHJvbWlzZS5yYWNlIHdpbGwgcmVzb2x2ZSB0byB0aGUgZmlyc3Qgb2YgdGhlc2UgdmFsdWVzIGZvdW5kIGluIHRoZSBpdGVyYWJsZS5cbiAgICpcbiAgICogQHBhcmFtIHtHd1Byb21pc2VbXX0gcHJvbWlzZXNcbiAgICogQHJldHVybnMge0d3UHJvbWlzZX1cbiAgICovXG4gIHN0YXRpYyByYWNlIChwcm9taXNlczogKEd3UHJvbWlzZSB8IElHd1RoZW5hYmxlIHwgYW55KVtdKTogR3dQcm9taXNlIHtcbiAgICBjb25zdCBleGVjdXRvciA9IChyZXNvbHZlOiBHd1Jlc29sdmUsIHJlamVjdDogR3dSZWplY3QpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdGhlbmFibGVPclZhbHVlID0gcHJvbWlzZXNbaV07XG5cbiAgICAgICAgaWYgKEd3UHJvbWlzZS5pc1RoZW5hYmxlKHRoZW5hYmxlT3JWYWx1ZSkpIHtcbiAgICAgICAgICB0aGVuYWJsZU9yVmFsdWUudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUodGhlbmFibGVPclZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXR1cm5Qcm9taXNlID0gbmV3IEd3UHJvbWlzZShleGVjdXRvcik7XG5cbiAgICByZXR1cm4gcmV0dXJuUHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGcm9tIE1ETjogUmV0dXJuIEEgUHJvbWlzZSBpbiB0aGUgcGVuZGluZyBzdGF0ZS5cbiAgICogVGhlIGhhbmRsZXIgZnVuY3Rpb24gKG9uRnVsZmlsbGVkIG9yIG9uUmVqZWN0ZWQpIHRoZW4gZ2V0cyBjYWxsZWQgYXN5bmNocm9ub3VzbHkgKGFzIHNvb24gYXMgdGhlIHN0YWNrIGlzIGVtcHR5KS5cbiAgICogQWZ0ZXIgdGhlIGludm9jYXRpb24gb2YgdGhlIGhhbmRsZXIgZnVuY3Rpb24sIGlmIHRoZSBoYW5kbGVyIGZ1bmN0aW9uOlxuICAgKlxuICAgKiAtIHJldHVybnMgYSB2YWx1ZSwgdGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlbiBnZXRzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybmVkIHZhbHVlIGFzIGl0cyB2YWx1ZTtcbiAgICogLSB0aHJvd3MgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZW4gZ2V0cyByZWplY3RlZCB3aXRoIHRoZSB0aHJvd24gZXJyb3IgYXMgaXRzIHZhbHVlO1xuICAgKiAtIHJldHVybnMgYW4gYWxyZWFkeSByZXNvbHZlZCBwcm9taXNlLCB0aGUgcHJvbWlzZSByZXR1cm5lZCBieSB0aGVuIGdldHMgcmVzb2x2ZWQgd2l0aCB0aGF0IHByb21pc2UncyB2YWx1ZSBhcyBpdHMgdmFsdWU7XG4gICAqIC0gcmV0dXJucyBhbiBhbHJlYWR5IHJlamVjdGVkIHByb21pc2UsIHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZW4gZ2V0cyByZWplY3RlZCB3aXRoIHRoYXQgcHJvbWlzZSdzIHZhbHVlIGFzIGl0cyB2YWx1ZS5cbiAgICogLSByZXR1cm5zIGFub3RoZXIgcGVuZGluZyBwcm9taXNlIG9iamVjdCwgdGhlIHJlc29sdXRpb24vcmVqZWN0aW9uIG9mIHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZW4gd2lsbCBiZSBzdWJzZXF1ZW50IHRvIHRoZSByZXNvbHV0aW9uL3JlamVjdGlvbiBvZiB0aGUgcHJvbWlzZSByZXR1cm5lZCBieSB0aGUgaGFuZGxlci5cbiAgICogICBBbHNvLCB0aGUgdmFsdWUgb2YgdGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlbiB3aWxsIGJlIHRoZSBzYW1lIGFzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvbWlzZSByZXR1cm5lZCBieSB0aGUgaGFuZGxlci5cbiAgICpcbiAgICogQHBhcmFtIHtHd0NhbGxiYWNrT25GdWxmaWxsZWQgfCB1bmRlZmluZWR9IG9uRnVsZmlsbFxuICAgKiBAcGFyYW0ge0d3Q2FsbGJhY2tPblJlamVjdGVkfSBvblJlamVjdFxuICAgKiBAcmV0dXJucyB7R3dQcm9taXNlfVxuICAgKi9cbiAgdGhlbiAob25GdWxmaWxsOiBHd0NhbGxiYWNrT25GdWxmaWxsZWQgfCB1bmRlZmluZWQsIG9uUmVqZWN0PzogR3dDYWxsYmFja09uUmVqZWN0ZWQpOiBHd1Byb21pc2Uge1xuICAgIHJldHVybiB0aGlzLmFkZFN1YnNjcmliZXIoZmFsc2UsIG9uRnVsZmlsbCwgb25SZWplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZyb20gTUROOiBUaGUgY2F0Y2goKSBtZXRob2QgcmV0dXJucyBhIFByb21pc2UgYW5kIGRlYWxzIHdpdGggcmVqZWN0ZWQgY2FzZXMgb25seS5cbiAgICogSXQgYmVoYXZlcyB0aGUgc2FtZSBhcyBjYWxsaW5nIFByb21pc2UucHJvdG90eXBlLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKVxuICAgKiAoaW4gZmFjdCwgY2FsbGluZyBvYmouY2F0Y2gob25SZWplY3RlZCkgaW50ZXJuYWxseSBjYWxscyBvYmoudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpKS5cbiAgICogQHBhcmFtIHtHd0NhbGxiYWNrT25SZWplY3RlZH0gb25FcnJvclxuICAgKiBAcmV0dXJucyB7R3dQcm9taXNlfVxuICAgKi9cbiAgY2F0Y2ggKG9uRXJyb3I6IEd3Q2FsbGJhY2tPblJlamVjdGVkKTogR3dQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25FcnJvcik7XG4gIH1cblxuICAvKipcbiAgICogRnJvbSBNRE46IFRoZSBmaW5hbGx5KCkgbWV0aG9kIGNhbiBiZSB1c2VmdWwgaWYgeW91IHdhbnQgdG8gZG8gc29tZSBwcm9jZXNzaW5nIG9yIGNsZWFudXAgb25jZSB0aGUgcHJvbWlzZSBpcyBzZXR0bGVkLCByZWdhcmRsZXNzIG9mIGl0cyBvdXRjb21lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZpbmFsbHlcbiAgICogQHJldHVybnMge0d3UHJvbWlzZX1cbiAgICovXG4gIGZpbmFsbHkgKG9uRmluYWxseTogRnVuY3Rpb24pOiBHd1Byb21pc2Uge1xuICAgIGNvbnN0IGNhbGxPbkZpbmFsbHkgPSAodmFsOiBhbnkpID0+IHtcbiAgICAgIG9uRmluYWxseSgpO1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmFkZFN1YnNjcmliZXIodHJ1ZSwgY2FsbE9uRmluYWxseSwgY2FsbE9uRmluYWxseSk7XG4gIH1cblxuICBwcml2YXRlIGFkZFN1YnNjcmliZXIgKGlzRmluYWxseTogYm9vbGVhbiwgb25GdWxmaWxsOiBHd0NhbGxiYWNrT25GdWxmaWxsZWQgfCB1bmRlZmluZWQsIG9uUmVqZWN0PzogR3dDYWxsYmFja09uUmVqZWN0ZWQpOiBHd1Byb21pc2Uge1xuICAgIGNvbnN0IHN1YnNjcmliZXIgPSBuZXcgR3dQcm9taXNlKG51bGwpO1xuXG4gICAgdGhpcy5zdWJzY3JpYmVyUGFja2FnZXMucHVzaCh7c3Vic2NyaWJlciwgaXNGaW5hbGx5LCBvbkZ1bGZpbGwsIG9uUmVqZWN0fSk7XG5cbiAgICBpZiAodGhpcy5pc0Z1bGZpbGxlZCgpIHx8IHRoaXMuaXNSZWplY3RlZCgpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gIH1cblxuICBwcml2YXRlIG5vdGlmeVN1YnNjcmliZXJzICgpOiB2b2lkIHtcbiAgICBjb25zdCBwcm9wYWdhdGVTdWNjZXNzID0gIHRoaXMuc3RhdGUgIT09IEd3UHJvbWlzZVN0YXRlLlJFSkVDVEVEO1xuICAgIHRoaXMuc3Vic2NyaWJlclBhY2thZ2VzLmZvckVhY2goKHN1YnNjcmliZXJQYWNrYWdlKSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHByb3BhZ2F0ZVN1Y2Nlc3MgPyBzdWJzY3JpYmVyUGFja2FnZS5vbkZ1bGZpbGwgOiBzdWJzY3JpYmVyUGFja2FnZS5vblJlamVjdDtcbiAgICAgIGxldCBlcnJvcjtcbiAgICAgIGxldCBmaW5hbFZhbHVlID0gdGhpcy5yZXN1bHQ7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbmFsVmFsdWUgPSBjYWxsYmFjayh0aGlzLnJlc3VsdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBlcnJvciA9IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3Vic2NyaWJlciA9IHN1YnNjcmliZXJQYWNrYWdlLnN1YnNjcmliZXI7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgc3Vic2NyaWJlci5iZVJlamVjdGVkKGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcGFnYXRlU3VjY2Vzcykge1xuICAgICAgICBzdWJzY3JpYmVyLmJlUmVzb2x2ZWQoZmluYWxWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJzY3JpYmVyLmJlUmVqZWN0ZWQoZmluYWxWYWx1ZSwgZmFsc2UsIGNhbGxiYWNrICYmICFzdWJzY3JpYmVyUGFja2FnZS5pc0ZpbmFsbHkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zdWJzY3JpYmVyUGFja2FnZXMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3BlY3MgcmVxdWlyZSBzdXBwb3J0IGZvciBub24gUHJvbWlzZSBvYmplY3RzIHRoYXQgc3RpbGwgc3VwcG9ydCBjYWxsaW5nIC50aGVuKClcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEByZXR1cm5zIHt2YWx1ZSBpcyBJR3dUaGVuYWJsZX1cbiAgICovXG4gIHN0YXRpYyBpc1RoZW5hYmxlICh2YWx1ZTogYW55KTogdmFsdWUgaXMgSUd3VGhlbmFibGUge1xuICAgIHJldHVybiB0aGlzLmlzT2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkgJiYgdGhpcy5pc0Z1bmN0aW9uKCh2YWx1ZSBhcyBhbnkpLnRoZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZXMgXCJoaWRkZW5cIiBwcml2YXRlIHZhcmlhYmxlIHRvIGVuc3VyZSB0aGF0IGxvY2tpbmcgaW4gaXMgYSBvbmUtd2F5IGRvb3JcbiAgICogVGhpcyBpcyBtb3N0bHkganVzdCBleHRyYSBhcm1vciB0byBlbnN1cmUgdGhlIGd1dHMgb2YgdGhlIHByb21pc2UgYXJlIGZ1bmN0aW9uaW5nIGNvcnJlY3RseS5cbiAgICovXG4gIHByaXZhdGUgbG9ja0luICgpOiB2b2lkIHtcbiAgICAodGhpcyBhcyBhbnkpLl9sb2NrZWRJbiA9IHRydWU7XG4gIH1cblxuICBwcml2YXRlIGlzTG9ja2VkSW4gKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzIGFzIGFueSkuX2xvY2tlZEluO1xuICB9XG5cbiAgZ2V0IHN0YXRlICgpOiBHd1Byb21pc2VTdGF0ZSB7XG4gICAgcmV0dXJuICh0aGlzIGFzIGFueSkuX3N0YXRlIHx8IEd3UHJvbWlzZVN0YXRlLlBFTkRJTkc7XG4gIH1cblxuICAvKipcbiAgICogVXNlcyBcImhpZGRlblwiIHByaXZhdGUgdmFyaWFibGUgdG8gZW5zdXJlIHRoYXQgc2V0dGluZyBzdGF0ZSBjYW4gb25seSBhZHZhbmNlXG4gICAqIFRocm93cyB3aGVuIHRyeWluZyB0byBzZXQgc3RhdGUsIGFuZCB0aGUgc3RhdGUgaXMgYWxyZWFkeSBzb21ldGhpbmcgb3RoZXIgdGhhbiBwZW5kaW5nXG4gICAqIFRoaXMgaXMgbW9zdGx5IGp1c3QgZXh0cmEgYXJtb3IgdG8gZW5zdXJlIHRoZSBndXRzIG9mIHRoZSBwcm9taXNlIGFyZSBmdW5jdGlvbmluZyBjb3JyZWN0bHlcbiAgICogQHBhcmFtIHtHd1Byb21pc2VTdGF0ZX0gc3RhdGVcbiAgICovXG4gIHNldCBzdGF0ZSAoc3RhdGU6IEd3UHJvbWlzZVN0YXRlKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR0bGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dGVtcHRlZCB0byBzZXQgc3RhdGUgb24gYSBwcm9taXNlIHRoYXQncyBhbHJlYWR5IGJlZW4gc2V0dGxlZC5cIik7XG4gICAgfVxuXG4gICAgKHRoaXMgYXMgYW55KS5fc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmxvY2tJbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5IGlmIHRoZSB2YWx1ZSBpbiBhIHRoZW5hYmxlLlxuICAgKiBIb3dldmVyLCB0aGlzIGNvdWxkIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBkdXJpbmcgYSBcInJhY2VcIi4gQnV0IHdlIG9ubHkgd2FudCB0aGUgZmlyc3Qgb25lIHRvIHByb2NlZWQuXG4gICAqIFNvIHdlIHRlbGwgdGhlIHByb21pc2UgdGhhdCBpdCdzIGJlZW4gXCJsb2NrZWQgaW5cIiBvbmNlIHRoaXMgaGFzIGJlZW4gY2FsbGVkIG9uY2UgYW5kIHdlIGJhaWwgb24gc3Vic2VxdWVudCBjYWxscy5cbiAgICogQnV0IGlmIHRoZSB2YWx1ZSBpcyBhIHByb21pc2UuLi50aGVuIGl0IHdhbnRzIHRvIGNhbGwgdGhpcyByZWN1cnNpdmVseS4uLnNvIHdlIGdpdmUgaXQgdGhlIFwiZm9yY2VUb1J1bkV2ZW5JZkxvY2tlZFwiIG9wdGlvblxuICAgKlxuICAgKiBAcGFyYW0gdGhlbmFibGVPclZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2VUb1J1bkV2ZW5JZkxvY2tlZFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHByaXZhdGUgYmVSZXNvbHZlZCAodGhlbmFibGVPclZhbHVlOiBhbnksIGZvcmNlVG9SdW5FdmVuSWZMb2NrZWQ6IGJvb2xlYW4gPSBmYWxzZSk6IHRoaXMge1xuICAgIGlmICh0aGVuYWJsZU9yVmFsdWUgPT09IHRoaXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXNvbHZlIGEgcHJvbWlzZSB3aXRoIGl0c2VsZi5cIik7XG4gICAgfVxuXG4gICAgLy9Vbmxlc3MgdGhlIGNoYWluIG9mIHJlc29sdXRpb24gaGFzIGNhbGxlZCB0aGlzIG1ldGhvZCB3aXRoIFwiZm9yY2VUb1J1bkV2ZW5JZkxvY2tlZFwiIHRoZW4gYmFpbCBpZiBsb2NrZWRcbiAgICBpZiAoIWZvcmNlVG9SdW5FdmVuSWZMb2NrZWQgJiYgdGhpcy5pc0xvY2tlZEluKCkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIEFsd2F5cyBiYWlsIGlmIHdlJ3JlIGFscmVhZHkgc2V0dGxlZFxuICAgIGlmICh0aGlzLmlzU2V0dGxlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLmxvY2tJbigpO1xuXG4gICAgaWYgKEd3UHJvbWlzZS5pc1RoZW5hYmxlKHRoZW5hYmxlT3JWYWx1ZSkpIHtcbiAgICAgIHRoZW5hYmxlT3JWYWx1ZS50aGVuKCh2YWwpID0+IHRoaXMuYmVSZXNvbHZlZCh2YWwsIHRydWUpLCAodmFsKSA9PiB0aGlzLmJlUmVqZWN0ZWQodmFsLCB0cnVlKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlID0gR3dQcm9taXNlU3RhdGUuRlVMRklMTEVEO1xuICAgIHRoaXMucmVzdWx0ID0gdGhlbmFibGVPclZhbHVlO1xuXG4gICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBiZVJlamVjdGVkIChyZWFzb246IGFueSwgZm9yY2VUb1J1bkV2ZW5JZkxvY2tlZDogYm9vbGVhbiA9IGZhbHNlLCByZWplY3Rpb25XYXNIYW5kbGVkOiBib29sZWFuID0gZmFsc2UpOiB0aGlzIHtcbiAgICBpZiAocmVhc29uID09PSB0aGlzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGYuXCIpO1xuICAgIH1cblxuICAgIC8vVW5sZXNzIHRoZSBjaGFpbiBvZiByZXNvbHV0aW9uIGhhcyBjYWxsZWQgdGhpcyBtZXRob2Qgd2l0aCBcImZvcmNlVG9SdW5FdmVuSWZMb2NrZWRcIiB0aGVuIGJhaWwgaWYgbG9ja2VkXG4gICAgaWYgKCFmb3JjZVRvUnVuRXZlbklmTG9ja2VkICYmIHRoaXMuaXNMb2NrZWRJbigpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBBbHdheXMgYmFpbCBpZiB3ZSdyZSBhbHJlYWR5IHNldHRsZWRcbiAgICBpZiAodGhpcy5pc1NldHRsZWQoKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5sb2NrSW4oKTtcbiAgICB0aGlzLnN0YXRlID0gcmVqZWN0aW9uV2FzSGFuZGxlZCA/IEd3UHJvbWlzZVN0YXRlLlJFSkVDVEVEX0JVVF9IQU5ETEVEIDogR3dQcm9taXNlU3RhdGUuUkVKRUNURUQ7XG4gICAgdGhpcy5yZXN1bHQgPSByZWFzb247XG5cbiAgICB0aGlzLm5vdGlmeVN1YnNjcmliZXJzKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRSZXN1bHQgKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0O1xuICB9XG5cbiAgaXNTZXR0bGVkICgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc0Z1bGZpbGxlZCgpIHx8IHRoaXMuaXNSZWplY3RlZCgpO1xuICB9XG5cbiAgaXNQZW5kaW5nICgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gR3dQcm9taXNlU3RhdGUuUEVORElORztcbiAgfVxuXG4gIGlzRnVsZmlsbGVkICgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gR3dQcm9taXNlU3RhdGUuRlVMRklMTEVEO1xuICB9XG5cbiAgaXNSZWplY3RlZCAoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IEd3UHJvbWlzZVN0YXRlLlJFSkVDVEVEIHx8IHRoaXMuc3RhdGUgPT09IEd3UHJvbWlzZVN0YXRlLlJFSkVDVEVEX0JVVF9IQU5ETEVEO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaXNPYmplY3RPckZ1bmN0aW9uICh2YWw6IGFueSk6IHZhbCBpcyBvYmplY3QgfCBGdW5jdGlvbiB7XG4gICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsO1xuICAgIHJldHVybiB2YWwgIT09IG51bGwgJiYgKHR5cGUgPT09IFwib2JqZWN0XCIgfHwgdHlwZSA9PT0gXCJmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGlzRnVuY3Rpb24gKHZhbDogYW55KTogdmFsIGlzIEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiO1xuICB9XG59XG5cbi8vIFBvbHlmaWxsXG5pZiAod2luZG93ICYmIHR5cGVvZiAod2luZG93IGFzIGFueSkuUHJvbWlzZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICh3aW5kb3cgYXMgYW55KS5Qcm9taXNlID0gR3dQcm9taXNlO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZW1iZWRkZWQvR3dQcm9taXNlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==