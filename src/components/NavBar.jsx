import React from "react";
import NavItem from "./NavItem.jsx";

/**
 * Create a React component for the NavBar
 * The only state it contains is if it is collapsed or not
 * It is passed in authentication, and route state for display
 */
const NavBar = class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { menuCollapsed: true, viewDropdownCollapsed: true };
    // This line is important!
    this.menuClicked = this.menuClicked.bind(this);
    this.viewDropDownClicked = this.viewDropDownClicked.bind(this);
  }

  menuClicked() {
    this.setState({
      menuCollapsed: !this.state.menuCollapsed
    });
  }

  viewDropDownClicked() {
    this.setState({
      viewDropdownCollapsed: !this.state.viewDropdownCollapsed
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Don't blow the stack out by re-rendering when this components height is set to the parent
    return (
      this.props.isAuthenticated != nextProps.isAuthenticated ||
      this.state.menuCollapsed != nextState.menuCollapsed ||
      this.state.viewDropdownCollapsed != nextState.viewDropdownCollapsed ||
      this.props.location.pathname != nextProps.location.pathname
    );
  }

  componentDidUpdate(nextProps) {
    //collapse the dropdown if an element on it was selected
    if (
      this.props.location.pathname != nextProps.location.pathname &&
      !this.state.viewDropdownCollapsed
    ) {
      this.setState({ viewDropdownCollapsed: true });
    }
  }

  render() {
    return (
      <div className="navbar navbar-default" style={{ zIndex: 301 }}>
        <div className="navbar-header" onClick={this.menuClicked}>
          <div className="navbar-toggle">
            <span className="sr-only">Toggle navigation</span>
            <i
              className={
                this.state.menuCollapsed
                  ? "fa fa-chevron-right"
                  : "fa fa-chevron-down"
              }
            />
          </div>
          <div className="navbar-brand">
            <img src="/icon.svg" />
          </div>
        </div>
        {/*Programatically controll hiding the collapse using react.
                    Due to hdpi devices, we're collapsible on both on both xs and sm screens */}
        <div
          className={
            this.state.menuCollapsed
              ? "navbar-collapse hidden-xs hidden-sm"
              : "navbar-collapse"
          }>
          <ul className="nav navbar-nav">
            <li
              className={
                this.props.location.pathname.startsWith("/view")
                  ? "dropdown active"
                  : "dropdown"
              }>
              <a
                href="#"
                className="dropdown-toggle"
                onClick={this.viewDropDownClicked}
                role="button"
                aria-haspopup="true">
                {this.props.location.pathname.startsWith("/view/map") ? (
                  <div>
                    {" "}
                    <i className="fa fa-map" /> Map <span className="caret" />
                  </div>
                ) : this.props.location.pathname.startsWith("/view/table") ? (
                  <div>
                    {" "}
                    <i className="fa fa-list" /> List <span className="caret" />
                  </div>
                ) : (
                  <div>
                    <i className="fa fa-eye" /> View <span className="caret" />
                  </div>
                )}
              </a>
              <ul
                className={
                  this.state.viewDropdownCollapsed
                    ? "dropdown-menu hidden"
                    : "dropdown-menu"
                }>
                {!this.props.location.pathname.startsWith("/view/map") ? (
                  <NavItem to="/view/map" location={this.props.location}>
                    <i className="fa fa-map" /> Map
                  </NavItem>
                ) : null}
                {!this.props.location.pathname.startsWith("/view/table") ? (
                  <NavItem to="/view/table" location={this.props.location}>
                    <i className="fa fa-list" /> List
                  </NavItem>
                ) : null}
              </ul>
            </li>
            {/*We only ships the code NavItem if the user is logged on*/}
            {this.props.isAuthenticated ? (
              <NavItem to="/ships" location={this.props.location}>
                <i className="fa fa-rocket" /> Ships
              </NavItem>
            ) : null}
            {/*We only show the code NavItem if the user is logged on*/}
            {this.props.isAuthenticated ? (
              <NavItem to="/code" location={this.props.location}>
                <i className="fa fa-code" /> Code
              </NavItem>
            ) : null}
            <NavItem to="/docs" location={this.props.location}>
              <i className="fa fa-book" /> Docs
            </NavItem>
            <li>
              <a href="https://github.com/chad-autry/hexagonal-space-client/issues">
                <i className="fa fa-comments" /> Support
              </a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <NavItem
              to={
                this.props.isAuthenticated
                  ? "/userMgmnt"
                  : this.props.pendingUserCreation
                  ? "/policy"
                  : "/login"
              }
              location={this.props.location}>
              <i
                className={
                  this.props.isAuthenticated
                    ? "fa fa-user"
                    : this.props.pendingUserCreation
                    ? "fa fa-plus"
                    : "fa fa-sign-in"
                }
              />{" "}
              {this.props.isAuthenticated || this.props.pendingUserCreation
                ? this.props.authService.getPayload().name + " "
                : "Logon "}
            </NavItem>
          </ul>
        </div>
      </div>
    );
  }
};

export default NavBar;
