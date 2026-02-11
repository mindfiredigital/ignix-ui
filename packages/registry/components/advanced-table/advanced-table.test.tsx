/**
 * Unit tests for AdvancedTable component
 *
 * Covers:
 * - Basic rendering and default behavior
 * - Sorting (including numeric sorting) and non-sortable columns
 * - Filtering and highlight rendering
 * - Clear filter behavior
 * - Pagination (rows-per-page, page navigation, summary text)
 * - Interaction between sorting and pagination (sorting only current page)
 *
 * @file advanced-table.test.tsx
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AdvancedTable } from ".";

/**
 * Mocks
 * - lucide-react icons as simple SVGs
 * - Button as a simple HTML button
 * - AnimatedInput as a controlled input (value + onChange(string))
 */

// Mock lucide-react icons
vi.mock("lucide-react", () => {
  const MockIcon = ({
    "data-testid": testId,
    ...props
  }: React.SVGProps<SVGSVGElement> & { "data-testid"?: string }) => (
    <svg
      data-testid={testId || "icon"}
      role="img"
      aria-hidden="true"
      {...props}
    />
  );

  return {
    ChevronLeft: MockIcon,
    ChevronRight: MockIcon,
    ChevronsLeft: MockIcon,
    ChevronsRight: MockIcon,
    Search: MockIcon,
    X: MockIcon,
  };
});

// Mock Button component
vi.mock("../button", () => {
  const Button: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
  > = ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  );

  return { Button };
});

// Mock AnimatedInput as a simple controlled input
vi.mock("../input", () => {
  const AnimatedInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    size?: string;
    variant?: string;
    icon?: React.ComponentType<any>;
    labelClassName?: string;
  }> = ({ value, onChange, placeholder }) => (
    <input
      data-testid="advanced-table-filter-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  return { AnimatedInput };
});

const sampleColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "status", label: "Status", sortable: false },
];

const sampleRows = [
  { id: 3, name: "Charlie", status: "Active" },
  { id: 1, name: "Alice", status: "Pending" },
  { id: 2, name: "Bob", status: "Inactive" },
];

