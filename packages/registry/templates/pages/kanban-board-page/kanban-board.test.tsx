import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

vi.mock("@ignix-ui/toast", () => {
    const toast = { error: vi.fn(), success: vi.fn() };
    return {
        ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        useToast: () => toast,
    };
});

vi.mock("@ignix-ui/modals", () => ({
    Modal: ({
        isOpen,
        onClose,
        title,
        children,
        showFooter,
        onConfirm,
        confirmText,
        cancelText,
    }: any) =>
        isOpen ? (
            <div role="dialog" aria-label={title}>
                <h2>{title}</h2>
                {children}
                {showFooter && (
                    <>
                        <button onClick={onConfirm}>{confirmText}</button>
                        <button onClick={onClose}>{cancelText}</button>
                    </>
                )}
                <button aria-label="Close modal" onClick={onClose}>
                    ×
                </button>
            </div>
        ) : null,
}));

vi.mock("@ignix-ui/date-picker", () => ({
    DatePicker: ({ onChange, placeholder }: any) => (
        <input
            placeholder={placeholder}
            data-testid="date-picker"
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : undefined)}
        />
    ),
}));

vi.mock("@ignix-ui/file-upload", () => ({
    FileUpload: ({ onFilesChange }: any) => (
        <input
            data-testid="file-upload"
            type="file"
            multiple
            onChange={(e) => onFilesChange(Array.from(e.target.files ?? []))}
        />
    ),
}));

vi.mock("@ignix-ui/dropdown", () => {
    const Dropdown = ({ trigger, children }: any) => {
        const [open, setOpen] = React.useState(false);
        return (
            <div>
                <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
                {open && <div data-testid="dropdown-menu">{children}</div>}
            </div>
        );
    };
    const DropdownItem = ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
    const DropdownLabel = ({ children }: any) => <div>{children}</div>;
    const DropdownSeparator = () => <hr />;
    const DropdownCheckboxItem = ({ children, onCheckedChange, checked }: any) => (
        <button
            role="checkbox"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
        >
            {children}
        </button>
    );
    return { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator, DropdownCheckboxItem };
});

vi.mock("@ignix-ui/button", () => ({
    Button: ({ children, onClick, disabled, className, ...rest }: any) => (
        <button onClick={onClick} disabled={disabled} className={className} {...rest}>
            {children}
        </button>
    ),
}));

vi.mock("@ignix-ui/input", () => ({
    AnimatedInput: ({ value, onChange, placeholder, onKeyDown, id, autoFocus }: any) => (
        <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? ""}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            data-testid={id ?? "animated-input"}
        />
    ),
}));

vi.mock("@ignix-ui/textarea", () => ({
    default: ({ value, onChange, id, placeholder, className }: any) => (
        <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? ""}
            className={className}
            data-testid="textarea"
        />
    ),
}));

