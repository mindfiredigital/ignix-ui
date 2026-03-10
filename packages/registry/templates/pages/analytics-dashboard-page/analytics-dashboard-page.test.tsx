/**
 * @file analytics-dashboard-page.test.tsx
 * @description Unit tests for the AnalyticsDashboardPage registry template and its
 * composable building blocks (layout, header, line chart, bar chart, pie chart).
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  AnalyticsDashboardPage,
  AnalyticsHeader,
  AnalyticsLineChart,
  AnalyticsBarChart,
  AnalyticsPieChart,
  type AnalyticsDateRange,
  type LineSeriesConfig,
  type TimeSeriesPoint,
  type AggregatedSeriesValue,
  type DistributionSlice,
  type LineSeriesId,
} from ".";

/* -------------------------------------------------------------------------- */
/*                                Mock Ignix UI                               */
/* -------------------------------------------------------------------------- */

vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@ignix-ui/card", () => {
  const Card = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  const CardHeader = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  const CardTitle = ({ children, ...props }: any) => <h2 {...props}>{children}</h2>;
  const CardDescription = ({ children, ...props }: any) => <p {...props}>{children}</p>;
  const CardContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  return { Card, CardHeader, CardTitle, CardDescription, CardContent };
});

vi.mock("@ignix-ui/date-picker", () => {
  /**
   * Minimal DatePicker mock that:
   * - Renders a button with the provided label.
   * - Calls `onChange` with a simple start/end range when clicked.
   */
  const DatePicker = ({ label, onChange }: any) => {
    const handleClick = () => {
      const range: AnalyticsDateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      };
      // Component under test normalizes this to its own internal shape.
      onChange?.(range);
    };

    return (
      <button type="button" onClick={handleClick}>
        {label ?? "Date range"}
      </button>
    );
  };

  return {
    __esModule: true,
    default: DatePicker,
  };
});

/* -------------------------------------------------------------------------- */
/*                                   Fixtures                                 */
/* -------------------------------------------------------------------------- */

const SERIES_CONFIG: LineSeriesConfig[] = [
  {
    id: "revenue",
    label: "Revenue",
    strokeClass: "stroke-emerald-400",
    dotClass: "fill-emerald-400",
    legendBgClass: "bg-emerald-500",
  },
  {
    id: "signups",
    label: "New Signups",
    strokeClass: "stroke-sky-400",
    dotClass: "fill-sky-400",
    legendBgClass: "bg-sky-500",
  },
];

const TIME_SERIES: TimeSeriesPoint[] = [
  {
    date: new Date("2024-02-01"),
    values: {
      revenue: 10000,
      signups: 120,
    },
  },
  {
    date: new Date("2024-02-02"),
    values: {
      revenue: 15000,
      signups: 140,
    },
  },
];

const BAR_AGGREGATES: AggregatedSeriesValue[] = [
  { id: "revenue", label: "Revenue", total: 25000 },
  { id: "signups", label: "New Signups", total: 260 },
];

const SLICES: DistributionSlice[] = BAR_AGGREGATES.map((agg) => ({
  id: agg.id,
  label: agg.label,
  value: agg.total,
}));

/* -------------------------------------------------------------------------- */
/*                                 Test Suite                                 */
/* -------------------------------------------------------------------------- */

