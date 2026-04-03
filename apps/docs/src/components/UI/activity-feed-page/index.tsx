/**
 * @file index.tsx
 * @description Activity Feed Page template and types for docs.
 * Mirrors the Storybook implementation but lives in the docs UI layer
 * so documentation can import it directly without referencing Storybook.
 */

"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityLogIcon,
  CalendarIcon,
  CheckCircledIcon,
  FileTextIcon,
  GearIcon,
  LightningBoltIcon,
  LockClosedIcon,
  Pencil2Icon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { cn } from "@site/src/utils/cn";
import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { AnimatedInput } from "../input";
import { Pagination } from "../table/pagination";

// =============================================================================
// TYPES
// =============================================================================

/** Supported event types for the activity feed. */
export type ActivityEventType =
  | "authentication"
  | "user"
  | "security"
  | "system"
  | "billing"
  | "order"
  | "comment"
  | "document"
  | "schedule"
  | "warning";

/** Minimal actor (user/system) shown for each event. */
export interface ActivityActor {
  name: string;
  meta?: string;
  avatarUrl?: string;
}

/** A single activity event in the feed. */
export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actor: ActivityActor;
  occurredAt: Date;
  title: string;
  description: string;
  contextLabel?: string;
}

/** Timestamp display mode. */
export type TimestampMode = "relative" | "absolute";

/** Paging behaviour for the feed. */
export type FeedPagingMode = "pagination" | "infinite";

/** Filter state for the feed. */
export interface ActivityFeedFilterState {
  type: ActivityEventType | null;
  query: string;
}

/** Props for the ActivityFeedPage template. */
export interface ActivityFeedPageProps {
  events: ActivityEvent[];
  title?: string;
  description?: string;
  timestampMode?: TimestampMode;
  pagingMode?: FeedPagingMode;
  pageSize?: number;
  filterState?: ActivityFeedFilterState;
  onFilterChange?: (next: ActivityFeedFilterState) => void;
  className?: string;
}

/** Props for the high-level layout wrapper. */
export interface ActivityFeedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Props for the page header (title + description + search input). */
export interface ActivityFeedHeaderProps {
  title?: string;
  description?: string;
  query: string;
  onQueryChange: (value: string) => void;
}

/** Props for the filters section (event type chips). */
export interface ActivityFeedFiltersProps {
  events: ActivityEvent[];
  filter: ActivityFeedFilterState;
  onFilterChange: (next: ActivityFeedFilterState) => void;
}

/** Props for the grouped list section. */
export interface ActivityFeedListProps {
  events: ActivityEvent[];
  timestampMode: TimestampMode;
  now: Date;
}

/** Props for pagination / infinite scroll controls. */
export interface ActivityFeedPaginationProps {
  pagingMode: FeedPagingMode;
  currentPage: number;
  totalPages: number;
  canLoadMore: boolean;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
}

// =============================================================================
// DEFAULTS
// =============================================================================

const DEFAULT_PAGE_SIZE = 10;

const EVENT_TYPE_ORDER: ActivityEventType[] = [
  "authentication",
  "user",
  "security",
  "system",
  "billing",
  "order",
  "comment",
  "document",
  "schedule",
  "warning",
];

const EVENT_TYPE_LABEL: Record<ActivityEventType, string> = {
  authentication: "Auth",
  user: "User",
  security: "Security",
  system: "System",
  billing: "Billing",
  order: "Order",
  comment: "Comment",
  document: "Document",
  schedule: "Schedule",
  warning: "Warning",
};

const EVENT_TYPE_BADGE_TYPE: Record<
  ActivityEventType,
  "primary" | "secondary" | "success" | "warning" | "error"
> = {
  authentication: "secondary",
  user: "primary",
  security: "warning",
  system: "secondary",
  billing: "success",
  order: "primary",
  comment: "secondary",
  document: "secondary",
  schedule: "primary",
  warning: "error",
};

// =============================================================================
// HELPERS
// =============================================================================

function getEventTypePillClasses(
  kind: "primary" | "secondary" | "success" | "warning" | "error",
): string {
  switch (kind) {
    case "success":
      return "border-success/25 bg-success/10 text-success";
    case "warning":
      return "border-warning/30 bg-warning/10 text-warning";
    case "error":
      return "border-destructive/25 bg-destructive/10 text-destructive";
    case "secondary":
      return "border-border/60 bg-muted/40 text-muted-foreground";
    case "primary":
      return "border-primary/25 bg-primary/10 text-primary";
  }
}

