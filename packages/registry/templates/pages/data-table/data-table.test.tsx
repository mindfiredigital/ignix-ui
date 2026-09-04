import React from 'react';
import { render, screen, fireEvent, within} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { DataTable, DataTableProps, type Column } from '.';
import userEvent from '@testing-library/user-event';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
        span: ({ children }: any) => <span>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@radix-ui/react-dropdown-menu', () => ({
    Root: ({ children }: any) => <div>{children}</div>,
    Trigger: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div>{children}</div>,
    Portal: ({ children }: any) => <div>{children}</div>,
    Item: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@ignix-ui/checkbox', () => ({
    Checkbox: ({ checked, onChange, ...props }: any) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            data-testid="checkbox"
            {...props}
        />
    ),
}));

/* ============================================
   TEST DATA
============================================ */

type User = {
    id: number;
    name: string;
    age?: number;
};

const data: User[] = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 20 },
];

const columns: Column<User>[] = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'age', title: 'Age', sortable: true },
];

/* ============================================
   TEST SUITE
============================================ */

describe('DataTable', () => {
    const defaultProps: DataTableProps<User>= {
        data,
        columns,
        keyExtractor: (row: User) => row.id,
        bulkActions: [
            {
                label: 'Delete',
                variant: 'destructive',
                onClick: (rows) => alert(`Deleted ${rows.length} employee(s)`),
            },
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    /* ============================================
       BASIC RENDERING
    ============================================ */

    describe('Basic Rendering', () => {
        it('renders table with data', () => {
            render(<DataTable {...defaultProps} />);

            expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
        });

        it('shows empty state', () => {
            render(<DataTable {...defaultProps} data={[]} emptyStateMessage="No data available" />);

            expect(screen.getAllByText('No data available').length).toBeGreaterThan(0);
        });

        it('shows loading state', () => {
            render(<DataTable {...defaultProps} loading />);

            expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        });
    });

    /* ============================================
       SEARCH
    ============================================ */

    describe('Search', () => {
        it('filters rows based on input', () => {
            render(<DataTable {...defaultProps} />);

            const input = screen.getByPlaceholderText(/search/i);

            fireEvent.change(input, { target: { value: 'Alice' } });

            expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
            expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        });
    });

    /* ============================================
       SORTING
    ============================================ */

    describe('Sorting', () => {
        it('sorts column on header click', () => {
            render(<DataTable {...defaultProps} />);
            const table = screen.getByRole('grid');
            const ageHeader = within(table).getByText('Age');

            fireEvent.click(ageHeader);

            const rows = screen.getAllByRole('row');

            expect(rows[1]).toHaveTextContent('Charlie'); // lowest age first
        });
    });

    /* ============================================
       PAGINATION
    ============================================ */

    describe('Pagination', () => {
        it('moves to next page', () => {
            const bigData = Array.from({ length: 15 }, (_, i) => ({
                id: i,
                name: `User ${i}`,
                age: 20 + i,
            }));

            render(
                <DataTable
                    {...defaultProps}
                    data={bigData}
                    defaultPageSize={5}
                />
            );

            expect(screen.getAllByText('User 0')[0]).toBeInTheDocument();
            fireEvent.click(screen.getAllByLabelText(/next page/i)[0]);

            expect(screen.getAllByText('User 5')[0]).toBeInTheDocument();
        });
    });

    /* ============================================
       ROW SELECTION
    ============================================ */

    describe('Row Selection', () => {
        it('selects a row', async () => {
            render(<DataTable {...defaultProps} />);

            const rowCheckbox = screen.getAllByTestId('row-checkbox')[0];

            await userEvent.click(rowCheckbox);

            expect(rowCheckbox).toBeChecked();
        });

        it('selects all rows', () => {
            render(<DataTable {...defaultProps} />);

            const selectAll = screen.getByLabelText(/select all rows/i);

            fireEvent.click(selectAll);


            const checkboxes = screen.getAllByTestId('row-checkbox');
            checkboxes.forEach(cb => {
                expect(cb).toBeChecked();
            });
        });
    });

    /* ============================================
       BULK ACTIONS
    ============================================ */

    describe('Bulk Actions', () => {
        it('shows bulk actions when rows selected', async () => {
            render(<DataTable {...defaultProps} />);

            const rowCheckbox = screen.getAllByTestId('row-checkbox')[0];

            await userEvent.click(rowCheckbox);
           
            expect(screen.getByText('Delete')).toBeInTheDocument();
        });
    });

    /* ============================================
       COLUMN VISIBILITY
    ============================================ */

    describe('Column Visibility', () => {
        it('toggles column visibility', async () => {
            render(<DataTable {...defaultProps} />);

            const toggleBtn = screen.getByTestId('column-visibility-trigger');
            await userEvent.click(toggleBtn);

            const checkbox = await screen.findByTestId('checkbox-name');
            await userEvent.click(checkbox);

        });
    });

    /* ============================================
       COLUMN ALIGNMENT
    ============================================ */

    describe('Column Alignment', () => {
        it('applies correct alignment classes to th and td elements', () => {
            const alignedColumns: Column<User>[] = [
                { key: 'name', title: 'Name', align: 'left' },
                { key: 'age', title: 'Age', align: 'right' },
                { key: 'id', title: 'ID', align: 'center' },
            ];

            const { container } = render(<DataTable {...defaultProps} enableRowSelection={false} columns={alignedColumns} />);

            const headers = container.querySelectorAll('th');
            expect(headers[0]).toHaveClass('text-left');
            expect(headers[1]).toHaveClass('text-right');
            expect(headers[2]).toHaveClass('text-center');

            expect(headers[0].querySelector('div')).toHaveClass('justify-start');
            expect(headers[1].querySelector('div')).toHaveClass('justify-end');
            expect(headers[2].querySelector('div')).toHaveClass('justify-center');

            const rows = screen.getAllByRole('row');
            const cells = within(rows[1]).getAllByRole('cell');
            expect(cells[0]).toHaveClass('text-left');
            expect(cells[1]).toHaveClass('text-right');
            expect(cells[2]).toHaveClass('text-center');
        });
    });

    /* ============================================
       ACCESSIBILITY
    ============================================ */

    describe('Accessibility', () => {
        it('has table role', () => {
            render(<DataTable {...defaultProps} />);

            expect(screen.getByRole('grid')).toBeInTheDocument();
        });

        it('has search input', () => {
            render(<DataTable {...defaultProps} />);

            expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
        });
    });
});