// @flow

import type { State } from "types";

type HeaderPropTypes = {
  account: any;
  isConnected: bool;
};

import React from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";

import { getCurrentAccount, getIsAccountConnected } from "reducers";

import { marcaAdministrator } from "utility";

const
  mapStateToProps = (state : State) => ({
    account     : getCurrentAccount(state),
    isConnected : getIsAccountConnected(state),
  });

class Header extends React.Component {
  props: HeaderPropTypes;

  shouldComponentUpdate (nextProps : HeaderPropTypes) {
    return (
      this.props.account !== nextProps.account
    );
  }

  render () {
    const { account, isConnected } = this.props;

    const name = account.get("name");

    return (
      <nav className="navbar navbar-light bg-faded">
        <div className="clearfix">
          <div className="float-left">
            <img alt="Logo" className="align-baseline" src="/static/media/favicon-16x16.png" />
            {" "}
            <Link to="/">
              <h4 className="d-inline">{"Live"}</h4>
            </Link>
            {
              (isConnected && account.get("marca") === marcaAdministrator) ? (
                <ul className="navbar-nav float-right ml-3">
                  <li className="nav-item">
                    <NavLink
                      activeClassName="active"
                      className="nav-link"
                      to="/user-list">
                      {"Listă utilizatori"}
                    </NavLink>
                  </li>
                </ul>
              ) : null
            }
          </div>
          {
            isConnected ? (
              <div className="float-right">
                <span className="mr-2">
                  {name}
                </span>
                {" "}
                <button className="btn btn-sm btn-outline-primary float-right">
                  <i className="fa fa-sign-out" />
                </button>
              </div>
            ) : null
          }
        </div>
      </nav>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
