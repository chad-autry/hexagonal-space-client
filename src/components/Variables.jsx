import React from "react";
import ReactJson from "react-json-view";

/**
 * This component is responsible for the table view of the map
 */
const Variables = class Variables extends React.Component {
  constructor(props) {
    super(props);
    let canParseJson = false;
    try {
      JSON.parse(this.props.variablesString);
      canParseJson = true;
    } catch (_) {}
    this.state = {
      json: false,
      canParseJson: canParseJson
    };
    this.closeClicked = this.closeClicked.bind(this);
    this.jsonClicked = this.jsonClicked.bind(this);
  }

  closeClicked() {
    this.props.setViewStateProperties({
      variables: ""
    });
  }

  jsonClicked() {
    this.setState({ json: !this.state.json });
  }

  componentDidMount() {
    const elem = document.getElementById("variables");
    elem && elem.scrollIntoView();
  }

  render() {
    return (
      <div id="variables" className="panel panel-default">
        <div className="panel-heading">
          <button
            type="button"
            style={{ marginRight: "5px" }}
            className="btn icon-btn btn-default"
            onClick={() => {
              this.closeClicked();
            }}>
            <i className="fa fa-times" />
            {""}
          </button>
          <button
            type="button"
            disabled={!this.state.canParseJson}
            className={
              this.state.json ? "btn btn-default active" : "btn btn-default"
            }
            onClick={() => {
              this.jsonClicked();
            }}>
            {`{JSON}`}
          </button>
        </div>
        {this.state.json && (
          <ReactJson
            quotesOnKeys={false}
            displayObjectSize={false}
            iconStyle="square"
            displayDataTypes={false}
            name={false}
            src={JSON.parse(this.props.variablesString)}
          />
        )}
        {!this.state.json && (
          <div className="panel-body">{this.props.variablesString}</div>
        )}
      </div>
    );
  }
};

export default Variables;
