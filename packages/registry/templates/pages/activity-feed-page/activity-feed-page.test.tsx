/**
 * @file activity-feed-page.test.tsx
 * @description Unit tests for the Activity Feed Page registry template and
 * its composable building blocks.
 */

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import {
  ActivityFeedPage,
  ActivityFeedHeader,
  ActivityFeedFilters,
  ActivityFeedList,
  ActivityFeedPagination,
  ActivityEventRow,
  type ActivityEvent,
  type ActivityFeedFilterState,
} from ".";

/* -------------------------------------------------------------------------- */
/*                                Mock Ignix UI                               */
/* -------------------------------------------------------------------------- */

vi.mock("@ignix-ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@ignix-ui/card", () => {
  const Card = ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  );
  const CardHeader = ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  );
  const CardTitle = ({ children, ...props }: { children: React.ReactNode }) => (
    <h2 {...props}>{children}</h2>
  );
  const CardDescription = ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  }) => <p {...props}>{children}</p>;
  const CardContent = ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  }) => <div {...props}>{children}</div>;
  return { Card, CardHeader, CardTitle, CardDescription, CardContent };
});

vi.mock("@ignix-ui/input", () => ({
  AnimatedInput: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
  }) => (
    <input
      aria-label={placeholder ?? "input"}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

vi.mock("@ignix-ui/pagination", () => ({
  Pagination: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button type="button" onClick={() => onPageChange(1)}>
        Go page 1
      </button>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, 2))}
      >
        Go page 2
      </button>
    </div>
  ),
}));

/* -------------------------------------------------------------------------- */
/*                              Browser API mocks                             */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  vi.clearAllMocks();

  // matchMedia is used by pagination for compact mode.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // IntersectionObserver is used for infinite mode.
  class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

/* -------------------------------------------------------------------------- */
/*                                   Fixtures                                 */
/* -------------------------------------------------------------------------- */

function makeEvent(
  id: string,
  type: ActivityEvent["type"],
  title: string,
  minutesAgo: number,
  extra?: Partial<ActivityEvent>,
): ActivityEvent {
  const now = new Date("2026-03-18T12:00:00.000Z");
  return {
    id,
    type,
    actor: {
      name: "Alex Morgan",
      meta: "Admin",
    },
    occurredAt: new Date(now.getTime() - minutesAgo * 60_000),
    title,
    description: `${title} description`,
    ...extra,
  };
}

const FEED_EVENTS: ActivityEvent[] = [
  makeEvent("e-old", "document", "Document updated", 240),
  makeEvent("e-mid", "billing", "Invoice paid", 120, {
    contextLabel: "Invoice #1234",
  }),
  makeEvent("e-new", "authentication", "User signed in", 30),
  makeEvent("e-user", "user", "User invited", 90),
  makeEvent("e-warning", "warning", "Suspicious login attempt", 10),
];

/* -------------------------------------------------------------------------- */
/*                                 Test Suite                                 */
/* -------------------------------------------------------------------------- */

