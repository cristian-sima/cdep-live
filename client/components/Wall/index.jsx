// @flow

import type { Dispatch, State } from "types";

type WallContainerPropTypes = {

};

import React from "react";
import { connect } from "react-redux";

const
  mapStateToProps = (state : State) => ({}),
  mapDispatchToProps = (dispatch : Dispatch) => ({});

class WallContainer extends React.Component {
  props: WallContainerPropTypes;

// shouldComponentUpdate (nextProps : WallContainerPropTypes) {
//   // return (
//   //   this.props. !== nextProps. ||
//   // );
// }

  render () {
    // const { } = this.props;

    return (
      <h1>{"It works"}</h1>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WallContainer);
