import React from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

function onChange(newValue) {
  console.log('change',newValue);
}

// Render editor
module.exports = React.createClass({
    render: function () {
        return (
            /* jshin ignore:start */
            <div style={{width: '100%',position: 'absolute',top: this.props.navbarHeight+'px',bottom: 0}}>
            <AceEditor
                mode="javascript"
                height="100%"
                width="100%"
                theme="github"
                onChange={onChange}
                name="code-editor"
                editorProps={{$blockScrolling: true}}/>
            </div>
            /* jshint ignore:end */
        );
    }
});
