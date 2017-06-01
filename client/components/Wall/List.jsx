// @flow

import type { State, Dispatch } from "types";

type ListPropTypes = {
  items: any;
  isSpecialAccount: any;
  itemSelected?: number;
  position: number;

  selectItem: (id : number) => void;
};

import React from "react";
import { connect } from "react-redux";

import { getItemsSorted, getSelectedItemPosition, getIsSpecialAccount, getSelectedItem } from "reducers";

import Row from "./Row";

const
  mapStateToProps = (state : State) => ({
    items            : getItemsSorted(state),
    isSpecialAccount : getIsSpecialAccount(state),

    position     : getSelectedItemPosition(state),
    itemSelected : getSelectedItem(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    selectItem: (id : number) => () => {
      emit("SELECT_ITEM", id);
    },
  });

class List extends React.Component {
  props: ListPropTypes;

  jump: (position : number) => void;

  constructor (props : ListPropTypes) {
    super(props);

    this.jump = (position) => {
      setTimeout(() => {

        const
          start = 124,
          height = 130,
          before = (position - 1) * height;

        window.scrollTo(0, start + before);
      });
    };
  }

  componentDidMount () {
    this.jump(this.props.position);
  }

  componentWillReceiveProps (nextProps : ListPropTypes) {
    if (nextProps.itemSelected !== this.props.itemSelected) {
      this.jump(nextProps.position);
    }
  }

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      this.props.items !== nextProps.items ||
      this.props.itemSelected !== nextProps.itemSelected ||
      this.props.position !== nextProps.position ||
      this.props.isSpecialAccount !== nextProps.isSpecialAccount
    );
  }

  render () {
    const { items, isSpecialAccount, selectItem, itemSelected } = this.props;

    return (
      <div className="table-responsive">
        <table className="table table-hover table-sm list-table">
          <tbody>
            {
              items.map((item) => {
                const id = item.get("_id");

                return (
                  <Row
                    data={item}
                    isSelected={id === itemSelected}
                    isSpecialAccount={isSpecialAccount}
                    key={id}
                    selectItem={selectItem}
                 />
                );
              }
            )
          }
        </tbody>
      </table>
    </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
