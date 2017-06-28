// @flow

import type { ModalActionType } from "types";

import React from "react";

import ItemDetails from "../Wall/Modal/ItemDetails";
import CommentBox from "../Wall/Modal/CommentBox";

const getComponent = (type : ModalActionType) : any => {
  switch (type) {

    case "ITEM_DETAILS":
      return ItemDetails;

    case "COMMENT_BOX":
      return CommentBox;

    default:
      return (
        <div>
          {`Please define a modal component for the type [${type}] in Modal/components.jsx`}
        </div>
      );
  }
};

export default getComponent;
