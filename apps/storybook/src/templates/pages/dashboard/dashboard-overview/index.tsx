/**
 * @file index.tsx
 * @description Dashboard Overview Page component and types. Renders KPIs, key metrics with trends,
 * quick stats grid, latest activity list (paginated), date range filter, and CTA buttons.
 * Uses existing Card, Button, DatePicker, Pagination, and theme components.
 */

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
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
import { Pagination } from "../../../../components/table/pagination";

// =============================================================================
// TYPES (inlined; no separate types file)
// =============================================================================

/**
 * Direction of a metric trend (up, down, or neutral).
 */
export type TrendDirection = "up" | "down" | "neutral";

/**
 * Single KPI card data (revenue, users, conversion, etc.).
 */
export interface KPICard {
  /** Unique id for the KPI */
  id: string;
  /** Display label (e.g. "Revenue", "Active Users") */
  label: string;
  /** Main value to display (e.g. "$124.5k", "12,345") */
  value: string;
  /** Optional numeric value for sorting or calculations */
  rawValue?: number;
  /** Trend direction for the period */
  trend: TrendDirection;
  /** Trend description (e.g. "+12.5% vs last period") */
  trendLabel: string;
  /** Optional icon or asset key (for future use) */
  iconKey?: string;
}

/**
 * Key metric with trend indicator (for quick stats grid).
 */
export interface KeyMetric {
  /** Unique id */
  id: string;
  /** Metric name */
  label: string;
  /** Display value */
  value: string;
  /** Trend direction */
  trend: TrendDirection;
  /** Trend percentage or text (e.g. "+5.2%", "-3.1%") */
  trendValue: string;
}

/**
 * Single activity or transaction item for the latest activity list.
 */
export interface ActivityItem {
  /** Unique id */
  id: string;
  /** Short title or description */
  title: string;
  /** Optional subtitle or secondary text */
  subtitle?: string;
  /** When it occurred (ISO string or display string) */
  timestamp: string;
  /** Status or type (e.g. "completed", "pending", "payment") */
  status?: string;
  /** Optional amount or numeric detail */
  amount?: string;
}

/**
 * Date range for filtering dashboard data.
 */
export interface DashboardDateRange {
  /** Start of range (null = no start) */
  start: Date | null;
  /** End of range (null = no end) */
  end: Date | null;
}

/**
 * Props for the Dashboard Overview Page component.
 */
export interface DashboardOverviewPageProps {
  /** KPI cards to display (revenue, users, conversion, etc.) */
  kpiCards?: KPICard[];
  /** Key metrics for the quick stats grid (4–6 cards) */
  keyMetrics?: KeyMetric[];
  /** Latest activity/transactions (will be paginated internally) */
  activityItems?: ActivityItem[];
  /** Items per page for the activity list */
  activityPageSize?: number;
  /** Callback when date range changes (metrics can be refetched/updated by parent) */
  onDateRangeChange?: (range: DashboardDateRange) => void;
  /** Callbacks for primary CTA actions (e.g. "Export report", "Add user") */
  onExportReport?: () => void;
  /** Callback for secondary CTA (e.g. "View details") */
  onViewDetails?: () => void;
  /** Optional initial date range (controlled from outside) */
  dateRange?: DashboardDateRange;
  /** Additional class name for the root container */
  className?: string;
}

/** Props for the root Dashboard layout wrapper. */
export interface DashboardProps {
  /** Composable sections (e.g. DashboardHeader, DashboardKPICards, DashboardMetrics, DashboardLastActivity) */
  children: React.ReactNode;
  /** Optional class name for the root container */
  className?: string;
}

/** Props for DashboardHeader (title, date range filter, CTAs). */
export interface DashboardHeaderProps {
  /** Page title */
  title?: string;
  /** Short description below title */
  description?: string;
  /** Current date range (controlled) */
  dateRange?: DashboardDateRange;
  /** Callback when date range changes */
  onDateRangeChange?: (range: DashboardDateRange) => void;
  /** Primary CTA label */
  exportLabel?: string;
  /** Primary CTA click handler */
  onExportReport?: () => void;
  /** Secondary CTA label */
  viewDetailsLabel?: string;
  /** Secondary CTA click handler */
  onViewDetails?: () => void;
  /** Optional class name */
  className?: string;
  /** Optional custom actions (rendered after date picker, before or instead of default CTAs) */
  actions?: React.ReactNode;
}

