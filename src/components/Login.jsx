import React from 'react';
import Footer from './Footer.jsx';
import Redirect from 'react-router-dom';

const Login = class Login extends React.Component {

    constructor(props) {
        super(props);
    } 
    
    render() {
        if (this.props.isAuthenticated) {
            return (
                <Redirect to='/home'/>
            );
        }

        return (
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
        );
    }
};

export default Login;
