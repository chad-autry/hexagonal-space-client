var NavBar = require('./NavBar.jsx');
var Alerts = require('./Alerts.jsx');
var React = require('react');
var Measure = require('react-measure');


module.exports = class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        //Register for Authentication state changes
        this.props.route.authService.onAuthChange(() => {
            this.setState({
                isAuthenticated: this.props.route.authService.isAuthenticated()
            });

        });
        this.state = {isAuthenticated: this.props.route.authService.isAuthenticated(), alerts:[]};
        // This line is important!
        this.setNavHeight = this.setNavHeight.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.addAlert = this.addAlert.bind(this);
    }    

    setNavHeight(navbarHeight) {
        this.setState({
           "navbarHeight": navbarHeight
        });
    }

    removeAlert(index) {
        let alerts = this.state.alerts;
        alerts.splice(index, 1);
        this.setState({"alerts": alerts});
    }

    addAlert(alert) {
        let alerts = this.state.alerts;
        alerts.push(alert);
        this.setState({"alerts": alerts});
    }

    render() {
        var childrenWithProps = React.cloneElement(this.props.children, {addAlert: this.addAlert, isAuthenticated: this.state.isAuthenticated,
            navbarHeight:this.state.navbarHeight});
        return (
            /* jshint ignore:start */
            <div className="container">
                <Measure onMeasure={(dimensions) => this.setNavHeight(dimensions.height)}>
                <div style={{marginBottom:20 + 'px'}}>
                    <NavBar setNavHeight={this.setNavHeight} authService={this.props.route.authService} isAuthenticated={this.state.isAuthenticated}/>
                    {this.state.alerts.length > 0 &&
                    <Alerts removeAlert={this.removeAlert} alerts={this.state.alerts}/>
                    }
                </div>
                </Measure>
                {childrenWithProps}
            </div>
            /* jshint ignore:end */
        );
    }
};
