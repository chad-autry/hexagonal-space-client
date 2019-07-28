import Redirect from "react-router-dom";
import React from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import LoadingOverlay from "react-loading-overlay";

const UserManagement = class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToLogin: false, loadingUser: true };
    // This line is important!
    this.logout = this.logout.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  logout() {
    this.props.authService.logout();
    this.setState({ redirectToLogin: true });
  }

  deleteUser() {
    this.props.fetchService.putWithAuth(
      "/deleteUser",
      "application/json",
      () => {
        //Success
      },
      json => {
        //Failure
        // eslint-disable-next-line no-console
        console.log(JSON.parse(json));
      }
    );
    this.props.authService.logout();
    this.setState({ redirectToLogin: true });
  }

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="center-form panel">
        <div className="panel-body">
          <button
            className="btn btn-lg btn-block btn-success"
            onClick={this.logout}>
            Log Out
          </button>
          <LoadingOverlay
            active={this.state.loadingUser}
            styles={{
              overlay: base => ({
                ...base,
                background: "rgba(0, 0, 0, 0.5)"
              })
            }}
            spinner={<LoadingSpinner />}
            text="Loading...">
            <pre>{JSON.stringify(this.state.user, null, 4)}</pre>
          </LoadingOverlay>
          <button
            className="btb btn-lg btn-block btn-danger"
            onClick={this.deleteUser}>
            Delete User
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.fetchService.getJsonWithAuth(
      "/getUser",
      "application/json",
      json => {
        //Success
        this.setState({
          loadingUser: false,
          user: json
        });
      },
      json => {
        //Failure
        // eslint-disable-next-line no-console
        console.log(JSON.parse(json));
      }
    );
  }
};

export default UserManagement;
