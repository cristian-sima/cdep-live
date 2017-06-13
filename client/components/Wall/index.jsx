// @flow
/* eslint-disable react/jsx-no-bind */

import type { Dispatch, State } from "types";

type WallContainerPropTypes = {
  connectingLive: () => void;
  connectedLive: () => void;
  processIncommingMessage: (msg : any) => void;

  match: {
    url: string;
  };

  isPreparing: bool;
  isUpdating: bool;
  isSpecialAccount: bool;
  isPublicAccount: bool;
  isConnecting: boolean;
};

type WallContainerStateTypes = {
  socket?: any;
};

import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { Route, withRouter } from "react-router-dom";

import { LoadingMessage } from "../Messages";
import CurrentItem from "./CurrentItem";
import List from "./List";

import DisconnectBox from "../Header/DisconnectBox";

import { hostname } from "../../../config-client.json";

import {
  connectingLive as connectingLiveAction,
  connectedLive as connectedLiveAction,
} from "actions";

import {
  getIsConnectingLive,
  getIsSpecialAccount,
  getIsPublicAccount,
  getIsUpdatingLive,
  getIsPreparing,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
      isConnecting : getIsConnectingLive(state),
      isUpdating   : getIsUpdatingLive(state),

      isPreparing: getIsPreparing(state),

      isPublicAccount  : getIsPublicAccount(state),
      isSpecialAccount : getIsSpecialAccount(state),
    }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    connectingLive () {
      dispatch(connectingLiveAction());
    },
    connectedLive () {
      dispatch(connectedLiveAction());
    },
    processIncommingMessage (msg) {
      dispatch(msg);
    },
  });

class WallContainer extends React.Component {
  props: WallContainerPropTypes;
  state: WallContainerStateTypes;

  emit: (name : string, msg : any) => void;

  constructor (props : WallContainerPropTypes) {
    super(props);

    this.state = {
    };

    this.emit = (name : string, msg : any) => {
      const { socket } = this.state;

      if (typeof socket !== "undefined") {
        socket.emit(name, msg);
      }
    };
  }

  componentDidMount () {
    const {
      connectingLive,
      connectedLive,
      processIncommingMessage,
    } = this.props;

    connectingLive();

    const socket = io(hostname);

    socket.on("connect", () => {
      connectedLive();
    });

    socket.on("msg", processIncommingMessage);

    socket.on("disconnect", () => {
      connectingLive();
    });

    setTimeout(() => {
      this.setState({
        socket,
      });
    });
  }

  shouldComponentUpdate (nextProps : WallContainerPropTypes) {
    return (
      this.props.isPreparing !== nextProps.isPreparing ||
      this.props.isConnecting !== nextProps.isConnecting ||
      this.props.isPublicAccount !== nextProps.isPublicAccount ||
      this.props.isUpdating !== nextProps.isUpdating ||
      this.props.match.url !== nextProps.match.url ||
      this.props.isSpecialAccount !== nextProps.isSpecialAccount
    );
  }

  componentWillUnmount () {
    const { socket } = this.state;

    if (socket) {
      socket.removeAllListeners();
    }
  }

  render () {
    const { isConnecting, isUpdating, isPublicAccount, isPreparing } = this.props;

    if (isConnecting) {
      return (
        <div className="container">
          <LoadingMessage message="Mă conectez..." />
        </div>
      );
    }

    if (isUpdating) {
      return (
        <div className="container">
          <LoadingMessage message="Actualizez Ordinea de Zi..." />
        </div>
      );
    }

    if (isPreparing) {
      return (
        <div className="container">
          <LoadingMessage message="Preiau Ordinea de Zi..." />
        </div>
      );
    }

    return (
      <div className="container-fluid mt-2 wall">
        {
          isPublicAccount ? (
            <div>
              <CurrentItem emit={this.emit} />
              <DisconnectBox />
            </div>
          ) : (
            <div>
              <Route component={CurrentItem} exact path="/" />
              <Route component={() => (<List emit={this.emit} />)} exact path="/list" />
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WallContainer));
