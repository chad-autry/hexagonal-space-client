import React from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import moment from 'moment';

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/theme/textmate';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/terminal';

// Render editor
module.exports = class Code extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activeTitle:null, activeHash:null, codeList:{userScripts:[], shipScripts:[]}, code: "", title: "", type:"user", menuCollapsed: true, codeListCollapsed: true, editorStyle:"github", edited: false, shipScriptListCollapsed:true, userScriptListCollapsed:true};
        // Bind the methods to the object's this 
        this.codeChanged = this.codeChanged.bind(this);
        this.menuClicked = this.menuClicked.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.typeClicked = this.typeClicked.bind(this);
        this.codeListClicked = this.codeListClicked.bind(this);
        this.editorStyleChanged = this.editorStyleChanged.bind(this);
        this.saveClicked = this.saveClicked.bind(this);
        this.getList = this.getList.bind(this);
        this.codeClicked = this.codeClicked.bind(this);
        this.shipScriptRowClicked = this.shipScriptRowClicked.bind(this);
        this.userScriptRowClicked = this.userScriptRowClicked.bind(this);
        this.activateUserScript = this.activateUserScript.bind(this);
        this.deactivateUserScript = this.deactivateUserScript.bind(this);
        this.getList();
    }

    codeChanged(value) {
       this.setState({code:value, edited:true}); 
    }

    titleChanged(event) {
       if (!!event.target.value) {
           this.setState({title:event.target.value, edited:true});
       } else {
           this.setState({title:'', edited:false});
       }
    }

    typeClicked() {
        if (this.state.type === "user") {
            this.setState({type:"ship", edited:true});
        } else {
           this.setState({type:"user", edited:true});
        }
    }

    menuClicked() {
        this.setState({
            menuCollapsed: !this.state.menuCollapsed
        });
    }

    codeListClicked() {
        this.setState({codeListCollapsed: !this.state.codeListCollapsed});
    }

    editorStyleChanged(event) {
        this.setState({
            editorStyle: event.target.value, 
            menuCollapsed: true
        });
    }

    getList() {
        this.props.route.fetchService.getJsonWithAuth('./backend/code/list', 'application/json', (json) => {
        this.setState({"activeTitle":json.activeUserScript.title, "activeHash":json.activeUserScript.hash, "codeList":json});}, () => {},{}); 
    }

    codeClicked(type, title, hash) {
        let then = (json) => {
            this.setState({"type":type, "code":json.code, "title":title, "edited":false});
        }
        this.props.route.fetchService.getJsonWithAuth('./backend/code/view', 'application/json', then, () => {},{"type":type, "title":title, "hash":hash});
    }

    saveClicked(event) {
        //TODO reload the list of scripts once a save finishes
        //TODO Notify if there was an error saving a script
        this.props.route.fetchService.postWithAuth('./backend/code/save', 'application/json', JSON.stringify({"title":this.state.title, "code":this.state.code, "type":this.state.type}),
            () => {this.getList()}, () => {});
        this.setState({edited:false});
    }

    userScriptRowClicked() {
        this.setState({"userScriptListCollapsed":!this.state.userScriptListCollapsed});
    }

    shipScriptRowClicked() {
        this.setState({"shipScriptListCollapsed":!this.state.shipScriptListCollapsed});
    }

    activateUserScript(title, hash) {
        let then = (json) => {
            this.setState({"activeTitle":title, "activeHash":hash});
        }
        this.props.route.fetchService.putWithAuth('./backend/code/activateUserScript', 'application/json', then, () => {},{"title":title, "hash":hash});
    }

    deactivateUserScript(title, hash) {
        let then = (json) => {
            this.setState({"activeTitle":null, "activeHash":null});
        }
        this.props.route.fetchService.putWithAuth('./backend/code/deactivateUserScript', 'application/json', then, () => {},{"title":title, "hash":hash});
    }

    render() {
        let userScriptList = null;
        let shipScriptList = null;
        if (!this.state.codeListCollapsed) {
            if (!this.state.userScriptListCollapsed) {
                userScriptList = [];
                for (var i = 0; i < this.state.codeList.userScripts.length; i++) {
                    userScriptList.push(<ParentRow key={this.state.codeList.userScripts[i].title} type='user' activeTitle={this.state.activeTitle} activeHash={this.state.activeHash} deactivateUserScript={this.deactivateUserScript} activateUserScript={this.activateUserScript} codeClicked={this.codeClicked} addAlert={this.props.addAlert} title={this.state.codeList.userScripts[i].title} children={this.state.codeList.userScripts[i].children} />);
                }
            }
            if (!this.state.shipScriptListCollapsed) {
                shipScriptList = [];
                for (var i = 0; i < this.state.codeList.shipScripts.length; i++) {
                    shipScriptList.push(<ParentRow key={this.state.codeList.shipScripts[i].title} type='ship' codeClicked={this.codeClicked} addAlert={this.props.addAlert} title={this.state.codeList.shipScripts[i].title} children={this.state.codeList.shipScripts[i].children} />);
                }
            }
        }
        return (
            /* jshint ignore:start */
            <div style={{width: '100%',position: 'fixed',left:0,right:0,top: this.props.navbarHeight+'px',bottom: 0}}>
                <div className="container">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <div className="input-group">
                                <span className="input-group-btn">
                                    <button className="btn btn-default" onClick={this.codeListClicked}>
                                        &#8203;<i className={this.state.codeListCollapsed ? 'fa fa-chevron-left':'fa fa-chevron-right'}></i>
                                    </button>
                                    <button className="btn btn-default" onClick={this.typeClicked}>
                                        &#8203;<i className={this.state.type === "ship" ? 'fa fa-fw fa-rocket':'fa fa-fw fa-user'}></i>
                                    </button>
                                </span>
                              {/*   <span className="input-group-btn">
                                    <button className="btn btn-default dropdown-toggle" onClick={this.menuClicked} aria-haspopup="true" aria-expanded="true">Menu</button>
                                    <ul className="dropdown-menu" style={{display:!this.state.menuCollapsed ? 'block' : 'none'}}>
                                        <li><a href="#">Show Script List</a></li>
                                        <li role="separator" className="divider"></li>
                                        <li style={{marginLeft:'5px',marginRight:'5px'}}>
                                            <select className="form-control"
                                             value={this.state.editorStyle}
                                             onChange={this.editorStyleChanged}>
                                                <option>monokai</option>
                                                <option>github</option>
                                                <option>tomorrow</option>
                                                <option>kuroir</option>
                                                <option>twilight</option>
                                                <option>xcode</option>
                                                <option>textmate</option>
                                                <option value="solarized_dark">solarized dark</option>
                                                <option value="solarized_light">solarized light</option>
                                                <option>terminal</option>
                                            </select>
                                        </li>
                                    </ul>
                                </span> */}
                                <input type="text" className="form-control" value={this.state.title} onChange={this.titleChanged} placeholder="Script Title" aria-describedby="title" />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" onClick={this.saveClicked} disabled={!this.state.title || !this.state.edited}>Save</button>
                                </span>
                            </div> 
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-6 no-padding" style={{display:!this.state.codeListCollapsed ? 'block' : 'none'}}>
                                     <table className="table table-hover no-margin">
                                         <tbody>
                                              <tr onClick={this.userScriptRowClicked}><td><i className={this.state.userScriptListCollapsed ? 'fa fa-chevron-up':'fa fa-chevron-down'}></i><i className='fa fa-fw fa-user'></i></td></tr>
                                         </tbody>
                                         {userScriptList}
                                         <tbody>
                                              <tr onClick={this.shipScriptRowClicked}><td><i className={this.state.shipScriptListCollapsed ? 'fa fa-chevron-up':'fa fa-chevron-down'}></i><i className='fa fa-fw fa-rocket'></i></td></tr>
                                         </tbody>
                                         {shipScriptList}
                                    </table>
                                </div>
                                <div className={this.state.codeListCollapsed ? "col-xs-12 no-padding" : "col-xs-6 no-padding"}>
                                        <AceEditor
                                            mode="javascript"
                                            value={this.state.code}
                                            height="100%"
                                            width="100%"
                                            theme={this.state.editorStyle}
                                            onChange={this.codeChanged}
                                            name="code-editor"
                                            editorProps={{$blockScrolling: true}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }
};

class ParentRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {collapsed: true};
        // Bind the methods to the object's this
        this.rowClicked = this.rowClicked.bind(this);
    }

    rowClicked() {
        this.setState({collapsed: !this.state.collapsed});
    }

    render() {
        let children = [];
        if (!this.state.collapsed && !!this.props.children) {
            for (let i = 0; i < this.props.children.length; i++) {
                let isActive = this.props.activeTitle == this.props.title && this.props.activeHash == this.props.children[i].hash
                children.push(<tr key={this.props.children[i].created}>
                    <td>
                        <i className='fa fa-chevron-down' aria-hidden="true" style={{visibility: 'hidden'}}></i>
                        <i className='fa fa-chevron-down' aria-hidden="true" style={{visibility: 'hidden'}}></i>
                        &nbsp;
                        <button type="button" className="btn btn-link text-muted no-padding" onClick={() => {this.props.codeClicked(this.props.type, this.props.title,this.props.children[i].hash)}}><i className='fa fa-eye fa-fw'></i></button>
                        <button type="button" className="btn btn-link text-muted no-padding" onClick={() => {this.props.addAlert({type:'info', text:this.props.children[i].hash})}}><i className='fa fa-hashtag fa-fw'></i></button>
                        {this.props.type == 'user' && !isActive &&
                            <button type="button" className="btn btn-link text-muted no-padding" onClick={() => {this.props.activateUserScript(this.props.title,this.props.children[i].hash)}}><i className='fa fa-flag-o fa-fw'></i></button>
                        }
                        {this.props.type == 'user' && isActive &&
                            <button type="button" className="btn btn-link text-muted no-padding" onClick={() => {this.props.deactivateUserScript(this.props.title,this.props.children[i].hash)}}><i className='fa fa-flag fa-fw'></i></button>
                        }
                        &nbsp;
                        {moment(this.props.children[i].created*1000).fromNow()}
                   </td>
                </tr>);
            }
        }
        return (
            /* jshint ignore:start */
                <tbody>
                    <tr onClick={this.rowClicked}><td><i className='fa fa-chevron-down' aria-hidden="true" style={{visibility: 'hidden'}}></i><i className={this.state.collapsed ? 'fa fa-chevron-up':'fa fa-chevron-down'}></i>&nbsp;{this.props.title}</td></tr>
                    {children}
                </tbody>
            /* jshint ignore:end */
        );
    }
}
