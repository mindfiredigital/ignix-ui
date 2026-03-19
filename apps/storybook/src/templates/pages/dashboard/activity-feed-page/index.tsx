/**
 * @file index.tsx
 * @description Activity Feed Page template for Storybook. Provides a chronological event list
 * sorted newest-first, with event-type icons/badges, actor information, relative/absolute timestamps,
 * search, filtering, and pagination or infinite "load more" behaviour.
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
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  FileText,
  LogIn,
  MessageSquare,
  Settings,
  Shield,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { cn } from "../../../../../utils/cn";
import { Button } from "../../../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/card";
import { AnimatedInput } from "../../../../components/input";
import { Pagination } from "../../../../components/table/pagination";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Supported event types for the activity feed.
 */
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

/**
 * Minimal actor (user/system) shown for each event.
 */
export interface ActivityActor {
  /** Display name for the actor. */
  name: string;
  /** Optional short handle/role (e.g. "Admin", "@sara"). */
  meta?: string;
  /** Optional avatar URL. If omitted, initials avatar is shown. */
  avatarUrl?: string;
}

/**
 * A single activity event in the feed.
 */
export interface ActivityEvent {
  /** Unique id. */
  id: string;
  /** Event type used for icons, filters, and badges. */
  type: ActivityEventType;
  /** Actor performing the action (user/service). */
  actor: ActivityActor;
  /** When the event occurred (Date). */
  occurredAt: Date;
  /** Short, human readable title. */
  title: string;
  /** Primary description text. */
  description: string;
  /** Optional secondary metadata shown on the right (e.g. "Invoice #1024"). */
  contextLabel?: string;
}

/**
 * Timestamp display mode.
 */
export type TimestampMode = "relative" | "absolute";

/**
 * Paging behaviour for the feed.
 */
export type FeedPagingMode = "pagination" | "infinite";

/**
 * Filter state for the feed.
 */
export interface ActivityFeedFilterState {
  /** Selected event type; null means "All". */
  type: ActivityEventType | null;
  /** Search query applied to title/description/actor. */
  query: string;
}

/**
 * Props for the ActivityFeedPage template.
 */
export interface ActivityFeedPageProps {
  /** Events list (will be sorted newest-first internally). */
  events: ActivityEvent[];
  /** Optional title shown in header. */
  title?: string;
  /** Optional description shown under title. */
  description?: string;
  /** Timestamp display mode. */
  timestampMode?: TimestampMode;
  /** Paging mode: numbered pagination or infinite "load more". */
  pagingMode?: FeedPagingMode;
  /** Items per page / per load in paging mode. */
  pageSize?: number;
  /** Optional external filter state (controlled). */
  filterState?: ActivityFeedFilterState;
  /** Callback fired when filter/search changes. */
  onFilterChange?: (next: ActivityFeedFilterState) => void;
  /** Optional className for root container. */
  className?: string;
}

// =============================================================================
// DEFAULTS
// =============================================================================

/** Default items per page. */
const DEFAULT_PAGE_SIZE = 10;

/** Fixed ordering for filter pills. */
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

/** Human labels for event types. */
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

/** Badge intent mapping for event type. */
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

/**
 * Returns pill classes for the inline event type badge.
 */
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

/**
 * Returns a stable, case-insensitive query match against event fields.
 */
function matchesQuery(event: ActivityEvent, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
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

/**
 * Formats a Date as an absolute timestamp, readable and locale-aware.
 */
function formatAbsolute(date: Date): string {
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a Date into a relative timestamp like "2 hours ago".
 * Uses coarse units to keep UI scannable.
 */
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

/**
 * Returns a short date group label for the feed (e.g. "Today", "Yesterday", "Mar 12, 2026").
 */
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

/**
 * Returns an icon component for an event type.
 */
function EventTypeIcon({ type }: { type: ActivityEventType }) {
  const className = "h-4 w-4";
  switch (type) {
    case "authentication":
      return <LogIn className={className} aria-hidden />;
    case "user":
      return <UserPlus className={className} aria-hidden />;
    case "security":
      return <Shield className={className} aria-hidden />;
    case "system":
      return <Settings className={className} aria-hidden />;
    case "billing":
      return <BadgeCheck className={className} aria-hidden />;
    case "order":
      return <ShoppingCart className={className} aria-hidden />;
    case "comment":
      return <MessageSquare className={className} aria-hidden />;
    case "document":
      return <FileText className={className} aria-hidden />;
    case "schedule":
      return <CalendarClock className={className} aria-hidden />;
    case "warning":
      return <AlertTriangle className={className} aria-hidden />;
  }
}

/**
 * Inline event type pill (icon + label) designed for feed rows.
 */
const EventTypePill = React.memo(function EventTypePill({
  type,
}: {
  type: ActivityEventType;
}) {
  const badgeType = EVENT_TYPE_BADGE_TYPE[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1",
        "text-[11px] font-medium leading-none",
        getEventTypePillClasses(badgeType),
      )}
    >
      <EventTypeIcon type={type} />
      <span>{EVENT_TYPE_LABEL[type]}</span>
    </span>
  );
});

/**
 * Renders a compact avatar (image or initials).
 */
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

/**
 * A single feed row. Memoized to reduce re-renders when paging/filtering changes.
 */
