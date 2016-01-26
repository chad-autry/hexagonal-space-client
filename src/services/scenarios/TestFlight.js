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
 module.exports = function TestFlight(hexBoard, GridContext, CellContext, VectorDrawnItemFactory, PathDrawnItemFactory, ArrowDrawnItemFactory, DelegatingDrawnItemFactory, DrawnItemContext,
        DataSource, CellDrawnItemFactory, SphereDrawnItemFactory, FieldOfSquaresDrawnItemFactory) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof TestFlight)) {
        return new TestFlight(hexBoard, GridContext, CellContext, VectorDrawnItemFactory, PathDrawnItemFactory, ArrowDrawnItemFactory, DelegatingDrawnItemFactory, DrawnItemContext,
        DataSource, CellDrawnItemFactory, SphereDrawnItemFactory, FieldOfSquaresDrawnItemFactory);
    }
    //Setup the initial map
    var hexDimensions = new HexDefinition(55, 1, 0, 3);
    var contexts = [];
       
       
    //The various contexts
    //Create the cell items datasource, drawnItemFactories, and special compound contex
    var cellDataSource = new DataSource();
    var simpleDrawnItemFactory = new CellDrawnItemFactory(hexDimensions);
    var sphereDrawnItemFactor = new SphereDrawnItemFactory(hexDimensions);
    var arrowDrawnItemFactory = new ArrowDrawnItemFactory(hexDimensions);
    
    //For Asteroids we use brown grey, brownish grey, greyish brown, grey brown. For debris would probablly go more blue-grey
    var asteroidFieldDrawnItemFactory = new FieldOfSquaresDrawnItemFactory(hexDimensions, 9, 20, ["#8d8468", "#86775f", "#7a6a4f", "#7f7053"]);
    var cellDrawnItemFactoryMap = {simple: simpleDrawnItemFactory, sphere: sphereDrawnItemFactor, arrow: arrowDrawnItemFactory, asteroids: asteroidFieldDrawnItemFactory};
    var cellDrawnItemFactory = new DelegatingDrawnItemFactory(cellDrawnItemFactoryMap);
    var cellContext = new CellContext(cellDataSource, cellDrawnItemFactory, 5, hexDimensions);
    
    //Create and push the grid context
    contexts.push(new GridContext(hexDimensions));
    
    //Definte and push the vector DataSource, DrawnItemFactory, and Context
    var vectorDataSource = new DataSource();
    var vectorDrawnItemFactory = new VectorDrawnItemFactory(hexDimensions);
    contexts.push(new DrawnItemContext(vectorDataSource, vectorDrawnItemFactory, hexDimensions));
    
    //Push the above grid cell context defined earlier
    contexts.push(cellContext);

    //Create and push the LensFlareContext
    //contexts.push(new ForegroundContext([{u:0, v:0}], hexDimensions));
     
    //I like to know where hexes are when clicked on
    var globalMouseClicked = function(dx, x, dy, y){
        var hexagonalCoordinates = hexDimensions.getReferencePoint(x - dx, y - dy);
        //$rootScope.$broadcast('addAlert',{type:'info', msg:'Clicked U:'+hexagonalCoordinates.u + ' V:' +hexagonalCoordinates.v});
    };
      
       
    hexBoard.setHexDimensions(hexDimensions);
    hexBoard.setContexts(contexts);
    hexBoard.setMouseClicked(globalMouseClicked);
    //Setup the on-click of the station to spawn a new Ship
    //Setup a button which can be clicked to advance the turn
    hexBoard.init();
    
    //programatically create the map using the contexts
