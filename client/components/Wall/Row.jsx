// @flow

type RowPropTypes = {
  data : any;
  isSpecialAccount: boolean;
  isSelected: boolean;
  showButtons: boolean;

  selectItem: (id : number) => () => void;
};

import React from "react";

import Details from "./Details";

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.isSpecialAccount !== nextProps.isSpecialAccount ||
      this.props.showButtons !== nextProps.showButtons ||
      this.props.isSelected !== nextProps.isSelected
    );
  }

  render () {
    const { data, showButtons, isSpecialAccount, selectItem, isSelected } = this.props;

    const
      position = data.get("position"),
      title = data.get("title"),
      project = data.get("project"),
      id = data.get("_id");

    return (
      <tr className={isSelected ? "table-info" : ""}>
        <td className="text-center">
          {
            showButtons ? (
              <button className="btn btn-info btn-sm">
                <small>{position}</small>
              </button>
            ) : position
          }
        </td>
        <td>
          <strong>{project}</strong>
          <div className="wrap-truncate small ellipsis">
            {title}
          </div>
        </td>
        <td className="small">
          {
            isSpecialAccount ? (
              isSelected ? null : (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={selectItem(id)}>{"Alege"}</button>
                </div>
              )
            ) : (
              <Details data={data} />
            )
          }
        </td>
      </tr>
    );
  }
}

export default Row;
