"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module HexMapActivationService
 */
 

/**
 * Holds a shared state variable to show or hide the map
 * @constructor
 * @example var hexMapActivationService = new (require(HexMapActivationService))();
 */
 module.exports = function HexMapActivationService() {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof HexMapActivationService)) {
        return new HexMapActivationService();
    }
    
    this.showMap = false;
    
    this.setShowMap = function(boolean) {
        this.showMap = boolean
    };
};


