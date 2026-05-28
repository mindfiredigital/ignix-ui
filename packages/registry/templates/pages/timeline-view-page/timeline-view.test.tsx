import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

vi.mock("framer-motion", async () => {
    const ReactNS = await import("react");
    const cache: Record<string, any> = {};
    const passthrough = (tag: string) => {
        if (cache[tag]) return cache[tag];
        cache[tag] = ReactNS.forwardRef(({ children, ...props }: any, ref: any) =>
            ReactNS.createElement(tag, { ref, ...props }, children),
        );
        return cache[tag];
    };
    const motion = new Proxy(
        {},
        {
            get: (_t, key) => {
                if (typeof key === "symbol") return undefined;
                if (key === "then") return undefined;
                return passthrough(key as string);
            },
        },
    );
    return {
        motion,
        AnimatePresence: ({ children }: any) =>
            ReactNS.createElement(ReactNS.Fragment, null, children),
        LayoutGroup: ({ children }: any) =>
            ReactNS.createElement(ReactNS.Fragment, null, children),
        useReducedMotion: () => false,
        useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
        useMotionValue: () => 0,
        useSpring: () => 0,
        useTransform: () => 0,
    };
});

import {
    Timeline,
    TimelineItemCard,
    TimelineFilters,
    StatusBadge,
    type TimelineItem,
    type TimelineFilter,
} from "./index";

const SAMPLE_ITEMS: TimelineItem[] = [
    {
        id: "1",
        title: "Project kickoff",
        description: "Aligned on goals and milestones.",
        date: "2025-09-04",
        status: "completed",
        meta: "Milestone 01",
    },
    {
        id: "2",
        title: "Design system v1",
        description: "Tokens and primitives shipped.",
        date: "2025-10-12",
        status: "completed",
        meta: "Milestone 02",
    },
    {
        id: "3",
        title: "Public launch",
        description: "Marketing site live.",
        date: "2026-04-22",
        status: "in_progress",
        meta: "Milestone 03",
    },
    {
        id: "4",
        title: "Mobile companion app",
        description: "iOS and Android shells.",
        date: "2026-07-15",
        status: "pending",
        meta: "Milestone 04",
    },
    {
        id: "5",
        title: "Enterprise tier",
        description: "SSO and audit logs.",
        date: "2026-10-30",
        status: "pending",
        meta: "Milestone 05",
    },
];

const renderTimeline = (
    overrides: Partial<React.ComponentProps<typeof Timeline>> = {},
) => render(<Timeline items={SAMPLE_ITEMS} orientation="vertical" {...overrides} />);

const getFilterPill = (label: RegExp | string) =>
    screen.getByRole("radio", { name: typeof label === "string" ? new RegExp(label, "i") : label });

