var AppDispatcher = require('../dispatchers/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require("lodash");
var Immutable = require("immutable");

var	_error = new Immutable.Stack();

var CHANGE_EVENT = "change";

/**
 * A flux store holding errors happening in the app
 * @type {Object}
 */
var Store = assign({}, EventEmitter.prototype, {

	getErrors: function() {
		return _errors.toJSON();
	},

	getLastError: function() {
		return _errors.pop();
	},

	addError: function(message) {
		_errors = _errors.push(message);
		this.emitChange();
	},

	/**
	 * Emits a change event to the listening components
	 */
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * Attach a change listener to the store to get notified whenever any data changes
	 */
    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },
  
  	/**
	 * Remove a change listener from the store to no longer receive notifications when data changes
	 */
    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }

});


Dispatcher.register(function(action) {
	switch(action.type) {

	}
});

module.exports = Store;