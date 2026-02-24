/**
 * @file dashboard-overview.stories.tsx
 * @description Storybook stories for the Dashboard Overview Page.
 * Covers default view, custom data, date range interaction, and responsive behaviour.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import {
  DashboardOverviewPage,
  Dashboard,
  DashboardHeader,
  DashboardKPICards,
  DashboardMetrics,
  DashboardLastActivity,
  type DashboardDateRange,
  type KPICard,
  type KeyMetric,
  type ActivityItem,
} from "./index";

/**
 * Meta configuration for Dashboard Overview Page stories.
 * Title: Templates/Pages/Dashboard/Dashboard Overview Page
 */
const meta: Meta<typeof DashboardOverviewPage> = {
  title: "Templates/Pages/Dashboard/Dashboard Overview Page",
  component: DashboardOverviewPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dashboard overview page with KPI cards (revenue, users, conversion, etc.), key metrics with trend indicators (↑/↓), quick stats grid (4–6 cards), latest activity/transactions list (paginated), date range filter, and call-to-action buttons. Cards are responsive; metrics can update when date range changes; activity list is paginated.",
      },
    },
  },
  argTypes: {
    activityPageSize: {
      control: { type: "number", min: 2, max: 20 },
      description: "Number of activity items per page",
    },
    onDateRangeChange: {
      action: "dateRangeChange",
      description: "Fired when the date range filter changes (metrics can be refetched)",
    },
    onExportReport: {
      action: "exportReport",
      description: "Primary CTA: Export report",
    },
    onViewDetails: {
      action: "viewDetails",
      description: "Secondary CTA: View details",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DashboardOverviewPage>;

/**
 * Default dashboard with sample KPIs, key metrics, and activity list.
 * Date range filter and CTAs are interactive; activity list is paginated.
 */
export const Default: Story = {
  render: (args) => <DashboardOverviewPage {...args} />,
  name: "Default",
};

/**
 * Composable usage: build the page from Dashboard + Header, KPICards, Metrics, LastActivity.
 * You can reorder, omit, or add custom sections.
 */
export const Composable: Story = {
  render: () => (
    <Dashboard>
      <DashboardHeader
        title="Dashboard Overview"
        description="Monitor key metrics and recent activity"
        onDateRangeChange={(range) => console.log("Date range:", range)}
        onExportReport={() => console.log("Export")}
        onViewDetails={() => console.log("View details")}
      />
      <DashboardKPICards
        cards={[
          { id: "r", label: "Revenue", value: "$124.5k", trend: "up", trendLabel: "+12.5%" },
          { id: "u", label: "Users", value: "12,345", trend: "up", trendLabel: "+8.2%" },
          { id: "c", label: "Conversion", value: "3.24%", trend: "down", trendLabel: "-0.4%" },
          { id: "o", label: "Orders", value: "1,892", trend: "up", trendLabel: "+15.1%" },
        ] as KPICard[]}
      />
      <DashboardMetrics
        metrics={[
          { id: "1", label: "Page Views", value: "48.2k", trend: "up", trendValue: "+5.2%" },
          { id: "2", label: "Avg. Session", value: "4m 32s", trend: "down", trendValue: "-2.1%" },
          { id: "3", label: "Bounce Rate", value: "42%", trend: "down", trendValue: "-1.8%" },
          { id: "4", label: "Sign-ups", value: "892", trend: "up", trendValue: "+12%" },
        ] as KeyMetric[]}
      />
      <DashboardLastActivity
        items={[
          { id: "1", title: "Payment received", subtitle: "Invoice #1024", timestamp: "2 min ago", amount: "+$1,250" },
          { id: "2", title: "New sign-up", subtitle: "john@example.com", timestamp: "15 min ago" },
          { id: "3", title: "Order shipped", subtitle: "Order #8821", timestamp: "1 hour ago", amount: "$89" },
        ] as ActivityItem[]}
        pageSize={5}
      />
    </Dashboard>
  ),
  name: "Composable (Dashboard + Header + KPICards + Metrics + LastActivity)",
};

/**
 * Custom KPI cards and key metrics to show flexibility of the page.
 */
export const CustomData: Story = {
  args: {
    kpiCards: [
      { id: "rev", label: "Revenue", value: "$89.2k", trend: "up", trendLabel: "+18% vs last month" },
      { id: "subs", label: "Subscriptions", value: "2,104", trend: "up", trendLabel: "+6% vs last month" },
      { id: "churn", label: "Churn Rate", value: "1.2%", trend: "down", trendLabel: "-0.3% vs last month" },
      { id: "mrr", label: "MRR", value: "$45.1k", trend: "up", trendLabel: "+9% vs last month" },
    ] as KPICard[],
    keyMetrics: [
      { id: "1", label: "DAU", value: "4.2k", trend: "up", trendValue: "+4%" },
      { id: "2", label: "MAU", value: "28.1k", trend: "up", trendValue: "+7%" },
      { id: "3", label: "Retention", value: "84%", trend: "up", trendValue: "+2%" },
      { id: "4", label: "LTV", value: "$312", trend: "neutral", trendValue: "0%" },
    ] as KeyMetric[],
    activityItems: [
      { id: "1", title: "Plan upgrade", subtitle: "Pro → Business", timestamp: "1 min ago", amount: "+$50/mo" },
      { id: "2", title: "New team", subtitle: "Acme Corp", timestamp: "5 min ago" },
      { id: "3", title: "Payment failed", subtitle: "Retry scheduled", timestamp: "12 min ago", amount: "$99" },
    ] as ActivityItem[],
    activityPageSize: 5,
  },
  render: (args) => <DashboardOverviewPage {...args} />,
  name: "Custom data",
};

/**
 * Wrapper that simulates metrics updating when date range changes.
 * Changing the date range updates the displayed KPI values to mimic refetch.
 * @param args - Dashboard page props (from Storybook args)
 * @returns Rendered DashboardOverviewPage with date-range-driven KPI updates
 */
function MetricsUpdateOnDateRangeWrapper(args: React.ComponentProps<typeof DashboardOverviewPage>) {
  const [dateRange, setDateRange] = useState<DashboardDateRange | undefined>(undefined);
  const [kpis, setKpis] = useState<KPICard[]>(args.kpiCards ?? []);

  const handleDateRangeChange = useCallback(
    (range: DashboardDateRange) => {
      args.onDateRangeChange?.(range);
      setDateRange(range);
      if (range.start ?? range.end) {
        setKpis((prev) =>
          prev.map((p, i) => ({
            ...p,
            value:
              p.rawValue != null
                ? `$${Math.round(p.rawValue * (1 + (i % 3 === 0 ? 0.1 : -0.05))).toLocaleString()}`
                : p.value,
            trendLabel: "Updated for selected range",
          }))
        );
      }
    },
    [args]
  );

  return (
    <DashboardOverviewPage
      {...args}
      kpiCards={kpis}
      dateRange={dateRange}
      onDateRangeChange={handleDateRangeChange}
    />
  );
}

/**
 * Demonstrates that metrics update when date range changes.
 * Select a date range to see KPI values update (simulated).
 */
export const MetricsUpdateOnDateRangeChange: Story = {
  render: (args) => <MetricsUpdateOnDateRangeWrapper {...args} />,
  name: "Metrics update on date range change",
  parameters: {
    docs: {
      description: {
        story: "Select a date range to simulate metrics refetch; KPI values update accordingly.",
      },
    },
  },
};

/**
 * More activity items to show pagination clearly.
 */
export const PaginatedActivityList: Story = {
  args: {
    activityItems: Array.from({ length: 18 }, (_, i) => ({
      id: `act-${i + 1}`,
      title: `Activity item ${i + 1}`,
      subtitle: `Detail ${i + 1}`,
      timestamp: `${i + 1} hour${i > 0 ? "s" : ""} ago`,
      status: i % 3 === 0 ? "pending" : "completed",
      amount: i % 2 === 0 ? `$${(i + 1) * 10}` : undefined,
    })) as ActivityItem[],
    activityPageSize: 5,
  },
  render: (args) => <DashboardOverviewPage {...args} />,
  name: "Paginated activity list",
  parameters: {
    docs: {
      description: {
        story: "Activity list is paginated; use the pagination controls to change pages.",
      },
    },
  },
};
