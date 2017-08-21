import NavBar from './NavBar.jsx';
import Alerts from './Alerts.jsx';
import React from 'react';
import Measure from 'react-measure';
import AuthorizingRoute from './AuthorizingRoute.jsx';
import { Route, Redirect, Switch } from 'react-router-dom';
import View from './View.jsx';
import Code from './Code.jsx';
import Docs from './Docs.jsx';
import Login from './Login.jsx';
import UserManagement from './UserManagement.jsx';


const AppRoot = class AppRoot extends React.Component {
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
                    <Route path="/view" render={(routeProps) => <View fetchService={this.props.fetchService} {...routeProps} />}/>
                    <AuthorizingRoute path="/code" navbarHeight={this.state.navbarHeight} authService={this.props.authService} fetchService={this.props.fetchService} component={Code}/>
                    <Route path="/docs" component={Docs}/>
                    <Route path="/login" render={(routeProps) => <Login isAuthenticated={this.state.isAuthenticated} authService={this.props.authService} {...routeProps} />}/>
                    <AuthorizingRoute path="/userMgmnt" authService={this.props.authService} component={UserManagement}/>
                    <Redirect from="*" to="/view/map"/>
               </Switch>
            </div>
        );
    }
};

export default AppRoot;
