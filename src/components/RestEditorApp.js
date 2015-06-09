'use strict';

var React = require('react');
var mui = require("material-ui");
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;
var Checkbox = mui.Checkbox;
var RaisedButton = mui.RaisedButton;
var TextComponent = require("./TextComponent.js");
var request = require("browser-request");
var _ = require("lodash");

// CSS
require('normalize.css');
require('../styles/main.less');

var RestEditorApp = React.createClass({
	getInitialState: function() {
		return {};
	},
	componentDidMount: function() {
		var self = this;
		request.get(this.props.url, function(err, res, body) {
			try {
				body = JSON.parse(body)
			} catch(err) {
				console.log(err);
			}
			self.setState(body);
		});
	},
	getChildContext: function() {
		//?? Nem tudom, miért kell, de itt van leírva: http://material-ui.com/#/customization/themes
		return {
	      muiTheme: ThemeManager.getCurrentTheme()
	    };
	},
  	render: function() {
  		var elements = [];
  		for (var key in this.state) {
  			if (_.isString(this.state[key]) || _.isNumber(this.state[key])) {
	  			elements.push(<TextComponent
	  							value={this.state[key]}
	  							keyValue={key} 
	  							url={this.props.url} />);
  			}
  			if (_.isBoolean(this.state[key])) {
	  			elements.push(<Checkbox
								  checked={this.state[key]}
								  label={key} />);
  			}
  			if (_.isArray(this.state[key])) {
	  			elements.push(<div><RaisedButton label={key} primary={true} /></div>);
  			}
  			if (_.isObject(this.state[key]) && !_.isArray(this.state[key])) {
	  			elements.push(<div><RaisedButton label={key} secondary={true} /></div>);
  			}
  		}
  		return (
  			<div className="rest-editor">
      			<AppBar title={"Rest editor for " + this.props.url} />
      			<div className="contents">
      				{elements}
      			</div>
      		</div>
    	);
  	}
});

//?? Nem tudom, miért kell, de itt van leírva: http://material-ui.com/#/customization/themes
RestEditorApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = RestEditorApp;