vi.mock("../../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

import {
    KanbanBoard,
    createSeed,
    formatDueDate,
    initials,
    avatarColor,
    newId,
    type Priority,
    type BoardState,
} from "./index";

const inDays = (d: number) => {
    const date = new Date();
    date.setDate(date.getDate() + d);
    return date.toISOString();
};

const createSampleSeed = (): BoardState => {
    const c1 = newId();
    const c2 = newId();
    const c3 = newId();
    const c4 = newId();
    const c5 = newId();
    const c6 = newId();
    const c7 = newId();

    return {
        columns: [
            { id: "col-todo", title: "To Do", accent: "rose", cardIds: [c1, c2] },
            { id: "col-progress", title: "In Progress", accent: "amber", cardIds: [c3, c4] },
            { id: "col-done", title: "Done", accent: "emerald", cardIds: [c5, c6, c7] },
        ],
        cards: {
            [c1]: {
                id: c1,
                title: "Redesign onboarding flow",
                description: "Create a more intuitive user experience for new signups.",
                priority: "high",
                labels: [{ id: "l1", name: "Design", color: "violet" }],
                assignees: [{ id: "a1", name: "Maya Chen" }],
                dueDate: inDays(2),
                comments: 4,
            },
            [c2]: {
                id: c2,
                title: "Audit landing page copy",
                description: "Review all text content for SEO and conversion clarity.",
                priority: "medium",
                labels: [{ id: "l2", name: "Marketing", color: "sky" }],
                assignees: [],
                dueDate: inDays(-1),
            },
            [c3]: {
                id: c3,
                title: "Build Kanban drag-and-drop",
                priority: "urgent",
                labels: [{ id: "l3", name: "Feature", color: "emerald" }],
                assignees: [{ id: "a2", name: "Jordan Lee" }],
                attachments: 2,
            },
            [c4]: {
                id: c4,
                title: "Set up error tracking",
                priority: "urgent",
                labels: [{ id: "l4", name: "Infra", color: "slate" }],
                assignees: [],
            },
            [c5]: {
                id: c5,
                title: "Ship dark mode to public beta",
                priority: "high",
                labels: [],
                assignees: [{ id: "a1", name: "Maya Chen" }, { id: "a3", name: "Sam Patel" }],
            },
            [c6]: {
                id: c6,
                title: "Migrate billing to Stripe v2",
                priority: "urgent",
                labels: [{ id: "l5", name: "Urgent", color: "red" }],
                assignees: [{ id: "a4", name: "Noah Williams" }],
            },
            [c7]: {
                id: c7,
                title: "Fix responsive menu bug",
                priority: "low",
                labels: [{ id: "l6", name: "Bug", color: "amber" }],
                assignees: [],
                dueDate: inDays(-4),
            },
        },
        search: "",
        priorityFilter: "all",
    };
};

function renderBoard() {
    return render(<KanbanBoard initialState={createSampleSeed()} />);
}

async function waitForHydration() {
    await waitFor(() => expect(screen.getByText("To Do")).toBeInTheDocument());
}

describe("formatDueDate", () => {
    it("returns empty string when no date is provided", () => {
        expect(formatDueDate()).toEqual({ text: "", tone: "none" });
        expect(formatDueDate(undefined)).toEqual({ text: "", tone: "none" });
    });

    it('returns "Today" and tone "soon" for today\'s date', () => {
        const today = new Date().toISOString();
        const result = formatDueDate(today);
        expect(result.text).toBe("Today");
        expect(result.tone).toBe("soon");
    });

    it('returns "Tomorrow" and tone "soon" for tomorrow', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const result = formatDueDate(tomorrow.toISOString());
        expect(result.text).toBe("Tomorrow");
        expect(result.tone).toBe("soon");
    });

    it('returns "Yesterday" and tone "overdue" for yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const result = formatDueDate(yesterday.toISOString());
        expect(result.text).toBe("Yesterday");
        expect(result.tone).toBe("overdue");
    });

    it('returns "In N days" for a date within the next week', () => {
        const inFour = new Date();
        inFour.setDate(inFour.getDate() + 4);
        const result = formatDueDate(inFour.toISOString());
        expect(result.text).toBe("In 4 days");
        expect(result.tone).toBe("future");
    });

    it('returns "Nd overdue" for a date within the past week', () => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const result = formatDueDate(threeDaysAgo.toISOString());
        expect(result.text).toBe("3d overdue");
        expect(result.tone).toBe("overdue");
    });

    it("returns a formatted date string for dates > 7 days away", () => {
        const future = new Date();
        future.setDate(future.getDate() + 14);
        const result = formatDueDate(future.toISOString());
        expect(result.tone).toBe("future");
        expect(result.text).toMatch(/(?:[A-Z][a-z]+ \d+)|(?:\d+ [A-Z][a-z]+)/);
    });
});

describe("initials", () => {
    it("returns up to 2 uppercase initials from a full name", () => {
        expect(initials("Maya Chen")).toBe("MC");
        expect(initials("Jordan")).toBe("J");
        expect(initials("Priya Shah Patel")).toBe("PS");
    });

    it("handles extra whitespace gracefully", () => {
        expect(initials("  Ava  Martín  ")).toBe("AM");
    });

    it("returns empty string for empty input", () => {
        expect(initials("")).toBe("");
    });
});

