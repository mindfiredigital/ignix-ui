/**
 * @fileoverview Storybook entries for the data-management `DetailViewPage` template:
 * interactive navigation across mock records, dark theme, and a compound-composition example.
 */

import {
    useCallback,
    useMemo,
    useState,
    type ComponentProps,
} from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DetailViewPage } from "./index";
import type { DetailRelatedItem, DetailViewLabels } from "./index";
import type { StatusStyle } from "../list-view-page/index";

/**
 * Shared copy used by compound stories and as the base for partial overrides in the interactive demo.
 * Satisfies `Required<DetailViewLabels>` so compound slots receive every key.
 */
const STORY_LABELS: Required<DetailViewLabels> = {
    back: "Back",
    previous: "Previous",
    next: "Next",
    relatedHeading: "Related items",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    created: "Created",
    updated: "Updated",
    owner: "Owner",
    status: "Status",
    emptyRelated: "No related items yet.",
    loadingHint: "Loading item…",
};

/* ─── Sample records (aligned with ListView sample data) ─────────────────── */

/** Status pill classes reused from the ListView story palette for visual consistency. */
const STATUS_STYLES: Record<string, StatusStyle> = {
    Published: {
        className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
        dotClassName: "bg-emerald-500",
    },
    Draft: {
        className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20",
        dotClassName: "bg-amber-500",
    },
    "In Review": {
        className:
            "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-inset ring-sky-500/20",
        dotClassName: "bg-sky-500",
    },
    Archived: {
        className: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
        dotClassName: "bg-muted-foreground/60",
    },
};

/** Shape of a mock library record used to drive Default / Dark / compound stories. */
interface MockRecord {
    id: string;
    title: string;
    eyebrow: string;
    subtitle: string;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    owner: { name: string; initials: string };
    relatedIds: string[];
}

/** In-memory dataset simulating a small slice of the components catalog. */
const RECORDS: MockRecord[] = [
    {
        id: "1",
        title: "Button Component v2.4",
        eyebrow: "Library · Components",
        subtitle: "High-traffic surface: keep API stable while shipping quality-of-life updates.",
        content: `Summary

This release refines the button primitive with new size tokens, a first-class loading state, and a focus ring that meets WCAG contrast guidance in both themes.

Details: icon-only buttons expose a deterministic touch target on mobile; asChild composition preserves semantics when nesting links or router primitives.

Review checklist: visual parity across Safari, Chrome, and Firefox; keyboard-only activation verified.`,
        status: "Published",
        createdAt: "Apr 12, 2026",
        updatedAt: "Apr 18, 2026",
        owner: { name: "Aarav Mehta", initials: "AM" },
        relatedIds: ["2", "3"],
    },
    {
        id: "2",
        title: "Data Table Pagination Pattern",
        eyebrow: "Library · Patterns",
        subtitle: "Pagination behaviour that scales from tiny datasets to cursor-backed APIs.",
        content: `Goals

Ship a single pagination primitive that works for offset APIs today and cursor/token APIs tomorrow without rewriting consumers.

Behaviour: desktop shows numbered affordances; mobile collapses to Previous / Next with context. Page size can be remembered per surface in local storage (optional slot).`,
        status: "In Review",
        createdAt: "Apr 10, 2026",
        updatedAt: "Apr 16, 2026",
        owner: { name: "Lena Park", initials: "LP" },
        relatedIds: ["1", "4"],
    },
    {
        id: "3",
        title: "Dialog & Modal Guidelines",
        eyebrow: "Library · Guidelines",
        subtitle: "When to use modal dialogs versus drawers or inline disclosure patterns.",
        content: `Principles: reserve modals for flows that require explicit confirmation or focused input. Nest responsibly—one modal at a time; return focus to the opener on dismiss.

Escape and overlay: clicking the backdrop dismisses only for non-destructive informational dialogs.`,
        status: "Published",
        createdAt: "Apr 02, 2026",
        updatedAt: "Apr 14, 2026",
        owner: { name: "Kenji Watanabe", initials: "KW" },
        relatedIds: ["1", "2"],
    },
    {
        id: "4",
        title: "Color System Tokens",
        eyebrow: "Library · Foundations",
        subtitle: "Semantic tokens for surface, border, and foreground roles across brand ramps.",
        content: `This iteration introduces three accent ramps and aligns dark-mode surfaces with APAC contrast audits.

Rollout is staged: foundations first, product shells next, marketing pages last.`,
        status: "Draft",
        createdAt: "Mar 28, 2026",
        updatedAt: "Apr 12, 2026",
        owner: { name: "Imani Brooks", initials: "IB" },
        relatedIds: ["3"],
    },
];

