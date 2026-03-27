import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import {
    MagnifyingGlassIcon,
    DownloadIcon,
    ResetIcon,
    BookmarkIcon,
    BookmarkFilledIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Cross2Icon,
    CheckIcon,
    PersonIcon,
    CalendarIcon,
    SymbolIcon,
    FileTextIcon,
    FileIcon,
    GitHubLogoIcon,
    UpdateIcon,
} from '@radix-ui/react-icons';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';
import { Typography } from '@site/src/components/UI/typography';

/* ============================================
   TYPES & INTERFACES
============================================ */

export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended';
export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Moderator' | 'Guest';
export type TagType = 'Premium' | 'New' | 'Verified' | 'Beta' | 'VIP' | 'Trial' | 'Enterprise' | 'Pro' | 'Basic';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    tags: TagType[];
    createdAt: string;
    lastActive?: string;
    avatar?: string;
    verified: boolean;
    premium: boolean;
    country?: string;
    company?: string;
    phone?: string;
}

export interface SavedSearch {
    id: string;
    name: string;
    description?: string;
    filters: FilterState;
    createdAt: string;
    lastUsed?: string;
    isPinned?: boolean;
    shared?: boolean;
    owner?: string;
}

export interface FilterState {
    name: string;
    role: UserRole | '';
    status: UserStatus | '';
    tags: TagType[];
    dateFrom: string;
    dateTo: string;
    verifiedOnly: boolean;
    premiumOnly: boolean;
    country?: string;
    company?: string;
    sortBy?: 'name' | 'email' | 'role' | 'status' | 'createdAt' | 'lastActive';
    sortOrder?: 'asc' | 'desc';
}

export interface FacetCount {
    value: string;
    count: number;
    selected: boolean;
}

export interface FacetGroup {
    id: string;
    label: string;
    icon?: React.ElementType;
    counts: FacetCount[];
}

export interface ExportOptions {
    format: 'csv' | 'excel' | 'json' | 'pdf';
    includeFields: string[];
    filename?: string;
    delimiter?: string;
}

export interface SearchContextType {
    filters: FilterState;
    results: User[];
    totalCount: number;
    filteredCount: number;
    savedSearches: SavedSearch[];
    facets: FacetGroup[];
    isLoading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    totalPages: number;

    updateFilters: (updates: Partial<FilterState>) => void;
    resetFilters: () => void;
    applySavedSearch: (search: SavedSearch) => void;
    saveCurrentSearch: (name: string, description?: string) => void;
    deleteSavedSearch: (id: string) => void;
    togglePinSavedSearch: (id: string) => void;
    exportResults: (options: ExportOptions) => Promise<void>;
    setPage: (page: number) => void;
    clearError: () => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

const useSearchContext = () => {
    const context = React.useContext(SearchContext);
    if (!context) {
        throw new Error('Search components must be used within a SearchProvider');
    }
    return context;
};

/* ============================================
   THEME CONTEXT
============================================ */

interface ThemeContextType {
    theme: 'light' | 'dark';
    variant: 'light' | 'dark';
    cardVariant: 'default' | 'glass' | 'elevated' | 'border';
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const useThemeContext = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('Theme components must be used within a SearchProvider');
    }
    return context;
};

/* ============================================
   VARIANTS & ANIMATIONS
============================================ */

// Update the SearchVariants definition in index.tsx
const SearchVariants = cva("min-h-screen transition-all duration-500", {
    variants: {
        variant: {
            light: "bg-white text-gray-900",
            dark: "bg-black text-white",
        },
    },
    defaultVariants: {
        variant: "light",
    },
});

