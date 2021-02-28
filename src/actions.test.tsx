import { fetchSearchResults, getSearchUrl } from "./actions";
import MockAdapter from "axios-mock-adapter";
import { axiosInstance } from "./axios";
import { sampleResults } from "./fixtures";

const axiosMock = new MockAdapter(axiosInstance);

describe("actions", () => {
  describe("fetchSearchResults", () => {
    afterEach(() => {
      jest.resetAllMocks();
      axiosMock.reset();
    });

    it("should fetch search results", async () => {
      const mockDispatch = jest.fn();
      const expectedQuery = "some query";
      const expectedResults = sampleResults.slice(0, 10);

      axiosMock
        .onGet(getSearchUrl(expectedQuery, 0))
        .replyOnce(200, { results: expectedResults });

      await fetchSearchResults(expectedQuery, 0)(mockDispatch);

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
        .onGet(getSearchUrl(expectedQuery, 0))
        .replyOnce(500, { results: [] });

      await fetchSearchResults(expectedQuery, 0)(mockDispatch);

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
