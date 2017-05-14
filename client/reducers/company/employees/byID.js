// @flow

import type { EmployeeByIDState, State, Action } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import { COMPANY_RESET_DATA } from "actions";

import { noError } from "utility";

const initialState = Immutable.Map();

const
  mergeWithEntries = (state : EmployeeByIDState, { payload }) => (
    state.mergeWith((previous, next) => {
      if (typeof previous === "undefined") {
        return next;
      }

      return previous;
    }, payload.entities)
  ),
  mergeEntries = (state : EmployeeByIDState, { payload }) => (
    state.merge(payload.entities)
  ),
  clearEmployees = (state : EmployeeByIDState, { payload : { year, month } }) => (
    state.filter((employee) => {
      const date = new Date(employee.get("Date")),
        dateMonth = date.getMonth(),
        dateYear = date.getFullYear(),
        sameYear = Number(year) === dateYear,
        sameMonth = Number(month) === dateMonth;

      return !(sameYear && sameMonth);
    })
  ),
  addEmployee = (state : EmployeeByIDState, { payload }) => (
    state.set(String(payload.get("ID")), payload)
  ),
  autocompleteEmployeePending = (state : EmployeeByIDState, { meta : { id } }) => {
    if (state.has(id)) {
      return state.update(id, (employeeState) => {
        if (typeof employeeState === "undefined") {
          return employeeState;
        }

        return employeeState.merge({
          isAutocompleting    : true,
          autocompletingError : noError,
        });
      });
    }

    return state;
  },
  autocompleteEmployeeRejected = (state : EmployeeByIDState, { meta, payload }) => {
    const
      { id } = meta,
      { error : autocompletingError } = payload;

    if (state.has(id)) {
      return state.update(id, (employeeState) => {
        if (typeof employeeState === "undefined") {
          return employeeState;
        }

        return employeeState.merge({
          isAutocompleting: false,
          autocompletingError,
        });
      });
    }

    return state;
  },
  autocompleteEmployeeFulFilled = (state : EmployeeByIDState, { meta, payload }) => (
    state.set(meta.id, Immutable.Map(payload.Employee))
  ),
  modifyEmployee = (state : EmployeeByIDState, { payload : { newEmployee } }) => (
    state.set(String(newEmployee.get("ID")), newEmployee)
  ),
  deleteEmployee = (state : EmployeeByIDState, { payload }) => (
    state.delete(String(payload.get("ID")))
  );

const byID = (state : EmployeeByIDState = initialState, action : Action) : State => {

  switch (action.type) {
    case "COMPANY_LOAD_EMPLOYEES_FULFILLED":
    case "COMPANY_FETCH_EMPLOYEES_FULFILLED":
      return mergeWithEntries(state, action);

    case "COMPANY_MULTIPLE_MODIFY_EMPLOYEES":
      return mergeEntries(state, action);

    case "COMPANY_CLEAR_EMPLOYEES":
      return clearEmployees(state, action);

    // only one employee

    case "COMPANY_ADD_EMPLOYEE":
      return addEmployee(state, action);

    case "COMPANY_AUTOCOMPLETE_EMPLOYEE_PENDING":
      return autocompleteEmployeePending(state, action);

    case "COMPANY_AUTOCOMPLETE_EMPLOYEE_REJECTED":
      return autocompleteEmployeeRejected(state, action);

    case "COMPANY_AUTOCOMPLETE_EMPLOYEE_FULFILLED":
      return autocompleteEmployeeFulFilled(state, action);

    case "COMPANY_MODIFY_EMPLOYEE":
      return modifyEmployee(state, action);

    case "COMPANY_DELETE_EMPLOYEE":
      return deleteEmployee(state, action);

    case COMPANY_RESET_DATA:
      return state.clear();

    default:
      return state;
  }
};

export const
  isAutocompletingEmployeeSelector = (state : State, id : string) => (
  state.companyEmployees.byID.getIn([id, "isAutocompleting"]) || false
),
  autocompletingEmployeeErrorSelector = (state : State, id : string) : string => (
  state.companyEmployees.byID.getIn([id, "autocompletingError"]) || noError
);

export const getIsAutocompletingEmployeesEmployee = createSelector(
  isAutocompletingEmployeeSelector,
  autocompletingEmployeeErrorSelector,
  (isAutocompleting, autocompletingError : string) => (
    isAutocompleting && autocompletingError === noError
  )
);

export const getHasEmployeeAutocompletingError = createSelector(
  autocompletingEmployeeErrorSelector,
  (autocompletingError) => autocompletingError !== noError
);

export default byID;
