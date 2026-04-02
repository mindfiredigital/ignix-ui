import type { Meta, StoryObj } from "@storybook/react";
import {
    AdvancedSearchForm,
    SearchFilters,
    SearchActions,
    SearchSavedSearches,
    SearchFacetedHints,
    SearchResultsCount,
    SearchTextFilter,
    SearchSelectFilter,
    SearchMultiSelectFilter,
    SearchDateRangeFilter,
    SearchCheckboxFilter,
    SearchNumericRangeFilter,
    SearchFilterRenderer,
    type TextFilterConfig,
    type SelectFilterConfig,
    type MultiSelectFilterConfig,
    type DateRangeFilterConfig,
    type CheckboxFilterConfig,
    type NumericRangeFilterConfig,
    type FilterValue,
    type DateRangeValue as ComponentDateRangeValue,
    type NumericRangeValue as ComponentNumericRangeValue,
    type SavedSearch as ComponentSavedSearch,
} from ".";
import React, { useState } from "react";
import { cn } from "../../../../../utils/cn";

// Type definitions
interface User {
    id: number;
    name: string;
    role: string;
    status: string;
    created: string;
    age: number;
    score: number;
}

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    inStock: boolean;
    rating: number;
}

interface FilterOption {
    value: string;
    label: string;
    count: number;
}

// Use the component's types instead of defining our own
type DateRangeValue = ComponentDateRangeValue;
type NumericRangeValue = ComponentNumericRangeValue;
type SavedSearch = ComponentSavedSearch;

