/**
 *
 * A helper class for implementing the Observer pattern.
 *
 * Created by barna on 31/05/16.
 */

"use strict";

var createEvent = function createEvent() {
    var listeners = [];

    var addListener = function addListener(listener) {
        listeners.push(listener);
    };

    var notify = function notify(args) {
        listeners.forEach(function (listener) {
            listener(args);
        });
    };
    return {
        addListener: addListener,
        notify: notify
    };
};