// @flow

import type { State, Dispatch } from "types";

type ListPropTypes = {
  items: any;
  isSpecialAccount: any;
  itemSelected?: number;
  position: number;
  account: any;
  canExpressSuggestions: boolean;

  toggledItem: any;

  emit: (name : string, msg : any) => void;
  toggleItem: (id : string) => void;
  selectItem: (id : string) => void;
  showItemDetails: (id : string) => () => void;
  showCommentModal: () => void;
};

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import UpdateBar from "./UpdateBar";

import {
  getItemsSorted,
  getSelectedItemPosition,
  getIsSpecialAccount,
  getSelectedItem,
  getCanExpressSuggestions,
  getToggledItem,
  getCurrentAccount,
} from "reducers";

import Row from "./Row";

import {
  toggleItem as toggleItemAction,
  showItemDetailsModal as showItemDetailsModalAction,
  showCommentModal as showCommentModalAction,
} from "actions";

const
  mapStateToProps = (state : State) => ({
      items                 : getItemsSorted(state),
      isSpecialAccount      : getIsSpecialAccount(state),
      account               : getCurrentAccount(state),
      canExpressSuggestions : getCanExpressSuggestions(state),

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
    showItemDetails: (id : string) => (event) => {
      event.stopPropagation();

      dispatch(showItemDetailsModalAction(id));
    },
    showCommentModal (event) {
      event.stopPropagation();

      dispatch(showCommentModalAction(emit));
    },
  });

class List extends React.Component {
  props: ListPropTypes;

  jump: (position : number, isSpecialAccount : bool) => void;

  constructor (props : ListPropTypes) {
    super(props);

    this.jump = (position, isSpecialAccount) => {

      setTimeout(() => {
        const
          userStart = 77,
          specialAccountStart = 104,
          start = isSpecialAccount ? specialAccountStart : userStart,
          height = 130,
          before = (position - 1) * height;

        window.scrollTo(0, start + before);
      });
    };
  }

  componentDidMount () {
    const { position, isSpecialAccount } = this.props;

    this.jump(position, isSpecialAccount);
  }

  componentWillReceiveProps (nextProps : ListPropTypes) {
    if (nextProps.itemSelected !== this.props.itemSelected) {
      const { position, isSpecialAccount } = nextProps;

      this.jump(position, isSpecialAccount);
    }
  }

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      this.props.isSpecialAccount !== nextProps.isSpecialAccount ||
      this.props.items !== nextProps.items ||
      this.props.account !== nextProps.account ||
      this.props.itemSelected !== nextProps.itemSelected ||
      this.props.position !== nextProps.position ||
      this.props.canExpressSuggestions !== nextProps.canExpressSuggestions ||
      this.props.toggledItem !== nextProps.toggledItem
    );
  }

  render () {
    const {
      toggledItem,
      canExpressSuggestions,
      items,
      isSpecialAccount,
      selectItem,
      itemSelected,
      emit,
      account,
      toggleItem,
      showItemDetails,
      showCommentModal,
    } = this.props;

    if (items.size === 0) {
      if (isSpecialAccount) {
        return (
          <UpdateBar emit={emit} />
        );
      }

      return (
        <div className="text-center display-4">
          {"Nu există proiecte pe ordinea de zi"}
        </div>
      );
    }

    return (
      <div>
        {
          isSpecialAccount ? (
            <UpdateBar emit={emit} />
          ) : (
            null
          )
        }
        <div className="table-responsive">
          <table className="table table-sm list-table">
            <tbody>
              {
                items.map((item) => (
                  <Row
                    canExpressSuggestions={canExpressSuggestions}
                    data={item}
                    emit={emit}
                    group={account.get("group")}
                    id={item}
                    isSelected={item === itemSelected}
                    isSpecialAccount={isSpecialAccount}
                    isToggled={item === toggledItem}
                    key={item}
                    selectItem={selectItem}
                    showCommentModal={showCommentModal}
                    showItemDetails={showItemDetails}
                    toggleItem={toggleItem}
                  />
                )
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
