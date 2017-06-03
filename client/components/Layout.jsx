// @flow

import React from "react";

import ModalRoot from "./Modal/Root";

import type { Dispatch, Notification, State } from "types";

import { connect } from "react-redux";
import Notifications from "react-notification-system-redux";

import { deleteNotification } from "actions";

const
  mapStateToProps = (state : State) => ({
    notifications: state.notifications,
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    handleDismiss: (notification : Notification) => {
      dispatch(deleteNotification(notification.key));
    },
  });

const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications);

const Layout = ({ children } : any) => (
  <div>
    <NotificationsContainer />
    <ModalRoot />
    {children}
  </div>
);

export default Layout;
