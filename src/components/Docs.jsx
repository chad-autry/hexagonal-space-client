import React from "react";

const Docs = class Docs extends React.Component {
  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Intro</h3>
          </div>
          <div className="panel-body">
            hexagonal.space is a persistent shared world sandbox programming
            game. In it you and others submit scripts which control your fleet
            of ships to explore the galaxy. Each game turn is 15 minutes long
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Turn Sequence</h3>
          </div>
          <div className="panel-body" />
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Ship Components</h3>
          </div>
          <div className="panel-body" />
        </div>
      </div>
    );
  }
};

export default Docs;
