/**
 * @fileoverview Unit and integration tests for the `DetailViewPage` template.
 *
 * Covers:
 * - Static rendering (title, metadata, related list, action buttons)
 * - Loading state (skeleton presence, spinner hint, disabled prev/next)
 * - Navigation callbacks (back, previous, next)
 * - Action callbacks (edit, delete, share)
 * - Related item click delegation
 * - Empty-state messaging
 * - Custom label overrides
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { DetailViewPage, type DetailRelatedItem, type StatusStyle } from ".";

/* ─── Mocks ────────────────────────────────────────────────────────────────── */

/**
 * Replace framer-motion with passthrough DOM elements so tests don't have to
 * deal with animation timing or layout effects. The Proxy `get` skips JS engine
 * probe keys (`then`, symbols) so the namespace is never accidentally thenable.
 */
vi.mock("framer-motion", async () => {
    const React = await import("react");
    const cache: Record<string, unknown> = {};
    /** Builds a forward-ref passthrough for a single HTML tag. */
    const passthrough = (tag: string) => {
        if (cache[tag]) return cache[tag];
        cache[tag] = React.forwardRef(
            (
                { children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode },
                ref: React.Ref<HTMLElement>
            ) => React.createElement(tag, { ref, ...props }, children)
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
        }
    );
    return {
        motion,
        AnimatePresence: ({
            children,
        }: {
            children?: React.ReactNode;
        }) => React.createElement(React.Fragment, null, children),
    };
});

/* ─── Fixtures ─────────────────────────────────────────────────────────────── */

/** Status badge styles for the test environment. */
const STATUS_STYLES: Record<string, StatusStyle> = {
    Published: {
        className:
            "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20",
        dotClassName: "bg-emerald-500",
    },
    Draft: {
        className:
            "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20",
        dotClassName: "bg-amber-500",
    },
};

/** Minimal props required for a fully rendered detail page. */
const BASE_PROPS = {
    title: "Button Component v2.4",
    subtitle: "Refined button with new size variants and loading state.",
    content:
        "Adds support for icon-only buttons and better accessibility for screen readers.",
    createdAt: "Apr 18, 2026",
    updatedAt: "Apr 20, 2026",
    status: "Published",
    owner: { name: "Aarav Mehta", initials: "AM" },
    statusStyles: STATUS_STYLES,
};

/** Sample related items for the related-list tests. */
const RELATED_ITEMS: DetailRelatedItem[] = [
    {
        id: "r1",
        title: "Data Table Pagination Pattern",
        description: "Offset-based pagination for the data table family.",
    },
    {
        id: "r2",
        title: "Dialog & Modal Guidelines",
        description: "Focus management, escape behavior, and stacking rules.",
    },
];

beforeEach(() => {
    vi.clearAllMocks();
});

/* ─── Rendering ────────────────────────────────────────────────────────────── */

describe("DetailViewPage – rendering", () => {
    it("renders the title as an h1 heading", () => {
        render(<DetailViewPage {...BASE_PROPS} />);
        expect(
            screen.getByRole("heading", { name: BASE_PROPS.title, level: 1 })
        ).toBeInTheDocument();
    });

    it("renders subtitle when provided", () => {
        render(<DetailViewPage {...BASE_PROPS} />);
        expect(screen.getByText(BASE_PROPS.subtitle)).toBeInTheDocument();
    });

    it("renders the content string", () => {
        render(<DetailViewPage {...BASE_PROPS} />);
        expect(screen.getByText(BASE_PROPS.content)).toBeInTheDocument();
    });

    it("renders metadata fields: createdAt, updatedAt, status, owner", () => {
        render(<DetailViewPage {...BASE_PROPS} />);
        expect(screen.getByText(BASE_PROPS.createdAt)).toBeInTheDocument();
        expect(screen.getByText(BASE_PROPS.updatedAt)).toBeInTheDocument();
        expect(screen.getAllByText(BASE_PROPS.status).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(BASE_PROPS.owner.name)).toBeInTheDocument();
    });

    it("renders the eyebrow text when supplied", () => {
        render(<DetailViewPage {...BASE_PROPS} eyebrow="Components" />);
        expect(screen.getByText("Components")).toBeInTheDocument();
    });
});

/* ─── Related list ─────────────────────────────────────────────────────────── */

describe("DetailViewPage – related list", () => {
    it("renders related item titles", () => {
        render(<DetailViewPage {...BASE_PROPS} relatedItems={RELATED_ITEMS} />);
        RELATED_ITEMS.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
        });
    });

    it("shows the empty-related message when relatedItems is empty", () => {
        render(<DetailViewPage {...BASE_PROPS} relatedItems={[]} />);
        expect(screen.getByText(/no related items yet/i)).toBeInTheDocument();
    });

    it("fires onRelatedItemClick with the correct item", () => {
        const onRelatedItemClick = vi.fn();
        render(
            <DetailViewPage
                {...BASE_PROPS}
                relatedItems={RELATED_ITEMS}
                onRelatedItemClick={onRelatedItemClick}
            />
        );
        fireEvent.click(screen.getByText(RELATED_ITEMS[0].title));
        expect(onRelatedItemClick).toHaveBeenCalledWith(
            expect.objectContaining({ id: RELATED_ITEMS[0].id })
        );
    });
});

/* ─── Navigation ───────────────────────────────────────────────────────────── */