describe("AdvancedTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders headers and rows correctly from props", () => {
    render(
      <AdvancedTable
        rows={sampleRows}
        columns={sampleColumns}
        enableSorting={false}
        enableFiltering={false}
        enablePagination={false}
      />
    );

    // Headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Rows / cells
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  const getBodyRows = (table: HTMLElement) =>
    Array.from(table.querySelectorAll("tbody tr")) as HTMLTableRowElement[];

  it("sorts numeric column by ID when clicking header (ascending then descending)", async () => {
    const user = userEvent.setup();

    // defaultSortKey is Name so ID column starts unsorted, then we click ID to sort
    render(
      <AdvancedTable
        rows={sampleRows}
        columns={sampleColumns}
        enableSorting
        enableFiltering={false}
        enablePagination={false}
        defaultSortKey="name"
      />
    );

    const table = screen.getByRole("table");
    const getBodyIds = () =>
      getBodyRows(table).map((row) => {
        const firstCell = row.querySelectorAll("td")[0];
        return firstCell?.textContent?.trim();
      });

    // Initial order is based on defaultSortKey="name" so it's Alice, Bob, Charlie -> IDs 1,2,3
    expect(getBodyIds()).toEqual(["1", "2", "3"]);

    // Click "ID" header to sort ascending by numeric ID (data already in ascending order)
    const idHeader = screen.getByRole("columnheader", { name: /^ID/ });
    await user.click(idHeader);
    expect(getBodyIds()).toEqual(["1", "2", "3"]);

    // Click again to toggle to descending
    await user.click(idHeader);
    expect(getBodyIds()).toEqual(["3", "2", "1"]);
  });

  it("does not sort when clicking a non-sortable column header", async () => {
    const user = userEvent.setup();

    render(
      <AdvancedTable
        rows={sampleRows}
        columns={sampleColumns}
        enableSorting
        enableFiltering={false}
        enablePagination={false}
        defaultSortKey="id"
      />
    );

    const table = screen.getByRole("table");
    const getBodyNames = () =>
      getBodyRows(table).map((row) => {
        const cells = row.querySelectorAll("td");
        return cells[1].textContent?.trim(); // Name column
      });

    const initialNames = getBodyNames();

    // Click non-sortable "Status" column
    const statusHeader = screen.getByRole("columnheader", { name: /^Status/ });
    await user.click(statusHeader);

    expect(getBodyNames()).toEqual(initialNames);
  });

  it("filters rows based on the query and renders highlight marks", async () => {
    const user = userEvent.setup();

    render(
      <AdvancedTable
        rows={sampleRows}
        columns={sampleColumns}
        enableSorting={false}
        enableFiltering
        enablePagination={false}
      />
    );

    const filterInput = screen.getByPlaceholderText("Filter rows...");

    await user.type(filterInput, "Ali");

    // Only "Alice" should remain visible among sampleRows
    // Text is split across elements (<mark>Ali</mark>ce), so query table cells directly
    const table = screen.getByRole("table");
    const rows = getBodyRows(table);
    expect(rows).toHaveLength(1); // Only Alice should match
    
    // Check that the name cell contains "Alice" (split across mark and text)
    const nameCell = rows[0].querySelectorAll("td")[1];
    expect(nameCell?.textContent).toBe("Alice");
    
    // Verify other rows are not present
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    // Highlight <mark> should be rendered for the match
    const markElements = table.querySelectorAll("mark");
    expect(markElements.length).toBeGreaterThan(0);
  });

  it("clear filter button resets filter and restores all rows", async () => {
    const user = userEvent.setup();

    render(
      <AdvancedTable
        rows={sampleRows}
        columns={sampleColumns}
        enableSorting={false}
        enableFiltering
        enablePagination={false}
      />
    );

    const filterInput = screen.getByPlaceholderText("Filter rows...");
    await user.type(filterInput, "Ali");

    // Filtered down to Alice - check table has only one row
    const table = screen.getByRole("table");
    let rows = getBodyRows(table);
    expect(rows).toHaveLength(1);
    expect(rows[0].querySelectorAll("td")[1]?.textContent).toBe("Alice");
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();

    // Click "Clear filter" button
    const clearButton = screen.getByRole("button", { name: /Clear filter/i });
    await user.click(clearButton);

    // All rows back - check table has all 3 rows
    rows = getBodyRows(table);
    expect(rows).toHaveLength(3);
    const nameCells = rows.map((row) => row.querySelectorAll("td")[1]?.textContent);
    expect(nameCells).toContain("Alice");
    expect(nameCells).toContain("Charlie");
    expect(nameCells).toContain("Bob");

    // Input cleared
    expect(filterInput).toHaveValue("");
  });

  it("paginates rows and shows correct summary text and rows-per-page behavior", async () => {
    const user = userEvent.setup();

    const rows = [
      { id: 1, name: "Row 1", status: "A" },
      { id: 2, name: "Row 2", status: "B" },
      { id: 3, name: "Row 3", status: "C" },
      { id: 4, name: "Row 4", status: "D" },
      { id: 5, name: "Row 5", status: "E" },
    ];

    render(
      <AdvancedTable
        rows={rows}
        columns={sampleColumns}
        enableSorting={false}
        enableFiltering={false}
        enablePagination
        initialRowsPerPage={2}
        rowsPerPageOptions={[2, 5]}
      />
    );

    // Initial summary: page 1 with 2 rows visible
    expect(screen.getByText(/Showing 1-2 of 5 matching rows/i)).toBeInTheDocument();
    expect(screen.getByText(/total dataset: 5/i)).toBeInTheDocument();

    const table = screen.getByRole("table");
    expect(getBodyRows(table)).toHaveLength(2);

    // Change rows per page to 5
    const select = screen.getByRole("combobox", { name: /rows per page/i });
    await user.selectOptions(select, "5");

    // Now all 5 rows visible
    expect(getBodyRows(table)).toHaveLength(5);
    expect(screen.getByText(/Showing 1-5 of 5 matching rows/i)).toBeInTheDocument();
    expect(screen.getByText(/total dataset: 5/i)).toBeInTheDocument();
  });

  it("navigates between pages using pagination buttons", async () => {
    const user = userEvent.setup();

    const rows = [
      { id: 1, name: "Row 1", status: "A" },
      { id: 2, name: "Row 2", status: "B" },
      { id: 3, name: "Row 3", status: "C" },
      { id: 4, name: "Row 4", status: "D" },
    ];

    render(
      <AdvancedTable
        rows={rows}
        columns={sampleColumns}
        enableSorting={false}
        enableFiltering={false}
        enablePagination
        initialRowsPerPage={2}
        rowsPerPageOptions={[2]}
      />
    );

    const table = screen.getByRole("table");
    const getVisibleNames = () =>
      getBodyRows(table).map((row) => {
        const cells = row.querySelectorAll("td");
        return cells[1].textContent?.trim();
      });

    // Page 1: Row 1 & Row 2
    expect(getVisibleNames()).toEqual(["Row 1", "Row 2"]);
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();

    // Go to page 2
    const page2Button = screen.getByRole("button", { name: "2" });
    await user.click(page2Button);

    expect(getVisibleNames()).toEqual(["Row 3", "Row 4"]);
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
  });

  it("sorts only the current page data when pagination is enabled", async () => {
    const user = userEvent.setup();

    const rows = [
      { id: 1, name: "Charlie", status: "A" }, // page 1
      { id: 2, name: "Alpha", status: "A" }, // page 1
      { id: 3, name: "Bravo", status: "A" }, // page 1
      { id: 4, name: "Foxtrot", status: "A" }, // page 2
      { id: 5, name: "Delta", status: "A" }, // page 2
      { id: 6, name: "Echo", status: "A" }, // page 2
    ];

    render(
      <AdvancedTable
        rows={rows}
        columns={sampleColumns}
        enableSorting
        enableFiltering={false}
        enablePagination
        initialRowsPerPage={3}
        rowsPerPageOptions={[3]}
        defaultSortKey="id"
      />
    );

    const table = screen.getByRole("table");
    const getVisibleNames = () =>
      getBodyRows(table).map((row) => {
        const cells = row.querySelectorAll("td");
        return cells[1].textContent?.trim(); // Name
      });

    // Go to page 2 (should initially show [Foxtrot, Delta, Echo] in ID order)
    const page2Button = screen.getByRole("button", { name: "2" });
    await user.click(page2Button);
    const namesBefore = getVisibleNames();
    expect(namesBefore).toEqual(["Foxtrot", "Delta", "Echo"]);

    // Click "Name" header to sort current page's names alphabetically
    const nameHeader = screen.getByRole("columnheader", { name: /^Name/ });
    await user.click(nameHeader);

    const namesAfter = getVisibleNames();
    // Same set of names (still page-2 rows), but different order
    expect([...namesAfter].sort()).toEqual([...namesBefore].sort());
    expect(namesAfter).toEqual(["Delta", "Echo", "Foxtrot"]);
  });
});


