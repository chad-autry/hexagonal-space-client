"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module ScenarioService
 */
 var HexDefinition = require('cartesian-hexagonal'); //external project required in constructors

/**
 * This service is the controller for the first 'TestFlight' scenario.
 * Allows the user to request a ship, and gives controls to manually fly it around.
 * Static map
 * No components/shields/energy/special vision
 * Can change velocity of ship to be 3
 * No history
 * Button to advance the turn
 * Click the station to request a new ship
 * @constructor
 */
 module.exports = function TestFlight(hexBoard, GridContext) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof TestFlight)) {
        return new TestFlight(hexBoard, GridContext);
    }
    
       var hexDimensions = new HexDefinition(55, 0.5, 0, 3);
       var contexts = [];
       contexts.push(new GridContext(hexDimensions));
       hexBoard.setHexDimensions(hexDimensions);
       hexBoard.setContexts(contexts);
       hexBoard.init();
};