/**
 * Maps a record's `relatedIds` to `DetailRelatedItem` rows for the related list.
 * @param record - Current mock record.
 * @returns Related items resolved from `RECORDS`.
 */
function relatedItemsFor(record: MockRecord): DetailRelatedItem[] {
    /** Fast lookup from record id to full mock row. */
    const map = new Map(RECORDS.map((r) => [r.id, r]));
    return record.relatedIds
        .map((id) => map.get(id))
        .filter((r): r is MockRecord => Boolean(r))
        .map((r) => ({
            id: r.id,
            title: r.title,
            description: r.subtitle,
        }));
}

/** Props surface of `DetailViewPage` for typing the interactive demo wrapper. */
type DetailViewPageProps = ComponentProps<typeof DetailViewPage>;

/**
 * Stateful Storybook harness: cycles mock records via previous/next, jumps on related clicks, and logs action handlers.
 * @param props - Currently only `theme` is forwarded from Story args.
 * @returns Wired `DetailViewPage` instance.
 */
function DetailViewInteractiveDemo(
    props: Pick<DetailViewPageProps, "theme">
) {
    const { theme = "light" } = props;
    /** Index of the active mock record in `RECORDS`. */
    const [index, setIndex] = useState(0);

    /** Active mock record derived from `index`. */
    const record = RECORDS[index];

    /** Related rows for the active record, recomputed when `record` changes. */
    const relatedItems = useMemo(() => relatedItemsFor(record), [record]);

    /** True when a previous sibling exists in `RECORDS`. */
    const hasPrevious = index > 0;
    /** True when a next sibling exists in `RECORDS`. */
    const hasNext = index < RECORDS.length - 1;

    /** Simulates routing back to the list view. */
    const goBack = useCallback(() => {
        console.info("navigate back to list");
    }, []);

    /** Decrements the active record index, clamped at zero. */
    const goPrev = useCallback(() => {
        setIndex((i) => Math.max(0, i - 1));
    }, []);

    /** Increments the active record index, clamped at the last entry. */
    const goNext = useCallback(() => {
        setIndex((i) => Math.min(RECORDS.length - 1, i + 1));
    }, []);

    /** Jumps the demo to the related record when a related row is activated. */
    const onRelated = useCallback((item: DetailRelatedItem) => {
        const nextIndex = RECORDS.findIndex((r) => r.id === item.id);
        if (nextIndex >= 0) setIndex(nextIndex);
    }, []);

    /** Logs edit intent for the active record. */
    const onEdit = useCallback(() => {
        console.info("edit", record.id);
    }, [record.id]);

    /** Logs delete intent for the active record. */
    const onDelete = useCallback(() => {
        console.info("delete", record.id);
    }, [record.id]);

    /** Logs share intent for the active record. */
    const onShare = useCallback(() => {
        console.info("share", record.id);
    }, [record.id]);

    return (
        <DetailViewPage
            theme={theme}
            title={record.title}
            eyebrow={record.eyebrow}
            subtitle={record.subtitle}
            content={record.content}
            createdAt={record.createdAt}
            updatedAt={record.updatedAt}
            status={record.status}
            owner={record.owner}
            relatedItems={relatedItems}
            statusStyles={STATUS_STYLES}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onBack={goBack}
            onPrevious={goPrev}
            onNext={goNext}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
            onRelatedItemClick={onRelated}
            labels={{
                ...STORY_LABELS,
                back: "Back to library",
            }}
        />
    );
}

