// @flow

import type { Action, CompanyArticlesState, State } from "types";

import { COMPANY_RESET_DATA } from "actions";

import * as Immutable from "immutable";
import { createSelector } from "reselect";
import memoize from "lodash.memoize";

import { getCompanyIsFetched } from "./info";

import { noError, normalizeDiacritics } from "utility";

const newInitialState = () => ({
  fetching : false,
  fetched  : false,
  error    : noError,

  data: Immutable.Map(),
});

const
  fetchArticlesPending = (state : CompanyArticlesState) => ({
    ...state,
    fetching : true,
    error    : noError,
  }),
  fetchArticlesRejected = (state : CompanyArticlesState, { payload : { error } }) => ({
    ...state,
    fetching: false,
    error,
  }),
  fetchArticlesFulfilled = (state : CompanyArticlesState, { payload }) => ({
    ...state,
    fetching : false,
    fetched  : true,

    data: payload.entities,
  }),
  setArticle = (state : CompanyArticlesState, { payload }) => ({
    ...state,
    data: state.data.set(String(payload.get("ID")), payload),
  }),
  deleteArticle = (state : CompanyArticlesState, { payload }) => ({
    ...state,
    data: state.data.delete(String(payload)),
  });

const reducer = (state : CompanyArticlesState = newInitialState(), action : Action) => {
  switch (action.type) {
    case "COMPANY_FETCH_ARTICLES_PENDING":
      return fetchArticlesPending(state);

    case "COMPANY_FETCH_ARTICLES_REJECTED":
      return fetchArticlesRejected(state, action);

    case "COMPANY_FETCH_ARTICLES_FULFILLED":
      return fetchArticlesFulfilled(state, action);

    case "COMPANY_ADD_ARTICLE":
    case "COMPANY_MODIFY_ARTICLE":
      return setArticle(state, action);

    case "COMPANY_DELETE_ARTICLE":
      return deleteArticle(state, action);

    case COMPANY_RESET_DATA:
      return newInitialState();

    default:
      return state;
  }
};

const
  getFetching = (state : State) => state.companyArticles.fetching,
  getFetched = (state : State) => state.companyArticles.fetched,
  getError = (state : State) => state.companyArticles.error,
  getData = (state : State) => state.companyArticles.data;

export const
  getArticles = createSelector(
    getData,
    (ids) => ids.toList()
  ),
  getArticle = (state : State, id : string) => (
    getData(state).get(id)
  );

export const getArticlesAreFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getArticlesAreFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getArticlesHaveError = createSelector(
  getError,
  (error) => (error !== noError)
);

export const getArticlesShouldFetch = createSelector(
  getCompanyIsFetched,
  getArticlesAreFetched,
  getArticlesAreFetching,
  (infoFetched, isFetched, isFetching) => (
    infoFetched && !isFetched && !isFetching
  )
);

export const getArticlesSorted = createSelector(
  getArticles,
  (list) => list.sortBy((article) => article.get("Name"))
);

export const getArticlesFilteredByName = createSelector(
  getArticlesSorted,
  (list) => memoize(
    (keyword : string) => list.filter((article) => {
      const
        normalizedSearch = normalizeDiacritics(keyword).toLowerCase(),
        normalizedName = (
          normalizeDiacritics(
            article.
            get("Name").
            toLowerCase()
          )
        );

      return normalizedName.includes(String(normalizedSearch));
    })
  )
);

export default reducer;
