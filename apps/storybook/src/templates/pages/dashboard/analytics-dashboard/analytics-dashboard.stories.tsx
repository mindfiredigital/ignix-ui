/**
 * @file analytics-dashboard.stories.tsx
 * @description Storybook stories for the Analytics Dashboard Page template.
 * Demonstrates default analytics layout, controlled date range behaviour,
 * legend interaction, and mobile responsiveness.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useCallback, useState } from "react";
import {
  AnalyticsDashboardPage,
  AnalyticsLayout,
  AnalyticsHeader,
  AnalyticsLineChart,
  AnalyticsBarChart,
  AnalyticsPieChart,
  type AnalyticsDateRange,
  type LineSeriesConfig,
  type TimeSeriesPoint,
  type AggregatedSeriesValue,
  type DistributionSlice,
} from "./index";

/**
 * Meta configuration for Analytics Dashboard stories.
 * Title: Templates/Pages/Dashboard/Analytics Dashboard Page
 */
const meta: Meta<typeof AnalyticsDashboardPage> = {
  title: "Templates/Pages/Dashboard/Analytics Dashboard Page",
  component: AnalyticsDashboardPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Analytics dashboard page with a time-series line chart, categorical bar chart, distribution pie chart, date range filter, export button, interactive legend, and responsive layout.",
      },
    },
  },
  argTypes: {
    onDateRangeChange: {
      action: "dateRangeChange",
      description:
        "Fired when the date range filter changes so the host app can refetch data.",
    },
    onExportCharts: {
      action: "exportCharts",
      description:
        "Called when the Export charts button is clicked.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AnalyticsDashboardPage>;

// ----------------------------------------------------------------------------- 
// Demo data for complex, multi-series analytics
// -----------------------------------------------------------------------------

const DEMO_SERIES_CONFIG: LineSeriesConfig[] = [
  {
    id: "revenue",
    label: "Revenue",
    strokeClass: "stroke-emerald-400",
    dotClass: "fill-emerald-400",
    legendBgClass: "bg-emerald-500",
    pieSliceClass: "fill-emerald-400",
  },
  {
    id: "signups",
    label: "New Signups",
    strokeClass: "stroke-sky-400",
    dotClass: "fill-sky-400",
    legendBgClass: "bg-sky-500",
    pieSliceClass: "fill-sky-400",
  },
  {
    id: "churn",
    label: "Churned Accounts",
    strokeClass: "stroke-rose-400",
    dotClass: "fill-rose-400",
    legendBgClass: "bg-rose-500",
    pieSliceClass: "fill-rose-400",
  },
];

const today = new Date();

const DEMO_TIME_SERIES: TimeSeriesPoint[] = Array.from({ length: 14 }).map(
  (_, idx) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - idx));

    const baseRevenue = 15000 + idx * 900;
    const weeklySeasonality = (idx % 7) * 600;
    const promoSpike = idx === 10 ? 12000 : 0;

    const signupsBase = 4000 + idx * 6;
    const signupsSeasonality = (idx % 5) * 10;

    const churnBase = 1000 + (idx % 4) * 3;

    return {
      date,
      values: {
        revenue: baseRevenue + weeklySeasonality + promoSpike,
        signups: signupsBase + signupsSeasonality,
        churn: churnBase,
      },
    };
  },
);

const DEMO_AGGREGATES: AggregatedSeriesValue[] = DEMO_SERIES_CONFIG.map(
  (series) => {
    const total = DEMO_TIME_SERIES.reduce(
      (acc, point) => acc + (point.values[series.id] ?? 0),
      0,
    );
    return {
      id: series.id,
      label: series.label,
      total,
    };
  },
);

const DEMO_SLICES: DistributionSlice[] = DEMO_AGGREGATES.map((aggregate) => ({
  id: aggregate.id,
  label: aggregate.label,
  value: aggregate.total,
}));

/**
 * Default analytics dashboard with internal date state.
 * Charts render sample data and respond to legend interaction.
 */
export const Default: Story = {
  args: {
    timeSeries: DEMO_TIME_SERIES,
    lineSeriesConfig: DEMO_SERIES_CONFIG,
    barAggregates: DEMO_AGGREGATES,
    distributionSlices: DEMO_SLICES,
  },
  render: (args) => <AnalyticsDashboardPage {...args} />,
  name: "Default",
};

/**
 * Wrapper that demonstrates controlled date range behaviour.
 * The parent owns the dateRange state and passes it down to the page.
 *
 * @param args - Page props coming from Storybook controls.
 * @returns Rendered AnalyticsDashboardPage with controlled date range.
 */
function ControlledDateRangeWrapper(
  args: React.ComponentProps<typeof AnalyticsDashboardPage>,
) {
  const [range, setRange] = useState<AnalyticsDateRange | undefined>(undefined);

  const handleRangeChange = useCallback(
    (next: AnalyticsDateRange) => {
      setRange(next);
      args.onDateRangeChange?.(next);
    },
    [args],
  );

  return (
    <AnalyticsDashboardPage
      {...args}
      timeSeries={DEMO_TIME_SERIES}
      lineSeriesConfig={DEMO_SERIES_CONFIG}
      barAggregates={DEMO_AGGREGATES}
      distributionSlices={DEMO_SLICES}
      dateRange={range}
      onDateRangeChange={handleRangeChange}
    />
  );
}

/**
 * Story showing controlled date range usage.
 * Use the date picker to update the externally managed dateRange state.
 */
export const ControlledDateRange: Story = {
  render: (args) => <ControlledDateRangeWrapper {...args} />,
  name: "Controlled date range",
};

/**
 * Composable usage: build the page from AnalyticsLayout, AnalyticsHeader,
 * and individual chart sections. You can reorder, omit, or extend sections.
 */
export const Composable: Story = {
  render: (args) => (
    <AnalyticsLayout className={args.className}>
      <AnalyticsHeader
        dateRange={args.dateRange}
        onDateRangeChange={args.onDateRangeChange}
        onExportCharts={args.onExportCharts}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AnalyticsLineChart
            data={DEMO_TIME_SERIES}
            seriesConfig={DEMO_SERIES_CONFIG}
            activeSeries={new Set(DEMO_SERIES_CONFIG.map((s) => s.id))}
            // In an app, provide a memoised handler; stories can use a no-op.
            onToggleSeries={() => undefined}
          />
        </div>
        <div className="xl:col-span-1">
          <AnalyticsBarChart aggregates={[]} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsPieChart
          slices={DEMO_SLICES}
          seriesConfig={DEMO_SERIES_CONFIG}
        />
      </div>
    </AnalyticsLayout>
  ),
  name: "Composable (layout + sections)",
};

/**
 * Mobile-focused story to emphasise responsive layout and chart sizing.
 */
export const MobileResponsive: Story = {
  args: {
    timeSeries: DEMO_TIME_SERIES,
    lineSeriesConfig: DEMO_SERIES_CONFIG,
    barAggregates: DEMO_AGGREGATES,
    distributionSlices: DEMO_SLICES,
  },
  render: (args) => <AnalyticsDashboardPage {...args} />,
  name: "Mobile responsive",
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

