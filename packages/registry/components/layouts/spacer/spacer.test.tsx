import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Spacer } from ".";

describe("Spacer", () => {
  describe("aria", () => {
    it("is hidden from assistive technology", () => {
      const { container } = render(<Spacer />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("token sizes — vertical direction", () => {
    const cases = [
      { size: "xs" as const, expectedClass: "h-1" },
      { size: "sm" as const, expectedClass: "h-2" },
      { size: "md" as const, expectedClass: "h-4" },
      { size: "lg" as const, expectedClass: "h-6" },
      { size: "xl" as const, expectedClass: "h-8" },
    ];

    cases.forEach(({ size, expectedClass }) => {
      it(`size="${size}" applies ${expectedClass}`, () => {
        const { container } = render(<Spacer size={size} direction="vertical" />);
        expect(container.firstChild).toHaveClass(expectedClass);
      });
    });
  });

  describe("token sizes — horizontal direction", () => {
    it("horizontal direction applies h-0 alongside height class", () => {
      const { container } = render(<Spacer size="md" direction="horizontal" />);
      expect(container.firstChild).toHaveClass("h-0");
    });
  });

  describe("custom sizes", () => {
    it("applies inline height for custom string size (vertical)", () => {
      const { container } = render(<Spacer size={"48px" as any} direction="vertical" />);
      expect(container.firstChild).toHaveStyle({ height: "48px" });
      expect(container.firstChild).not.toHaveStyle({ width: "48px" });
    });

    it("applies inline width for custom string size (horizontal)", () => {
      const { container } = render(<Spacer size={"2rem" as any} direction="horizontal" />);
      expect(container.firstChild).toHaveStyle({ width: "2rem" });
      expect(container.firstChild).not.toHaveStyle({ height: "2rem" });
    });

    it("applies both dimensions for direction='both'", () => {
      const { container } = render(<Spacer size={"32px" as any} direction="both" />);
      expect(container.firstChild).toHaveStyle({ height: "32px", width: "32px" });
    });

    it("converts bare numeric string to px", () => {
      const { container } = render(<Spacer size={"16" as any} direction="vertical" />);
      expect(container.firstChild).toHaveStyle({ height: "16px" });
    });
  });

  describe("custom className", () => {
    it("merges custom className", () => {
      const { container } = render(<Spacer className="my-spacer" />);
      expect(container.firstChild).toHaveClass("my-spacer");
    });
  });

  describe("forwarded ref and props", () => {
    it("forwards extra HTML attributes", () => {
      render(<Spacer data-testid="spacer" />);
      expect(screen.getByTestId("spacer")).toBeInTheDocument();
    });

    it("forwards ref to the underlying div", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Spacer ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
