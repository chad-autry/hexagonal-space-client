import React from "react";
import AceEditor from "react-ace";
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner.jsx";
import LoadingOverlay from "react-loading-overlay";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

// Render editor
const Code = class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTitle: null,
      activeHash: null,
      codeList: { shipScripts: [] },
      code: "",
      title: "",
      type: "user",
      titleFilter: "",
      menuCollapsed: true,
      codeListCollapsed: true,
      editorStyle: "github",
      edited: false,
      hasMore: false,
      loadingCode: false,
      listingCode: false,
      shipScriptListCollapsed: true
    };
    // Bind the methods to the object's this
    this.codeChanged = this.codeChanged.bind(this);
    this.menuClicked = this.menuClicked.bind(this);
    this.titleChanged = this.titleChanged.bind(this);
    this.titleFilterChanged = this.titleFilterChanged.bind(this);
    this.codeListClicked = this.codeListClicked.bind(this);
    this.editorStyleChanged = this.editorStyleChanged.bind(this);
    this.saveClicked = this.saveClicked.bind(this);
    this.getList = this.getList.bind(this);
    this.codeClicked = this.codeClicked.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getList();
    if (this.props.scriptId != "") {
      this.codeClicked("", this.props.scriptId);
    }
  }
  codeChanged(value) {
    this.setState({ code: value, edited: true });
  }

  titleChanged(event) {
    if (event.target.value) {
      this.setState({ title: event.target.value, edited: true });
    } else {
      this.setState({ title: "", edited: false });
    }
  }

  titleFilterChanged(event) {
    if (event.target.value) {
      this.setState({ titleFilter: event.target.value });
    } else {
      this.setState({ titleFilter: "" });
    }
  }

  menuClicked() {
    this.setState({
      menuCollapsed: !this.state.menuCollapsed
    });
  }

  codeListClicked() {
    this.setState({ codeListCollapsed: !this.state.codeListCollapsed });
  }

  editorStyleChanged(event) {
    this.setState({
      editorStyle: event.target.value,
      menuCollapsed: true
    });
  }

  getList(titleFilter) {
    this.setState({
      listingCode: true
    });
    this.props.fetchService.getJsonWithAuth(
      "/listCode",
      "application/json",
      json => {
        this.setState({
          hasMore: json.hasMore,
          codeList: json,
          listingCode: false
        });
      },
      () => {},
      { titleFilter: titleFilter ? titleFilter : this.state.titleFilter }
    );
  }

  codeClicked(title, bodyId) {
    this.setState({
      loadingCode: true
    });
    let then = json => {
      this.setState({
        code: json.code,
        title: title,
        edited: false,
        loadingCode: false
      });
    };
    this.props.fetchService.getJsonWithAuth(
      "/viewCode",
      "application/json",
      then,
      () => {},
      { bodyId: bodyId }
    );
  }

  saveClicked() {
    this.props.fetchService.postWithAuth(
      "/saveCode",
      "application/json",
      JSON.stringify({
        title: this.state.title,
        code: this.state.code
      }),
      () => {
        this.getList();
      },
      () => {}
    );
    this.setState({ edited: false });
  }

  render() {
    let scriptList = null;
    if (!this.state.codeListCollapsed) {
      scriptList = [];
      if (this.state.listingCode) {
        scriptList.push(
          <tbody key="iamauniquesnowflake">
            <tr>
              <td>
                <LoadingOverlay
                  active={true}
                  styles={{
                    overlay: base => ({
                      ...base,
                      background: "rgba(0, 0, 0, 0.5)"
                    })
                  }}
                  spinner={<LoadingSpinner />}
                  text="Loading...">
                  <p> </p>
                </LoadingOverlay>
              </td>
            </tr>
          </tbody>
        );
      } else if (this.state.codeList.shipScripts) {
        for (let i = 0; i < this.state.codeList.shipScripts.length; i++) {
          /* eslint-disable react/no-children-prop */
          scriptList.push(
            <ParentRow
              key={this.state.codeList.shipScripts[i].title}
              activeTitle={this.state.activeTitle}
              activeHash={this.state.activeHash}
              latestCreateTs={this.state.codeList.shipScripts[i].latestCreateTs}
              deactivateUserScript={this.deactivateUserScript}
              activateUserScript={this.activateUserScript}
              codeClicked={this.codeClicked}
              addAlert={this.props.addAlert}
              title={this.state.codeList.shipScripts[i].title}
              titleHash={this.state.codeList.shipScripts[i].titleHash}
              latestHash={this.state.codeList.shipScripts[i].latestHash}
              fetchService={this.props.fetchService}
            />
          );
        }
      }
    }
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="input-group">
            <span className="input-group-btn">
              <button
                className="btn icon-btn btn-default"
                onClick={this.codeListClicked}>
                <i
                  className={
                    this.state.codeListCollapsed
                      ? "fa fa-chevron-left"
                      : "fa fa-chevron-right"
                  }
                />
                {""}
              </button>
              {/*   <button
                    className="btn btn-default"
                    onClick={this.typeClicked}>
                    <i
                      className={
                        this.state.type === "ship"
                          ? "fa fa-fw fa-rocket"
                          : "fa fa-fw fa-user"
                      }
                    />
                  </button>*/}
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
            <LoadingOverlay
              active={this.state.loadingCode}
              styles={{
                overlay: base => ({
                  ...base,
                  background: "rgba(0, 0, 0, 0.5)"
                })
              }}
              spinner={<LoadingSpinner />}
              text="Loading...">
              <input
                type="text"
                className="form-control"
                value={this.state.title}
                onChange={this.titleChanged}
                placeholder="Script Title"
                aria-describedby="title"
              />
            </LoadingOverlay>
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                onClick={this.saveClicked}
                disabled={!this.state.title || !this.state.edited}>
                Save
              </button>
            </span>
          </div>
        </div>
        <div className="panel-body code-panel-body">
          <div className="row">
            <div
              className="col-xs-6 no-padding"
              style={{
                display: !this.state.codeListCollapsed ? "block" : "none"
              }}>
              <table className="table table-hover no-margin">
                <tbody>
                  <tr>
                    <td>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={this.state.titleFilter}
                          onChange={this.titleFilterChanged}
                          placeholder="Show titles beggining at..."
                          aria-describedby="title start"
                        />
                        <span className="input-group-btn">
                          <button
                            className="btn icon-btn input-grp-middle btn-default"
                            onClick={() => {
                              this.getList(this.state.titleFilter);
                            }}>
                            <i className={"fa fa-search"} />
                          </button>
                        </span>
                        <span className="input-group-btn">
                          <button
                            className="btn icon-btn btn-default"
                            onClick={() => {
                              this.getList(
                                this.state.codeList.shipScripts[
                                  this.state.codeList.shipScripts.length - 1
                                ].title + " "
                              );
                            }}
                            disabled={!this.state.hasMore}>
                            <i className={"fa fa-mail-forward"} />
                          </button>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
                {scriptList}
              </table>
            </div>
            <div
              className={
                this.state.codeListCollapsed
                  ? "col-xs-12 no-padding"
                  : "col-xs-6 no-padding"
              }>
              <LoadingOverlay
                active={this.state.loadingCode}
                styles={{
                  overlay: base => ({
                    ...base,
                    background: "rgba(0, 0, 0, 0.5)"
                  })
                }}
                spinner={<LoadingSpinner />}
                text="Loading...">
                <AceEditor
                  mode="javascript"
                  value={this.state.code}
                  height="100%"
                  width="100%"
                  theme={this.state.editorStyle}
                  onChange={this.codeChanged}
                  name="code-editor"
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{ useWorker: false }}
                />
              </LoadingOverlay>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

class ParentRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      listingCodeBodies: false,
      hasMore: false,
      hasMoreClicked: false
    };
    // Bind the methods to the object's this
    this.listCodeBodies = this.listCodeBodies.bind(this);
  }

  listCodeBodies(createdEarlierThan) {
    this.setState({
      listingCodeBodies: true,
      hasMoreClicked: createdEarlierThan !== Number.MAX_SAFE_INTEGER
    });
    this.props.fetchService.getJsonWithAuth(
      "/listCodeBodies",
      "application/json",
      json => {
        this.setState({
          hasMore: json.hasMore,
          codeBodies: json.bodies,
          listingCodeBodies: false
        });
      },
      () => {},
      {
        titleHash: this.props.titleHash,
        createdEarlierThan: createdEarlierThan
      }
    );
  }

  render() {
    let codeBodies = [];
    if (!this.state.collapsed && !!this.state.codeBodies) {
      for (let i = 0; i < this.state.codeBodies.length; i++) {
        codeBodies.push(
          <tr key={this.state.codeBodies[i].hash}>
            <td>
              <i
                className="fa fa-chevron-down"
                aria-hidden="true"
                style={{ visibility: "hidden" }}
              />{" "}
              <button
                type="button"
                className="btn btn-link text-muted no-padding"
                onClick={() => {
                  this.props.codeClicked(
                    this.state.codeBodies[i].title,
                    this.state.codeBodies[i].hash
                  );
                }}>
                <i className="fa fa-code fa-fw" />
              </button>
              <button
                type="button"
                className="btn btn-link text-muted no-padding"
                onClick={() => {
                  this.props.addAlert({
                    type: "info",
                    text: this.state.codeBodies[i].hash
                  });
                }}>
                <i className="fa fa-hashtag fa-fw" />
              </button>
              {" " + moment(this.state.codeBodies[i].createTs * 1000).fromNow()}
            </td>
          </tr>
        );
      }
    }
    return (
      <tbody>
        <tr>
          <td>
            <button
              type="button"
              className="btn btn-link text-muted no-padding"
              onClick={() => {
                if (this.state.collapsed) {
                  this.setState({
                    collapsed: false
                  });
                  this.listCodeBodies(Number.MAX_SAFE_INTEGER);
                } else {
                  this.setState({
                    collapsed: true
                  });
                }
              }}>
              <i
                className={
                  this.state.collapsed
                    ? "fa fa-chevron-up"
                    : "fa fa-chevron-down"
                }
              />
            </button>
            {" " + this.props.title}{" "}
            <button
              type="button"
              className="btn btn-link text-muted no-padding"
              onClick={() => {
                this.props.codeClicked(this.props.title, this.props.latestHash);
              }}>
              <i className="fa fa-code fa-fw" />
            </button>
            <button
              type="button"
              className="btn btn-link text-muted no-padding"
              onClick={() => {
                this.props.addAlert({
                  type: "info",
                  text: this.props.latestHash
                });
              }}>
              <i className="fa fa-hashtag fa-fw" />
            </button>
            <button
              type="button"
              className="btn btn-link text-muted no-padding"
              onClick={() => {
                this.listCodeBodies(Number.MAX_SAFE_INTEGER);
              }}
              disabled={!this.state.hasMoreClicked}>
              <i className="fa fa-refresh fa-fw" />
            </button>
            <button
              type="button"
              className="btn btn-link text-muted no-padding"
              onClick={() => {
                this.listCodeBodies(
                  this.state.codeBodies[this.state.codeBodies.length - 1]
                    .createTs
                );
              }}
              disabled={!this.state.hasMore}>
              <i className="fa fa-mail-forward fa-fw" />
            </button>
            {" " + moment(this.props.latestCreateTs * 1000).fromNow()}
          </td>
        </tr>
        {codeBodies}
      </tbody>
    );
  }
}

export default Code;
