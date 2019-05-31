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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sagittis dictum libero in efficitur. Ut mattis pharetra sem, id ornare metus iaculis sit amet. Pellentesque et mi a diam viverra varius nec ac magna. In dapibus odio non venenatis blandit. Aenean lacinia vulputate nunc, eget vestibulum justo mattis id. Aliquam eu arcu ut sem varius tristique id sed felis. Curabitur sed libero id nulla cursus volutpat eu eu nulla. Morbi pulvinar, mauris quis mattis porta, metus leo luctus nulla, luctus blandit eros lorem non enim. Duis tristique ornare mi in rhoncus. Praesent non justo varius dolor placerat tincidunt aliquam sit amet ligula. Cras at nulla finibus, mattis dolor non, condimentum orci. Sed blandit tristique pretium. Suspendisse sit amet nunc vestibulum, condimentum lectus a, auctor urna."
  },
  {
    name: "Privacy Policy",
    version: "2.0",
    checked: false,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sagittis dictum libero in efficitur. Ut mattis pharetra sem, id ornare metus iaculis sit amet. Pellentesque et mi a diam viverra varius nec ac magna. In dapibus odio non venenatis blandit. Aenean lacinia vulputate nunc, eget vestibulum justo mattis id. Aliquam eu arcu ut sem varius tristique id sed felis. Curabitur sed libero id nulla cursus volutpat eu eu nulla. Morbi pulvinar, mauris quis mattis porta, metus leo luctus nulla, luctus blandit eros lorem non enim. Duis tristique ornare mi in rhoncus. Praesent non justo varius dolor placerat tincidunt aliquam sit amet ligula. Cras at nulla finibus, mattis dolor non, condimentum orci. Sed blandit tristique pretium. Suspendisse sit amet nunc vestibulum, condimentum lectus a, auctor urna."
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
