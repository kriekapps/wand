var React = require('react');
var mui = require("material-ui");

var TextComponent = React.createClass({
	getInitialState: function() {
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
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			value: nextProps.value,
			key: nextProps.keyValue
		});
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
			}, 1000);
		});
	},
	render: function() {
		var stateIndicator;
		if (this.state.saveState === 1) {
			stateIndicator = <i className="material-icons spinning">cached</i>
		}
		if (this.state.saveState === 2) {
			stateIndicator = <i className="material-icons" style={{color: "#4CAF50"}}>done</i>
		}
		if (this.state.saveState === 3) {
			stateIndicator = <i className="material-icons">warning</i>
		}
		return (
			<div className="TextComponent" >
				<TextField
					ref="field"
					hintText="Enter value"
					floatingLabelText={this.state.key} 
					value={this.state.value} 
					onChange={this.changeValue}
					/>
				{stateIndicator}
			</div>
		);
	}

});

module.exports = TextComponent;