import React from "react";
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner.jsx";
import LoadingOverlay from "react-loading-overlay";

// Render editor
const Ships = class Ships extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: null,
      codeList: { shipScripts: [] },
      listingShips: true,
      allowNew: false
    };
    // Bind the methods to the object's this
    this.nameFilterChanged = this.nameFilterChanged.bind(this);
    this.getShips = this.getShips.bind(this);
  }

  componentDidMount() {
    this.getShips();
  }

  nameFilterChanged(event) {
    if (event.target.value) {
      this.setState({ nameFilter: event.target.value });
    } else {
      this.setState({ nameFilter: "" });
    }
  }

  getShips(nameFilter) {
    this.setState({
      listingCode: true
    });
    this.props.fetchService.getJsonWithAuth(
      "/listShips",
      "application/json",
      json => {
        this.setState({
          hasMore: json.hasMore,
          shipList: json,
          listingShips: false,
          allowNew: json.allowNew
        });
      },
      () => {},
      { nameFilter: nameFilter ? nameFilter : this.state.nameFilter }
    );
  }

  render() {
    let shipList = [];
    if (this.state.listingShips) {
      shipList.push(
        <li className="list-group-item" key="iamauniquesnowflake">
          <LoadingOverlay
            active={true}
            styles={{
              overlay: base => ({
                ...base,
                background: "rgba(0, 0, 0, 0.5)"
              })
            }}
            spinner={<LoadingSpinner />}
            text="Loading...">
            <p> </p>
          </LoadingOverlay>
        </li>
      );
    } else if (this.state.shipList.ships) {
      for (let i = 0; i < this.state.shipList.ships.length; i++) {
        /* eslint-disable react/no-children-prop */
        shipList.push(
          <ShipRow
            key={this.state.shipList.ships[i].id}
            name={this.state.shipList.ships[i].name}
            fetchService={this.props.fetchService}
            shipId={this.state.shipList.ships[i].id}
          />
        );
      }
    }

    return (
      <div>
        <form
          className="form-inline"
          style={{ zIndex: 300, position: "relative" }}>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={this.state.nameFilter}
                onChange={this.nameFilterChanged}
                placeholder="Show ship names beggining at..."
                aria-describedby="names start"
              />
              <span className="input-group-btn">
                <button
                  className="btn icon-btn input-grp-middle btn-default"
                  onClick={() => {
                    this.getList(this.state.nameFilter);
                  }}>
                  <i className={"fa fa-search"} />
                </button>
              </span>
              <span className="input-group-btn">
                <button
                  className="btn icon-btn btn-default"
                  onClick={() => {
                    this.getList(
                      this.state.shipList.ships[
                        this.state.shipList.ships.length - 1
                      ].title + " "
                    );
                  }}
                  disabled={!this.state.hasMore}>
                  <i className={"fa fa-mail-forward"} />
                </button>
              </span>
            </div>
            <button
              type="button"
              className="btn btn-default active"
              disabled={!this.state.allowNew}
              style={{ marginRight: "5px" }}>
              <i className="fa fa-plus" /> New Ship
            </button>
          </div>
        </form>
        <div className="panel panel-default">
          <ul className="list-group">{shipList}</ul>
        </div>
      </div>
    );
  }
};

class ShipRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      listingCodeBodies: false,
      hasMore: false,
      hasMoreClicked: false
    };
    // Bind the methods to the object's this
    this.fetchShipDetails = this.fetchShipDetails.bind(this);
  }

  fetchShipDetails() {
    this.setState({
      fetchingDetails: true
    });
    this.props.fetchService.getJsonWithAuth(
      "/shipDetails",
      "application/json",
      json => {
        this.setState({
          fetchingDetails: false,
          shipDetails: json
        });
      },
      () => {},
      {
        shipId: this.props.shipId
      }
    );
  }

  render() {
    return (
      <li className="list-group-item" key={this.state.id}>
        <button
          type="button"
          className="btn btn-link text-muted no-padding"
          onClick={() => {
            if (this.state.fetchingDetails) {
              this.setState({
                fetchingDetails: false
              });
              //this.listCodeBodies(Number.MAX_SAFE_INTEGER);
            } else {
              this.setState({
                fetchingDetails: true
              });
            }
          }}>
          <i
            className={
              this.state.fetchingDetails
                ? "fa fa-chevron-up"
                : "fa fa-chevron-down"
            }
          />
        </button>
        {" " + this.props.name}{" "}
        <button
          type="button"
          className="btn btn-link text-muted no-padding"
          onClick={() => {
            this.props.codeClicked(this.props.title, this.props.latestHash);
          }}>
          <i className="fa fa-code fa-fw" />
        </button>
        <button
          type="button"
          className="btn btn-link text-muted no-padding"
          onClick={() => {
            this.props.addAlert({
              type: "info",
              text: this.props.latestHash
            });
          }}>
          <i className="fa fa-hashtag fa-fw" />
        </button>
        <button
          type="button"
          className="btn btn-link text-muted no-padding"
          onClick={() => {
            this.listCodeBodies(Number.MAX_SAFE_INTEGER);
          }}
          disabled={!this.state.hasMoreClicked}>
          <i className="fa fa-refresh fa-fw" />
        </button>
        <button
          type="button"
          className="btn btn-link text-muted no-padding"
          onClick={() => {
            this.listCodeBodies(
              this.state.codeBodies[this.state.codeBodies.length - 1].createTs
            );
          }}
          disabled={!this.state.hasMore}>
          <i className="fa fa-mail-forward fa-fw" />
        </button>
        {" " + moment(this.props.latestCreateTs * 1000).fromNow()}
      </li>
    );
  }
}

export default Ships;
