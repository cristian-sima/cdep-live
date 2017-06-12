// @flow

import type { State, Dispatch } from "types";

type CurrentItemPropTypes = {
  account: any;
  item: any;
  isPublicAccount: bool;
  showItemDetails: (id : string) => () => void;
};

import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Optiune } from "./Optiuni";
import Details from "./Details";

import {
  showItemDetailsModal as showItemDetailsModalAction,
} from "actions";

import { getItem, getSelectedItem, getCurrentAccount, getIsPublicAccount } from "reducers";

const
  mapStateToProps = (state : State) => {
      const selected = getSelectedItem(state);

      return {
        item            : getItem(state, selected),
        account         : getCurrentAccount(state),
        isPublicAccount : getIsPublicAccount(state),
      };
    },
  mapDispatchToProps = (dispatch : Dispatch) => ({
    showItemDetails: (id : string) => () => {
      dispatch(showItemDetailsModalAction(id));
    },
  });


class CurrentItem extends React.Component {
  props: CurrentItemPropTypes;

  shouldComponentUpdate (nextProps : CurrentItemPropTypes) {
    return (
      this.props.isPublicAccount !== nextProps.isPublicAccount ||
      this.props.account !== nextProps.account ||
      this.props.item !== nextProps.item
    );
  }

  render () {
    const
      { item, account, showItemDetails, isPublicAccount } = this.props;

    if (typeof item === "undefined") {
      return (
        <div className="text-center display-4 mt-4">
          {"Nu este ales niciun proiect încă"}
          {
            isPublicAccount ? null : (
              <span>
                {". Vizualizați "}
                <Link to="/">
                  {"Ordinea de zi"}
                </Link>
              </span>
            )
          }
        </div>
      );
    }

    const
      group = account.get("group");

    const
      id = item.get("_id"),
      project = item.get("project"),
      position = item.get("position"),
      title = item.get("title"),
      description = item.get("description"),
      groupOption = item.get(group);

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <div className="h4 cursor-pointer" onClick={showItemDetails(id)}>
                <span className="badge badge-info">{position}</span>
                {" "}
                <Optiune content={project} inline optiune={groupOption} />
              </div>
              <div className="ellipsis-big">
                {title}
              </div>
              <div className="hidden-md-down">
                {
                  description ? (
                    <div>
                      <hr />
                      {description}
                    </div>
                  ) : null
                }
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mt-4 mt-md-0">
                <Details data={item} group={group} />
              </div>
            </div>
          </div>
        </div>
        {
          isPublicAccount ? null : (
            <div>
              <hr />
              <Link to="/">
                {"Ordinea de zi"}
              </Link>
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CurrentItem));
