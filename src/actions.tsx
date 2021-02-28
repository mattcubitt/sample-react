import { SearchDispatch } from "./reducers";
import { axiosInstance } from "./axios";

export const setSearchQuery = (query: string) => (dispatch: SearchDispatch) => {
  return dispatch({
    type: "SEARCH/SET_QUERY" as const,
    payload: { query },
  });
};

export const getSearchUrl = (query: string, pageNumber: number) =>
  `/api/search?term=${query.replace(" ", "+")}&limit=10&offset=${
    pageNumber * 10
  }`;

export const fetchSearchResults = (
  query: string,
  pageNumber: number = 0,
  append: boolean = false
) => async (dispatch: SearchDispatch) => {
  if (!query) {
    dispatch({
      type: "SEARCH/SET_SEARCH_RESULTS" as const,
      payload: { results: [] },
    });
  } else {
    dispatch({
      type: "SEARCH/SET_LOADING" as const,
      payload: { loading: true },
    });

    try {
      const response = await axiosInstance.get(getSearchUrl(query, pageNumber));

      if (append) {
        dispatch({
          type: "SEARCH/APPEND_SEARCH_RESULTS" as const,
          payload: { results: response.data.results },
        });
      } else {
        dispatch({
          type: "SEARCH/SET_SEARCH_RESULTS" as const,
          payload: { results: response.data.results },
        });
      }
    } catch (error) {
      dispatch({
        type: "SEARCH/SET_ERROR" as const,
        payload: { message: error.message },
      });
    } finally {
      dispatch({
        type: "SEARCH/SET_LOADING" as const,
        payload: { loading: false },
      });
    }
  }
};
