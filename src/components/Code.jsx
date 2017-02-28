import React from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

// Render editor
module.exports = React.createClass({
    getInitialState: function() {
        return {code: "", menuCollapded: true};
    },
    codeChanged: function(value) {
       this.setState({code:value}); 
    },
    menuClicked: function() {
        this.setState({
            menuCollapsed: !this.state.menuCollapsed
        });
    },
    render: function () {
        return (
            /* jshin ignore:start */
            <div style={{width: '100%',position: 'fixed',left:0,right:0,top: this.props.navbarHeight+'px',bottom: 0}}>
                <div className="container">
                    <div className="panel panel-default">
                    <div className="panel-heading">
                            <ul className="nav navbar-left">
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" onClick={this.menuClicked} role="button" aria-haspopup="true" aria-expanded="true">Menu</a>
                                    <ul className="dropdown-menu" style={{display:this.state.menuCollapsed ? 'block' : 'none'}}>
                                        <li><a href="#">Action</a></li>
                                        <li><a href="#">Another action</a></li>
                                        <li><a href="#">Something else here</a></li>
                                        <li role="separator" className="divider"></li>
                                        <li><a href="#">Separated link</a></li>
                                    </ul>
                                </li>
                            </ul>
                    </div>
                    <table className="table" style={{height:'100%'}}>
                    <tbody style={{height:'100%'}}>
                    <tr style={{height:'100%'}}>
                    <td>
                    <AceEditor
                        mode="javascript"
                        value={this.state.code}
                        height="100%"
                        width="100%"
                        theme="github"
                        onChange={this.codeChanged}
                        name="code-editor"
                        editorProps={{$blockScrolling: true}}/>
                    </td>
                    </tr>
                    </tbody>
                    </table>
                    </div>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }
});