function getEventTypeAccentClasses(type: ActivityEventType): {
  iconChip: string;
  rowAccent: string;
  dotAccent: string;
} {
  switch (type) {
    case "billing":
      return {
        iconChip: "border-success/30 bg-success/10 text-success",
        rowAccent: "border-l-success/50",
        dotAccent: "bg-success/80",
      };
    case "security":
      return {
        iconChip: "border-warning/35 bg-warning/10 text-warning",
        rowAccent: "border-l-warning/60",
        dotAccent: "bg-warning/80",
      };
    case "warning":
      return {
        iconChip: "border-destructive/30 bg-destructive/10 text-destructive",
        rowAccent: "border-l-destructive/60",
        dotAccent: "bg-destructive/80",
      };
    case "user":
    case "order":
    case "schedule":
      return {
        iconChip: "border-primary/30 bg-primary/10 text-primary",
        rowAccent: "border-l-primary/55",
        dotAccent: "bg-primary/80",
      };
    case "authentication":
    case "system":
    case "comment":
    case "document":
      return {
        iconChip: "border-border/60 bg-muted/40 text-muted-foreground",
        rowAccent: "border-l-cyan-400/60 dark:border-l-cyan-300/55",
        dotAccent: "bg-cyan-500/80 dark:bg-cyan-300/80",
      };
  }
}

function matchesQuery(event: ActivityEvent, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    event.title,
    event.description,
    event.actor.name,
    event.actor.meta ?? "",
    EVENT_TYPE_LABEL[event.type],
    event.contextLabel ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function formatAbsolute(date: Date): string {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  const minutes = Math.floor(diffSec / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (diffSec < 45) return "just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function getDateGroupLabel(date: Date, now: Date): string {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfThatDay = new Date(date);
  startOfThatDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (startOfToday.getTime() - startOfThatDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function EventTypeIcon({ type }: { type: ActivityEventType }) {
  const className = "h-4 w-4";
  switch (type) {
    case "authentication":
      return <LockClosedIcon className={className} aria-hidden />;
    case "user":
      return <PersonIcon className={className} aria-hidden />;
    case "security":
      return <ActivityLogIcon className={className} aria-hidden />;
    case "system":
      return <GearIcon className={className} aria-hidden />;
    case "billing":
      return <CheckCircledIcon className={className} aria-hidden />;
    case "order":
      return <RocketIcon className={className} aria-hidden />;
    case "comment":
      return <Pencil2Icon className={className} aria-hidden />;
    case "document":
      return <FileTextIcon className={className} aria-hidden />;
    case "schedule":
      return <CalendarIcon className={className} aria-hidden />;
    case "warning":
      return <LightningBoltIcon className={className} aria-hidden />;
  }
}

const EventTypePill = React.memo(function EventTypePill({
  type,
}: {
  type: ActivityEventType;
}) {
  const badgeType = EVENT_TYPE_BADGE_TYPE[type];
  const accent = getEventTypeAccentClasses(type);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1",
        "text-[11px] font-medium leading-none",
        getEventTypePillClasses(badgeType),
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md border px-1 py-0.5",
          accent.iconChip,
        )}
      >
        <EventTypeIcon type={type} />
      </span>
      <span>{EVENT_TYPE_LABEL[type]}</span>
    </span>
  );
});

const ActorAvatar = React.memo(function ActorAvatar({
  actor,
}: {
  actor: ActivityActor;
}) {
  const initials = useMemo(() => {
    const parts = actor.name.trim().split(/\s+/).slice(0, 2);
    return parts
      .map((p) => (p[0] ? p[0].toUpperCase() : ""))
      .join("");
  }, [actor.name]);

  if (actor.avatarUrl) {
    return (
      <img
        src={actor.avatarUrl}
        alt={actor.name}
        className="h-9 w-9 rounded-full object-cover border border-border/60"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn(
        "h-9 w-9 rounded-full border border-border/60",
        "bg-muted/60 dark:bg-background/60",
        "flex items-center justify-center",
        "text-xs font-semibold text-foreground",
      )}
      aria-hidden
      title={actor.name}
    >
      {initials || "?"}
    </div>
  );
});

const ActivityEventRowInner = function ActivityEventRowInner({
  event,
  timestampMode,
  now,
}: {
  event: ActivityEvent;
  timestampMode: TimestampMode;
  now: Date;
}) {
  const timestamp = useMemo(
    () =>
      timestampMode === "relative"
        ? formatRelative(event.occurredAt, now)
        : formatAbsolute(event.occurredAt),
    [event.occurredAt, now, timestampMode],
  );
  const accent = getEventTypeAccentClasses(event.type);

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-border/60 border-l-4 bg-background/70 backdrop-blur-sm",
        "px-4 py-3",
        "hover:bg-muted/40 transition-colors",
        accent.rowAccent,
      )}
      data-testid={`activity-event-${event.id}`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <ActorAvatar actor={event.actor} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {event.title}
            </h3>
            <span className="sr-only">Event type</span>
            <EventTypePill type={event.type} />
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/90">
              {event.actor.name}
            </span>
            {event.actor.meta && (
              <>
                <span aria-hidden>·</span>
                <span>{event.actor.meta}</span>
              </>
            )}
            {event.contextLabel && (
              <>
                <span aria-hidden>·</span>
                <span className="truncate">{event.contextLabel}</span>
              </>
            )}
          </div>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-1">
        <time
          className="text-xs text-muted-foreground whitespace-nowrap"
          dateTime={event.occurredAt.toISOString()}
          title={formatAbsolute(event.occurredAt)}
        >
          {timestamp}
        </time>
      </div>
    </div>
  );
};

