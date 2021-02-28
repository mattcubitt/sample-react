import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { getSearchUrl } from "./actions";
import { AppWrapper } from "./App";
import { axiosInstance } from "./axios";
import { CardList } from "./CardList";
import { sampleResults } from "./fixtures";
import { SearchResult } from "./reducers";
import { getIsScrollbarVisible, getIsScrollbarAtBottom } from "./utils";

const axiosMock = new MockAdapter(axiosInstance);

jest.mock("./utils");
jest.mock("./DelayMount", () => {
  const mockComponent: React.FC = ({ children }) => <div>{children}</div>;

  return {
    __esModule: true,
    default: mockComponent,
  };
});

describe("<CardList/>", () => {
  let orginalWindow: Window & typeof globalThis;
  let originalDocument: Document;

  beforeAll(() => {
    orginalWindow = global.window;
    originalDocument = global.document;
  });

  afterEach(() => {
    jest.resetAllMocks();
    axiosMock.reset();

    global.window = orginalWindow;
    global.document = originalDocument;
  });

  it("should render results when present", async () => {
    const expectedResults = sampleResults.slice(0, 10) as SearchResult[];

    render(
      <AppWrapper
        initialState={{
          search: {
            results: expectedResults,
            query: "some query",
            error: null,
            loading: false,
            pageNumber: 0,
          },
        }}
      >
        <CardList />
      </AppWrapper>
    );

    const listitems = await screen.findAllByRole("listitem");

    expect(listitems).toHaveLength(expectedResults.length);
  });

  it("should render error when present", async () => {
    const expectedError = "Some error message";

    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: "",
            error: expectedError,
            loading: false,
            pageNumber: 0,
          },
        }}
      >
        <CardList />
      </AppWrapper>
    );

    const errorMessage = await screen.findByText(expectedError);

    expect(errorMessage).toHaveTextContent(expectedError);
  });

  it("should load extra result if no scrollbar is present", async () => {
    const expectedResults1 = sampleResults.slice(0, 10) as SearchResult[];
    const expectedResults2 = sampleResults.slice(10, 20) as SearchResult[];
    const expectedQuery = "some query";

    (getIsScrollbarVisible as jest.Mock)
      .mockImplementationOnce(() => false)
      .mockImplementation(() => true);

    axiosMock
      .onGet(getSearchUrl(expectedQuery, 1))
      .reply(200, { results: expectedResults2 });

    render(
      <AppWrapper
        initialState={{
          search: {
            results: expectedResults1,
            query: expectedQuery,
            error: null,
            loading: false,
            pageNumber: 1,
          },
        }}
      >
        <CardList />
      </AppWrapper>
    );

    const listitems = await screen.findAllByRole("listitem");

    expect(listitems).toHaveLength(expectedResults1.length);

    // after fetch
    const listitems1 = await screen.findAllByRole("listitem");

    expect(listitems1).toHaveLength(
      expectedResults1.length + expectedResults2.length
    );
  });

  it("should load extra result if scrollbar is present and user scolls to bottom", async () => {
    const expectedResults1 = sampleResults.slice(0, 10) as SearchResult[];
    const expectedResults2 = sampleResults.slice(10, 20) as SearchResult[];
    const expectedQuery = "some query";

    (getIsScrollbarVisible as jest.Mock).mockImplementation(() => true);
    (getIsScrollbarAtBottom as jest.Mock)
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false);

    axiosMock
      .onGet(getSearchUrl(expectedQuery, 1))
      .reply(200, { results: expectedResults2 });

    render(
      <AppWrapper
        initialState={{
          search: {
            results: expectedResults1,
            query: expectedQuery,
            error: null,
            loading: false,
            pageNumber: 1,
          },
        }}
      >
        <CardList />
      </AppWrapper>
    );

    const listitems = await screen.findAllByRole("listitem");

    expect(listitems).toHaveLength(expectedResults1.length);

    fireEvent.scroll(window, {
      target: { scrollY: document.body.scrollHeight },
    });

    await waitFor(async () => {
      // after fetch
      const listitems1 = await screen.findAllByRole("listitem");

      expect(listitems1).toHaveLength(
        expectedResults1.length + expectedResults2.length
      );
    });
  });

  it("should render empty message query string returns no results", async () => {
    const expectedMessage1 = "No results for that search.";
    const expectedMessage2 = "Please try again.";

    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: "some query",
            error: null,
            loading: false,
            pageNumber: 0,
          },
        }}
      >
        <CardList />
      </AppWrapper>
    );

    const actualMessage1 = await screen.findByText(expectedMessage1);
    expect(actualMessage1).toHaveTextContent(expectedMessage1);

    const actualMessage2 = await screen.findByText(expectedMessage2);
    expect(actualMessage2).toHaveTextContent(expectedMessage2);
  });
});
