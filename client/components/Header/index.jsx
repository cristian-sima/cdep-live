// @flow

import type { State, Dispatch } from "types";

type HeaderPropTypes = {
  account: any;
  isConnected: bool;

  isSigningOff: bool;
  showSignOffConfirmation: bool;
  hasSignOffError: bool;

  performSignOff: () => void;
  confirmSignOff: () => void;
  cancelSignOff: () => void;
};

import React from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";

import {
  signOff as signOffAction,
  confirmSignOff as confirmSignOffAction,
  cancelSignOff as cancelSignOffAction,
} from "actions";

import {
  getCurrentAccount,
  getIsAccountConnected,

  getIsSigningOff,
  getShowSignOffConfirmation,
  getHasSignOffError,
} from "reducers";

import { marcaAdministrator } from "utility";

const
  mapStateToProps = (state : State) => ({
    isSigningOff            : getIsSigningOff(state),
    showSignOffConfirmation : getShowSignOffConfirmation(state),
    hasSignOffError         : getHasSignOffError(state),

    account     : getCurrentAccount(state),
    isConnected : getIsAccountConnected(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    performSignOff () {
      dispatch(signOffAction());
    },
    confirmSignOff () {
      dispatch(confirmSignOffAction());
    },
    cancelSignOff () {
      dispatch(cancelSignOffAction());
    },
  });


class Header extends React.Component {
  props: HeaderPropTypes;

  shouldComponentUpdate (nextProps : HeaderPropTypes) {
    return (
      this.props.account !== nextProps.account ||
      this.props.hasSignOffError !== nextProps.hasSignOffError ||
      this.props.isConnected !== nextProps.isConnected ||
      this.props.showSignOffConfirmation !== nextProps.showSignOffConfirmation ||
      this.props.isSigningOff !== nextProps.isSigningOff
    );
  }

  render () {
    const {
      isSigningOff,
      showSignOffConfirmation,

      performSignOff,
      confirmSignOff,
      cancelSignOff,

      account,
      isConnected,
      hasSignOffError,
    } = this.props;

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
              {
                isSigningOff ? (
                  <span className="text-muted">
                    <i className="fa fa-refresh fa-spin fa-fw" />
                    {" "}
                    {"Așteaptă..."}
                  </span>
                ) : (
                  showSignOffConfirmation ? (
                    <div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={performSignOff}>
                        {"Te deconectez?"}
                      </button>
                      {" "}
                      <button
                        className="btn btn-sm btn-success"
                        onClick={cancelSignOff}>
                        {"Nu"}
                      </button>
                      {" "}
                      {
                        hasSignOffError ? (
                          <span className="text-warning">
                            <i className="fa fa-exclamation-triangle" />
                          </span>
                        ) : null
                      }
                    </div>
                  ) : (
                    <div className="float-right">
                      <span className="mr-2">
                        {name}
                      </span>
                      {" "}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={confirmSignOff}>
                        <i className="fa fa-sign-out" />
                        {" "}
                        <span className="hidden-md-down">{"Deconectează-mă"}</span>
                      </button>
                    </div>
                  )
                )
              }
            </div>
          ) : null
        }
      </div>
    </nav>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
