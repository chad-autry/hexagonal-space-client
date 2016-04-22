/**
 * Factory function, returns a React component given the required params
 * Injecting all dependencies (instead of just using require) since some modules are dynamically loaded
 * And require does not give duplicate objects
 * @param React - React, used to declare the class
 * @param ScenarioService - The scenario service used to for all actions
 */
module.exports = function(React, jquery) {
    return React.createClass({
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
            
            //babylon.js is controlling the size, force it to resize using our container size
            this.props.glContainer.on('open', (event) => {
                this.hexBoard.engine.setSize(this.props.glContainer.width, this.props.glContainer.height);
                //this.setState({width: this.props.glContainer.width});
                //this.setState({height: this.props.glContainer.height});
            });
            
            //babylon.js is controlling the size, force it to resize using our container size
            this.props.glContainer.on('resize', (event) => {
                this.hexBoard.engine.setSize(this.props.glContainer.width, this.props.glContainer.height);
                //this.setState({width: this.props.glContainer.width});
                //this.setState({height: this.props.glContainer.height});
            });
            
            var HexBoard = require('hex-grid-map-3d/src/HexBoard.js');
            var GridContext = require('hex-grid-map-3d/src/contexts/InverseGridContext.js');
            //var CellContext = require('hex-grid-map-3d/src/contexts/CellContext.js');
            //Actually init the hex grid map once the canvas is available
            var HexDefinition = require('cartesian-hexagonal');
            this.hexBoard = new HexBoard(this.canvasRef);
            var hexDimensions = new HexDefinition(55, 1, 0, 3);
            this.hexBoard.setHexDimensions(hexDimensions);
            var contexts = [];
             contexts.push(new GridContext(hexDimensions));
            //var cellContext = new CellContext();
            //contexts.push(cellContext);
            this.hexBoard.setContexts(contexts);

            this.hexBoard.init();
        }
    });
};