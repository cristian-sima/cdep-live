// @flow

import type { Dispatch } from "types";

type ConfirmPropTypes = {
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

const
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

  field: any;

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

  render () {

    const { showButtons, closeModal } = this.props;

    return (
      <Modal isOpen toggle={closeModal} zIndex="1061">
        <ModalHeader toggle={closeModal}>{"Confirmare"}</ModalHeader>
        <ModalBody>
          {"Vrei să fii tu, cel care va alege sugestiile grupului PSD?"}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={closeModal}>
            {"Nu, înapoi la Ordinea de Zi"}
          </Button>
          <button
            className={"btn btn-danger"}
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

export default connect(null, mapDispatchToProps)(Confirm);
