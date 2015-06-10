var React = require('react');
var mui = require("material-ui");
var TextField = mui.TextField;
var Dialog = mui.Dialog;
var DropDownMenu = mui.DropDownMenu;
var ThemeManager = new mui.Styles.ThemeManager();

var NewPropertyDialog = React.createClass({
	getInitialState: function() {
		return {
			name: "",
			type: ""
		};
	},
	getChildContext: function() {
		//?? Nem tudom, miért kell, de itt van leírva: http://material-ui.com/#/customization/themes
		return {
	      muiTheme: ThemeManager.getCurrentTheme()
	    };
	},
	hide: function() {
		this.refs.dialog.dismiss();
	},
	show: function() {
		this.reset();
		this.refs.dialog.show();
	},
	changeName: function() {
		this.setState({
			name: this.refs.name.getValue()
		});
	},
	changeType: function(event, index) {
		this.setState({
			type: ["", [], {}][index]
		});
	},
	reset: function() {
		this.setState({
			name: "",
			type: ""
		});
	},
	_submit: function() {
		if (this.state.name !== "") {
			console.log(this.state);
			this.props.onSubmit(
				this.state.name,
				this.state.type
			);
			this.hide();
		}
	},
	render: function() {

		var typeValues = [
			{ payload: "String", text: "String / Number"},
			{ payload: "Array", text: "Array"},
			{ payload: "Object", text: "Object"},
		];

		var actions = [
			{ text: "Cancel", onClick: this.hide },
			{ text: "Submit", onClick: this._submit }
		];

		return (
			<Dialog
				title="Add new property"
				actions={actions}
				ref="dialog"
				>
				<div className="NewPropertyDialog" >
					<TextField
						ref="name"
						hintText="Add new property"
						floatingLabelText="New property name" 
						value={this.state.name} 
						onChange={this.changeName}
						/>
				</div>
				<p>Select the type of the property</p>
				<DropDownMenu menuItems={typeValues} ref="type" value={this.state.type} onChange={this.changeType} />
			</Dialog>
		);
	}

});

NewPropertyDialog.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = NewPropertyDialog;