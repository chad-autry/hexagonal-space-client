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
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Future Features</h3>
          </div>
          <div className="panel-body">
          In no particular order a variety of features planned for the future
          <ul>
          <li>FTL</li>
          <li>Client Side Script Simulator</li>
          <li>Agent Scripts</li>
          <li>Ship to Ship Comms</li>
          <li>Ship to Ship Trade API</li>
          <li>Mining</li>
          <li>Auction House</li>
          <li>Maps</li>
          <li>Space Stations</li>
          <li>Factories</li>
          <li>Icon Builder</li>
          </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default Docs;
