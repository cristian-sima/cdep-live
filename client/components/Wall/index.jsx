// @flow

import type { Dispatch, State } from "types";

type WallContainerPropTypes = {
  connectingLive: () => void;
  connectedLive: () => void;
  processIncommingMessage: (msg : any) => void;

  isUpdating: bool;
  isSpecialAccount: bool;
  isConnecting: boolean;
};

type WallContainerStateTypes = {
  socket?: any;
};

import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

import { LoadingMessage } from "../Messages";
import List from "./List";
import UpdateBar from "./UpdateBar";

import {
  connectingLive as connectingLiveAction,
  connectedLive as connectedLiveAction,
} from "actions";

import {
  getIsConnectingLive,
  getIsSpecialAccount,
  getIsUpdatingLive,
 } from "reducers";

const
  mapStateToProps = (state : State) => ({
    isConnecting : getIsConnectingLive(state),
    isUpdating   : getIsUpdatingLive(state),

    isSpecialAccount: getIsSpecialAccount(state),
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
      socket: null,
    };

    this.emit = (name : string, msg : any) => {
      const { socket } = this.state;

      socket.emit(name, msg);
    };
  }

  componentDidMount () {
    const {
      connectingLive,
      connectedLive,
      processIncommingMessage,
    } = this.props;

    connectingLive();

    const socket = io("http://localhost:3000/");

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
      this.props.isConnecting !== nextProps.isConnecting ||
      this.props.isUpdating !== nextProps.isUpdating ||
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
    const { isConnecting, isSpecialAccount, isUpdating } = this.props;

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
          <LoadingMessage message="Ordinea de zi se actualizează..." />
        </div>
      );
    }

    return (
      <div className="container mt-2">
        {
          isSpecialAccount ? (
            <UpdateBar emit={this.emit} />
          ) : null
        }
        <List />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WallContainer);
