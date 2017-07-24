var React = require('react');
var ReactDom = require('react-dom');
var EmittingDataSource = require('data-chains/src/EmittingDataSource.js');
var Map = require('./Map.jsx');
var Route = require('react-router-dom').Route;

/**
 * The view component is responsible for making requests and populating the datasource for the Map and Table child components
 */
module.exports = class View extends React.Component {

    constructor(props) {
        super(props);
        
        this.baseDataLink =  new EmittingDataSource();
    }

    render() {
        return (
            /* jshint ignore:start */
            <Route path="/view/map" component={Map}/>
            /* jshint ignore:end */
        );
    }
};
