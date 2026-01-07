import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { LazyLoad } from "./index";

// Mock IntersectionObserver
let mockObserverInstance: any;

beforeEach(() => {
  class MockIntersectionObserver {
    private callback: IntersectionObserverCallback;

    root: Element | Document | null = null;
    rootMargin = "";
    thresholds: ReadonlyArray<number> = [];

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockObserverInstance = this; // Store the instance for use in tests
    }

    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn();

    // Simulate intersection
    simulateIntersect(entries: IntersectionObserverEntry[]) {
      this.callback(entries, this as unknown as IntersectionObserver);
    }
  }

  global.IntersectionObserver = MockIntersectionObserver;
});

describe("LazyLoad", () => {
  it("renders placeholder when content is not visible", () => {
    render(
      <LazyLoad placeholder={<div>Loading...</div>}>
        <div>Loaded Content</div>
      </LazyLoad>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Loaded Content")).not.toBeInTheDocument();
  });

  it("renders placeholder when `once` is false and content is not visible", () => {
    render(
      <LazyLoad once={false} placeholder={<div>Loading...</div>}>
        <div>Loaded Content</div>
      </LazyLoad>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Loaded Content")).not.toBeInTheDocument();
  });


  it("allows passing additional props", () => {
    render(
      <LazyLoad data-testid="lazyload" className="custom-class">
        <div>Loaded Content</div>
      </LazyLoad>
    );
    const el = screen.getByTestId("lazyload");
    expect(el).toHaveClass("custom-class");
  });
});