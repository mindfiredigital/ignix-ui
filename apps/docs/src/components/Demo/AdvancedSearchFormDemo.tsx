import React, { useState, useEffect, useCallback } from 'react';
import type { JSX } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';
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
    SearchNumericRangeFilter,
} from '../UI/advanced-search-form';


// Define types at the top of the file
interface SavedSearchFilters {
    role?: string;
    status?: string[];
    department?: string;
    location?: string;
    dateRange?: { start?: string; end?: string; preset?: string };
    ageRange?: { min?: number; max?: number };
    scoreRange?: { min?: number; max?: number };
    salaryRange?: { min?: number; max?: number };
    name?: string;
    [key: string]: any; // Allow any other properties
}

interface SavedSearchType {
    id: string;
    name: string;
    filters: SavedSearchFilters;
    createdAt?: Date;
}



/* ============================================
   OPTIONS
============================================ */

const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
];

/* ============================================
   MOCK DATA (FIXED WITH BETTER OVERLAPS)
============================================ */

const roleOptions = [
    { value: "admin", label: "Admin", count: 5 },
    { value: "manager", label: "Manager", count: 4 },
    { value: "user", label: "User", count: 5 },
    { value: "developer", label: "Developer", count: 4 },
    { value: "designer", label: "Designer", count: 2 },
];

const statusOptions = [
    { value: "active", label: "Active", count: 12 },
    { value: "inactive", label: "Inactive", count: 4 },
    { value: "pending", label: "Pending", count: 3 },
    { value: "suspended", label: "Suspended", count: 1 },
];

const departmentOptions = [
    { value: "engineering", label: "Engineering", count: 7 },
    { value: "sales", label: "Sales", count: 5 },
    { value: "marketing", label: "Marketing", count: 4 },
    { value: "hr", label: "Human Resources", count: 3 },
    { value: "finance", label: "Finance", count: 4 },
];

const locationOptions = [
    { value: "new york", label: "New York", count: 6 },
    { value: "los angeles", label: "Los Angeles", count: 3 },
    { value: "chicago", label: "Chicago", count: 4 },
    { value: "san francisco", label: "San Francisco", count: 4 },
    { value: "seattle", label: "Seattle", count: 3 },
    { value: "boston", label: "Boston", count: 3 },
    { value: "austin", label: "Austin", count: 2 },
];

const facetedCategories = [
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
    {
        id: "department",
        label: "Department",
        options: departmentOptions,
    },
];

const savedSearches: SavedSearchType[] = [
    { id: "1", name: "Active Admins", filters: { role: "admin", status: ["active"] } },
    { id: "2", name: "Sales Team", filters: { department: "sales", status: ["active"] } },
    { id: "3", name: "High Performers", filters: { scoreRange: { min: 85 } } },
    { id: "4", name: "Engineering Team", filters: { department: "engineering", status: ["active"] } },
    { id: "5", name: "Young Talent", filters: { ageRange: { max: 30 } } },
];

