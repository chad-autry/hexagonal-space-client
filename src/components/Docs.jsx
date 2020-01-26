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
            hexagonal.space is a persistent shared universe sandbox grand
            strategy game. Concurrent turns are executed every 24 hours. Players
            have the time between to view the game state and issue orders.
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Turn Sequence</h3>
          </div>
          <div className="panel-body">
            <ul className="list-group">
              <li className="list-group-item">
                <h4 className="list-group-item-heading">Order Execution</h4>
                <p className="list-group-item-text">
                  The players queued orders are executed.
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
            </ul>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Ship Components</h3>
          </div>
          <div className="panel-body">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Capacitors</h3>
              </div>
              <div className="panel-body">
                A capacitor lets unused energey be carried over from turn to
                turn.
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Generators</h3>
              </div>
              <div className="panel-body">
                A generator is used to generate energy.
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Engines</h3>
              </div>
              <div className="panel-body">
                An engine is used to change the ships velocity.
              </div>
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Future Features</h3>
          </div>
          <div className="panel-body">
            In no particular order a variety of features planned for the future
            <ul>
              <li>FTL</li>
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
