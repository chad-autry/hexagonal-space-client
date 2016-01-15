"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module ScenarioService
 */
 
 var HexDefinition = require('cartesian-hexagonal'); //external project required in constructors
 var GridContext = require('hex-grid-map/src/contexts/GridContext.js');

/**
 * Pretty much the controller of the platform, 
 * It is used to find what scenarios a user can see,
 * It is used to check what components are currentlly activated for the scenario, 
 * It is used to activate a new scenario (downloading it if required and injecting in the service dependencies)
 * @constructor
 * @example var scenarioService = new (require(ScenarioService))(hexMapService);
 */
 module.exports = function ScenarioService(hexMapService, http, auth) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof ScenarioService)) {
        return new ScenarioService(hexMapService);
    }
    
    this.scenarios = [];
    this.activeScenario;
    this.hexMapService = hexMapService;
    this.http = http;
    this.auth = auth;
       
    this.isShowMap = function() {
        //Delegate to the activated scenario
        return !!this.activeScenario;
    };
    
    this.loadScenarios = function() {
        //Check wether we need to go load the scenarios or if we already have them
        //save off the current userId
       // var remoteCallUserId = this.auth.userId;
        this.http.request('/scenarios').subscribe(
            res => {
                //If the user is still the same after the async call, set the scenarios
                this.scenarios = res.json().scenarios;
            }
        );
    }
    
    this.getScenarios = function() {
       return this.scenarios;
    };
    
    this.activateScenario = function(scenario) {
       this.activeScenario = scenario;
       console.log(scenario.title + this.isShowMap());
       var hexDimensions = new HexDefinition(55, 0.5, 0, 3);
       var contexts = [];
       this.hexMapService.board.clear();
       contexts.push(new GridContext(hexDimensions));
       this.hexMapService.board.setHexDimensions(hexDimensions);
       this.hexMapService.board.setContexts(contexts);
       this.hexMapService.board.init();
    };
    
    this.isActive = function(scenario) {
        return scenario === this.activeScenario;
    };
};