// Fixed mock users with better overlapping combinations
const mockUsers = [
    // Admins in different departments
    { id: 1, name: "John Doe", role: "admin", status: "active", department: "engineering", created: "2024-01-15", age: 32, score: 95, salary: 95000, location: "New York" },
    { id: 2, name: "Alice Brown", role: "admin", status: "active", department: "sales", created: "2024-01-05", age: 35, score: 92, salary: 82000, location: "New York" },
    { id: 3, name: "Mona Lisa", role: "admin", status: "active", department: "finance", created: "2024-02-01", age: 39, score: 91, salary: 95000, location: "Boston" },
    { id: 4, name: "Sarah Johnson", role: "admin", status: "inactive", department: "marketing", created: "2023-11-15", age: 42, score: 78, salary: 88000, location: "Chicago" },
    { id: 5, name: "Michael Brown", role: "admin", status: "active", department: "hr", created: "2024-01-20", age: 38, score: 88, salary: 85000, location: "Los Angeles" },

    // Managers
    { id: 6, name: "Bob Johnson", role: "manager", status: "active", department: "marketing", created: "2023-12-10", age: 45, score: 76, salary: 85000, location: "Chicago" },
    { id: 7, name: "Diana Prince", role: "manager", status: "active", department: "engineering", created: "2023-11-20", age: 38, score: 94, salary: 105000, location: "New York" },
    { id: 8, name: "Jack Wilson", role: "manager", status: "active", department: "sales", created: "2024-01-25", age: 41, score: 88, salary: 110000, location: "New York" },
    { id: 9, name: "Nick Fury", role: "manager", status: "inactive", department: "finance", created: "2023-11-10", age: 44, score: 87, salary: 98000, location: "New York" },

    // Users
    { id: 10, name: "Jane Smith", role: "user", status: "active", department: "sales", created: "2024-02-20", age: 28, score: 88, salary: 75000, location: "Los Angeles" },
    { id: 11, name: "Charlie Wilson", role: "user", status: "pending", department: "engineering", created: "2024-02-28", age: 24, score: 67, salary: 70000, location: "San Francisco" },
    { id: 12, name: "Henry Davis", role: "user", status: "suspended", department: "sales", created: "2023-09-05", age: 34, score: 45, salary: 65000, location: "Chicago" },
    { id: 13, name: "Karen Martinez", role: "user", status: "pending", department: "hr", created: "2024-03-05", age: 31, score: 78, salary: 68000, location: "Los Angeles" },
    { id: 14, name: "Paul Walker", role: "user", status: "active", department: "marketing", created: "2023-08-20", age: 36, score: 62, salary: 62000, location: "Chicago" },

    // Developers
    { id: 15, name: "Eve Adams", role: "developer", status: "active", department: "engineering", created: "2024-03-01", age: 26, score: 89, salary: 90000, location: "Seattle" },
    { id: 16, name: "Grace Lee", role: "developer", status: "active", department: "engineering", created: "2024-01-20", age: 29, score: 93, salary: 98000, location: "San Francisco" },
    { id: 17, name: "Ivy Chen", role: "developer", status: "active", department: "engineering", created: "2024-02-10", age: 27, score: 96, salary: 102000, location: "Seattle" },
    { id: 18, name: "Olivia Parker", role: "developer", status: "active", department: "engineering", created: "2024-01-08", age: 25, score: 94, salary: 92000, location: "San Francisco" },

    // Designers
    { id: 19, name: "Frank Castle", role: "designer", status: "active", department: "marketing", created: "2023-10-15", age: 42, score: 71, salary: 72000, location: "Boston" },
    { id: 20, name: "Leo Thompson", role: "designer", status: "active", department: "marketing", created: "2023-12-15", age: 33, score: 85, salary: 77000, location: "Austin" },
];

/* ============================================
   EXPORT UTILITIES
============================================ */

