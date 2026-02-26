/**
 * @file dashboard-overview.test.tsx
 * @description Unit tests for the DashboardOverviewPage template and its core behavior.
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  DashboardOverviewPage,
  DashboardHeader,
  DashboardMetrics,
  DashboardLastActivity,
  type KPICard,
  type KeyMetric,
  type ActivityItem,
  type DashboardDateRange,
} from ".";

/* -------------------------------------------------------------------------- */
/*                                Mock Ignix UI                               */
/* -------------------------------------------------------------------------- */

vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    // basic button mock that still calls onClick
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
  const DatePicker = ({ label, onChange }: any) => {
    const handleClick = () => {
      const range: DashboardDateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      };
      // Registry component normalizes its own types, so we can pass a
      // compatible shape here and just assert the callback is invoked.
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

vi.mock("@ignix-ui/pagination", () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => {
    return (
      <div>
        <span data-testid="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    );
  },
}));

/* -------------------------------------------------------------------------- */
/*                                   Fixtures                                 */
/* -------------------------------------------------------------------------- */

const kpiCards: KPICard[] = [
  {
    id: "kpi-1",
    label: "Total Revenue",
    value: "$120K",
    trend: "up",
    trendLabel: "+12.4% vs last month",
  },
  {
    id: "kpi-2",
    label: "Active Users",
    value: "8,430",
    trend: "up",
    trendLabel: "+3.2% vs last week",
  },
];

const keyMetrics: KeyMetric[] = [
  {
    id: "metric-1",
    label: "Conversion rate",
    value: "3.7%",
    trend: "up",
    trendValue: "+0.4%",
  },
  {
    id: "metric-2",
    label: "Churn rate",
    value: "1.2%",
    trend: "down",
    trendValue: "-0.2%",
  },
];

const activityItems: ActivityItem[] = [
  {
    id: "act-1",
    title: "Invoice #1023 paid",
    subtitle: "Enterprise plan",
    timestamp: "2024-01-10 09:12",
    amount: "+$4,500",
  },
  {
    id: "act-2",
    title: "Refund issued",
    subtitle: "Growth plan",
    timestamp: "2024-01-11 13:45",
    amount: "-$120",
  },
  {
    id: "act-3",
    title: "New subscription",
    subtitle: "Starter plan",
    timestamp: "2024-01-12 17:03",
    amount: "+$29",
  },
];

/* -------------------------------------------------------------------------- */
/*                                 Test Suite                                 */
/* -------------------------------------------------------------------------- */

describe("DashboardOverviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header, KPI cards, metrics, and activity sections", () => {
    render(
      <DashboardOverviewPage
        kpiCards={kpiCards}
        keyMetrics={keyMetrics}
        activityItems={activityItems}
      />
    );

    // Header
    expect(
      screen.getByRole("heading", { name: /dashboard overview/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/monitor key metrics and recent activity/i)
    ).toBeInTheDocument();

    // KPI cards
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("$120K")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();

    // Key metrics
    expect(screen.getByText("Conversion rate")).toBeInTheDocument();
    expect(screen.getByText("3.7%")).toBeInTheDocument();
    expect(screen.getByText("Churn rate")).toBeInTheDocument();

    // Activity items (first page)
    expect(screen.getByText(/invoice #1023 paid/i)).toBeInTheDocument();
    expect(screen.getByText(/refund issued/i)).toBeInTheDocument();
  });

  it("calls date range change handler when the date picker changes", async () => {
    const user = userEvent.setup();
    const handleDateRangeChange = vi.fn();

    render(
      <DashboardOverviewPage
        kpiCards={kpiCards}
        keyMetrics={keyMetrics}
        activityItems={activityItems}
        onDateRangeChange={handleDateRangeChange}
      />
    );

    // DatePicker mock renders a button; clicking it triggers onChange.
    const dateButton = screen.getByRole("button", { name: /date range/i });
    await user.click(dateButton);

    expect(handleDateRangeChange).toHaveBeenCalledTimes(1);
    const arg = handleDateRangeChange.mock.calls[0][0] as DashboardDateRange;
    expect(arg).toHaveProperty("start");
    expect(arg).toHaveProperty("end");
  });

  it("invokes export and view details callbacks from header buttons", async () => {
    const user = userEvent.setup();
    const handleExport = vi.fn();
    const handleViewDetails = vi.fn();

    render(
      <DashboardOverviewPage
        kpiCards={kpiCards}
        keyMetrics={keyMetrics}
        activityItems={activityItems}
        onExportReport={handleExport}
        onViewDetails={handleViewDetails}
      />
    );

    const exportButton = screen.getByRole("button", { name: /export report/i });
    const viewDetailsButton = screen.getByRole("button", { name: /view details/i });

    await user.click(exportButton);
    await user.click(viewDetailsButton);

    expect(handleExport).toHaveBeenCalledTimes(1);
    expect(handleViewDetails).toHaveBeenCalledTimes(1);
  });

  it("paginates activity list based on page size", async () => {
    const user = userEvent.setup();

    render(
      <DashboardOverviewPage
        kpiCards={kpiCards}
        keyMetrics={keyMetrics}
        activityItems={activityItems}
        activityPageSize={2}
      />
    );

    // First page should only show the first two items
    expect(screen.getByText(/invoice #1023 paid/i)).toBeInTheDocument();
    expect(screen.getByText(/refund issued/i)).toBeInTheDocument();
    expect(screen.queryByText(/new subscription/i)).not.toBeInTheDocument();

    // Move to next page using mocked Pagination
    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    // Now the third item should be visible
    expect(screen.getByText(/new subscription/i)).toBeInTheDocument();
  });

  it("does not render date picker when no dateRange and no onDateRangeChange", () => {
    render(<DashboardHeader />);

    // Our DatePicker mock is a button; absence of that button means no date picker rendered.
    expect(screen.queryByRole("button", { name: /date range/i })).not.toBeInTheDocument();
  });

  it("renders custom header actions when provided and hides default CTAs", () => {
    render(
      <DashboardHeader
        actions={<button type="button">Custom Action</button>}
      />
    );

    expect(screen.getByRole("button", { name: /custom action/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /export report/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /view details/i })).not.toBeInTheDocument();
  });

  it("shows empty message and no pagination when there are no activity items", () => {
    render(
      <DashboardLastActivity
        items={[]}
        emptyMessage="No activity in this period."
      />
    );

    expect(screen.getByText(/no activity in this period\./i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });

  it("renders metrics with neutral trend without crashing", () => {
    const neutralMetrics: KeyMetric[] = [
      {
        id: "metric-neutral",
        label: "Neutral metric",
        value: "0%",
        trend: "neutral",
        trendValue: "0%",
      },
    ];

    render(<DashboardMetrics metrics={neutralMetrics} title="Neutral metrics" />);

    expect(screen.getByText("Neutral metric")).toBeInTheDocument();
    // Two nodes render "0%" (value & trend text); just assert at least one exists.
    expect(screen.getAllByText("0%").length).toBeGreaterThanOrEqual(1);
  });
});