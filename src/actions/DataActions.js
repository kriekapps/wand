var Dispatcher = require("../dispatchers/Dispatcher.js");
var ActionConstants = require("../ActionConstants.js");
var request = require("browser-request");
var DataStore = require("../stores/DataStore.js");

var CLIENT = "CLIENT",
	SERVER = "SERVER";

/**
 * Helper function to send an action to the dispatcher. Used for actions triggered on the client side
 * @param  {[type]} type [description]
 * @param  {[type]} data [description]
 */
function clientDispatch(type, data) {
	Dispatcher.dispatch({
		type: type,
		source: CLIENT,
		data: data
	});
};

/**
 * Helper function to send an action to the dispatcher. Used for actions triggered on the server side
 * @param  {[type]} type [description]
 * @param  {[type]} data [description]
 */
function serverDispatch(type, data) {
	Dispatcher.dispatch({
		type: type,
		source: SERVER,
		data: data
	});
};

/**
 * Alias for clientDispatch
 */
function dispatch(type, data) {
	return clientDispatch(type, data);
}

/**
 * Get the data for a given url and set it as the main data of the store
 * @param  {String} url 
 */
function getDataForURL(url) {
	dispatch(ActionConstants.NETWORK_LOADING_STARTED);
	request.get(url, function(err, res, body) {
		dispatch(ActionConstants.NETWORK_LOADING_FINISHED, err);
		if (err) {
			dispatch(ActionConstants.NETWORK_ERROR, err);
			return;
		}
		try {
			body = JSON.parse(body);
		} catch(err) {
			dispatch(ActionConstants.ERROR, {
				error: "Received invalid JSON response from server."
			});
			return;
		}
		dispatch(ActionConstants.RECEIVED_DATA, body);

	});
}

var DataActions = {
	/**
	 * Change the url we are currently showing to the user and start downloading the data associated with it
	 */
	changeURL: function(url) {

		dispatch(ActionConstants.URL_CHANGE, {
			url: url
		});
		getDataForURL(url);
		
	},
	/**
	 * Go one step back in the URL stack
	 */
	goBack: function() {
		dispatch(ActionConstants.URL_BACKWARD);
		var url = DataStore.getURL();
		getDataForURL(url);

	}
};

module.exports = DataActions;