// @flow

type RowPropTypes = {
  data : any;
  showVat: boolean;

  showModifyModal: (id : number) => void;
  showDeleteModal: (id : number) => void;
};

import React from "react";

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data
    );
  }

  render () {
    const { data } = this.props;

    const
      position = data.get("position"),
      descriere = data.get("descriere"),
      project = data.get("project");

    return (
      <tr>
        <td>
          {position}
        </td>
        <td>
          <strong>{project}</strong>
          <div className="truncate">
            {descriere}
          </div>
        </td>
        <td>
          {" "}
        </td>
      </tr>
    );
  }
}

export default Row;