const ActivityEventRow = React.memo(function ActivityEventRow({
  event,
  timestampMode,
  now,
}: {
  event: ActivityEvent;
  timestampMode: TimestampMode;
  now: Date;
}) {
  const timestamp = useMemo(() => {
    return timestampMode === "relative"
      ? formatRelative(event.occurredAt, now)
      : formatAbsolute(event.occurredAt);
  }, [event.occurredAt, now, timestampMode]);

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-border/60 bg-background/70 backdrop-blur-sm",
        "px-4 py-3",
        "hover:bg-muted/40 transition-colors",
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
});

// =============================================================================
// PAGE
// =============================================================================

/**
 * Activity Feed Page (pre-composed).
 */
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

  const nowRef = useRef<Date>(new Date());
  const [, forceTick] = useState(0);

  // Refresh "relative" timestamps periodically for realism in Storybook.
  useEffect(() => {
    if (timestampMode !== "relative") return;
    const interval = window.setInterval(() => {
      nowRef.current = new Date();
      forceTick((x) => x + 1);
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [timestampMode]);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
    );
  }, [events]);

  const eventTypeCounts = useMemo(() => {
    const counts: Partial<Record<ActivityEventType, number>> = {};
    for (const ev of sortedEvents) {
      counts[ev.type] = (counts[ev.type] ?? 0) + 1;
    }
    return counts;
  }, [sortedEvents]);

  const filtered = useMemo(() => {
    const type = effectiveFilter.type;
    return sortedEvents.filter((ev) => {
      if (type && ev.type !== type) return false;
      return matchesQuery(ev, effectiveFilter.query);
    });
  }, [sortedEvents, effectiveFilter.type, effectiveFilter.query]);

  const totalPages = useMemo(() => {
    if (pagingMode !== "pagination") return 1;
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize, pagingMode]);

  const pageEvents = useMemo(() => {
    if (pagingMode === "pagination") {
      const start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }
    return filtered.slice(0, infiniteCount);
  }, [filtered, pagingMode, page, pageSize, infiniteCount]);

  const grouped = useMemo(() => {
    const groups: { label: string; events: ActivityEvent[] }[] = [];
    const now = nowRef.current;

    for (const ev of pageEvents) {
      const label = getDateGroupLabel(ev.occurredAt, now);
      const last = groups[groups.length - 1];
      if (last && last.label === label) {
        last.events.push(ev);
      } else {
        groups.push({ label, events: [ev] });
      }
    }
    return groups;
  }, [pageEvents]);

  const setFilter = useCallback(
    (next: ActivityFeedFilterState) => {
      if (!filterState) setInternalFilter(next);
      onFilterChange?.(next);
    },
    [filterState, onFilterChange],
  );

  const handleSelectType = useCallback(
    (type: ActivityEventType | null) => {
      setPage(1);
      setInfiniteCount(pageSize);
      setFilter({ ...effectiveFilter, type });
    },
    [effectiveFilter, pageSize, setFilter],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setPage(1);
      setInfiniteCount(pageSize);
      setFilter({ ...effectiveFilter, query });
    },
    [effectiveFilter, pageSize, setFilter],
  );

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const canLoadMore = pagingMode === "infinite" && infiniteCount < filtered.length;
  const handleLoadMore = useCallback(() => {
    setInfiniteCount((prev) => Math.min(filtered.length, prev + pageSize));
  }, [filtered.length, pageSize]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
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
          handleLoadMore();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [pagingMode, canLoadMore, handleLoadMore]);

  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  // Keep pagination compact on very small screens.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 480px)");
    const update = () => setIsNarrowViewport(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

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
              value={effectiveFilter.query}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <Card variant="default" className="border border-border/60 shadow-sm">
          <CardHeader variant="compact" className="gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle size="md">Events</CardTitle>
              <CardDescription>
                Newest first · Filter by type · Search across titles, actors, and descriptions
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={effectiveFilter.type == null ? "default" : "outline"}
                onClick={() => handleSelectType(null)}
              >
                All{" "}
                <span className="ml-2 text-xs text-muted-foreground">
                  {sortedEvents.length}
                </span>
              </Button>

              {EVENT_TYPE_ORDER.map((type) => {
                const count = eventTypeCounts[type] ?? 0;
                const active = effectiveFilter.type === type;
                return (
                  <Button
                    key={type}
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => handleSelectType(type)}
                    disabled={count === 0}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center justify-center rounded-md border border-border/60 bg-muted/40 px-1.5 py-1">
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
                <div className="space-y-6">
                  {grouped.map((group) => (
                    <section key={group.label} aria-label={`Events: ${group.label}`}>
                      <div className="sticky top-0 z-10 -mx-2 mb-3 px-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                          <span className="font-medium text-foreground/90">
                            {group.label}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {group.events.map((ev) => (
                          <ActivityEventRow
                            key={ev.id}
                            event={ev}
                            now={nowRef.current}
                            timestampMode={timestampMode}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {pagingMode === "pagination" ? (
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-max">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        siblingCount={isNarrowViewport ? 0 : 1}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 pt-2">
                    {canLoadMore ? (
                      <Button variant="outline" size="md" onClick={handleLoadMore}>
                        Load more
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        You’ve reached the end of the feed.
                      </p>
                    )}
                    <div ref={sentinelRef} aria-hidden className="h-1 w-full" />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ActivityFeedPage;

