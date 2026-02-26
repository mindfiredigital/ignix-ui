/**
 * @file index.tsx
 * @description Analytics Dashboard Page component for Storybook.
 * Renders a time-series line chart, categorical bar chart, and distribution pie chart
 * with a shared date range picker, export button, interactive legend, tooltips,
 * and responsive layout. Uses memoization and React.memo to avoid unnecessary re-renders.
 */

"use client";

import React, {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../../../../utils/cn";
import { Button } from "../../../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/card";
import DatePicker from "../../../../components/date-picker";
import type { DateRange } from "../../../../components/date-picker";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Represents a start/end date range for filtering analytics charts.
 */
export interface AnalyticsDateRange {
  /** Start of the range (inclusive). */
  start: Date | null;
  /** End of the range (inclusive). */
  end: Date | null;
}

/**
 * Identifier for a chart series. Dynamic so consumers can define any series keys.
 */
export type LineSeriesId = string;

/**
 * Configuration for a line chart series (label and colors).
 */
export interface LineSeriesConfig {
  /** Unique identifier for the series. */
  id: LineSeriesId;
  /** Human-readable label shown in legend and tooltips. */
  label: string;
  /** Tailwind stroke color class for the SVG path. */
  strokeClass: string;
  /** Tailwind fill color class for point markers. */
  dotClass: string;
  /** Tailwind background color used in the legend pill. */
  legendBgClass: string;
  /** Optional Tailwind fill color class for pie chart slices; falls back to legendBgClass. */
  pieSliceClass?: string;
}

/**
 * Single time-series point for the line chart.
 */
export interface TimeSeriesPoint {
  /** JavaScript Date used for filtering and x-axis ordering. */
  date: Date;
  /** Values per logical series at this timestamp. */
  values: Record<LineSeriesId, number>;
}

/**
 * Aggregated value per series used for bar chart comparisons.
 */
export interface AggregatedSeriesValue {
  /** Identifier referencing a line series. */
  id: LineSeriesId;
  /** Human-friendly label. */
  label: string;
  /** Aggregated numeric value. */
  total: number;
}

/**
 * Slice data for the distribution pie chart.
 */
export interface DistributionSlice {
  /** Identifier referencing a line series. */
  id: LineSeriesId;
  /** Human-readable label. */
  label: string;
  /** Value used to compute slice size. */
  value: number;
}

/**
 * Props for the high-level AnalyticsDashboardPage.
 * All datasets and series configuration are provided by the consumer so the page
 * can handle complex, dynamic analytics use cases.
 */
export interface AnalyticsDashboardPageProps {
  /**
   * Time-series data for the line chart.
   * The `values` map keys must match the ids in `lineSeriesConfig`.
   */
  timeSeries: TimeSeriesPoint[];
  /**
   * Configuration for each logical series rendered in charts (colors, labels, ids).
   */
  lineSeriesConfig: LineSeriesConfig[];
  /**
   * Optional pre-computed aggregates for the bar chart.
   * If omitted, they will be derived from `timeSeries` + `lineSeriesConfig`.
   */
  barAggregates?: AggregatedSeriesValue[];
  /**
   * Optional pre-computed distribution slices for the pie chart.
   * If omitted, they will be derived from `barAggregates` or from `timeSeries`.
   */
  distributionSlices?: DistributionSlice[];
  /**
   * Optional externally controlled date range.
   * When provided, the internal picker mirrors this range.
   */
  dateRange?: AnalyticsDateRange;
  /**
   * Callback fired when the user changes the date range via the picker.
   * Use this to refetch data in real applications.
   */
  onDateRangeChange?: (range: AnalyticsDateRange) => void;
  /**
   * Callback invoked when the Export Charts button is clicked.
   */
  onExportCharts?: () => void;
  /**
   * Optional class name applied to the root layout container.
   */
  className?: string;
}

/**
 * Props for the root analytics dashboard layout wrapper.
 */
export interface AnalyticsLayoutProps {
  /** Page content (header + charts). */
  children: ReactNode;
  /** Optional class name for the container. */
  className?: string;
}

/**
 * Props for the header section (title, description, date picker, export button).
 */
export interface AnalyticsHeaderProps {
  /** Page title, defaults to "Analytics Dashboard". */
  title?: string;
  /** Short descriptive subtitle. */
  description?: string;
  /** Current date range for the filter. */
  dateRange?: AnalyticsDateRange;
  /** Handler called when a new date range is chosen. */
  onDateRangeChange?: (range: AnalyticsDateRange) => void;
  /** Handler called when the export button is clicked. */
  onExportCharts?: () => void;
}

/**
 * Props for the line chart component.
 */
export interface AnalyticsLineChartProps {
  /** Time-series points to render. */
  data: TimeSeriesPoint[];
  /** Series configuration (label + color). */
  seriesConfig: LineSeriesConfig[];
  /** Currently visible series identifiers. */
  activeSeries: Set<LineSeriesId>;
  /** Toggle handler for legend clicks. */
  onToggleSeries: (id: LineSeriesId) => void;
}

/**
 * Props for the bar chart component.
 */
export interface AnalyticsBarChartProps {
  /** Aggregated totals per series used for bar lengths. */
  aggregates: AggregatedSeriesValue[];
}

/**
 * Props for the pie chart component.
 */
export interface AnalyticsPieChartProps {
  /** Distribution data (one slice per item). */
  slices: DistributionSlice[];
  /** Series configuration used to resolve labels and colors. */
  seriesConfig: LineSeriesConfig[];
}

/**
 * Props for the shared legend component.
 */
export interface AnalyticsLegendProps {
  /** All available series configurations. */
  seriesConfig: LineSeriesConfig[];
  /** Identifiers that are currently visible in charts. */
  activeSeries: Set<LineSeriesId>;
  /** Toggle handler executed when a legend pill is clicked. */
  onToggleSeries: (id: LineSeriesId) => void;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Converts a DatePicker value into an AnalyticsDateRange.
 *
 * @param value - Date or DateRange from the DatePicker onChange callback.
 * @returns Normalized analytics date range.
 */
function toAnalyticsDateRange(value: Date | DateRange | null): AnalyticsDateRange {
  if (value == null) {
    return { start: null, end: null };
  }

  if (value instanceof Date) {
    return { start: value, end: null };
  }

  return {
    start: value.start ?? null,
    end: value.end ?? null,
  };
}

/**
 * Converts an AnalyticsDateRange to a DateRange value for the DatePicker.
 *
 * @param range - Analytics range from props or local state.
 * @returns Value suitable for the DatePicker component.
 */
function toPickerValue(range: AnalyticsDateRange | undefined): DateRange | null {
  if (!range?.start && !range?.end) {
    return null;
  }

  return {
    start: range.start ?? null,
    end: range.end ?? null,
  };
}

/**
 * Computes aggregated totals per series based on filtered time-series data.
 *
 * @param data - Filtered time-series points.
 * @param seriesConfig - Series configuration used to look up ids and labels.
 * @returns Array of aggregated values per series.
 */
function computeAggregates(
  data: TimeSeriesPoint[],
  seriesConfig: LineSeriesConfig[],
): AggregatedSeriesValue[] {
  const totals: Record<LineSeriesId, number> = {};

  for (const point of data) {
    for (const series of seriesConfig) {
      const current = point.values[series.id] ?? 0;
      totals[series.id] = (totals[series.id] ?? 0) + current;
    }
  }

  return seriesConfig.map((series) => ({
    id: series.id,
    label: series.label,
    total: totals[series.id] ?? 0,
  }));
}

/**
 * Converts aggregated totals into distribution slices for the pie chart.
 *
 * @param aggregates - Aggregated totals per series.
 * @returns Normalized distribution slices.
 */
function aggregatesToSlices(aggregates: AggregatedSeriesValue[]): DistributionSlice[] {
  return aggregates.map((aggregate) => ({
    id: aggregate.id,
    label: aggregate.label,
    value: aggregate.total,
  }));
}

/**
 * Formats a date as a short label for axis/tooltips (e.g. "Feb 12").
 *
 * @param date - Date instance to format.
 * @returns Formatted label string.
 */
function formatShortDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// =============================================================================
// LAYOUT & HEADER
// =============================================================================

/**
 * Root layout wrapper providing background, padding, and max-width constraints.
 * Composable building block; you can place AnalyticsHeader and chart sections inside.
 *
 * @param props - Layout props including children content.
 * @returns Wrapped dashboard layout.
 */
function AnalyticsLayout({ children, className }: AnalyticsLayoutProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden",
        "bg-gradient-to-br from-background via-background to-muted/40",
        "text-foreground p-4 md:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary/25 via-cyan-400/15 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        {children}
      </div>
    </div>
  );
}

/**
 * Page header including title, description, date range picker, and export button.
 *
 * @param props - Header props including date-range handlers.
 * @returns Rendered header section.
 */
function AnalyticsHeader({
  title = "Analytics Dashboard",
  description = "Visualize trends, segments, and performance at a glance.",
  dateRange,
  onDateRangeChange,
  onExportCharts,
}: AnalyticsHeaderProps) {
  const handleDateChange = useCallback(
    (value: Date | DateRange | null) => {
      const normalized = toAnalyticsDateRange(value);
      onDateRangeChange?.(normalized);
    },
    [onDateRangeChange],
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 xs:flex-row xs:items-center">
        <div className="min-w-[220px]">
          <DatePicker
            variant="range"
            value={toPickerValue(dateRange)}
            onChange={handleDateChange}
            placeholder={["Start date", "End date"]}
            size="md"
            showIcon
            label="Date range"
          />
        </div>
        <Button
          variant="default"
          size="md"
          className="w-full xs:w-auto"
          onClick={onExportCharts}
        >
          Export charts
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// LEGEND
// =============================================================================

/**
 * Interactive legend used to toggle individual line series visibility.
 *
 * @param props - Legend props including active state and toggle handler.
 * @returns Rendered legend pills.
 */
const AnalyticsLegend = React.memo(function AnalyticsLegendInner({
  seriesConfig,
  activeSeries,
  onToggleSeries,
}: AnalyticsLegendProps) {
  const handleClick = useCallback(
    (id: LineSeriesId) => {
      onToggleSeries(id);
    },
    [onToggleSeries],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {seriesConfig.map((series) => {
        const isActive = activeSeries.has(series.id);
        return (
          <button
            key={series.id}
            type="button"
            onClick={() => handleClick(series.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "border-primary/70 bg-primary/10 text-foreground"
                : "border-border bg-background/60 text-muted-foreground hover:bg-muted/50",
            )}
            aria-pressed={isActive}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                series.legendBgClass,
              )}
            />
            <span>{series.label}</span>
          </button>
        );
      })}
    </div>
  );
});

// =============================================================================
// LINE CHART
// =============================================================================

/**
 * Renders a responsive SVG line chart for one or more time-series.
 * Includes point markers and a simple hover tooltip.
 *
 * @param props - Line chart props including data and active series.
 * @returns Rendered line chart card.
 */
function AnalyticsLineChart({
  data,
  seriesConfig,
  activeSeries,
  onToggleSeries,
}: AnalyticsLineChartProps) {
  const [tooltip, setTooltip] = useState<{
    label: string;
    value: number;
    dateLabel: string;
  } | null>(null);

  const { paths, points, maxValue } = useMemo(() => {
    if (data.length === 0) {
      return {
        paths: {} as Record<LineSeriesId, string>,
        points: {} as Record<
          LineSeriesId,
          { x: number; y: number; value: number; dateLabel: string }[]
        >,
        maxValue: 0,
      };
    }

    const allValues: number[] = [];
    for (const point of data) {
      for (const series of seriesConfig) {
        if (typeof point.values[series.id] === "number") {
          allValues.push(point.values[series.id]);
        }
      }
    }

    const max = Math.max(...allValues, 1);
    const width = 100;
    const height = 60;
    const step = data.length > 1 ? width / (data.length - 1) : 0;

    const localPaths: Record<LineSeriesId, string> = {};
    const localPoints: Record<
      LineSeriesId,
      { x: number; y: number; value: number; dateLabel: string }[]
    > = {};

    data.forEach((point, index) => {
      const x = index * step;
      const dateLabel = formatShortDate(point.date);

      for (const series of seriesConfig) {
        const value = point.values[series.id];
        if (typeof value !== "number") continue;

        if (!localPaths[series.id]) {
          localPaths[series.id] = "";
          localPoints[series.id] = [];
        }

        const y =
          height - (value / (max || 1)) * height;
        const command = index === 0 ? "M" : "L";
        localPaths[series.id] += `${command} ${x} ${y} `;
        localPoints[series.id].push({
          x,
          y,
          value,
          dateLabel,
        });
      }
    });

    return {
      paths: localPaths,
      points: localPoints,
      maxValue: max,
    };
  }, [data, seriesConfig]);

  const handlePointEnter = useCallback(
    (
      seriesId: LineSeriesId,
      value: number,
      dateLabel: string,
    ) => {
      const series = seriesConfig.find((s) => s.id === seriesId);
      if (!series) return;
      setTooltip({
        label: series.label,
        value,
        dateLabel,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <Card variant="premium" className="h-full">
      <CardHeader variant="compact" className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle size="md">Traffic & revenue trend</CardTitle>
          <CardDescription>
            Time-series line chart showing revenue and new signups over the selected range.
          </CardDescription>
        </div>
        {tooltip && (
          <div className="rounded-md border border-border/70 bg-background/90 px-3 py-1.5 text-xs shadow-sm">
            <p className="font-medium text-foreground">{tooltip.label}</p>
            <p className="text-muted-foreground">
              {tooltip.dateLabel} ·{" "}
              {tooltip.label === "Revenue"
                ? `$${tooltip.value.toLocaleString()}`
                : `${tooltip.value.toLocaleString()} signups`}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent variant="compact" className="space-y-4">
        <div className="relative h-60 w-full md:h-72">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No data in selected range.
            </div>
          ) : (
            <svg
              viewBox="0 0 100 70"
              className="h-full w-full overflow-visible"
              role="img"
              aria-label="Time-series analytics chart"
              onMouseLeave={handleMouseLeave}
            >
              {/* Y-axis reference lines */}
              <g className="stroke-border/60">
                <line x1="0" y1="10" x2="100" y2="10" strokeWidth={0.3} />
                <line x1="0" y1="30" x2="100" y2="30" strokeWidth={0.3} />
                <line x1="0" y1="50" x2="100" y2="50" strokeWidth={0.3} />
              </g>

              {/* Line paths */}
              {seriesConfig.map((series) => {
                if (!activeSeries.has(series.id)) {
                  return null;
                }
                return (
                  <path
                    key={series.id}
                    d={paths[series.id]}
                    className={cn(series.strokeClass, "fill-none")}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}

              {/* Point markers */}
              {seriesConfig.map((series) => {
                if (!activeSeries.has(series.id)) {
                  return null;
                }
                const seriesPoints = points[series.id] ?? [];
                return (
                  <g key={series.id}>
                    {seriesPoints.map((point, index) => (
                      <circle
                        key={`${series.id}-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r={1.4}
                        className={series.dotClass}
                        onMouseEnter={() =>
                          handlePointEnter(series.id, point.value, point.dateLabel)
                        }
                      />
                    ))}
                  </g>
                );
              })}

              {/* X-axis labels */}
              <g className="text-[2px] fill-muted-foreground">
                {data.map((point, index) => {
                  if (index % 2 !== 0 && data.length > 6) {
                    return null;
                  }
                  const x =
                    data.length > 1
                      ? (index / (data.length - 1)) * 100
                      : 0;
                  return (
                    <text
                      key={point.date.getTime()}
                      x={x}
                      y={68}
                      textAnchor="middle"
                    >
                      {formatShortDate(point.date)}
                    </text>
                  );
                })}
              </g>

              {/* Max label for context */}
              {maxValue > 0 && (
                <text
                  x={0}
                  y={8}
                  className="fill-muted-foreground text-[2px]"
                >
                  Max: {`$${Math.round(maxValue).toLocaleString()}`}
                </text>
              )}
            </svg>
          )}
        </div>

        <AnalyticsLegend
          seriesConfig={seriesConfig}
          activeSeries={activeSeries}
          onToggleSeries={onToggleSeries}
        />
      </CardContent>
    </Card>
  );
}

// =============================================================================
// BAR CHART
// =============================================================================

/**
 * Renders a simple horizontal bar chart comparing aggregated series values.
 *
 * @param props - Bar chart props including aggregated totals.
 * @returns Rendered bar chart card.
 */
function AnalyticsBarChart({ aggregates }: AnalyticsBarChartProps) {
  const maxTotal = useMemo(() => {
    if (aggregates.length === 0) return 0;
    return Math.max(...aggregates.map((item) => item.total), 0);
  }, [aggregates]);

  return (
    <Card variant="default" className="h-full">
      <CardHeader variant="compact">
        <CardTitle size="md">Performance by key metric</CardTitle>
        <CardDescription>
          Horizontal bar chart comparing total revenue vs new signups in the selected range.
        </CardDescription>
      </CardHeader>
      <CardContent variant="compact">
        {aggregates.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No data available for this range.
          </p>
        ) : (
          <div className="space-y-4">
            {aggregates.map((item) => {
              const widthPercent =
                maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
              const formatted = `$${Math.round(item.total).toLocaleString()}`;

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="text-muted-foreground">{formatted}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-purple-500 transition-[width] duration-700",
                      )}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// PIE CHART
// =============================================================================

/**
 * Converts polar coordinates to cartesian coordinates for SVG arc creation.
 *
 * @param centerX - X coordinate of circle center.
 * @param centerY - Y coordinate of circle center.
 * @param radius - Circle radius.
 * @param angleInDegrees - Angle in degrees.
 * @returns Cartesian point for the specified angle.
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Describes an SVG arc path for a slice between two angles.
 *
 * @param x - Center X coordinate.
 * @param y - Center Y coordinate.
 * @param radius - Radius of the pie.
 * @param startAngle - Start angle in degrees.
 * @param endAngle - End angle in degrees.
 * @returns SVG path description string.
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "Z",
  ].join(" ");
}

/**
 * Renders a simple pie chart to visualize distribution between metrics.
 *
 * @param props - Pie chart props including slice data.
 * @returns Rendered pie chart card.
 */
function AnalyticsPieChart({ slices, seriesConfig }: AnalyticsPieChartProps) {
  const [hoveredId, setHoveredId] = useState<LineSeriesId | null>(null);

  const { paths, totalValue } = useMemo(() => {
    const sum = slices.reduce((acc, slice) => acc + slice.value, 0);
    if (sum === 0) {
      return { paths: [], totalValue: 0 };
    }

    const radius = 30;
    const center = 40;
    let startAngle = 0;
    const localPaths: {
      id: LineSeriesId;
      path: string;
      percentage: number;
    }[] = [];

    for (const slice of slices) {
      const fraction = slice.value / sum;
      const sweep = fraction * 360;
      const endAngle = startAngle + sweep;
      localPaths.push({
        id: slice.id,
        path: describeArc(center, center, radius, startAngle, endAngle),
        percentage: fraction * 100,
      });
      startAngle = endAngle;
    }

    return { paths: localPaths, totalValue: sum };
  }, [slices]);

  const getLabelForId = useCallback(
    (id: LineSeriesId) =>
      seriesConfig.find((s) => s.id === id)?.label ?? id,
    [seriesConfig],
  );

  const getSliceColorClass = useCallback(
    (id: LineSeriesId) => {
      const series = seriesConfig.find((s) => s.id === id);
      if (!series) return "fill-primary";
      if (series.pieSliceClass) return series.pieSliceClass;
      if (series.legendBgClass.startsWith("bg-")) {
        return series.legendBgClass.replace("bg-", "fill-");
      }
      return "fill-primary";
    },
    [seriesConfig],
  );

  const hoveredSlice = hoveredId
    ? paths.find((slice) => slice.id === hoveredId)
    : undefined;

  return (
    <Card variant="default" className="h-full">
      <CardHeader variant="compact">
        <CardTitle size="md">Distribution</CardTitle>
        <CardDescription>
          Pie chart showing how each metric contributes to the total in the selected range.
        </CardDescription>
      </CardHeader>
      <CardContent variant="compact" className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {totalValue === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No data available for this range.
          </p>
        ) : (
          <>
            <div className="mx-auto h-48 w-48">
              <svg
                viewBox="0 0 80 80"
                className="h-full w-full"
                role="img"
                aria-label="Distribution pie chart"
              >
                {paths.map((slice) => (
                  <path
                    key={slice.id}
                    d={slice.path}
                    className={cn(
                      getSliceColorClass(slice.id),
                      "cursor-pointer transition-opacity",
                      hoveredId && hoveredId !== slice.id
                        ? "opacity-40"
                        : "opacity-90 hover:opacity-100",
                    )}
                    onMouseEnter={() => setHoveredId(slice.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                ))}
              </svg>
            </div>

            <div className="flex-1 space-y-2 text-xs">
              {(hoveredSlice ? [hoveredSlice] : paths).map((slice) => (
                <div
                  key={slice.id}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-muted/50 px-2 py-1.5"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        getSliceColorClass(slice.id).replace("fill-", "bg-"),
                      )}
                    />
                    <span className="font-medium text-foreground">
                      {getLabelForId(slice.id)}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {slice.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// PAGE COMPOSITION
// =============================================================================

/**
 * Analytics Dashboard Page combining header, line chart, bar chart, and pie chart.
 * Charts share a date range filter, and the line chart shares an interactive legend
 * with tooltips. The layout is fully responsive down to mobile viewports.
 *
 * @param props - Top-level page props including callbacks and styling.
 * @returns Complete analytics dashboard page.
 */
function AnalyticsDashboardPage({
  timeSeries,
  lineSeriesConfig,
  barAggregates,
  distributionSlices,
  dateRange: controlledDateRange,
  onDateRangeChange,
  onExportCharts,
  className,
}: AnalyticsDashboardPageProps) {
  const [internalRange, setInternalRange] = useState<AnalyticsDateRange>({
    start: null,
    end: null,
  });

  const [activeSeries, setActiveSeries] = useState<Set<LineSeriesId>>(
    () => new Set<LineSeriesId>(lineSeriesConfig.map((s) => s.id)),
  );

  const effectiveRange = controlledDateRange ?? internalRange;

  const handleRangeChange = useCallback(
    (range: AnalyticsDateRange) => {
      if (!controlledDateRange) {
        setInternalRange(range);
      }
      onDateRangeChange?.(range);
    },
    [controlledDateRange, onDateRangeChange],
  );

  const handleToggleSeries = useCallback((id: LineSeriesId) => {
    setActiveSeries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Ensure at least one series remains visible.
        if (next.size > 1) {
          next.delete(id);
        }
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const filteredSeriesData = useMemo(() => {
    const { start, end } = effectiveRange;
    if (!start && !end) {
      return timeSeries;
    }

    const startTime = start?.getTime() ?? -Infinity;
    const endTime = end?.getTime() ?? Infinity;

    return timeSeries.filter((point) => {
      const t = point.date.getTime();
      return t >= startTime && t <= endTime;
    });
  }, [effectiveRange, timeSeries]);

  const aggregates = useMemo(
    () =>
      barAggregates ??
      computeAggregates(filteredSeriesData, lineSeriesConfig),
    [barAggregates, filteredSeriesData, lineSeriesConfig],
  );

  const slices = useMemo(
    () =>
      distributionSlices ??
      aggregatesToSlices(aggregates),
    [distributionSlices, aggregates],
  );

  const summaryCards = useMemo(
    () => aggregates.slice(0, 4),
    [aggregates],
  );

  return (
    <AnalyticsLayout className={className}>
      <AnalyticsHeader
        dateRange={effectiveRange}
        onDateRangeChange={handleRangeChange}
        onExportCharts={onExportCharts}
      />

      {summaryCards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card
              key={card.id}
              variant="default"
              className="border border-border/60 shadow-sm"
            >
              <CardHeader variant="compact">
                <CardTitle size="sm" className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <CardDescription className="sr-only">
                  Aggregated value over the selected date range.
                </CardDescription>
              </CardHeader>
              <CardContent variant="compact" className="pt-0">
                <p className="text-2xl font-semibold text-foreground">
                  {Math.round(card.total).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Aggregated over the current date range
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AnalyticsLineChart
            data={filteredSeriesData}
            seriesConfig={lineSeriesConfig}
            activeSeries={activeSeries}
            onToggleSeries={handleToggleSeries}
          />
        </div>
        <div className="xl:col-span-1">
          <AnalyticsBarChart aggregates={aggregates} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsPieChart slices={slices} seriesConfig={lineSeriesConfig} />
        <Card variant="default" className="h-full">
          <CardHeader variant="compact">
            <CardTitle size="md">Insights summary</CardTitle>
            <CardDescription>
              Example insights that might accompany the charts in a real product.
            </CardDescription>
          </CardHeader>
          <CardContent variant="compact" className="space-y-3 text-sm text-muted-foreground">
            <p>
              Revenue and signups both trend upward over the selected period, indicating
              healthy growth and effective acquisition campaigns.
            </p>
            <p>
              Use the legend above the line chart to focus on a single metric and quickly
              compare how revenue and acquisition behave independently.
            </p>
            <p>
              On smaller screens the layout collapses into a single column while keeping
              charts readable and interactive.
            </p>
          </CardContent>
        </Card>
      </div>
    </AnalyticsLayout>
  );
}

export default AnalyticsDashboardPage;
export {
  AnalyticsDashboardPage,
  AnalyticsLayout,
  AnalyticsHeader,
  AnalyticsLineChart,
  AnalyticsBarChart,
  AnalyticsPieChart,
};

