"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module TestScene
 */

/**
 * This service is the controller for the first 'TestScene' scenario.
 * Displays a simple space scene with no interactivity and only 1 window
 * @constructor
 */
 module.exports = function TestScene(parentLayout, GoldenLayout) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof TestScene)) {
        return new TestScene(parentLayout, GoldenLayout);
    }
   
    var newItemConfig = {
        title: 'TestScene',
        type: 'react-component',
        component: 'hex-map',
        props: { initialState: {id:'TestSceneCanvasID' }}
    };
    
    parentLayout.root.contentItems[ 0 ].addChild( newItemConfig );
    parentLayout.eventHub.emit( 'map-state-changed', [{id:'sun', type:'star', size: 100, u:0, v:0}] );
    
    parentLayout.eventHub.emit( 'map-state-changed', [{id:'sa1',type:'gravity', u: 0, v: -1, rotation: 180}]);
    parentLayout.eventHub.emit( 'map-state-changed', [{id:'sa2',type:'gravity', u: -1, v: 0, rotation: 240}]);
    parentLayout.eventHub.emit( 'map-state-changed', [{id:'sa3',type:'gravity', u: -1, v: 1, rotation: 300}]);
    parentLayout.eventHub.emit( 'map-state-changed', [{id:'sa4',type:'gravity', u: 0, v: 1, rotation: 0}]);
    parentLayout.eventHub.emit( 'map-state-changed', [{id:'sa5',type:'gravity', u: 1, v: 0, rotation: 60}]);
    parentLayout.eventHub.emit( 'map-state-changed', [{id:'sa6',type:'gravity', u: 1, v: -1, rotation: 120}]);
};