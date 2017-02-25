import React from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

// Render editor
module.exports = React.createClass({
    getInitialState: function() {
        return {code: ""};
    },
    codeChanged: function(value) {
       this.setState({code:value}); 
    },
    render: function () {
        return (
            /* jshin ignore:start */
            <div style={{width: '100%',position: 'fixed',left:0,right:0,top: this.props.navbarHeight+'px',bottom: 0}}>
                <div className="container">
                    <AceEditor
                        mode="javascript"
                        value={this.state.code}
                        height="100%"
                        width="100%"
                        theme="github"
                        onChange={this.codeChanged}
                        name="code-editor"
                        editorProps={{$blockScrolling: true}}/>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }
});
