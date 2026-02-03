import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import { Container } from "./index";

describe("Container", () => {
  it("renders children correctly", () => {
    render(<Container>hello world</Container>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("applies size classes", () => {
    const { container } = render(<Container size="large">content</Container>);
    expect(container.firstChild).toHaveClass("max-w-3xl");
  });

  it("applies padding classes", () => {
    const { container } = render(<Container padding="xl">content</Container>);
    expect(container.firstChild).toHaveClass("p-8");
  });

  it("applies maxWidth predefined class", () => {
    const { container } = render(<Container maxWidth="sm">content</Container>);
    expect(container.firstChild).toHaveClass("max-w-sm");
  });

  it("applies custom maxWidth as inline style", () => {
    const { container } = render(
      <Container maxWidth="700px">content</Container>
    );
    expect(container.firstChild).toHaveStyle({ maxWidth: "700px" });
  });

  it("applies responsive padding when enabled", () => {
    const { container } = render(<Container responsive>content</Container>);
    expect(container.firstChild).toHaveClass("px-4", "sm:px-6", "lg:px-8");
  });

  it("centers container when center=true", () => {
    const { container } = render(<Container center>content</Container>);
    expect(container.firstChild).toHaveClass("mx-auto");
  });

  it("allows passing additional props", () => {
    render(
      <Container data-testid="custom" id="test-id">
        content
      </Container>
    );
    const el = screen.getByTestId("custom");
    expect(el).toHaveAttribute("id", "test-id");
  });
});
