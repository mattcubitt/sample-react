import { render, screen } from "@testing-library/react";
import React from "react";
import { AppWrapper } from "./App";
import { CardList } from "./CardList";
import { sampleResults } from "./fixtures";
import { SearchResult } from "./reducers";

describe("<CardList/>", () => {
  it("should render results when present", async () => {
    const expectedResults = sampleResults.slice(0, 10) as SearchResult[];

    render(
      <AppWrapper
        initialState={{
          search: {
            results: expectedResults,
            query: "",
            error: null,
            loading: false,
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
          },
        }}
      >
        <CardList />
      </AppWrapper>
    );

    const errorMessage = await screen.findByText(expectedError);

    expect(errorMessage).toHaveTextContent(expectedError);
  });
});