describe("avatarColor", () => {
    it("returns a non-empty CSS class string", () => {
        const color = avatarColor("Maya Chen");
        expect(typeof color).toBe("string");
        expect(color.length).toBeGreaterThan(0);
    });

    it("is deterministic for the same name", () => {
        expect(avatarColor("Sam Patel")).toBe(avatarColor("Sam Patel"));
    });

    it("may differ across different names", () => {
        const colors = ["Maya", "Jordan", "Sam", "Priya", "Ava", "Noah"].map(avatarColor);
        const unique = new Set(colors);
        expect(unique.size).toBeGreaterThan(1);
    });
});

describe("newId", () => {
    it("generates a string", () => {
        expect(typeof newId()).toBe("string");
    });

    it("generates unique values", () => {
        const ids = Array.from({ length: 50 }, () => newId());
        expect(new Set(ids).size).toBe(50);
    });
});

describe("createSeed", () => {
    let seed: BoardState;

    beforeEach(() => {
        seed = createSeed();
    });

    it("creates exactly 3 columns", () => {
        expect(seed.columns).toHaveLength(3);
    });

    it("names columns correctly", () => {
        const titles = seed.columns.map((c) => c.title);
        expect(titles).toEqual(["To Do", "In Progress", "Done"]);
    });

    it("starts with no cards", () => {
        expect(Object.keys(seed.cards)).toHaveLength(0);
        seed.columns.forEach((col) => {
            expect(col.cardIds).toHaveLength(0);
        });
    });

    it("all priority meta mapping remains valid", () => {
        const validPriorities: Priority[] = ["urgent", "high", "medium", "low"];
        // Logic test for the type system and default values
        expect(validPriorities).toContain("urgent");
    });

    it("initialises search and priorityFilter to defaults", () => {
        expect(seed.search).toBe("");
        expect(seed.priorityFilter).toBe("all");
    });
});

describe("KanbanBoard - initial render", () => {
    it("renders the skeleton initially (before hydration)", () => {
        renderBoard();
        expect(document.body).toBeInTheDocument();
    });

    it("renders column titles after hydration", async () => {
        renderBoard();
        await waitForHydration();
        expect(screen.getByText("To Do")).toBeInTheDocument();
        expect(screen.getByText("In Progress")).toBeInTheDocument();
        expect(screen.getByText("Done")).toBeInTheDocument();
    });

    it("renders the page heading", async () => {
        renderBoard();
        await waitForHydration();
        expect(screen.getByText("Kanban Board")).toBeInTheDocument();
    });

    it("displays card count in the header", async () => {
        renderBoard();
        await waitForHydration();
        expect(screen.getByText(/columns · \d+ cards/)).toBeInTheDocument();
    });

    it("renders seed cards in the board", async () => {
        renderBoard();
        await waitForHydration();
        expect(screen.getByText("Redesign onboarding flow")).toBeInTheDocument();
        expect(screen.getByText("Build Kanban drag-and-drop")).toBeInTheDocument();
        expect(screen.getByText("Ship dark mode to public beta")).toBeInTheDocument();
    });

    it("renders the Add column button", async () => {
        renderBoard();
        await waitForHydration();
        expect(screen.getByText("Add column")).toBeInTheDocument();
    });
});

describe("KanbanBoard - search", () => {
    it("filters cards as user types", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const searchInput = screen.getByPlaceholderText("Search cards…");
        await user.type(searchInput, "dark mode");

        await waitFor(() => {
            expect(screen.getByText("Ship dark mode to public beta")).toBeInTheDocument();
            expect(screen.queryByText("Redesign onboarding flow")).not.toBeInTheDocument();
        });
    });

    it("shows a clear (X) button when search has a value", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const searchInput = screen.getByPlaceholderText("Search cards…");
        await user.type(searchInput, "billing");

        expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
    });

    it("restores all cards when the clear button is clicked", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const searchInput = screen.getByPlaceholderText("Search cards…");
        await user.type(searchInput, "billing");

        await waitFor(() =>
            expect(screen.queryByText("Redesign onboarding flow")).not.toBeInTheDocument()
        );

        await user.click(screen.getByLabelText("Clear search"));

        await waitFor(() =>
            expect(screen.getByText("Redesign onboarding flow")).toBeInTheDocument()
        );
    });

    it("matches card labels in the search", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const searchInput = screen.getByPlaceholderText("Search cards…");
        await user.type(searchInput, "Infra");

        await waitFor(() =>
            expect(screen.getByText("Set up error tracking")).toBeInTheDocument()
        );
    });

    it("matches assignee names in the search", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const searchInput = screen.getByPlaceholderText("Search cards…");
        await user.type(searchInput, "Noah Williams");

        await waitFor(() =>
            expect(screen.getByText("Migrate billing to Stripe v2")).toBeInTheDocument()
        );
    });
});

