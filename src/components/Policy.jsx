import Redirect from "react-router-dom";
import React from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import LoadingOverlay from "react-loading-overlay";

//Hard coded policies by default, but would be fairly simple to make a request to fetch them from the server
const policies = [
  {
    name: "Terms of Service",
    version: "1.0",
    checked: false,
    text:
      "This is alpha I can cancel your account at any time, for any reason. All data (scripts, game actions) submitted to the application outside of private data is considered application data and may be retained independent of your account."
  },
  {
    name: "Privacy Policy",
    version: "1.0",
    checked: false,
    text:
      "Your private data will not be sold or given away. It will be treated with care. Minimal data will be collected."
  }
];
const Policy = class Policy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { policies: policies };
    // This line is important!
    this.policyCheckClicked = this.policyCheckClicked.bind(this);
  }

  policyCheckClicked(index) {
    //Bit of a hacky way to create a new policies array so we don't mutate the state
    let newPolicies = JSON.parse(JSON.stringify(this.state.policies));
    newPolicies[index].checked = !newPolicies[index].checked;
    this.setState({ policies: newPolicies });
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/home" />;
    }
    if (!this.props.pendingUserCreation) {
      return <Redirect to="/login" />;
    }
    const creatingUser = this.props.fetchingPolicyAccepted;
    return (
      <LoadingOverlay
        active={creatingUser}
        styles={{
          overlay: base => ({
            ...base,
            background: "rgba(0, 0, 0, 0.5)"
          })
        }}
        spinner={<LoadingSpinner />}
        text="Loading...">
        <PoliciesList
          policies={this.state.policies}
          policyCheckClicked={this.policyCheckClicked}
        />
        <ButtonsDiv
          fetchService={this.props.fetchService}
          authService={this.props.authService}
          policies={this.state.policies}
        />
      </LoadingOverlay>
    );
  }
};

const PoliciesList = class PoliciesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.policies.map((item, index) => (
          //This is where the individual policies could be broken down further into another repeated component
          <div key={index + "policyPanel"} className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">{item.name}</h3>
            </div>
            <div className="panel-body">
              <h6 className="text-center">{item.text}</h6>
            </div>
            <div className="panel-footer">
              <h3
                className="panel-title"
                onClick={() => this.props.policyCheckClicked(index)}>
                Accept:
                <i
                  className={
                    this.props.policies[index].checked
                      ? "fa fa-check-square-o"
                      : "fa fa-square-o"
                  }
                />
              </h3>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

const ButtonsDiv = class ButtonsDiv extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="center-form panel">
        <div className="panel-body">
          <button
            className={
              this.props.policies.reduce((accumulator, currentValue) => {
                return accumulator && currentValue.checked;
              }, true)
                ? "btn btn-lg btn-block btn-success"
                : "btn btn-lg btn-block btn-success disabled"
            }
            onClick={() => {
              if (
                this.props.policies.reduce((accumulator, currentValue) => {
                  return accumulator && currentValue.checked;
                }, true)
              ) {
                this.props.fetchService.getJsonWithAuth(
                  "/backend/policyAccepted",
                  "application/json",
                  json => {
                    //Success
                    this.props.authService.setToken(json.token);
                  },
                  json => {
                    //Failure
                    // eslint-disable-next-line no-console
                    console.log(JSON.parse(json));
                  },
                  { acceptedPolicy: this.props.policies }
                );
              }
            }}>
            Create User
          </button>
          <button
            className="btn btn-lg btn-block btn-success"
            onClick={() => this.props.authService.logout()}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
};

export default Policy;