const meta: Meta<typeof AdvancedSearchForm> = {
    title: "Templates/Section/Content/AdvancedSearchForm",
    component: AdvancedSearchForm,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A powerful advanced search form component with complex filtering capabilities. Supports multiple filter types, saved searches, faceted hints, and export functionality. Fully responsive across mobile, tablet, and desktop devices.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "dark", "light"],
            description: "Visual theme variant",
        },
        layout: {
            control: "select",
            options: ["inline", "stacked", "collapsible"],
            description: "Layout style for filters",
        },
        autoApply: {
            control: "boolean",
            description: "Apply filters automatically as they change",
        },
        debounceMs: {
            control: "number",
            description: "Debounce delay for auto-apply in milliseconds",
        },
        showExport: {
            control: "boolean",
            description: "Show export button",
        },
        showSaveSearch: {
            control: "boolean",
            description: "Show save search button",
        },
        showReset: {
            control: "boolean",
            description: "Show reset button",
        },
        showFaceted: {
            control: "boolean",
            description: "Show faceted search hints",
        },
        showResultsCount: {
            control: "boolean",
            description: "Show results count",
        },
        defaultCollapsedOnMobile: {
            control: "boolean",
            description: "Collapse filters panel on mobile by default",
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen p-4 sm:p-6 md:p-8">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AdvancedSearchForm>;

/* ============================================
   MOCK DATA & HANDLERS
============================================ */

const mockUsers: User[] = [
    { id: 1, name: "John Doe", role: "Admin", status: "Active", created: "2024-01-15", age: 32, score: 95 },
    { id: 2, name: "Jane Smith", role: "User", status: "Active", created: "2024-02-20", age: 28, score: 88 },
    { id: 3, name: "Bob Johnson", role: "Manager", status: "Inactive", created: "2023-12-10", age: 45, score: 76 },
    { id: 4, name: "Alice Brown", role: "Admin", status: "Active", created: "2024-01-05", age: 35, score: 92 },
    { id: 5, name: "Charlie Wilson", role: "User", status: "Pending", created: "2024-02-28", age: 24, score: 67 },
    { id: 6, name: "Diana Prince", role: "Manager", status: "Active", created: "2023-11-20", age: 38, score: 94 },
    { id: 7, name: "Eve Adams", role: "User", status: "Active", created: "2024-01-30", age: 29, score: 82 },
    { id: 8, name: "Frank Castle", role: "Admin", status: "Inactive", created: "2023-10-15", age: 42, score: 71 },
];

const mockProducts: Product[] = [
    { id: 1, name: "Laptop", category: "Electronics", price: 999, inStock: true, rating: 4.5 },
    { id: 2, name: "Mouse", category: "Electronics", price: 29, inStock: true, rating: 4.2 },
    { id: 3, name: "Keyboard", category: "Electronics", price: 79, inStock: false, rating: 4.0 },
    { id: 4, name: "Monitor", category: "Electronics", price: 299, inStock: true, rating: 4.7 },
    { id: 5, name: "Desk", category: "Furniture", price: 399, inStock: true, rating: 4.3 },
    { id: 6, name: "Chair", category: "Furniture", price: 199, inStock: false, rating: 3.8 },
];

const roleOptions: FilterOption[] = [
    { value: "admin", label: "Admin", count: 3 },
    { value: "manager", label: "Manager", count: 2 },
    { value: "user", label: "User", count: 3 },
];

const statusOptions: FilterOption[] = [
    { value: "active", label: "Active", count: 5 },
    { value: "inactive", label: "Inactive", count: 2 },
    { value: "pending", label: "Pending", count: 1 },
];

const categoryOptions: FilterOption[] = [
    { value: "electronics", label: "Electronics", count: 4 },
    { value: "furniture", label: "Furniture", count: 2 },
];

// Create saved searches that match the component's expected type
const savedSearchesData: SavedSearch[] = [
    {
        id: "1",
        name: "Active Admins",
        filters: {
            role: "admin" as FilterValue,
            status: ["active"] as FilterValue
        }
    },
    {
        id: "2",
        name: "Recent Users",
        filters: {
            dateRange: { preset: "last30days" as const } as FilterValue
        }
    },
    {
        id: "3",
        name: "High Performers",
        filters: {
            scoreRange: { min: 85 } as FilterValue
        }
    },
];

const facetedCategoriesData = [
    {
        id: "role",
        label: "Role",
        options: roleOptions,
    },
    {
        id: "status",
        label: "Status",
        options: statusOptions,
    },
];

// Type for active filters state
interface ActiveFilters {
    [key: string]: FilterValue;
}

/* ============================================
   1. BASIC USAGE - USING THE ROOT COMPONENT
============================================ */

export const BasicUsage: Story = {
    render: () => {
        const filtersConfig = [
            { id: "search", label: "Search", type: "text" as const, placeholder: "Enter search term..." },
            { id: "role", label: "Role", type: "select" as const, options: roleOptions },
            { id: "status", label: "Status", type: "multi-select" as const, options: statusOptions },
        ];

        return (
            <AdvancedSearchForm
                variant="light"
                layout="stacked"
                filters={filtersConfig}
                autoApply={true}
                resultsCount={42}
                totalResults={100}
            />
        );
    },
    name: "1.1 Basic Usage - Root Component",
};

export const WithManualApply: Story = {
    render: () => {
        const filtersConfig = [
            { id: "search", label: "Search", type: "text" as const, placeholder: "Enter search term..." },
            { id: "role", label: "Role", type: "select" as const, options: roleOptions },
            { id: "status", label: "Status", type: "multi-select" as const, options: statusOptions },
        ];

        return (
            <AdvancedSearchForm
                variant="light"
                layout="stacked"
                filters={filtersConfig}
                autoApply={false}
                resultsCount={42}
                totalResults={100}
            />
        );
    },
    name: "1.2 Basic Usage - Manual Apply",
};

/* ============================================
   2. COMPOUND COMPONENTS - CUSTOM LAYOUTS
============================================ */

export const CompoundComponentsBasic: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

        // Properly typed filter configurations
        const textFilter: TextFilterConfig = { id: "name", label: "Name", type: "text", placeholder: "Enter name..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const checkboxFilter: CheckboxFilterConfig = { id: "status", label: "Status", type: "checkbox", options: statusOptions };

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Custom Search Layout</h3>
                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SearchTextFilter
                                    filter={textFilter}
                                    value={activeFilters.name as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, name: val })}
                                />
                                <SearchSelectFilter
                                    filter={selectFilter}
                                    value={activeFilters.role as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                                />
                                <SearchCheckboxFilter
                                    filter={checkboxFilter}
                                    value={activeFilters.status as string[] || []}
                                    onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                                />
                            </div>
                        </SearchFilters>
                    </div>

                    <SearchActions
                        onApply={() => console.log("Applied filters:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                        showApply={true}
                        showReset={true}
                        showSave={false}
                        showExport={false}
                    />

                    <SearchResultsCount count={42} total={100} />
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "2.1 Compound Components - Basic",
};

export const CompoundComponentsWithSavedSearches: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
        const [savedSearchesState, setSavedSearchesState] = useState<SavedSearch[]>(savedSearchesData);

        const handleSaveSearch = (search: SavedSearch) => {
            setSavedSearchesState([...savedSearchesState, search]);
        };

        const handleDeleteSearch = (id: string) => {
            setSavedSearchesState(savedSearchesState.filter(s => s.id !== id));
        };

        // Properly typed filter configurations
        const textFilter: TextFilterConfig = { id: "search", label: "Search", type: "text", placeholder: "Search..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const multiSelectFilter: MultiSelectFilterConfig = { id: "status", label: "Status", type: "multi-select", options: statusOptions };

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Search with Saved Searches</h3>
                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SearchTextFilter
                                    filter={textFilter}
                                    value={activeFilters.search as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, search: val })}
                                />
                                <SearchSelectFilter
                                    filter={selectFilter}
                                    value={activeFilters.role as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                                />
                                <SearchMultiSelectFilter
                                    filter={multiSelectFilter}
                                    value={activeFilters.status as string[] || []}
                                    onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                                />
                            </div>
                        </SearchFilters>
                    </div>

                    <SearchActions
                        onApply={() => console.log("Applied filters:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                        onSave={() => {
                            // Create a properly typed filters object
                            const filters: Record<string, FilterValue> = {};
                            Object.keys(activeFilters).forEach(key => {
                                filters[key] = activeFilters[key] as FilterValue;
                            });

                            const newSearch: SavedSearch = {
                                id: Date.now().toString(),
                                name: `Search ${savedSearchesState.length + 1}`,
                                filters: filters,
                                createdAt: new Date(),
                            };
                            handleSaveSearch(newSearch);
                        }}
                        showApply={true}
                        showReset={true}
                        showSave={true}
                        showExport={false}
                    />

                    <SearchSavedSearches
                        searches={savedSearchesState}
                        onApply={(search: SavedSearch) => setActiveFilters(search.filters)}
                        onDelete={handleDeleteSearch}
                    />

                    <SearchResultsCount count={42} total={100} />
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "2.2 Compound Components - With Saved Searches",
};

export const CompoundComponentsWithFacetedHints: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

        const textFilter: TextFilterConfig = { id: "search", label: "Search", type: "text", placeholder: "Search..." };

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Search with Faceted Hints</h3>
                        <SearchFilters>
                            <SearchTextFilter
                                filter={textFilter}
                                value={activeFilters.search as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, search: val })}
                            />
                        </SearchFilters>
                    </div>

                    <SearchFacetedHints
                        categories={facetedCategoriesData}
                        onSelect={(categoryId: string, value: string) => {
                            setActiveFilters({ ...activeFilters, [categoryId]: [value] });
                        }}
                    />

                    <SearchActions
                        onApply={() => console.log("Applied filters:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                        showApply={true}
                        showReset={true}
                        showSave={false}
                        showExport={false}
                    />

                    <SearchResultsCount count={42} total={100} />
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "2.3 Compound Components - With Faceted Hints",
};

export const CompoundComponentsComplete: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
        const [savedSearchesState, setSavedSearchesState] = useState<SavedSearch[]>(savedSearchesData);

        // Properly typed filter configurations
        const textFilter: TextFilterConfig = { id: "search", label: "Search", type: "text", placeholder: "Search users..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const multiSelectFilter: MultiSelectFilterConfig = { id: "status", label: "Status", type: "multi-select", options: statusOptions };
        const dateRangeFilter: DateRangeFilterConfig = { id: "date", label: "Date Range", type: "date-range", presets: ["today", "yesterday", "last7days", "last30days"] };
        const numericRangeFilter: NumericRangeFilterConfig = { id: "age", label: "Age Range", type: "numeric-range", min: 18, max: 100 };

        const handleSaveSearch = (search: SavedSearch) => {
            setSavedSearchesState([...savedSearchesState, search]);
        };

        const handleDeleteSearch = (id: string) => {
            setSavedSearchesState(savedSearchesState.filter(s => s.id !== id));
        };

        const handleExport = (filters: Record<string, FilterValue>, format: string) => {
            console.log(`Exporting with format: ${format}`, filters);
            alert(`Exporting as ${format.toUpperCase()}... Check console for details.`);
        };

        return (
            <AdvancedSearchForm variant="light" layout="collapsible">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Complete Search Interface</h3>
                        <p className="text-gray-600 mb-6">A fully-featured search form using compound components</p>

                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <SearchTextFilter
                                    filter={textFilter}
                                    value={activeFilters.search as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, search: val })}
                                />
                                <SearchSelectFilter
                                    filter={selectFilter}
                                    value={activeFilters.role as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                                />
                                <SearchMultiSelectFilter
                                    filter={multiSelectFilter}
                                    value={activeFilters.status as string[] || []}
                                    onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                                />
                                <SearchDateRangeFilter
                                    filter={dateRangeFilter}
                                    value={activeFilters.date as DateRangeValue || {}}
                                    onChange={(val: DateRangeValue) => setActiveFilters({ ...activeFilters, date: val })}
                                />
                                <SearchNumericRangeFilter
                                    filter={numericRangeFilter}
                                    value={activeFilters.age as NumericRangeValue || {}}
                                    onChange={(val: NumericRangeValue) => setActiveFilters({ ...activeFilters, age: val })}
                                />
                            </div>
                        </SearchFilters>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <SearchActions
                            onApply={() => console.log("Applied filters:", activeFilters)}
                            onReset={() => setActiveFilters({})}
                            onSave={() => {
                                // Create a properly typed filters object
                                const filters: Record<string, FilterValue> = {};
                                Object.keys(activeFilters).forEach(key => {
                                    filters[key] = activeFilters[key] as FilterValue;
                                });

                                const newSearch: SavedSearch = {
                                    id: Date.now().toString(),
                                    name: `Search ${savedSearchesState.length + 1}`,
                                    filters: filters,
                                    createdAt: new Date(),
                                };
                                handleSaveSearch(newSearch);
                            }}
                            onExport={() => handleExport(activeFilters, "csv")}
                            showApply={true}
                            showReset={true}
                            showSave={true}
                            showExport={true}
                        />
                        <SearchResultsCount count={42} total={100} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SearchSavedSearches
                            searches={savedSearchesState}
                            onApply={(search: SavedSearch) => setActiveFilters(search.filters)}
                            onDelete={handleDeleteSearch}
                        />
                        <SearchFacetedHints
                            categories={facetedCategoriesData}
                            onSelect={(categoryId: string, value: string) => {
                                setActiveFilters({ ...activeFilters, [categoryId]: [value] });
                            }}
                        />
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Current Filters:</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(activeFilters, null, 2)}
                        </pre>
                    </div>
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "2.4 Compound Components - Complete Example",
};

