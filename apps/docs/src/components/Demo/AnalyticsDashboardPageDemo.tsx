import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
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
  type LineSeriesId,
} from "@site/src/components/UI/analytics-dashboard";

const seriesConfig: LineSeriesConfig[] = [
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
  {
    id: "churn",
    label: "Churned Accounts",
    strokeClass: "stroke-rose-400",
    dotClass: "fill-rose-400",
    legendBgClass: "bg-rose-500",
  },
];

const today = new Date("2024-03-14");

const timeSeries: TimeSeriesPoint[] = Array.from({ length: 14 }).map((_, idx) => {
  const date = new Date(today);
  date.setDate(today.getDate() - (13 - idx));

  const baseRevenue = 15000 + idx * 900;
  const weeklySeasonality = (idx % 7) * 600;
  const promoSpike = idx === 10 ? 12000 : 0;

  const signupsBase = 4000 + idx * 60;
  const signupsSeasonality = (idx % 5) * 500;
  const signupsSpike = idx === 10 ? 12000 : 0;

  const churnBase = 1000 + (idx % 4) * 3;

  return {
    date,
    values: {
      revenue: baseRevenue + weeklySeasonality + promoSpike,
      signups: signupsBase + signupsSeasonality + signupsSpike,
      churn: churnBase,
    },
  };
});

const computeAggregatesForDemo = (
  data: TimeSeriesPoint[],
  config: LineSeriesConfig[],
): AggregatedSeriesValue[] => {
  const totals: Record<LineSeriesId, number> = {};

  for (const point of data) {
    for (const series of config) {
      const value = point.values[series.id] ?? 0;
      totals[series.id] = (totals[series.id] ?? 0) + value;
    }
  }

  return config.map((series) => ({
    id: series.id,
    label: series.label,
    total: totals[series.id] ?? 0,
  }));
};

const aggregatesForDemo: AggregatedSeriesValue[] = computeAggregatesForDemo(
  timeSeries,
  seriesConfig,
);

const slicesForDemo: DistributionSlice[] = aggregatesForDemo.map((aggregate) => ({
  id: aggregate.id,
  label: aggregate.label,
  value: aggregate.total,
}));

