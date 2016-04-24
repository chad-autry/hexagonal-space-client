"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module ScenarioService
 */
 
  //external project required in constructors


/**
 * Pretty much the controller of the platform,
 * It is used to find what scenarios a user can see,
 * It is used to check what components are currentlly activated for the scenario,
 * It is used to activate a new scenario (downloading it if required and injecting in the service dependencies)
 * @constructor
 * @example var scenarioService = new (require(ScenarioService))(hexMapService);
 */
 module.exports = function ScenarioService(jquery, parentLayout, GoldenLayout) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof ScenarioService)) {
        return new ScenarioService(jquery);
    }

    this.scenarios = [];
    this.activeScenario = null;
    this.scenarioControllerMap = {};
    this.jquery = jquery;
    this.parentLayout = parentLayout;
    this.GoldenLayout = GoldenLayout;

    this.getScenarioList = function() {
        var getScenarioListDeferred = this.jquery.Deferred();
        jquery.ajax({
            url: '/getScenarioList',
            dataType: 'json',
            cache: false,
            success: function(data) {
                getScenarioListDeferred.resolve(data);
            },
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }
        });
        return getScenarioListDeferred.promise();
    };

    this.loadScenario = function(scenario) {
        var scenarioController;
        //Clear the current scenario
        if (!!this.activeScenario) {
           this.hexMapService.board.clear();
        }
        this.activeScenario = null;
        var scenarioService = this;
        //If we already have the scenario's backing service cached, load it
        if (this.scenarioControllerMap.hasOwnProperty(scenario.controller)) {
            this.activeScenario = scenario;
            scenarioController = new this.scenarioControllerMap[scenario.controller](parentLayout, GoldenLayout);

        } else {
            
            //TODO else set the loading icon, save current user, cancel button,
            jquery.getScript( scenario.controller+'.js' )
            .done(function( script, textStatus ) {
                //All the scenarios should be exported as standalone AMD modules
                var ControllerConstructor = window[scenario.controller];
                //Cache our constructor
                scenarioService.scenarioControllerMap[scenario.controller] = ControllerConstructor;
                
                //All the scenarios are injected with the same things on the constructor
                //The top-level golden-layout (so it can presumablly add itself as a child)
                //The prepped goden-layout constructor (so it can presumablly create a child golden-layout)
                //A map of common React components it can register and use with its presumed golden-layout
                scenarioController = new ControllerConstructor(parentLayout, GoldenLayout);
            })
            .fail(function( jqxhr, settings, exception ) {
                alert('Failed to load script');
            });
        }
    };
};