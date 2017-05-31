// @flow

import type { State, Dispatch } from "types";

type ListPropTypes = {
  items: any;
  isSpecialAccount: any;
  itemSelected?: number;

  selectItem: (id : number) => void;
};

import React from "react";
import { connect } from "react-redux";

import { getItemsSorted, getIsSpecialAccount, getSelectedItem } from "reducers";

import Row from "./Row";

const
  mapStateToProps = (state : State) => ({
    items            : getItemsSorted(state),
    isSpecialAccount : getIsSpecialAccount(state),

    itemSelected: getSelectedItem(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    selectItem: (id : number) => () => {
      emit("SELECT_ITEM", id);
    },
  });

class List extends React.Component {
  props: ListPropTypes;

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      this.props.items !== nextProps.items ||
      this.props.itemSelected !== nextProps.itemSelected ||
      this.props.isSpecialAccount !== nextProps.isSpecialAccount
    );
  }

  render () {
    const { items, isSpecialAccount, selectItem, itemSelected } = this.props;

    return (
      <div className="table-responsive">
        <table className="table table-striped table-sm list-table">
          <thead>
            <tr className="text-muted">
              <th className="small text-center">
                {"#"}
              </th>
              <th>
                {" "}
              </th>
              <th className="text-center">
                {"Recomandări"}
              </th>
            </tr>
          </thead>
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
