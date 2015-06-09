var React = require('react');
var mui = require("material-ui");
var TextField = mui.TextField;
var request = require("browser-request");


/**
 * States:
 * 0 - Standing by
 * 1 - loading
 * 2 - success
 * 3 - failure
 */

var TextComponent = React.createClass({
	getInitialState: function() {
		console.log(this.props)
		return {
			value: this.props.value,
			key: this.props.keyValue,
			saveState: 0
		};
	},
	changeValue: function() {
		this.setState({
			value: this.refs.field.getValue(),
			saveState: 1
		});
		var self = this;
		clearTimeout(this.cooldown);
		this.cooldown = setTimeout(function() {
			self.saveChangeToServer();
		}, 500);
	},
	cooldown: 0,
	saveChangeToServer: function() {
		var data = {};
		data[this.props.keyValue] = this.state.value;
		var self = this;
		request({
			method: "PATCH",
			url: this.props.url,
			json: data
		}, function(err, res, body) {
			self.setState({
				saveState: 2
			});
			setTimeout(function() {
				if (self.state.saveState === 2 || self.state.saveState === 1 && !self.cooldown) {
					self.setState({
						saveState: 0
					});
				}
			}, 500);
		});
	},
	render: function() {
		var state = this.state;
		var stateIndicator = "";
		if (state.saveState === 1) {
			stateIndicator = "Saving..."
		}
		if (state.saveState === 2) {
			stateIndicator = "Saved."
		}
		if (state.saveState === 3) {
			stateIndicator = "Saving failed!"
		}
		return (
			<TextField
				ref="field"
				hintText="Enter value"
				floatingLabelText={this.props.keyValue + " " + stateIndicator} 
				value={state.value} 
				onChange={this.changeValue}
				/>
		);
	}

});

module.exports = TextComponent;