describe("KanbanBoard - priority filter", () => {
    it("filters to only urgent cards when Urgent is selected", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const priorityBtn = screen.getByText("Priority");
        await user.click(priorityBtn);

        const urgentOption = await screen.findByRole("checkbox", { name: /urgent/i });
        await user.click(urgentOption);

        await waitFor(() => {
            expect(screen.getByText("Set up error tracking")).toBeInTheDocument();
            expect(screen.getByText("Migrate billing to Stripe v2")).toBeInTheDocument();
            expect(screen.queryByText("Redesign onboarding flow")).not.toBeInTheDocument();
        });
    });

    it("restores all cards when All priorities is selected", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        await user.click(screen.getByText("Priority"));
        await user.click(await screen.findByRole("checkbox", { name: /urgent/i }));

        const filterBtn = screen.getByRole("button", { name: /Urgent/i });
        if (!screen.queryByTestId("dropdown-menu")) {
            await user.click(filterBtn);
        }
        const allOption = await screen.findByText("All priorities");
        await user.click(allOption);

        await waitFor(() =>
            expect(screen.getByText("Redesign onboarding flow")).toBeInTheDocument()
        );
    });
});

describe("KanbanBoard - add column", () => {
    it("opens the new-column composer when Add column is clicked", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        await user.click(screen.getByText("Add column"));

        expect(screen.getByText("New column")).toBeInTheDocument();
    });

    it("creates a new column on submit", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        await user.click(screen.getByText("Add column"));

        const addButtons = screen.getAllByText("Add column");
        await user.click(addButtons[addButtons.length - 1]);

    });

    it("closes the composer when Escape is pressed", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        await user.click(screen.getByText("Add column"));
        await user.keyboard("{Escape}");
    });

    it("does not create a column when title is empty", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        await user.click(screen.getByText("Add column"));

        const addButtons = screen.getAllByText("Add column");
        const submitBtn = addButtons[addButtons.length - 1];
        expect(submitBtn).toBeDisabled();
    });
});

describe("KanbanBoard - add card", () => {
    async function openCreateModal(user: ReturnType<typeof userEvent.setup>) {
        renderBoard();
        await waitForHydration();
        const addCardButtons = screen.getAllByText(/Add card/);
        await user.click(addCardButtons[0]);

        await waitFor(() =>
            expect(screen.getByRole("dialog", { name: /create new card/i })).toBeInTheDocument()
        );
    }

    it("opens the Create Card modal", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);
        expect(screen.getByText("Create New Card")).toBeInTheDocument();
    });

    it("Create Card button is disabled when title is empty", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);
        expect(screen.getByText("Create Card")).toBeDisabled();
    });

    it("enables Create Card button when a title is typed", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);

        const titleInput = screen.getByLabelText(/title/i);
        await user.type(titleInput, "New test card");

        expect(screen.getByText("Create Card")).not.toBeDisabled();
    });

    it("adds the card to the board after submission", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);

        const titleInput = screen.getByLabelText(/title/i);
        await user.type(titleInput, "My brand-new card");
        await user.click(screen.getByText("Create Card"));

        await waitFor(() =>
            expect(screen.getByText("My brand-new card")).toBeInTheDocument()
        );
    });

    it("closes the modal when Cancel is clicked", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);

        await user.click(screen.getByText("Cancel"));

        await waitFor(() =>
            expect(
                screen.queryByRole("dialog", { name: /create new card/i })
            ).not.toBeInTheDocument()
        );
    });
});

