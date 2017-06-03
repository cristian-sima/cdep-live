// @flow

import type { State } from "types";

type ModalRootPropTypes = {
  list: any;
};

import { connect } from "react-redux";
import React from "react";

import getComponent from "./components";

const mapStateToProps = (state : State) => ({
  list: state.modal,
});

class ModalRoot extends React.Component {

  props: ModalRootPropTypes;

  shouldComponentUpdate (nextProps : ModalRootPropTypes) {
    return this.props.list !== nextProps.list;
  }

  render () {
    const { list } = this.props;

    if (list.size === 0) {
      return null;
    }

    return (
      <div>
        {
          list.map(({ type, props }, index) => {
            const Component = getComponent(type);

            return (
              <Component key={index} {...props} />
            );
          })
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(ModalRoot);
