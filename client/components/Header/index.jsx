// @flow

import type { State } from "types";

type HeaderPropTypes = {
  account: any;
  isConnected: bool;
  isPublicAccount: bool;
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
      this.props.isPublicAccount !== nextProps.isPublicAccount ||
      this.props.isConnected !== nextProps.isConnected
    );
  }

  render () {
    const {
      account,
      isConnected,
      isPublicAccount,
    } = this.props;

    const
      marca = account.get("marca");

    if (isConnected && isPublicAccount) {
      return null;
    }

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
              (isConnected && marca === marcaAdministrator) ? (
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
              <DisconnectBox />
            ) : null
          }
        </div>
      </nav>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
