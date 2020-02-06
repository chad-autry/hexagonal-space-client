import React from "react";
import EmittingDataSource from "data-chains/src/EmittingDataSource.js";
import Map from "./Map.jsx";
import { Route } from "react-router-dom";

/**
 * The view component is responsible for making requests and populating the datasource for the Map and Table child components
 */
const View = class View extends React.Component {
  constructor(props) {
    super(props);

    this.baseDataLink = new EmittingDataSource();
  }

  render() {
    return (
      <div>
        <div
          className="btn-toolbar"
          role="toolbar"
          style={{ zIndex: 300, position: "relative" }}>
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-default">
              Table
            </button>
            <button type="button" className="btn btn-default">
              Map
            </button>
          </div>
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-default">
              Solar System
            </button>
            <button type="button" className="btn btn-default">
              Galaxy
            </button>
          </div>
        </div>

        <Route
          path="/view/map"
          render={routeProps => (
            <Map dataLink={this.baseDataLink} {...routeProps} />
          )}
        />
      </div>
    );
  }

  componentDidMount() {
    // Fetch the latest turn
    this.props.fetchService.getJson(
      "/backend/view/system",
      "application/json",
      json => {
        this.baseDataLink.addItems(json.items);
      },
      () => {},
      { turn: "latest", system: "0:0" }
    );
  }
};

export default View;
