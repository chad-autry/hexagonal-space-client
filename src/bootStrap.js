"use strict";
//This JS file simply bootstraps the app from the root component when the window loads
//It could be considered the equivalent of the main spring context.xml file of an old fashioned java stack

//Require all the things needed which will be injected

var jquery = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
//Need these three globals defined before golden-layout
window.jquery = jquery;
window.React = React;
window.ReactDOM = ReactDom;
var GoldenLayout = require('golden-layout');

//Keep references to these outside of the function
var myLayout, scenarioService, scenarioListComponent;

var componentMap = {};



//Mock out the ajax method of jquery for now
var originalAjax = jquery.ajax;
jquery.ajax = function(params) {
    if (params.url && params.url.indexOf('getScenarioList') >= 0) {
        params.success([{id:1, title:'Test Scene', description:'A simple test scene with no interactivity', controller:'TestScene'}]);
    } else {
        return originalAjax(params);
    }
    
};

//This function executes immediately
(function() {
    
    //Define  Scenario service in our top level scope
    //It is injected with
    //jquery for Ajax
    //The current golden-layout so a scenario can create its top level container
    //The golden-layout constructor, so a scenario can make its own golden layout
    //Common components the scenario can use
    //React and React-dom for custom components
    
    //This function is attached to execute when the window loads
    document.addEventListener('DOMContentLoaded', function() {
        
       //Our config (for now) simply defines a single tab to load the Scenarios component into
        myLayout = new GoldenLayout({
            settings:{
                showMaximiseIcon: false
            },
            content: [{
                type: 'stack',
                isClosable: false,
                content:[{
                    title:'Scenarios',
                    type:'react-component',
                    component: 'scenarios-list',
                    isClosable: false,
                    reorderEnabled: false,
                    showPopoutIcon: false
                }]
            }]
        });

        //This scenario service is a quasi-singletone, only instantiated here.
        scenarioService = new (require('./services/ScenarioService.js'))(jquery, myLayout, GoldenLayout);
        
        //The ScenarioListComponent is preented from closing, or popping out, so it is allowed to directlly interact with the scenario service.
        scenarioListComponent = require('./components/scenarioList.js')(React, scenarioService);
        
        //TODO Any component which interacts with the scenario service needs to do so using an event-emitter adapter, which doesn't exist yet

        //TODO refactor to provide and register components in another file
        componentMap['mapComponent'] = require('./components/hexMap.js')(React, jquery);
        myLayout.registerComponent( 'hex-map', componentMap['mapComponent'] );
        
        myLayout.registerComponent( 'scenarios-list', scenarioListComponent );

        myLayout.init();
    });
})();