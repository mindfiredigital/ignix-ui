import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./index";
import type { TimelineItem } from "./index";

const SAMPLE_ITEMS: TimelineItem[] = [
    {
        id: "1",
        title: "Project kickoff",
        description: "Aligned on goals, scope, and milestones with stakeholders.",
        date: "2025-09-04",
        status: "completed",
        meta: "Milestone 01",
    },
    {
        id: "2",
        title: "Design system v1",
        description: "Tokens, primitives, and core components shipped to the library.",
        date: "2025-10-12",
        status: "completed",
        meta: "Milestone 02",
    },
    {
        id: "3",
        title: "Beta release",
        description: "Rolled out to 200 early-access users; collecting telemetry.",
        date: "2025-12-01",
        status: "completed",
        meta: "Milestone 03",
    },
    {
        id: "4",
        title: "Public launch",
        description: "Marketing site live, payments enabled, support runbooks ready.",
        date: "2026-04-22",
        status: "in_progress",
        meta: "Milestone 04",
    },
    {
        id: "5",
        title: "Mobile companion app",
        description: "iOS and Android shells with offline sync.",
        date: "2026-07-15",
        status: "pending",
        meta: "Milestone 05",
    },
    {
        id: "6",
        title: "Enterprise tier",
        description: "SSO, audit logs, and dedicated support SLAs.",
        date: "2026-10-30",
        status: "pending",
        meta: "Milestone 06",
    },
];

/** A minimal two-item set used to test edge cases (single status, no meta). */
const MINIMAL_ITEMS: TimelineItem[] = [
    {
        id: "a",
        title: "Initial commit",
        description: "Repository created and base tooling configured.",
        date: "2026-01-10",
        status: "completed",
    },
    {
        id: "b",
        title: "First PR merged",
        description: "CI pipeline green, branch protections in place.",
        date: "2026-01-18",
        status: "completed",
    },
];

/** All-pending set — useful for verifying the pending node and badge styles. */
const PENDING_ITEMS: TimelineItem[] = [
    {
        id: "p1",
        title: "API v3 migration",
        description: "Migrate all endpoints to the new versioned API contract.",
        date: "2026-08-01",
        status: "pending",
        meta: "Phase 1",
    },
    {
        id: "p2",
        title: "Internationalization",
        description: "Add i18n support for five target locales.",
        date: "2026-09-15",
        status: "pending",
        meta: "Phase 2",
    },
    {
        id: "p3",
        title: "Accessibility audit",
        description: "Full WCAG 2.1 AA audit with remediation sprint.",
        date: "2026-11-01",
        status: "pending",
        meta: "Phase 3",
    },
];

/* ============================================
   META
============================================ */

