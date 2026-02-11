import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdvancedTable, type AdvancedTableRow } from "./index";

/**
 * Storybook stories for the AdvancedTable component.
 *
 * This story showcases a fully interactive data table that fulfills the
 * following requirements:
 *
 * - Headers, rows, columns with embedded sample data
 * - Striped rows and alternating row colors
 * - Clickable column headers with sort indicators (↑ / ↓)
 * - Sort direction toggle and correct sorting behavior
 * - Pagination controls (first, previous, page numbers, next, last)
 * - Rows per page selector
 * - Total count and page indicator
 * - Filter input above the table with real-time filtering
 * - Matching rows highlighted using `<mark>`
 * - Clear filter button that resets the filter state
 *
 * @file advanced-table.stories.tsx
 */

/**
 * Storybook metadata configuration for AdvancedTable.
 *
 * Controls where the story appears in the sidebar and defines Docs content.
 */
const meta: Meta<typeof AdvancedTable> = {
  title: "Components/Advanced Table",
  component: AdvancedTable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **Advanced Table** component demonstrates a rich, fully client-side UX:

- Click any column header to sort; click again to toggle direction.
- Follow the arrow (↑/↓) in the header to see current sort direction.
- Use the filter input above the table for real-time filtering; matching text is highlighted.
- Use the rows-per-page selector and pagination controls to navigate large datasets.
- The summary text verifies total row count, current slice, and page indicator for QA.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AdvancedTable>;

const sampleColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "status", label: "Status", sortable: false }, // example of non-sortable column
];

const sampleRows: AdvancedTableRow[] = [
  {id: 2, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  {id: 1, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Invited" },
  {id: 4, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Active" },
  {id: 3, name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Suspended" },
  {id: 5, name: "Ethan Hunt", email: "ethan@example.com", role: "Editor", status: "Active" },
  {id: 7, name: "Fiona Gallagher", email: "fiona@example.com", role: "Viewer", status: "Pending" },
  {id: 6, name: "George Miller", email: "george@example.com", role: "Viewer", status: "Active" },
  {id: 8, name: "Hannah Lee", email: "hannah@example.com", role: "Admin", status: "Active" },
  {id: 10, name: "Ian Wright", email: "ian@example.com", role: "Editor", status: "Invited" },
  {id: 9, name: "Julia Roberts", email: "julia@example.com", role: "Viewer", status: "Active" },
  {id: 11, name: "Kevin Durant", email: "kevin@example.com", role: "Viewer", status: "Pending" },
  {id: 12, name: "Laura Palmer", email: "laura@example.com", role: "Admin", status: "Suspended" },
];

/**
 * Fully-featured AdvancedTable story.
 *
 * Validates all acceptance criteria (sorting, filtering, pagination, highlighting).
 */
export const Default: Story = {
  render: () => <AdvancedTable rows={sampleRows} columns={sampleColumns} />,
};

/**
 * Base table: no sorting, filtering, or pagination.
 *
 * Renders the raw data set with striped rows and responsive scrolling.
 */
export const BaseTable: Story = {
  render: () => (
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting={false}
      enableFiltering={false}
      enablePagination={false}
    />
  ),
};

/**
 * Sortable table: only sorting enabled.
 *
 * Demonstrates clicking headers to sort and toggle sort direction.
 */
export const SortableTable: Story = {
  render: () => (
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting
      enableFiltering={false}
      enablePagination={false}
    />
  ),
};

/**
 * Filterable table: only filtering enabled.
 *
 * Demonstrates the search/filter input and highlighted matches.
 */
export const FilterableTable: Story = {
  render: () => (
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting={false}
      enableFiltering
      enablePagination={false}
    />
  ),
};

/**
 * Paginated table: only pagination enabled.
 *
 * Demonstrates page navigation and rows-per-page selector.
 */
export const PaginatedTable: Story = {
  render: () => (
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting={false}
      enableFiltering={false}
      enablePagination
    />
  ),
};

