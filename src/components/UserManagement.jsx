import React from "react";
import Redirect from "react-router-dom";

const UserManagement = class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToLogin: false };
    // This line is important!
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.authService.logout();
    this.setState({ redirectToLogin: true });
  }

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="container">
        <div className="center-form panel">
          <div className="jumbotron" onClick={this.logout}>
            <h1 className="text-center">Click me to log out</h1>
          </div>
        </div>
      </div>
    );
  }
};

export default UserManagement;
