/**
 *
 * A helper class for implementing the Observer pattern.
 *
 * Created by barna on 31/05/16.
 */

"use strict";
let createEvent = function() {
    let listeners = [];

    let addListener = function (listener) {
        listeners.push(listener);
    };

    let notify = function(args) {
        listeners.forEach(function (listener) {
            listener(args);
        });
    };
    return {
        addListener: addListener,
        notify: notify
    };
};