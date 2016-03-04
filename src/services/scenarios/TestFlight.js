"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module ScenarioService
 */
 var EmittingDataSource = require('data-chains/src/EmittingDataSource.js');

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
 module.exports = function TestFlight(dataSourceListener, mapControlService) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof TestFlight)) {
        return new TestFlight(dataSourceListener, mapControlService);
    }
    
    //Create a new StoringDataSource and set it as the source of the provided DataSourceListener
    var dataSource = new EmittingDataSource();
    dataSourceListener.setDataSource(dataSource);

    //There is no 'DataModel' to the datasource. Use it to pass the MapMouseClicked event handler
    //I like to know where hexes are when clicked on
    var mapMouseClicked = function(u, v){
        //$rootScope.$broadcast('addAlert',{type:'info', msg:'Clicked U:'+u + ' V:' +v});
    };
    dataSource.addItems([{type:'mapMouseClicked', function:mapMouseClicked}]);
       
    //Add all the other elements for the scene
    //Add a star
    //The scenario is very losely couple with the display, it works with game type objects only
    dataSource.addItems([{id:'sun', type:'star', size: 100, u:0, v:0}]);
        
    //Add a sphere to represent earth
    dataSource.addItems([{id: 'earth', type:'planet', size: 66, u:5, v:5}]);
        
    //Add a sphere to represent the moon
    dataSource.addItems([{id:'moon', type:'moon', size: 33, u:3, v:8}]);
        
        
        
    //Add arrows to represent gravity, rotation represents direction
    //Gravity around the sun
    dataSource.addItems([{id:'sa1',type:'gravity', u: 0, v: -1, rotation: 180}]);
    dataSource.addItems([{id:'sa2',type:'gravity', u: -1, v: 0, rotation: 240}]);
    dataSource.addItems([{id:'sa3',type:'gravity', u: -1, v: 1, rotation: 300}]);
    dataSource.addItems([{id:'sa4',type:'gravity', u: 0, v: 1, rotation: 0}]);
    dataSource.addItems([{id:'sa5',type:'gravity', u: 1, v: 0, rotation: 60}]);
    dataSource.addItems([{id:'sa6',type:'gravity', u: 1, v: -1, rotation: 120}]);
        
    //gravity around the planet
    dataSource.addItems([{id:'ea1',type:'gravity', u: 5, v: 4, rotation: 180}]);
    dataSource.addItems([{id:'ea2',type:'gravity', u: 4, v: 5, rotation: 240}]);
    dataSource.addItems([{id:'ea3',type:'gravity', u: 4, v: 6, rotation: 300}]);
    dataSource.addItems([{id:'ea4',type:'gravity', u: 5, v: 6, rotation: 0}]);
    dataSource.addItems([{id:'ea5',type:'gravity', u: 6, v: 5, rotation: 60}]);
    dataSource.addItems([{id:'ea6',type:'gravity', u: 6, v: 4, rotation: 120}]);
    
    //half gravity around the moon
    dataSource.addItems([{id:'ma1',type:'half_gravity', u: 3, v: 7, rotation: 180}]);
    dataSource.addItems([{id:'ma2',type:'half_gravity', u: 2, v: 8, rotation: 240}]);
    dataSource.addItems([{id:'ma3',type:'half_gravity', u: 2, v: 9, rotation: 300}]);
    dataSource.addItems([{id:'ma4',type:'half_gravity', u: 3, v: 9, rotation: 0}]);
    dataSource.addItems([{id:'ma5',type:'half_gravity', u: 4, v: 8, rotation: 60}]);
    dataSource.addItems([{id:'ma6',type:'half_gravity', u: 4, v: 7, rotation: 120}]);
    

    
    //A small asteroid field. Double asteroids in the middle
    var onClickAsteroids = function() {
        //$rootScope.$broadcast('addAlert',{type:'success', msg:"Asteroids"});
    };
    dataSource.addItems([{id:'asteroids1',type:'asteroids', u:-1, v:10, onClick:onClickAsteroids}, {id:'asteroids2', type:'asteroids', u:-2, v:10, onClick:onClickAsteroids},{id:'asteroids3', type:'asteroids', u:-3, v:10, onClick:onClickAsteroids}]);
    dataSource.addItems([{id:'asteroids4',type:'asteroids', u:-3, v:11, onClick:onClickAsteroids}, {id:'asteroids5', type:'asteroids', u:-2, v:11, onClick:onClickAsteroids},{id:'asteroids6', type:'asteroids', u:-2, v:10, onClick:onClickAsteroids}]);
    dataSource.addItems([{id:'asteroids7',type:'asteroids', u:-1, v:9, onClick:onClickAsteroids},  {id:'asteroids8', type:'asteroids', u:-2, v:9, onClick:onClickAsteroids}]);
    
    //A space station, gives gives the user somethign to interact with to spawn their ship(s)
    var onClickStation = function(screenX, screenY, planarX, planarY) {
        mapControlService.setPopoverTitle('U:6 V:5');
        mapControlService.setPopoverPosition(screenX, screenY);
        mapControlService.setShowPopover(true);
    };
    
    var showingPopover = false;
    dataSource.addItems([{id:'spaceStation', type:'space_station', u:6, v:5, onClick:onClickStation}]);
    mapControlService.board.setMouseClicked(function(screenX, screenY, planarX, planarY, wasClaimed, wasDragged){
        if (!wasDragged && showingPopover ) {
            mapControlService.setShowPopover(false);
            showingPopover = false;
        } else if (!wasDragged && mapControlService.showPopover) {
            showingPopover = true;
        } else if(!wasDragged && !wasClaimed && !mapControlService.showPopover) {
            var hexagonalCoordinates = mapControlService.board.hexDimensions.getReferencePoint(planarX, planarY);
            mapControlService.setPopoverTitle('U:'+hexagonalCoordinates.u+' V:'+hexagonalCoordinates.v);
            mapControlService.setPopoverPosition(screenX, screenY);
            mapControlService.setShowPopover(true);
            showingPopover = true;
        } else if(wasDragged && mapControlService.showPopover) {
            mapControlService.setShowPopover(false);
            showingPopover = false;
        }
    });
    var lastPlanarX;
    var lastPlanarY;
    mapControlService.board.setMouseDragged(function(screenX, screenY, planarX, planarY, wasClaimed){
        mapControlService.setShowPopover(false);
        showingPopover = false;
    });
};

/**
 * Advances the turn
 */
 module.exports.nextTurn = function TestFlight() {
     //Go through each of the ships (and station)
     //If it crashed chage it to a crash
     //If its path intersects gravity, save the vector to apply
     //Change the ship position
     //Update the velocity vector based on gravity
};