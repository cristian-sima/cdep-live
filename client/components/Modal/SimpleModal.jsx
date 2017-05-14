// @flow

import type { Dispatch } from "types";

type SimpleModalPropTypes = {
  size?: string;
  title: string;
  children: any;

  hideModal: () => void;
};

import { connect } from "react-redux";
import React from "react";
import { bindActionCreators } from "redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import { hideModal as hideModalAction } from "actions";

const
  mapDispatchToProps = (dispatch : Dispatch) => (
    bindActionCreators({
      hideModal: hideModalAction,
    }, dispatch)
  );

const SimpleModal = ({ hideModal, children, size, title } : SimpleModalPropTypes) => (
  <Modal isOpen size={size} toggle={hideModal} zIndex="1061">
     <ModalHeader toggle={hideModal}>{ title }</ModalHeader>
     <ModalBody>
        { children }
     </ModalBody>
   </Modal>
);

export default connect(null, mapDispatchToProps)(SimpleModal);