describe("Timeline — rendering", () => {
    it("renders every item title by default", () => {
        renderTimeline();
        for (const item of SAMPLE_ITEMS) {
            expect(screen.getByText(item.title)).toBeInTheDocument();
        }
    });

    it("renders meta labels when present", () => {
        renderTimeline();
        expect(screen.getAllByText("Milestone 01").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Milestone 05").length).toBeGreaterThan(0);
    });

    it("renders items sorted ascending by date", () => {
        renderTimeline();
        const headings = screen.getAllByRole("heading", { level: 3 });
        const titles = headings.map((h) => h.textContent);
        expect(titles).toEqual([
            "Project kickoff",
            "Design system v1",
            "Public launch",
            "Mobile companion app",
            "Enterprise tier",
        ]);
    });

    it("renders the empty filter message when no items match", () => {
        renderTimeline({
            items: [SAMPLE_ITEMS[0]!],
            defaultFilter: "pending",
        });
        expect(screen.getByText(/no items match this filter/i)).toBeInTheDocument();
    });
});

describe("Timeline filters", () => {
    it("shows the filter pill row by default with all four options", () => {
        renderTimeline();
        expect(screen.getByRole("radiogroup")).toBeInTheDocument();
        expect(getFilterPill("All")).toBeInTheDocument();
        expect(getFilterPill("Completed")).toBeInTheDocument();
        expect(getFilterPill("In progress")).toBeInTheDocument();
        expect(getFilterPill("Pending")).toBeInTheDocument();
    });

    it("renders live counts for each filter pill", () => {
        renderTimeline();
        const all = getFilterPill("All");
        const completed = getFilterPill("Completed");
        const inProgress = getFilterPill("In progress");
        const pending = getFilterPill("Pending");
        expect(within(all).getByText("5")).toBeInTheDocument();
        expect(within(completed).getByText("2")).toBeInTheDocument();
        expect(within(inProgress).getByText("1")).toBeInTheDocument();
        expect(within(pending).getByText("2")).toBeInTheDocument();
    });

    it("hides the filter row when showFilters=false", () => {
        renderTimeline({ showFilters: false });
        expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    });

    it("respects defaultFilter prop on initial render", () => {
        renderTimeline({ defaultFilter: "completed" });
        expect(screen.getByText("Project kickoff")).toBeInTheDocument();
        expect(screen.getByText("Design system v1")).toBeInTheDocument();
        expect(screen.queryByText("Public launch")).not.toBeInTheDocument();
        expect(screen.queryByText("Mobile companion app")).not.toBeInTheDocument();
    });

    it("narrows visible items when a filter pill is clicked", () => {
        renderTimeline();
        fireEvent.click(getFilterPill("Pending"));
        expect(screen.queryByText("Project kickoff")).not.toBeInTheDocument();
        expect(screen.queryByText("Public launch")).not.toBeInTheDocument();
        expect(screen.getByText("Mobile companion app")).toBeInTheDocument();
        expect(screen.getByText("Enterprise tier")).toBeInTheDocument();
    });

    it("marks the active filter pill with aria-checked=true", () => {
        renderTimeline();
        fireEvent.click(getFilterPill("Completed"));
        expect(getFilterPill("Completed")).toHaveAttribute("aria-checked", "true");
        expect(getFilterPill("All")).toHaveAttribute("aria-checked", "false");
    });

    it("returning to All restores every item", () => {
        renderTimeline({ defaultFilter: "completed" });
        fireEvent.click(getFilterPill("All"));
        for (const item of SAMPLE_ITEMS) {
            expect(screen.getByText(item.title)).toBeInTheDocument();
        }
    });
});

describe("Timeline loading state", () => {
    it("renders skeleton state when isLoading=true and hides items", () => {
        renderTimeline({ isLoading: true, skeletonCount: 3 });
        expect(screen.queryByText("Project kickoff")).not.toBeInTheDocument();
        expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    });
});

describe("Timeline click-to-open drawer", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("makes cards interactive when enableDetails=true (default)", () => {
        renderTimeline();
        const firstCard = screen.getByRole("button", {
            name: /open details for project kickoff/i,
        });
        expect(firstCard).toHaveAttribute("tabIndex", "0");
    });

    it("opens drawer with item title on card click", () => {
        renderTimeline();
        fireEvent.click(
            screen.getByRole("button", { name: /open details for design system v1/i }),
        );
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).getByText("Design system v1")).toBeInTheDocument();
    });

    it("renders item description inside the drawer body", () => {
        renderTimeline();
        fireEvent.click(
            screen.getByRole("button", { name: /open details for public launch/i }),
        );
        const dialog = screen.getByRole("dialog");
        expect(within(dialog).getByText(/marketing site live/i)).toBeInTheDocument();
    });

    it("renders item ID inside the drawer body", () => {
        renderTimeline();
        fireEvent.click(
            screen.getByRole("button", { name: /open details for enterprise tier/i }),
        );
        const dialog = screen.getByRole("dialog");
        expect(within(dialog).getByText("5")).toBeInTheDocument();
    });

    it("opens drawer when card is activated via Enter key", () => {
        renderTimeline();
        const card = screen.getByRole("button", {
            name: /open details for project kickoff/i,
        });
        fireEvent.keyDown(card, { key: "Enter" });
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("opens drawer when card is activated via Space key", () => {
        renderTimeline();
        const card = screen.getByRole("button", {
            name: /open details for project kickoff/i,
        });
        fireEvent.keyDown(card, { key: " " });
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders non-interactive cards when enableDetails=false", () => {
        renderTimeline({ enableDetails: false });
        expect(
            screen.queryByRole("button", { name: /open details for/i }),
        ).not.toBeInTheDocument();
    });

    it("invokes onItemClick instead of opening drawer when provided", () => {
        const onItemClick = vi.fn();
        renderTimeline({ onItemClick });
        fireEvent.click(
            screen.getByRole("button", { name: /open details for project kickoff/i }),
        );
        expect(onItemClick).toHaveBeenCalledTimes(1);
        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({ id: "1", title: "Project kickoff" }),
        );
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("uses renderDetails for custom drawer body", () => {
        renderTimeline({
            renderDetails: (item) => <p data-testid="custom-body">Custom: {item.title}</p>,
        });
        fireEvent.click(
            screen.getByRole("button", { name: /open details for design system v1/i }),
        );
        expect(screen.getByTestId("custom-body")).toHaveTextContent(
            "Custom: Design system v1",
        );
    });
});

describe("Timeline orientation", () => {
    it("renders a vertical ordered list when orientation=vertical", () => {
        const { container } = renderTimeline({ orientation: "vertical" });
        const list = container.querySelector("ol");
        expect(list).not.toBeNull();
    });

    it("renders an ordered list for horizontal orientation too", () => {
        const { container } = render(
            <Timeline items={SAMPLE_ITEMS} orientation="horizontal" />,
        );
        const list = container.querySelector("ol");
        expect(list).not.toBeNull();
    });
});

describe("TimelineFilters", () => {
    it("emits the new filter value when a pill is clicked", () => {
        const onChange = vi.fn();
        render(
            <TimelineFilters value="all" onChange={onChange} items={SAMPLE_ITEMS} />,
        );
        fireEvent.click(getFilterPill("Completed"));
        const expected: TimelineFilter = "completed";
        expect(onChange).toHaveBeenCalledWith(expected);
    });

    it("highlights the controlled value", () => {
        const onChange = vi.fn();
        render(
            <TimelineFilters value="pending" onChange={onChange} items={SAMPLE_ITEMS} />,
        );
        expect(getFilterPill("Pending")).toHaveAttribute("aria-checked", "true");
        expect(getFilterPill("All")).toHaveAttribute("aria-checked", "false");
    });
});

describe("TimelineItemCard", () => {
    const item: TimelineItem = SAMPLE_ITEMS[2]!;

    it("renders title, meta, and formatted date for default variant", () => {
        render(<TimelineItemCard item={item} />);
        expect(screen.getByText(item.title)).toBeInTheDocument();
        expect(screen.getByText(item.meta!)).toBeInTheDocument();
    });

    it("is non-interactive without onClick prop", () => {
        render(<TimelineItemCard item={item} />);
        expect(
            screen.queryByRole("button", { name: /open details/i }),
        ).not.toBeInTheDocument();
    });

    it("becomes a button with aria-label when onClick is provided", () => {
        const onClick = vi.fn();
        render(<TimelineItemCard item={item} onClick={onClick} />);
        const btn = screen.getByRole("button", {
            name: `Open details for ${item.title}`,
        });
        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalledWith(item);
    });

    it("renders compact variant with only title + date row", () => {
        render(<TimelineItemCard item={item} variant="compact" />);
        expect(screen.getByText(item.title)).toBeInTheDocument();
        expect(screen.queryByText(item.description!)).not.toBeInTheDocument();
    });

    it("renders minimal variant with description", () => {
        render(<TimelineItemCard item={item} variant="minimal" />);
        expect(screen.getByText(item.description!)).toBeInTheDocument();
    });

    it("renders glow variant with status-tinted styles", () => {
        const { container } = render(
            <TimelineItemCard item={item} variant="glow" />,
        );
        expect(container.querySelector(".bg-warning")).not.toBeNull();
    });
});

describe("StatusBadge", () => {
    it("renders the human label for each status", () => {
        const { rerender } = render(<StatusBadge status="completed" />);
        expect(screen.getByText("Completed")).toBeInTheDocument();
        rerender(<StatusBadge status="in_progress" />);
        expect(screen.getByText("In progress")).toBeInTheDocument();
        rerender(<StatusBadge status="pending" />);
        expect(screen.getByText("Pending")).toBeInTheDocument();
    });
});
