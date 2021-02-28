import { render, screen } from "@testing-library/react";
import React from "react";
import { AppWrapper } from "./App";
import AppBar from "./AppBar";
import { getSearchUrl } from "./actions";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { sampleResults } from "./fixtures";
import { axiosInstance } from "./axios";

jest.mock("./DelayMount", () => {
  const mockComponent: React.FC = ({ children }) => <div>{children}</div>;

  return {
    __esModule: true,
    default: mockComponent,
  };
});

const axiosMock = new MockAdapter(axiosInstance);

describe("<AppBar/>", () => {
  afterEach(() => {
    jest.resetAllMocks();
    axiosMock.reset();
  });

  it("should render", async () => {
    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: "",
            error: null,
            loading: false,
            pageNumber: 0,
          },
        }}
      >
        <AppBar />
      </AppWrapper>
    );

    const appBar = await screen.findByRole("navigation");

    expect(appBar).toBeInTheDocument();
  });

  it("should render query text", async () => {
    const expectedQuery = "some query";
    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: expectedQuery,
            error: null,
            loading: false,
            pageNumber: 0,
          },
        }}
      >
        <AppBar />
      </AppWrapper>
    );

    const search = await screen.findByLabelText("search");

    expect(search).toHaveValue(expectedQuery);
  });

  it("should render loading icon when loading is true", async () => {
    const expectedQuery = "some query";
    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: expectedQuery,
            error: null,
            loading: true,
            pageNumber: 0,
          },
        }}
      >
        <AppBar />
      </AppWrapper>
    );

    const loadingIcon = await screen.findByRole("progressbar");

    expect(loadingIcon).toBeInTheDocument();
  });

  it("should not render loading icon when loading is false", async () => {
    const expectedQuery = "some query";
    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: expectedQuery,
            error: null,
            loading: false,
            pageNumber: 0,
          },
        }}
      >
        <AppBar />
      </AppWrapper>
    );

    const loadingIcon = screen.queryByRole("progressbar");

    expect(loadingIcon).not.toBeInTheDocument();
  });

  it("should change search input when typing", async () => {
    const expectedQuery = "some query";
    const expectedResults = sampleResults.slice(0, 10);

    axiosMock
      .onGet(getSearchUrl(expectedQuery, 0))
      .replyOnce(200, { results: expectedResults });

    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: expectedQuery,
            error: null,
            loading: false,
            pageNumber: 0,
          },
        }}
      >
        <AppBar />
      </AppWrapper>
    );

    const input = await screen.findByLabelText("search");

    const expectedInput = "!";

    userEvent.type(input, expectedInput);

    expect(input).toHaveValue(expectedQuery + expectedInput);
  });
});
