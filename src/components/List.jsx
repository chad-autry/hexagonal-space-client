import React from "react";
import JsxParser from "react-jsx-parser";

/**
 * This component is responsible for the table view of the map
 */
const List = class View extends React.Component {
  constructor(props) {
    super(props);
    let listItems = [];
    this.props.dataLink.forEach(element => {
      listItems.push(<JsxParser key={element.id} jsx={element.jsx} />);
    });
    this.state = { listItems: listItems };
    //Get the dataLink from the props
    //Setup a listener which takes the dataLink values and produces a list into the state

    //This is a cheap and dirty listener to create/recreate rows from a datasource
    //Eventually have a chain with filters, decorators, and such
    this.props.dataLink.addListener({
      onDataChanged: () => {
        //Whatever the event, this cheap and dirty method is just re-creating a row for each item on the datasource
        let listItems = [];
        this.props.dataLink.forEach(element => {
          listItems.push(<JsxParser key={element.id} jsx={element.jsx} />);
        });
        this.setState({ listItems: listItems });
      }
    });
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
