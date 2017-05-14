// @flow

import type { ModalActionType } from "types";

import React from "react";

// import ModifyCashing from "../Company/Cashing/Modal/Modify";

/* eslint-disable complexity */
const getComponent = (type : ModalActionType) : any => {
  switch (type) {

    // case "ADD_BANK_HOLIDAY":
    //   return AddBankHoliday;

    default:
      return (
        <div>
          {`Please define a modal component for the type [${type}] in Modal/components.jsx`}
        </div>
      );
  }
};

export default getComponent;
