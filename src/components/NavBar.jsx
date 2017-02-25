var React = require('react');
var NavItem = require('./NavItem.jsx');
var Measure = require('react-measure');

/**
 * Create a React component for the NavBar
 * The only state it contains is if it is collapsed or not
 * It is passed in authentication, and route state for display
 */
module.exports = React.createClass({
    getInitialState: function() {
        return {menuCollapsed: true};
    },
    menuClicked: function() {
        this.setState({
            menuCollapsed: !this.state.menuCollapsed
        });
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        // Don't blow the stack out by re-rendering when this components height is set to the parent
        return this.props.isAuthenticated == nextProps.isAuthenticated;
    },
    render: function() {
        return (
            /* jshint ignore:start */
<Measure onMeasure={(dimensions) => this.props.setNavHeight(dimensions.height)}>
            <div className="navbar navbar-default" style={{zIndex:300}}>
                <div className="navbar-header" onClick={this.menuClicked}>
                    <div className="navbar-toggle">
                        <span className="sr-only">Toggle navigation</span>
                        <i className={this.state.menuCollapsed ? 'fa fa-chevron-right':'fa fa-chevron-down'}></i>
                    </div>
                    <div className="navbar-brand">
                        <i className="fa fa-rocket"></i>
                    </div>
                </div>
                { /*Programatically controll hiding the collapse using react.
                    Due to hdpi devices, we're collapsible on both on both xs and sm screens */ }
                <div className={this.state.menuCollapsed ? 'navbar-collapse hidden-xs hidden-sm' : 'navbar-collapse'}>
                    <ul className="nav navbar-nav">
                        <NavItem to="/map" activeClassName="active">
                            <i className="fa fa-map"></i> Map
                        </NavItem>
                        {/*We only show the code NavItem if the user is logged on*/}
                        {this.props.isAuthenticated ? (
                            <NavItem to="/code" activeClassName="active">
                                <i className="fa fa-code"></i> Code
                            </NavItem>
                        ) : null} 
                        <NavItem to="/docs" activeClassName="active">
                            <i className="fa fa-book"></i> Docs
                        </NavItem>
                        <li>
                            <a href="https://github.com/chad-autry/hexagonal-space-client/issues">
                                <i className="fa fa-comments"></i> Support
                            </a>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                            <NavItem to={this.props.isAuthenticated ? "/userMgmnt" : "/login"} activeClassName="active">
                                 <i className={this.props.isAuthenticated ? "fa fa-user" : "fa fa-sign-in"}></i> {this.props.isAuthenticated ? this.props.authService.getPayload().displayName + ' ': "Logon "}
                            </NavItem>
                    </ul>
                </div>
            </div>
</Measure>
            /* jshint ignore:end */
        );
    }
});
