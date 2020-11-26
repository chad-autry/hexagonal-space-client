import React from "react";
import HexBoard from "hex-grid-map/src/HexBoard.js";
import BackgroundContext from "hex-grid-map/src/contexts/RandomStaryBackgroundContext.js";
import ForegroundContext from "hex-grid-map/src/contexts/LensFlareForegroundContext.js";
import GridContext from "hex-grid-map/src/contexts/GridContext.js";
import CellContext from "hex-grid-map/src/contexts/CellContext.js";
import VectorDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/VectorDrawnItemFactory.js";
import PathDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/PathDrawnItemFactory.js";
import ArrowDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/ArrowDrawnItemFactory.js";
import DelegatingDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/DelegatingDrawnItemFactory.js";
import DrawnItemContext from "hex-grid-map/src/contexts/DrawnItemContext.js";
import DataSource from "hex-grid-map/src/dataSources/DataSource.js";
import CellDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/RegularPolygonDrawnItemFactory";
import SphereDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/SphereDrawnItemFactory";
import FieldOfSquaresDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/FieldOfSquaresDrawnItemFactory";
import HexDefinition from "cartesian-hexagonal";
import makeDataLink from "data-chains/src/DataLinkMixin";
import EmittingDataSource from "data-chains/src/EmittingDataSource.js";

/**
 * Factory function, returns a React component given the required params
 * Injecting all dependencies (instead of just using require) since some modules are dynamically loaded
 * And require does not give duplicate objects
 * @param React - React, used to declare the class
 * @param ScenarioService - The scenario service used to for all actions
 */
const Map = class Map extends React.Component {
  constructor(props) {
    super(props);
    // This line is important!
    this.setComponentState = this.setComponentState.bind(this);
    this.baseDataLink = props.dataLink;
  }

  render() {
    return (
      <canvas
        ref={canvasRef => (this.canvasRef = canvasRef)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "black",
          width: "100%",
          height: "100%",
          zIndex: 200
        }}
      />
    );
  }

  resizeCanvas(canvas) {
    /*
    // Lookup the size the browser is displaying the canvas.
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;
    let ctx = canvas.getContext("webgl");
    let dpr = window.devicePixelRatio || 1;
    let bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;

    let ratio = dpr / bsr;

    //Now make the canvas draw at the display size multiplied by the ratio
    canvas.width = displayWidth * ratio;
    canvas.height = displayHeight * ratio;
    */
  }

  componentDidMount() {
    this.resizeCanvas(this.canvasRef);
    let resizeFunction = () => {
      this.resizeCanvas(this.canvasRef);
      //    this.hexBoard.engine.setSize(this.canvasRef.width, this.canvasRef.height);
    };
    this.resizeListener = resizeFunction;
    window.addEventListener("resize", this.resizeListener);
    //babylon.js is controlling the size, force it to resize using our container size when opened
    //            this.props.glContainer.on('open', resizeFunction);

    //babylon.js is controlling the size, force it to resize using our container size on golden-layout resize
    //           this.props.glContainer.on('resize', resizeFunction);

    this.hexBoard = new HexBoard(this.canvasRef);
    //TODO Temp hard coded hexDimensions
    let hexDimensions = new HexDefinition(55, 0.5, 0, 3);
    this.hexBoard.setHexDimensions(hexDimensions);
    this.hexBoard.setContexts([
      new GridContext(hexDimensions),
      new BackgroundContext()
    ]);

    this.hexBoard.init();
  }

  componentWillUnmount() {
    //            this.props.glEventHub.off( 'map-state-changed', this.setComponentState );
    window.removeEventListener("resize", this.resizeListener);
    this.hexBoard.clear();
    this.hexBoard.paper.tool.remove();
  }

  setComponentState(mapState) {
    this.baseDataLink.addItems(mapState);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // When a new state comes in, update the map component's baseDataLink
    if (nextState) {
      this.baseDataLink.addItems(nextState);
    }
  }
};

export default Map;