// Convert data to CSV
const convertToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            if (value === undefined || value === null) return '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Convert data to JSON
const convertToJSON = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const escapeHTML = (value: any) => {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const convertToExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = Object.keys(data[0]);

    let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Export</title>
        </head>
        <body>
            <table border="1">
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${escapeHTML(h)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach(row => {
        html += '<tr>';
        headers.forEach(header => {
            let value = row[header];

            // Handle objects/arrays
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }

            html += `<td>${escapeHTML(value)}</td>`;
        });
        html += '</tr>';
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xls`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/* ============================================
   MAIN DEMO COMPONENT
============================================ */

export const AdvancedSearchFormDemo = (): JSX.Element => {
    const { colorMode } = useColorMode();
    const [theme, setTheme] = useState<'light' | 'dark'>(
        colorMode === 'dark' ? 'dark' : 'light'
    );
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [filteredResults, setFilteredResults] = useState(mockUsers);
    const [savedSearchesState, setSavedSearchesState] = useState<SavedSearchType[]>(savedSearches);
    const [isSearching, setIsSearching] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Handle search with filters
    const applyFilters = useCallback(() => {
        setIsSearching(true);

        let results = [...mockUsers];

        // Name filter
        if (activeFilters.name && activeFilters.name.trim()) {
            const searchTerm = activeFilters.name.toLowerCase().trim();
            results = results.filter(user =>
                user.name.toLowerCase().includes(searchTerm)
            );
        }

        // Role filter
        if (activeFilters.role && activeFilters.role !== "") {
            const roleValue = String(activeFilters.role).toLowerCase();
            results = results.filter(user =>
                user.role.toLowerCase() === roleValue
            );
        }

        // Department filter
        if (activeFilters.department && activeFilters.department !== "") {
            const deptValue = String(activeFilters.department).toLowerCase();
            results = results.filter(user =>
                user.department.toLowerCase() === deptValue
            );
        }

        // Location filter
        if (activeFilters.location && activeFilters.location !== "") {
            const locationValue = String(activeFilters.location).toLowerCase();
            results = results.filter(user =>
                user.location.toLowerCase() === locationValue
            );
        }

        // Status filter
        if (activeFilters.status && Array.isArray(activeFilters.status) && activeFilters.status.length > 0) {
            const statusValues = activeFilters.status.map(s => String(s).toLowerCase());
            results = results.filter(user =>
                statusValues.includes(user.status.toLowerCase())
            );
        }

        // Age range filter
        if (activeFilters.ageRange) {
            const min = activeFilters.ageRange.min;
            const max = activeFilters.ageRange.max;

            if (min !== undefined && min !== null && min !== "") {
                const minVal = Number(min);
                if (!isNaN(minVal)) {
                    results = results.filter(user => user.age >= minVal);
                }
            }
            if (max !== undefined && max !== null && max !== "") {
                const maxVal = Number(max);
                if (!isNaN(maxVal)) {
                    results = results.filter(user => user.age <= maxVal);
                }
            }
        }

        // Score range filter
        if (activeFilters.scoreRange) {
            const min = activeFilters.scoreRange.min;
            const max = activeFilters.scoreRange.max;

            if (min !== undefined && min !== null && min !== "") {
                const minVal = Number(min);
                if (!isNaN(minVal)) {
                    results = results.filter(user => user.score >= minVal);
                }
            }
            if (max !== undefined && max !== null && max !== "") {
                const maxVal = Number(max);
                if (!isNaN(maxVal)) {
                    results = results.filter(user => user.score <= maxVal);
                }
            }
        }

        // Salary range filter
        if (activeFilters.salaryRange) {
            const min = activeFilters.salaryRange.min;
            const max = activeFilters.salaryRange.max;

            if (min !== undefined && min !== null && min !== "") {
                const minVal = Number(min);
                if (!isNaN(minVal)) {
                    results = results.filter(user => user.salary >= minVal);
                }
            }
            if (max !== undefined && max !== null && max !== "") {
                const maxVal = Number(max);
                if (!isNaN(maxVal)) {
                    results = results.filter(user => user.salary <= maxVal);
                }
            }
        }

        // Date range filter
        if (activeFilters.dateRange) {
            if (activeFilters.dateRange.start) {
                results = results.filter(user => user.created >= activeFilters.dateRange.start);
            }
            if (activeFilters.dateRange.end) {
                results = results.filter(user => user.created <= activeFilters.dateRange.end);
            }
        }

        setFilteredResults(results);
        setIsSearching(false);
    }, [activeFilters]);

    // Auto-search when filters change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);

        return (): void => clearTimeout(timer);
    }, [activeFilters, applyFilters]);

    // Handle filter changes
    const handleFilterChange = (filterId: string, value: any): void => {
        setActiveFilters(prev => ({
            ...prev,
            [filterId]: value
        }));
    };

    // Handle save search
    const handleSaveSearch = (search: { name?: string }): void => {
        const newSearch: SavedSearchType = {
            id: Date.now().toString(),
            name: search.name || `Search ${savedSearchesState.length + 1}`,
            filters: { ...activeFilters }, // Create a copy to avoid reference issues
            createdAt: new Date(),
        };
        setSavedSearchesState([...savedSearchesState, newSearch]);
        alert(`Search "${newSearch.name}" saved successfully!`);
    };


    // Handle delete search
    const handleDeleteSearch = (id: string): void => {
        setSavedSearchesState(savedSearchesState.filter(s => s.id !== id));
    };

    // Handle export with format
    const handleExport = (format: string): void => {
        if (filteredResults.length === 0) {
            alert('No data to export. Please apply some filters to get results.');
            return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `users_export_${timestamp}`;

        switch (format) {
            case 'csv':
                convertToCSV(filteredResults, filename);
                break;
            case 'json':
                convertToJSON(filteredResults, filename);
                break;
            case 'excel':
                convertToExcel(filteredResults, filename);
                break;
            default:
                console.log('Unknown format:', format);
        }

        setShowExportMenu(false);
    };

    // Handle reset
    const handleReset = (): void => {
        setActiveFilters({});
        setFilteredResults(mockUsers);
    };

    // Handle manual apply
    const handleApply = (): void => {
        applyFilters();
    };

    const generateCode = (): string => {
        return `import { 
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
    SearchNumericRangeFilter
} from '@ignix-ui/advanced-search-form';

function AdvancedSearchDemo() {
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredResults, setFilteredResults] = useState(mockUsers);

  const handleSearch = () => {
    let results = [...mockUsers];
    
    if (activeFilters.name) {
      results = results.filter(u => 
        u.name.toLowerCase().includes(activeFilters.name.toLowerCase())
      );
    }
    if (activeFilters.role) {
      results = results.filter(u => 
        u.role.toLowerCase() === activeFilters.role.toLowerCase()
      );
    }
    if (activeFilters.department) {
      results = results.filter(u => 
        u.department.toLowerCase() === activeFilters.department.toLowerCase()
      );
    }
    if (activeFilters.status && Array.isArray(activeFilters.status)) {
      results = results.filter(u => 
        activeFilters.status.includes(u.status.toLowerCase())
      );
    }
    
    setFilteredResults(results);
  };

  return (
    <AdvancedSearchForm variant="${theme}" layout="stacked">
      <div className="space-y-6">
        <SearchFilters>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SearchSelectFilter
              filter={{ id: "role", label: "Role", type: "select", options: roleOptions }}
              value={activeFilters.role || ""}
              onChange={(val) => setActiveFilters({ ...activeFilters, role: val })}
            />
            <SearchSelectFilter
              filter={{ id: "department", label: "Department", type: "select", options: departmentOptions }}
              value={activeFilters.department || ""}
              onChange={(val) => setActiveFilters({ ...activeFilters, department: val })}
            />
            <SearchMultiSelectFilter
              filter={{ id: "status", label: "Status", type: "multi-select", options: statusOptions }}
              value={activeFilters.status || []}
              onChange={(val) => setActiveFilters({ ...activeFilters, status: val })}
            />
          </div>
        </SearchFilters>

        <SearchActions
          onApply={handleSearch}
          onReset={() => setActiveFilters({})}
          showApply={true}
          showReset={true}
        />
        
        <SearchResultsCount count={filteredResults.length} total={mockUsers.length} />
        
        <div className="space-y-2">
          {filteredResults.map(user => (
            <div key={user.id} className="p-4 border rounded-lg">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">
                {user.role} • {user.department} • {user.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdvancedSearchForm>
  );
}`;
    };

    // Scrollbar styles based on theme
    const scrollbarStyles = theme === 'light'
        ? {
            // Light theme scrollbar - lighter/gray
            scrollbarWidth: 'thin' as const,
            scrollbarColor: '#cbd5e1 #f1f5f9',
            '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f5f9',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#cbd5e1',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#94a3b8',
            },
        }
        : {
            // Dark theme scrollbar - darker
            scrollbarWidth: 'thin' as const,
            scrollbarColor: '#475569 #1e293b',
            '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#1e293b',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#475569',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#64748b',
            },
        };

    // Styles object for consistent styling
    const styles = {
        container: {
            padding: '24px',
            maxWidth: '1400px',
            margin: '0 auto',
            backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            minHeight: '100vh',
        },
        scoreBadge: {
            backgroundColor: theme === 'dark' ? '#1e3a8a' : '#dbeafe',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center' as const,
            minWidth: '80px'
        },
        scoreLabel: {
            fontSize: '12px',
            color: theme === 'dark' ? '#9ca3af' : '#4b5563',
            marginBottom: '4px'
        },
        scoreValue: {
            fontSize: '24px',
            fontWeight: 'bold' as const,
            color: theme === 'dark' ? '#60a5fa' : '#2563eb'
        },
        resultCard: {
            padding: '16px',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px',
            transition: 'box-shadow 0.2s',
            cursor: 'pointer',
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            marginBottom: '8px'
        },
        statusActive: {
            color: '#22c55e',
            fontWeight: 500
        },
        statusInactive: {
            color: '#ef4444',
            fontWeight: 500
        },
        statusPending: {
            color: '#eab308',
            fontWeight: 500
        },
        statusSuspended: {
            color: '#6b7280',
            fontWeight: 500
        },
        resultsContainer: {
            maxHeight: '500px',
            overflowY: 'auto' as const,
            // Apply scrollbar styles
            scrollbarWidth: scrollbarStyles.scrollbarWidth,
            scrollbarColor: scrollbarStyles.scrollbarColor,
        },
        filtersGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            padding: '16px',
            backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
            borderRadius: '8px',
            marginBottom: '24px'
        },
        header: {
            marginBottom: '24px'
        },
        actionsContainer: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
        },
        buttonGroup: {
            display: 'flex',
            gap: '8px'
        },
        exportButton: {
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 500,
            backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
            color: theme === 'dark' ? '#e2e8f0' : '#334155',
            border: 'none',
            cursor: 'pointer'
        },
        exportMenu: {
            position: 'absolute' as const,
            top: '100%',
            left: 0,
            marginTop: '4px',
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            minWidth: '120px'
        },
        exportMenuItem: {
            display: 'block',
            width: '100%',
            textAlign: 'left' as const,
            padding: '8px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        activeFiltersContainer: {
            marginTop: '24px',
            padding: '16px',
            backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
            borderRadius: '8px'
        },
        preformatted: {
            fontSize: '12px',
            backgroundColor: theme === 'dark' ? '#0f172a' : '#f1f5f9',
            padding: '8px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '160px'
        },
        clearButton: {
            marginTop: '8px',
            fontSize: '14px',
            color: '#ef4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
        }
    };

    // Inject scrollbar styles into the document head
    React.useEffect(() => {
        const styleId = 'custom-scrollbar-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        if (theme === 'light') {
            styleElement.textContent = `
                /* Light theme scrollbar */
                .custom-scrollbar-container::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar-container::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }
                .custom-scrollbar-container::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar-container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                /* Firefox scrollbar */
                .custom-scrollbar-container {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
            `;
        } else {
            styleElement.textContent = `
                /* Dark theme scrollbar */
                .custom-scrollbar-container::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar-container::-webkit-scrollbar-track {
                    background: #1e293b;
                    border-radius: 4px;
                }
                .custom-scrollbar-container::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 4px;
                }
                .custom-scrollbar-container::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                }
                /* Firefox scrollbar */
                .custom-scrollbar-container {
                    scrollbar-width: thin;
                    scrollbar-color: #475569 #1e293b;
                }
            `;
        }

        return (): void => {
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        };
    }, [theme]);


    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
    React.useEffect(() => {
        if (!showExportMenu) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowExportMenu(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowExportMenu(false);
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % 3);
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + 3) % 3);
            }

            if (e.key === 'Enter' && focusedIndex !== -1) {
                const options = ['csv', 'excel', 'json'];
                handleExport(options[focusedIndex]);
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showExportMenu, focusedIndex]);

    return (
        <div>
            {/* Theme Selector */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <VariantSelector
                    variants={themeOptions.map(o => o.value)}
                    selectedVariant={theme}
                    onSelectVariant={(v): void => setTheme(v as 'light' | 'dark')}
                    type="Theme"
                    getLabel={(v): string => themeOptions.find(o => o.value === v)?.label || v}
                />
            </div>

            {/* Tabs for Preview and Code */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div style={{ border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, borderRadius: '8px', overflow: 'hidden' }}>
                        <AdvancedSearchForm variant={theme} layout="stacked">
                            <div style={{ padding: '24px' }}>
                                {/* Header */}
                                <div style={styles.header}>
                                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Advanced User Management System</h3>
                                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                                        Powerful search with multiple filter types, real-time filtering, saved searches, and faceted hints
                                    </p>
                                    {isSearching && (
                                        <p style={{ fontSize: '14px', color: '#3b82f6', marginTop: '8px' }}>Searching...</p>
                                    )}
                                    {!isSearching && filteredResults.length !== mockUsers.length && filteredResults.length > 0 && (
                                        <p style={{ fontSize: '14px', color: '#22c55e', marginTop: '8px' }}>
                                            Found {filteredResults.length} matching results
                                        </p>
                                    )}
                                    {!isSearching && filteredResults.length === 0 && Object.keys(activeFilters).length > 0 && (
                                        <p style={{ fontSize: '14px', color: '#ef4444', marginTop: '8px' }}>
                                            No results match your filters. Try adjusting your criteria.
                                        </p>
                                    )}
                                </div>

                                {/* Filters */}
                                <SearchFilters>
                                    <div style={styles.filtersGrid}>
                                        <SearchTextFilter
                                            filter={{ id: "name", label: "User Name", type: "text" as const, placeholder: "Search by name..." }}
                                            value={activeFilters.name || ""}
                                            onChange={(val): void => handleFilterChange("name", val)}
                                        />
                                        <SearchSelectFilter
                                            filter={{ id: "role", label: "Role", type: "select" as const, options: roleOptions }}
                                            value={activeFilters.role || ""}
                                            onChange={(val): void => handleFilterChange("role", val)}
                                        />
                                        <SearchSelectFilter
                                            filter={{ id: "department", label: "Department", type: "select" as const, options: departmentOptions }}
                                            value={activeFilters.department || ""}
                                            onChange={(val): void => handleFilterChange("department", val)}
                                        />
                                        <SearchSelectFilter
                                            filter={{ id: "location", label: "Location", type: "select" as const, options: locationOptions }}
                                            value={activeFilters.location || ""}
                                            onChange={(val): void => handleFilterChange("location", val)}
                                        />
                                        <SearchMultiSelectFilter
                                            filter={{ id: "status", label: "Status", type: "multi-select" as const, options: statusOptions }}
                                            value={activeFilters.status || []}
                                            onChange={(val): void => handleFilterChange("status", val)}
                                        />
                                        <SearchDateRangeFilter
                                            filter={{ id: "dateRange", label: "Date Range", type: "date-range" as const, presets: ["today", "yesterday", "last7days", "last30days", "last90days"] }}
                                            value={activeFilters.dateRange || {}}
                                            onChange={(val): void => handleFilterChange("dateRange", val)}
                                        />
                                        <SearchNumericRangeFilter
                                            filter={{ id: "ageRange", label: "Age Range", type: "numeric-range" as const, min: 18, max: 100 }}
                                            value={activeFilters.ageRange || {}}
                                            onChange={(val): void => handleFilterChange("ageRange", val)}
                                        />
                                        <SearchNumericRangeFilter
                                            filter={{ id: "scoreRange", label: "Score Range", type: "numeric-range" as const, min: 0, max: 100 }}
                                            value={activeFilters.scoreRange || {}}
                                            onChange={(val): void => handleFilterChange("scoreRange", val)}
                                        />
                                        <SearchNumericRangeFilter
                                            filter={{ id: "salaryRange", label: "Salary Range (USD)", type: "numeric-range" as const, min: 50000, max: 150000, step: 5000 }}
                                            value={activeFilters.salaryRange || {}}
                                            onChange={(val): void => handleFilterChange("salaryRange", val)}
                                        />
                                    </div>
                                </SearchFilters>

                                {/* Actions and Results Count */}
                                <div style={styles.actionsContainer}>
                                    <div style={styles.buttonGroup}>
                                        <SearchActions
                                            onApply={handleApply}
                                            onReset={handleReset}
                                            onSave={(): void => {
                                                const name = prompt("Enter a name for this search:", `Search ${savedSearchesState.length + 1}`);
                                                if (name) {
                                                    handleSaveSearch({ name });
                                                }
                                            }}
                                            showApply={true}
                                            showReset={true}
                                            showSave={true}
                                            showExport={false}
                                        />

                                        {/* Custom Export Dropdown */}
                                        <div style={{ position: 'relative' }} ref={menuRef}>
                                            <button
                                                onClick={() => setShowExportMenu(!showExportMenu)}
                                                style={styles.exportButton}
                                                aria-haspopup="menu"
                                                aria-expanded={showExportMenu}
                                            >
                                                Export ▼
                                            </button>
                                            {showExportMenu && (
                                                <div style={styles.exportMenu} role='menu'>
                                                    {['csv', 'excel', 'json'].map((type, index) => (
                                                        <button
                                                            key={type}
                                                            role="menuitem"
                                                            tabIndex={0}
                                                            onClick={() => handleExport(type)}
                                                            style={{
                                                                ...styles.exportMenuItem,
                                                                backgroundColor:
                                                                    focusedIndex === index
                                                                        ? (theme === 'dark' ? '#334155' : '#f1f5f9')
                                                                        : 'transparent',
                                                                ...(index === 2 && {
                                                                    borderBottomLeftRadius: '8px',
                                                                    borderBottomRightRadius: '8px',
                                                                }),
                                                            }}
                                                            onMouseEnter={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                theme === 'dark' ? '#334155' : '#f1f5f9')
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.currentTarget.style.backgroundColor = 'transparent')
                                                            }
                                                        >
                                                            {type.toUpperCase()}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <SearchResultsCount count={filteredResults.length} total={mockUsers.length} />
                                </div>

                                {/* Saved Searches and Faceted Hints */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                                    <SearchSavedSearches
                                        searches={savedSearchesState}
                                        onApply={(search: SavedSearchType): void => {
                                            setActiveFilters(search.filters);
                                        }}
                                        onDelete={handleDeleteSearch}
                                    />
                                    <SearchFacetedHints
                                        categories={facetedCategories}
                                        onSelect={(categoryId, value): void => {
                                            handleFilterChange(categoryId, [value]);
                                        }}
                                    />
                                </div>

                                {/* Results Display with Custom Scrollbar */}
                                <div>
                                    <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                                        Results ({filteredResults.length})
                                        {filteredResults.length !== mockUsers.length && filteredResults.length > 0 && (
                                            <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '8px' }}>
                                                (Filtered from {mockUsers.length} total users)
                                            </span>
                                        )}
                                    </h4>
                                    <div
                                        className="custom-scrollbar-container"
                                        style={styles.resultsContainer}
                                    >
                                        {filteredResults.map(user => (
                                            <div
                                                key={user.id}
                                                style={styles.resultCard}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{user.name}</p>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
                                                            <p style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                                                                Role: <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</span>
                                                            </p>
                                                            <p style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                                                                Status:{' '}
                                                                <span style={
                                                                    user.status === 'active' ? styles.statusActive :
                                                                        user.status === 'inactive' ? styles.statusInactive :
                                                                            user.status === 'pending' ? styles.statusPending :
                                                                                styles.statusSuspended
                                                                }>
                                                                    {user.status}
                                                                </span>
                                                            </p>
                                                            <p style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                                                                Dept: <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.department}</span>
                                                            </p>
                                                            <p style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                                                                Location: <span style={{ fontWeight: 500 }}>{user.location}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div style={styles.scoreBadge}>
                                                        <p style={styles.scoreLabel}>Score</p>
                                                        <p style={styles.scoreValue}>{user.score}</p>
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme === 'dark' ? '#64748b' : '#94a3b8' }}>
                                                    <span>Age: {user.age}</span>
                                                    <span>Salary: ${user.salary.toLocaleString()}</span>
                                                    <span>Joined: {user.created}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {filteredResults.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '32px' }}>
                                                <p style={{ color: '#64748b' }}>No results found. Try adjusting your filters.</p>
                                                <button
                                                    onClick={handleReset}
                                                    style={{ marginTop: '8px', fontSize: '14px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Clear all filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Current Filters Display */}
                                {Object.keys(activeFilters).length > 0 && (
                                    <div style={styles.activeFiltersContainer}>
                                        <button
                                            onClick={handleReset}
                                            style={styles.clearButton}
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </AdvancedSearchForm>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {generateCode()}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};