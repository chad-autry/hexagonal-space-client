"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module ScenarioService
 */
 
  //external project required in constructors



 var System = require('systemjs');

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
    this.activeScenario = null;
    this.hexMapService = hexMapService;
    this.scenarioControllerMap = {};
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
    };

    this.getScenarios = function() {
       return this.scenarios;
    };

    this.activateScenario = function(scenario) {
       var scenarioController;
       //Clear the current scenario
       if (!!this.activeScenario) {
          this.hexMapService.board.clear();
       }
       this.activeScenario = null;
       //If we already have the scenario's backing service cached, load it
       if (this.scenarioControllerMap.hasOwnProperty(scenario.controller)) {
           this.activeScenario = scenario;
           scenarioController = new this.scenarioControllerMap[scenario.controller](this.hexMapService.mapDataListener, this.hexMapService);
           this.activeScenario = scenarioController;
           
       } else {
           //TODO else set the loading icon, save current user, cancel button, 
           //and asyncronously load the service
           System.import(scenario.controller).then(controllerConstructor => {
               //TODO Check if we're still the same user and make sure the async operation wasn't canceled
               this.scenarioControllerMap[scenario.controller] = controllerConstructor;
               scenarioController = new controllerConstructor(this.hexMapService.mapDataListener, this.hexMapService);
               
               this.activeScenario = scenarioController;
           });
       }
    };

    this.isActive = function(scenario) {
        return !!scenario && !!this.activeScenario && scenario.id === this.activeScenario.id;
    };
};