describe("AnalyticsDashboardPage template", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header, summary cards, line, bar, and pie sections", () => {
    render(
      <AnalyticsDashboardPage
        timeSeries={TIME_SERIES}
        lineSeriesConfig={SERIES_CONFIG}
      />,
    );

    // Header
    expect(
      screen.getByRole("heading", { name: /analytics dashboard/i }),
    ).toBeInTheDocument();

    // Summary cards (derived from aggregates) - allow multiple matches
    expect(screen.getAllByText("Revenue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("New Signups").length).toBeGreaterThan(0);

    // Line, bar, and pie chart sections
    expect(
      screen.getByRole("heading", { name: /traffic & revenue trend/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /performance by key metric/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /distribution/i }),
    ).toBeInTheDocument();

    // Insights summary card content
    expect(
      screen.getByText(/insights summary/i),
    ).toBeInTheDocument();
  });

  it("invokes onDateRangeChange when DatePicker changes", async () => {
    const user = userEvent.setup();
    const handleDateRangeChange = vi.fn();

    render(
      <AnalyticsDashboardPage
        timeSeries={TIME_SERIES}
        lineSeriesConfig={SERIES_CONFIG}
        onDateRangeChange={handleDateRangeChange}
      />,
    );

    const dateButton = screen.getByRole("button", { name: /date range/i });
    await user.click(dateButton);

    expect(handleDateRangeChange).toHaveBeenCalledTimes(1);
    const arg = handleDateRangeChange.mock.calls[0][0] as AnalyticsDateRange;
    expect(arg).toHaveProperty("start");
    expect(arg).toHaveProperty("end");
  });

  it("invokes onExportCharts when export button is clicked", async () => {
    const user = userEvent.setup();
    const handleExport = vi.fn();

    render(
      <AnalyticsDashboardPage
        timeSeries={TIME_SERIES}
        lineSeriesConfig={SERIES_CONFIG}
        onExportCharts={handleExport}
      />,
    );

    const exportButton = screen.getByRole("button", { name: /export charts/i });
    await user.click(exportButton);

    expect(handleExport).toHaveBeenCalledTimes(1);
  });

  it("uses computed aggregates when barAggregates is not provided", () => {
    render(
      <AnalyticsDashboardPage
        timeSeries={TIME_SERIES}
        lineSeriesConfig={SERIES_CONFIG}
      />,
    );

    // Computed revenue total is 10000 + 15000 = 25000
    expect(
      screen.getByText("25,000"),
    ).toBeInTheDocument();
  });

  it("uses provided barAggregates and distributionSlices when passed", () => {
    render(
      <AnalyticsDashboardPage
        timeSeries={TIME_SERIES}
        lineSeriesConfig={SERIES_CONFIG}
        barAggregates={BAR_AGGREGATES}
        distributionSlices={SLICES}
      />,
    );

    // Summary cards come from provided aggregates labels (may appear in multiple sections)
    expect(screen.getAllByText("Revenue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("New Signups").length).toBeGreaterThan(0);

    // Distribution legend shows slice labels
    expect(screen.getAllByText("Revenue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("New Signups").length).toBeGreaterThan(0);
  });
});

describe("AnalyticsHeader", () => {
  it("renders default title and description", () => {
    render(<AnalyticsHeader />);

    expect(
      screen.getByRole("heading", { name: /analytics dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/visualize trends, segments, and performance/i),
    ).toBeInTheDocument();
  });

  it("calls onDateRangeChange when date range changes", async () => {
    const user = userEvent.setup();
    const handleDateRangeChange = vi.fn();

    render(
      <AnalyticsHeader
        onDateRangeChange={handleDateRangeChange}
      />,
    );

    const dateButton = screen.getByRole("button", { name: /date range/i });
    await user.click(dateButton);

    expect(handleDateRangeChange).toHaveBeenCalledTimes(1);
    const arg = handleDateRangeChange.mock.calls[0][0] as AnalyticsDateRange;
    expect(arg.start).toBeInstanceOf(Date);
    expect(arg.end).toBeInstanceOf(Date);
  });

  it("calls onExportCharts when export button is clicked", async () => {
    const user = userEvent.setup();
    const handleExport = vi.fn();

    render(
      <AnalyticsHeader onExportCharts={handleExport} />,
    );

    const exportButton = screen.getByRole("button", { name: /export charts/i });
    await user.click(exportButton);

    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});

describe("AnalyticsLineChart", () => {
  const activeSeries = new Set<LineSeriesId>(SERIES_CONFIG.map((s) => s.id));

  it("renders empty state when data array is empty", () => {
    render(
      <AnalyticsLineChart
        data={[]}
        seriesConfig={SERIES_CONFIG}
        activeSeries={activeSeries}
        onToggleSeries={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/no data in selected range/i),
    ).toBeInTheDocument();
  });

  it("renders point markers for each active series", () => {
    const { container } = render(
      <AnalyticsLineChart
        data={TIME_SERIES}
        seriesConfig={SERIES_CONFIG}
        activeSeries={activeSeries}
        onToggleSeries={vi.fn()}
      />,
    );

    const circles = container.querySelectorAll("circle");
    // We expect at least one marker per series across the time-series.
    expect(circles.length).toBeGreaterThanOrEqual(SERIES_CONFIG.length);
  });

  it("toggles legend items while ensuring at least one series stays active", async () => {
    const user = userEvent.setup();

    const Wrapper: React.FC = () => {
      const [active, setActive] = React.useState<Set<LineSeriesId>>(
        () => new Set<LineSeriesId>(SERIES_CONFIG.map((s) => s.id)),
      );

      const handleToggle = (id: LineSeriesId) => {
        setActive((prev) => {
          const next = new Set(prev);
          if (next.has(id) && next.size > 1) {
            next.delete(id);
          } else if (!next.has(id)) {
            next.add(id);
          }
          return next;
        });
      };

      return (
        <AnalyticsLineChart
          data={TIME_SERIES}
          seriesConfig={SERIES_CONFIG}
          activeSeries={active}
          onToggleSeries={handleToggle}
        />
      );
    };

    render(<Wrapper />);

    const revenueLegend = screen.getByRole("button", { name: /revenue/i });
    const signupsLegend = screen.getByRole("button", { name: /new signups/i });

    // Both series start as active
    expect(revenueLegend).toHaveAttribute("aria-pressed", "true");
    expect(signupsLegend).toHaveAttribute("aria-pressed", "true");

    // Toggling the first series turns it off
    await user.click(revenueLegend);
    expect(revenueLegend).toHaveAttribute("aria-pressed", "false");
    expect(signupsLegend).toHaveAttribute("aria-pressed", "true");

    // Attempting to toggle the last active series should keep it active
    await user.click(signupsLegend);
    expect(signupsLegend).toHaveAttribute("aria-pressed", "true");
  });
});

describe("AnalyticsBarChart", () => {
  it("renders empty state when aggregates is empty", () => {
    render(<AnalyticsBarChart aggregates={[]} />);

    expect(
      screen.getByText(/no data available for this range/i),
    ).toBeInTheDocument();
  });

  it("renders bar items when aggregates are provided", () => {
    render(<AnalyticsBarChart aggregates={BAR_AGGREGATES} />);

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("New Signups")).toBeInTheDocument();
  });
});

describe("AnalyticsPieChart", () => {
  it("renders empty state when slices is empty", () => {
    render(
      <AnalyticsPieChart
        slices={[]}
        seriesConfig={SERIES_CONFIG}
      />,
    );

    expect(
      screen.getByText(/no data available for this range/i),
    ).toBeInTheDocument();
  });

  it("renders distribution legend items when slices are provided", () => {
    render(
      <AnalyticsPieChart
        slices={SLICES}
        seriesConfig={SERIES_CONFIG}
      />,
    );

    expect(
      screen.getByText("Revenue"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("New Signups"),
    ).toBeInTheDocument();
  });
})

