var React = require('react');

/**
 * Create a React component for displaying alerts
 */
module.exports = class Alerts extends React.Component{

    constructor(props) {
        super(props);
    }


    render() {
        let alerts = [];
        for (let i = 0; i < this.props.alerts.length; i++) {
            /* jshint ignore:start */
            alerts.push(<div key={i} className={"alert alert-"+this.props.alerts[i].type} role="alert">
              <button type="button" className="close" onClick={() => {this.props.removeAlert(i)}} aria-label="Close"><span aria-hidden="true">&times;</span></button>{this.props.alerts[i].text}</div>);
            /* jshint ignore:end */
        }
        return (
            /* jshint ignore:start */
            <div>
                {alerts}
            </div>
            /* jshint ignore:end */
        );
    }
};
