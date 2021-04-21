import React from "react";
import Map from "./Map.jsx";
import List from "./List.jsx";
import { Route, Switch, Redirect } from "react-router-dom";

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

    this.query = this.query.bind(this);
    this.queriedSystemChanged = this.queriedSystemChanged.bind(this);
    this.queriedTurnChanged = this.queriedTurnChanged.bind(this);
    this.queriedEntityChanged = this.queriedEntityChanged.bind(this);
    this.guestClicked = this.guestClicked.bind(this);
  }

  render() {
    return (
      <div>
        <button
          className={
            this.props.viewState.queryCollapsed
              ? "btn icon-btn btn-default"
              : "btn icon-btn btn-default hidden"
          }
          style={{ zIndex: 300, position: "relative" }}
          onClick={() => {
            this.props.setViewStateProperties({
              queryCollapsed: false
            });
          }}>
          <i className="fa fa-chevron-left" />
          {""}
        </button>
        <div
          className={
            this.props.viewState.queryCollapsed
              ? "panel panel-default hidden"
              : "panel panel-default"
          }
          style={{ zIndex: 300, position: "relative" }}>
          <div className="list-group">
            <div key="queryRow" className="list-group-item">
              <form
                className="form-inline"
                style={{ zIndex: 300, position: "relative", marginBottom: 0 }}>
                <div className="form-group">
                  <button
                    type="button"
                    className="btn icon-btn btn-default"
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      this.props.setViewStateProperties({
                        queryCollapsed: true
                      });
                    }}>
                    <i className="fa fa-chevron-right" />
                    {""}
                  </button>
                  <span
                    className="input-group"
                    role="group"
                    style={{ marginRight: "5px" }}>
                    <span className="input-group-addon">System</span>
                    <input
                      type="text"
                      className="form-control"
                      value={this.props.viewState.queriedSystem}
                      style={{ width: "7em", display: "inline-block" }}
                      onChange={this.queriedSystemChanged}
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
                      value={this.props.viewState.queriedTurn}
                      style={{ width: "7em", display: "inline-block" }}
                      onChange={this.queriedTurnChanged}
                    />
                  </span>
                  <span
                    className="input-group"
                    role="group"
                    style={{ marginRight: "5px" }}>
                    <span className="input-group-addon">Entity</span>
                    <input
                      type="text"
                      className="form-control"
                      value={this.props.viewState.queriedEntity}
                      style={{ width: "7em", display: "inline-block" }}
                      onChange={this.queriedEntityChanged}
                    />
                  </span>
                  <button
                    type="button"
                    className={
                      this.props.viewState.guestQuery
                        ? "btn btn-default active"
                        : "btn btn-default"
                    }
                    style={{ marginRight: "5px" }}
                    onClick={this.guestClicked}>
                    <i className="fa fa-user" /> Public
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    style={{ marginRight: "5px" }}
                    onClick={this.query}>
                    <i className="fa fa-mail-forward" /> Query
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    style={{ marginRight: "5px" }}
                    disabled={!this.state.hasMore}
                    onClick={this.query}>
                    <i className="fa fa-forward" /> More
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      this.props.viewState.baseDataLink.clear();
                    }}>
                    <i className="fa fa-times-circle" /> Clear
                  </button>
                </div>
              </form>
            </div>
            <div key="localRow" className="list-group-item">
              <button
                type="button"
                className="btn btn-default"
                style={{ marginRight: "5px" }}>
                <i className="fa fa-plus" /> Add Transform
              </button>
            </div>
          </div>
        </div>
        <Switch>
          <Route exact path="/view">
            <Redirect to="/view/map" />
          </Route>
          <Route
            path="/view/map"
            render={routeProps => (
              <Map
                dataLink={this.props.viewState.mapDataLink}
                addAlert={this.props.addAlert}
                setViewStateProperties={this.props.setViewStateProperties}
                initialMapCenter={this.props.viewState.initialMapCenter}
                {...routeProps}
              />
            )}
          />
          <Route
            path="/view/list"
            render={routeProps => (
              <List
                setViewStateProperties={this.props.setViewStateProperties}
                dataLink={this.props.viewState.listDataLink}
                {...routeProps}
              />
            )}
          />
        </Switch>
      </div>
    );
  }

  queriedSystemChanged(event) {
    if (event.target.value) {
      this.props.setViewStateProperties({
        queriedSystem: event.target.value,
        hasMore: false,
        lastRecord: {}
      });
    } else {
      this.props.setViewStateProperties({
        queriedSystem: "",
        hasMore: false,
        lastRecord: {}
      });
    }
  }

  queriedTurnChanged(event) {
    if (event.target.value) {
      this.props.setViewStateProperties({
        queriedTurn: event.target.value,
        hasMore: false,
        lastRecord: {}
      });
    } else {
      this.props.setViewStateProperties({
        queriedTurn: -1,
        hasMore: false,
        lastRecord: {}
      });
    }
  }

  queriedEntityChanged(event) {
    if (event.target.value) {
      this.props.setViewStateProperties({
        queriedEntity: event.target.value,
        hasMore: false,
        lastRecord: {}
      });
    } else {
      this.props.setViewStateProperties({
        queriedEntity: "",
        hasMore: false,
        lastRecord: {}
      });
    }
  }

  guestClicked() {
    this.props.setViewStateProperties({
      guestQuery: !this.props.viewState.guestQuery,
      hasMore: false,
      lastRecord: {}
    });
  }

  /*
   * Use the fetch service to get map/list data
   */
  query() {
    this.props.fetchService.getJsonWithAuth(
      "/mapQuery",
      "application/json",
      json => {
        let turn = this.state.turn > 0 ? this.state.turn : json.latestTurn;
        this.props.setViewStateProperties({
          hasMore: json.hasMore,
          lastRecord:
            json.entities.length > 0 ? json.entities[json.entities.length] : {}
        });
        this.setState({
          hasMore: json.hasMore,
          latestTurn: json.latestTurn,
          turn: turn
        });
        this.props.viewState.baseDataLink.addItems(json.entities);
      },
      () => {},
      {
        turn: this.props.viewState.queriedTurn,
        system: this.props.viewState.queriedSystem,
        entity: this.props.viewState.queriedEntity,
        guest: this.props.viewState.guest,
        lastRecord: this.props.viewState.lastRecord
      }
    );
  }
};

export default View;
