import { fetchSearchResuls, getSearchUrl } from "./actions";
import MockAdapter from "axios-mock-adapter";
import { axiosInstance } from "./axios";
import { sampleResults } from "./fixtures";

jest.mock("lodash.debounce", () => (fn: Function) => {
  return (...args: any[]) => fn(...args);
});

const axiosMock = new MockAdapter(axiosInstance);

describe("actions", () => {
  describe("fetchSearchResuls", () => {
    afterEach(() => {
      jest.resetAllMocks();
      axiosMock.reset();
    });

    it("should fetch search results", async () => {
      const mockDispatch = jest.fn();
      const expectedQuery = "some query";
      const expectedResults = sampleResults.slice(0, 10);

      axiosMock
        .onGet(getSearchUrl(expectedQuery))
        .replyOnce(200, { results: expectedResults });

      await fetchSearchResuls(expectedQuery)(mockDispatch);

      expect(mockDispatch.mock.calls).toHaveLength(3);
      expect(mockDispatch).toBeCalledWith({
        type: "SEARCH/SET_LOADING" as const,
        payload: { loading: true },
      });

      expect(mockDispatch).toBeCalledWith({
        type: "SEARCH/SET_SEARCH_RESULTS" as const,
        payload: { results: expectedResults },
      });

      expect(mockDispatch).toBeCalledWith({
        type: "SEARCH/SET_LOADING" as const,
        payload: { loading: false },
      });
    });

    it("should dispatch error when api call fails", async () => {
      const mockDispatch = jest.fn();
      const expectedQuery = "some query";

      axiosMock
        .onGet(getSearchUrl(expectedQuery))
        .replyOnce(500, { results: [] });

      await fetchSearchResuls(expectedQuery)(mockDispatch);

      expect(mockDispatch.mock.calls).toHaveLength(3);
      expect(mockDispatch).toBeCalledWith({
        type: "SEARCH/SET_LOADING" as const,
        payload: { loading: true },
      });

      expect(mockDispatch).toBeCalledWith({
        type: "SEARCH/SET_ERROR" as const,
        payload: { message: "Request failed with status code 500" },
      });

      expect(mockDispatch).toBeCalledWith({
        type: "SEARCH/SET_LOADING" as const,
        payload: { loading: false },
      });
    });
  });
});
