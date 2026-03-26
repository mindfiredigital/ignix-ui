import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { Breakpoint } from "./index";

// Smart matchMedia mock (based on width)
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      const width = 500; // 👈 simulate mobile

      const minMatch = query.match(/\(min-width:\s*(\d+)px\)/);
      const maxMatch = query.match(/\(max-width:\s*(\d+)px\)/);

      const min = minMatch ? parseInt(minMatch[1], 10) : 0;
      const max = maxMatch ? parseInt(maxMatch[1], 10) : Infinity;

      let matches = width >= min && width <= max;

      if (query.includes("not")) {
        matches = !matches;
      }

      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    }),
  });
});

describe("Breakpoint Component", () => {
  it("renders children when `show` matches the current breakpoint", () => {
    render(
      <Breakpoint show="mobile">
        <p>Visible on mobile</p>
      </Breakpoint>
    );

    expect(screen.getByText("Visible on mobile")).toBeInTheDocument();
  });

  it("does not render children when `show` does not match the current breakpoint", () => {
    render(
      <Breakpoint show="desktop">
        <p>Visible on desktop</p>
      </Breakpoint>
    );

    expect(screen.queryByText("Visible on desktop")).not.toBeInTheDocument();
  });

  it("renders children when `hide` does not match the current breakpoint", () => {
    render(
      <Breakpoint hide="desktop">
        <p>Hidden on desktop</p>
      </Breakpoint>
    );

    expect(screen.getByText("Hidden on desktop")).toBeInTheDocument();
  });

  it("does not render children when `hide` matches the current breakpoint", () => {
    render(
      <Breakpoint hide="mobile">
        <p>Hidden on mobile</p>
      </Breakpoint>
    );

    expect(screen.queryByText("Hidden on mobile")).not.toBeInTheDocument();
  });

  it("renders children when `from` matches or exceeds the current breakpoint", () => {
    render(
      <Breakpoint from="mobile">
        <p>Visible from mobile</p>
      </Breakpoint>
    );

    expect(screen.getByText("Visible from mobile")).toBeInTheDocument();
  });

  it("does not render children when `from` does not match the current breakpoint", () => {
    render(
      <Breakpoint from="tablet">
        <p>Visible from tablet</p>
      </Breakpoint>
    );

    expect(screen.queryByText("Visible from tablet")).not.toBeInTheDocument();
  });

  it("renders children when `to` matches or is below the current breakpoint", () => {
    render(
      <Breakpoint to="mobile">
        <p>Visible up to mobile</p>
      </Breakpoint>
    );

    expect(screen.getByText("Visible up to mobile")).toBeInTheDocument();
  });

  it("renders children when `from` and `to` define a range that includes the current breakpoint", () => {
    render(
      <Breakpoint from="mobile" to="tablet">
        <p>Visible from mobile to tablet</p>
      </Breakpoint>
    );

    expect(screen.getByText("Visible from mobile to tablet")).toBeInTheDocument();
  });

  it("does not render children when `from` and `to` define a range that excludes the current breakpoint", () => {
    render(
      <Breakpoint from="tablet" to="desktop">
        <p>Visible from tablet to desktop</p>
      </Breakpoint>
    );

    expect(screen.queryByText("Visible from tablet to desktop")).not.toBeInTheDocument();
  });
});