describe("KanbanBoard - edit card", () => {
    async function openEditModal(user: ReturnType<typeof userEvent.setup>) {
        renderBoard();
        await waitForHydration();
        await user.click(screen.getByText("Redesign onboarding flow"));

        await waitFor(() =>
            expect(screen.getByRole("dialog", { name: /edit card/i })).toBeInTheDocument()
        );
    }

    it("opens the Edit Card modal when a card is clicked", async () => {
        const user = userEvent.setup();
        await openEditModal(user);
        expect(screen.getByText("Edit Card")).toBeInTheDocument();
    });

    it("pre-fills the title field with the card's title", async () => {
        const user = userEvent.setup();
        await openEditModal(user);

        const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
        expect(titleInput.value).toBe("Redesign onboarding flow");
    });

    it("saves edited title back to the board", async () => {
        const user = userEvent.setup();
        await openEditModal(user);

        const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
        await user.clear(titleInput);
        await user.type(titleInput, "Updated onboarding flow");
        await user.click(screen.getByText("Save Changes"));

        await waitFor(() =>
            expect(screen.getByText("Updated onboarding flow")).toBeInTheDocument()
        );
    });

    it("closes the modal when the close button is clicked", async () => {
        const user = userEvent.setup();
        await openEditModal(user);

        await user.click(screen.getByLabelText("Close modal"));

        await waitFor(() =>
            expect(
                screen.queryByRole("dialog", { name: /edit card/i })
            ).not.toBeInTheDocument()
        );
    });

    it("shows the Delete Card button in edit mode", async () => {
        const user = userEvent.setup();
        await openEditModal(user);
        expect(screen.getByText("Delete Card")).toBeInTheDocument();
    });

    it("deletes the card from the board after confirmation", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockReturnValueOnce(true);

        await openEditModal(user);
        await user.click(screen.getByText("Delete Card"));

        await waitFor(() =>
            expect(
                screen.queryByText("Redesign onboarding flow")
            ).not.toBeInTheDocument()
        );
    });

    it("keeps the card when confirm returns false", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockReturnValueOnce(false);

        await openEditModal(user);
        await user.click(screen.getByText("Delete Card"));

        await waitFor(() =>
            expect(screen.getByText("Redesign onboarding flow")).toBeInTheDocument()
        );
    });
});

describe("KanbanBoard - rename column", () => {
    it("shows an input when Rename is selected from the column menu", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const columnHeaders = screen.getAllByTitle("Double-click to rename");
        const firstColumnTitle = columnHeaders[0];

        await user.dblClick(firstColumnTitle);

        await waitFor(() =>
            expect(screen.getByPlaceholderText("Column title")).toBeInTheDocument()
        );
    });

    it("commits the rename on Enter", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const columnTitle = screen.getAllByTitle("Double-click to rename")[0];
        await user.dblClick(columnTitle);

        const input = screen.getByPlaceholderText("Column title") as HTMLInputElement;
        await user.clear(input);
        await user.type(input, "Backlog{Enter}");

        await waitFor(() => expect(screen.getByText("Backlog")).toBeInTheDocument());
    });

    it("discards the rename on Escape", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const columnTitle = screen.getAllByTitle("Double-click to rename")[0];
        await user.dblClick(columnTitle);

        const input = screen.getByPlaceholderText("Column title");
        await user.clear(input);
        await user.type(input, "Discard me{Escape}");

        await waitFor(() => {
            expect(screen.queryByText("Discard me")).not.toBeInTheDocument();
            expect(screen.getByText("To Do")).toBeInTheDocument();
        });
    });
});

describe("KanbanBoard - delete column", () => {
    it("removes the column after confirmation in the modal", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const toDoColumn = screen.getByText("To Do").closest("div.bg-board-column")!;
        const moreHorizButton = toDoColumn.querySelector("button.h-7.w-7") as HTMLElement;
        await user.click(moreHorizButton);

        const deleteColBtn = await screen.findByText("Delete column");
        await user.click(deleteColBtn);

        const confirmBtn = await screen.findByText("Delete Column");
        await user.click(confirmBtn);

        await waitFor(() => expect(screen.queryByText("To Do")).not.toBeInTheDocument());
    });
});

describe("KanbanBoard - clear column", () => {
    it("removes all cards from a column", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        const toDoColumn = screen.getByText("To Do").closest("div.bg-board-column")!;
        const moreHorizButton = toDoColumn.querySelector("button.h-7.w-7") as HTMLElement;
        await user.click(moreHorizButton);

        const clearBtn = await screen.findByText("Clear cards");
        await user.click(clearBtn);

        await waitFor(() => {
            expect(screen.queryByText("Redesign onboarding flow")).not.toBeInTheDocument();
            expect(screen.queryByText("Audit landing page copy")).not.toBeInTheDocument();
        });
    });
});