describe("DetailViewPage – navigation", () => {
    it("renders the back button and fires onBack on click", () => {
        const onBack = vi.fn();
        render(<DetailViewPage {...BASE_PROPS} onBack={onBack} />);
        fireEvent.click(screen.getByRole("button", { name: /back/i }));
        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("renders previous/next buttons when handlers are provided", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                onPrevious={vi.fn()}
                onNext={vi.fn()}
            />
        );
        expect(
            screen.getAllByRole("button", { name: /previous/i }).length
        ).toBeGreaterThan(0);
        expect(
            screen.getAllByRole("button", { name: /next/i }).length
        ).toBeGreaterThan(0);
    });

    it("fires onPrevious when the previous button is clicked", () => {
        const onPrevious = vi.fn();
        render(
            <DetailViewPage
                {...BASE_PROPS}
                onPrevious={onPrevious}
                onNext={vi.fn()}
            />
        );
        const prevButtons = screen.getAllByRole("button", { name: /previous/i });
        fireEvent.click(prevButtons[0]);
        expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it("fires onNext when the next button is clicked", () => {
        const onNext = vi.fn();
        render(
            <DetailViewPage
                {...BASE_PROPS}
                onPrevious={vi.fn()}
                onNext={onNext}
            />
        );
        const nextButtons = screen.getAllByRole("button", { name: /^next$/i });
        fireEvent.click(nextButtons[0]);
        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("disables previous button when hasPrevious is false", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                onPrevious={vi.fn()}
                hasPrevious={false}
            />
        );
        const prevButtons = screen.getAllByRole("button", { name: /previous/i });
        prevButtons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it("disables next button when hasNext is false", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                onNext={vi.fn()}
                hasNext={false}
            />
        );
        const nextButtons = screen.getAllByRole("button", { name: /^next$/i });
        nextButtons.forEach((btn) => expect(btn).toBeDisabled());
    });
});

/* ─── Actions ──────────────────────────────────────────────────────────────── */

describe("DetailViewPage – actions", () => {
    it("renders edit, share, delete buttons when handlers are provided", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                onEdit={vi.fn()}
                onShare={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("fires onEdit when the edit button is clicked", () => {
        const onEdit = vi.fn();
        render(<DetailViewPage {...BASE_PROPS} onEdit={onEdit} />);
        fireEvent.click(screen.getByRole("button", { name: /edit/i }));
        expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("fires onShare when the share button is clicked", () => {
        const onShare = vi.fn();
        render(<DetailViewPage {...BASE_PROPS} onShare={onShare} />);
        fireEvent.click(screen.getByRole("button", { name: /share/i }));
        expect(onShare).toHaveBeenCalledTimes(1);
    });

    it("fires onDelete when the delete button is clicked", () => {
        const onDelete = vi.fn();
        render(<DetailViewPage {...BASE_PROPS} onDelete={onDelete} />);
        fireEvent.click(screen.getByRole("button", { name: /delete/i }));
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("does not render action buttons when no handlers are provided", () => {
        render(<DetailViewPage {...BASE_PROPS} />);
        expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });
});

/* ─── Loading state ────────────────────────────────────────────────────────── */

describe("DetailViewPage – loading state", () => {
    it("renders skeleton (animate-pulse region) when loading is true", () => {
        const { container } = render(
            <DetailViewPage {...BASE_PROPS} loading={true} />
        );
        const pulse = container.querySelectorAll(".animate-pulse");
        expect(pulse.length).toBeGreaterThan(0);
    });

    it("shows the loading hint text when loading is true", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                loading={true}
                labels={{ loadingHint: "Fetching record…" }}
            />
        );
        expect(screen.getByText("Fetching record…")).toBeInTheDocument();
    });

    it("disables prev/next sibling buttons while loading", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                loading={true}
                onPrevious={vi.fn()}
                onNext={vi.fn()}
            />
        );
        const prevButtons = screen.getAllByRole("button", { name: /previous/i });
        const nextButtons = screen.getAllByRole("button", { name: /^next$/i });
        prevButtons.forEach((btn) => expect(btn).toBeDisabled());
        nextButtons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it("does not render the title heading when loading is true", () => {
        render(<DetailViewPage {...BASE_PROPS} loading={true} />);
        expect(
            screen.queryByRole("heading", { name: BASE_PROPS.title })
        ).not.toBeInTheDocument();
    });
});

/* ─── Custom labels ─────────────────────────────────────────────────────────── */

describe("DetailViewPage – custom labels", () => {
    it("applies custom back label", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                onBack={vi.fn()}
                labels={{ back: "Go back" }}
            />
        );
        expect(screen.getByRole("button", { name: /go back/i })).toBeInTheDocument();
    });

    it("applies custom relatedHeading label", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                relatedItems={RELATED_ITEMS}
                labels={{ relatedHeading: "See also" }}
            />
        );
        expect(screen.getByRole("heading", { name: "See also" })).toBeInTheDocument();
    });

    it("applies custom emptyRelated label", () => {
        render(
            <DetailViewPage
                {...BASE_PROPS}
                relatedItems={[]}
                labels={{ emptyRelated: "Nothing related" }}
            />
        );
        expect(screen.getByText("Nothing related")).toBeInTheDocument();
    });
});

/* ─── Compound components (slot smoke tests) ───────────────────────────────── */

describe("DetailViewPage – compound slots", () => {
    it("renders a custom Root + Header composition without crashing", () => {
        render(
            <DetailViewPage.Root>
                <DetailViewPage.Header
                    title="Custom Title"
                    labels={{
                        back: "Back",
                        previous: "Previous",
                        next: "Next",
                        relatedHeading: "Related",
                        edit: "Edit",
                        delete: "Delete",
                        share: "Share",
                        created: "Created",
                        updated: "Updated",
                        owner: "Owner",
                        status: "Status",
                        emptyRelated: "Nothing",
                        loadingHint: "Loading…",
                    }}
                />
            </DetailViewPage.Root>
        );
        expect(
            screen.getByRole("heading", { name: "Custom Title" })
        ).toBeInTheDocument();
    });
});