/** Props for a single DashboardKPICard. */
export interface DashboardKPICardProps {
  /** KPI data */
  card: KPICard;
  /** Optional class name */
  className?: string;
}

/** Props for the DashboardKPICards grid. */
export interface DashboardKPICardsProps {
  /** Array of KPI cards to render */
  cards: KPICard[];
  /** Optional class name for the grid container */
  className?: string;
}

/** Props for the DashboardMetrics section. */
export interface DashboardMetricsProps {
  /** Key metrics to display (4–6 recommended) */
  metrics: KeyMetric[];
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Optional class name */
  className?: string;
}

/** Props for the DashboardLastActivity section. */
export interface DashboardLastActivityProps {
  /** Activity/transaction items (paginated internally) */
  items: ActivityItem[];
  /** Items per page */
  pageSize?: number;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Message when there are no items */
  emptyMessage?: string;
  /** Optional class name */
  className?: string;
}

// =============================================================================
// DEFAULTS
// =============================================================================

/** Default number of activity items per page */
const DEFAULT_ACTIVITY_PAGE_SIZE = 5;

/** Default KPI cards when none provided */
const DEFAULT_KPI_CARDS: KPICard[] = [
  {
    id: "revenue",
    label: "Revenue",
    value: "$124.5k",
    rawValue: 124500,
    trend: "up",
    trendLabel: "+12.5% vs last period",
  },
  {
    id: "users",
    label: "Active Users",
    value: "12,345",
    rawValue: 12345,
    trend: "up",
    trendLabel: "+8.2% vs last period",
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "3.24%",
    rawValue: 3.24,
    trend: "down",
    trendLabel: "-0.4% vs last period",
  },
  {
    id: "orders",
    label: "Orders",
    value: "1,892",
    rawValue: 1892,
    trend: "up",
    trendLabel: "+15.1% vs last period",
  },
];

/** Default key metrics for quick stats grid */
const DEFAULT_KEY_METRICS: KeyMetric[] = [
  { id: "m1", label: "Page Views", value: "48.2k", trend: "up", trendValue: "+5.2%" },
  { id: "m2", label: "Avg. Session", value: "4m 32s", trend: "down", trendValue: "-2.1%" },
  { id: "m3", label: "Bounce Rate", value: "42%", trend: "down", trendValue: "-1.8%" },
  { id: "m4", label: "Sign-ups", value: "892", trend: "up", trendValue: "+12%" },
  { id: "m5", label: "Support Tickets", value: "24", trend: "neutral", trendValue: "0%" },
  { id: "m6", label: "NPS Score", value: "72", trend: "up", trendValue: "+3" },
];

/** Default activity items when none provided */
const DEFAULT_ACTIVITY_ITEMS: ActivityItem[] = [
  { id: "a1", title: "Payment received", subtitle: "Invoice #1024", timestamp: "2 min ago", status: "completed", amount: "+$1,250" },
  { id: "a2", title: "New user sign-up", subtitle: "john@example.com", timestamp: "15 min ago", status: "completed" },
  { id: "a3", title: "Order shipped", subtitle: "Order #8821", timestamp: "1 hour ago", status: "completed", amount: "$89.00" },
  { id: "a4", title: "Support ticket closed", subtitle: "#4421", timestamp: "2 hours ago", status: "completed" },
  { id: "a5", title: "Subscription renewed", subtitle: "Premium plan", timestamp: "3 hours ago", status: "completed", amount: "$29/mo" },
  { id: "a6", title: "Failed payment retry", subtitle: "Customer #221", timestamp: "5 hours ago", status: "pending", amount: "$99.00" },
  { id: "a7", title: "Refund processed", subtitle: "Order #8801", timestamp: "6 hours ago", status: "completed", amount: "-$45.00" },
  { id: "a8", title: "API key generated", subtitle: "Project Alpha", timestamp: "Yesterday", status: "completed" },
];

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Converts DatePicker value (Date | DateRange | null) to DashboardDateRange.
 * @param value - Date or range from DatePicker onChange
 * @returns Dashboard date range
 */
function toDashboardDateRange(value: Date | DateRange | null): DashboardDateRange {
  if (value == null) return { start: null, end: null };
  if (value instanceof Date) return { start: value, end: null };
  return { start: value.start ?? null, end: value.end ?? null };
}

