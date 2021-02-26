import { SearchDispatch } from "./reducers";
import debounce from "lodash.debounce";
import { axiosInstance } from "./axios";

export const setSearchQuery = (query: string) => (dispatch: SearchDispatch) => {
  return dispatch({
    type: "SEARCH/SET_QUERY" as const,
    payload: { query },
  });
};

export const getSearchUrl = (query: string) =>
  `/api/search?term=${query.replace(" ", "+")}`;

const getSearchResults = debounce(
  (query: string) => {
    return axiosInstance.get(getSearchUrl(query));
  },
  1000,
  { leading: true, trailing: true }
);

export const fetchSearchResuls = (query: string) => (
  dispatch: SearchDispatch
) => {
  dispatch({
    type: "SEARCH/SET_LOADING" as const,
    payload: { loading: true },
  });

  return getSearchResults(query)
    ?.then((response) => {
      dispatch({
        type: "SEARCH/SET_SEARCH_RESULTS" as const,
        payload: { results: response.data.results },
      });
    })
    .catch((error) => {
      dispatch({
        type: "SEARCH/SET_ERROR" as const,
        payload: { message: error.message },
      });
    })
    .finally(() => {
      dispatch({
        type: "SEARCH/SET_LOADING" as const,
        payload: { loading: false },
      });
    });
};
