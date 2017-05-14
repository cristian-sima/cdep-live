/* eslint-disable no-console, max-lines */

import type {
  Article,
  Permission,
  Client,
  Employee,
  Delegate,
  Serial,
  Cashing,
  Invoice,
} from "types";

import {
  // article
  listArticlesModal,
  addArticleModal,
  modifyArticleModal,
  deleteArticleModal,

  // permission
  addPermissionModal,
  deletePermissionModal,
  showAddPermissionNoticeModal,

  // client
  addClientModal,
  modifyClientModal,
  deleteClientModal,
  askToSaveEmailModal,

  // employee
  addEmployeeModal,
  modifyEmployeeModal,
  deleteEmployeeModal,
  employeesAutocompleteConfirmationModal,
  clearEmployeesModal,
  periodEditorModal,

  // delegate
  listDelegatesModal,
  addDelegateModal,
  modifyDelegateModal,
  deleteDelegateModal,

  // serial
  listSerialsModal,
  addSerialModal,
  modifySerialModal,
  deleteSerialModal,

  // cashing
  addCashingModal,
  modifyCashingModal,
  deleteCashingModal,

  // invoice
  deleteInvoiceModal,
  toggleCancelInvoiceModal,
  showEmailInvoiceModal,
  showInvoiceDocumentModal,
} from "./company";

