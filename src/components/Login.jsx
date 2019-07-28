import { Redirect } from "react-router-dom";
import React from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import LoadingOverlay from "react-loading-overlay";

const Login = class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/home" />;
    } else if (this.props.pendingUserCreation) {
      return <Redirect to="/policy" />;
    }
    const logingOn = this.props.logingOn;
    return (
      <LoadingOverlay
        active={logingOn}
        styles={{
          overlay: base => ({
            ...base,
            background: "rgba(0, 0, 0, 0.5)"
          })
        }}
        spinner={<LoadingSpinner />}
        text="Loading...">
        <div className="center-form panel">
          <div className="panel-body">
            <h2 className="text-center">Log in</h2>

            <button
              className="btn btn-block btn-google"
              onClick={() => this.props.authService.authenticate("google")}>
              <i className="fa fa-google"> </i> Log in or create new user with
              Google
            </button>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
};
export default Login;
