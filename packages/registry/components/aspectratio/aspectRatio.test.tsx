import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { AspectRatio } from "./index";

describe("AspectRatio", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("applies aspect-ratio style when supported", () => {
    // Mock CSS.supports to return true
    vi.stubGlobal("CSS", {
      supports: () => true,
    });

    const { container } = render(<AspectRatio ratio="16:9">content</AspectRatio>);
    expect(container.firstChild).toHaveStyle({
      aspectRatio: "16 / 9",
    });
  });

  it("applies padding-bottom fallback when aspect-ratio not supported", () => {
    // Mock CSS.supports to return false
    vi.stubGlobal("CSS", {
      supports: () => false,
    });

    const { container } = render(<AspectRatio ratio="4:3">content</AspectRatio>);
    expect(container.firstChild).toHaveStyle({
      paddingBottom: "75%",
      position: "relative",
    });
  });

  it("applies custom maxWidth correctly", () => {
    const { container } = render(
      <AspectRatio ratio="1:1" maxWidth="500px">
        content
      </AspectRatio>
    );
    expect(container.firstChild).toHaveStyle({
      maxWidth: "500px",
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <AspectRatio ratio="1:1" className="custom-class">
        content
      </AspectRatio>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards extra props", () => {
    render(
      <AspectRatio data-testid="aspect" id="test-id">
        content
      </AspectRatio>
    );
    const el = screen.getByTestId("aspect");
    expect(el).toHaveAttribute("id", "test-id");
  });
});
