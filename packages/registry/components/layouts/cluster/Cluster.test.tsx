import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Cluster } from "../cluster";
import { describe, it, expect } from "vitest";

describe("<Cluster />", () => {
  it("renders children correctly", () => {
    render(
      <Cluster spacing="normal" align="center" justify="start" wrap>
        <span>Item 1</span>
        <span>Item 2</span>
      </Cluster>
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("applies spacing class based on prop", () => {
    const { container } = render(
      <Cluster spacing="large">
        <span>Item</span>
      </Cluster>
    );

    expect(container.firstChild).toHaveClass("gap-8");
  });

  it("applies alignment and justification classes", () => {
    const { container } = render(
      <Cluster spacing="small" align="center" justify="between">
        <span>One</span>
        <span>Two</span>
      </Cluster>
    );

    expect(container.firstChild).toHaveClass("items-center");
    expect(container.firstChild).toHaveClass("justify-between");
  });

  it("enables wrapping when wrap is true", () => {
    const { container } = render(
      <Cluster wrap>
        <span>Wrap 1</span>
        <span>Wrap 2</span>
      </Cluster>
    );

    expect(container.firstChild).toHaveClass("flex-wrap");
  });

  it("does not wrap when wrap is false", () => {
    const { container } = render(
      <Cluster wrap={false}>
        <span>Wrap Off</span>
      </Cluster>
    );

    expect(container.firstChild).toHaveClass("flex-nowrap");
  });
});
