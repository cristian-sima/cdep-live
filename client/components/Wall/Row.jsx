// @flow

import type { State } from "types";

type RowPropTypes = {
  data : any;
  isSpecialAccount: boolean;
  isSelected: boolean;
  canExpressSuggestions: boolean;
  isToggled: boolean;
  group: string;

  emit: (name : string, msg : any) => void;
  toggleItem: (id : string) => () => void;
  selectItem: (id : string) => () => void;
  showItemDetails: (id : string) => () => void;
  showCommentModal: () => void;
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

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.isToggled !== nextProps.isToggled ||
      this.props.group !== nextProps.group ||
      this.props.data !== nextProps.data ||
      this.props.isSpecialAccount !== nextProps.isSpecialAccount ||
      this.props.canExpressSuggestions !== nextProps.canExpressSuggestions ||
      this.props.isSelected !== nextProps.isSelected
    );
  }

  render () {
    const {
      toggleItem,

      data,
      isToggled,
      canExpressSuggestions,
      isSpecialAccount,
      selectItem,
      isSelected,
      group,

      emit,
      showItemDetails,
      showCommentModal,
    } = this.props;

    const
      position = data.get("position"),
      title = data.get("title"),
      project = data.get("project"),
      id = data.get("_id"),
      idx = data.get("idx"),
      comment = data.get("comment"),
      groupOption = data.get(group),
      isVoted = typeof groupOption !== "undefined" && groupOption !== optiuneNecunoscuta,
      hasComment = typeof comment !== "undefined" && comment !== "" && isSelected,
      shouldManageComment = isSpecialAccount && isSelected,
      ellipsisClass = hasComment ? "ellipsis-row-with-comment" : (
        shouldManageComment ? "ellipsis-row-full-manage-comment" : "ellipsis-row-full"
      ),
      showLink = !isSpecialAccount && typeof idx !== "undefined";

    return (
      <tr
        className={classnames({
          "table-info": isSelected,
        })}
        onClick={canExpressSuggestions && toggleItem(id)}>
        <td className="position-table-row">
          <span className="badge badge-pill badge-info">{position}</span>
        </td>
        <td>
          <strong className="cursor-pointer" onClick={showItemDetails(id)}>
            {" "}
            {
              isVoted ? (
                <Optiune content={project} inline optiune={groupOption} />
              ) : project
            }
          </strong>
          <div className="list-truncate">
            <ReactCSSTransitionGroup
              transitionEnterTimeout={300}
              transitionLeaveTimeout={200}
              transitionName="item-row">
              {
                isToggled ? (
                  <VoteBox data={data} emit={emit} id={id} isVoted={isVoted} />
                ) : null
              }
              {
                isToggled ? null : (
                  <div>
                    <div className={ellipsisClass}>
                      {title}
                    </div>
                    <div className={"ellipsis-comment font-weight-bold"}>
                      {
                        hasComment ? (
                          <span>
                            {
                              shouldManageComment ? (
                                <span>
                                  <a
                                    className="text-primary cursor-pointer"
                                    onClick={showCommentModal}>
                                    <i className="fa fa-pencil" />
                                    {" Modifică"}
                                  </a>
                                  {" "}
                                </span>
                              ) : null
                            }
                            { comment }
                          </span>
                        ) : (
                          shouldManageComment ? (
                            <a
                              className="text-primary cursor-pointer"
                              onClick={showCommentModal} >{"Adaugă comentariu"}
                            </a>
                          ) : null
                        )
                      }
                    </div>
                  </div>
                )
              }
            </ReactCSSTransitionGroup>
          </div>
        </td>
        <td className="small details-table-row">
          {
            showLink ? (
              <div className="d-inline-block float-right">
                <a
                  href={`http://www.cdep.ro/pls/proiecte/upl_pck2015.proiect?idp=${idx}#content`}
                  rel="noreferrer noopener"
                  target="_blank">
                  <i className="fa text-muted fa-external-link" />
                </a>
              </div>
            ) : null
          }
          {
            isSpecialAccount ? (
              isSelected ? null : (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={selectItem(id)}>
                    {"Alege"}
                  </button>
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
