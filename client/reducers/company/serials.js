// @flow

import type { Action, CompanySerialsState, State } from "types";

import { COMPANY_RESET_DATA } from "actions";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { noError } from "utility/others";

import { getCompanyIsFetched } from "./info";

const newInitialState = () : CompanySerialsState => ({
  error    : noError,
  fetched  : false,
  fetching : false,

  data: Immutable.Map(),
});

const
  fetchSerialsPending = (state : CompanySerialsState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchSerialsRejected = (state : CompanySerialsState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchSerialsFulfilled = (state : CompanySerialsState, { payload }) => ({
    ...state,
    fetched  : true,
    fetching : false,

    data: payload.entities,
  }),
  setSerial = (state : CompanySerialsState, { payload }) => ({
    ...state,
    data: state.data.set(String(payload.get("ID")), payload),
  }),
  deleteSerial = (state : CompanySerialsState, { payload }) => ({
    ...state,
    data: state.data.delete(String(payload)),
  }),
  handleAddInvoice = (state : CompanySerialsState, { payload : { invoice, cashings } }) => {

    const
      currentCode = invoice.get("Serial"),
      { data } = state;

    return {
      ...state,
      data: data.update(
        data.findKey(
          (serial) => serial.get("Code") === currentCode
        ),
        (serial) => {
          if (typeof serial === "undefined") {
            return serial;
          }

          const
            currentCashing = serial.get("NrCashing"),
            NrInvoice = serial.get("NrInvoice") + 1,
            NrCashing = cashings.size === 0 ? currentCashing : currentCashing + 1;

          return serial.merge({
            NrInvoice,
            NrCashing,
          });
        }
      ),
    };
  },
  handleDeleteInvoice = (state : CompanySerialsState, { payload : { invoice, serial } }) => {
    const { data } = state;

    return {
      ...state,
      data: data.update(
        data.findKey(
          (current) => current.get("Code") === invoice.get("Serial")
        ),
        (serialState) => {
          if (typeof serialState === "undefined") {
            return serialState;
          }

          return serialState.merge({
            NrInvoice : serial.get("NrInvoice"),
            NrCashing : serial.get("NrCashing"),
          });
        }
      ),
    };
  },
  handleAddCashing = (state : CompanySerialsState, { payload }) => {
    const { data } = state;

    return {
      ...state,
      data: data.update(
        data.findKey(
          (serial) => serial.get("Code") === payload.get("Serial")
        ),
        (serial) => {
          if (typeof serial === "undefined") {
            return serial;
          }

          return (
            serial.set("NrCashing", serial.get("NrCashing") + 1)
          );
        }
      ),
    };
  },
  handleDeleteCashing = (state : CompanySerialsState, { payload }) => {
    const { data } = state;

    return {
      ...state,
      data: data.update(
        data.findKey(
          (serial) => serial.get("Code") === payload.get("Serial")
        ),
        (serial) => {
          if (typeof serial === "undefined") {
            return serial;
          }

          if (serial.get("NrCashing") - 1 === payload.get("Number")) {
            return (
              serial.set("NrCashing", serial.get("NrCashing") - 1)
            );
          }

          return serial;
        }
      ),
    };
  };

const reducer = (state : CompanySerialsState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "COMPANY_FETCH_SERIALS_PENDING":
      return fetchSerialsPending(state, action);

    case "COMPANY_FETCH_SERIALS_REJECTED":
      return fetchSerialsRejected(state, action);

    case "COMPANY_FETCH_SERIALS_FULFILLED":
      return fetchSerialsFulfilled(state, action);

    case "COMPANY_ADD_SERIAL":
    case "COMPANY_MODIFY_SERIAL":
      return setSerial(state, action);

    case "COMPANY_DELETE_SERIAL":
      return deleteSerial(state, action);

    case "COMPANY_ADD_INVOICE":
      return handleAddInvoice(state, action);

    case "COMPANY_DELETE_INVOICE":
      return handleDeleteInvoice(state, action);

    case "COMPANY_ADD_CASHING":
      return handleAddCashing(state, action);

    case "COMPANY_DELETE_CASHING":
      return handleDeleteCashing(state, action);


    case COMPANY_RESET_DATA:
      return newInitialState();

    default:
      return state;
  }
};

const
  getFetching = (state : State) => state.companySerials.fetching,
  getFetched = (state : State) => state.companySerials.fetched,
  getError = (state : State) => state.companySerials.error,
  getData = (state : State) => state.companySerials.data;

export const
  getSerials = createSelector(
    getData,
    (ids) => ids.toList()
  ),
  getSerial = (state : State, id : string) => (
    getData(state).get(id)
  );

export const getSerialsAreFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getSerialsAreFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getSerialsHaveError = createSelector(
  getError,
  (error) => error !== noError
);

export const getSerialsShouldFetch = createSelector(
  getCompanyIsFetched,
  getSerialsAreFetched,
  getSerialsAreFetching,
  (infoFetched, isFetched, isFetching) => (
    infoFetched && !isFetched && !isFetching
  )
);

export const getSerialsSorted = createSelector(
  getSerials,
  (list) => list.sortBy((serial) => serial.get("Code"))
);

export default reducer;
