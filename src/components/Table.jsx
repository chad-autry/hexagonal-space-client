import React from "react";

/**
 * This component is responsible for the table view of the map
 */
const Table = class View extends React.Component {
  constructor(props) {
    super(props);
    let tableRows = [];
    this.props.dataLink.forEach(element => {
      tableRows.push(
        <li key={element.id} className="list-group-item">
          <pre>{JSON.stringify(element, null, 4)}</pre>
        </li>
      );
    });
    this.state = { tableRows: tableRows };
    //Get the dataLink from the props
    //Setup a listener which takes the dataLink values and produces a list into the state

    //This is a cheap and dirty listener to create/recreate rows from a datasource
    //Eventually have a chain with filters, decorators, and such
    this.props.dataLink.addListener({
      onDataChanged: event => {
        //Whatever the event, this cheap and dirty method is just re-creating a row for each item on the datasource
        let tableRows = [];
        this.props.dataLink.forEach(element => {
          tableRows.push(
            <li key={element.id} className="list-group-item">
              <pre>{JSON.stringify(element, null, 4)}</pre>
            </li>
          );
        });
        this.setState({ tableRows: tableRows });
      }
    });
    //TODO remove listener in componentDidUnmount
  }

  render() {
    return (
      <div>
        <ul className="list-group">{this.state.tableRows}</ul>
      </div>
    );
  }
};

export default Table;
