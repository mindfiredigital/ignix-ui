import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { Breakpoint } from "./index";

// Mock the `window.matchMedia` API
// Mock the `window.matchMedia` API
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      const queries = {
        "(min-width: 0px) and (max-width: 1023px)": true, // Matches `from="mobile"` to `to="tablet"`
        "(max-width: 767px)": true, // Matches `show="mobile"`
        "(min-width: 768px) and (max-width: 1023px)": false, // Matches `show="tablet"`
        "(min-width: 1024px)": false, // Matches `show="desktop"`
      };

      return {
        matches: queries[query as keyof typeof queries] || false,
        media: query,
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

  it("does not render children when `to` does not match the current breakpoint", () => {
    render(
      <Breakpoint to="tablet">
        <p>Visible up to tablet</p>
      </Breakpoint>
    );

    expect(screen.queryByText("Visible up to tablet")).not.toBeInTheDocument();
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