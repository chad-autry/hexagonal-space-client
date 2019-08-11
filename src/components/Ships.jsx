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
      listingShips: false
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
      "/listShips",
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

  codeClicked(title, bodyId) {
    this.setState({
      loadingCode: true
    });
    let then = json => {
      this.setState({
        code: json.code,
        title: title,
        edited: false,
        loadingCode: false
      });
    };
    this.props.fetchService.getJsonWithAuth(
      "/viewCode",
      "application/json",
      then,
      () => {},
      { bodyId: bodyId }
    );
  }

  addShipClicked() {
    this.props.fetchService.postWithAuth(
      "/saveCode",
      "application/json",
      JSON.stringify({
        title: this.state.title,
        code: this.state.code
      }),
      () => {
        this.getList();
      },
      () => {}
    );
    this.setState({ edited: false });
  }

  render() {
    let shipList = [];
    if (this.state.listingShips) {
      shipList.push(
          <tr key="iamauniquesnowflake">
            <td>
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
            <div className="panel-heading">Ships</div>
            <div className="panel-body code-panel-body">
              <table className="table table-hover no-margin">
                <tbody>{shipList}</tbody>
              </table>
            </div>
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
