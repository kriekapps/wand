var React = require('react');
var mui = require("material-ui");
var Checkbox = mui.Checkbox;
var request = require("browser-request");

var BooleanComponent = React.createClass({
	getInitialState: function() {
		return {
			value: !!this.props.value,
			key: this.props.keyValue,
			saveState: 0
		};
	},
	changeValue: function() {
		console.log("TRIGGER");
		this.setState({
			value: this.refs.field.isChecked(),
			saveState: 1
		});
		var self = this;
		clearTimeout(this.cooldown);
		this.cooldown = setTimeout(function() {
			self.saveChangeToServer();
		}, 500);
	},
	cooldown: 0,
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			value: nextProps.value,
		});
	},
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
		var state = this.state;
		var stateIndicator;
		if (state.saveState === 1) {
			stateIndicator = <i className="material-icons spinning">cached</i>
		}
		if (state.saveState === 2) {
			stateIndicator = <i className="material-icons" style={{color: "#4CAF50"}}>done</i>
		}
		if (state.saveState === 3) {
			stateIndicator = <i className="material-icons">warning</i>
		}
		return (
			<div className="BooleanComponent" >
				<Checkbox
					ref="field"
					label={[this.props.keyValue, stateIndicator]}
					defaultChecked={this.state.value}
					onCheck={this.changeValue}
					/>
			</div>
		);
	}

});

module.exports = BooleanComponent;