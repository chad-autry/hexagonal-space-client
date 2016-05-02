var jquery = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');

/**
 * Factory function, returns a React component given the required params
 * Injecting all dependencies (instead of just using require) since some modules are dynamically loaded
 * And require does not give duplicate objects
 * @param React - React, used to declare the class
 * @param ScenarioService - The scenario service used to for all actions
 */
module.exports = React.createClass({
        getInitialState: function() {
            return this.props.initialState;
        },
        render: function() {
            return (
                <canvas hdpi="off" ref={(canvasRef) => this.canvasRef = canvasRef} resize hidpi="off" style={{backgroundColor: 'green', width: '100%' , height: '100%', zIndex: 200}}></canvas>
            );
        },
        componentDidMount() {
            //React doesn't seem to support the hdpi attribute
            this.canvasRef.hdpi="off";
            
            let resizeFunction = (event) => {
                this.hexBoard.engine.setSize(this.props.glContainer.width, this.props.glContainer.height);
            };
            //babylon.js is controlling the size, force it to resize using our container size when opened
            this.props.glContainer.on('open', resizeFunction);
            
            //babylon.js is controlling the size, force it to resize using our container size on golden-layout resize
            this.props.glContainer.on('resize', resizeFunction);
            
            let HexBoard = require('hex-grid-map-3d/src/HexBoard.js');
            let GridContext = require('hex-grid-map-3d/src/contexts/InverseGridContext.js');
            //var CellContext = require('hex-grid-map-3d/src/contexts/CellContext.js');
            //Actually init the hex grid map once the canvas is available
            let HexDefinition = require('cartesian-hexagonal');
            this.hexBoard = new HexBoard(this.canvasRef);
            //TODO Temp hard coded hexDimensions
            let hexDimensions = new HexDefinition(55, 1, 0, 3);
            this.hexBoard.setHexDimensions(hexDimensions);
            let contexts = [];
            contexts.push(new GridContext(hexDimensions));
            //var cellContext = new CellContext();
            //contexts.push(cellContext);
            this.hexBoard.setContexts(contexts);

            this.hexBoard.init();
        }
    });