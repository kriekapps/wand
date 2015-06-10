'use strict';

var React = require('react');
var mui = require("material-ui");
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;
var RaisedButton = mui.RaisedButton;
var TextComponent = require("./TextComponent.js");
var BooleanComponent = require("./BooleanComponent.js");
var request = require("browser-request");
var _ = require("lodash");

// CSS
require('normalize.css');
require('../styles/main.less');

var RestEditorApp = React.createClass({
	getInitialState: function() {
		return {
			url: this.props.url,
			urlStack: [this.props.url],
			contents: {}
		};
	},
	componentDidMount: function() {
		var self = this;
		this.fetchData();
	},
	getChildContext: function() {
		//?? Nem tudom, miért kell, de itt van leírva: http://material-ui.com/#/customization/themes
		return {
	      muiTheme: ThemeManager.getCurrentTheme()
	    };
	},
	fetchData: function() {
		var self = this;
		request.get(this.state.url, function(err, res, body) {
			try {
				body = JSON.parse(body)
			} catch(err) {
				console.log(err);
			}
			self.setState({
				contents: body,
			});
		});
	},
	updateURL: function(key) {
		console.log(key);
		var self = this;
		var url = this.state.url + "/" + key;
		var newStack = this.state.urlStack.slice().concat(this.state.url);
		this.setState({
			url: url,
			urlStack: newStack
		}, function() {
			this.fetchData();
		});
	},
	back: function() {
		var stack = this.state.urlStack.slice();
		var url = stack.pop();
		this.setState({
			url: url,
			urlStack: stack
		}, function() {
			this.fetchData();
		});
	},
  	render: function() {
  		var contents;
  		if (_.isArray(this.state.contents)) {
  			contents =  this.renderArray();
  		} else {
  			contents = this.renderObject();
  		}

  		var backButton;
  		if (this.state.urlStack.length > 1) {
  			backButton = (<div><RaisedButton label="< Back" onClick={this.back} /></div>);
  		}

  		return (
  			<div className="rest-editor">
      			<AppBar title={"Rest editor for " + this.state.url} />
      			<div className="contents">
  					{backButton}
      				{contents}
      			</div>
      		</div>
    	);

  		
  	},
  	renderArray: function() {
  		var elements = [];
  		for (var i = 0; i < this.state.contents.length; i++) {
  			elements.push(<div>{this.state.contents[i]._id} <RaisedButton label="Details" onClick={this.updateURL.bind(this, this.state.contents[i]._id)} /></div>);
  		}
  		return elements;
  		
  	},
  	renderObject: function() {
  		var elements = [];
  		for (var key in this.state.contents) {
  			if (_.isString(this.state.contents[key]) || _.isNumber(this.state.contents[key])) {
	  			elements.push(<TextComponent
	  							value={this.state.contents[key]}
	  							keyValue={key} 
	  							url={this.state.url} />);
  			}
  			if (_.isBoolean(this.state.contents[key])) {
	  			elements.push(<BooleanComponent
								  value={this.state.contents[key]}
								  keyValue={key} 
								  url={this.state.url} />);
  			}
  			if (_.isArray(this.state.contents[key])) {
	  			elements.push(<div><RaisedButton label={key} primary={true} onClick={this.updateURL.bind(this, key)} /></div>);
  			}
  			if (_.isObject(this.state.contents[key]) && !_.isArray(this.state.contents[key])) {
	  			elements.push(<div><RaisedButton label={key} secondary={true} onClick={this.updateURL.bind(this, key)} /></div>);
  			}
  		}

  		return elements;

  	}
});

//?? Nem tudom, miért kell, de itt van leírva: http://material-ui.com/#/customization/themes
RestEditorApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = RestEditorApp;
