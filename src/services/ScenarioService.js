"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module ScenarioService
 */
 

/**
 * Pretty much the controller of the platform, 
 * It is used to find what scenarios a user can see,
 * It is used to check what components are currentlly activated for the scenario, 
 * It is used to activate a new scenario (downloading it if required and injecting in the service dependencies)
 * @constructor
 * @example var scenarioService = new (require(ScenarioService))();
 */
 module.exports = function ScenarioService() {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof ScenarioService)) {
        return new ScenarioService();
    }
    
    var scenarios = [];
    var activeScenario;
           
    //Just pushing a single hard coded test instance that can be decorated with new values as I figure out what's needed
    scenarios.push({instances:[], title:'Test Flight', description:'A basic local scenario where the user can manually move a single ship for testing',singleton: true});
    scenarios.push({instances:[], title:'Bulk It Up', description:'A fake scenario so two can be in the list', singleton: true});
       
    this.isShowMap = function() {
        //Delegate to the activated scenario
        return !!this.activeScenario;
    };
    
    this.getScenarios = function() {
       return scenarios;
    };
    
    this.activateScenario = function(scenario) {
       this.activeScenario = scenario;
       console.log(scenario.title + this.isShowMap());
    };
    
    this.isActive = function(scenario) {
        return scenario === this.activeScenario;
    };
};