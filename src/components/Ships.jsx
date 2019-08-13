import React from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import LoadingOverlay from "react-loading-overlay";

// Render editor
const Ships = class Ships extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipList: { ships: [] },
      hasMoreShips: false,
      listingShips: false,
      type: "ships"
    };
    // Bind the methods to the object's this
    this.nameFilterChanged = this.nameFilterChanged.bind(this);
    this.getList = this.getList.bind(this);
  }

  componentDidMount() {
    this.getList();
  }

  nameFilterChanged(event) {
    if (event.target.value) {
      this.setState({ nameFilter: event.target.value });
    } else {
      this.setState({ nameFilter: "" });
    }
  }

  getList(nameFilter) {
    this.setState({
      listingShips: true
    });
    this.props.fetchService.getJsonWithAuth(
      "/shipsList",
      "application/json",
      json => {
        this.setState({
          hasMoreShips: json.hasMore,
          shipList: json,
          listingShips: false
        });
      },
      () => {},
      { nameFilter: nameFilter ? nameFilter : this.state.nameFilter }
    );
  }

  addShipClicked() {
    this.props.fetchService.getJsonWithAuth(
      "/shipsAdd",
      "application/json",
      {},
      () => {
        this.getList();
      },
      () => {}
    );
  }

  render() {
    let shipList = [];
    if (this.state.listingShips) {
      shipList.push(
        <tr key="iamauniquesnowflake">
          <td>
            <p> </p>
          </td>
        </tr>
      );
    } else if (this.state.shipList.ships) {
      for (let i = 0; i < this.state.shipList.ships.length; i++) {
        /* eslint-disable react/no-children-prop */
        shipList.push(
          <ShipRow
            key={this.state.shipList.ships[i].id}
            fetchService={this.props.fetchService}
          />
        );
      }
    }
    return (
      <div
        style={{
          width: "100%",
          position: "fixed",
          left: 0,
          right: 0,
          top: this.props.navbarHeight + "px",
          bottom: 0
        }}>
        <div className="container">
          
            <div className="panel panel-default">
              <div className="input-group">
                <span className="input-group-btn">
                  <button
                    className="btn btn-default"
                    onClick={this.typeClicked}>
                    &#8203;
                    <i
                      className={
                        this.state.type === "ships"
                          ? "fa fa-fw fa-rocket"
                          : "fa fa-fw fa-cogs"
                      }
                    />
                  </button>
                  <button
                    className="btn btn-default"
                    onClick={this.addShipClicked}>
                    &#8203;
                    <i className="fa fa-fw fa-plus" />
                  </button>
                </span>
              </div>
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
              <div className="panel-body code-panel-body">
                <table className="table table-hover no-margin">
                  <tbody>{shipList}</tbody>
                </table>
              </div>
              </LoadingOverlay>
            </div>
          
        </div>
      </div>
    );
  }
};

class ShipRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      launched: false
    };
    // Bind the methods to the object's this
    this.launchShip = this.launchShip.bind(this);
  }

  launchShip() {}

  render() {
    return (
      <tr>
        <td />
      </tr>
    );
  }
}

export default Ships;
