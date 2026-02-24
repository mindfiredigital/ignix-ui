/**
 * @file index.tsx
 * @description Dashboard Overview Page component and types for docs.
 * Mirrors the Storybook implementation but lives in the docs UI layer
 * so documentation can import it directly without referencing Storybook.
 */

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { cn } from "@site/src/utils/cn";
import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import DatePicker from "../date-picker";
import type { DateRange } from "../date-picker";
import { Pagination } from "../table/pagination";

/**
 * Direction of a metric trend (up, down, or neutral).
 */
export type TrendDirection = "up" | "down" | "neutral";

/**
 * Single KPI card data (revenue, users, conversion, etc.).
 */
export interface KPICard {
  id: string;
  label: string;
  value: string;
  rawValue?: number;
  trend: TrendDirection;
  trendLabel: string;
  iconKey?: string;
}

/**
 * Key metric with trend indicator (for quick stats grid).
 */
export interface KeyMetric {
  id: string;
  label: string;
  value: string;
  trend: TrendDirection;
  trendValue: string;
}

/**
 * Single activity or transaction item for the latest activity list.
 */
export interface ActivityItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp: string;
  status?: string;
  amount?: string;
}

/**
 * Date range for filtering dashboard data.
 */
export interface DashboardDateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Props for the Dashboard Overview Page component.
 */
export interface DashboardOverviewPageProps {
  kpiCards?: KPICard[];
  keyMetrics?: KeyMetric[];
  activityItems?: ActivityItem[];
  activityPageSize?: number;
  onDateRangeChange?: (range: DashboardDateRange) => void;
  onExportReport?: () => void;
  onViewDetails?: () => void;
  dateRange?: DashboardDateRange;
  className?: string;
}

/** Props for the root Dashboard layout wrapper. */
export interface DashboardProps {
  children: React.ReactNode;
  className?: string;
}

/** Props for DashboardHeader (title, date range filter, CTAs). */
export interface DashboardHeaderProps {
  title?: string;
  description?: string;
  dateRange?: DashboardDateRange;
  onDateRangeChange?: (range: DashboardDateRange) => void;
  exportLabel?: string;
  onExportReport?: () => void;
  viewDetailsLabel?: string;
  onViewDetails?: () => void;
  className?: string;
  actions?: React.ReactNode;
}

/** Props for a single DashboardKPICard. */
export interface DashboardKPICardProps {
  card: KPICard;
  className?: string;
}

/** Props for the DashboardKPICards grid. */
export interface DashboardKPICardsProps {
  cards: KPICard[];
  className?: string;
}

/** Props for the DashboardMetrics section. */
export interface DashboardMetricsProps {
  metrics: KeyMetric[];
  title?: string;
  description?: string;
  className?: string;
}

/** Props for the DashboardLastActivity section. */
export interface DashboardLastActivityProps {
  items: ActivityItem[];
  pageSize?: number;
  title?: string;
  description?: string;
  emptyMessage?: string;
  className?: string;
}

/** Default number of activity items per page */
const DEFAULT_ACTIVITY_PAGE_SIZE = 5;

function toDashboardDateRange(value: Date | DateRange | null): DashboardDateRange {
  if (value == null) return { start: null, end: null };
  if (value instanceof Date) return { start: value, end: null };
  return { start: value.start ?? null, end: value.end ?? null };
}

function toPickerValue(range: DashboardDateRange | undefined): DateRange | null {
  if (!range?.start && !range?.end) return null;
  return { start: range.start ?? null, end: range.end ?? null };
}

const ActivityRow = React.memo(function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 py-3 px-4 rounded-lg",
        "hover:bg-muted/50 transition-colors border-b border-border/60 last:border-0"
      )}
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

function TrendIndicator({
  trend,
  trendValue,
  className,
}: {
  trend: TrendDirection;
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

function Dashboard({ children, className }: DashboardProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden",
        "bg-gradient-to-br from-background via-background to-muted/40",
        "text-foreground p-4 md:p-6",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary/25 via-cyan-400/15 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">{children}</div>
    </div>
  );
}

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
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

function DashboardKPICard({ card, className }: DashboardKPICardProps) {
  return (
    <Card variant="gradient" className={cn("flex flex-col", className)}>
      <CardHeader variant="compact">
        <CardTitle
          size="sm"
          className="font-medium text-sm text-white/90"
        >
          {card.label}
        </CardTitle>
      </CardHeader>
      <CardContent variant="compact" className="pt-0">
        <p className="text-2xl font-bold text-white">{card.value}</p>
        <TrendIndicator trend={card.trend} trendValue={card.trendLabel} className="mt-1" />
      </CardContent>
    </Card>
  );
}

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

function DashboardMetrics({
  metrics,
  title = "Key metrics",
  description = "Overview for selected period",
  className,
}: DashboardMetricsProps) {
  return (
    <section aria-label="Key metrics" className={className}>
      <Card variant="premium">
        <CardHeader variant="compact">
          <CardTitle size="md">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent variant="compact" className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-xl bg-gradient-to-tr from-primary/40 via-cyan-400/30 to-purple-500/40 p-[1px]"
              >
                <div
                  className={cn(
                    "p-4 rounded-[0.9rem] bg-muted/80 dark:bg-background/80 backdrop-blur-sm",
                    "flex flex-col gap-1"
                  )}
                >
                  <p className="text-sm text-muted-foreground truncate">{metric.label}</p>
                  <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                  <TrendIndicator trend={metric.trend} trendValue={metric.trendValue} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

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

const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  kpiCards,
  keyMetrics,
  activityItems,
  activityPageSize = DEFAULT_ACTIVITY_PAGE_SIZE,
  onDateRangeChange,
  onExportReport,
  onViewDetails,
  dateRange: controlledDateRange,
  className,
}) => {
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
      <DashboardKPICards cards={kpiCards ?? []} />
      <DashboardMetrics metrics={keyMetrics ?? []} />
      <DashboardLastActivity items={activityItems ?? []} pageSize={activityPageSize} />
    </Dashboard>
  );
};

export default DashboardOverviewPage;
export {
  DashboardOverviewPage,
  Dashboard,
  DashboardHeader,
  DashboardKPICard,
  DashboardKPICards,
  DashboardMetrics,
  DashboardLastActivity,
};


