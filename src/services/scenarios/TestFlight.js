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
 module.exports = function TestFlight(dataSourceListener) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof TestFlight)) {
        return new TestFlight(dataSourceListener);
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
    dataSource.addItems([{type:'gravity', u: 0, v: -1, rotation: 180}]);
    dataSource.addItems([{type:'gravity', u: -1, v: 0, rotation: 240}]);
    dataSource.addItems([{type:'gravity', u: -1, v: 1, rotation: 300}]);
    dataSource.addItems([{type:'gravity', u: 0, v: 1, rotation: 0}]);
    dataSource.addItems([{type:'gravity', u: 1, v: 0, rotation: 60}]);
    dataSource.addItems([{type:'gravity', u: 1, v: -1, rotation: 120}]);
        
    //gravity around the planet
    dataSource.addItems([{type:'gravity', u: 5, v: 4, rotation: 180}]);
    dataSource.addItems([{type:'gravity', u: 4, v: 5, rotation: 240}]);
    dataSource.addItems([{type:'gravity', u: 4, v: 6, rotation: 300}]);
    dataSource.addItems([{type:'gravity', u: 5, v: 6, rotation: 0}]);
    dataSource.addItems([{type:'gravity', u: 6, v: 5, rotation: 60}]);
    dataSource.addItems([{type:'gravity', u: 6, v: 4, rotation: 120}]);
    
    //half gravity around the moon
    dataSource.addItems([{type:'half_gravity', u: 3, v: 7, rotation: 180}]);
    dataSource.addItems([{type:'half_gravity', u: 2, v: 8, rotation: 240}]);
    dataSource.addItems([{type:'half_gravity', u: 2, v: 9, rotation: 300}]);
    dataSource.addItems([{type:'half_gravity', u: 3, v: 9, rotation: 0}]);
    dataSource.addItems([{type:'half_gravity', u: 4, v: 8, rotation: 60}]);
    dataSource.addItems([{type:'half_gravity', u: 4, v: 7, rotation: 120}]);
    

    
    //A small asteroid field. Double asteroids in the middle
    var onClickAsteroids = function() {
        //$rootScope.$broadcast('addAlert',{type:'success', msg:"Asteroids"});
    };
    dataSource.addItems([{type:'asteroids', u:-1, v:10, onClick:onClickAsteroids}, {type:'asteroids', u:-2, v:10, onClick:onClickAsteroids},{type:'asteroids', u:-3, v:10, onClick:onClickAsteroids}]);
    dataSource.addItems([{type:'asteroids', u:-3, v:11, onClick:onClickAsteroids}, {type:'asteroids', u:-2, v:11, onClick:onClickAsteroids},{type:'asteroids', u:-2, v:10, onClick:onClickAsteroids}]);
    dataSource.addItems([{type:'asteroids', u:-1, v:9, onClick:onClickAsteroids}, {type:'asteroids', u:-2, v:9, onClick:onClickAsteroids}]);
    
    //A space station, gives gives the user somethign to interact with to spawn their ship(s)
    var onClickStation = function() {
        //$rootScope.$broadcast('addAlert',{type:'success', msg:"Do you believe I'm a space station? Use your imagination"});
    };
    dataSource.addItems([{type:'space_station', u:6, v:5, onClick:onClickStation}]);
    
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