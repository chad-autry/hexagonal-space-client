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
import DataSource from "../dataSources/baseDataSource.js";
import CellDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/RegularPolygonDrawnItemFactory";
import SphereDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/SphereDrawnItemFactory";
import FieldOfSquaresDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/FieldOfSquaresDrawnItemFactory";
import SVGDrawnItemFactory from "hex-grid-map/src/drawnItemFactories/SVGDrawnItemFactory";
import HexDefinition from "cartesian-hexagonal";

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
    // Bind functions here V
    //this.setComponentState = this.setComponentState.bind(this);
    this.cellDataSource = new DataSource();
    this.baseDataLink = props.dataLink;
    let rocketSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 640 512"><!-- Font Awesome Pro 5.15.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M592.604 208.244C559.735 192.836 515.777 184 472 184H186.327c-4.952-6.555-10.585-11.978-16.72-16H376C229.157 137.747 219.403 32 96.003 32H96v128H80V32c-26.51 0-48 28.654-48 64v64c-23.197 0-32 10.032-32 24v40c0 13.983 8.819 24 32 24v16c-23.197 0-32 10.032-32 24v40c0 13.983 8.819 24 32 24v64c0 35.346 21.49 64 48 64V352h16v128h.003c123.4 0 133.154-105.747 279.997-136H169.606c6.135-4.022 11.768-9.445 16.72-16H472c43.777 0 87.735-8.836 120.604-24.244C622.282 289.845 640 271.992 640 256s-17.718-33.845-47.396-47.756zM488 296a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8c31.909 0 31.942 80 0 80z"/></svg>`;

    this.dsParsingFatFunction = () => {
      this.cellDataSource.clear();
      //TODO Get drawables straight from the provided datasource
      this.baseDataLink.forEach(element => {
        let rotation = 0;
        let shipDirectionVector = {};
        switch (element.subType) {
          case "star":
            this.cellDataSource.addItems([
              {
                key: element.entityId,
                type: "sphere",
                size: 100,
                rotation: 63.435 * (Math.PI / 180),
                lineWidth: 3,
                greatCircleAngles: [-Math.PI / 6, Math.PI / 6, Math.PI / 2],
                latitudeAngles: [0, Math.PI / 6, Math.PI / 3, -Math.PI / 6],
                lineColor: "orange",
                backgroundColor: "yellow",
                borderStar: {
                  radius1: 3,
                  radius2: 6,
                  points: 20,
                  borderColor: "orange"
                },
                u: element.states.final.u,
                v: element.states.final.v
              }
            ]);
            break;
          case "planet":
            this.cellDataSource.addItems([
              {
                key: element.entityId,
                type: "sphere",
                size: 66,
                rotation: 63.435 * (Math.PI / 180),
                lineWidth: 3,
                greatCircleAngles: [-Math.PI / 6, Math.PI / 6, Math.PI / 2],
                latitudeAngles: [0, Math.PI / 6, Math.PI / 3, -Math.PI / 6],
                lineColor: "#653700",
                backgroundColor: "blue",
                borderWidth: 2,
                borderColor: "white",
                u: element.states.final.u,
                v: element.states.final.v
              }
            ]);
            break;
          case "moon":
            //Add a sphere to represent the moon
            this.cellDataSource.addItems([
              {
                key: element.entityId,
                type: "sphere",
                size: 33,
                rotation: 63.435 * (Math.PI / 180),
                lineWidth: 2,
                greatCircleAngles: [-Math.PI / 6, Math.PI / 6, Math.PI / 2],
                latitudeAngles: [0, Math.PI / 6, Math.PI / 3, -Math.PI / 6],
                lineColor: "grey",
                backgroundColor: "#E1E1D6",
                borderWidth: 3,
                borderColor: "black",
                u: element.states.final.u,
                v: element.states.final.v
              }
            ]);
            break;
          case "gravity":
            //Add arrow to represent gravity

            if (
              element.states.final.uGrav == 0 &&
              element.states.final.vGrav == 1
            ) {
              rotation = 180;
            } else if (
              element.states.final.uGrav == 1 &&
              element.states.final.vGrav == 0
            ) {
              rotation = 240;
            } else if (
              element.states.final.uGrav == 1 &&
              element.states.final.vGrav == -1
            ) {
              rotation = 300;
            } else if (
              element.states.final.uGrav == 0 &&
              element.states.final.vGrav == -1
            ) {
              rotation = 0;
            } else if (
              element.states.final.uGrav == -1 &&
              element.states.final.vGrav == 0
            ) {
              rotation = 60;
            } else if (
              element.states.final.uGrav == -1 &&
              element.states.final.vGrav == 1
            ) {
              rotation = 120;
            }
            this.cellDataSource.addItems([
              {
                key: element.entityId,
                type: "arrow",
                u: element.states.final.u,
                v: element.states.final.v,
                fillColor: "grey",
                lineWidth: 0,
                lineColor: "grey",
                rotation: rotation,
                scaleLength: 0.75,
                scaleWidth: 0.75
              }
            ]);
            break;
          case "halfGrav":
            //Add arrow to represent halfGrav
            if (
              element.states.final.uGrav == 0 &&
              element.states.final.vGrav == 1
            ) {
              rotation = 180;
            } else if (
              element.states.final.uGrav == 1 &&
              element.states.final.vGrav == 0
            ) {
              rotation = 240;
            } else if (
              element.states.final.uGrav == 1 &&
              element.states.final.vGrav == -1
            ) {
              rotation = 300;
            } else if (
              element.states.final.uGrav == 0 &&
              element.states.final.vGrav == -1
            ) {
              rotation = 0;
            } else if (
              element.states.final.uGrav == -1 &&
              element.states.final.vGrav == 0
            ) {
              rotation = 60;
            } else if (
              element.states.final.uGrav == -1 &&
              element.states.final.vGrav == 1
            ) {
              rotation = 120;
            }
            this.cellDataSource.addItems([
              {
                key: element.entityId,
                type: "arrow",
                u: element.states.final.u,
                v: element.states.final.v,
                fillColor: "black",
                lineWidth: 3,
                lineColor: "grey",
                rotation: rotation,
                scaleLength: 0.75,
                scaleWidth: 0.75
              }
            ]);
            break;
          case "ship":
            shipDirectionVector = this.hexDimensions.getPixelCoordinates(
              element.states.final.uVel,
              element.states.final.vVel
            );
            rotation =
              (-1 *
                180 *
                Math.atan2(-1 * shipDirectionVector.y, shipDirectionVector.x)) /
              Math.PI;
            this.cellDataSource.addItems([
              {
                key: element.entityId,
                type: "svg",
                scale: 0.5,
                svg: rocketSVG,
                u: element.states.final.u,
                v: element.states.final.v,
                rotation: rotation
              }
            ]);
        }
      });
    };
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

    this.hexBoard = new HexBoard(this.canvasRef);
    //TODO Temp hard coded hexDimensions
    let hexDimensions = new HexDefinition(55, 0.5, 0, 3);
    this.hexDimensions = hexDimensions;
    this.hexBoard.setHexDimensions(hexDimensions);

    let contexts = [];
    contexts.push(new BackgroundContext());
    //Create the cell items datasource, drawnItemFactories, and special compound contex
    let cellDataSource = this.cellDataSource;
    let simpleDrawnItemFactory = new CellDrawnItemFactory(hexDimensions);
    let sphereDrawnItemFactor = new SphereDrawnItemFactory(hexDimensions);
    let arrowDrawnItemFactory = new ArrowDrawnItemFactory(hexDimensions);
    let svgDrawnItemFactory = new SVGDrawnItemFactory(hexDimensions);

    //For Asteroids we use brown grey, brownish grey, greyish brown, grey brown. For debris would probablly go more blue-grey
    let asteroidFieldDrawnItemFactory = new FieldOfSquaresDrawnItemFactory(
      hexDimensions,
      9,
      20,
      ["#8d8468", "#86775f", "#7a6a4f", "#7f7053"]
    );
    let cellDrawnItemFactoryMap = {
      simple: simpleDrawnItemFactory,
      sphere: sphereDrawnItemFactor,
      arrow: arrowDrawnItemFactory,
      asteroids: asteroidFieldDrawnItemFactory,
      svg: svgDrawnItemFactory
    };
    let cellDrawnItemFactory = new DelegatingDrawnItemFactory(
      cellDrawnItemFactoryMap
    );
    let cellContext = new CellContext(
      cellDataSource,
      cellDrawnItemFactory,
      5,
      hexDimensions
    );

    //Push the below grid portion of the cell context
    contexts.push(cellContext.belowGridContext);

    //Create and push the grid context
    contexts.push(new GridContext(hexDimensions));

    //Define and push the paths DataSource, DrawnItemFactory, and Context
    let pathDataSource = new DataSource();
    let pathDrawnItemFactory = new PathDrawnItemFactory(hexDimensions);
    contexts.push(
      new DrawnItemContext(pathDataSource, pathDrawnItemFactory, hexDimensions)
    );

    //Definte and push the vector DataSource, DrawnItemFactory, and Context
    let vectorDataSource = new DataSource();
    let vectorDrawnItemFactory = new VectorDrawnItemFactory(hexDimensions);
    contexts.push(
      new DrawnItemContext(
        vectorDataSource,
        vectorDrawnItemFactory,
        hexDimensions
      )
    );

    //Push the above grid cell context defined earlier
    contexts.push(cellContext);

    //Create and push the LensFlareContext
    contexts.push(new ForegroundContext([{ u: 0, v: 0 }], hexDimensions));
    let globalMouseClicked = (dx, x, dy, y) => {
      var hexagonalCoordinates = hexDimensions.getReferencePoint(
        x - dx,
        y - dy
      );
      this.props.addAlert({
        type: "info",
        text:
          "Clicked U:" + hexagonalCoordinates.u + " V:" + hexagonalCoordinates.v
      });
    };
    this.hexBoard.setMouseClicked(globalMouseClicked);
    this.hexBoard.setContexts(contexts);

    this.hexBoard.init();
    this.hexBoard.centerOnCell(
      this.props.initialMapCenter.u,
      this.props.initialMapCenter.v
    );
    this.baseDataLink.addListener({
      onDataChanged: this.dsParsingFatFunction
    });
    this.dsParsingFatFunction();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeListener);
    this.props.setViewStateProperties({
      // If the board moves positive X, Y: the view moved relatively negative
      initialMapCenter: this.hexDimensions.getReferencePoint(
        this.hexBoard.viewWidth / 2 - this.hexBoard.dx,
        this.hexBoard.viewHeight / 2 - this.hexBoard.dy
      )
    });
    this.hexBoard.clear();
    this.hexBoard.paper.tool.remove();
    this.props.dataLink.clearListeners();
  }
};

export default Map;