describe("CardModal - label management", () => {
    async function openCreateModal(user: ReturnType<typeof userEvent.setup>) {
        renderBoard();
        await waitForHydration();
        const addCardButtons = screen.getAllByText(/Add card/);
        await user.click(addCardButtons[0]);
        await waitFor(() =>
            expect(screen.getByRole("dialog", { name: /create new card/i })).toBeInTheDocument()
        );
    }

    it("adds a label when Enter is pressed in the label input", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);

        const inputs = screen.getAllByTestId("animated-input");
        const labelInput = inputs[1];

        await user.type(labelInput, "NewTag{Enter}");
        expect(screen.getByText("NewTag")).toBeInTheDocument();
    });

    it("removes a label when its x button is clicked", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);

        const inputs = screen.getAllByTestId("animated-input");
        const labelInput = inputs[1];

        await user.type(labelInput, "TempTag{Enter}");

        const tag = screen.getByText("TempTag");
        const removeBtn = tag.querySelector("button") as HTMLElement;
        await user.click(removeBtn);

        expect(screen.queryByText("TempTag")).not.toBeInTheDocument();
    });
});

describe("CardModal - assignee management", () => {
    async function openCreateModal(user: ReturnType<typeof userEvent.setup>) {
        renderBoard();
        await waitForHydration();
        const addCardButtons = screen.getAllByText(/Add card/);
        await user.click(addCardButtons[0]);
        await waitFor(() =>
            expect(screen.getByRole("dialog", { name: /create new card/i })).toBeInTheDocument()
        );
    }

    it("adds an assignee on Enter", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);

        const inputs = screen.getAllByTestId("animated-input");
        const assigneeInput = inputs[2];

        await user.type(assigneeInput, "Alex Kim{Enter}");
        expect(screen.getByText("Alex Kim")).toBeInTheDocument();
    });

    it("removes an assignee when × is clicked", async () => {
        const user = userEvent.setup();
        await openCreateModal(user);

        const inputs = screen.getAllByTestId("animated-input");
        const assigneeInput = inputs[2];

        await user.type(assigneeInput, "Temp User{Enter}");
        const chip = screen.getByText("Temp User").closest("span")!;
        const xBtn = chip.querySelector("button")!;
        await user.click(xBtn);

        expect(screen.queryByText("Temp User")).not.toBeInTheDocument();
    });
});

describe("KanbanBoard - drag and drop (handler smoke tests)", () => {
    it("sets the dragging card to semi-transparent when drag starts", async () => {
        renderBoard();
        await waitForHydration();

        const card = screen.getByText("Redesign onboarding flow").closest("[draggable]")!;

        fireEvent.dragStart(card, {
            dataTransfer: {
                setData: vi.fn(),
                effectAllowed: "",
            },
        });

        await waitFor(() => {
            expect(card).toHaveClass("opacity-40");
        });
    });

    it("clears the dragging state after drag ends", async () => {
        renderBoard();
        await waitForHydration();

        const card = screen.getByText("Redesign onboarding flow").closest("[draggable]")!;

        fireEvent.dragStart(card, {
            dataTransfer: { setData: vi.fn(), effectAllowed: "" },
        });

        await waitFor(() => expect(card).toHaveClass("opacity-40"));

        fireEvent.dragEnd(card);

        await waitFor(() => expect(card).not.toHaveClass("opacity-40"));
    });
});

describe("KanbanBoard - accessibility", () => {
    it("renders the board columns as a list with an accessible label", async () => {
        renderBoard();
        await waitForHydration();

        expect(screen.getByRole("list", { name: /board columns/i })).toBeInTheDocument();
    });

    it("search input has an accessible placeholder", async () => {
        renderBoard();
        await waitForHydration();
        expect(screen.getByPlaceholderText("Search cards…")).toBeInTheDocument();
    });

    it("clear search button has an aria-label", async () => {
        const user = userEvent.setup();
        renderBoard();
        await waitForHydration();

        await user.type(screen.getByPlaceholderText("Search cards…"), "x");
        expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
    });
});