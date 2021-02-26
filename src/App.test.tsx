import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

describe("<App/>", () => {
  it("should render App", async () => {
    render(<App />);

    await waitFor(() => screen.getByLabelText("search"));
  });
});
