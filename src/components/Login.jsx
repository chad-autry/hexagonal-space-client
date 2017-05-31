var React = require('react');
var Link = require('react-router').Link;
var Footer = require('./Footer.jsx');
var PropTypes = require('prop-types');

module.exports = class Login extends React.Component {

    constructor(props) {
        super(props);
        // This line is important!
        this.logout = this.logout.bind(this);
    } 
    
    logout() {
        this.props.route.authService.logout();
        this.context.router.push('/home');
    }

    render() {
        if (this.props.isAuthenticated) {
            this.context.router.push('/home');
        }
        return (
            /* jshint ignore:start */

            <div className="container">
                <div className="center-form panel">
                    <div className="panel-body">
                        <h2 className="text-center">Log in            </h2>
                        <button className="btn btn-block btn-google-plus" onClick={()=>this.props.route.authService.authenticate('google')}>
                            <i className="fa fa-google-plus">            </i>
                sign in with Google
                        </button>
                    </div>
                </div>
            <Footer/>
            </div>
            /* jshint ignore:end */
        );
    }
};

// ask for `router` from context
module.exports.contextTypes = {
        router: PropTypes.object.isRequired
};