/* ============================================
   3. FILTER TYPES SHOWCASE WITH COMPOUND COMPONENTS
============================================ */

export const FilterTypesShowcase: Story = {
    render: () => {
        const [values, setValues] = useState<ActiveFilters>({
            text: "",
            select: "",
            multiSelect: [],
            dateRange: {},
            checkbox: [],
            numericRange: {},
        });

        // Properly typed filter configurations
        const textFilter: TextFilterConfig = { id: "text", label: "Text Filter", type: "text", placeholder: "Type something..." };
        const selectFilter: SelectFilterConfig = { id: "select", label: "Select Filter", type: "select", options: roleOptions };
        const multiSelectFilter: MultiSelectFilterConfig = { id: "multi", label: "Multi-Select Filter", type: "multi-select", options: statusOptions };
        const dateRangeFilter: DateRangeFilterConfig = { id: "date", label: "Date Range Filter", type: "date-range", presets: ["today", "yesterday", "last7days"] };
        const checkboxFilter: CheckboxFilterConfig = { id: "checkbox", label: "Checkbox Filter", type: "checkbox", options: categoryOptions };
        const numericRangeFilter: NumericRangeFilterConfig = { id: "numeric", label: "Numeric Range Filter", type: "numeric-range", min: 0, max: 100 };

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">All Filter Types - Compound Components</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SearchTextFilter
                            filter={textFilter}
                            value={values.text as string || ""}
                            onChange={(val: string) => setValues({ ...values, text: val })}
                        />

                        <SearchSelectFilter
                            filter={selectFilter}
                            value={values.select as string || ""}
                            onChange={(val: string) => setValues({ ...values, select: val })}
                        />

                        <SearchMultiSelectFilter
                            filter={multiSelectFilter}
                            value={values.multiSelect as string[] || []}
                            onChange={(val: string[]) => setValues({ ...values, multiSelect: val })}
                        />

                        <SearchDateRangeFilter
                            filter={dateRangeFilter}
                            value={values.dateRange as DateRangeValue || {}}
                            onChange={(val: DateRangeValue) => setValues({ ...values, dateRange: val })}
                        />

                        <SearchCheckboxFilter
                            filter={checkboxFilter}
                            value={values.checkbox as string[] || []}
                            onChange={(val: string[]) => setValues({ ...values, checkbox: val })}
                        />

                        <SearchNumericRangeFilter
                            filter={numericRangeFilter}
                            value={values.numericRange as NumericRangeValue || {}}
                            onChange={(val: NumericRangeValue) => setValues({ ...values, numericRange: val })}
                        />
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Current Values:</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(values, null, 2)}
                        </pre>
                    </div>
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "3.1 Filter Types Showcase",
};

