var ngCore = require('angular2/core'),
    HexMapService = require('./hexMapService.js'),
    HexBoard = require('hex-grid-map-3d/src/HexBoard.js');
var GridContext = require('hex-grid-map-3d/src/contexts/InverseGridContext.js');
var CellContext = require('hex-grid-map-3d/src/contexts/CellContext.js');
var VectorDrawnItemFactory = require('hex-grid-map-3d/src/drawnItemFactories/VectorDrawnItemFactory.js');
var PathDrawnItemFactory = require('hex-grid-map-3d/src/drawnItemFactories/PathDrawnItemFactory.js');
var ArrowDrawnItemFactory = require('hex-grid-map-3d/src/drawnItemFactories/ArrowDrawnItemFactory.js');
var DelegatingDrawnItemFactory = require('hex-grid-map-3d/src/drawnItemFactories/DelegatingDrawnItemFactory.js');
var DrawnItemContext = require('hex-grid-map-3d/src/contexts/DrawnItemContext.js');
var CellDrawnItemFactory = require('hex-grid-map-3d/src/drawnItemFactories/RegularPolygonDrawnItemFactory');
var SphereDrawnItemFactory = require('hex-grid-map-3d/src/drawnItemFactories/SphereDrawnItemFactory');
var FieldOfSquaresDrawnItemFactory = require('hex-grid-map-3d/src/drawnItemFactories/FieldOfSquaresDrawnItemFactory');
var DrawnItemDataLink = require('hex-grid-map-3d/src/dataLinks/DrawnItemDataLink');
var PlanarPositioningDataLink = require('hex-grid-map-3d/src/dataLinks/PlanarPositioningDataLink');
var ZStackingDataLink = require('hex-grid-map-3d/src/dataLinks/ZStackingDataLink');
var CloningDataLink = require('hex-grid-map-3d/src/dataLinks/CloningDataLink');
var ConnectingDataLink = require('hex-grid-map-3d/src/dataLinks/ConnectingDataLink');
var HexDefinition = require('cartesian-hexagonal');
var makeDataLink = require('data-chains/src/DataLinkMixin');
var EmittingDataSource = require('data-chains/src/EmittingDataSource.js');
 
