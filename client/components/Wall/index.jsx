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
      <div className="container">
        <h1>{"Ordinea de zi"}</h1>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WallContainer);