/* ============================================
   4. THEME VARIANTS WITH COMPOUND COMPONENTS
============================================ */

export const LightThemeCompound: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

        const textFilter: TextFilterConfig = { id: "search", label: "Search", type: "text", placeholder: "Search..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const checkboxFilter: CheckboxFilterConfig = { id: "status", label: "Status", type: "checkbox", options: statusOptions };

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Light Theme</h3>
                    <p className="text-gray-600">Clean, light interface with subtle shadows</p>

                    <SearchFilters>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SearchTextFilter
                                filter={textFilter}
                                value={activeFilters.search as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, search: val })}
                            />
                            <SearchSelectFilter
                                filter={selectFilter}
                                value={activeFilters.role as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                            />
                            <SearchCheckboxFilter
                                filter={checkboxFilter}
                                value={activeFilters.status as string[] || []}
                                onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                            />
                        </div>
                    </SearchFilters>

                    <SearchActions
                        onApply={() => console.log("Applied:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                    />

                    <SearchResultsCount count={42} total={100} />
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "4.1 Light Theme - Compound",
};

export const DarkThemeCompound: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

        const textFilter: TextFilterConfig = { id: "search", label: "Search", type: "text", placeholder: "Search..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const checkboxFilter: CheckboxFilterConfig = { id: "status", label: "Status", type: "checkbox", options: statusOptions };

        return (
            <div className="bg-gray-950 rounded-lg p-6">
                <AdvancedSearchForm variant="dark" layout="stacked">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Dark Theme</h3>
                        <p className="text-gray-400">Dark interface optimized for low-light environments</p>

                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SearchTextFilter
                                    filter={textFilter}
                                    value={activeFilters.search as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, search: val })}
                                />
                                <SearchSelectFilter
                                    filter={selectFilter}
                                    value={activeFilters.role as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                                />
                                <SearchCheckboxFilter
                                    filter={checkboxFilter}
                                    value={activeFilters.status as string[] || []}
                                    onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                                />
                            </div>
                        </SearchFilters>

                        <SearchActions
                            onApply={() => console.log("Applied:", activeFilters)}
                            onReset={() => setActiveFilters({})}
                        />

                        <SearchResultsCount count={42} total={100} />
                    </div>
                </AdvancedSearchForm>
            </div>
        );
    },
    name: "4.2 Dark Theme - Compound",
};

