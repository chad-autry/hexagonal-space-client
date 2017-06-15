"use strict";
//This JS file simply bootstraps the app from the root component when the window loads
/*global window: false */

var AppRoot = require('./components/AppRoot.jsx');
var Map = require('./components/Map.jsx');
var Code = require('./components/Code.jsx');
var Docs = require('./components/Docs.jsx');
var IndexRedirect = require('react-router').IndexRedirect;
var Login = require('./components/Login.jsx');
var UserManagement = require('./components/UserManagement.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var Redirect = require('react-router').Redirect;
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var useRouterHistory = require('react-router').useRouterHistory;
var createHistory = require('history').createHistory;
var authjwt = require('client-auth-jwt/src/Auth.js');
var FetchService = require('./FetchService.js');

const history = useRouterHistory(createHistory)({
  basename: '/'
});

//Keep references to these outside of the function
var appRootComponent;

//This function executes immediately
(function() {
    let authService = new authjwt();
    authService.ProviderOAuthConfigs.google.clientId='757972958364-0ohbuao53bjsrf4ur68lui887tk05740.apps.googleusercontent.com';
    authService.ProviderOAuthConfigs.google.redirectUri= window.location.origin + '/backend/googleAuth';

    let fetchService = new FetchService();
    fetchService.setAuthService(authService);

    var rerouteUnauthorized = function(nextState, replaceState) {
        if (!authService.isAuthenticated()) {
            replaceState('/login');
        }
    };
    //This function is attached to execute when the window loads
    document.addEventListener('DOMContentLoaded', function() {
        
        ReactDOM.render(
            /* jshint ignore:start */
            <Router history={history}>
                <Route path="/" authService={authService} fetchService={fetchService} component={AppRoot}>
                    <IndexRedirect to="/map" />
                    <Route path="/map" component={Map}/>
                    <Route path="/code" component={Code} onEnter={rerouteUnauthorized}/>
                    <Route path="/docs" component={Docs}/>
                    <Route path="/login" authService={authService} component={Login}/>
                    <Route path="/userMgmnt" authService={authService} component={UserManagement} 
                        onEnter={rerouteUnauthorized}/>
                    <Redirect from="*" to="/map"/>
                </Route>
            </Router>, document.getElementById('app')
            /* jshint ignore:end */
        );

    });
})();
