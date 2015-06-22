var keyMirror = require("keyMirror");
var _ = require("lodash");

var constants = keyMirror({
	URL_CHANGE: null,
	URL_BACKWARD: null,
	NETWORK_LOADING_STARTED: null,
	NETWORK_ERROR: null,
	NETWORK_LOADING_FINISHED: null,
	ERROR: null,
	RECEIVED_DATA: null
});

//Aliases
constants = _.merge(constants, {
	URL_FORWARD: "URL_CHANGE"
});

module.exports = constants;