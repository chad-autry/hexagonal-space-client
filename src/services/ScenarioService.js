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
 module.exports = function ScenarioService(hexMapService, http) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof ScenarioService)) {
        return new ScenarioService(hexMapService);
    }
    
    var scenarios = [];
    var activeScenario;
    this.hexMapService = hexMapService;
    this.http = http;
           
    //Just pushing a single hard coded test instance that can be decorated with new values as I figure out what's needed
    scenarios.push({instances:[], title:'Test Flight', description:'A basic local scenario where the user can manually move a single ship for testing',singleton: true});
    scenarios.push({instances:[], title:'Bulk It Up', description:'A fake scenario so two can be in the list', singleton: true});
       
    this.isShowMap = function() {
        //Delegate to the activated scenario
        return !!this.activeScenario;
    };
    
    this.loadScenarios = function() {
        this.http.request('/scenarios').subscribe(res => console.log(res));
    }
    
    this.getScenarios = function() {
       return scenarios;
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