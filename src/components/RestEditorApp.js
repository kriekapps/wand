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
			self.setState({contents: body });
		});
	},
	updateURL: function(event) {
		console.log(event.target);
		this.setState({
			url: this.state.url + "/" + event.target.textContent
		});
		this.fetchData();
	},
  	render: function() {
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
	  			elements.push(<div><RaisedButton label={key} primary={true} /></div>);
  			}
  			if (_.isObject(this.state.contents[key]) && !_.isArray(this.state.contents[key])) {
	  			elements.push(<div><RaisedButton label={key} secondary={true} onClick={this.updateURL}/></div>);
  			}
  		}
  		return (
  			<div className="rest-editor">
      			<AppBar title={"Rest editor for " + this.state.url} />
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
