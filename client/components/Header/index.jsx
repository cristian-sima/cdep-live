// @flow

import type { State } from "types";

type HeaderPropTypes = {
  account: any;
};

import React from "react";
import { connect } from "react-redux";

import { getCurrentAccount } from "reducers";

const
  mapStateToProps = (state : State) => ({
    account: getCurrentAccount(state),
  });

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
            <img alt="Logo" className="align-baseline" src="/static/media/favicon-16x16.png" />
            {" "}
            <h4 className="d-inline">{"Live"}</h4>
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

export default connect(mapStateToProps)(Header);
