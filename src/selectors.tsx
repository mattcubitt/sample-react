import { State } from "./reducers";

export const searchQuerySelector = (state: State) => {
  return state.search.query;
};

export const searchResultsSelector = (state: State) => {
  return state.search.results;
};

export const errorSelector = (state: State) => {
  return state.search.error;
};

export const loadingSelector = (state: State) => {
  return state.search.loading;
};

export const pageNumberSelector = (state: State) => {
  return state.search.pageNumber;
};
