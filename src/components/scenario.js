/**
 * Factory function, returns a React component given the required params
 * Injecting all dependencies (instead of just using require) since some modules are dynamically loaded
 * And require does not give duplicate objects
 * @param React - React, used to declare the class
 * @param ScenarioService - The scenario service used to for all actions
 */
module.exports = function(React, scenarioService) {
    return React.createClass({
        getInitialState: function() {
            return this.props.scenarioData;
        },
        handleClick: function() {
            scenarioService.loadScenario(this.state);
        },
        render: function() {
            return (
                <div onClick={this.handleClick} className="panel panel-default">
                    <div className="panel-heading">
                        { /*Note: Floating elements using pull-right need to come before non-floating elements in order to be vertically centered properly*/ }
                    
                        <h3 className="panel-title">{this.state.title}</h3>
    
                    </div>
                    <div className="panel-body">
                        <p>{this.state.description}</p>
                    </div>
                </div>
            );
        }
    });
};