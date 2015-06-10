'use strict';

var React = require('react');
var mui = require("material-ui");
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;
var RaisedButton = mui.RaisedButton;
var TextComponent = require("./TextComponent.js");
var BooleanComponent = require("./BooleanComponent.js");
var AddPropertyManager = require("./AddPropertyManager.js");
var request = require("browser-request");
var _ = require("lodash");
var DataStore = require("../stores/DataStore.js");
var ErrorStore = require("../stores/ErrorStore.js");
var DataActions = require("../actions/DataActions.js");

// CSS
require('normalize.css');
require('../styles/main.less');

var RestEditorApp = React.createClass({
	getInitialState: function() {
		DataActions.changeURL(this.props.url);
		return {
			url: DataStore.getURL(),
			contents: DataStore.getData(),
      loading: DataStore.isLoading()
		};
	},
	componentDidMount: function() {
		DataStore.addChangeListener((function() {
			this.setState({
				url: DataStore.getURL(),
				contents: DataStore.getData(),
        loading: DataStore.isLoading()
			});
		}).bind(this));
	},
	getChildContext: function() {
		//?? Nem tudom, miért kell, de itt van leírva: http://material-ui.com/#/customization/themes
		return {
	      muiTheme: ThemeManager.getCurrentTheme()
	    };
	},
	/**
	 * Called whenever we want to change which node we display. Fetches the data for that node
	 */
	updateURL: function(key) {
		var url = DataStore.getURL() + "/" + key;
    console.log(url);
		DataActions.changeURL(url);
	},

  	render: function() {


  		var contents;
  		if (_.isArray(this.state.contents)) {
  			contents =  this.renderArray();
  		} else {
  			contents = this.renderObject();
  		}

      if (this.state.loading) {
        contents = (<p>Loading...</p>);
      }

  		return (
  			<div className="rest-editor">
      			<AppBar title="Wand" />
            <div className="contents">
              <p>{this.state.url}</p>
      				{contents}
      			</div>
      		</div>
    	);

  		
  	},
  	/**
  	 * If the currently displayed node is an array, display its elements, with a details button for object
  	 */
  	renderArray: function() {
  		var elements = [];
  		for (var i = 0; i < this.state.contents.length; i++) {
  			var detailsButton = _.isObject(this.state.contents[i]) ? (<RaisedButton label="Details" onClick={this.updateURL.bind(this, this.state.contents[i]._id)} />) : "";
  			elements.push(<div>{this.state.contents[i]._id || this.state.contents[i]} {detailsButton}</div>);
  		}
  		return elements;
  		
  	},
  	/**
  	 * If the currently displayed node is an object, display all its keys with a details button for its embedded objects and arrays
  	 */
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
