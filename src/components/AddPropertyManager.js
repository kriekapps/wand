var React = require('react');
var mui = require("material-ui");
var TextField = mui.TextField;
var Dialog = mui.Dialog;
var DropDownMenu = mui.DropDownMenu;
var ThemeManager = new mui.Styles.ThemeManager();
var FloatingActionButton = mui.FloatingActionButton;
var NewPropertyDialog = require("./NewPropertyDialog.js");
var request = require("browser-request");

var AddPropertyManager = React.createClass({
	openDialog: function() {
		this.refs.newPropertyDialog.show();
	},
	addProperty: function(name, type) {
		var data = {};
		data[name] = type;
		request({
			method: "PATCH",
			url: this.props.url,
			json: data
		}, function(err, res, body) {
			
		});
	},
	render: function() {

		return (
			<div>
				<div className="add">
      				<FloatingActionButton onClick={this.openDialog} iconClassName="material-icons" label="add"/>
      			</div>
      			<NewPropertyDialog ref="newPropertyDialog" onSubmit={this.addProperty}/>
			</div>
		);
	}

});



module.exports = AddPropertyManager;