const ComposablePreview: React.FC = () => {
  const [activeSeries, setActiveSeries] = React.useState<Set<LineSeriesId>>(
    () => new Set(seriesConfig.map((s) => s.id)),
  );

  const handleToggleSeries = React.useCallback((id: LineSeriesId) => {
    setActiveSeries((prev) => {
      const next = new Set(prev);
      if (next.has(id) && next.size > 1) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <AnalyticsLayout>
      <AnalyticsHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AnalyticsLineChart
            data={timeSeries}
            seriesConfig={seriesConfig}
            activeSeries={activeSeries}
            onToggleSeries={handleToggleSeries}
          />
        </div>
        <div className="xl:col-span-1">
          <AnalyticsBarChart aggregates={aggregatesForDemo} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsPieChart slices={slicesForDemo} seriesConfig={seriesConfig} />
      </div>
    </AnalyticsLayout>
  );
};

/**
 * AnalyticsDashboardPageDemo
 *
 * Composable preview + code demo for the Analytics Dashboard Page template.
 * Uses the docs-layer UI component and shows how to consume the registry template.
 */
const AnalyticsDashboardPageDemo: React.FC = () => {
  const codeString = `
import {
  AnalyticsDashboardPage,
  type AnalyticsDateRange,
  type LineSeriesConfig,
  type TimeSeriesPoint,
} from "@ignix-ui/analytics-dashboard-page";

const seriesConfig: LineSeriesConfig[] = [
  { id: "revenue", label: "Revenue", strokeClass: "stroke-emerald-400", dotClass: "fill-emerald-400", legendBgClass: "bg-emerald-500" },
  { id: "signups", label: "New Signups", strokeClass: "stroke-sky-400", dotClass: "fill-sky-400", legendBgClass: "bg-sky-500" },
  { id: "churn", label: "Churned Accounts", strokeClass: "stroke-rose-400", dotClass: "fill-rose-400", legendBgClass: "bg-rose-500" },
];

const timeSeries: TimeSeriesPoint[] = [
  {
    date: new Date("2024-02-14"),
    values: { revenue: 18200, signups: 140, churn: 12 },
  },
  // ...more TimeSeriesPoint rows
];

export function Example() {
  const handleDateRangeChange = (range: AnalyticsDateRange) => {
    console.log("Range changed:", range);
    // Refetch analytics for the selected period
  };

  return (
    <AnalyticsDashboardPage
      timeSeries={timeSeries}
      lineSeriesConfig={seriesConfig}
      onDateRangeChange={handleDateRangeChange}
      onExportCharts={() => console.log("Export charts")}
    />
  );
}
`.trim();

  return (
    <div className="mb-8 flex flex-col space-y-6">
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 shadow-sm">
            <AnalyticsDashboardPage
              timeSeries={timeSeries}
              lineSeriesConfig={seriesConfig}
              onDateRangeChange={(range: AnalyticsDateRange) =>
                console.log("Range changed:", range)
              }
              onExportCharts={() => console.log("Export charts")}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock
            language="tsx"
            className="max-h-[520px] overflow-y-auto whitespace-pre-wrap"
          >
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>

      <Tabs>
        <TabItem value="composable-preview" label="Composable preview">
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 shadow-sm">
            <ComposablePreview />
          </div>
        </TabItem>
        <TabItem value="composable-code" label="Composable code">
          <CodeBlock
            language="tsx"
            className="max-h-[520px] overflow-y-auto whitespace-pre-wrap"
          >
            {`import React, { useCallback, useMemo, useState } from "react";
import {
  AnalyticsLayout,
  AnalyticsHeader,
  AnalyticsLineChart,
  AnalyticsBarChart,
  AnalyticsPieChart,
  type LineSeriesConfig,
  type TimeSeriesPoint,
  type AggregatedSeriesValue,
} from "@ignix-ui/analytics-dashboard-page";

// Reuse the same seriesConfig and timeSeries from the basic example above.

function ComposableAnalyticsPage({
  seriesConfig,
  timeSeries,
}: {
  seriesConfig: LineSeriesConfig[];
  timeSeries: TimeSeriesPoint[];
}) {
  const [activeSeries, setActiveSeries] = useState(
    () => new Set(seriesConfig.map((s) => s.id)),
  );

  const aggregates = useMemo<AggregatedSeriesValue[]>(() => {
    const totals: Record<string, number> = {};
    for (const point of timeSeries) {
      for (const series of seriesConfig) {
        const value = point.values[series.id] ?? 0;
        totals[series.id] = (totals[series.id] ?? 0) + value;
      }
    }
    return seriesConfig.map((series) => ({
      id: series.id,
      label: series.label,
      total: totals[series.id] ?? 0,
    }));
  }, [seriesConfig, timeSeries]);

  const slices = useMemo(
    () =>
      aggregates.map((aggregate) => ({
        id: aggregate.id,
        label: aggregate.label,
        value: aggregate.total,
      })),
    [aggregates],
  );

  const handleToggleSeries = useCallback((id: string) => {
    setActiveSeries((prev) => {
      const next = new Set(prev);
      if (next.has(id) && next.size > 1) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <AnalyticsLayout>
      <AnalyticsHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AnalyticsLineChart
            data={timeSeries}
            seriesConfig={seriesConfig}
            activeSeries={activeSeries}
            onToggleSeries={handleToggleSeries}
          />
        </div>
        <div className="xl:col-span-1">
          <AnalyticsBarChart aggregates={aggregates} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsPieChart
          slices={slices}
          seriesConfig={seriesConfig}
        />
      </div>
    </AnalyticsLayout>
  );
}`}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboardPageDemo;

