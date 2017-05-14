// @flow

import type { Action, Account, BankHoliday, Company } from "types";

import { createModal as modal } from "actions";

// companies
export const addCompanyModal = (cbAfter? : (company : Company) => void) : Action => (
  modal("ADD_COMPANY", {
    cbAfter,
  })
);

export const deleteCompanyModal = (id : number) : Action => (
  modal("DELETE_COMPANY", {
    id,
  })
);

export const toggleCompanyStateModal = (id : number) : Action => (
  modal("TOGGLE_COMPANY_STATE", {
    id,
  })
);

// accounts
export const addAccountModal = (cbAfter? : (account : Account) => void) : Action => (
  modal("ADD_ACCOUNT", {
    cbAfter,
  })
);

export const modifyAccountModal = ({ id, cbAfter } : {
  id: number,
  cbAfter? : (account : Account) => void,
}) : Action => (
  modal("MODIFY_ACCOUNT", {
    id,
    cbAfter,
  })
);

export const deleteAccountModal = (id : number) : Action => (
  modal("DELETE_ACCOUNT", {
    id,
  })
);

export const resetPasswordAccountModal = (id : number) : Action => (
  modal("RESET_PASSWORD_ACCOUNT", {
    id,
  })
);

export const toggleAccountStateModal = (id : number) : Action => (
  modal("TOGGLE_ACCOUNT_STATE", {
    id,
  })
);

// bankHolidays
export const addBankHolidayModal = (cbAfter? : (bankHoliday : BankHoliday) => void) : Action => (
  modal("ADD_BANK_HOLIDAY", {
    cbAfter,
  })
);

export const modifyBankHolidayModal = ({ id, cbAfter } : {
  id: number,
  cbAfter? : (bankHoliday : BankHoliday) => void,
}) : Action => (
  modal("MODIFY_BANK_HOLIDAY", {
    id,
    cbAfter,
  })
);

export const deleteBankHolidayModal = (id : number) : Action => (
  modal("DELETE_BANK_HOLIDAY", {
    id,
  })
);
