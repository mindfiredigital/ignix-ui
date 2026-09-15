import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AnimatedBarChart } from "./index";
import React from "react";

// Mock ResizeObserver
const noop = vi.fn();
globalThis.ResizeObserver = class ResizeObserver {
  observe = noop;
  unobserve = noop;
  disconnect = noop;
};

// Mock Framer Motion
vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: (
        _target: unknown,
        tag: string
      ): React.ForwardRefExoticComponent<
        React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
      > =>
        React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
          ({ children, ...rest }, ref) =>
            React.createElement(tag, { ...rest, ref }, children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }): React.ReactElement => (
      <>{children}</>
    ),
    useInView: (): boolean => true,
  };
});

const mockData = [
  { label: "Chrome", value: 65, color: "#6366f1" },
  { label: "Safari", value: 20, color: "#ec4899" },
  { label: "Firefox", value: 10, color: "#10b981" },
];

describe("AnimatedBarChart rendering", () => {
  it("renders chart title and subtitle correctly", () => {
    render(
      <AnimatedBarChart
        data={mockData}
        title="Browser Usage"
        subtitle="Desktop share Q1"
      />
    );

    expect(screen.getByText("Browser Usage")).toBeInTheDocument();
    expect(screen.getByText("Desktop share Q1")).toBeInTheDocument();
  });

  it("renders category labels correctly", () => {
    render(<AnimatedBarChart data={mockData} showXLabels={true} />);
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Safari")).toBeInTheDocument();
    expect(screen.getByText("Firefox")).toBeInTheDocument();
  });

  it("renders values on top of bars when showValues is true", () => {
    render(<AnimatedBarChart data={mockData} showValues={true} />);
    expect(screen.getByText("65")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders the SVG container and bars", () => {
    const { container } = render(<AnimatedBarChart data={mockData} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    
    // Svg contains elements for bars
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(0);
  });
});
