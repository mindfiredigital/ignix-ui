import type { Meta, StoryObj } from "@storybook/react-vite";
import { KanbanBoard, BoardSkeleton } from ".";

const meta: Meta<typeof KanbanBoard> = {
    title: "Templates/Pages/DataManagement/Kanban Board",
    component: KanbanBoard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: "A premium, fully interactive Kanban board template with native drag-and-drop support, real-time filtering, and sleek UI components.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

import { newId, type BoardState } from ".";

function inDays(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString();
}

function createSampleSeed(): BoardState {
    const cardEntries = [
        {
            title: "Redesign onboarding flow",
            description: "Reduce steps from 5 to 3, add progress indicator, and refresh the welcome illustration.",
            priority: "high" as const,
            labels: [{ id: newId(), name: "Design", color: "rose" as const }, { id: newId(), name: "UX", color: "violet" as const }],
            assignees: [{ id: newId(), name: "Maya Chen" }],
            dueDate: inDays(2), comments: 4, attachments: 2, column: 0,
        },
        {
            title: "Audit landing page copy",
            description: "Tighten the hero headline and rewrite the social-proof section with new testimonials.",
            priority: "medium" as const,
            labels: [{ id: newId(), name: "Marketing", color: "amber" as const }],
            assignees: [{ id: newId(), name: "Jordan Reyes" }],
            dueDate: inDays(5), comments: 1, column: 0,
        },
        {
            title: "Set up error tracking",
            description: "Integrate Sentry with source maps; alert the on-call channel for P1s.",
            priority: "urgent" as const,
            labels: [{ id: newId(), name: "Infra", color: "sky" as const }, { id: newId(), name: "Bug", color: "red" as const }],
            assignees: [{ id: newId(), name: "Sam Patel" }],
            dueDate: inDays(-1), comments: 7, attachments: 1, column: 0,
        },
        {
            title: "Draft Q3 product roadmap",
            description: "Align with design + eng leads on shippable themes and external commitments.",
            priority: "medium" as const,
            labels: [{ id: newId(), name: "Planning", color: "slate" as const }],
            assignees: [{ id: newId(), name: "Priya Shah" }, { id: newId(), name: "Liam Brooks" }],
            dueDate: inDays(9), column: 0,
        },
        {
            title: "Build Kanban drag-and-drop",
            description: "Smooth integration with keyboard support and animated drop targets.",
            priority: "high" as const,
            labels: [{ id: newId(), name: "Frontend", color: "emerald" as const }, { id: newId(), name: "Feature", color: "violet" as const }],
            assignees: [{ id: newId(), name: "Ava Martín" }],
            dueDate: inDays(1), comments: 3, column: 1,
        },
        {
            title: "Migrate billing to Stripe v2",
            description: "Switch invoices to hosted pages and reconcile webhooks for the new product catalog.",
            priority: "urgent" as const,
            labels: [{ id: newId(), name: "Billing", color: "red" as const }, { id: newId(), name: "Backend", color: "sky" as const }],
            assignees: [{ id: newId(), name: "Noah Williams" }],
            dueDate: inDays(3), comments: 12, attachments: 4, column: 1,
        },
        {
            title: "Ship dark mode to public beta",
            description: "Final accessibility pass and changelog post.",
            priority: "low" as const,
            labels: [{ id: newId(), name: "Design", color: "rose" as const }],
            assignees: [{ id: newId(), name: "Maya Chen" }],
            dueDate: inDays(7), comments: 2, column: 2,
        },
        {
            title: "Refresh brand color palette",
            description: "Crimson reds across the board, with WCAG-compliant pairings for surfaces.",
            priority: "medium" as const,
            labels: [{ id: newId(), name: "Brand", color: "rose" as const }, { id: newId(), name: "Design", color: "violet" as const }],
            assignees: [{ id: newId(), name: "Priya Shah" }],
            dueDate: inDays(-3), attachments: 6, column: 2,
        },
        {
            title: "Customer interviews — power users",
            description: "Five 30-minute sessions; synthesize themes for the next planning cycle.",
            priority: "low" as const,
            labels: [{ id: newId(), name: "Research", color: "amber" as const }],
            assignees: [{ id: newId(), name: "Jordan Reyes" }],
            dueDate: inDays(-10), comments: 5, column: 2,
        },
    ];

    const cards: BoardState["cards"] = {};
    const columnCards: string[][] = [[], [], []];
    cardEntries.forEach((c) => {
        const id = newId();
        const { column, ...rest } = c;
        cards[id] = { id, ...rest };
        columnCards[column].push(id);
    });

    return {
        cards,
        columns: [
            { id: newId(), title: "To Do", accent: "rose", cardIds: columnCards[0] },
            { id: newId(), title: "In Progress", accent: "amber", cardIds: columnCards[1] },
            { id: newId(), title: "Done", accent: "emerald", cardIds: columnCards[2] },
        ],
        search: "",
        priorityFilter: "all",
    };
}

export const Default: Story = {
    render: () => (
        <div className="h-screen w-full bg-background overflow-hidden">
            <KanbanBoard initialState={createSampleSeed()} />
        </div>
    ),
    name: "Standard Kanban Board",
};

export const DarkMode: Story = {
    render: () => (
        <div className="dark h-screen w-full bg-gray-950 overflow-hidden">
            <KanbanBoard initialState={createSampleSeed()} />
        </div>
    ),

    parameters: {
        backgrounds: { default: 'dark' },
    },
    name: "Dark Mode Board",
};

export const SkeletonLoading: Story = {
    render: () => (
        <div className="h-screen w-full bg-background overflow-hidden">
            <BoardSkeleton />
        </div>
    ),
    name: "Skeleton Loading State",
    parameters: {
        docs: {
            description: {
                story: "Animated pulse placeholder shown during the initial hydration tick before cards render. Prevents blank flash on first load.",
            },
        },
    },
};

export const SkeletonLoadingDark: Story = {
    render: () => (
        <div className="dark h-screen w-full bg-gray-950 overflow-hidden">
            <BoardSkeleton />
        </div>
    ),
    name: "Skeleton Loading State (Dark)",
    parameters: {
        backgrounds: { default: "dark" },
        docs: {
            description: {
                story: "Dark mode variant of the skeleton loading state.",
            },
        },
    },
};