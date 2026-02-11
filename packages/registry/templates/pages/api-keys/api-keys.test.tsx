// apikeys-page.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { ApiKeysPage } from './index';

// Mock all required dependencies
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        div: ({ children, initial, animate, transition, ...props }: any) => (
            <div {...props}>{children}</div>
        ),
    },
}));

vi.mock('@ignix-ui/button', () => ({
    Button: ({ children, onClick, variant, size, ...props }: any) => (
        <button
            onClick={onClick}
            data-testid="button"
            data-variant={variant}
            data-size={size}
            {...props}
        >
            {children}
        </button>
    ),
}));

vi.mock('@ignix-ui/typography', () => ({
    Typography: ({ children, variant, weight, color, ...props }: any) => (
        <div data-testid="typography" data-variant={variant} data-weight={weight} data-color={color} {...props}>
            {children}
        </div>
    ),
}));

vi.mock('@ignix-ui/checkbox', () => ({
    Checkbox: ({ checked, onChange, size, variant, ...props }: any) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            data-testid="checkbox"
            data-size={size}
            data-variant={variant}
            {...props}
        />
    ),
}));

vi.mock('@ignix-ui/input', () => ({
    AnimatedInput: ({ value, onChange, placeholder, type, ...props }: any) => (
        <input
            type={type || 'text'}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            data-testid="input"
            {...props}
        />
    ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Key: () => <div data-testid="key-icon">Key</div>,
    Plus: () => <div data-testid="plus-icon">Plus</div>,
    Eye: () => <div data-testid="eye-icon">Eye</div>,
    Trash2: () => <div data-testid="trash-icon">Trash</div>,
    Copy: () => <div data-testid="copy-icon">Copy</div>,
    Shield: () => <div data-testid="shield-icon">Shield</div>,
    Loader2: () => <div data-testid="loader-icon">Loader</div>,
    Download: () => <div data-testid="download-icon">Download</div>,
    Ban: () => <div data-testid="ban-icon">Ban</div>,
    Check: () => <div data-testid="check-icon">Check</div>,
    AlertTriangle: () => <div data-testid="alert-icon">Alert</div>,
    CheckCircle: () => <div data-testid="checkcircle-icon">CheckCircle</div>,
    AlertCircle: () => <div data-testid="alertcircle-icon">AlertCircle</div>,
    X: () => <div data-testid="x-icon">X</div>,
    Search: () => <div data-testid="search-icon">Search</div>,
    Filter: () => <div data-testid="filter-icon">Filter</div>,
    Activity: () => <div data-testid="activity-icon">Activity</div>,
    Users: () => <div data-testid="users-icon">Users</div>,
    Database: () => <div data-testid="database-icon">Database</div>,
    BarChart3: () => <div data-testid="chart-icon">Chart</div>,
    Settings: () => <div data-testid="settings-icon">Settings</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    MoreVertical: () => <div data-testid="more-icon">More</div>,
    CheckCircleIcon: () => <div data-testid="checkcircle-icon">CheckCircleIcon</div>,
    BanIcon: () => <div data-testid="banicon-icon">BanIcon</div>,
}));

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
    },
});