describe("modal/company actions", () => {

  it("should create an action to show [list articles] modal", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType: "LIST_ARTICLES",
      },
    };

    expect(listArticlesModal()).toEqual(expectedAction);
  });

  it("should create an action to show [add article] modal with a callback", () => {
    const
      cbAfter = (article : Article) => {
        console.log("article", article);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_ARTICLE",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addArticleModal(cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [add article] modal without a callback", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType  : "ADD_ARTICLE",
        modalProps : {},
      },
    };

    expect(addArticleModal()).toEqual(expectedAction);
  });


  it("should create an action to show [modify article] modal without a callback", () => {
    const
      id = 12,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_ARTICLE",
          modalProps : {
            id,
          },
        },
      };

    expect(modifyArticleModal({ id })).toEqual(expectedAction);
  });

  it("should create an action to show [modify article] modal and it has a callback", () => {
    const
      id = 96,
      cbAfter = (article : Article) => {
        console.log("article", article);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_ARTICLE",
          modalProps : {
            id,
            cbAfter,
          },
        },
      };

    expect(modifyArticleModal({
      id,
      cbAfter,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete article] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_ARTICLE",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteArticleModal(id)).toEqual(expectedAction);
  });

  // permission

  it("should create an action to show [add permission] modal with a callback", () => {
    const
      cbAfter = (permission : Permission) => {
        console.log("permission", permission);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_PERMISSION",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addPermissionModal(cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [add permission] modal without a callback", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType  : "ADD_PERMISSION",
        modalProps : { },
      },
    };

    expect(addPermissionModal()).toEqual(expectedAction);
  });

  it("should create an action to show [delete permission] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_PERMISSION",
          modalProps : {
            id,
          },
        },
      };

    expect(deletePermissionModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [permission notice] modal", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType: "PERMISSION_NOTICE",
      },
    };

    expect(showAddPermissionNoticeModal()).toEqual(expectedAction);
  });

  // client

  it("should create an action to show [add client] modal with a callback", () => {
    const
      cbAfter = (client : Client) => {
        console.log("client", client);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_CLIENT",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addClientModal(cbAfter)).toEqual(expectedAction);
  });


  it("should create an action to show [modify client] modal without a callback", () => {
    const
      id = 12,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_CLIENT",
          modalProps : {
            id: String(id),
          },
        },
      };

    expect(modifyClientModal({ id })).toEqual(expectedAction);
  });

  it("should create an action to show [modify client] modal and it has a callback", () => {
    const
      id = 96,
      cbAfter = (client : Client) => {
        console.log("client", client);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_CLIENT",
          modalProps : {
            id: String(id),
            cbAfter,
          },
        },
      };

    expect(modifyClientModal({
      id,
      cbAfter,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete client] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_CLIENT",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteClientModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [confirmation to save the email for client] modal", () => {
    const
      id = 85,
      email = "valid@email.ro",
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ASK_TO_SAVE_CLIENT_EMAIL",
          modalProps : {
            id,
            email,
          },
        },
      };

    expect(askToSaveEmailModal({
      id,
      email,
    })).toEqual(expectedAction);
  });

  // employees

  it("should create an action to show [add employee] modal with a callback", () => {
    const
      currentMonth = "8",
      currentYear = "2016",
      cbAfter = (employee : Employee) => {
        console.log("employee", employee);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_EMPLOYEE",
          modalProps : {
            cbAfter,
            currentMonth,
            currentYear,
          },
        },
      };

    expect(addEmployeeModal({
      cbAfter,
      currentMonth,
      currentYear,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [add employee] modal without a callback", () => {
    const
      currentMonth = "8",
      currentYear = "2016",
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_EMPLOYEE",
          modalProps : {
            currentMonth,
            currentYear,
          },
        },
      };

    expect(addEmployeeModal({
      currentYear,
      currentMonth,
    })).toEqual(expectedAction);
  });


  it("should create an action to show [modify employee] modal without a callback", () => {
    const
      id = 12,
      currentMonth = "3",
      currentYear = "2012",
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_EMPLOYEE",
          modalProps : {
            id,
            currentMonth,
            currentYear,
          },
        },
      };

    expect(modifyEmployeeModal({
      id,
      currentMonth,
      currentYear,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [modify employee] modal and it has a callback", () => {
    const
      id = 96,
      currentMonth = "3",
      currentYear = "2012",
      cbAfter = (employee : Employee) => {
        console.log("employee", employee);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_EMPLOYEE",
          modalProps : {
            id,
            cbAfter,
            currentMonth,
            currentYear,
          },
        },
      };

    expect(modifyEmployeeModal({
      id,
      cbAfter,
      currentMonth,
      currentYear,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete employee] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_EMPLOYEE",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteEmployeeModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [autocomple confirmation for all employees] modal", () => {
    const
      year = "2019",
      month = "9",
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "EMPLOYEES_AUTOCOMPLETE_CONFIRMATION",
          modalProps : {
            year,
            month,
          },
        },
      };

    expect(employeesAutocompleteConfirmationModal({
      year,
      month,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [autocomple confirmation for all employees] modal", () => {
    const
      year = "2009",
      month = "1",
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "EMPLOYEES_CLEAR_CONFIRMATION",
          modalProps : {
            year,
            month,
          },
        },
      };

    expect(clearEmployeesModal({
      year,
      month,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [period editor] modal", () => {
    const
      employeeID = 1,
      start = 1,
      end = 2,
      year = "2011",
      month = "10",
      showEmployees = false,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "EMPLOYEE_PERIOD_EDITOR",
          modalProps : {
            employeeID,
            start,
            end,
            year,
            month,
            showEmployees,
          },
        },
      };

    expect(periodEditorModal({
      employeeID,
      start,
      end,
      year,
      month,
      showEmployees,
    })).toEqual(expectedAction);
  });

  // delegate

  it("should create an action to show [list delegates] modal", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType: "LIST_DELEGATES",
      },
    };

    expect(listDelegatesModal()).toEqual(expectedAction);
  });

  it("should create an action to show [add delegate] modal with a callback", () => {
    const
      cbAfter = (delegate : Delegate) => {
        console.log("delegate", delegate);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_DELEGATE",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addDelegateModal(cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [add delegate] modal without a callback", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType  : "ADD_DELEGATE",
        modalProps : { },
      },
    };

    expect(addDelegateModal()).toEqual(expectedAction);
  });

  it("should create an action to show [modify delegate] modal without a callback", () => {
    const
      id = 12,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_DELEGATE",
          modalProps : {
            id,
          },
        },
      };

    expect(modifyDelegateModal({ id })).toEqual(expectedAction);
  });

  it("should create an action to show [modify delegate] modal and it has a callback", () => {
    const
      id = 96,
      cbAfter = (delegate : Delegate) => {
        console.log("delegate", delegate);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_DELEGATE",
          modalProps : {
            id,
            cbAfter,
          },
        },
      };

    expect(modifyDelegateModal({
      id,
      cbAfter,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete delegate] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_DELEGATE",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteDelegateModal(id)).toEqual(expectedAction);
  });

  // serial

  it("should create an action to show [list serials] modal", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType: "LIST_SERIALS",
      },
    };

    expect(listSerialsModal()).toEqual(expectedAction);
  });

  it("should create an action to show [add serial] modal with a callback", () => {
    const
      cbAfter = (serial : Serial) => {
        console.log("serial", serial);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_SERIAL",
          modalProps : {
            cbAfter,
          },
        },
      };

    expect(addSerialModal(cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [add serial] modal without a callback", () => {
    const
    expectedAction = {
      type    : "SHOW_MODAL",
      payload : {
        modalType  : "ADD_SERIAL",
        modalProps : { },
      },
    };

    expect(addSerialModal()).toEqual(expectedAction);
  });

  it("should create an action to show [modify serial] modal without a callback", () => {
    const
      id = 12,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_SERIAL",
          modalProps : {
            id,
          },
        },
      };

    expect(modifySerialModal({ id })).toEqual(expectedAction);
  });

  it("should create an action to show [modify serial] modal and it has a callback", () => {
    const
      id = 96,
      cbAfter = (serial : Serial) => {
        console.log("serial", serial);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_SERIAL",
          modalProps : {
            id,
            cbAfter,
          },
        },
      };

    expect(modifySerialModal({
      id,
      cbAfter,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete serial] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_SERIAL",
          modalProps : {
            id,
          },
        },
      };

    expect(deleteSerialModal(id)).toEqual(expectedAction);
  });

  // cashing

  it("should create an action to show [add cashing] modal with a callback", () => {
    const
      invoiceID = 7,
      cbAfter = (cashing : Cashing) => {
        console.log("cashing", cashing);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "ADD_CASHING",
          modalProps : {
            cbAfter,
            invoiceID,
          },
        },
      };

    expect(addCashingModal(cbAfter, invoiceID)).toEqual(expectedAction);
  });

  it("should create an action to show [modify cashing] modal without a callback", () => {
    const
      id = 12,
      invoiceID = 7,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_CASHING",
          modalProps : {
            id,
            invoiceID,
          },
        },
      };

    expect(modifyCashingModal({
      id,
      invoiceID,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [modify cashing] modal and it has a callback", () => {
    const
      id = 96,
      invoiceID = 6,
      cbAfter = (cashing : Cashing) => {
        console.log("cashing", cashing);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "MODIFY_CASHING",
          modalProps : {
            id,
            cbAfter,
            invoiceID,
          },
        },
      };

    expect(modifyCashingModal({
      id,
      cbAfter,
      invoiceID,
    })).toEqual(expectedAction);
  });

  it("should create an action to show [delete cashing] modal", () => {
    const
      id = 85,
      invoiceID = 5,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_CASHING",
          modalProps : {
            id,
            invoiceID,
          },
        },
      };

    expect(deleteCashingModal(id, invoiceID)).toEqual(expectedAction);
  });

  // invoice

  it("should create an action to show [delete invoice] modal", () => {
    const
      id = 85,
      cbAfter = (invoice : Invoice) => {
        console.log("invoice", invoice);
      },
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "DELETE_INVOICE",
          modalProps : {
            id,
            cbAfter,
          },
        },
      };

    expect(deleteInvoiceModal(id, cbAfter)).toEqual(expectedAction);
  });

  it("should create an action to show [toggle cancel invoice] modal", () => {
    const
      id = 85,
      isCancelled = true,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "TOGGLE_CANCEL_INVOICE",
          modalProps : {
            id,
            isCancelled,
          },
        },
      };

    expect(toggleCancelInvoiceModal(id, isCancelled)).toEqual(expectedAction);
  });

  it("should create an action to show [email invoice] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "EMAIL_INVOICE",
          modalProps : {
            id,
          },
        },
      };

    expect(showEmailInvoiceModal(id)).toEqual(expectedAction);
  });

  it("should create an action to show [show invoice document] modal", () => {
    const
      id = 85,
      expectedAction = {
        type    : "SHOW_MODAL",
        payload : {
          modalType  : "INVOICE_DOCUMENT",
          modalProps : {
            id,
          },
        },
      };

    expect(showInvoiceDocumentModal(id)).toEqual(expectedAction);
  });
});
