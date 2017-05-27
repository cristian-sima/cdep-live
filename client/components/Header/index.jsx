// @flow

import type { Dispatch, State } from "types";

type HeaderPropTypes = {
  account: any;
};

import React from "react";
import { connect } from "react-redux";

import { getCurrentAccount } from "reducers";

const
  mapStateToProps = (state : State) => ({
    account: getCurrentAccount(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({});

class Header extends React.Component {
  props: HeaderPropTypes;

  shouldComponentUpdate (nextProps : HeaderPropTypes) {
    return (
      this.props.account !== nextProps.account
    );
  }

  render () {
    const { account } = this.props;

    const name = account.get("name");

    return (
      <nav className="navbar navbar-light bg-faded">
        <div className="clearfix">
          <div className="float-left">
            <h4>{"Live"}</h4>
          </div>
          <div className="float-right">
            <span className="mr-2">
              {name}
            </span>
            {" "}
            <button className="btn btn-sm btn-outline-primary float-right">
              <i className="fa fa-sign-out" />
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
