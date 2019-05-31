import { Route, Redirect } from "react-router-dom";
import React from "react";

const AuthorizingRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.authService.isAuthenticated() ? (
        <Component {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default AuthorizingRoute;
