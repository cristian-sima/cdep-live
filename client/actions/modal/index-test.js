/* eslint-disable no-console */

import type { Company } from "types";

import {
  createModal,
  hideModal,
  showItemDetailsModal,
  showCommentModal,
} from "./index";

describe("modal actions", () => {

  it("should create an action to show a modal without modal props", () => {
    const
      modalType = "ADD_COMPANY",
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType,
        },
      };

    expect(createModal(modalType)).toEqual(expectedAction);
  });

  it("should create an action to show a modal with modal props", () => {
    const
      id = 84,
      cbAfter = (company : Company) => {
        console.log("company", company);
      },
      modalType = "ADD_COMPANY",
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType,
          modalProps: {
            cbAfter,
            id,
          },
        },
      };

    expect(createModal(modalType, {
      id,
      cbAfter,
    })).toEqual(expectedAction);
  });

  it("should create an action to hide the first front modal", () => {
    const
      expectedAction = {
        type: "HIDE_MODAL",
      };

    expect(hideModal()).toEqual(expectedAction);
  });

  it("should create an action to show [ item details ] modal", () => {
    const
      id = 7,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ITEM_DETAILS",
          modalProps : {
            id,
          },
        },
      };

    expect(showItemDetailsModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [ comment box ] modal", () => {
    const
      emit = (name : string, data ?: any) => {
        console.log(`name : ${name}, data: ${data}`);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "COMMENT_BOX",
          modalProps : {
            emit,
          },
        },
      };

    expect(showCommentModal(emit)).toEqual(expectedAction);
  });
});
