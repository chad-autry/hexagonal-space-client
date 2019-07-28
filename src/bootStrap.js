//This JS file simply bootstraps the app from the root component when the window loads
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import AppRoot from "./components/AppRoot.jsx";
import authjwt from "client-auth-jwt/src/Auth.js";
import FetchService from "./FetchService.js";

//This function executes immediately
(function() {
  let authService = new authjwt();
  authService.ProviderOAuthConfigs.google.clientId =
    "757972958364-0ohbuao53bjsrf4ur68lui887tk05740.apps.googleusercontent.com";
  authService.ProviderOAuthConfigs.google.redirectUri =
    window.location.origin + + "/auth";

  let fetchService = new FetchService();
  fetchService.setAuthService(authService);

  //This function is attached to execute when the window loads
  document.addEventListener("DOMContentLoaded", function() {
    ReactDOM.render(
      <Router basename="/">
        <Route
          render={routeProps => (
            <AppRoot
              location={routeProps.location}
              fetchService={fetchService}
              authService={authService}
              {...routeProps}
            />
          )}
        />
      </Router>,
      document.getElementById("app")
    );
  });
})();