/**
 * Converts DashboardDateRange to DatePicker value (for controlled DatePicker).
 * @param range - Dashboard date range
 * @returns Value for DatePicker
 */
function toPickerValue(range: DashboardDateRange | undefined): DateRange | null {
  if (!range?.start && !range?.end) return null;
  return { start: range.start ?? null, end: range.end ?? null };
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Renders a single activity row. Memoized to avoid re-renders when only page changes.
 */
const ActivityRow = React.memo(function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 py-3 px-4 rounded-lg",
        "hover:bg-muted/50 transition-colors border-b border-border/60 last:border-0"
      )}
      data-testid={`activity-row-${item.id}`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground truncate">{item.title}</p>
        {item.subtitle && (
          <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {item.amount && (
          <span
            className={cn(
              "text-sm font-medium",
              item.amount.startsWith("-") ? "text-destructive" : "text-foreground"
            )}
          >
            {item.amount}
          </span>
        )}
        <span className="text-sm text-muted-foreground">{item.timestamp}</span>
      </div>
    </div>
  );
});

/**
 * Renders a trend indicator (icon + value) for key metrics.
 * Uses success (green) for up, destructive (red) for down, muted for neutral.
 * @param props.trend - Direction: "up" | "down" | "neutral"
 * @param props.trendValue - Display text (e.g. "+12%", "-3.1%")
 * @param props.className - Optional class name
 */
function TrendIndicator({
  trend,
  trendValue,
  className,
}: {
  trend: "up" | "down" | "neutral";
  trendValue: string;
  className?: string;
}) {
  const isUp = trend === "up";
  const isDown = trend === "down";
  const trendClass = isUp
    ? "text-success"
    : isDown
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", trendClass, className)}>
      {isUp && <FiTrendingUp className="w-4 h-4 shrink-0" aria-hidden />}
      {isDown && <FiTrendingDown className="w-4 h-4 shrink-0" aria-hidden />}
      <span>{trendValue}</span>
    </span>
  );
}

// =============================================================================
// COMPOSABLE COMPONENTS
// =============================================================================

/**
 * Root Dashboard layout. Wraps composable sections with consistent spacing and max width.
 * Use with DashboardHeader, DashboardKPICards, DashboardMetrics, DashboardLastActivity.
 */
function Dashboard({ children, className }: DashboardProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground p-4 md:p-6", className)}>
      <div className="max-w-7xl mx-auto space-y-6">{children}</div>
    </div>
  );
}

/**
 * Dashboard header with title, description, date range filter, and CTA buttons.
 * Composable; use inside Dashboard.
 */