const CardVariants = cva("rounded-xl overflow-hidden transition-all duration-300", {
    variants: {
        variant: {
            default: "bg-white dark:bg-black shadow-lg border border-gray-200 dark:border-gray-800",
            glass: "bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-xl border border-white/20 dark:border-white/10",
            elevated: "bg-white dark:bg-black shadow-xl hover:shadow-2xl dark:hover:shadow-2xl",
            border: "bg-white dark:bg-black border-2 border-primary/20",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

// Animation variants
// const scaleIn = {
//     initial: { opacity: 0, scale: 0.95 },
//     animate: { opacity: 1, scale: 1 },
//     exit: { opacity: 0, scale: 0.9 },
//     transition: { duration: 0.2 }
// };

/* ============================================
   MOCK DATA GENERATION
============================================ */

const generateMockUsers = (count: number): User[] => {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ryan', 'Sara', 'Tom', 'Uma', 'Vera', 'Will', 'Xena', 'Yuri', 'Zara'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const roles: UserRole[] = ['Admin', 'Teacher', 'Student', 'Moderator', 'Guest'];
    const statuses: UserStatus[] = ['Active', 'Inactive', 'Pending', 'Suspended'];
    const tags: TagType[] = ['Premium', 'New', 'Verified', 'Beta', 'VIP', 'Trial', 'Enterprise', 'Pro', 'Basic'];
    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'India', 'China'];
    const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Netflix', 'Tesla', 'Adobe', 'Salesforce', 'Oracle'];

    const users: User[] = [];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
        const lastActive = new Date(createdAt.getTime() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));

        const userTags: TagType[] = [];
        const numTags = Math.floor(Math.random() * 4);
        for (let j = 0; j < numTags; j++) {
            const tag = tags[Math.floor(Math.random() * tags.length)];
            if (!userTags.includes(tag)) userTags.push(tag);
        }

        users.push({
            id: `user-${i + 1}`,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            role: roles[Math.floor(Math.random() * roles.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            tags: userTags,
            createdAt: createdAt.toISOString().split('T')[0],
            lastActive: Math.random() > 0.3 ? lastActive.toISOString().split('T')[0] : undefined,
            verified: Math.random() > 0.4,
            premium: Math.random() > 0.7,
            country: Math.random() > 0.5 ? countries[Math.floor(Math.random() * countries.length)] : undefined,
            company: Math.random() > 0.6 ? companies[Math.floor(Math.random() * companies.length)] : undefined,
            phone: Math.random() > 0.5 ? `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}+${lastName}`,
        });
    }

    return users;
};

const mockUsers = generateMockUsers(156);

const mockSavedSearches: SavedSearch[] = [
    {
        id: '1',
        name: 'Active Admins',
        description: 'All active administrators',
        filters: { name: '', role: 'Admin', status: 'Active', tags: [], dateFrom: '', dateTo: '', verifiedOnly: false, premiumOnly: false },
        createdAt: '2024-01-15',
        lastUsed: '2024-03-20',
        isPinned: true,
    },
    {
        id: '2',
        name: 'Recent Users',
        description: 'Users joined in last 30 days',
        filters: { name: '', role: '', status: '', tags: [], dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], dateTo: '', verifiedOnly: false, premiumOnly: false },
        createdAt: '2024-02-01',
        lastUsed: '2024-03-18',
    },
    {
        id: '3',
        name: 'Premium Students',
        description: 'Students with premium access',
        filters: { name: '', role: 'Student', status: '', tags: ['Premium'], dateFrom: '', dateTo: '', verifiedOnly: false, premiumOnly: true },
        createdAt: '2024-02-15',
        lastUsed: '2024-03-15',
        isPinned: true,
    },
    {
        id: '4',
        name: 'Inactive Accounts',
        description: 'Users not active for 90+ days',
        filters: { name: '', role: '', status: 'Inactive', tags: [], dateFrom: '', dateTo: '', verifiedOnly: false, premiumOnly: false },
        createdAt: '2024-03-01',
    },
];

/* ============================================
   SEARCH PROVIDER
============================================ */

export interface SearchProviderProps {
    children: React.ReactNode;
    initialFilters?: Partial<FilterState>;
    onSearch?: (filters: FilterState, results: User[]) => void;
    onExport?: (options: ExportOptions, data: User[]) => Promise<void>;
    variant?: 'light' | 'dark';  // Changed from the previous variant types
    cardVariant?: VariantProps<typeof CardVariants>["variant"];
    pageSize?: number;
    debounceMs?: number;
    theme?: 'light' | 'dark';
    debug?: boolean;
    className?: string;
    containerClassName?: string;
}

const SearchProvider: React.FC<SearchProviderProps> & {
    Header: typeof SearchHeader;
    Tabs: typeof SearchTabs;
    Filters: typeof SearchFilters;
    Results: typeof SearchResults;
    Pagination: typeof SearchPagination;
    ExportButton: typeof ExportButton;
    SaveSearchModal: typeof SaveSearchModal;
} = ({
    children,
    initialFilters = {},
    onSearch,
    onExport,
    variant = "light",
    cardVariant: cardVariantProp = "default",
    pageSize = 10,
    debounceMs = 300,
    theme: initialTheme = 'light',
    debug = false,
    className,
    containerClassName,
}) => {
        const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(initialTheme);
        const [filters, setFilters] = useState<FilterState>(() => ({
            name: '',
            role: '',
            status: '',
            tags: [],
            dateFrom: '',
            dateTo: '',
            verifiedOnly: false,
            premiumOnly: false,
            country: '',
            company: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...initialFilters,
        }));
        const [results, setResults] = useState<User[]>([]);
        const [filteredCount, setFilteredCount] = useState(0);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [page, setPage] = useState(0);
        const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);

        // Update theme when prop changes
        useEffect(() => {
            setCurrentTheme(initialTheme);
        }, [initialTheme]);

        // Remove global theme effects - keep theme local to component only
        // The theme is now handled by CSS classes on the wrapper div

        // Filter users (same as before)
        useEffect(() => {
            const filterUsers = () => {
                setIsLoading(true);
                setError(null);

                try {
                    setTimeout(() => {
                        const filtered = mockUsers.filter(user => {
                            // Name filter
                            if (filters.name && !user.name.toLowerCase().includes(filters.name.toLowerCase())) {
                                return false;
                            }

                            // Role filter
                            if (filters.role && user.role !== filters.role) {
                                return false;
                            }

                            // Status filter
                            if (filters.status && user.status !== filters.status) {
                                return false;
                            }

                            // Tags filter
                            if (filters.tags.length > 0) {
                                if (!filters.tags.some(tag => user.tags.includes(tag))) {
                                    return false;
                                }
                            }

                            // Date range filter
                            if (filters.dateFrom && user.createdAt < filters.dateFrom) {
                                return false;
                            }
                            if (filters.dateTo && user.createdAt > filters.dateTo) {
                                return false;
                            }

                            // Boolean filters
                            if (filters.verifiedOnly && !user.verified) {
                                return false;
                            }
                            if (filters.premiumOnly && !user.premium) {
                                return false;
                            }

                            // Country filter
                            if (filters.country && user.country !== filters.country) {
                                return false;
                            }

                            // Company filter
                            if (filters.company && user.company !== filters.company) {
                                return false;
                            }

                            return true;
                        });

                        // Sort results
                        if (filters.sortBy) {
                            filtered.sort((a, b) => {
                                const aVal = a[filters.sortBy!];
                                const bVal = b[filters.sortBy!];

                                if (typeof aVal === 'string' && typeof bVal === 'string') {
                                    return filters.sortOrder === 'asc'
                                        ? aVal.localeCompare(bVal)
                                        : bVal.localeCompare(aVal);
                                }
                                return 0;
                            });
                        }

                        setResults(filtered);
                        setFilteredCount(filtered.length);
                        setIsLoading(false);

                        onSearch?.(filters, filtered);
                    }, debounceMs);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred while filtering');
                    setIsLoading(false);
                }
            };

            filterUsers();
        }, [filters, debounceMs, onSearch]);

        // Rest of your existing functions (updateFilters, resetFilters, etc.) remain the same
        const updateFilters = useCallback((updates: Partial<FilterState>) => {
            setFilters(prev => ({ ...prev, ...updates }));
            setPage(0);
        }, []);

        const resetFilters = useCallback(() => {
            setFilters({
                name: '',
                role: '',
                status: '',
                tags: [],
                dateFrom: '',
                dateTo: '',
                verifiedOnly: false,
                premiumOnly: false,
                country: '',
                company: '',
                sortBy: 'createdAt',
                sortOrder: 'desc',
            });
            setPage(0);
        }, []);

        const applySavedSearch = useCallback((search: SavedSearch) => {
            setFilters(search.filters);
            setPage(0);

            setSavedSearches(prev =>
                prev.map(s => s.id === search.id
                    ? { ...s, lastUsed: new Date().toISOString().split('T')[0] }
                    : s
                )
            );
        }, []);

        const saveCurrentSearch = useCallback((name: string, description?: string) => {
            const newSearch: SavedSearch = {
                id: Date.now().toString(),
                name,
                description,
                filters: { ...filters },
                createdAt: new Date().toISOString().split('T')[0],
            };
            setSavedSearches(prev => [...prev, newSearch]);
        }, [filters]);

        const deleteSavedSearch = useCallback((id: string) => {
            setSavedSearches(prev => prev.filter(s => s.id !== id));
        }, []);

        const togglePinSavedSearch = useCallback((id: string) => {
            setSavedSearches(prev =>
                prev.map(s => s.id === id
                    ? { ...s, isPinned: !s.isPinned }
                    : s
                )
            );
        }, []);

        const exportResults = useCallback(async (options: ExportOptions) => {
            if (onExport) {
                await onExport(options, results);
            } else {
                const data = results.map(user => {
                    const filtered: Record<string, any> = {};
                    options.includeFields.forEach(field => {
                        filtered[field] = user[field as keyof User];
                    });
                    return filtered;
                });

                if (options.format === 'csv') {
                    const headers = Object.keys(data[0] || {}).join(options.delimiter || ',');
                    const rows = data.map(row => Object.values(row).join(options.delimiter || ','));
                    const csv = [headers, ...rows].join('\n');

                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = options.filename || `export-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                } else if (options.format === 'json') {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = options.filename || `export-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            }
        }, [results, onExport]);

        const clearError = useCallback(() => setError(null), []);

        const facets = useMemo((): FacetGroup[] => {
            const roleCounts: Record<string, number> = {};
            const statusCounts: Record<string, number> = {};
            const tagCounts: Record<string, number> = {};

            mockUsers.forEach(user => {
                roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
                statusCounts[user.status] = (statusCounts[user.status] || 0) + 1;
                user.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });

            return [
                {
                    id: 'role',
                    label: 'Role',
                    icon: PersonIcon,
                    counts: Object.entries(roleCounts).map(([value, count]) => ({
                        value,
                        count,
                        selected: filters.role === value,
                    })),
                },
                {
                    id: 'status',
                    label: 'Status',
                    icon: UpdateIcon,
                    counts: Object.entries(statusCounts).map(([value, count]) => ({
                        value,
                        count,
                        selected: filters.status === value,
                    })),
                },
                {
                    id: 'tags',
                    label: 'Tags',
                    icon: SymbolIcon,
                    counts: Object.entries(tagCounts).map(([value, count]) => ({
                        value,
                        count,
                        selected: filters.tags.includes(value as TagType),
                    })),
                },
            ];
        }, [filters]);

        const totalCount = mockUsers.length;
        const totalPages = Math.ceil(filteredCount / pageSize);

        const contextValue: SearchContextType = {
            filters,
            results,
            totalCount,
            filteredCount,
            savedSearches,
            facets,
            isLoading,
            error,
            page,
            pageSize,
            totalPages,
            updateFilters,
            resetFilters,
            applySavedSearch,
            saveCurrentSearch,
            deleteSavedSearch,
            togglePinSavedSearch,
            exportResults,
            setPage,
            clearError,
        };

        if (debug) {
            console.log('Search Context:', { filters, results, filteredCount, isLoading });
        }

        return (
            <SearchContext.Provider value={contextValue}>
                <ThemeContext.Provider value={{
                    theme: currentTheme,
                    variant: variant as 'light' | 'dark',
                    cardVariant: cardVariantProp
                }}>
                    <div
                        data-search-provider
                        className={cn(
                            "py-5",
                            SearchVariants({ variant }),
                            "rounded-lg",
                            className
                        )}
                    >
                        <main className={cn("container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", containerClassName)}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                {children}
                            </motion.div>
                        </main>
                    </div>
                </ThemeContext.Provider>
            </SearchContext.Provider>
        );
    };
/* ============================================
   HEADER COMPONENT
============================================ */

export interface SearchHeaderProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    showExport?: boolean;
    showSave?: boolean;
    onExportClick?: () => void;
    onSaveClick?: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    title = "Advanced Search",
    description = "Filter and find users with precision",
    icon,
    children,
    className,
    showExport = true,
    showSave = true,
    onSaveClick,
}) => {
    const { exportResults } = useSearchContext();

    const handleExport = async () => {
        await exportResults({
            format: 'csv',
            includeFields: ['name', 'email', 'role', 'status', 'createdAt', 'verified', 'premium'],
            filename: `users-export-${new Date().toISOString().split('T')[0]}.csv`,
        });
    };

    if (children) {
        return (
            <header className={cn(
                "flex items-center justify-between pb-6 border-b border-border/50",
                className
            )}>
                {children}
            </header>
        );
    }

    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex items-center justify-between pb-6 border-b border-border/50", className)}
        >
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {icon || <MagnifyingGlassIcon className="h-5 w-5 text-primary" />}
                </div>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {showSave && onSaveClick && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onSaveClick}
                        className="gap-2"
                    >
                        <BookmarkIcon className="h-4 w-4" />
                        Save Search
                    </Button>
                )}

                {showExport && (
                    <ExportButton onExport={handleExport} />
                )}
            </div>
        </motion.header>
    );
};

