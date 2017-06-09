// @flow

import type { State } from "types";

type RowPropTypes = {
  data : any;
  isSpecialAccount: boolean;
  isSelected: boolean;
  showButtons: boolean;
  isToggled: boolean;
  group: string;

  emit: (name : string, msg : any) => void;
  toggleItem: (id : string) => () => void;
  selectItem: (id : string) => () => void;
  showItemDetails: (id : string) => () => void;
};

import { connect } from "react-redux";
import classnames from "classnames";
import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Details from "./Details";
import VoteBox from "./VoteBox";
import { Optiune } from "./Optiuni";

import { getItem } from "reducers";

import { optiuneNecunoscuta } from "utility";

const
  mapStateToProps = (state : State, { id }) => ({
    data: getItem(state, id),
  });

  // showButtons ? (
  //   <button
  //     className={classnames("btn btn-sm", {
  //       "btn-info active"       : isToggled,
  //       "btn-outline-secondary" : !isToggled,
  //     })}>
  //     <small>{position}</small>
  //   </button>
  // ) :

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.isToggled !== nextProps.isToggled ||
      this.props.group !== nextProps.group ||
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
      group,

      emit,
      showItemDetails,
    } = this.props;

    const
      position = data.get("position"),
      title = data.get("title"),
      project = data.get("project"),
      id = data.get("_id"),
      groupOption = data.get(group),
      isVoted = typeof groupOption !== "undefined" && groupOption !== optiuneNecunoscuta;

    return (
      <tr
        className={classnames({
          "table-info": isSelected,
        })}
        onClick={showButtons && toggleItem(id)}>
        <td>
          <strong className="cursor-pointer" onClick={showItemDetails(id)}>
            <span className="badge badge-default">{position}</span>
            {" "}
            {
              isVoted ? (
                <span>
                  <Optiune content={project} inline optiune={groupOption} />
                </span>
              ) : project
            }
          </strong>
          <div className="wrap-truncate ellipsis">
             <ReactCSSTransitionGroup
               transitionEnterTimeout={100}
               transitionLeaveTimeout={10}
               transitionName="item-row">
              {
                isToggled ? (
                  <VoteBox data={data} emit={emit} id={id} isVoted={isVoted} />
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
                <Details data={data} group={group} />
              )
            }
          </td>
        </tr>
    );
  }
  }

export default connect(mapStateToProps)(Row);