function DashboardHeader({
  title = "Dashboard Overview",
  description = "Monitor key metrics and recent activity",
  dateRange,
  onDateRangeChange,
  exportLabel = "Export Report",
  onExportReport,
  viewDetailsLabel = "View Details",
  onViewDetails,
  className,
  actions,
}: DashboardHeaderProps) {
  const [internalDateRange, setInternalDateRange] = useState<DashboardDateRange | undefined>(
    dateRange ?? undefined
  );
  const effectiveRange = dateRange ?? internalDateRange;

  const handleDateRangeChange = useCallback(
    (value: Date | DateRange | null) => {
      const next = toDashboardDateRange(value);
      setInternalDateRange(next);
      onDateRangeChange?.(next);
    },
    [onDateRangeChange]
  );

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", className)}>
      <div className="">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-3">
        {(onDateRangeChange != null || dateRange != null) && (
          <div className="w-full sm:w-auto min-w-[200px]">
            <DatePicker
              variant="range"
              value={toPickerValue(effectiveRange)}
              onChange={handleDateRangeChange}
              placeholder={["Start date", "End date"]}
              size="md"
              showIcon={true}
              label="Date range"
            />
          </div>
        )}
        {actions != null ? (
          actions
        ) : (
          <div className="flex gap-2 flex-wrap w-full justify-end">
            {onExportReport && (
              <Button variant="default" size="md" onClick={onExportReport}>
                {exportLabel}
              </Button>
            )}
            {onViewDetails && (
              <Button variant="outline" size="md" onClick={onViewDetails}>
                {viewDetailsLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Single KPI card. Use standalone or inside DashboardKPICards.
 */
function DashboardKPICard({ card, className }: DashboardKPICardProps) {
  return (
    <Card variant="default" className={cn("flex flex-col", className)}>
      <CardHeader variant="compact">
        <CardTitle size="sm" className="text-muted-foreground font-medium">
          {card.label}
        </CardTitle>
      </CardHeader>
      <CardContent variant="compact" className="pt-0">
        <p className="text-2xl font-bold text-foreground">{card.value}</p>
        <TrendIndicator trend={card.trend} trendValue={card.trendLabel} className="mt-1" />
      </CardContent>
    </Card>
  );
}

/**
 * Grid of KPI cards. Composable; use inside Dashboard.
 */
function DashboardKPICards({ cards, className }: DashboardKPICardsProps) {
  return (
    <section aria-label="Key performance indicators" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <DashboardKPICard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

/**
 * Key metrics section (quick stats grid with trend indicators). Composable; use inside Dashboard.
 */
function DashboardMetrics({
  metrics,
  title = "Key metrics",
  description = "Overview for selected period",
  className,
}: DashboardMetricsProps) {
  return (
    <section aria-label="Key metrics" className={className}>
      <Card variant="default">
        <CardHeader variant="compact">
          <CardTitle size="md">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent variant="compact" className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className={cn(
                  "p-4 rounded-lg border border-border/60 bg-muted/20",
                  "flex flex-col gap-1"
                )}
              >
                <p className="text-sm text-muted-foreground truncate">{metric.label}</p>
                <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                <TrendIndicator trend={metric.trend} trendValue={metric.trendValue} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * Latest activity / transactions list with pagination. Composable; use inside Dashboard.
 */
function DashboardLastActivity({
  items,
  pageSize = DEFAULT_ACTIVITY_PAGE_SIZE,
  title = "Latest activity",
  description = "Recent transactions and events",
  emptyMessage = "No activity in this period.",
  className,
}: DashboardLastActivityProps) {
  const [activityPage, setActivityPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  const paginatedItems = useMemo(() => {
    const start = (activityPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, activityPage, pageSize]);

  const handlePageChange = useCallback((page: number) => setActivityPage(page), []);

  return (
    <section aria-label="Latest activity" className={className}>
      <Card variant="default">
        <CardHeader variant="compact" className="flex flex-row items-center justify-between">
          <div>
            <CardTitle size="md">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent variant="compact" className="pt-0">
          <div className="divide-y-0 rounded-lg border border-border/60 overflow-hidden">
            {paginatedItems.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">{emptyMessage}</p>
            ) : (
              paginatedItems.map((item) => <ActivityRow key={item.id} item={item} />)
            )}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={activityPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// =============================================================================
// PRE-COMPOSED PAGE (default export)
// =============================================================================

/**
 * Dashboard Overview Page (pre-composed).
 * Same as: Dashboard with DashboardHeader, DashboardKPICards, DashboardMetrics, DashboardLastActivity.
 * Use this for a full page, or compose Dashboard + sections yourself for custom layouts.
 */
function DashboardOverviewPage({
  kpiCards = DEFAULT_KPI_CARDS,
  keyMetrics = DEFAULT_KEY_METRICS,
  activityItems = DEFAULT_ACTIVITY_ITEMS,
  activityPageSize = DEFAULT_ACTIVITY_PAGE_SIZE,
  onDateRangeChange,
  onExportReport,
  onViewDetails,
  dateRange: controlledDateRange,
  className,
}: DashboardOverviewPageProps) {
  const [internalDateRange, setInternalDateRange] = useState<DashboardDateRange | undefined>(
    controlledDateRange ?? undefined
  );
  const dateRange = controlledDateRange ?? internalDateRange;

  const handleDateRangeChange = useCallback(
    (range: DashboardDateRange) => {
      setInternalDateRange(range);
      onDateRangeChange?.(range);
    },
    [onDateRangeChange]
  );

  return (
    <Dashboard className={className}>
      <DashboardHeader
        title="Dashboard Overview"
        description="Monitor key metrics and recent activity"
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onExportReport={onExportReport}
        onViewDetails={onViewDetails}
      />
      <DashboardKPICards cards={kpiCards} />
      <DashboardMetrics metrics={keyMetrics} />
      <DashboardLastActivity items={activityItems} pageSize={activityPageSize} />
    </Dashboard>
  );
}

export { DashboardOverviewPage as default, DashboardOverviewPage };
export {
  Dashboard,
  DashboardHeader,
  DashboardKPICard,
  DashboardKPICards,
  DashboardMetrics,
  DashboardLastActivity,
};
