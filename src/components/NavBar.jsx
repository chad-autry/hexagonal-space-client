var React = require('react');
var NavItem = require('./NavItem.jsx');

/**
 * Create a React component for the NavBar
 * The only state it contains is if it is collapsed or not
 * It is passed in authentication, and route state for display
 */
module.exports = class NavBar extends React.Component{

    constructor(props) {
        super(props);
        this.state = {menuCollapsed: true};
        // This line is important!
        this.menuClicked = this.menuClicked.bind(this);
    }

    menuClicked() {
        this.setState({
            menuCollapsed: !this.state.menuCollapsed
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Don't blow the stack out by re-rendering when this components height is set to the parent
        return this.props.isAuthenticated != nextProps.isAuthenticated || 
        this.state.menuCollapsed != nextState.menuCollapsed ||
        this.props.location.pathname != nextProps.location.pathname;
    }

    render() {
        return (
            /* jshint ignore:start */
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
                        <NavItem to="/map" location={this.props.location}>
                            <i className="fa fa-map"></i> Map
                        </NavItem>
                        {/*We only show the code NavItem if the user is logged on*/}
                        {this.props.isAuthenticated ? (
                            <NavItem to="/code" location={this.props.location}>
                                <i className="fa fa-code"></i> Code
                            </NavItem>
                        ) : null} 
                        <NavItem to="/docs" location={this.props.location}>
                            <i className="fa fa-book"></i> Docs
                        </NavItem>
                        <li>
                            <a href="https://github.com/chad-autry/hexagonal-space-client/issues">
                                <i className="fa fa-comments"></i> Support
                            </a>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                            <NavItem to={this.props.isAuthenticated ? "/userMgmnt" : "/login"} location={this.props.location}>
                                 <i className={this.props.isAuthenticated ? "fa fa-user" : "fa fa-sign-in"}></i> {this.props.isAuthenticated ? this.props.authService.getPayload().displayName + ' ': "Logon "}
                            </NavItem>
                    </ul>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }
};
