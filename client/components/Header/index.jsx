// @flow

import type { State } from "types";

type HeaderPropTypes = {
  account: any;
  isConnected: bool;
  isPublicAccount: bool;
  location: {
    pathname: string;
  };
};

import React from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";

import {
  getCurrentAccount,
  getIsAccountConnected,
  getIsPublicAccount,
} from "reducers";

import { marcaAdministrator } from "utility";

import DisconnectBox from "./DisconnectBox";

const getThings = (url) => {
  if (url === "/") {
    return {
      "icon" : "fa fa-list-ol",
      "url"  : "/list",
    };
  }

  return {
    "icon" : "fa fa-wpforms",
    "url"  : "/",
  };
};

const
  mapStateToProps = (state : State) => ({
    account         : getCurrentAccount(state),
    isPublicAccount : getIsPublicAccount(state),
    isConnected     : getIsAccountConnected(state),
  });

class Header extends React.Component {
  props: HeaderPropTypes;

  shouldComponentUpdate (nextProps : HeaderPropTypes) {
    return (
      this.props.account !== nextProps.account ||
      this.props.location.pathname !== nextProps.location.pathname ||
      this.props.isPublicAccount !== nextProps.isPublicAccount ||
      this.props.isConnected !== nextProps.isConnected
    );
  }

  render () {
    const {
      account,
      isConnected,
      isPublicAccount,
      location : { pathname },
    } = this.props;

    const
      marca = account.get("marca");

    if (isConnected && isPublicAccount) {
      return null;
    }

    const connected = isConnected && marca === marcaAdministrator,
      things = getThings(pathname);

    return (
      <nav className="navbar navbar-light bg-faded">
        <div className="clearfix">
          <div className="float-left">
            <Link to="/">
              <h4 className="d-inline">{"Live"}</h4>
            </Link>
            {
              connected ? (
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
              <div>
                <DisconnectBox />
                <div className="float-right mr-2">
                  <Link to={things.url}>
                    <button
                      className="btn btn-sm btn-primary">
                      <i className={things.icon} />
                    </button>
                  </Link>
                </div>
              </div>
            ) : null
          }
        </div>
      </nav>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