describe("ActivityFeedPage template", () => {
  it("renders heading and events section", () => {
    render(<ActivityFeedPage events={FEED_EVENTS} />);

    expect(
      screen.getByRole("heading", { name: /activity feed/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  it("sorts events newest-first regardless of input order", () => {
    const { container } = render(<ActivityFeedPage events={FEED_EVENTS} />);
    const rows = container.querySelectorAll("[data-testid^='activity-event-']");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveAttribute("data-testid", "activity-event-e-warning");
  });

  it("filters events by selected event type", async () => {
    const user = userEvent.setup();
    render(<ActivityFeedPage events={FEED_EVENTS} />);

    await user.click(screen.getByRole("button", { name: /billing/i }));

    expect(screen.getByText("Invoice paid")).toBeInTheDocument();
    expect(screen.queryByText("User signed in")).not.toBeInTheDocument();
  });

  it("filters events by search query", async () => {
    const user = userEvent.setup();
    render(<ActivityFeedPage events={FEED_EVENTS} />);

    await user.type(screen.getByPlaceholderText(/search activity/i), "invoice");

    expect(screen.getByText("Invoice paid")).toBeInTheDocument();
    expect(screen.queryByText("User invited")).not.toBeInTheDocument();
  });

  it("shows empty state when search has no matches", async () => {
    const user = userEvent.setup();
    render(<ActivityFeedPage events={FEED_EVENTS} />);

    await user.type(screen.getByPlaceholderText(/search activity/i), "not-found");

    expect(screen.getByText("No events found")).toBeInTheDocument();
  });

  it("renders relative timestamps by default", () => {
    const { container } = render(
      <ActivityFeedPage events={[makeEvent("one", "user", "User invited", 120)]} />,
    );
    const timeEl = container.querySelector("time");
    expect(timeEl).toBeInTheDocument();
    expect(timeEl?.textContent ?? "").toMatch(/(ago|just now|min|hour|day|week|month|year)/i);
  });

  it("renders absolute timestamps when timestampMode is absolute", () => {
    render(
      <ActivityFeedPage
        events={[makeEvent("one", "user", "User invited", 120)]}
        timestampMode="absolute"
      />,
    );

    // In absolute mode we avoid "ago" style output.
    expect(screen.queryByText(/ago/i)).not.toBeInTheDocument();
  });

  it("supports pagination mode and page switching", async () => {
    const user = userEvent.setup();
    const events = Array.from({ length: 12 }).map((_, i) =>
      makeEvent(`id-${i + 1}`, "user", `Event ${i + 1}`, i),
    );
    render(<ActivityFeedPage events={events} pageSize={10} pagingMode="pagination" />);

    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    // Event 12 should be on page 1 (newest first by lowest minutesAgo index).
    expect(screen.getByText("Event 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /go page 2/i }));
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
  });

  it("supports infinite mode with load more button", async () => {
    const user = userEvent.setup();
    const events = Array.from({ length: 13 }).map((_, i) =>
      makeEvent(`inf-${i + 1}`, "system", `Infinite ${i + 1}`, i),
    );
    render(<ActivityFeedPage events={events} pageSize={5} pagingMode="infinite" />);

    expect(screen.getByText("Infinite 1")).toBeInTheDocument();
    expect(screen.queryByText("Infinite 10")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /load more/i }));
    expect(screen.getByText("Infinite 10")).toBeInTheDocument();
  });

  it("calls onFilterChange in controlled mode", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const controlledFilter: ActivityFeedFilterState = { type: null, query: "" };

    render(
      <ActivityFeedPage
        events={FEED_EVENTS}
        filterState={controlledFilter}
        onFilterChange={onFilterChange}
      />,
    );

    await user.type(screen.getByPlaceholderText(/search activity/i), "alex");
    expect(onFilterChange).toHaveBeenCalled();
    expect(onFilterChange).toHaveBeenCalledWith({
      type: null,
      query: "a",
    });
  });
});

describe("Composable components", () => {
  it("ActivityFeedHeader calls onQueryChange", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();

    render(
      <ActivityFeedHeader
        title="Custom Feed"
        description="Demo"
        query=""
        onQueryChange={onQueryChange}
      />,
    );

    await user.type(screen.getByPlaceholderText(/search activity/i), "abc");
    expect(onQueryChange).toHaveBeenCalled();
  });

  it("ActivityFeedFilters calls onFilterChange with selected type", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(
      <ActivityFeedFilters
        events={FEED_EVENTS}
        filter={{ type: null, query: "invoice" }}
        onFilterChange={onFilterChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /billing/i }));
    expect(onFilterChange).toHaveBeenCalledWith({
      type: "billing",
      query: "invoice",
    });
  });

  it("ActivityFeedList groups events and renders date labels", () => {
    const now = new Date("2026-03-18T12:00:00.000Z");
    const yesterday = new Date("2026-03-17T10:00:00.000Z");
    const events: ActivityEvent[] = [
      {
        ...makeEvent("today", "system", "Today event", 30),
        occurredAt: new Date("2026-03-18T11:30:00.000Z"),
      },
      {
        ...makeEvent("yesterday", "system", "Yesterday event", 0),
        occurredAt: yesterday,
      },
    ];

    render(<ActivityFeedList events={events} timestampMode="relative" now={now} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Today event")).toBeInTheDocument();
    expect(screen.getByText("Yesterday event")).toBeInTheDocument();
  });

  it("ActivityEventRow renders actor, context and title", () => {
    const event = makeEvent("row", "billing", "Invoice paid", 40, {
      contextLabel: "Invoice #2026",
    });
    render(
      <ActivityEventRow
        event={event}
        timestampMode="relative"
        now={new Date("2026-03-18T12:00:00.000Z")}
      />,
    );

    expect(screen.getByText("Invoice paid")).toBeInTheDocument();
    expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByText("Invoice #2026")).toBeInTheDocument();
  });

  it("ActivityFeedPagination calls onLoadMore in infinite mode", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();

    render(
      <ActivityFeedPagination
        pagingMode="infinite"
        currentPage={1}
        totalPages={1}
        canLoadMore={true}
        onPageChange={() => undefined}
        onLoadMore={onLoadMore}
      />,
    );

    await user.click(screen.getByRole("button", { name: /load more/i }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});

