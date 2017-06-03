// @flow

export type CompanyInfoState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  company: any;
  toggleModuleIsFetching: boolean;
  toggleModuleError: string;
};

// --- articles

export type CompanyArticlesState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  data: any;
};

export type CompanyPermissionsState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  data: any;
};


export type CompanyClientsState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  data: any;
};

// --- cashings

export type CompanyCashingsState = any;

// --- delegates

export type CompanyDelegatesState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  data: any;
};

// --- invoices

export type InvoiceByIDState = any;

export type InvoicesByClientState = any;

export type InvoiceAllState = {
  error: any,
  fetched: boolean;
  fetching: boolean;
  IDs: any;
  lastFetchedInvoiceNumber: number;
  total: number;
};

export type CompanyInvoicesState = {
  byID: InvoiceByIDState;
  byClient: InvoicesByClientState;
  all: InvoiceAllState;
};

// --- invoiceItems

export type CompanyInvoiceItemsState = any;


// --- employees

export type EmployeeByIDState = any;

export type EmployeeByMonthState = any;

export type CompanyEmployeesState = {
  byID: EmployeeByIDState;
  byMonth: EmployeeByMonthState;
};

// --- serials

export type CompanySerialsState = {
  error: any,
  fetched: boolean;
  fetching: boolean;

  data: any;
};

export type CompanyState = {
  companyArticles: CompanyArticlesState;
  companyCashings: CompanyCashingsState;
  companyClients: CompanyClientsState;
  companyDelegates: CompanyDelegatesState;
  companyEmployees: CompanyEmployeesState;
  companyInfo: CompanyInfoState;
  companyInvoiceItems: CompanyInvoiceItemsState;
  companyInvoices: CompanyInvoicesState;
  companyPermissions: CompanyPermissionsState;
  companySerials: CompanySerialsState;
}