export const ActivityEventRow = React.memo(ActivityEventRowInner);

// =============================================================================
// LAYOUT & SECTIONS
// =============================================================================

export function ActivityFeedLayout({ children, className }: ActivityFeedLayoutProps) {
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

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-6">
        {children}
      </div>
    </div>
  );
}

export function ActivityFeedHeader({
  title = "Activity Feed",
  description = "Track recent actions, system updates, and user activity.",
  query,
  onQueryChange,
}: ActivityFeedHeaderProps) {
  const handleChange = useCallback(
    (value: string) => {
      onQueryChange(value);
    },
    [onQueryChange],
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

      <div className="w-full sm:w-[360px]">
        <AnimatedInput
          placeholder="Search activity"
          variant="clean"
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export function ActivityFeedFilters({
  events,
  filter,
  onFilterChange,
}: ActivityFeedFiltersProps) {
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
      ),
    [events],
  );

  const counts = useMemo(() => {
    const map: Partial<Record<ActivityEventType, number>> = {};
    for (const ev of sortedEvents) {
      map[ev.type] = (map[ev.type] ?? 0) + 1;
    }
    return map;
  }, [sortedEvents]);

  const handleSelectType = useCallback(
    (type: ActivityEventType | null) => {
      onFilterChange({ ...filter, type });
    },
    [filter, onFilterChange],
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={filter.type == null ? "default" : "outline"}
        onClick={() => handleSelectType(null)}
      >
        All{" "}
        <span className="ml-2 text-xs text-muted-foreground">
          {sortedEvents.length}
        </span>
      </Button>

      {EVENT_TYPE_ORDER.map((type) => {
        const count = counts[type] ?? 0;
        const active = filter.type === type;
        const accent = getEventTypeAccentClasses(type);
        return (
          <Button
            key={type}
            size="sm"
            variant={active ? "default" : "outline"}
            onClick={() => handleSelectType(type)}
            disabled={count === 0}
          >
            <span className="inline-flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-md border px-1.5 py-1",
                  active
                    ? "border-white/25 bg-white/15 text-primary-foreground"
                    : accent.iconChip,
                )}
              >
                <EventTypeIcon type={type} />
              </span>
              <span>{EVENT_TYPE_LABEL[type]}</span>
              <span className="text-xs text-muted-foreground">
                {count}
              </span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}

export function ActivityFeedList({
  events,
  timestampMode,
  now,
}: ActivityFeedListProps) {
  const grouped = useMemo(() => {
    const groups: { label: string; events: ActivityEvent[] }[] = [];
    for (const ev of events) {
      const label = getDateGroupLabel(ev.occurredAt, now);
      const last = groups[groups.length - 1];
      if (last && last.label === label) {
        last.events.push(ev);
      } else {
        groups.push({ label, events: [ev] });
      }
    }
    return groups;
  }, [events, now]);

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <section key={group.label} aria-label={`Events: ${group.label}`}>
          <div className="sticky top-0 z-10 -mx-2 mb-3 px-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-gradient-to-r from-primary/10 via-cyan-400/10 to-purple-500/10 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  group.events[0]
                    ? getEventTypeAccentClasses(group.events[0].type).dotAccent
                    : "bg-primary/70",
                )}
                aria-hidden
              />
              <span className="font-medium text-foreground/90">
                {group.label}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {group.events.map((event) => (
              <ActivityEventRow
                key={event.id}
                event={event}
                now={now}
                timestampMode={timestampMode}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ActivityFeedPagination({
  pagingMode,
  currentPage,
  totalPages,
  canLoadMore,
  onPageChange,
  onLoadMore,
}: ActivityFeedPaginationProps) {
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 480px)");
    const update = () => setIsNarrowViewport(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (pagingMode !== "infinite") return;
    if (!canLoadMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [pagingMode, canLoadMore, onLoadMore]);

  if (pagingMode === "pagination") {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-max">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            siblingCount={isNarrowViewport ? 0 : 1}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      {canLoadMore ? (
        <Button variant="outline" size="md" onClick={onLoadMore}>
          Load more
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          You’ve reached the end of the feed.
        </p>
      )}
      <div ref={sentinelRef} aria-hidden className="h-1 w-full" />
    </div>
  );
}

// =============================================================================
// PAGE (PRE-COMPOSED)
// =============================================================================

export function ActivityFeedPage({
  events,
  title = "Activity Feed",
  description = "Track recent actions, system updates, and user activity.",
  timestampMode = "relative",
  pagingMode = "pagination",
  pageSize = DEFAULT_PAGE_SIZE,
  filterState,
  onFilterChange,
  className,
}: ActivityFeedPageProps) {
  const [internalFilter, setInternalFilter] = useState<ActivityFeedFilterState>({
    type: null,
    query: "",
  });
  const effectiveFilter = filterState ?? internalFilter;

  const [page, setPage] = useState(1);
  const [infiniteCount, setInfiniteCount] = useState(pageSize);

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (timestampMode !== "relative") return;
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [timestampMode]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
      ),
    [events],
  );

  const filtered = useMemo(
    () =>
      sortedEvents.filter((ev) => {
        if (effectiveFilter.type && ev.type !== effectiveFilter.type) return false;
        return matchesQuery(ev, effectiveFilter.query);
      }),
    [sortedEvents, effectiveFilter.type, effectiveFilter.query],
  );

  const totalPages = useMemo(
    () =>
      pagingMode === "pagination"
        ? Math.max(1, Math.ceil(filtered.length / pageSize))
        : 1,
    [filtered.length, pageSize, pagingMode],
  );

  const pageEvents = useMemo(() => {
    if (pagingMode === "pagination") {
      const start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }
    return filtered.slice(0, infiniteCount);
  }, [filtered, pagingMode, page, pageSize, infiniteCount]);

  const canLoadMore =
    pagingMode === "infinite" && infiniteCount < filtered.length;

  const setFilter = useCallback(
    (next: ActivityFeedFilterState) => {
      // Reset paging whenever the filter/search criteria changes
      // so the user always lands on the first page of the new results.
      setPage(1);
      setInfiniteCount(pageSize);
      if (!filterState) setInternalFilter(next);
      onFilterChange?.(next);
    },
    [filterState, onFilterChange, pageSize],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setFilter({ ...effectiveFilter, query });
    },
    [effectiveFilter, pageSize, setFilter],
  );

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleLoadMore = useCallback(() => {
    setInfiniteCount((prev) => Math.min(filtered.length, prev + pageSize));
  }, [filtered.length, pageSize]);

  return (
    <ActivityFeedLayout className={className}>
      <div className="space-y-6">
        <ActivityFeedHeader
          title={title}
          description={description}
          query={effectiveFilter.query}
          onQueryChange={handleSearchChange}
        />

        <Card variant="default" className="border border-border/60 shadow-sm">
          <CardHeader variant="compact" className="gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle size="md">Events</CardTitle>
              <CardDescription>
                Newest first · Filter by type · Search across titles, actors, and
                descriptions
              </CardDescription>
            </div>

            <ActivityFeedFilters
              events={sortedEvents}
              filter={effectiveFilter}
              onFilterChange={setFilter}
            />
          </CardHeader>

          <CardContent variant="compact" className="space-y-5">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-10 text-center">
                <p className="text-sm font-medium text-foreground">
                  No events found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different filter or search query.
                </p>
              </div>
            ) : (
              <>
                <ActivityFeedList
                  events={pageEvents}
                  timestampMode={timestampMode}
                  now={now}
                />
                <ActivityFeedPagination
                  pagingMode={pagingMode}
                  currentPage={page}
                  totalPages={totalPages}
                  canLoadMore={canLoadMore}
                  onPageChange={handlePageChange}
                  onLoadMore={handleLoadMore}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ActivityFeedLayout>
  );
}

export default ActivityFeedPage;