/** Storybook metadata for the DetailViewPage template route. */
const meta: Meta<typeof DetailViewPage> = {
    title: "Templates/Pages/DataManagement/DetailViewPage",
    component: DetailViewPage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Detail surface for a single data-management record: metadata, rich body, related items, destructive and secondary actions, back navigation, and prev/next siblings. Compound slots (`DetailViewPage.Root`, …) mirror ListView spacing and card styling.",
            },
        },
    },
    argTypes: {
        theme: {
            control: "select",
            options: ["light", "dark"],
            description: "Theme wrapper via `dark` class.",
        },
        loading: {
            control: "boolean",
            description: "Shows skeleton UI and disables sibling navigation until data resolves.",
        },
    },
};

export default meta;
/** Story object type for this file's exports. */
type Story = StoryObj<typeof DetailViewPage>;

export const Default: Story = {
    args: {
        theme: "light",
    },
    /** Renders the interactive demo with theme from controls. */
    render: function Render(args) {
        return <DetailViewInteractiveDemo theme={args.theme} />;
    },
};

export const DarkTheme: Story = {
    name: "Dark theme",
    args: {
        theme: "dark",
        loading: true
    },
    /** Reuses Default story render with dark theme args. */
    render: Default.render,
};

/**
 * Skeleton layout while the record is fetched: spinner + hint, pulsed placeholders, disabled prev/next.
 * @returns Static `DetailViewPage` in loading mode with placeholder props.
 */
export const Loading: Story = {
    name: "Loading state",
    args: {
        theme: "light",
        loading: true,
    },
    render: function LoadingRender(args) {
        return (
            <DetailViewPage
                theme={args.theme}
                loading={Boolean(args.loading)}
                title=""
                content={null}
                onBack={() => undefined}
                onPrevious={() => undefined}
                onNext={() => undefined}
                hasPrevious
                hasNext
                labels={{
                    ...STORY_LABELS,
                    loadingHint: "Fetching item details…",
                }}
            />
        );
    },
};

export const EmptyRelated: Story = {
    name: "No related items",
    /** Single record with an intentionally empty related list. */
    render: function EmptyRelatedRender() {
        /** First catalog entry reused for static empty-related layout. */
        const record = RECORDS[0];
        return (
            <DetailViewPage
                title={record.title}
                eyebrow={record.eyebrow}
                subtitle={record.subtitle}
                content={record.content}
                createdAt={record.createdAt}
                updatedAt={record.updatedAt}
                status={record.status}
                owner={record.owner}
                relatedItems={[]}
                statusStyles={STATUS_STYLES}
                onBack={() => undefined}
                labels={STORY_LABELS}
            />
        );
    },
};

export const CompoundComposition: Story = {
    name: "Compound composition",
    /** Demonstrates assembling the page from `DetailViewPage.*` static slots. */
    render: function CompoundStory() {
        /** Fixed first record for deterministic compound layout. */
        const record = RECORDS[0];
        /** Related rows for the first mock record only. */
        const relatedItems = useMemo(() => relatedItemsFor(record), []);

        return (
            <DetailViewPage.Root>
                <DetailViewPage.TopNav
                    labels={STORY_LABELS}
                    onBack={() => undefined}
                    onPrevious={() => undefined}
                    onNext={() => undefined}
                    hasPrevious={false}
                    hasNext={false}
                />
                <DetailViewPage.Header
                    title={record.title}
                    eyebrow={record.eyebrow}
                    subtitle={record.subtitle}
                    labels={STORY_LABELS}
                    onEdit={() => undefined}
                    onShare={() => undefined}
                    onDelete={() => undefined}
                />
                <DetailViewPage.Metadata
                    createdAt={record.createdAt}
                    updatedAt={record.updatedAt}
                    status={record.status}
                    owner={record.owner}
                    statusStyles={STATUS_STYLES}
                    labels={STORY_LABELS}
                />
                <DetailViewPage.Content>{record.content}</DetailViewPage.Content>
                <DetailViewPage.RelatedList
                    items={relatedItems}
                    labels={STORY_LABELS}
                    onItemClick={() => undefined}
                />
            </DetailViewPage.Root>
        );
    },
};
