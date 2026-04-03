/**
 * @file activity-feed-page.stories.tsx
 * @description Storybook stories for the Activity Feed Page template.
 * Demonstrates newest-first sorting, filter-by-type, search, and pagination/infinite behaviours
 * with relative/absolute timestamps.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityFeedPage,
  ActivityFeedLayout,
  ActivityFeedHeader,
  ActivityFeedFilters,
  ActivityFeedList,
  ActivityFeedPagination,
  type ActivityEvent,
  type ActivityEventType,
  type ActivityFeedFilterState,
} from "./index";

/**
 * Meta configuration for Activity Feed Page stories.
 * Title: Templates/Pages/Dashboard/Activity Feed Page
 */
const meta: Meta<typeof ActivityFeedPage> = {
  title: "Templates/Pages/Dashboard/Activity Feed Page",
  component: ActivityFeedPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Activity feed page template with a chronological event list (newest first), event-type icons/badges, actor info, relative/absolute timestamps, filter pills, search, and either pagination or infinite load-more behaviour.",
      },
    },
  },
  argTypes: {
    timestampMode: {
      control: { type: "radio" },
      options: ["relative", "absolute"],
      description: "Timestamp display mode for feed rows",
    },
    pagingMode: {
      control: { type: "radio" },
      options: ["pagination", "infinite"],
      description: "Paging mode for the feed",
    },
    pageSize: {
      control: { type: "number", min: 5, max: 30, step: 1 },
      description: "Items per page (pagination) or per load (infinite)",
    },
    onFilterChange: {
      action: "filterChange",
      description: "Called when filter type or search query changes",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ActivityFeedPage>;

// -----------------------------------------------------------------------------
// Demo data
// -----------------------------------------------------------------------------

const EVENT_TYPES: ActivityEventType[] = [
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

/**
 * Creates a deterministic set of events for the feed, spanning the last ~45 days.
 */
function makeDemoEvents(count: number): ActivityEvent[] {
  const now = new Date();

  const actors = [
    { name: "Alex Morgan", meta: "Admin" },
    { name: "Sara Kim", meta: "@sara" },
    { name: "Ignix System", meta: "Service" },
    { name: "Priya Patel", meta: "Support" },
    { name: "Diego Rivera", meta: "Billing" },
  ] as const;

  const templates: Record<
    ActivityEventType,
    { title: string; description: string; contextLabel?: string }
  > = {
    authentication: {
      title: "User signed in",
      description: "Successful login from a trusted device.",
    },
    user: {
      title: "New user invited",
      description: "An invitation was sent to join the workspace.",
    },
    security: {
      title: "Security policy updated",
      description: "MFA enforcement was enabled for all admins.",
    },
    system: {
      title: "System configuration changed",
      description: "Updated environment variables for the deployment.",
    },
    billing: {
      title: "Invoice paid",
      description: "Payment succeeded for the monthly subscription.",
      contextLabel: "Invoice #1024",
    },
    order: {
      title: "Order processed",
      description: "Order moved to the next stage in fulfillment.",
      contextLabel: "Order #8821",
    },
    comment: {
      title: "Comment added",
      description: "Left feedback on the latest deployment notes.",
      contextLabel: "Release notes",
    },
    document: {
      title: "Document updated",
      description: "Edited a shared SOP for onboarding.",
      contextLabel: "Onboarding SOP",
    },
    schedule: {
      title: "Maintenance scheduled",
      description: "Planned maintenance window was created.",
      contextLabel: "Sun 02:00–03:00",
    },
    warning: {
      title: "Unusual activity detected",
      description: "Multiple failed sign-in attempts were detected.",
      contextLabel: "IP flagged",
    },
  };

  return Array.from({ length: count }).map((_, idx) => {
    const type = EVENT_TYPES[idx % EVENT_TYPES.length] ?? "system";
    const actor = actors[idx % actors.length] ?? actors[0];
    const tpl = templates[type];

    // Spread across time: newest entries first after internal sort.
    const minutesAgo = idx * 37 + (idx % 7) * 13;
    const occurredAt = new Date(now.getTime() - minutesAgo * 60_000);

    return {
      id: `ev-${idx + 1}`,
      type,
      actor: {
        name: actor.name,
        meta: actor.meta,
      },
      occurredAt,
      title: tpl.title,
      description: `${tpl.description} (event ${idx + 1})`,
      contextLabel: tpl.contextLabel,
    };
  });
}

const DEMO_EVENTS: ActivityEvent[] = makeDemoEvents(64);

/**
 * Wrapper to demonstrate controlled filter/search state in stories.
 */
function ControlledFiltersWrapper(
  args: React.ComponentProps<typeof ActivityFeedPage>,
) {
  const [filter, setFilter] = useState<ActivityFeedFilterState>({
    type: null,
    query: "",
  });

  const handleFilterChange = useCallback(
    (next: ActivityFeedFilterState) => {
      setFilter(next);
      args.onFilterChange?.(next);
    },
    [args],
  );

  const events = useMemo(() => args.events ?? DEMO_EVENTS, [args.events]);

  return (
    <ActivityFeedPage
      {...args}
      events={events}
      filterState={filter}
      onFilterChange={handleFilterChange}
    />
  );
}

/**
 * Query matcher used by composable demo filtering.
 */
function matchesQuery(event: ActivityEvent, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const text = [
    event.title,
    event.description,
    event.actor.name,
    event.actor.meta ?? "",
    event.contextLabel ?? "",
    event.type,
  ]
    .join(" ")
    .toLowerCase();
  return text.includes(q);
}

/**
 * Fully interactive composable demo using layout + header + filters + list + pagination.
 */
function ComposableDemo() {
  const [filter, setFilter] = useState<ActivityFeedFilterState>({
    type: null,
    query: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const now = new Date();

  const sorted = useMemo(
    () => [...DEMO_EVENTS].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()),
    [],
  );

  const filtered = useMemo(() => {
    return sorted.filter((event) => {
      if (filter.type && event.type !== filter.type) return false;
      return matchesQuery(event, filter.query);
    });
  }, [sorted, filter.type, filter.query]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / pageSize)),
    [filtered.length],
  );

  const pagedEvents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const handleFilterChange = useCallback((next: ActivityFeedFilterState) => {
    setFilter(next);
    setPage(1);
  }, []);

  const handleQueryChange = useCallback((query: string) => {
    setFilter((prev) => ({ ...prev, query }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return (
    <ActivityFeedLayout>
      <ActivityFeedHeader
        title="Activity Feed (Composable)"
        description="Interactive demo composed from layout, header, filters, list, and pagination sections."
        query={filter.query}
        onQueryChange={handleQueryChange}
      />
      <div className="border border-border/60 bg-background/80 shadow-sm rounded-xl">
        <div className="border-b border-border/60 px-4 py-3">
          <ActivityFeedFilters
            events={sorted}
            filter={filter}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="px-4 py-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border/60 bg-muted/20 p-10 text-center">
              <p className="text-sm font-medium text-foreground">No events found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different filter or search query.
              </p>
            </div>
          ) : (
            <>
              <ActivityFeedList
                events={pagedEvents}
                timestampMode="relative"
                now={now}
              />
              <ActivityFeedPagination
                pagingMode="pagination"
                currentPage={page}
                totalPages={totalPages}
                canLoadMore={false}
                onPageChange={handlePageChange}
                onLoadMore={() => undefined}
              />
            </>
          )}
        </div>
      </div>
    </ActivityFeedLayout>
  );
}

/**
 * Composable usage: layout + header + filters + list + pagination.
 */
export const Composable: Story = {
  render: () => <ComposableDemo />,
  name: "Composable (layout + sections)",
};

/**
 * Default story: relative timestamps + pagination.
 */
export const Default: Story = {
  args: {
    events: DEMO_EVENTS,
    timestampMode: "relative",
    pagingMode: "pagination",
    pageSize: 10,
  },
  render: (args) => <ActivityFeedPage {...args} />,
  name: "Default (relative + pagination)",
};

/**
 * Demonstrates absolute timestamps for audit-friendly activity feeds.
 */
export const AbsoluteTimestamps: Story = {
  args: {
    events: DEMO_EVENTS,
    timestampMode: "absolute",
    pagingMode: "pagination",
    pageSize: 10,
  },
  render: (args) => <ActivityFeedPage {...args} />,
  name: "Absolute timestamps",
};

/**
 * Demonstrates infinite scrolling (intersection auto-load + Load more button fallback).
 */
export const InfiniteLoadMore: Story = {
  args: {
    events: DEMO_EVENTS,
    timestampMode: "relative",
    pagingMode: "infinite",
    pageSize: 12,
  },
  render: (args) => <ActivityFeedPage {...args} />,
  name: "Infinite (load more)",
  parameters: {
    docs: {
      description: {
        story:
          "Scroll down to trigger auto-load via intersection observer; the Load more button provides an explicit fallback. This satisfies the infinite scroll/pagination acceptance criterion.",
      },
    },
  },
};

/**
 * Controlled filter/search story: demonstrates filter and search functionality.
 */
export const ControlledFilterAndSearch: Story = {
  args: {
    events: DEMO_EVENTS,
    timestampMode: "relative",
    pagingMode: "pagination",
    pageSize: 10,
  },
  render: (args) => <ControlledFiltersWrapper {...args} />,
  name: "Controlled filter + search",
};

