var NavBar = require('./NavBar.jsx');
var React = require('react');


module.exports = class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        //Register for Authentication state changes
        this.props.route.authService.onAuthChange(() => {
            this.setState({
                isAuthenticated: this.props.route.authService.isAuthenticated()
            });

        });
        this.state = {isAuthenticated: this.props.route.authService.isAuthenticated()};
        // This line is important!
        this.setNavHeight = this.setNavHeight.bind(this);
    }    

    setNavHeight(navbarHeight) {
        this.setState({
           "navbarHeight": navbarHeight
        });
    }

    render() {
        var childrenWithProps = React.cloneElement(this.props.children, {isAuthenticated: this.state.isAuthenticated,
            navbarHeight:this.state.navbarHeight});
        return (
            /* jshint ignore:start */
            <div className="container">
                <NavBar setNavHeight={this.setNavHeight} authService={this.props.route.authService} isAuthenticated={this.state.isAuthenticated}/>
                {childrenWithProps}
            </div>
            /* jshint ignore:end */
        );
    }
};
