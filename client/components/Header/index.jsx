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
      "icon"        : "fa fa-list-ol",
      "url"         : "/list",
      "description" : "Ordinea de Zi",
    };
  }

  return {
    "icon"        : "fa fa-newspaper-o",
    "url"         : "/",
    "description" : "Proiect curent",
  };
};

const
  mapStateToProps = (state : State) => ({
    account         : getCurrentAccount(state),
    isPublicAccount : getIsPublicAccount(state),
    isConnected     : getIsAccountConnected(state),
  });

class Header extends React.Component<HeaderPropTypes> {
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

    const isAdministratorConnected = isConnected && marca === marcaAdministrator,
      things = getThings(pathname);

    return (
      <div>
        {
          isConnected ? (
            <div style={{
              position   : "fixed",
              right      : 10,
              bottom     : 10,
              zIndex     : 10,
              background : "white",
            }}>
              <Link to={things.url} >
                <button
                  className="btn btn-sm btn-secondary"
                  type="button">
                  <i className={things.icon} />
                  {` ${things.description}`}
                </button>
              </Link>
            </div>
          ) : null
        }
        <nav className="navbar navbar-light bg-light">
          <div className="mr-auto">
            <h4 className="d-inline">{"Live"}</h4>
            {
              isAdministratorConnected ? (
                <ul className="navbar-nav float-right ml-3">
                  <li className="nav-item">
                    <NavLink
                      activeClassName="active"
                      className="nav-link"
                      to="/user-list">
                      {"Utilizatori"}
                    </NavLink>
                  </li>
                </ul>
              ) : null
            }
            {
              isConnected ? (
                <div className="float-right">
                  <Link className="ml-2 align-middle" to={things.url} >
                    <button
                      className="btn btn-sm btn-primary"
                      type="button">
                      <i className={things.icon} />
                      <span className="hidden-xs-down">
                        {` ${things.description}`}
                      </span>
                    </button>
                  </Link>
                </div>
              ) : null
            }
          </div>
          {
            isConnected ? (
              <DisconnectBox />
            ) : null
          }
        </nav>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
