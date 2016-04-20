

/**
 * Factory function, returns a React component given the required params
 * Injecting all dependencies (instead of just using require) since some modules are dynamically loaded
 * And require does not give duplicate objects
 * @param React - React, used to declare the class
 * @param ScenarioService - The scenario service used to for all actions
 */
module.exports = function(React, scenarioService) {
    var Scenario = require('./scenario.js')(React, scenarioService);
    return React.createClass({
        getInitialState: function() {
            return { scenarios: []};
        },
        componentDidMount: function() {
            
            var scenarioListPromise = scenarioService.getScenarioList();
            scenarioListPromise.done((scenarios) => {
                this.setState({scenarios: scenarios});
            });
            //TODO Handle failures
        },
        render: function() {
            return (
                <div className="container">
                    <div className="container-fluid">
                        <div className="row">
                            {this.state.scenarios.map(function( scenario ){
                                return (
                                    <div key={scenario.id} className="col-xs-12 col-md-6" >
                                        <Scenario scenarioData={scenario}/>
                                    </div>
                                );
                                
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    });
};