//Add a star
        //The rotation is the "nearly isometric" converted to radians. #f97306 = xkcd orange
        cellDataSource.addItems([{id:'sun', type:'sphere', size: 100, lineWidth: 6, greatCircleAngles: [0, Math.PI/3, -Math.PI/3], latitudeAngles: [0, Math.PI/6, Math.PI/3, -Math.PI/6, -Math.PI/3], 
        lineColor: '#f97306', backgroundColor: '#ffff14', borderStar: {radius1: 3, radius2: 6, points: 20, borderColor: '#f97306'}, u:0, v:0}]);
        
        //Add a sphere to represent earth
        cellDataSource.addItems([{id: 'earth', type:'sphere', size: 66, lineWidth: 4, greatCircleAngles: [0, Math.PI/3, -Math.PI/3], latitudeAngles: [0, Math.PI/6, Math.PI/3, -Math.PI/6, -Math.PI/3], 
        lineColor: '#653700', backgroundColor: '#0343df', borderWidth: 2, borderColor: '#ffffff', u:5, v:5}]);
        
        //Add a sphere to represent the moon
        cellDataSource.addItems([{id:'moon', type:'sphere', size: 33, lineWidth: 2, greatCircleAngles: [0, Math.PI/3, -Math.PI/3], latitudeAngles: [0, Math.PI/6, Math.PI/3, -Math.PI/6, -Math.PI/3], 
        lineColor: '#929591', backgroundColor: '#e1e1d6', borderWidth: 3, borderColor: 'black', u:3, v:8}]);
        
        
        
        //Add arrows to represent gravity
        //Gravity around the sun
        cellDataSource.addItems([{type:'arrow', u: 0, v: -1, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 180, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: -1, v: 0, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 240, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: -1, v: 1, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 300, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 0, v: 1, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 0, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 1, v: 0, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 60, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 1, v: -1, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 120, scaleLength: 0.75, scaleWidth:0.75}]);
        
        //gravity around the planet
        cellDataSource.addItems([{type:'arrow', u: 5, v: 4, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 180, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 4, v: 5, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 240, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 4, v: 6, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 300, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 5, v: 6, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 0, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 6, v: 5, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 60, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 6, v: 4, fillColor: '#929591', lineWidth: 3, lineColor: '#929591', rotation: 120, scaleLength: 0.75, scaleWidth:0.75}]);
        
        //unfilled gravity around the moon
        cellDataSource.addItems([{type:'arrow', u: 3, v: 7, lineWidth: 3, lineColor: '#929591', rotation: 180, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 2, v: 8, lineWidth: 3, lineColor: '#929591', rotation: 240, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 2, v: 9, lineWidth: 3, lineColor: '#929591', rotation: 300, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 3, v: 9, lineWidth: 3, lineColor: '#929591', rotation: 0, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 4, v: 8, lineWidth: 3, lineColor: '#929591', rotation: 60, scaleLength: 0.75, scaleWidth:0.75}]);
        cellDataSource.addItems([{type:'arrow', u: 4, v: 7, lineWidth: 3, lineColor: '#929591', rotation: 120, scaleLength: 0.75, scaleWidth:0.75}]);
        
        //Add a fleet of red 'ships' (triangles) on the dark side of the moon, and a fleet of green ships at the sun
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 55, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 3, color: '#15b01a', u:1, v:0}, {type:'simple', radius: 30, sides: 3, color: '#e50000', u:2, v:9}]);
        
        //A small asteroid field. Double asteroids in the middle
        var onClickAsteroids = function() {
            $rootScope.$broadcast('addAlert',{type:'success', msg:"Asteroids"});
        };
        cellDataSource.addItems([{type:'asteroids', u:-1, v:10, onClick:onClickAsteroids}, {type:'asteroids', u:-2, v:10, onClick:onClickAsteroids},{type:'asteroids', u:-3, v:10, onClick:onClickAsteroids}]);
        cellDataSource.addItems([{type:'asteroids', u:-3, v:11, onClick:onClickAsteroids}, {type:'asteroids', u:-2, v:11, onClick:onClickAsteroids},{type:'asteroids', u:-2, v:10, onClick:onClickAsteroids}]);
        cellDataSource.addItems([{type:'asteroids', u:-1, v:9, onClick:onClickAsteroids}, {type:'asteroids', u:-2, v:9, onClick:onClickAsteroids}]);
        
        //A blue 'space station'
        var onClickStation = function() {
            $rootScope.$broadcast('addAlert',{type:'success', msg:"Do you believe I'm a space station? Use your imagination"});
        };
        cellDataSource.addItems([{type:'simple', radius: 30, sides: 5, color: '#0343df', u:6, v:5, onClick:onClickStation}]);
    
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