const meta: Meta<typeof Timeline> = {
    title: "Templates/Pages/DataManagement/TimelineView",
    component: Timeline,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "A filterable, sortable timeline that renders vertically on mobile and horizontally on desktop (`auto`). Supports four visual variants and three status states.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "minimal", "compact", "glow"],
            description: "Visual style applied to each timeline card.",
        },
        orientation: {
            control: "select",
            options: ["auto", "vertical", "horizontal"],
            description:
                "`auto` renders vertically on mobile and horizontally on md+. Force one direction with `vertical` or `horizontal`.",
        },
        defaultFilter: {
            control: "select",
            options: ["all", "completed", "in_progress", "pending"],
            description: "Which filter pill is active on first render.",
        },
        showFilters: {
            control: "boolean",
            description: "Show or hide the filter pill row.",
        },
        isLoading: {
            control: "boolean",
            description: "Show the shimmer skeleton loading state.",
        },
        skeletonCount: {
            control: "number",
            description: "Number of skeleton cards to show.",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

/* ============================================
   STORIES
============================================ */

/* -------------------------------------------------------------------------- */
/*  Default                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
    name: "Default",
    args: {
        items: SAMPLE_ITEMS,
        variant: "default",
        orientation: "auto",
        showFilters: true,
        defaultFilter: "all",
    },
};

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

export const Minimal: Story = {
    name: "Variant / Minimal",
    args: {
        ...Default.args,
        variant: "minimal",
        orientation: "vertical",
    },
};

export const Compact: Story = {
    name: "Variant / Compact",
    args: {
        ...Default.args,
        variant: "compact",
        orientation: "vertical",
    },
};

export const Glow: Story = {
    name: "Variant / Glow",
    args: {
        ...Default.args,
        variant: "glow",
        orientation: "vertical",
    },
};

/* -------------------------------------------------------------------------- */
/*  Orientation                                                                */
/* -------------------------------------------------------------------------- */

export const Vertical: Story = {
    name: "Orientation / Vertical",
    args: {
        ...Default.args,
        orientation: "vertical",
    },
};

export const Horizontal: Story = {
    name: "Orientation / Horizontal",
    args: {
        ...Default.args,
        orientation: "horizontal",
    },
};

/* -------------------------------------------------------------------------- */
/*  Filters                                                                    */
/* -------------------------------------------------------------------------- */

export const FiltersHidden: Story = {
    name: "Filters / Hidden",
    args: {
        ...Default.args,
        orientation: "vertical",
        showFilters: false,
    },
};

export const FilterPresetCompleted: Story = {
    name: "Filters / Preset — completed",
    args: {
        ...Default.args,
        orientation: "vertical",
        defaultFilter: "completed",
    },
};

export const FilterPresetInProgress: Story = {
    name: "Filters / Preset — in progress",
    args: {
        ...Default.args,
        orientation: "vertical",
        defaultFilter: "in_progress",
    },
};

export const FilterPresetPending: Story = {
    name: "Filters / Preset — pending",
    args: {
        ...Default.args,
        orientation: "vertical",
        defaultFilter: "pending",
    },
};

/* -------------------------------------------------------------------------- */
/*  Edge cases                                                                 */
/* -------------------------------------------------------------------------- */

export const SingleStatus: Story = {
    name: "Edge / Single status (all completed)",
    parameters: {
        docs: {
            description: {
                story:
                    "When all items share one status the other filter pills show a zero count. Selecting those filters renders the empty state.",
            },
        },
    },
    args: {
        items: MINIMAL_ITEMS,
        variant: "default",
        orientation: "vertical",
        showFilters: true,
        defaultFilter: "all",
    },
};

export const AllPending: Story = {
    name: "Edge / All pending",
    parameters: {
        docs: {
            description: {
                story: "Verifies pending node and badge styles render correctly across all items.",
            },
        },
    },
    args: {
        items: PENDING_ITEMS,
        variant: "default",
        orientation: "vertical",
        showFilters: true,
        defaultFilter: "all",
    },
};

export const NoMeta: Story = {
    name: "Edge / No meta labels",
    parameters: {
        docs: {
            description: {
                story: "Items without a `meta` field — the milestone label row should be absent.",
            },
        },
    },
    args: {
        items: MINIMAL_ITEMS,
        variant: "default",
        orientation: "vertical",
        showFilters: false,
    },
};

export const EmptyFilterResult: Story = {
    name: "Edge / Empty filter result",
    parameters: {
        docs: {
            description: {
                story:
                    'Pre-selects the "in_progress" filter on a dataset that has no in-progress items, so the empty state is visible on load.',
            },
        },
    },
    args: {
        items: MINIMAL_ITEMS,
        variant: "default",
        orientation: "vertical",
        showFilters: true,
        defaultFilter: "in_progress",
    },
};

/* -------------------------------------------------------------------------- */
/*  Loading                                                                    */
/* -------------------------------------------------------------------------- */

export const Loading: Story = {
    name: "Loading / Shimmer Skeleton",
    args: {
        ...Default.args,
        isLoading: true,
        skeletonCount: 3,
    },
};

/* -------------------------------------------------------------------------- */
/*  Dark Mode                                                                  */
/* -------------------------------------------------------------------------- */

export const DarkModeDefault: Story = {
    name: "Theme / Dark Mode — Default",
    parameters: {
        layout: "fullscreen",
        backgrounds: { default: "dark" },
    },
    args: {
        ...Default.args,
    },
    decorators: [
        (Story) => (
            <div className="dark min-h-screen bg-slate-950 text-foreground">
                <div className="p-8">
                    <Story />
                </div>
            </div>
        ),
    ],
};

export const DarkModeGlow: Story = {
    name: "Theme / Dark Mode — Glow",
    parameters: {
        layout: "fullscreen",
        backgrounds: { default: "dark" },
    },
    args: {
        ...Default.args,
        variant: "glow",
    },
    decorators: [
        (Story) => (
            <div className="dark min-h-screen bg-slate-950 text-foreground">
                <div className="p-8">
                    <Story />
                </div>
            </div>
        ),
    ],
};

export const DarkModeLoading: Story = {
    name: "Theme / Dark Mode — Loading",
    parameters: {
        layout: "fullscreen",
        backgrounds: { default: "dark" },
    },
    args: {
        ...Default.args,
        isLoading: true,
    },
    decorators: [
        (Story) => (
            <div className="dark min-h-screen bg-slate-950 text-foreground">
                <div className="p-8">
                    <Story />
                </div>
            </div>
        ),
    ],
};