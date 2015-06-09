'use strict';

var RestEditorApp = require('./RestEditorApp');
var React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var content = document.getElementById('content');

React.render(<RestEditorApp url="http://cantrip.kriekapps.com/marci" />, content);