//This directive creates a HexBoard for the decorated canvas element, and injects it back onto the service
module.exports = ngCore.Directive({
    selector: '[hexBoard]'
})
.Class({
    constructor: [ngCore.ElementRef, HexMapService, function(eleRef, hexMapService) {

        //Create the HexBoard with the canvas element
        var hexBoard = new HexBoard(eleRef.nativeElement);
        //Create the HexBoard with our space themed default DrawnItem factories, and Contexts
        var hexDimensions = new HexDefinition(55, 1, 0, 3);
        hexBoard.setHexDimensions(hexDimensions);
        var contexts = [];
        
        //Create the DataSourceListener for the MapData. It will actually be a DataLink which will decorate the plain scenario objects with the details the DrawnItemFactories need
        var mapDataListener = null;

        //3D simplifies things alot actually (compared to keeping track of z-index in 2d and using multiple contexts)
        //There is the BackgroundContext, the GridContext, and then the CellContext handles everythign else (but in particular specializes in stacking things in a cell)
        
        //TODO Make the BackgroundContext which will draw a background based on the BackgroundItem sent to our DataSourceListener

        //Create and push the grid context
        contexts.push(new GridContext(hexDimensions));

        //Push the above grid cell context defined earlier
        //Create and link DecoratingDataSource which will take scenario DTOs and decorate them with the drawing information required by the DrawnItemFactories
        //The various contexts
        var simpleDrawnItemFactory = new CellDrawnItemFactory(hexDimensions);
        var sphereDrawnItemFactor = new SphereDrawnItemFactory(hexDimensions);
        var arrowDrawnItemFactory = new ArrowDrawnItemFactory(hexDimensions);
        var vectorDrawnItemFactory = new VectorDrawnItemFactory(hexDimensions);
        
        //Make the initial decorating data link. Hard coded for now. Likely to move locations, and become user configureable. Add in ability to look up renderings for 'secret' items
        var decoratingDataLink = {};
        decoratingDataLink.onDataChanged = function(event) {
            var i;
            var decoratedAdditions = [];            
            for (i = 0; i < event.added.length; i++) {
                if (event.added[i].type === 'ship') {
                    decoratedAdditions.push(Object.create(event.added[i]));
                    decoratedAdditions[i].type = 'simple';
                    decoratedAdditions[i].radius = 30;
                    decoratedAdditions[i].sides = 3;
                    decoratedAdditions[i].color = '#15b01a';
                } else if (event.added[i].type === 'gravity') {
                    decoratedAdditions.push(Object.create(event.added[i]));
                    decoratedAdditions[i].type = 'arrow';
                    decoratedAdditions[i].lineWidth = 3;
                    decoratedAdditions[i].lineColor = '#929591';
                    decoratedAdditions[i].scaleLength = 0.75;
                    decoratedAdditions[i].scaleWidth = 0.75;
                    decoratedAdditions[i].fillColor = '#929591';
                } else if (event.added[i].type === 'half_gravity') {
                    decoratedAdditions.push(Object.create(event.added[i]));
                    decoratedAdditions[i].type = 'arrow';
                    decoratedAdditions[i].lineWidth = 3;
                    decoratedAdditions[i].lineColor = '#929591';
                    decoratedAdditions[i].scaleLength = 0.75;
                    decoratedAdditions[i].scaleWidth = 0.75;
                } else if (event.added[i].type === 'asteroids') {
                    decoratedAdditions.push(event.added[i]);
                } else if (event.added[i].type === 'star') {
                    decoratedAdditions.push(Object.create(event.added[i]));
                    decoratedAdditions[i].type = 'sphere';
                    decoratedAdditions[i].size = 100;
                    decoratedAdditions[i].lineWidth = 6;
                    decoratedAdditions[i].greatCircleAngles = [0, Math.PI/3, -Math.PI/3];
                    decoratedAdditions[i].latitudeAngles = [0, Math.PI/6, Math.PI/3, -Math.PI/6, -Math.PI/3]; 
                    decoratedAdditions[i].lineColor = '#f97306';
                    decoratedAdditions[i].backgroundColor = '#ffff14';
                    decoratedAdditions[i].borderStar = {radius1: 3, radius2: 6, points: 20, borderColor: '#f97306'};
                } else if (event.added[i].type === 'planet') {
                    decoratedAdditions.push(Object.create(event.added[i]));
                    decoratedAdditions[i].type = 'sphere';
                    decoratedAdditions[i].size = 66;
                    decoratedAdditions[i].lineWidth = 5;
                    decoratedAdditions[i].greatCircleAngles = [0, Math.PI/3, -Math.PI/3];
                    decoratedAdditions[i].latitudeAngles = [0, Math.PI/6, Math.PI/3, -Math.PI/6, -Math.PI/3]; 
                    decoratedAdditions[i].lineColor = '#653700';
                    decoratedAdditions[i].backgroundColor = '#0343df';
                    decoratedAdditions[i].borderWidth = 2;
                    decoratedAdditions[i].borderColor = '#ffffff';
                } else if (event.added[i].type === 'moon') {
                    decoratedAdditions.push(Object.create(event.added[i]));
                    decoratedAdditions[i].type = 'sphere';
                    decoratedAdditions[i].size = 33;
                    decoratedAdditions[i].lineWidth = 2;
                    decoratedAdditions[i].greatCircleAngles = [0, Math.PI/3, -Math.PI/3];
                    decoratedAdditions[i].latitudeAngles = [0, Math.PI/6, Math.PI/3, -Math.PI/6, -Math.PI/3]; 
                    decoratedAdditions[i].lineColor = '#929591';
                    decoratedAdditions[i].backgroundColor = '#e1e1d6';
                    decoratedAdditions[i].borderWidth = 3;
                    decoratedAdditions[i].borderColor = 'black';
                } else if (event.added[i].type === 'space_station') {
                    decoratedAdditions.push(Object.create(event.added[i]));
                    decoratedAdditions[i].type = 'simple';
                    decoratedAdditions[i].diameter = 40;
                    decoratedAdditions[i].thickness = 5;
                    decoratedAdditions[i].sides = 5;
                    decoratedAdditions[i].color = '#0343df';
                }
            }
            
            this.emitEvent('dataChanged', [{added:decoratedAdditions, removed:event.removed, updated:{}}]);
        };
        
        
        
        makeDataLink.call(decoratingDataLink);
        //For Asteroids we use brown grey, brownish grey, greyish brown, grey brown. For debris would probablly go more blue-grey
        var asteroidFieldDrawnItemFactory = new FieldOfSquaresDrawnItemFactory(hexDimensions, 9, 20, ["#8d8468", "#86775f", "#7a6a4f", "#7f7053"]);
        var cellDrawnItemFactoryMap = {simple: simpleDrawnItemFactory, sphere: sphereDrawnItemFactor, arrow: arrowDrawnItemFactory, asteroids: asteroidFieldDrawnItemFactory, vector:vectorDrawnItemFactory};
        var cellDrawnItemFactory = new DelegatingDrawnItemFactory(cellDrawnItemFactoryMap);
        
        
           var drawnItemDataLink = new DrawnItemDataLink(cellDrawnItemFactory);
	     drawnItemDataLink.setDataSource(decoratingDataLink);
	
	    var cloningDataLink = new CloningDataLink();
	    cloningDataLink.setDataSource(drawnItemDataLink);
	
	    var planarPositioningDataLink = new PlanarPositioningDataLink(hexDimensions);
	    planarPositioningDataLink.setDataSource(cloningDataLink);
	    
	    var zStackingDataLink = new ZStackingDataLink(10);
	    zStackingDataLink.setDataSource(planarPositioningDataLink);
	    
	    var connectingDataLink = new ConnectingDataLink();
	    connectingDataLink.setDataSource(zStackingDataLink);
	    
	    var connectingDataSource = new EmittingDataSource();
	    connectingDataLink.setDataSource(connectingDataSource);

        var cellContext = new CellContext();
        contexts.push(cellContext);

        //Create a DataSourceListener which will intercept the MapMouseClicked item

        hexBoard.setContexts(contexts);

        hexBoard.init();
        drawnItemDataLink.setScene(hexBoard.scene);
        //Set the board back to the service so it can be accessed
        hexMapService.setBoard(hexBoard);
        
        //Set the lowest level DataLink
        hexMapService.setMapDataListener(decoratingDataLink);

        }]
});
