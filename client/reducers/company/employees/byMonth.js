// @flow

import type { Action, EmployeeByMonthState, State } from "types";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { getCompanyIsFetched } from "../info";

import { COMPANY_RESET_DATA } from "actions";

import { noError } from "utility";

const initialState = Immutable.Map();

const setFetched = {
  fetched  : true,
  fetching : false,
};

const
  fetchEmployeesPending = (state : EmployeeByMonthState, currentAction) => {
    const { meta } = currentAction;

    const
      year = (meta) ? String(meta.year) : "",
      month = (meta) ? String(meta.month) : "",
      currentDate = `${year}/${month}`,
      setFetching = {
        errorFetching : noError,
        fetching      : true,

        errorLoading : noError,
        loaded       : false,
        loading      : false,
      };

    if (state.has(currentDate)) {
      return (
        state.update(currentDate, (employeeState) => (
          employeeState.merge(setFetching)
        )
      )
      );
    }

    return state.set(currentDate, Immutable.Map({
      ...setFetching,
      IDs: Immutable.List(),
    }));
  },
  fetchEmployeesRejected = (state : EmployeeByMonthState, currentAction) => {
    const { meta, payload } = currentAction,
      error = { payload },
      year = (meta) ? String(meta.year) : "",
      month = (meta) ? String(meta.month) : "",
      currentDate = `${year}/${month}`,
      setError = {
        errorFetching : error,
        fetching      : false,
        fetched       : false,
      };

    return (
    state.update(currentDate, (employeeState) => (
      employeeState.merge(setError)
    ))
    );
  },
  fetchEmployeesbyMonthFulfilled = (state : EmployeeByMonthState, currentAction) => {
    const
      { meta, payload } = currentAction,
      year = (meta) ? String(meta.year) : "",
      month = (meta) ? String(meta.month) : "",
      currentDate = `${year}/${month}`,
      newIDs = payload.result,
      oldState = state.get(currentDate),
      setError = {
        ...setFetched,
        errorFetching : noError,
        IDs           : oldState.get("IDs").concat(newIDs),
      };

    return (
    state.update(currentDate, (employeeState) => (
      employeeState.merge(setError)
    ))
    );
  },
  loadEmployeesbyMonthPending = (state : EmployeeByMonthState, currentAction) => {
    const
      { meta } = currentAction,
      month = (meta) ? String(meta.month) : "",
      year = (meta) ? String(meta.year) : "",
      currentDate = `${year}/${month}`,
      setLoading = {
        errorLoading : noError,
        loading      : true,
      };

    if (state.has(currentDate)) {
      return (
      state.update(currentDate, (employeeState) => (
        employeeState.merge(setLoading))
      )
      );
    }

    return state.set(currentDate, Immutable.Map({
      ...setLoading,
      IDs: Immutable.List(),
    }));
  },
  loadEmployeesRejected = (state : EmployeeByMonthState, currentAction) => {
    const
      { meta, payload } = currentAction,
      { error : errorLoading } = payload,
      year = (meta) ? String(meta.year) : "",
      month = (meta) ? String(meta.month) : "",
      currentDate = `${year}/${month}`,
      setError = {
        errorLoading,
        loading : false,
        loaded  : false,
      };

    return (
    state.update(currentDate, (employeeState) => (
      employeeState.merge(setError)
    ))
    );
  },
  loadEmployeesbyMonthFulfilled = (state : EmployeeByMonthState, currentAction) => {
    const { meta, payload } = currentAction,
      year = (meta) ? String(meta.year) : "",
      month = (meta) ? String(meta.month) : "",
      currentDate = `${year}/${month}`,
      newIDs = payload.result,
      oldState = state.get(currentDate),
      setLoaded = {
        ...setFetched,
        errorLoading : noError,
        loaded       : true,
        loading      : false,
        IDs          : oldState.get("IDs").concat(newIDs),
      };

    return (
    state.update(currentDate, (employeeState) => (
      employeeState.merge(setLoaded)
    ))
    );
  },
  addEmployee = (state : EmployeeByMonthState, currentAction) => {
    const
      { payload : employee } = currentAction,
      year = String(new Date(employee.get("Date")).getFullYear()),
      month = String(new Date(employee.get("Date")).getMonth()),
      currentDate = `${year}/${month}`,
      employeeState = state.get(currentDate);


    if (typeof employeeState === "undefined") {
      return state;
    }

    const hasProblems = (
        employeeState.get("errorFetching") !== noError
      );

    if (hasProblems) {
      return state;
    }

    const employeeID = String(employee.get("ID"));

    return state.update(currentDate, (currentState) => (
    currentState.merge({
      IDs: currentState.get("IDs").push(employeeID),
    })
  ));
  },
  clearEmployees = (state : EmployeeByMonthState, currentAction) => {
    const
      { payload : { year, month } } = currentAction,
      currentMonth = `${year}/${month}`,
      hasMonth = state.has(currentMonth);

    if (hasMonth) {
      return state.update(currentMonth, (monthState) => {
        if (monthState === "undefined") {
          return monthState;
        }

        return monthState.set("IDs", Immutable.List());
      });
    }

    return state;
  },
  deleteEmployee = (state : EmployeeByMonthState, currentAction) => {
    const
      { payload } = currentAction,
      employee = payload,
      year = String(new Date(employee.get("Date")).getFullYear()),
      month = String(new Date(employee.get("Date")).getMonth()),
      currentDate = `${year}/${month}`,
      employeeState = state.get(currentDate);

    if (typeof employeeState === "undefined") {
      return state;
    }

    const hasProblems = (
        employeeState.get("errorFetching") !== noError
      );

    if (hasProblems) {
      return state;
    }

    return state.update(currentDate, (currentState) => {
      const ids = currentState.get("IDs"),
        employeeID = String(employee.get("ID")),
        position = ids.indexOf(employeeID);

      return currentState.merge({
        IDs: ids.delete(position),
      });
    });
  };

