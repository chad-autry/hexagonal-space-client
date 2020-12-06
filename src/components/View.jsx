import React from "react";
import DataSource from "hex-grid-map/src/dataSources/DataSource.js";
import Map from "./Map.jsx";
import Table from "./Table.jsx";
import { Route, Switch, Link, Redirect } from "react-router-dom";

/**
 * The view component is responsible for making requests and populating the datasource for the Map and Table child components
 */
const View = class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: true,
      table: false,
      system: true,
      galaxy: false,
      hasMore: false,
      latestTurn: 0,
      turn: 0
    };
    this.baseDataLink = new DataSource();

    this.query = this.query.bind(this);
    this.collectAndQuery = this.collectAndQuery.bind(this);
    this.more = this.more.bind(this);
  }

  render() {
    return (
      <div>
        <form
          className="form-inline"
          style={{ zIndex: 300, position: "relative" }}>
          <div className="form-group">
            <div
              className="btn-group"
              role="group"
              style={{ marginRight: "5px" }}>
              <Route
                path="/view/table"
                children={({ match }) => (
                  <Link
                    className={`btn btn-default${match ? " active" : ""}`}
                    to="/view/table">
                    <i className="fa fa-th-list" /> List
                  </Link>
                )}
              />
              <Route
                path="/view/map"
                children={({ match }) => (
                  <Link
                    className={`btn btn-default${match ? " active" : ""}`}
                    to="/view/map">
                    <i className="fa fa-map" /> Map
                  </Link>
                )}
              />
            </div>
            <div
              className="btn-group"
              role="group"
              style={{ marginRight: "5px" }}>
              <button type="button" className="btn btn-default active">
                Solar System
              </button>
              <button
                type="button"
                className="btn btn-default"
                disabled="disabled">
                Galaxy
              </button>
            </div>
            <button
              type="button"
              className="btn btn-default active"
              disabled="disabled"
              style={{ marginRight: "5px" }}>
              <i className="fa fa-filter" /> Filter
            </button>
            <button
              type="button"
              className="btn btn-default"
              style={{ marginRight: "5px" }}
              disabled={!this.state.hasMore}
              onClick={this.more}>
              <i className="fa fa-forward" /> More
            </button>
            <button
              type="button"
              className="btn btn-default"
              style={{ marginRight: "5px" }}>
              <i className="fa fa-times-circle" /> Clear
            </button>

            <span
              className="input-group"
              role="group"
              style={{ marginRight: "5px" }}>
              <span className="input-group-addon">System</span>
              <input
                type="text"
                className="form-control"
                value="0:0"
                style={{ width: "7em", display: "inline-block" }}
                disabled="true:"
              />
            </span>
            <span
              className="input-group"
              role="group"
              style={{ marginRight: "5px" }}>
              <span className="input-group-addon">Turn</span>
              <input
                type="number"
                className="form-control"
                min="0"
                max={this.state.latestTurn}
                value={this.state.turn}
                style={{ width: "7em", display: "inline-block" }}
              />
            </span>
            <button
              type="button"
              className="btn btn-default"
              style={{ marginRight: "5px" }}
              onClick={this.collectAndQuery}>
              <i className="fa fa-mail-forward" /> Query
            </button>
          </div>
        </form>
        <Switch>
          <Route exact path="/view">
            <Redirect to="/view/map" />
          </Route>
          <Route
            path="/view/map"
            render={routeProps => (
              <Map dataLink={this.baseDataLink} {...routeProps} />
            )}
          />
          <Route
            path="/view/table"
            render={routeProps => (
              <Table dataLink={this.baseDataLink} {...routeProps} />
            )}
          />
        </Switch>
      </div>
    );
  }

  componentDidMount() {
    // Fetch the latest turn
    this.query({ turn: "latest", system: "0:0" });
  }

  collectAndQuery() {}

  more() {}
  /*
   * Use the fetch service to get map/list data
   */
  query(props) {
    this.props.fetchService.getJsonWithAuth(
      "/mapQuery",
      "application/json",
      json => {
        let turn = this.state.turn > 0 ? this.state.turn : json.latestTurn;
        this.setState({
          hasMore: json.hasMore,
          latestTurn: json.latestTurn,
          turn: turn
        });
        this.baseDataLink.addItems(json.entities);
      },
      () => {},
      props
    );
  }
};

export default View;
