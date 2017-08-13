import React from 'react';
import ReactDom from 'react-dom';
import EmittingDataSource from 'data-chains/src/EmittingDataSource.js';
import Map from './Map.jsx';
import { Route } from 'react-router-dom';

/**
 * The view component is responsible for making requests and populating the datasource for the Map and Table child components
 */
const View = class View extends React.Component {

    constructor(props) {
        super(props);
        
        this.baseDataLink =  new EmittingDataSource();
    }

    render() {
        return (
            <Route path="/view/map" component={Map}/>
        );
    }
};

export default View;