const byMonth = (state : EmployeeByMonthState = initialState, action : Action) => {

  switch (action.type) {
    case "COMPANY_FETCH_EMPLOYEES_PENDING":
      return fetchEmployeesPending(state, action);

    case "COMPANY_FETCH_EMPLOYEES_REJECTED":
      return fetchEmployeesRejected(state, action);

    case "COMPANY_FETCH_EMPLOYEES_FULFILLED":
      return fetchEmployeesbyMonthFulfilled(state, action);

    case "COMPANY_LOAD_EMPLOYEES_PENDING":
      return loadEmployeesbyMonthPending(state, action);

    case "COMPANY_LOAD_EMPLOYEES_REJECTED":
      return loadEmployeesRejected(state, action);

    case "COMPANY_LOAD_EMPLOYEES_FULFILLED":
      return loadEmployeesbyMonthFulfilled(state, action);

    // only one employee

    case "COMPANY_ADD_EMPLOYEE":
      return addEmployee(state, action);

    case "COMPANY_CLEAR_EMPLOYEES":
      return clearEmployees(state, action);

    case "COMPANY_DELETE_EMPLOYEE":
      return deleteEmployee(state, action);

    case COMPANY_RESET_DATA:
      return state.clear();

    default:
      return state;
  }
};

export const
  fetchingEmployeeSelector = (state : State, year : string, month: string) => (
    state.companyEmployees.byMonth.getIn([`${year}/${month}`, "fetching"]) || false
  ),
  fetchedEmployeeSelector = (state : State, year : string, month: string) => (
    state.companyEmployees.byMonth.getIn([`${year}/${month}`, "fetched"]) || false
  ),
  errorFetchingEmployeeSelector = (state : State, year : string, month: string) : string => (
    state.companyEmployees.byMonth.getIn([`${year}/${month}`, "errorFetching"]) || noError
  ),
  loadingEmployeeSelector = (state : State, year : string, month: string) => (
    state.companyEmployees.byMonth.getIn([`${year}/${month}`, "loading"]) || false
  ),
  loadedEmployeeSelector = (state : State, year : string, month: string) => (
    state.companyEmployees.byMonth.getIn([`${year}/${month}`, "loaded"]) || false
  ),
  errorLoadingEmployeeSelector = (state : State, year : string, month: string) : string => (
    state.companyEmployees.byMonth.getIn([`${year}/${month}`, "errorLoading"]) || noError
  ),
  employeesIDsByMonthYearSelector = (state : State, year : string, month: string) => (
    state.companyEmployees.byMonth.getIn([`${year}/${month}`, "IDs"]) || Immutable.Map()
  ),
  employeesByIDSelector = (state : State) => state.companyEmployees.byID;

export const getIsFetchingEmployees = createSelector(
  fetchingEmployeeSelector,
  errorFetchingEmployeeSelector,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getHasFetchingErrorEmployeesByMonth = createSelector(
  errorFetchingEmployeeSelector,
  (error) => error !== noError
);

export const getShouldFetchEmployeesByMonth = createSelector(
  getCompanyIsFetched,
  getIsFetchingEmployees,
  fetchedEmployeeSelector,
  getHasFetchingErrorEmployeesByMonth,
  (infoFetched, isFetching, isFetched, hasError) => (
    infoFetched && !hasError && !isFetching && !isFetched
  )
);

export const getIsLoadingEmployees = createSelector(
  loadingEmployeeSelector,
  errorLoadingEmployeeSelector,
  (isLoading, errorLoading) => (
    isLoading && (errorLoading === noError)
  )
);

export const getErrorLoadingEmployees = createSelector(
  errorLoadingEmployeeSelector,
  (errorLoading) => (errorLoading !== noError)
);

export const getNumericIDS = createSelector(
  employeesIDsByMonthYearSelector,
  (IDs) => IDs.map((id : string) => (
    Number(id)
  ))
);

export const getShouldLoadEmployeesByMonth = createSelector(
  getIsLoadingEmployees,
  loadedEmployeeSelector,
  (isLoading, isLoaded) => (
    !isLoading && !isLoaded
  )
);

const getEmployeesbyMonth = createSelector(
  employeesIDsByMonthYearSelector,
  employeesByIDSelector,
  (IDsList, byIDMap) => (
    IDsList.map((id : number) => byIDMap.get(id))
  )
);

export const getEmployeesSortedByMonth = createSelector(
  getEmployeesbyMonth,
  (list) => (
    list.sortBy((employee) => employee.get("FullName"))
  )
);

export const getEmployee = (state : State, id : string) => (
  employeesByIDSelector(state).get(id)
);

export default byMonth;
