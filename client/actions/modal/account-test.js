
/* eslint-disable no-console */

import type { Account, BankHoliday, Company } from "types";

import {
  addCompanyModal,
  deleteCompanyModal,
  toggleCompanyStateModal,
  addAccountModal,
  modifyAccountModal,
  deleteAccountModal,
  resetPasswordAccountModal,
  toggleAccountStateModal,
  addBankHolidayModal,
  modifyBankHolidayModal,
  deleteBankHolidayModal,
} from "./account";

describe("modal/account actions", () => {

  // company

  it("should create an action to show [add company] modal with a callback", () => {
    const
      cbAfter = (company : Company) => {
        console.log("company", company);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_COMPANY",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addCompanyModal(cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [add company] modal without a callback", () => {
    const
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_COMPANY",
          modalProps : {},
        },
      };

    expect(addCompanyModal()).toEqual(expectedAction);
  });

  it("should create an action to show [delete company] modal", () => {
    const
      id = 16,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_COMPANY",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteCompanyModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [toggle company state] modal", () => {
    const
      id = 16,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "TOGGLE_COMPANY_STATE",
          modalProps : {
            id,
          },
        },
      };

    expect(toggleCompanyStateModal(id)).toEqual(expectedAction);
  });


  // account

  it("should create an action to show [add account] modal", () => {
    const
      cbAfter = (account : Account) => {
        console.log("account", account);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_ACCOUNT",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addAccountModal(cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [modify account] modal without a callback", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_ACCOUNT",
          modalProps : {
            id,
          },
        },
      };

    expect(modifyAccountModal({ id })).toEqual(expectedAction);
  });

  it("should create an action to show [modify account] modal and it has a callback", () => {
    const
      id = 85,
      cbAfter = (account : Account) => {
        console.log("account", account);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_ACCOUNT",
          modalProps : {
            id,
            cbAfter,
          },
        },
      };

    expect(modifyAccountModal({
      id,
      cbAfter,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete account] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_ACCOUNT",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteAccountModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [reset password account] modal", () => {
    const
      id = 185,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "RESET_PASSWORD_ACCOUNT",
          modalProps : {
            id,
          },
        },
      };

    expect(resetPasswordAccountModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [toggle account state] modal", () => {
    const
      id = 98,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "TOGGLE_ACCOUNT_STATE",
          modalProps : {
            id,
          },
        },
      };

    expect(toggleAccountStateModal(id)).toEqual(expectedAction);
  });

  // bank holiday

  it("should create an action to show [add bank holiday] modal with a callback", () => {
    const
      cbAfter = (bankHoliday : BankHoliday) => {
        console.log("bankHoliday", bankHoliday);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_BANK_HOLIDAY",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addBankHolidayModal(cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [add bank holiday] modal without a callback", () => {
    const
        expectedAction = {
          type    : "SHOW_MODAL",
          payload : {
            modalType  : "ADD_BANK_HOLIDAY",
            modalProps : { },
          },
        };

    expect(addBankHolidayModal()).toEqual(expectedAction);
  });


  it("should create an action to show [modify bank holiday] modal without a callback", () => {
    const
      id = 12,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_BANK_HOLIDAY",
          modalProps : {
            id,
          },
        },
      };

    expect(modifyBankHolidayModal({ id })).toEqual(expectedAction);
  });

  it("should create an action to show [modify bank holiday] modal and it has a callback", () => {
    const
      id = 96,
      cbAfter = (bankHoliday : Account) => {
        console.log("bankHoliday", bankHoliday);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_BANK_HOLIDAY",
          modalProps : {
            id,
            cbAfter,
          },
        },
      };

    expect(modifyBankHolidayModal({
      id,
      cbAfter,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete bank holiday] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_BANK_HOLIDAY",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteBankHolidayModal(id)).toEqual(expectedAction);
  });
});
