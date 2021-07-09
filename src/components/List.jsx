import React from "react";
import ReactJson from "react-json-view";

/**
 * This component is responsible for the table view of the map
 */
const List = class View extends React.Component {
  constructor(props) {
    super(props);
    this.getListItems = this.getListItems.bind(this);
    this.variablesClicked = this.variablesClicked.bind(this);
    this.scriptClicked = this.scriptClicked.bind(this);
    this.state = { listItems: this.getListItems() };

    //Get the dataLink from the props
    //Setup a listener which takes the dataLink values and produces a list into the state

    //This is a cheap and dirty listener to create/recreate rows from a datasource
    //Eventually have a chain with filters, decorators, and such
    this.props.dataLink.addListener({
      onDataChanged: () => {
        //Whatever the event, this cheap and dirty method is just re-creating a row for each item on the datasource

        this.setState({ listItems: this.getListItems() });
      }
    });
  }

  getListItems() {
    let listItems = [];
    this.props.dataLink.forEach(element => {
      listItems.push(
        <li key={element.entityId} className="list-group-item">
          <ReactJson
            quotesOnKeys={false}
            displayObjectSize={false}
            customButtons={{
              position: {
                clickCallback: element => {
                  this.mapCoordinatesClicked(element);
                },
                title: "Map",
                viewBox: "0 0 576 512",
                path: (
                  <path d="M0 117.66v346.32c0 11.32 11.43 19.06 21.94 14.86L160 416V32L20.12 87.95A32.006 32.006 0 0 0 0 117.66zM192 416l192 64V96L192 32v384zM554.06 33.16L416 96v384l139.88-55.95A31.996 31.996 0 0 0 576 394.34V48.02c0-11.32-11.43-19.06-21.94-14.86z" />
                )
              },
              variablesId: {
                clickCallback: element => {
                  this.variablesClicked(element);
                },
                title: "Variables",
                viewBox: "0 0 448 512",
                path: (
                  <path d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z" />
                )
              },
              scriptId: {
                clickCallback: element => {
                  this.scriptClicked(element);
                },
                title: "Script",
                viewBox: "0 0 576 512",
                path: (
                  <path d="M208 32h-48a96 96 0 0 0-96 96v37.48a32.06 32.06 0 0 1-9.38 22.65L9.37 233.37a32 32 0 0 0 0 45.26l45.25 45.25A32 32 0 0 1 64 346.51V384a96 96 0 0 0 96 96h48a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-48a32 32 0 0 1-32-32v-37.48a96 96 0 0 0-28.13-67.89L77.25 256l22.63-22.63A96 96 0 0 0 128 165.48V128a32 32 0 0 1 32-32h48a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zm358.63 201.37l-45.25-45.24a32.06 32.06 0 0 1-9.38-22.65V128a96 96 0 0 0-96-96h-48a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h48a32 32 0 0 1 32 32v37.47a96 96 0 0 0 28.13 67.91L498.75 256l-22.62 22.63A96 96 0 0 0 448 346.52V384a32 32 0 0 1-32 32h-48a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h48a96 96 0 0 0 96-96v-37.49a32 32 0 0 1 9.38-22.63l45.25-45.25a32 32 0 0 0 0-45.26z" />
                )
              }
            }}
            iconStyle="square"
            onSelect={select => {
              console.log(JSON.stringify(select, null, 4));
            }}
            displayDataTypes={false}
            name={false}
            src={element}
          />
        </li>
      );
    });
    return listItems;
  }
  mapCoordinatesClicked(element) {
    this.props.setViewStateProperties({
      initialMapCenter: element.src
    });
    this.props.history.push("/view/map");
  }
  scriptClicked(element) {
    this.props.viewScript(element.src);
  }
  variablesClicked(element) {
    this.props.fetchService.getJsonWithAuth(
      "/variables",
      "application/json",
      json => {
        this.props.setViewStateProperties({
          variables: json.variablesString
        });
        this.props.history.push("/view/list#variables");
      },
      () => {}, //TODO get the turn, system, entity from the clicked element/record
      {
        turn: this.props.viewState.latestTurn,
        system: this.props.viewState.queriedSystem,
        entity: this.props.viewState.queriedEntity,
        variablesId: element.src
      }
    );
  }
  render() {
    return (
      <div>
        <ul className="list-group">{this.state.listItems}</ul>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.dataLink.clearListeners();
  }
};

export default List;
