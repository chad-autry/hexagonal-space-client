var HexBoard = require('hex-grid-map-3d/src/HexBoard.js');
var React = require('react');
var ReactDom = require('react-dom');
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

/**
 * Factory function, returns a React component given the required params
 * Injecting all dependencies (instead of just using require) since some modules are dynamically loaded
 * And require does not give duplicate objects
 * @param React - React, used to declare the class
 * @param ScenarioService - The scenario service used to for all actions
 */
module.exports = React.createClass({
        render: function() {
            return (
                /* jshint ignore:start */
                <canvas ref={(canvasRef) => this.canvasRef = canvasRef} style={{position:'absolute', backgroundColor: 'green', width: '100%' , height: '100%', zIndex: 200}}></canvas>
                /* jshint ignore:end */
            );
        },
        resizeCanvas (canvas) {
            // Lookup the size the browser is displaying the canvas.
            let displayWidth  = canvas.clientWidth;
            let displayHeight = canvas.clientHeight;
            let ctx = canvas.getContext("webgl");
            let dpr = window.devicePixelRatio || 1;
            let bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

            let ratio = dpr / bsr;

            //Now make the canvas draw at the display size multiplied by the ratio
            canvas.width  = displayWidth*ratio;
            canvas.height = displayHeight*ratio;
        },
        componentDidMount() {
            this.resizeCanvas(this.canvasRef);
            let resizeFunction = (event) => {
                this.resizeCanvas(this.canvasRef);
                this.hexBoard.engine.setSize(this.canvasRef.width, this.canvasRef.height);
            };
            this.resizeListener = resizeFunction;
            window.addEventListener("resize", this.resizeListener);
            //babylon.js is controlling the size, force it to resize using our container size when opened
//            this.props.glContainer.on('open', resizeFunction);
            
            //babylon.js is controlling the size, force it to resize using our container size on golden-layout resize
 //           this.props.glContainer.on('resize', resizeFunction);

            this.hexBoard = new HexBoard(this.canvasRef);
            //TODO Temp hard coded hexDimensions
            let hexDimensions = new HexDefinition(55, 1, 0, 3);
            this.hexBoard.setHexDimensions(hexDimensions);
            let contexts = [];

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
        
	        var connectingDataLink = new ConnectingDataLink();
	    
	        var connectingDataSource = new EmittingDataSource();
	        connectingDataLink.setDataSource(connectingDataSource);
        
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
            
                var clones = [];
                for (i = 0; i < event.added.length; i++) {
                    if (!!event.added[i].velocity) {
                        //make a shrunken transparent clone
                        //clones.push({id:event.added[i].id+'velHead', type:'clone', clonesId:event.added[i].id, cloneAlpha:0.5, cloneScale: 0.75, dragged:false,
                        //u:event.added[i].u + event.added[i].velocity.u, v:event.added[i].v + event.added[i].velocity.v});
                         clones.push({id:event.added[i].id+'velHead', type:'simple',diameter:20,thickness:5, sides:5, color:'#0343df' , dragged:false,
                        u:event.added[i].u + event.added[i].velocity.u, v:event.added[i].v + event.added[i].velocity.v});
                        this.emitEvent('dataChanged', [{added:clones, removed:[], updated:[]}]);
                        //Connect that clone to the station with a dotted line
                        connectingDataSource.addItems([{id:event.added[i].id+'velShaft', distance:17.5, color:'blue', radius:5, sourceGap:10, destGap:10, target:event.added[i].id+'velHead', source: event.added[i].id}]);
                    }
                }
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
	        connectingDataLink.setDataSource(zStackingDataLink);

            var cellContext = new CellContext();
            contexts.push(cellContext);

            //Create a DataSourceListener which will intercept the MapMouseClicked item

            this.hexBoard.setContexts(contexts);

            this.hexBoard.init();
            drawnItemDataLink.setScene(this.hexBoard.scene);
            connectingDataLink.scene = this.hexBoard.scene;
            
            this.baseDataLink =  new EmittingDataSource();
            decoratingDataLink.setDataSource(this.baseDataLink);
            //this.baseDataLink.addItems([{id:'sun', type:'star', size: 100, u:0, v:0}]);
//            this.props.glEventHub.on( 'map-state-changed', this.setComponentState );
        },
        componentWillUnmount: function() {
 //            this.props.glEventHub.off( 'map-state-changed', this.setComponentState );
               window.removeEventListener("resize", this.resizeListener);
        },
        setComponentState: function(mapState) {
            console.log("State Set");
            this.baseDataLink.addItems(mapState);
        },
        componentWillUpdate: function(nextProps, nextState) {
            // When a new state comes in, update the map component's baseDataLink
            console.log("componentWillUpdate");
            if (!!nextState) {
                this.baseDataLink.addItems(nextState);
            }
        }
    });