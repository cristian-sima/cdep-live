// @flow

type RowPropTypes = {
  data : any;
  isSpecialAccount: boolean;
  isSelected: boolean;
  showButtons: boolean;
  isToggled: boolean;

  emit: (name : string, msg : any) => void;
  toggleItem: (id : string) => () => void;
  selectItem: (id : string) => () => void;
};

import React from "react";
import classnames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Details from "./Details";
import VoteBox from "./VoteBox";

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.isToggled !== nextProps.isToggled ||
      this.props.data !== nextProps.data ||
      this.props.isSpecialAccount !== nextProps.isSpecialAccount ||
      this.props.showButtons !== nextProps.showButtons ||
      this.props.isSelected !== nextProps.isSelected
    );
  }

  render () {
    const {
      toggleItem,

      data,
      isToggled,
      showButtons,
      isSpecialAccount,
      selectItem,
      isSelected,

      emit,
    } = this.props;

    const
      position = data.get("position"),
      title = data.get("title"),
      project = data.get("project"),
      id = data.get("_id");

    return (
      <tr className={isSelected ? "table-info" : ""} onClick={showButtons && toggleItem(id)}>
        <td className="text-center">
          {
            showButtons ? (
              <button
                className={classnames("btn btn-sm", {
                  "btn-info active"       : isToggled,
                  "btn-outline-secondary" : !isToggled,
                })}>
                <small>{position}</small>
              </button>
            ) : position
          }
        </td>
        <td>
          <strong>{project}</strong>
          <div className="wrap-truncate ellipsis">
             <ReactCSSTransitionGroup
               transitionEnterTimeout={100}
               transitionLeaveTimeout={10}
               transitionName="item-row">
              {
                isToggled ? (
                  <VoteBox data={data} emit={emit} id={id} />
                ) : null
              }
              {
                isToggled ? null : (
                  <div>{title}</div>
                )
              }
            </ReactCSSTransitionGroup>
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
