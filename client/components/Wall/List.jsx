// @flow

import type { State, Dispatch } from "types";

type ListPropTypes = {
  items: any;
  isSpecialAccount: any;
  itemSelected?: number;
  position: number;
  showButtons: boolean;

  toggledItem: any;

  emit: (name : string, msg : any) => void;
  toggleItem: (id : string) => void;
  selectItem: (id : string) => void;
};

import React from "react";
import { connect } from "react-redux";

import {
  getItemsSorted,
  getSelectedItemPosition,
  getIsSpecialAccount,
  getSelectedItem,
  getShowButtons,
  getToggledItem,
} from "reducers";

import Row from "./Row";

import {
  toggleItem as toggleItemAction,
} from "actions";

const
  mapStateToProps = (state : State) => ({
    items            : getItemsSorted(state),
    isSpecialAccount : getIsSpecialAccount(state),
    showButtons      : getShowButtons(state),

    position     : getSelectedItemPosition(state),
    itemSelected : getSelectedItem(state),

    toggledItem: getToggledItem(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    selectItem: (id : string) => () => {
      emit("SELECT_ITEM", id);
    },
    toggleItem: (id : string) => () => {
      dispatch(toggleItemAction(id));
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
      this.props.isSpecialAccount !== nextProps.isSpecialAccount ||
      this.props.items !== nextProps.items ||
      this.props.itemSelected !== nextProps.itemSelected ||
      this.props.position !== nextProps.position ||
      this.props.showButtons !== nextProps.showButtons ||
      this.props.toggledItem !== nextProps.toggledItem
    );
  }

  render () {
    const {
      toggledItem,
      showButtons,
      items,
      isSpecialAccount,
      selectItem,
      itemSelected,
      emit,
      toggleItem,
    } = this.props;

    return (
      <div className="table-responsive">
        <table className="table table-sm list-table">
          <tbody>
            {
              items.map((item) => {
                const id = item.get("_id");

                return (
                  <Row
                    data={item}
                    emit={emit}
                    isSelected={id === itemSelected}
                    isSpecialAccount={isSpecialAccount}
                    isToggled={id === toggledItem}
                    key={id}
                    selectItem={selectItem}
                    showButtons={showButtons}
                    toggleItem={toggleItem}
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
