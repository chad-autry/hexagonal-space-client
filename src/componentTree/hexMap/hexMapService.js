"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module HexMapActivationService
 */
 

/**
 * The scoping service for the HexMap. Holds the HexBoard and a variable to display the canvas or not
 * @constructor
 * @example var hexMapService = new (require(HexMapService))();
 */
 module.exports = function HexMapService() {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof HexMapService)) {
        return new HexMapService();
    }
    
    this.showMap = false;
    this.board = null;
    this.mapDataListener = null;
    
    this.popoverTitle = 'Varible';
    this.popoverContent = 'Variable Content';
    this.popoverX = 0;
    this.popoverY = 0;
    
    /**
     * Set the HexBoard which is used to control the grid
     * @param { external:HexBoard } board - The hex board object from HexBoard
     */
    this.setBoard = function(board) {
        this.board = board;
    };
    
    /**
     * Set DataSourceListener which is used to listen for the scenario's map data
     * @param { external:DataSourceListener } dataSourceListener - The DataSourceListener coupleing the scenario to the map
     */
    this.setMapDataListener = function(dataSourceListener) {
        this.mapDataListener = dataSourceListener;
    };

    this.setShowMap = function(boolean) {
        this.showMap = boolean;
        this.setShowPopover(false);
    };
    
    this.setShowPopover = function(boolean) {
        this.popover.showPopover = boolean;
    };
    
    this.setPopoverTitle = function(text) {
        this.popover.popoverTitle = text;
    };
    
    this.setPopoverPosition = function(x, y) {
        this.popover.popoverX = x;
        this.popover.popoverY = y;
    };
    
    this.setPopoverContent = function(component) {
        this.popover.setContentComponent(component);
    };
};

