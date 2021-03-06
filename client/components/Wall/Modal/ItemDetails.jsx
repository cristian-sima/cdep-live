// @flow

import type { State, Dispatch } from "types";

type OwnProps = {
  id: string;
}

type ItemDetailsPropTypes = {
  data: any;
  account: any;
  closeModal: () => void;
};

import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import { hideModal } from "actions";
import { getItem, getCurrentAccount } from "reducers";

import { Optiune } from "../Optiuni";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data    : getItem(state, id),
    account : getCurrentAccount(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    closeModal () {
      dispatch(hideModal());
    },
  });

class ItemDetails extends React.Component<ItemDetailsPropTypes> {
  props: ItemDetailsPropTypes;

  shouldComponentUpdate (nextProps : ItemDetailsPropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.account !== nextProps.account
    );
  }

  render () {
    const { account, data, closeModal } = this.props;

    const group = account.get("group");

    const
      title = data.get("title"),
      project = data.get("project"),
      idx = data.get("idx"),
      description = data.get("description"),
      groupOption = data.get(group);

    return (
      <Modal autoFocus={false} isOpen toggle={closeModal} zIndex="1061">
        <ModalHeader toggle={closeModal}>
          <Optiune content={project} inline optiune={groupOption} />
        </ModalHeader>
        <ModalBody>
          <div>
            {
              typeof idx === "undefined" ? null : (
                <div className="text-right">
                  <a
                    href={`http://www.cdep.ro/pls/proiecte/upl_pck2015.proiect?idp=${idx}#content`}
                    rel="noreferrer noopener"
                    target="_blank">
                    {"Mai multe detalii "}
                    <i className="fa fa-external-link" />
                  </a>
                  <br />
                </div>
              )
            }
            {title}
            {
              typeof description === "undefined" ? null : (
                <div>
                  <hr />
                  {description}
                </div>
              )
            }
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetails);
