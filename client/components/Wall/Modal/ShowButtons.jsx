// @flow

import type { State, Dispatch } from "types";

type ConfirmPropTypes = {
  account: any;

  closeModal: () => void;
  showButtons: () => void;
};

import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import {
  hideModal,
  showButtons as showButtonsAction,
} from "actions";

import { getCurrentAccount } from "reducers";

const
  mapStateToProps = (state : State) => ({
      account: getCurrentAccount(state),
    }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    closeModal () {
      dispatch(hideModal());
    },
    showButtons () {
      dispatch(showButtonsAction());
      setTimeout(() => {
        dispatch(hideModal());
      });
    },
  });

class Confirm extends React.Component {

  props: ConfirmPropTypes;

  field: HTMLInputElement;

  handleConfirmButton: (node : any) => void;
  focusConfirmButton: () => number;

  constructor (props : ConfirmPropTypes) {

    super(props);

    this.handleConfirmButton = (node : any) => {
      this.field = node;
    };

    this.focusConfirmButton = () => setTimeout(() => {
      setTimeout(() => {
        const { field } = this;

        if (field && field !== null) {
          field.focus();
        }
      });
    });
  }

  componentDidMount () {
    this.focusConfirmButton();
  }

  shouldComponentUpdate (nextProps : ConfirmPropTypes) {
    return (
      this.props.account !== nextProps.account
    );
  }

  render () {

    const { showButtons, closeModal, account } = this.props;

    const group = account.get("group");

    return (
      <Modal isOpen toggle={closeModal} zIndex="1061">
        <ModalHeader toggle={closeModal}>{"Confirmare"}</ModalHeader>
        <ModalBody>
          {`Vrei să fii tu, cel care va alege sugestiile grupului ${group}?`}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            {"Nu, înapoi la Ordinea de Zi"}
          </Button>
          <button
            className={"btn btn-primary"}
            onClick={showButtons}
            ref={this.handleConfirmButton}
            type="button">
            {"Da"}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
