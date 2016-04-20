"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module TestScene
 */

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
 module.exports = function TestScene(parentLayout, GoldenLayout) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof TestScene)) {
        return new TestScene(parentLayout, GoldenLayout);
    }
    
    parentLayout.registerComponent( 'example', function( container, state ){
        container.getElement().html( '<h2>' + state.text + '</h2>');
    });
    var newItemConfig = {
        title: 'TestScene',
        type: 'component',
        componentName: 'example',
        componentState: { text: 'TestScene' }
    };
    
    parentLayout.root.contentItems[ 0 ].addChild( newItemConfig );
};