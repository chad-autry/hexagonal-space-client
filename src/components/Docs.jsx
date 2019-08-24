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
          <div className="panel-body">
            <ul className="list-group">
              <li className="list-group-item">
                <h4 className="list-group-item-heading">Pre-turn</h4>
                <p className="list-group-item-text">
                  Ships complete launches from stations and leave FTL in this
                  phase.
                </p>
              </li>
              <li className="list-group-item">
                <h4 className="list-group-item-heading">Script Execution</h4>
                <p className="list-group-item-text">
                  The script of each ship in a system is executed
                </p>
              </li>
              <li className="list-group-item">
                <h4 className="list-group-item-heading">Reconciliation</h4>
                <p className="list-group-item-text">
                  Ship actions are resolved (trades and weapons fired)
                </p>
              </li>
              <li className="list-group-item">
                <h4 className="list-group-item-heading">Ship Movement</h4>
                <p className="list-group-item-text">
                  Each ship is moved according to its velocity vector. Collions
                  and velocity changes according to gravity are taken into
                  account.
                </p>
              </li>
              <li className="list-group-item">
                <h4 className="list-group-item-heading">Celestial Movement</h4>
                <p className="list-group-item-text">
                  Each celestial entity (planets asteroids) is moved along its
                  path. Ships within gravity hexes are moved along. If a ship
                  enters a gravity hex its velocity is changed. (It is not
                  possible to crash in this phase)
                </p>
              </li>
              <li className="list-group-item">
                <h4 className="list-group-item-heading">Vision</h4>
                <p className="list-group-item-text">
                  Which ships can see what is calculated
                </p>
              </li>
              <li className="list-group-item">
                <h4 className="list-group-item-heading">User Interaction</h4>
                <p className="list-group-item-text">
                  Ships begin the launch process and script updates occur.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Ship Scripts</h3>
          </div>
          <div className="panel-body">
            <ul>
              <li>Ship scripts are evaluated in a Node.js sandbox</li>
              <li>Ship scripts have 15 seconds to execute</li>
              <li>
                Ship scripts have a 20 mb limit (requested sensor readings
                count)
              </li>
              <li>Ship scripts have no network connectivity</li>
              <li>
                Ship scripts have a context object to interact with the ship
                itself
              </li>
            </ul>
          </div>
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
              <li>Bounties</li>
              <li>Component Builder</li>
              <li>Ship Builder</li>
              <li>Component Factories</li>
              <li>Icon Builder</li>
              <li>
                Cross browser compatabillity (Known issues with the map on
                non-Chrome)
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default Docs;
