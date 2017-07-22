"use strict";
//This JS file simply bootstraps the app from the root component when the window loads
/*global window: false */

var AuthorizingRoute = require('./components/AuthorizingRoute.jsx');
var AppRoot = require('./components/AppRoot.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var authjwt = require('client-auth-jwt/src/Auth.js');
var FetchService = require('./FetchService.js');
var Router = require('react-router-dom').BrowserRouter;
var Route = require('react-router-dom').Route;

//This function executes immediately
(function() {
    let authService = new authjwt();
    authService.ProviderOAuthConfigs.google.clientId='757972958364-0ohbuao53bjsrf4ur68lui887tk05740.apps.googleusercontent.com';
    authService.ProviderOAuthConfigs.google.redirectUri= window.location.origin + '/backend/auth/googleAuth';

    let fetchService = new FetchService();
    fetchService.setAuthService(authService);

    //This function is attached to execute when the window loads
    document.addEventListener('DOMContentLoaded', function() {
        
        ReactDOM.render(
            /* jshint ignore:start */
            <Router>
                <Route path="/" render={(routeProps) => <AppRoot location={routeProps.location} fetchService={fetchService} authService={authService} {...routeProps} />}/>
            </Router>, document.getElementById('app')
            /* jshint ignore:end */
        );

    });
})();
