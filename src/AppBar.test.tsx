import { render, screen } from "@testing-library/react";
import React from "react";
import { AppWrapper } from "./App";
import AppBar from "./AppBar";

describe("<AppBar/>", () => {
  it("should render", async () => {
    render(
      <AppWrapper
        initialState={{
          search: {
            results: [],
            query: "",
            error: null,
            loading: false,
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
          },
        }}
      >
        <AppBar />
      </AppWrapper>
    );

    const loadingIcon = screen.queryByRole("progressbar");

    expect(loadingIcon).not.toBeInTheDocument();
  });
});