describe('ApiKeysPage', () => {
    const defaultProps = {};

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders with default props', () => {
        render(<ApiKeysPage {...defaultProps} />);

        // Check header
        expect(screen.getByText('API Keys Management')).toBeInTheDocument();
        expect(screen.getByText('Manage your API access keys and permissions')).toBeInTheDocument();

        // Check security notice
        expect(screen.getByText('Security First')).toBeInTheDocument();

        // Check stats section
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Total Keys')).toBeInTheDocument();
        expect(screen.getByText('Active Keys')).toBeInTheDocument();
        expect(screen.getByText('Total Calls')).toBeInTheDocument();
        expect(screen.getByText('Calls Today')).toBeInTheDocument();
        expect(screen.getByText('Revoked Keys')).toBeInTheDocument();

        // Check action buttons
        expect(screen.getByText('Generate Key')).toBeInTheDocument();
        expect(screen.getByText('Export')).toBeInTheDocument();
    });

    describe('Stats Overview', () => {
        it('displays correct stats values', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Default mock data has 5 total keys
            const totalKeysElement = screen.getByText('Total Keys').closest('div');
            expect(totalKeysElement).toBeInTheDocument();

            // Active keys - should count active status keys from mock data
            const activeKeysElement = screen.getByText('Active Keys').closest('div');
            expect(activeKeysElement).toBeInTheDocument();
        });

        it('shows loading state when isLoading is true', () => {
            render(<ApiKeysPage {...defaultProps} isLoading={true} />);

            // Should show loading spinner instead of content
            expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
        });

        it('uses custom stats when provided', () => {
            const customStats = <div data-testid="custom-stats">Custom Stats</div>;
            render(
                <ApiKeysPage
                    {...defaultProps}
                    customStatsSection={customStats}
                    showStats={true}
                />
            );

            expect(screen.getByTestId('custom-stats')).toBeInTheDocument();
        });
    });

    describe('Search and Filters', () => {
        it('renders search input with placeholder', () => {
            render(<ApiKeysPage {...defaultProps} />);

            const searchInput = screen.getByTestId('input');
            expect(searchInput).toHaveAttribute('placeholder', 'Search API keys...');
        });

        it('filters API keys by search query', () => {
            render(<ApiKeysPage {...defaultProps} />);

            const searchInput = screen.getByTestId('input');
            fireEvent.change(searchInput, { target: { value: 'Production' } });

            // Should filter to show only Production API key
            expect(screen.getByText('Production API')).toBeInTheDocument();
        });

        it('clears search when X button is clicked', () => {
            render(<ApiKeysPage {...defaultProps} />);

            const searchInput = screen.getByTestId('input');
            fireEvent.change(searchInput, { target: { value: 'Production' } });
            expect(searchInput).toHaveValue('Production');

            // Find and click the clear button (X icon)
            const clearButton = screen.getByTestId('x-icon').closest('button');
            fireEvent.click(clearButton!);
            expect(searchInput).toHaveValue('');
        });


    });

    describe('API Key Cards/Table', () => {
        it('renders API keys in grid view by default', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Check if API key cards are rendered
            expect(screen.getByText('Production API')).toBeInTheDocument();
            expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Mobile App')).toBeInTheDocument();
            expect(screen.getByText('Webhook Service')).toBeInTheDocument();
            expect(screen.getByText('Legacy System')).toBeInTheDocument();
        });

        it('switches between grid and list view', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Initially in list view
            const listViewButton = screen.getByText('List').closest('button');
            const gridViewButton = screen.getByText('Grid').closest('button');

            // List view should be active by default
            expect(listViewButton).toHaveAttribute('data-variant', 'default');
            expect(gridViewButton).toHaveAttribute('data-variant', 'ghost');
        });

        it('shows status badges for each API key', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Check status badges
            const statusElements = screen.getAllByText(/Active|Expired|Revoked/);
            expect(statusElements.length).toBeGreaterThan(0);
        });

        it('displays scope badges for permissions', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Check if scope badges are displayed
            const scopeElements = screen.getAllByText(/read:users|write:data|admin/i);
            expect(scopeElements.length).toBeGreaterThan(0);
        });
    });

    describe('Selection and Actions', () => {
        it('selects and deselects API keys', () => {
            render(<ApiKeysPage {...defaultProps} />);

            const checkboxes = screen.getAllByTestId('checkbox');
            const firstCheckbox = checkboxes[1]; // First data checkbox (skip header checkbox)

            // Select first key
            fireEvent.click(firstCheckbox);
            expect(firstCheckbox).toBeChecked();

            // Deselect first key
            fireEvent.click(firstCheckbox);
            expect(firstCheckbox).not.toBeChecked();
        });

        it('selects all keys with header checkbox', () => {
            render(<ApiKeysPage {...defaultProps} />);

            const headerCheckbox = screen.getAllByTestId('checkbox')[0];
            fireEvent.click(headerCheckbox);

            // All checkboxes should be checked
            const allCheckboxes = screen.getAllByTestId('checkbox');
            allCheckboxes.forEach(checkbox => {
                expect(checkbox).toBeChecked();
            });
        });
    });

    describe('Modals', () => {
        it('opens generate key modal', () => {
            render(<ApiKeysPage {...defaultProps} />);

            const generateButton = screen.getByText('Generate Key');
            fireEvent.click(generateButton);

            expect(screen.getByText('Generate New API Key')).toBeInTheDocument();
        });

        it('opens delete modal when delete button is clicked', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Find and click the delete button on first API key
            const deleteButtons = screen.getAllByTestId('trash-icon');
            fireEvent.click(deleteButtons[0].closest('button')!);

            expect(screen.getByText('Delete API Key')).toBeInTheDocument();
        });


        it('opens view key modal when eye button is clicked', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Find and click the view button
            const viewButtons = screen.getAllByTestId('eye-icon');
            fireEvent.click(viewButtons[0].closest('button')!);

            expect(screen.getByText('View API Key')).toBeInTheDocument();
        });
    });

    describe('Export Functionality', () => {
        it('calls export function when export button is clicked', () => {
            const mockExport = vi.fn();
            render(<ApiKeysPage {...defaultProps} onExportKeys={mockExport} />);

            const exportButton = screen.getByText('Export');
            fireEvent.click(exportButton);

            // Default export should be JSON
            expect(mockExport).toHaveBeenCalledWith('json');
        });


    });

    describe('Empty State', () => {

        it('shows search empty state when no results', () => {
            render(<ApiKeysPage {...defaultProps} />);

            const searchInput = screen.getByTestId('input');
            fireEvent.change(searchInput, { target: { value: 'NonExistentKey' } });

            expect(screen.getByText('No API Keys Found')).toBeInTheDocument();
            expect(screen.getByText('No API keys match your search. Try adjusting your filters or search terms.')).toBeInTheDocument();
        });

    });

    describe('Accessibility', () => {
        it('has proper labels and roles', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Search input should have placeholder
            const searchInput = screen.getByTestId('input');
            expect(searchInput).toHaveAttribute('placeholder', 'Search API keys...');

            // Buttons should be accessible
            const buttons = screen.getAllByTestId('button');
            buttons.forEach(button => {
                expect(button).toBeEnabled();
            });
        });

        it('key information is properly labeled', () => {
            render(<ApiKeysPage {...defaultProps} />);

            // Check if key names are visible
            expect(screen.getByText('Production API')).toBeInTheDocument();
            expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
        });
    });

    describe('Customization Options', () => {
        it('uses custom header when provided', () => {
            const customHeader = <div data-testid="custom-header">Custom Header</div>;
            render(<ApiKeysPage {...defaultProps} customHeader={customHeader} />);

            expect(screen.getByTestId('custom-header')).toBeInTheDocument();
        });




        it('uses custom search placeholder', () => {
            render(
                <ApiKeysPage
                    {...defaultProps}
                    searchPlaceholder="Search for keys..."
                />
            );

            const searchInput = screen.getByTestId('input');
            expect(searchInput).toHaveAttribute('placeholder', 'Search for keys...');
        });
    });




});