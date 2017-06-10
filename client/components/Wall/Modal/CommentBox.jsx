// @flow

import type { State, Dispatch, Emit } from "types";

type OwnProps = {
  emit: Emit;
}

type UpdateCommentTypes = { comment : string; id: string; };

type ItemDetailsPropTypes = {
  data: any;
  account: any;
  temporaryComment: string;
  isUpdating: bool;
  nextID?: string;
  selectItem: (id: string) => void;
  updateTemporaryComment: (value: string) => void;
  updateComment: (data : UpdateCommentTypes) => () => void;
  closeModal: () => void;
};

import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import {
  hideModal,
  updateTemporaryComment as updateTemporaryCommentAction,
  updatingComment as updatingCommentAction,
} from "actions";

import {
  getItem,
  getCurrentAccount,
  getSelectedItem,
  getIsUpdatingComment,
  getTemporaryComment,
  getNextID,
} from "reducers";

import { Optiune } from "../Optiuni";

const processText = (value? : string) => {
  if (typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return "";
};

const
  mapStateToProps = (state : State) => {

    const id = getSelectedItem(state);

    return {
      isUpdating       : getIsUpdatingComment(state),
      temporaryComment : getTemporaryComment(state),

      data    : getItem(state, id),
      account : getCurrentAccount(state),
      nextID  : getNextID(state),
    };
  },
  mapDispatchToProps = (dispatch : Dispatch, { emit } : OwnProps) => ({
    updateTemporaryComment (value) {
      dispatch(updateTemporaryCommentAction(value));
    },
    selectItem (id) {
      emit("SELECT_ITEM", id);
    },
    closeModal () {
      dispatch(hideModal());
    },
    updateComment ({ comment, id } : UpdateCommentTypes) {
      dispatch(updatingCommentAction());
      setTimeout(() => {
        emit("UPDATE_COMMENT", {
          comment,
          id,
        });
      });
    },
  });

class ItemDetails extends React.Component {
  props: ItemDetailsPropTypes;

  textarea: HTMLTextAreaElement;

  handleSubmit: () => void;
  goToNextItem: () => void;
  focusTextarea: () => void;
  handleOnChange: (event : any) => void;
  registerTextarea: (node : HTMLTextAreaElement) => void;

  constructor (props : ItemDetailsPropTypes) {
    super(props);

    this.focusTextarea = () => {
      setTimeout(() => {
        const { textarea } = this;

        if (textarea && textarea !== null) {
          textarea.focus();
        }
      });
    };

    this.handleSubmit = (event: any) => {
      const
        { temporaryComment, data, updateComment } = this.props,
        id = data.get("_id");

      event.preventDefault();

      setTimeout(() => {
        const delay = 100;

        setTimeout(() => {
          this.focusTextarea();
        }, delay);
        updateComment({
          id,
          comment: temporaryComment,
        });
      });
    };

    this.handleOnChange = ({ target : { value } }) => {
      const { updateTemporaryComment } = this.props;

      updateTemporaryComment(value);
    };

    this.registerTextarea = (node : HTMLTextAreaElement) => {
      this.textarea = node;
    };

    this.goToNextItem = () => {
      const { selectItem, nextID } = this.props;

      if (typeof nextID !== "undefined") {
        selectItem(nextID);
      }
    };
  }

  componentDidMount () {
    this.focusTextarea();
  }

  shouldComponentUpdate (nextProps : ItemDetailsPropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.temporaryComment !== nextProps.temporaryComment ||
      this.props.isUpdating !== nextProps.isUpdating ||
      this.props.account !== nextProps.account
    );
  }

  render () {
    const {
      account,
      data,
      closeModal,
      isUpdating,
      temporaryComment,
      nextID,
    } = this.props;

    const group = account.get("group");

    const
      title = data.get("title"),
      project = data.get("project"),
      position = data.get("position"),
      comment = data.get("comment"),
      hasComment = typeof comment !== "undefined" && comment !== "",
      groupOption = data.get(group);

    return (
      <Modal isOpen size="lg" toggle={closeModal} zIndex="1061">
        <ModalHeader toggle={closeModal}>
          <span className="badge badge-info">{position}</span>
          <Optiune content={project} inline optiune={groupOption} />
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="big-truncate">
                    <div className="ellipsis-big">{title}</div>
                  </div>
                  <hr />
                  {
                    hasComment ? (
                      <div className="font-italic big-truncate">
                        <div className="ellipsis-big">{comment}</div>
                      </div>
                    ) : (
                      <div className="text-muted mb-3">
                        {"Nu există comentariu"}
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col">
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group mt-3">
                      <label htmlFor="comment">{"Comentariu"}</label>
                      <textarea
                        className="form-control"
                        cols="10"
                        disabled={isUpdating}
                        id="comment"
                        onChange={this.handleOnChange}
                        ref={this.registerTextarea}
                        rows="3"
                        value={processText(temporaryComment)} />
                      <div className="text-center">
                        <button
                          className="mt-2 btn btn-primary"
                          disabled={isUpdating}
                          type="submit">
                          {
                            isUpdating ? "Așteaptă..." : "Modifică"
                          }
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix mt-5">
            {
              nextID ? (
                <div className="float-right">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={this.goToNextItem}
                    tabIndex="-1"
                    type="button">
                    {"Alege următorul proiect "}
                    <i className="fa fa-arrow-right" />
                  </button>
                </div>
              ) : null
            }
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetails);
