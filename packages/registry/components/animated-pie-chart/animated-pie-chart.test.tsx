import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AnimatedPieChart } from "./index";
import React from "react";

// Mock Framer Motion
vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        React.forwardRef(({ children, ...rest }: any, ref) =>
          React.createElement(tag, { ...rest, ref }, children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    useInView: () => true,
  };
});

const mockData = [
  { label: "Design", value: 40, color: "#6366f1" },
  { label: "Engineering", value: 35, color: "#ec4899" },
  { label: "Marketing", value: 25, color: "#10b981" },
];

describe("AnimatedPieChart rendering", () => {
  it("renders chart title and subtitle correctly", () => {
    render(
      <AnimatedPieChart
        data={mockData}
        title="Department Costs"
        subtitle="Yearly overhead breakdown"
      />
    );

    expect(screen.getByText("Department Costs")).toBeInTheDocument();
    expect(screen.getByText("Yearly overhead breakdown")).toBeInTheDocument();
  });

  it("renders side legend items correctly when showLegend is true", () => {
    render(<AnimatedPieChart data={mockData} showLegend={true} />);
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
  });

  it("renders percentages on slices when showPercentages is true", () => {
    render(<AnimatedPieChart data={mockData} showPercentages={true} />);
    // Slices calculate percentages formatted with 1-decimal place: 40.0%, 35.0%, 25.0%
    expect(screen.getAllByText(/40(\.0)?%/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/35(\.0)?%/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/25(\.0)?%/).length).toBeGreaterThan(0);
  });

  it("renders center labels when donutRatio is enabled", () => {
    render(
      <AnimatedPieChart
        data={mockData}
        donutRatio={0.6}
        centerLabel="100%"
        centerSubLabel="Capacity"
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Capacity")).toBeInTheDocument();
  });
});
