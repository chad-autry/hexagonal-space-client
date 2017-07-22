var NavBar = require('./NavBar.jsx');
var Alerts = require('./Alerts.jsx');
var React = require('react');
var Measure = require('react-measure');
var AuthorizingRoute = require('./AuthorizingRoute.jsx');
var Route = require('react-router-dom').Route;
var Redirect = require('react-router-dom').Redirect;
var Switch = require('react-router-dom').Switch;
var Map = require('./Map.jsx');
var Code = require('./Code.jsx');
var Docs = require('./Docs.jsx');
var Login = require('./Login.jsx');
var UserManagement = require('./UserManagement.jsx');


module.exports = class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        //Register for Authentication state changes
        this.props.authService.onAuthChange(() => {
            this.setState({
                isAuthenticated: this.props.authService.isAuthenticated()
            });

        });
        this.state = {isAuthenticated: this.props.authService.isAuthenticated(), alerts:[]};
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
        return (
            /* jshint ignore:start */
            <div className="container">
                <Measure onMeasure={(dimensions) => this.setNavHeight(dimensions.height)}>
                <div style={{marginBottom:20 + 'px'}}>
                    <NavBar setNavHeight={this.setNavHeight} authService={this.props.authService} isAuthenticated={this.state.isAuthenticated} location={this.props.location}/>
                    {this.state.alerts.length > 0 &&
                    <Alerts removeAlert={this.removeAlert} alerts={this.state.alerts}/>
                    }
                </div>
                </Measure>
                <Switch>
                    <Route path="/map" component={Map}/>
                    <AuthorizingRoute path="/code" navbarHeight={this.state.navbarHeight} authService={this.props.authService} fetchService={this.props.fetchService} component={Code}/>
                    <Route path="/docs" component={Docs}/>
                    <Route path="/login" render={(routeProps) => <Login isAuthenticated={this.state.isAuthenticated} authService={this.props.authService} {...routeProps} />}/>
                    <AuthorizingRoute path="/userMgmnt" authService={this.props.authService} component={UserManagement}/>
                    <Redirect from="*" to="/map"/>
               </Switch>
            </div>
            /* jshint ignore:end */
        );
    }
};
