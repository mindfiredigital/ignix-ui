// advanced-search-form.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import {
    AdvancedSearchForm,
    SearchFilterRenderer,
    type FilterConfig,
    type SavedSearch,
} from './index';

// Mock all dependencies properly
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _initial, _animate, _exit, _transition, ...validProps } = props;
            return <div {...validProps}>{children}</div>;
        },
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@ignix-ui/typography', () => ({
    Typography: ({ children, variant, weight, color, className, as: Component = 'div', ...props }: any) => {
        const TypoComponent = Component;
        // When as="label", render a proper label element
        if (Component === 'label') {
            return (
                <label
                    data-testid="typography"
                    data-variant={variant}
                    data-weight={weight}
                    data-color={color}
                    className={className}
                    {...props}
                >
                    {children}
                </label>
            );
        }
        return (
            <TypoComponent
                data-testid="typography"
                data-variant={variant}
                data-weight={weight}
                data-color={color}
                className={className}
                {...props}
            >
                {children}
            </TypoComponent>
        );
    },
}));

vi.mock('@ignix-ui/date-picker', () => ({
    __esModule: true,
    default: ({ value, onChange, themeMode, size, _variant, ..._props }: any) => (
        <div data-testid="date-picker" data-theme={themeMode} data-size={size}>
            <button
                data-testid="date-picker-start"
                onClick={() => onChange?.({ start: new Date('2024-01-01'), end: new Date('2024-01-07') })}
            >
                Set Range
            </button>
            <button
                data-testid="date-picker-single"
                onClick={() => onChange?.(new Date('2024-01-01'))}
            >
                Set Single
            </button>
            <div data-testid="date-picker-value">{JSON.stringify(value)}</div>
        </div>
    ),
}));

