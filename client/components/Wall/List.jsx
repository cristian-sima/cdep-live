// @flow

import type { State } from "types";

type ListPropTypes = {
  items: any;
};

import React from "react";
import { connect } from "react-redux";

import { getItemsSorted } from "reducers";

import Row from "./Row";

const
  mapStateToProps = (state : State) => ({
    items: getItemsSorted(state),
  });
  // mapDispatchToProps = (dispatch : Dispatch) => ({});

class List extends React.Component {
  props: ListPropTypes;

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      this.props.items !== nextProps.items
    );
  }

  render () {
    const { items } = this.props;

    return (
      <div className="table-responsive">
        <table className="table table-striped table-sm list-table">
          <thead>
            <tr>
              <th className="small text-center">
                {"#"}
              </th>
              <th>
                {"Lege"}
              </th>
              <th className="text-center">
                {"Recomandări"}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((item) => (
                <Row
                  data={item}
                  key={item.get("_id")}
               />
              )
            )
          }
        </tbody>
      </table>
    </div>
    );
  }
}

export default connect(mapStateToProps)(List);
