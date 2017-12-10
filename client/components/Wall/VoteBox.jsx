// @flow

import type { Dispatch, State, OptiuneType } from "types";

type VoteBoxPropTypes = {
  id: string;
  isVoted: boolean;
  isPublicVote: boolean;

  togglePublicVote: () => void;
  expressSuggestion: (data : { optiune : OptiuneType; id : string; isPublicVote: bool; }) => void;
};

import React from "react";
import { connect } from "react-redux";

import {
  optiunePro,
  optiuneContra,
  optiuneNecunoscuta,
  optiuneAbtinere,
} from "utility";

import {
  togglePublicVote as togglePublicVoteAction,
  toggleItem as toggleItemAction,
} from "actions";

import { getIsPublicVote } from "reducers";

const
  mapStateToProps = (state : State) => ({
    isPublicVote: getIsPublicVote(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    togglePublicVote: (event) => {
      event.preventDefault();
      event.stopPropagation();

      dispatch(togglePublicVoteAction());
    },
    expressSuggestion: (data) => (event) => {
      event.preventDefault();
      event.stopPropagation();

      emit("EXPRESS_SUGGESTION", data);

      setTimeout(() => {
        dispatch(toggleItemAction(data.id));
      });
    },
  });

class VoteBox extends React.Component {
  props: VoteBoxPropTypes;

  shouldComponentUpdate (nextProps : VoteBoxPropTypes) {
    return (
      this.props.id !== nextProps.id ||
      this.props.isVoted !== nextProps.isVoted ||
      this.props.isPublicVote !== nextProps.isPublicVote
    );
  }

  render () {
    const { id, isPublicVote, expressSuggestion, togglePublicVote, isVoted } = this.props;

    return (
      <div className="h5 clearfix" key="voteaza">
        <div
          className="container"
          style={{
            maxWidth: 400,
          }}>
          <div className="row">
            <div className="col text-success text-center">
              <div
                className="cursor-pointer expressSuggestion" onClick={expressSuggestion({
                  optiune: optiunePro,
                  id,
                  isPublicVote,
                })}>
                <i className="fa fa-thumbs-o-up" />
                {" "}
                {"Pentru"}
              </div>
            </div>
            <div className="col text-danger text-center">
              <div
                className="cursor-pointer expressSuggestion" onClick={expressSuggestion({
                  optiune: optiuneContra,
                  isPublicVote,
                  id,
                })}>
                <i className="fa fa-thumbs-o-down" />
                {" "}
                {"Contra"}
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div
              className="text-warning cursor-pointer expressSuggestion"
              onClick={expressSuggestion({
                optiune: optiuneAbtinere,
                isPublicVote,
                id,
              })}>
              <i className="fa fa-minus-circle" />
              {" "}
              {"Abținere"}
            </div>
            {
              isVoted ? (
                <div className="float-right">
                  <span
                    className="cursor-pointer small"
                    onClick={expressSuggestion({
                      optiune: optiuneNecunoscuta,
                      isPublicVote,
                      id,
                    })}>
                    <span>
                      <i className="fa fa-times text-muted" />
                    </span>
                  </span>
                </div>
              ) : null
            }
            <div className="float-left">
              <span className="cursor-pointer" onClick={togglePublicVote}>
                {
                  isPublicVote ? (
                    <i className="fa fa-eye" />
                  ) : (
                    <i className="fa fa-eye-slash text-muted" />
                  )
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteBox);