/* ============================================
   TABS COMPONENT
============================================ */

export interface SearchTabsProps {
    children?: React.ReactNode;
    className?: string;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ children, className }) => {
    const { savedSearches, applySavedSearch } = useSearchContext();

    const pinnedSearches = savedSearches.filter(s => s.isPinned);
    const recentSearches = [...savedSearches]
        .filter(s => s.lastUsed)
        .sort((a, b) => (b.lastUsed || '').localeCompare(a.lastUsed || ''))
        .slice(0, 3);

    if (children) {
        return <div className={cn("mb-6", className)}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn("flex items-center gap-2 flex-wrap", className)}
        >
            <span className="text-xs font-medium text-muted-foreground mr-2">
                Saved:
            </span>

            {/* Pinned searches */}
            {pinnedSearches.map((search) => (
                <motion.button
                    key={search.id}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applySavedSearch(search)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                >
                    <BookmarkFilledIcon className="h-3 w-3" />
                    {search.name}
                </motion.button>
            ))}

            {/* Recent searches */}
            {recentSearches.map((search) => (
                <motion.button
                    key={search.id}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applySavedSearch(search)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                    {search.name}
                </motion.button>
            ))}

            {/* Show all saved count */}
            {savedSearches.length > pinnedSearches.length + recentSearches.length && (
                <span className="text-xs text-muted-foreground">
                    +{savedSearches.length - pinnedSearches.length - recentSearches.length} more
                </span>
            )}
        </motion.div>
    );
};

