// @flow

import type { Dispatch, State } from "types";

type DisconnectBoxPropTypes = {
  account: any;
  isSigningOff: bool;
  showSignOffConfirmation: bool;
  hasSignOffError: bool;

  performSignOff: () => void;
  confirmSignOff: () => void;
  cancelSignOff: () => void;
};

import React from "react";
import { connect } from "react-redux";

import {
  signOff as signOffAction,
  confirmSignOff as confirmSignOffAction,
  cancelSignOff as cancelSignOffAction,
} from "actions";

import {
  getIsSigningOff,
  getShowSignOffConfirmation,
  getHasSignOffError,
  getCurrentAccount,
} from "reducers";

const maxChars = 15;

const
  mapStateToProps = (state : State) => ({
    account                 : getCurrentAccount(state),
    isSigningOff            : getIsSigningOff(state),
    showSignOffConfirmation : getShowSignOffConfirmation(state),
    hasSignOffError         : getHasSignOffError(state),
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

class DisconnectBox extends React.Component<DisconnectBoxPropTypes> {
  props: DisconnectBoxPropTypes;

  shouldComponentUpdate (nextProps : DisconnectBoxPropTypes) {
    return (
      this.props.account !== nextProps.account ||
      this.props.hasSignOffError !== nextProps.hasSignOffError ||
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
      hasSignOffError,
      account,
    } = this.props;

    const name = account.get("name");

    return (
      <div className="text-right">
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
                  onClick={performSignOff}
                  type="button">
                  {"Te deconectez?"}
                </button>
                {" "}
                <button
                  className="btn btn-sm btn-success"
                  onClick={cancelSignOff}
                  type="button">
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
              <div>
                <span className="mr-2">
                  <span className="d-sm-none">
                    {name.substring(0, maxChars)}
                    {name.length > maxChars ? "..." : null}
                  </span>
                  <span className="hidden-xs-down">
                    {name}
                  </span>
                </span>
                {" "}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={confirmSignOff}
                  type="button">
                  <i className="fa fa-sign-out" />
                  {" "}
                  <span className="hidden-md-down">{"Deconectează-mă"}</span>
                </button>
              </div>
            )
          )
        }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisconnectBox);
