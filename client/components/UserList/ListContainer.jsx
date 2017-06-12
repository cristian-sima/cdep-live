// @flow

import type { Dispatch, State } from "types";

type ListPropTypes = {
  users: any;
  hasFetchingError: boolean;
  isFetching: boolean;
  shouldFetchUsers: boolean;
  info: any;
  isResetingPassword: boolean;

  showModifyModal: (id : number) => void;
  deleteUser: (id : number) => void;
  fetchUsers: () => void;
  showCreateUserModal: () => void;
  resetPassword: (id : string) => () => void;
};

import { connect } from "react-redux";
import React from "react";

import { LargeErrorMessage, LoadingMessage } from "../Messages";
import Row from "./Row";

import {
  fetchUsers as fetchUsersAction,
  resetPassword as resetPasswordAction,
} from "actions";

import {
  getUsersHasError,
  getUsersAreFetching,
  getUsersShouldFetch,
  getUsers,
  getIsResetingPassword,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
      isResetingPassword: getIsResetingPassword(state),

      users            : getUsers(state),
      isFetching       : getUsersAreFetching(state),
      hasFetchingError : getUsersHasError(state),
      shouldFetchUsers : getUsersShouldFetch(state),
    }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchUsers () {
      dispatch(fetchUsersAction());
    },
    resetPassword: (id : string) => () => {
      dispatch(resetPasswordAction(id));
    },
  });

class List extends React.Component {

  props: ListPropTypes;

  componentDidMount () {
    const { shouldFetchUsers, fetchUsers } = this.props;

    if (shouldFetchUsers) {
      fetchUsers();
    }
  }

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      nextProps.isResetingPassword !== this.props.isResetingPassword ||
      nextProps.shouldFetchUsers !== this.props.shouldFetchUsers ||
      nextProps.hasFetchingError !== this.props.hasFetchingError ||
      nextProps.isFetching !== this.props.isFetching ||
      nextProps.users !== this.props.users
    );
  }

  render () {
    const {
      users,
      fetchUsers,
      hasFetchingError,
      isFetching,
      resetPassword,
      isResetingPassword,
    } = this.props;

    if (isFetching) {
      return <LoadingMessage message="Preiau utilizatorii..." />;
    }

    if (hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua utilizatorii"
          onRetry={fetchUsers}
        />
      );
    }

    if (users.size === 0) {
      return (
        <div className="text-center h4">
          {"Nu există utilizatori"}
        </div>
      );
    }

    return (
      <div>
        <div className="container">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    {"Nume și prenume"}
                  </th>
                  <th className="text-center">
                    {"Marca"}
                  </th>
                  <th className="text-center">
                    {"Grup"}
                  </th>
                  <th className="text-center">
                    {"Parolă temporară"}
                  </th>
                  <th className="text-center">
                    {"Resetează parola"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  users.map((user) => (
                    <Row
                      data={user}
                      isResetingPassword={isResetingPassword}
                      key={user.get("_id")}
                      resetPassword={resetPassword}
                    />
                  )
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
