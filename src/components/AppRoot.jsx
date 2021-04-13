import NavBar from "./NavBar.jsx";
import Alerts from "./Alerts.jsx";
import DataSource from "../dataSources/baseDataSource.js";
import DynamicDataSource from "../dataSources/dynamicDataSource.js";
import React from "react";
import Measure from "react-measure";
import AuthorizingRoute from "./AuthorizingRoute.jsx";
import { Route, Redirect, Switch } from "react-router-dom";
import View from "./View.jsx";
import Code from "./Code.jsx";
import Ships from "./Ships.jsx";
import Docs from "./Docs.jsx";
import Login from "./Login.jsx";
import UserManagement from "./UserManagement.jsx";
import Policy from "./Policy.jsx";

const AppRoot = class AppRoot extends React.Component {
  constructor(props) {
    super(props);
    //Register for Authentication state changes
    this.props.authService.onAuthChange(() => {
      let isAuthenticated = this.props.authService.isAuthenticated();
      let pendingUserCreation = !!this.props.authService.getPayload()
        .pendingUserCreation;
      this.setState({
        pendingUserCreation: isAuthenticated && pendingUserCreation,
        isAuthenticated: isAuthenticated && !pendingUserCreation
      });
    });
    this.props.fetchService.listen("/newUser", beginRequest => {
      this.setState({
        fetchingPolicyAccepted: beginRequest
      });
    });
    this.props.fetchService.listen("/backend/login", beginRequest => {
      this.setState({
        logingOn: beginRequest
      });
    });
    let baseDataLink = new DataSource();
    let splitDataLink = new DynamicDataSource(
      { items: [] },
      `context.items = []; 
items.forEach(item => {
  // Check for duplicate
  // If duplicate exists, add id to 'seenBy'
  // Else add self
  item.self.key = item.self.entityId;
  context.items.add(item.self);
  //For each sensor result
  item.sensorData.forEach(sensorItem => {
    // Check for duplicate
    // If duplicate exists, add id to 'seenBy' array
    // Else add sensor item
    sensorItem.key = sensorItem.entityId;
    context.items.add(sensorItem);
  }); 
}); 
return true;`,
      ``,
      `context.items = [];`,
      `context.items.forEach(callback)`,
      `return context.items;`
    );
    baseDataLink.addListener({
      onDataChanged: event => {
        splitDataLink.clear();
        splitDataLink.addItems(baseDataLink.getAll());
      }
    });
    let listItemDataLink = new DynamicDataSource(
      { items: [] },
      `items.forEach(item => {
  // Check for duplicate
  // If duplicate exists, add id to 'seenBy'
  // Else add self
  context.items.add({"id":\`\${item.entityId}\`, "jsx":\`<li key='\${item.entityId}' className="list-group-item">
  <pre>{\\\`\${JSON.stringify(item, null, 4)}\\\`}</pre>
</li>\`});
}); 
return true;`,
      ``,
      `context.items = [];`,
      `context.items.forEach(callback)`,
      `return context.items;`
    ); //
    splitDataLink.addListener({
      onDataChanged: event => {
        listItemDataLink.clear();
        listItemDataLink.addItems(splitDataLink.getAll());
      }
    });
    //Global View state
    let viewState = {
      baseDataLink: baseDataLink,
      mapDataLink: splitDataLink,
      listDataLink: listItemDataLink,
      initialMapCenter: { u: 0, v: 0 },
      queryCollapsed: false,
      latestTurn: -1,
      guestQuery: false,
      queriedSystem: "0:0",
      queriedEntity: "",
      queriedTurn: -1,
      hasMore: false,
      lastRecord: {}
    };
    
    this.state = {
      viewState: viewState,
      fetchingPolicyAccepted: false,
      pendingUserCreation:
        this.props.authService.isAuthenticated() &&
        !!this.props.authService.getPayload().pendingUserCreation,
      isAuthenticated:
        this.props.authService.isAuthenticated() &&
        !this.props.authService.getPayload().pendingUserCreation,
      alerts: []
    };
    // This line is important!
    this.setNavHeight = this.setNavHeight.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.addAlert = this.addAlert.bind(this);
    this.setViewStateProperties = this.setViewStateProperties.bind(this);
  }

  setNavHeight(navbarHeight) {
    this.setState({
      navbarHeight: navbarHeight
    });
  }

  /**
   * Overrides current properties on the view state
   * @param {*} nextViewState an onject with the new properties of viewState
   */
  setViewStateProperties(nextViewState) {
    this.setState(prevState => ({
      viewState: {
        ...prevState.viewState,
        ...nextViewState
      }
    }));
  }

  removeAlert(index) {
    let alerts = this.state.alerts;
    alerts.splice(index, 1);
    this.setState({ alerts: alerts });
  }

  addAlert(alert) {
    let alerts = this.state.alerts;
    alerts.push(alert);
    this.setState({ alerts: alerts });
  }

  render() {
    return (
      <div>
        <Measure onMeasure={dimensions => this.setNavHeight(dimensions.height)}>
          <div style={{ marginBottom: 20 + "px" }}>
            <NavBar
              setNavHeight={this.setNavHeight}
              authService={this.props.authService}
              pendingUserCreation={this.state.pendingUserCreation}
              isAuthenticated={this.state.isAuthenticated}
              location={this.props.location}
            />
            {this.state.alerts.length > 0 && (
              <Alerts
                removeAlert={this.removeAlert}
                alerts={this.state.alerts}
              />
            )}
          </div>
        </Measure>
        <Switch>
          <Route
            path="/view"
            render={routeProps => (
              <View
                fetchService={this.props.fetchService}
                viewState={this.state.viewState}
                addAlert={this.addAlert}
                setViewStateProperties={this.setViewStateProperties}
                viewQueryCollapseClicked={this.viewQueryCollapseClicked}
                {...routeProps}
              />
            )}
          />
          <AuthorizingRoute
            path="/ships"
            addAlert={this.addAlert}
            navbarHeight={this.state.navbarHeight}
            authService={this.props.authService}
            fetchService={this.props.fetchService}
            component={Ships}
          />
          <AuthorizingRoute
            path="/code"
            addAlert={this.addAlert}
            navbarHeight={this.state.navbarHeight}
            authService={this.props.authService}
            fetchService={this.props.fetchService}
            component={Code}
          />
          <Route path="/docs" component={Docs} />
          <Route
            path="/login"
            render={routeProps => (
              <Login
                isAuthenticated={this.state.isAuthenticated}
                pendingUserCreation={this.state.pendingUserCreation}
                fetchService={this.props.fetchService}
                logingOn={this.state.logingOn}
                authService={this.props.authService}
                {...routeProps}
              />
            )}
          />
          <Route
            path="/policy"
            render={routeProps => (
              <Policy
                isAuthenticated={this.state.isAuthenticated}
                pendingUserCreation={this.state.pendingUserCreation}
                fetchingPolicyAccepted={this.state.fetchingPolicyAccepted}
                fetchService={this.props.fetchService}
                authService={this.props.authService}
                {...routeProps}
              />
            )}
          />
          <AuthorizingRoute
            path="/userMgmnt"
            authService={this.props.authService}
            fetchService={this.props.fetchService}
            component={UserManagement}
          />
          <Redirect from="*" to="/view/map" />
        </Switch>
      </div>
    );
  }
};

export default AppRoot;
