var AppDispatcher = require('../dispatchers/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require("lodash");
var Immutable = require("immutable");

var _data = new Immutable.Map(),
	_urlStack = new Immutable.Stack(),
	_schema = new Immutable.Map(),
	_isLoading = false,

var CHANGE_EVENT = "change";

/**
 * A flux store holding just about everything for the app
 * @type {Object}
 */
var Store = assign({}, EventEmitter.prototype, {

	/**
	 * Set the loading status of the app to loading
	 */
	startLoading: function() {
		_isLoading = true;
		this.emitChange();
	},

	/**
	 * Set the loading status of the app to not loading
	 * @return {[type]} [description]
	 */
	finishLoading: function() {
		_isLoading = false;
		this.emitChange();
	},

	/**
	 * Get the loading status of the app
	 * @return {Boolean} [description]
	 */
	isLoading: function() {
		return _isLoading;
	},

	/**
	 * Get the current data of the app
	 */
	getData: function() {
		return _data.toJSON();
	},

	/**
	 * Fully resets the data of the app with the given data
	 */
	resetData: function(data) {
		_data = Immutable.fromJS(data);
		this.emitChange();
	},

	switchToURL: function(url) {
		_urlStack = _urlStack.push(url)
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