vi.mock('@ignix-ui/checkbox', () => ({
    Checkbox: ({ label, checked, onChange, size, variant, ...props }: any) => (
        <label data-testid="checkbox" data-size={size} data-variant={variant}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
                {...props}
            />
            <span>{label}</span>
        </label>
    ),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock window.prompt for save search functionality
const mockPrompt = vi.fn();
window.prompt = mockPrompt;

// Mock resize observer
global.ResizeObserver = class ResizeObserver {
    observe(): void {
        return
    }
    unobserve(): void {
        return
    }
    disconnect(): void {
        return
    }
};

// Test filter configurations
const textFilter: FilterConfig = {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name',
};

const selectFilter: FilterConfig = {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
        { value: 'active', label: 'Active', count: 10 },
        { value: 'inactive', label: 'Inactive', count: 5 },
        { value: 'pending', label: 'Pending', count: 3 },
    ],
};

const multiSelectFilter: FilterConfig = {
    id: 'categories',
    label: 'Categories',
    type: 'multi-select',
    options: [
        { value: 'tech', label: 'Technology', count: 25 },
        { value: 'design', label: 'Design', count: 15 },
        { value: 'business', label: 'Business', count: 10 },
    ],
};

const dateRangeFilter: FilterConfig = {
    id: 'createdAt',
    label: 'Created Date',
    type: 'date-range',
    presets: ['today', 'yesterday', 'last7days', 'last30days', 'thisMonth'],
};

const checkboxFilter: FilterConfig = {
    id: 'features',
    label: 'Features',
    type: 'checkbox',
    options: [
        { value: 'premium', label: 'Premium', count: 50 },
        { value: 'featured', label: 'Featured', count: 30 },
        { value: 'verified', label: 'Verified', count: 20 },
    ],
};

const numericRangeFilter: FilterConfig = {
    id: 'price',
    label: 'Price',
    type: 'numeric-range',
    min: 0,
    max: 1000,
    step: 10,
};

const allFilters: FilterConfig[] = [
    textFilter,
    selectFilter,
    multiSelectFilter,
    dateRangeFilter,
    checkboxFilter,
    numericRangeFilter,
];

const mockSavedSearches: SavedSearch[] = [
    {
        id: '1',
        name: 'Active Users',
        filters: { status: 'active' },
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'High Value',
        filters: { price: { min: 500, max: 1000 } },
        createdAt: new Date('2024-01-02'),
    },
];


describe('AdvancedSearchForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockPrompt.mockReset();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Rendering', () => {
        it('renders with default props', () => {
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <AdvancedSearchForm.Filters />
                    <AdvancedSearchForm.Actions />
                </AdvancedSearchForm>
            );

            expect(screen.getByRole('search')).toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Categories')).toBeInTheDocument();
            expect(screen.getByText('Created Date')).toBeInTheDocument();
            expect(screen.getByText('Features')).toBeInTheDocument();
            expect(screen.getByText('Price')).toBeInTheDocument();
        });

        it('renders with dark variant', () => {
            render(
                <AdvancedSearchForm variant="dark" filters={allFilters}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const container = screen.getByRole('search');
            expect(container).toHaveClass('bg-gray-950');
        });

        it('renders with light variant', () => {
            render(
                <AdvancedSearchForm variant="light" filters={allFilters}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const container = screen.getByRole('search');
            expect(container).toHaveClass('bg-gray-50');
        });

        it('renders with inline layout', () => {
            render(
                <AdvancedSearchForm layout="inline" filters={allFilters}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const filtersContainer = document.querySelector('.flex.flex-wrap');
            expect(filtersContainer).toBeInTheDocument();
        });
    });

    describe('SearchTextFilter', () => {
        it('renders text input with label', () => {
            render(
                <AdvancedSearchForm filters={[textFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
        });


        it('does not debounce when autoApply is false', () => {
            const onSearch = vi.fn();
            render(
                <AdvancedSearchForm filters={[textFilter]} onSearch={onSearch} autoApply={false}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const input = screen.getByPlaceholderText('Enter name');
            fireEvent.change(input, { target: { value: 'John' } });

            expect(onSearch).not.toHaveBeenCalled();
        });
    });

    describe('SearchSelectFilter', () => {
        it('renders select dropdown with options', () => {
            render(
                <AdvancedSearchForm filters={[selectFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Status')).toBeInTheDocument();
            const select = screen.getByRole('combobox');
            expect(select).toBeInTheDocument();
            expect(screen.getByText('Active (10)')).toBeInTheDocument();
            expect(screen.getByText('Inactive (5)')).toBeInTheDocument();
            expect(screen.getByText('Pending (3)')).toBeInTheDocument();
        });

        it('updates value on selection', () => {
            render(
                <AdvancedSearchForm filters={[selectFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'active' } });

            expect(select).toHaveValue('active');
        });
    });

    describe('SearchMultiSelectFilter', () => {
        it('renders multi-select dropdown', () => {
            render(
                <AdvancedSearchForm filters={[multiSelectFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Categories')).toBeInTheDocument();
            expect(screen.getByText('Select options...')).toBeInTheDocument();
        });

        it('opens dropdown on click', () => {
            render(
                <AdvancedSearchForm filters={[multiSelectFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const dropdown = screen.getByText('Select options...');
            fireEvent.click(dropdown);

            expect(screen.getByText('Technology (25)')).toBeInTheDocument();
            expect(screen.getByText('Design (15)')).toBeInTheDocument();
            expect(screen.getByText('Business (10)')).toBeInTheDocument();
        });

    });

    describe('SearchDateRangeFilter', () => {
        it('renders date range filter with preset buttons', () => {
            render(
                <AdvancedSearchForm filters={[dateRangeFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Created Date')).toBeInTheDocument();
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('Yesterday')).toBeInTheDocument();
            expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
            expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
            expect(screen.getByText('This Month')).toBeInTheDocument();
        });

    });

    describe('SearchCheckboxFilter', () => {
        it('renders checkbox options', () => {
            render(
                <AdvancedSearchForm filters={[checkboxFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Features')).toBeInTheDocument();
            expect(screen.getByLabelText('Premium (50)')).toBeInTheDocument();
            expect(screen.getByLabelText('Featured (30)')).toBeInTheDocument();
            expect(screen.getByLabelText('Verified (20)')).toBeInTheDocument();
        });

    });

    describe('SearchNumericRangeFilter', () => {
        it('renders min and max inputs', () => {
            render(
                <AdvancedSearchForm filters={[numericRangeFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const minInput = screen.getByPlaceholderText('Min (0)');
            const maxInput = screen.getByPlaceholderText('Max (1000)');

            expect(minInput).toBeInTheDocument();
            expect(maxInput).toBeInTheDocument();
        });

        it('updates values on change', () => {
            render(
                <AdvancedSearchForm filters={[numericRangeFilter]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const minInput = screen.getByPlaceholderText('Min (0)');
            fireEvent.change(minInput, { target: { value: '100' } });

            expect(minInput).toHaveValue(100);
        });
    });

    describe('SearchFilterRenderer', () => {
        // Wrap filter renderer tests in AdvancedSearchForm provider
        it('renders text filter correctly', () => {
            render(
                <AdvancedSearchForm filters={[textFilter]}>
                    <SearchFilterRenderer
                        filter={textFilter}
                        value=""
                        onChange={(): void => {
                            return
                        }}
                    />
                </AdvancedSearchForm>
            );

            expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
        });

        it('renders select filter correctly', () => {
            render(
                <AdvancedSearchForm filters={[selectFilter]}>
                    <SearchFilterRenderer
                        filter={selectFilter}
                        value=""
                        onChange={(): void => {
                            return
                        }}
                    />
                </AdvancedSearchForm>
            );

            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        it('renders multi-select filter correctly', () => {
            render(
                <AdvancedSearchForm filters={[multiSelectFilter]}>
                    <SearchFilterRenderer
                        filter={multiSelectFilter}
                        value={[]}
                        onChange={(): void => {
                            return
                        }}
                    />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Select options...')).toBeInTheDocument();
        });

        it('renders date-range filter correctly', () => {
            render(
                <AdvancedSearchForm filters={[dateRangeFilter]}>
                    <SearchFilterRenderer
                        filter={dateRangeFilter}
                        value={{}}
                        onChange={(): void => {
                            return
                        }}
                    />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Created Date')).toBeInTheDocument();
        });

        it('renders checkbox filter correctly', () => {
            render(
                <AdvancedSearchForm filters={[checkboxFilter]}>
                    <SearchFilterRenderer
                        filter={checkboxFilter}
                        value={[]}
                        onChange={(): void => {
                            return
                        }}
                    />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Features')).toBeInTheDocument();
        });

        it('renders numeric-range filter correctly', () => {
            render(
                <AdvancedSearchForm filters={[numericRangeFilter]}>
                    <SearchFilterRenderer
                        filter={numericRangeFilter}
                        value={{}}
                        onChange={(): void => {
                            return
                        }}
                    />
                </AdvancedSearchForm>
            );

            expect(screen.getByPlaceholderText('Min (0)')).toBeInTheDocument();
        });
    });

    describe('SearchActions', () => {
        it('renders action buttons', () => {
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <AdvancedSearchForm.Actions />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Reset')).toBeInTheDocument();
            expect(screen.getByText('Save Search')).toBeInTheDocument();
            expect(screen.getByText('Export')).toBeInTheDocument();
        });

        it('does not show apply button when autoApply is true', () => {
            render(
                <AdvancedSearchForm filters={allFilters} autoApply={true}>
                    <AdvancedSearchForm.Actions />
                </AdvancedSearchForm>
            );

            expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();
        });

        it('shows apply button when autoApply is false', () => {
            render(
                <AdvancedSearchForm filters={allFilters} autoApply={false}>
                    <AdvancedSearchForm.Actions showApply={true} />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Apply Filters')).toBeInTheDocument();
        });

        it('calls onApply when apply button is clicked', () => {
            const onApply = vi.fn();
            render(
                <AdvancedSearchForm filters={allFilters} autoApply={false}>
                    <AdvancedSearchForm.Actions onApply={onApply} showApply={true} />
                </AdvancedSearchForm>
            );

            const applyButton = screen.getByText('Apply Filters');
            fireEvent.click(applyButton);

            expect(onApply).toHaveBeenCalled();
        });

        it('calls onReset when reset button is clicked', () => {
            const onReset = vi.fn();
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <AdvancedSearchForm.Actions onReset={onReset} showReset={true} />
                </AdvancedSearchForm>
            );

            const resetButton = screen.getByText('Reset');
            fireEvent.click(resetButton);

            expect(onReset).toHaveBeenCalled();
        });

        it('prompts for search name when save is clicked', () => {
            mockPrompt.mockReturnValue('My Saved Search');
            const onSaveSearch = vi.fn();

            render(
                <AdvancedSearchForm filters={allFilters} onSaveSearch={onSaveSearch}>
                    <AdvancedSearchForm.Actions showSave={true} />
                </AdvancedSearchForm>
            );

            const saveButton = screen.getByText('Save Search');
            fireEvent.click(saveButton);

            expect(mockPrompt).toHaveBeenCalledWith('Enter a name for this search:');
            expect(onSaveSearch).toHaveBeenCalled();
        });

        it('prompts for format when export is clicked', () => {
            mockPrompt.mockReturnValue('csv');
            const onExport = vi.fn();

            render(
                <AdvancedSearchForm filters={allFilters} onExport={onExport}>
                    <AdvancedSearchForm.Actions showExport={true} />
                </AdvancedSearchForm>
            );

            const exportButton = screen.getByText('Export');
            fireEvent.click(exportButton);

            expect(mockPrompt).toHaveBeenCalledWith('Export format (csv/excel/json):', 'csv');
            expect(onExport).toHaveBeenCalled();
        });
    });

    describe('SearchSavedSearches', () => {
        it('renders saved searches list', () => {
            render(
                <AdvancedSearchForm filters={allFilters} savedSearches={mockSavedSearches}>
                    <AdvancedSearchForm.SavedSearches />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Saved Searches')).toBeInTheDocument();
            expect(screen.getByText('Active Users')).toBeInTheDocument();
            expect(screen.getByText('High Value')).toBeInTheDocument();
        });

        it('applies saved search when clicked', () => {
            const onSearch = vi.fn();
            render(
                <AdvancedSearchForm filters={allFilters} savedSearches={mockSavedSearches} onSearch={onSearch}>
                    <AdvancedSearchForm.SavedSearches />
                </AdvancedSearchForm>
            );

            const savedSearch = screen.getByText('Active Users');
            fireEvent.click(savedSearch);

            expect(onSearch).toHaveBeenCalledWith({ status: 'active' });
        });

    });


    describe('SearchResultsCount', () => {
        it('renders results count', () => {
            render(
                <AdvancedSearchForm filters={allFilters} resultsCount={42} totalResults={100}>
                    <AdvancedSearchForm.ResultsCount />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Showing 42 results of 100')).toBeInTheDocument();
        });

        it('renders only count when total is not provided', () => {
            render(
                <AdvancedSearchForm filters={allFilters} resultsCount={42}>
                    <AdvancedSearchForm.ResultsCount />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Showing 42 results')).toBeInTheDocument();
        });

        it('does not render when count is undefined', () => {
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <AdvancedSearchForm.ResultsCount />
                </AdvancedSearchForm>
            );

            expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
        });
    });

    describe('Initial Filters', () => {
        it('initializes with provided initial filters', () => {
            const initialFilters = {
                name: 'John',
                status: 'active',
                price: { min: 100, max: 500 },
            };

            render(
                <AdvancedSearchForm filters={allFilters} initialFilters={initialFilters}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const nameInput = screen.getByPlaceholderText('Enter name');
            expect(nameInput).toHaveValue('John');

            const statusSelect = screen.getByRole('combobox');
            expect(statusSelect).toHaveValue('active');

            const minInput = screen.getByPlaceholderText('Min (0)');
            expect(minInput).toHaveValue(100);
        });
    });

    describe('Responsive Behavior', () => {
        it('collapses filters on mobile by default', () => {
            // Mock mobile viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 500,
            });
            window.dispatchEvent(new Event('resize'));

            render(
                <AdvancedSearchForm filters={allFilters} layout="collapsible" defaultCollapsedOnMobile={true}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            expect(screen.getByText('Filter Options')).toBeInTheDocument();
            // Filters should be collapsed initially
            expect(screen.queryByText('Name')).not.toBeInTheDocument();
        });

        it('expands filters when toggle is clicked on mobile', () => {
            // Mock mobile viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 500,
            });
            window.dispatchEvent(new Event('resize'));

            render(
                <AdvancedSearchForm filters={allFilters} layout="collapsible" defaultCollapsedOnMobile={true}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const toggleButton = screen.getByText('Filter Options');
            fireEvent.click(toggleButton);

            // After clicking, filters should be visible
            expect(screen.getByText('Name')).toBeInTheDocument();
        });
    });

    describe('Custom Children', () => {
        it('renders custom children instead of default layout', () => {
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <div data-testid="custom-content">Custom Search Interface</div>
                    <button data-testid="custom-button">Custom Action</button>
                </AdvancedSearchForm>
            );

            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
            expect(screen.getByTestId('custom-button')).toBeInTheDocument();
            expect(screen.queryByText('Name')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            render(
                <AdvancedSearchForm filters={allFilters} ariaLabel="Custom search label">
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            const searchElement = screen.getByRole('search');
            expect(searchElement).toHaveAttribute('aria-label', 'Custom search label');
        });

        it('has proper form labels', () => {
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            // Use getByText since the labels are rendered as divs with the text
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Categories')).toBeInTheDocument();
            expect(screen.getByText('Created Date')).toBeInTheDocument();
            expect(screen.getByText('Features')).toBeInTheDocument();
            expect(screen.getByText('Price')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('handles empty filters array', () => {
            render(
                <AdvancedSearchForm filters={[]}>
                    <AdvancedSearchForm.Filters />
                </AdvancedSearchForm>
            );

            // Should render without errors
            expect(screen.getByRole('search')).toBeInTheDocument();
        });

        it('handles undefined saved searches', () => {
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <AdvancedSearchForm.SavedSearches />
                </AdvancedSearchForm>
            );

            expect(screen.queryByText('Saved Searches')).not.toBeInTheDocument();
        });

        it('handles undefined faceted categories', () => {
            render(
                <AdvancedSearchForm filters={allFilters}>
                    <AdvancedSearchForm.FacetedHints />
                </AdvancedSearchForm>
            );

            expect(screen.queryByText('Refine by')).not.toBeInTheDocument();
        });
    });
});

describe('Component Exports', () => {
    it('exports all sub-components correctly', () => {
        expect(AdvancedSearchForm.Filters).toBeDefined();
        expect(AdvancedSearchForm.Actions).toBeDefined();
        expect(AdvancedSearchForm.SavedSearches).toBeDefined();
        expect(AdvancedSearchForm.FacetedHints).toBeDefined();
        expect(AdvancedSearchForm.ResultsCount).toBeDefined();
        expect(AdvancedSearchForm.TextFilter).toBeDefined();
        expect(AdvancedSearchForm.SelectFilter).toBeDefined();
        expect(AdvancedSearchForm.MultiSelectFilter).toBeDefined();
        expect(AdvancedSearchForm.DateRangeFilter).toBeDefined();
        expect(AdvancedSearchForm.CheckboxFilter).toBeDefined();
        expect(AdvancedSearchForm.NumericRangeFilter).toBeDefined();
        expect(AdvancedSearchForm.FilterRenderer).toBeDefined();
    });
});