/* ============================================
   5. RESPONSIVE LAYOUTS WITH COMPOUND COMPONENTS
============================================ */

export const ResponsiveInlineCompound: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

        const textFilter: TextFilterConfig = { id: "search", label: "Search", type: "text", placeholder: "Search..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const statusSelectFilter: SelectFilterConfig = { id: "status", label: "Status", type: "select", options: statusOptions };

        return (
            <AdvancedSearchForm variant="light" layout="inline">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Inline Layout - Responsive</h3>
                    <p className="text-gray-600 text-sm">Filters arrange horizontally on desktop, wrap on tablet, stack on mobile</p>

                    <SearchFilters>
                        <div className="flex flex-wrap gap-4">
                            <SearchTextFilter
                                filter={textFilter}
                                value={activeFilters.search as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, search: val })}
                                className="flex-1 min-w-[200px]"
                            />
                            <SearchSelectFilter
                                filter={selectFilter}
                                value={activeFilters.role as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                                className="min-w-[150px]"
                            />
                            <SearchSelectFilter
                                filter={statusSelectFilter}
                                value={activeFilters.status as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, status: val })}
                                className="min-w-[150px]"
                            />
                        </div>
                    </SearchFilters>

                    <SearchActions
                        onApply={() => console.log("Applied:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                    />
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "5.1 Inline Layout - Responsive",
};

export const ResponsiveCollapsibleCompound: Story = {
    parameters: {
        viewport: {
            defaultViewport: "mobile1",
        },
    },
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

        const textFilter: TextFilterConfig = { id: "search", label: "Search", type: "text", placeholder: "Search..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const multiSelectFilter: MultiSelectFilterConfig = { id: "status", label: "Status", type: "multi-select", options: statusOptions };
        const dateRangeFilter: DateRangeFilterConfig = { id: "date", label: "Date Range", type: "date-range", presets: ["today", "yesterday", "last7days"] };

        return (
            <AdvancedSearchForm variant="light" layout="collapsible" defaultCollapsedOnMobile={true}>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Collapsible Layout - Mobile Optimized</h3>
                    <p className="text-gray-600 text-sm">Filters collapse into an expandable panel on mobile to save space</p>

                    <SearchFilters>
                        <div className="space-y-4">
                            <SearchTextFilter
                                filter={textFilter}
                                value={activeFilters.search as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, search: val })}
                            />
                            <SearchSelectFilter
                                filter={selectFilter}
                                value={activeFilters.role as string || ""}
                                onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                            />
                            <SearchMultiSelectFilter
                                filter={multiSelectFilter}
                                value={activeFilters.status as string[] || []}
                                onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                            />
                            <SearchDateRangeFilter
                                filter={dateRangeFilter}
                                value={activeFilters.date as DateRangeValue || {}}
                                onChange={(val: DateRangeValue) => setActiveFilters({ ...activeFilters, date: val })}
                            />
                        </div>
                    </SearchFilters>

                    <SearchActions
                        onApply={() => console.log("Applied:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                    />
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "5.2 Collapsible Layout - Mobile Optimized",
};

/* ============================================
   6. USE CASE EXAMPLES WITH COMPOUND COMPONENTS
============================================ */

export const UserManagementCompound: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
        const [filteredResults, setFilteredResults] = useState<User[]>(mockUsers);

        const textFilter: TextFilterConfig = { id: "name", label: "User Name", type: "text", placeholder: "Search by name..." };
        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const multiSelectFilter: MultiSelectFilterConfig = { id: "status", label: "Status", type: "multi-select", options: statusOptions };
        const numericRangeFilter: NumericRangeFilterConfig = { id: "age", label: "Age Range", type: "numeric-range", min: 18, max: 100 };

        // Fix for UserManagementCompound
        const handleSearch = () => {
            let results = [...mockUsers];
            const nameFilter = activeFilters.name as string;
            const roleFilter = activeFilters.role as string;
            const statusFilter = activeFilters.status as string[];
            const ageFilter = activeFilters.age as NumericRangeValue;

            if (nameFilter) {
                results = results.filter(u => u.name.toLowerCase().includes(nameFilter.toLowerCase()));
            }
            if (roleFilter && roleFilter !== "") {
                results = results.filter(u => u.role.toLowerCase() === roleFilter);
            }
            if (statusFilter && statusFilter.length > 0) {
                results = results.filter(u => statusFilter.includes(u.status.toLowerCase()));
            }

            // Fix: Store values in variables before using them in filter
            const minAge = ageFilter?.min;
            const maxAge = ageFilter?.max;

            if (minAge !== undefined) {
                results = results.filter(u => u.age >= minAge);
            }
            if (maxAge !== undefined) {
                results = results.filter(u => u.age <= maxAge);
            }

            setFilteredResults(results);
        };

        return (
            <AdvancedSearchForm variant="light" layout="collapsible">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">User Management System</h3>
                        <p className="text-gray-600 mb-6">Find and manage users with advanced filtering</p>

                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <SearchTextFilter
                                    filter={textFilter}
                                    value={activeFilters.name as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, name: val })}
                                />
                                <SearchSelectFilter
                                    filter={selectFilter}
                                    value={activeFilters.role as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                                />
                                <SearchMultiSelectFilter
                                    filter={multiSelectFilter}
                                    value={activeFilters.status as string[] || []}
                                    onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                                />
                                <SearchNumericRangeFilter
                                    filter={numericRangeFilter}
                                    value={activeFilters.age as NumericRangeValue || {}}
                                    onChange={(val: NumericRangeValue) => setActiveFilters({ ...activeFilters, age: val })}
                                />
                            </div>
                        </SearchFilters>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <SearchActions
                            onApply={handleSearch}
                            onReset={() => {
                                setActiveFilters({});
                                setFilteredResults(mockUsers);
                            }}
                        />
                        <SearchResultsCount count={filteredResults.length} total={mockUsers.length} />
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold mb-3">Results ({filteredResults.length})</h4>
                        <div className="space-y-2">
                            {filteredResults.map(user => (
                                <div key={user.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex flex-wrap justify-between items-start gap-2">
                                        <div>
                                            <p className="font-semibold text-lg">{user.name}</p>
                                            <p className="text-sm text-gray-600">Role: {user.role} | Status: {user.status}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Age: {user.age}</p>
                                            <p className="text-sm text-gray-600">Created: {user.created}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "6.1 User Management - Compound Components",
};

export const ProductCatalogCompound: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
        const [filteredResults, setFilteredResults] = useState<Product[]>(mockProducts);

        const textFilter: TextFilterConfig = { id: "name", label: "Product Name", type: "text", placeholder: "Search products..." };
        const selectFilter: SelectFilterConfig = { id: "category", label: "Category", type: "select", options: categoryOptions };
        const checkboxFilter: CheckboxFilterConfig = { id: "inStock", label: "Availability", type: "checkbox", options: [{ value: "true", label: "In Stock Only", count: 3 }] };
        const numericRangeFilter: NumericRangeFilterConfig = { id: "price", label: "Price Range", type: "numeric-range", min: 0, max: 1000, step: 10 };

        // Fix for ProductCatalogCompound
        const handleSearch = () => {
            let results = [...mockProducts];
            const nameFilter = activeFilters.name as string;
            const categoryFilter = activeFilters.category as string;
            const inStockFilter = activeFilters.inStock as string[];
            const priceFilter = activeFilters.price as NumericRangeValue;

            if (nameFilter) {
                results = results.filter(p => p.name.toLowerCase().includes(nameFilter.toLowerCase()));
            }
            if (categoryFilter && categoryFilter !== "") {
                results = results.filter(p => p.category.toLowerCase() === categoryFilter);
            }
            if (inStockFilter?.includes("true")) {
                results = results.filter(p => p.inStock);
            }

            // Fix: Store values in variables before using them in filter
            const minPrice = priceFilter?.min;
            const maxPrice = priceFilter?.max;

            if (minPrice !== undefined) {
                results = results.filter(p => p.price >= minPrice);
            }
            if (maxPrice !== undefined) {
                results = results.filter(p => p.price <= maxPrice);
            }

            setFilteredResults(results);
        };
        return (
            <AdvancedSearchForm variant="light" layout="collapsible">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Product Catalog</h3>
                        <p className="text-gray-600 mb-6">Browse and filter our product collection</p>

                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <SearchTextFilter
                                    filter={textFilter}
                                    value={activeFilters.name as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, name: val })}
                                />
                                <SearchSelectFilter
                                    filter={selectFilter}
                                    value={activeFilters.category as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, category: val })}
                                />
                                <SearchCheckboxFilter
                                    filter={checkboxFilter}
                                    value={activeFilters.inStock as string[] || []}
                                    onChange={(val: string[]) => setActiveFilters({ ...activeFilters, inStock: val })}
                                />
                                <SearchNumericRangeFilter
                                    filter={numericRangeFilter}
                                    value={activeFilters.price as NumericRangeValue || {}}
                                    onChange={(val: NumericRangeValue) => setActiveFilters({ ...activeFilters, price: val })}
                                />
                            </div>
                        </SearchFilters>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <SearchActions
                            onApply={handleSearch}
                            onReset={() => {
                                setActiveFilters({});
                                setFilteredResults(mockProducts);
                            }}
                            showExport={true}
                            onExport={() => {
                                console.log("Exporting filtered products:", filteredResults);
                                alert("Exporting products... Check console for data.");
                            }}
                        />
                        <SearchResultsCount count={filteredResults.length} total={mockProducts.length} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {filteredResults.map(product => (
                            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <h4 className="font-semibold text-lg">{product.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">Category: {product.category}</p>
                                <p className="text-2xl font-bold text-blue-600 mt-2">${product.price}</p>
                                <p className={cn(
                                    "text-sm mt-1",
                                    product.inStock ? "text-green-600" : "text-red-600"
                                )}>
                                    {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                                </p>
                                <p className="text-sm text-yellow-600 mt-1">★ {product.rating} / 5</p>
                            </div>
                        ))}
                    </div>
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "6.2 Product Catalog - Compound Components",
};

/* ============================================
   7. CUSTOM FILTER RENDERER EXAMPLES
============================================ */

export const CustomFilterRenderer: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

        // Properly typed filter configurations for the renderer
        const customFilters: (TextFilterConfig | SelectFilterConfig | MultiSelectFilterConfig | DateRangeFilterConfig)[] = [
            { id: "search", label: "Search Term", type: "text", placeholder: "Enter keywords..." },
            { id: "role", label: "User Role", type: "select", options: roleOptions },
            { id: "status", label: "Account Status", type: "multi-select", options: statusOptions },
            { id: "dateRange", label: "Registration Period", type: "date-range", presets: ["today", "yesterday", "last7days", "last30days"] },
        ];

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Using FilterRenderer Component</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            The FilterRenderer automatically renders the correct filter type based on the configuration
                        </p>

                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {customFilters.map((filter) => {
                                    const filterValue = activeFilters[filter.id];
                                    return (
                                        <SearchFilterRenderer
                                            key={filter.id}
                                            filter={filter}
                                            value={filterValue}
                                            onChange={(val) => setActiveFilters({ ...activeFilters, [filter.id]: val })}
                                        />
                                    );
                                })}
                            </div>
                        </SearchFilters>
                    </div>

                    <SearchActions
                        onApply={() => console.log("Applied filters:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                    />

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Applied Filters:</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(activeFilters, null, 2)}
                        </pre>
                    </div>
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "7.1 Custom Filter Renderer",
};

/* ============================================
   8. ADVANCED INTERACTIONS
============================================ */

export const RealTimeSearchWithDebounce: Story = {
    render: () => {
        const [searchTerm, setSearchTerm] = useState("");
        const [results, setResults] = useState<User[]>(mockUsers);
        const [isTyping, setIsTyping] = useState(false);

        const textFilter: TextFilterConfig = { id: "search", label: "Search Users", type: "text", placeholder: "Start typing to search..." };

        const handleSearch = (value: string) => {
            setIsTyping(false);
            const filtered = mockUsers.filter(user =>
                user.name.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filtered);
        };

        const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

        React.useEffect(() => {
            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }, []);
        const handleChange = (val: string) => {
            setSearchTerm(val);
            setIsTyping(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                handleSearch(val);
            }, 300);
        };

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Real-time Search with Debounce</h3>
                        <p className="text-gray-600 mb-4 text-sm">Search as you type with 300ms debounce delay</p>

                        <SearchFilters>
                            <SearchTextFilter
                                filter={textFilter}
                                value={searchTerm}
                                onChange={handleChange}
                            />
                        </SearchFilters>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchResultsCount count={results.length} total={mockUsers.length} />
                        {isTyping && (
                            <span className="text-xs text-gray-500 animate-pulse">Searching...</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        {results.map(user => (
                            <div key={user.id} className="p-3 border rounded-lg">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.role} • {user.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "8.1 Real-time Search with Debounce",
};
export const FilterChipsActiveFilters: Story = {
    render: () => {
        const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
            role: "admin",
            status: ["active"],
        });

        const selectFilter: SelectFilterConfig = { id: "role", label: "Role", type: "select", options: roleOptions };
        const multiSelectFilter: MultiSelectFilterConfig = { id: "status", label: "Status", type: "multi-select", options: statusOptions };

        const removeFilter = (key: string, value?: string) => {
            if (value) {
                const current = activeFilters[key] as string[];
                const updated = current.filter(v => v !== value);
                if (updated.length === 0) {
                    // Create a new object without the key
                    const newFilters = { ...activeFilters };
                    delete newFilters[key];
                    setActiveFilters(newFilters);
                } else {
                    setActiveFilters({ ...activeFilters, [key]: updated });
                }
            } else {
                // Create a new object without the key
                const newFilters = { ...activeFilters };
                delete newFilters[key];
                setActiveFilters(newFilters);
            }
        };

        const getFilterLabel = (key: string, value?: string): string => {
            if (key === "role") {
                const option = roleOptions.find(o => o.value === value);
                return option ? option.label : value || "";
            }
            if (key === "status" && value) {
                const option = statusOptions.find(o => o.value === value);
                return option ? option.label : value;
            }
            return key;
        };

        return (
            <AdvancedSearchForm variant="light" layout="stacked">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Active Filter Chips</h3>
                        <p className="text-gray-600 mb-4 text-sm">Clear individual filters with one click</p>

                        <SearchFilters>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SearchSelectFilter
                                    filter={selectFilter}
                                    value={activeFilters.role as string || ""}
                                    onChange={(val: string) => setActiveFilters({ ...activeFilters, role: val })}
                                />
                                <SearchMultiSelectFilter
                                    filter={multiSelectFilter}
                                    value={activeFilters.status as string[] || []}
                                    onChange={(val: string[]) => setActiveFilters({ ...activeFilters, status: val })}
                                />
                            </div>
                        </SearchFilters>
                    </div>

                    {Object.keys(activeFilters).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(activeFilters).map(([key, value]) => {
                                if (Array.isArray(value)) {
                                    return value.map(v => (
                                        <span
                                            key={`${key}-${v}`}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {getFilterLabel(key, v)}
                                            <button
                                                onClick={() => removeFilter(key, v)}
                                                className="hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-full"
                                                aria-label={`Remove ${getFilterLabel(key, v)} filter`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ));
                                } else if (value) {
                                    return (
                                        <span
                                            key={key}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                        >
                                            {getFilterLabel(key, value as string)}
                                            <button
                                                onClick={() => removeFilter(key)}
                                                className="hover:text-green-600 focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    );
                                }
                                return null;
                            })}
                            <button
                                onClick={() => setActiveFilters({})}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    <SearchActions
                        onApply={() => console.log("Applied filters:", activeFilters)}
                        onReset={() => setActiveFilters({})}
                    />
                </div>
            </AdvancedSearchForm>
        );
    },
    name: "8.2 Filter Chips - Active Filters Display",
};