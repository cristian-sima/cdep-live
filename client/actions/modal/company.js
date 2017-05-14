// @flow

import type {
  Action,
  Cashing,
  Client,
  Delegate,
  Employee,
  Article,
  Serial,
  Permission,
} from "types";

import { createModal as modal } from "actions";

// article

export const listArticlesModal = () : Action => (
  modal("LIST_ARTICLES")
);

export const addArticleModal = (cbAfter? : (article : Article) => void) : Action => (
  modal("ADD_ARTICLE", {
    cbAfter,
  })
);

export const modifyArticleModal = ({ id, cbAfter } : {
  id: number,
  cbAfter? : (article : Article) => void,
}) : Action => (
  modal("MODIFY_ARTICLE", {
    id,
    cbAfter,
  })
);

export const deleteArticleModal = (id : number) : Action => (
  modal("DELETE_ARTICLE", {
    id,
  })
);

// permission

export const addPermissionModal = (cbAfter? : (permission : Permission) => void) : Action => (
  modal("ADD_PERMISSION", {
    cbAfter,
  })
);

export const deletePermissionModal = (id : number) : Action => (
  modal("DELETE_PERMISSION", {
    id,
  })
);

export const showAddPermissionNoticeModal = () : Action => (
  modal("PERMISSION_NOTICE")
);

// clients
export const addClientModal = (cbAfter : (client : Client) => void) : Action => (
  modal("ADD_CLIENT", {
    cbAfter,
  })
);

export const modifyClientModal = ({ id, cbAfter } : {
  id: number,
  cbAfter? : (client : Client) => void,
}) : Action => (
  modal("MODIFY_CLIENT", {
    id: String(id),
    cbAfter,
  })
);

export const deleteClientModal = (id : number) : Action => (
  modal("DELETE_CLIENT", {
    id,
  })
);

export const askToSaveEmailModal = (payload : {|
  id : string,
  email : string
|}) : Action => (
  modal("ASK_TO_SAVE_CLIENT_EMAIL", payload)
);

// employees
export const addEmployeeModal = (payload : {
  month: string;
  year: string;
  cbAfter? : (employee : Employee) => void;
}) : Action => (
  modal("ADD_EMPLOYEE", payload)
);

export const modifyEmployeeModal = (payload : {
  id: number;
  year: string;
  month: string;
  cbAfter? : (employee : Employee) => void;
}) : Action => (
  modal("MODIFY_EMPLOYEE", payload)
);

export const deleteEmployeeModal = (id : number) : Action => (
  modal("DELETE_EMPLOYEE", {
    id,
  })
);

export const employeesAutocompleteConfirmationModal = (payload : {
  year : string;
  month : string;
}) : Action => (
  modal("EMPLOYEES_AUTOCOMPLETE_CONFIRMATION", payload)
);

export const clearEmployeesModal = (payload : {
  year : string;
  month : string;
}) : Action => (
  modal("EMPLOYEES_CLEAR_CONFIRMATION", payload)
);

export const periodEditorModal = (payload : {
  employeeID?: number;
  start: number;
  end: number;
  year: string;
  month: string;
  showEmployees: boolean;
  cbAfter? : (employee : Employee) => void;
}) : Action => (
  modal("EMPLOYEE_PERIOD_EDITOR", payload)
);

// delegates
export const listDelegatesModal = () : Action => (
  modal("LIST_DELEGATES")
);

export const addDelegateModal = (cbAfter? : (delegate : Delegate) => void) : Action => (
  modal("ADD_DELEGATE", {
    cbAfter,
  })
);

export const modifyDelegateModal = ({ id, cbAfter } : {
  id: number,
  cbAfter? : (delegate : Delegate) => void,
}) : Action => (
  modal("MODIFY_DELEGATE", {
    id,
    cbAfter,
  })
);

export const deleteDelegateModal = (id : number) : Action => (
  modal("DELETE_DELEGATE", {
    id,
  })
);

// serial
export const listSerialsModal = () : Action => (
  modal("LIST_SERIALS")
);

export const addSerialModal = (cbAfter? : (serial : Serial) => void) : Action => (
  modal("ADD_SERIAL", {
    cbAfter,
  })
);

export const modifySerialModal = ({ id, cbAfter } : {
  id: number,
  cbAfter? : (serial : Serial) => void,
}) : Action => (
  modal("MODIFY_SERIAL", {
    id,
    cbAfter,
  })
);

export const deleteSerialModal = (id : number) : Action => (
  modal("DELETE_SERIAL", {
    id,
  })
);

// cashing
export const addCashingModal = (cbAfter : (cashing : Cashing) => void, invoiceID: number) : Action => (
  modal("ADD_CASHING", {
    cbAfter,
    invoiceID,
  })
);

export const modifyCashingModal = ({ cbAfter, id, invoiceID } : {
  cbAfter? : (cashing : Cashing) => void,
  id: number,
  invoiceID: number,
}) : Action => (
  modal("MODIFY_CASHING", {
    id,
    cbAfter,
    invoiceID,
  })
);

export const deleteCashingModal = (id : number, invoiceID: number) : Action => (
  modal("DELETE_CASHING", {
    id,
    invoiceID,
  })
);

// invoice
export const deleteInvoiceModal = (id : number, cbAfter : (invoice : any) => void) : Action => (
  modal("DELETE_INVOICE", {
    id,
    cbAfter,
  })
);

export const toggleCancelInvoiceModal = (id : number, isCancelled : boolean) : Action => (
  modal("TOGGLE_CANCEL_INVOICE", {
    id,
    isCancelled,
  })
);

export const showEmailInvoiceModal = (id: number) : Action => (
  modal("EMAIL_INVOICE", {
    id,
  })
);

export const showInvoiceDocumentModal = (id: number) : Action => (
  modal("INVOICE_DOCUMENT", {
    id,
  })
);