/* ============================================
   FILTERS COMPONENT
============================================ */

export interface SearchFiltersProps {
    className?: string;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    showTags?: boolean;
    showDateRange?: boolean;
    showBooleanFilters?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    className,
    expanded: controlledExpanded,
    onExpandedChange,
    showTags = true,
    showDateRange = true,
    showBooleanFilters = true,
}) => {
    const { filters, updateFilters, resetFilters } = useSearchContext();
    const { theme, cardVariant } = useThemeContext(); // Add this line
    const [internalExpanded, setInternalExpanded] = useState(true);

    const expanded = controlledExpanded ?? internalExpanded;
    const setExpanded = onExpandedChange ?? setInternalExpanded;

    const roles: UserRole[] = ['Admin', 'Teacher', 'Student', 'Moderator', 'Guest'];
    const statuses: UserStatus[] = ['Active', 'Inactive', 'Pending', 'Suspended'];
    const tags: TagType[] = ['Premium', 'New', 'Verified', 'Beta', 'VIP', 'Trial', 'Enterprise', 'Pro', 'Basic'];

    const activeFilterCount = [
        filters.name,
        filters.role,
        filters.status,
        ...filters.tags,
        filters.dateFrom,
        filters.dateTo,
        filters.verifiedOnly && 'verified',
        filters.premiumOnly && 'premium',
        filters.country,
        filters.company,
    ].filter(Boolean).length;

    const handleTagToggle = (tag: TagType) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        updateFilters({ tags: newTags });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
                CardVariants({ variant: cardVariant }),
                "overflow-hidden",
                className
            )}
        >
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    "w-full flex items-center justify-between px-5 py-4 transition-colors",
                    theme === 'dark'
                        ? "hover:bg-gray-900"
                        : "hover:bg-gray-100"
                )}
            >
                <div className="flex items-center gap-2.5">
                    <MagnifyingGlassIcon className="h-4 w-4 text-primary" />
                    <span className={cn(
                        "font-semibold text-sm",
                        theme === 'dark' ? "text-white" : "text-gray-900"
                    )}>Filters</span>
                    {activeFilterCount > 0 && (
                        <motion.span
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
                        >
                            {activeFilterCount}
                        </motion.span>
                    )}
                </div>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon className={cn(
                        "h-4 w-4",
                        theme === 'dark' ? "text-gray-400" : "text-gray-500"
                    )} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 space-y-4">
                            {/* Name search */}
                            <div className="space-y-1.5">
                                <label className={cn(
                                    "text-xs font-medium flex items-center gap-1.5",
                                    theme === 'dark' ? "text-gray-400" : "text-gray-600"
                                )}>
                                    <PersonIcon className="h-3 w-3" /> Name
                                </label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5",
                                        theme === 'dark' ? "text-gray-400" : "text-gray-500"
                                    )} />
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={filters.name}
                                        onChange={(e) => updateFilters({ name: e.target.value })}
                                        className={cn(
                                            "w-full h-9 pl-9 pr-8 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                            theme === 'dark'
                                                ? "bg-black border-gray-800 text-white"
                                                : "bg-white border-gray-200 text-gray-900"
                                        )}
                                    />
                                    {filters.name && (
                                        <button
                                            onClick={() => updateFilters({ name: '' })}
                                            className={cn(
                                                "absolute right-3 top-1/2 -translate-y-1/2",
                                                theme === 'dark'
                                                    ? "text-gray-400 hover:text-white"
                                                    : "text-gray-500 hover:text-gray-900"
                                            )}
                                        >
                                            <Cross2Icon className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Role and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className={cn(
                                        "text-xs font-medium flex items-center gap-1.5",
                                        theme === 'dark' ? "text-gray-400" : "text-gray-600"
                                    )}>
                                        <PersonIcon className="h-3 w-3" /> Role
                                    </label>
                                    <select
                                        value={filters.role}
                                        onChange={(e) => updateFilters({ role: e.target.value as UserRole })}
                                        className={cn(
                                            "w-full h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                            theme === 'dark'
                                                ? "bg-black border-gray-800 text-white"
                                                : "bg-white border-gray-200 text-gray-900"
                                        )}
                                    >
                                        <option value="">All Roles</option>
                                        {roles.map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className={cn(
                                        "text-xs font-medium flex items-center gap-1.5",
                                        theme === 'dark' ? "text-gray-400" : "text-gray-600"
                                    )}>
                                        <UpdateIcon className="h-3 w-3" /> Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => updateFilters({ status: e.target.value as UserStatus })}
                                        className={cn(
                                            "w-full h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                            theme === 'dark'
                                                ? "bg-black border-gray-800 text-white"
                                                : "bg-white border-gray-200 text-gray-900"
                                        )}
                                    >
                                        <option value="">All Statuses</option>
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Tags */}
                            {showTags && (
                                <div className="space-y-1.5">
                                    <label className={cn(
                                        "text-xs font-medium flex items-center gap-1.5",
                                        theme === 'dark' ? "text-gray-400" : "text-gray-600"
                                    )}>
                                        <SymbolIcon className="h-3 w-3" /> Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => {
                                            const active = filters.tags.includes(tag);
                                            return (
                                                <motion.button
                                                    key={tag}
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    onClick={() => handleTagToggle(tag)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all",
                                                        active
                                                            ? "bg-primary text-white"
                                                            : theme === 'dark'
                                                                ? "bg-gray-900 text-gray-300 hover:bg-gray-800"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    )}
                                                >
                                                    {active && <CheckIcon className="h-3 w-3" />}
                                                    {tag}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Date Range */}
                            {showDateRange && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className={cn(
                                            "text-xs font-medium flex items-center gap-1.5",
                                            theme === 'dark' ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            <CalendarIcon className="h-3 w-3" /> From Date
                                        </label>
                                        <div className="relative">
                                            <CalendarIcon className={cn(
                                                "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5",
                                                theme === 'dark' ? "text-gray-400" : "text-gray-500"
                                            )} />
                                            <input
                                                type="date"
                                                value={filters.dateFrom}
                                                onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                                                className={cn(
                                                    "w-full h-9 pl-9 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                                    theme === 'dark'
                                                        ? "bg-black border-gray-800 text-white"
                                                        : "bg-white border-gray-200 text-gray-900"
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={cn(
                                            "text-xs font-medium flex items-center gap-1.5",
                                            theme === 'dark' ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            <CalendarIcon className="h-3 w-3" /> To Date
                                        </label>
                                        <div className="relative">
                                            <CalendarIcon className={cn(
                                                "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5",
                                                theme === 'dark' ? "text-gray-400" : "text-gray-500"
                                            )} />
                                            <input
                                                type="date"
                                                value={filters.dateTo}
                                                onChange={(e) => updateFilters({ dateTo: e.target.value })}
                                                className={cn(
                                                    "w-full h-9 pl-9 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                                    theme === 'dark'
                                                        ? "bg-black border-gray-800 text-white"
                                                        : "bg-white border-gray-200 text-gray-900"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Boolean Filters */}
                            {showBooleanFilters && (
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={filters.verifiedOnly}
                                            onChange={(e) => updateFilters({ verifiedOnly: e.target.checked })}
                                            className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary/30 h-4 w-4"
                                        />
                                        <span className={cn(
                                            "transition-colors",
                                            theme === 'dark'
                                                ? "text-gray-300 group-hover:text-white"
                                                : "text-gray-700 group-hover:text-gray-900"
                                        )}>
                                            Verified only
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={filters.premiumOnly}
                                            onChange={(e) => updateFilters({ premiumOnly: e.target.checked })}
                                            className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary/30 h-4 w-4"
                                        />
                                        <span className={cn(
                                            "transition-colors",
                                            theme === 'dark'
                                                ? "text-gray-300 group-hover:text-white"
                                                : "text-gray-700 group-hover:text-gray-900"
                                        )}>
                                            Premium only
                                        </span>
                                    </label>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => updateFilters(filters)}
                                    className="gap-2"
                                >
                                    <MagnifyingGlassIcon className="h-3.5 w-3.5" />
                                    Apply Filters
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="gap-2"
                                >
                                    <ResetIcon className="h-3.5 w-3.5" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ============================================
   RESULTS COMPONENT
============================================ */

export interface SearchResultsProps {
    className?: string;
    showAvatar?: boolean;
    showEmail?: boolean;
    showTags?: boolean;
    showStatus?: boolean;
    showRole?: boolean;
    showDate?: boolean;
    onRowClick?: (user: User) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
    className,
    showAvatar = true,
    showEmail = true,
    showTags = true,
    showStatus = true,
    showRole = true,
    showDate = true,
    onRowClick,
}) => {
    const { results, isLoading, page, pageSize, updateFilters, filters } = useSearchContext();
    const { theme, cardVariant } = useThemeContext(); // Add this line

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, results.length);
    const pageResults = results.slice(startIndex, endIndex);

    const handleSort = (field: 'name' | 'email' | 'role' | 'status' | 'createdAt') => {
        const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
        updateFilters({ sortBy: field, sortOrder: newOrder });
    };

    const getSortIcon = (field: string) => {
        if (filters.sortBy !== field) return null;
        return filters.sortOrder === 'asc' ? '↑' : '↓';
    };

    if (isLoading) {
        return (
            <div className={cn(CardVariants({ variant: cardVariant }), "p-8", className)}>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            {showAvatar && <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />}
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/3" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className={cn(CardVariants({ variant: cardVariant }), "p-12 text-center", className)}>
                <MagnifyingGlassIcon className={cn(
                    "h-12 w-12 mx-auto mb-4",
                    theme === 'dark' ? "text-gray-600" : "text-gray-400"
                )} />
                <Typography variant="h6" weight="semibold" className={cn(
                    "mb-2",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                )}>
                    No results found
                </Typography>
                <Typography variant="body-small" color="muted">
                    Try adjusting your filters or search criteria
                </Typography>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={cn(CardVariants({ variant: cardVariant }), " overflow-hidden", className)}
        >
            {/* Results header */}
            <div className={cn(
                "px-5 py-3 border-b flex items-center justify-between",
                theme === 'dark'
                    ? "border-gray-800"
                    : "border-gray-200"
            )}>
                <div className={cn(
                    "text-sm",
                    theme === 'dark' ? "text-gray-400" : "text-gray-600"
                )}>
                    Results: <span className={cn(
                        "font-semibold",
                        theme === 'dark' ? "text-white" : "text-gray-900"
                    )}>{results.length}</span> users
                </div>
                <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-gray-500" : "text-gray-500"
                )}>
                    Showing {startIndex + 1}-{endIndex} of {results.length}
                </div>
            </div>

            {/* Results table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={cn(
                            "border-b",
                            theme === 'dark'
                                ? "border-gray-800 bg-gray-900/50"
                                : "border-gray-200 bg-gray-50"
                        )}>
                            {showAvatar && <th className="px-5 py-3 text-left w-12"></th>}
                            <th
                                className={cn(
                                    "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors",
                                    theme === 'dark'
                                        ? "text-gray-400 hover:text-white"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                                onClick={() => handleSort('name')}
                            >
                                Name {getSortIcon('name')}
                            </th>
                            {showEmail && (
                                <th
                                    className={cn(
                                        "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors",
                                        theme === 'dark'
                                            ? "text-gray-400 hover:text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                    onClick={() => handleSort('email')}
                                >
                                    Email {getSortIcon('email')}
                                </th>
                            )}
                            {showRole && (
                                <th
                                    className={cn(
                                        "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors",
                                        theme === 'dark'
                                            ? "text-gray-400 hover:text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                    onClick={() => handleSort('role')}
                                >
                                    Role {getSortIcon('role')}
                                </th>
                            )}
                            {showStatus && (
                                <th
                                    className={cn(
                                        "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors",
                                        theme === 'dark'
                                            ? "text-gray-400 hover:text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                    onClick={() => handleSort('status')}
                                >
                                    Status {getSortIcon('status')}
                                </th>
                            )}
                            {showTags && <th className={cn(
                                "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                                theme === 'dark' ? "text-gray-400" : "text-gray-600"
                            )}>Tags</th>}
                            {showDate && (
                                <th
                                    className={cn(
                                        "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors",
                                        theme === 'dark'
                                            ? "text-gray-400 hover:text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                    onClick={() => handleSort('createdAt')}
                                >
                                    Created {getSortIcon('createdAt')}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {pageResults.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={cn(
                                        "border-b transition-colors cursor-pointer group",
                                        theme === 'dark'
                                            ? "border-gray-800 hover:bg-gray-900/50"
                                            : "border-gray-100 hover:bg-gray-50"
                                    )}
                                    onClick={() => onRowClick?.(user)}
                                >
                                    {showAvatar && (
                                        <td className="px-5 py-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`;
                                                }}
                                            />
                                        </td>
                                    )}
                                    <td className="px-5 py-3">
                                        <div className={cn(
                                            "font-medium transition-colors group-hover:text-primary",
                                            theme === 'dark' ? "text-white" : "text-gray-900"
                                        )}>
                                            {user.name}
                                        </div>
                                        {user.verified && (
                                            <span className="text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                                        )}
                                    </td>
                                    {showEmail && (
                                        <td className={cn(
                                            "px-5 py-3",
                                            theme === 'dark' ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            {user.email}
                                        </td>
                                    )}
                                    {showRole && (
                                        <td className="px-5 py-3">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-[11px] font-medium",
                                                theme === 'dark'
                                                    ? "bg-gray-800 text-gray-300"
                                                    : "bg-gray-100 text-gray-700"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                    )}
                                    {showStatus && (
                                        <td className="px-5 py-3">
                                            <span className="flex items-center gap-1.5">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    user.status === 'Active' && "bg-green-500",
                                                    user.status === 'Inactive' && "bg-gray-400",
                                                    user.status === 'Pending' && "bg-yellow-500",
                                                    user.status === 'Suspended' && "bg-red-500",
                                                )} />
                                                <span className={cn(
                                                    user.status === 'Active' && "text-green-600 dark:text-green-400",
                                                    user.status === 'Inactive' && (theme === 'dark' ? "text-gray-400" : "text-gray-600"),
                                                    user.status === 'Pending' && "text-yellow-600 dark:text-yellow-400",
                                                    user.status === 'Suspended' && "text-red-600 dark:text-red-400",
                                                )}>
                                                    {user.status}
                                                </span>
                                            </span>
                                        </td>
                                    )}
                                    {showTags && (
                                        <td className="px-5 py-3">
                                            <div className="flex gap-1 flex-wrap">
                                                {user.tags.slice(0, 2).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className={cn(
                                                            "px-1.5 py-0.5 rounded-full text-[10px] font-medium",
                                                            theme === 'dark'
                                                                ? "bg-gray-800 text-gray-300"
                                                                : "bg-gray-100 text-gray-700"
                                                        )}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {user.tags.length > 2 && (
                                                    <span className={cn(
                                                        "text-[10px]",
                                                        theme === 'dark' ? "text-gray-500" : "text-gray-500"
                                                    )}>
                                                        +{user.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    {showDate && (
                                        <td className={cn(
                                            "px-5 py-3 font-mono text-xs",
                                            theme === 'dark' ? "text-gray-500" : "text-gray-500"
                                        )}>
                                            {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

/* ============================================
   PAGINATION COMPONENT
============================================ */

export interface SearchPaginationProps {
    className?: string;
    showPageSize?: boolean;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({ className, showPageSize = true }) => {
    const { page, setPage, totalPages, filteredCount } = useSearchContext();

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(0, Math.min(page - 2, totalPages - maxVisible));
        const end = Math.min(start + maxVisible, totalPages);

        if (end - start < maxVisible) {
            start = Math.max(0, end - maxVisible);
        }

        for (let i = start; i < end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="text-sm text-muted-foreground">
                {showPageSize && (
                    <span>{filteredCount} total results</span>
                )}
            </div>

            <div className="flex items-center gap-1">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent disabled:opacity-30 transition-colors text-foreground"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </motion.button>

                {getPageNumbers().map((p) => (
                    <motion.button
                        key={p}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(p)}
                        className={cn(
                            "h-8 w-8 rounded-lg text-xs font-medium flex items-center justify-center transition-colors",
                            p === page
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent text-muted-foreground"
                        )}
                    >
                        {p + 1}
                    </motion.button>
                ))}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent disabled:opacity-30 transition-colors text-foreground"
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </motion.button>
            </div>
        </div>
    );
};

/* ============================================
   EXPORT BUTTON COMPONENT
============================================ */

export interface ExportButtonProps {
    onExport?: (format: 'csv' | 'excel' | 'json') => void;
    className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, className }) => {
    const [open, setOpen] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="default"
                size="sm"
                onClick={() => setOpen(!open)}
                className={cn("gap-2", className)}
            >
                <DownloadIcon className="h-4 w-4" />
                Export
            </Button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg p-1 z-50"
                    >
                        {[
                            { icon: FileTextIcon, label: 'Export CSV', format: 'csv' as const },
                            { icon: FileIcon, label: 'Export Excel', format: 'excel' as const },
                            { icon: GitHubLogoIcon, label: 'Export JSON', format: 'json' as const },
                        ].map((item) => (
                            <motion.button
                                key={item.label}
                                whileHover={{ x: 2 }}
                                onClick={() => {
                                    onExport?.(item.format);
                                    setOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors text-left text-foreground"
                            >
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{item.label}</div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ============================================
   SAVE SEARCH MODAL
============================================ */

export interface SaveSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description?: string) => void;
}

const SaveSearchModal: React.FC<SaveSearchModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { filters } = useSearchContext();

    if (!isOpen) return null;

    const activeFilterCount = [
        filters.name,
        filters.role,
        filters.status,
        ...filters.tags,
        filters.dateFrom,
        filters.dateTo,
        filters.verifiedOnly && 'verified',
        filters.premiumOnly && 'premium',
    ].filter(Boolean).length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Save Search</h3>
                    <button onClick={onClose} className="p-1 hover:bg-accent rounded">
                        <Cross2Icon className="h-4 w-4 text-foreground" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium block mb-1.5 text-foreground">Search Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Active Premium Users"
                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1.5 text-foreground">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this search..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="text-sm font-medium mb-2 text-foreground">Current Filters ({activeFilterCount})</div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            {filters.name && <div>• Name: {filters.name}</div>}
                            {filters.role && <div>• Role: {filters.role}</div>}
                            {filters.status && <div>• Status: {filters.status}</div>}
                            {filters.tags.length > 0 && <div>• Tags: {filters.tags.join(', ')}</div>}
                            {filters.dateFrom && <div>• From: {filters.dateFrom}</div>}
                            {filters.dateTo && <div>• To: {filters.dateTo}</div>}
                            {filters.verifiedOnly && <div>• Verified only</div>}
                            {filters.premiumOnly && <div>• Premium only</div>}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="default"
                            onClick={() => {
                                if (name.trim()) {
                                    onSave(name, description);
                                    setName('');
                                    setDescription('');
                                    onClose();
                                }
                            }}
                            disabled={!name.trim()}
                            className="flex-1"
                        >
                            Save Search
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ============================================
   ASSIGN COMPOUND COMPONENTS
============================================ */

SearchProvider.Header = SearchHeader;
SearchProvider.Tabs = SearchTabs;
SearchProvider.Filters = SearchFilters;
SearchProvider.Results = SearchResults;
SearchProvider.Pagination = SearchPagination;
SearchProvider.ExportButton = ExportButton;
SearchProvider.SaveSearchModal = SaveSearchModal;

export {
    SearchProvider,
    SearchHeader,
    SearchTabs,
    SearchFilters,
    SearchResults,
    SearchPagination,
    ExportButton,
    SaveSearchModal,
};