import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

describe("App", () => {
  it("renders login screen when unauthenticated", () => {
    localStorage.clear();
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/sign in to your workspace/i)).toBeInTheDocument();
  });
});
