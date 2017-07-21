var React = require('react');
var Footer = require('./Footer.jsx');
var Redirect = require('react-router-dom').Redirect;

module.exports = class Login extends React.Component {

    constructor(props) {
        super(props);
    } 
    
    render() {
        if (this.props.isAuthenticated) {
            return (
                /* jshint ignore:start */
                <Redirect to='/home'/>
                /* jshint ignore:end */
            );
        }

        return (
            /* jshint ignore:start */

            <div className="container">
                <div className="center-form panel">
                    <div className="panel-body">
                        <h2 className="text-center">Log in            </h2>
                        <button className="btn btn-block btn-google-plus" onClick={()=>this.props.authService.authenticate('google')}>
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
