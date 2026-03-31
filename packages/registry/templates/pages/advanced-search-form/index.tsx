"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils/cn";
import { Typography } from "@ignix-ui/typography";
import DatePicker from "@ignix-ui/date-picker";
import { Checkbox } from "@ignix-ui/checkbox";

/* ============================================
   TYPES & INTERFACES
============================================ */

export type FilterType = "text" | "select" | "multi-select" | "date-range" | "checkbox" | "numeric-range";
export type DateRangePreset = "today" | "yesterday" | "last7days" | "last30days" | "last90days" | "thisMonth" | "lastMonth" | "custom";
export type ExportFormat = "csv" | "excel" | "json";
export type SearchVariant = "default" | "dark" | "light";
export type LayoutVariant = "inline" | "stacked" | "collapsible";
export type Breakpoint = "mobile" | "tablet" | "desktop";

export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

export interface BaseFilterConfig {
    id: string;
    label: string;
    type: FilterType;
    placeholder?: string;
    defaultValue?: string | string[] | { start?: string; end?: string; preset?: DateRangePreset } | { min?: number; max?: number };
    required?: boolean;
    fullWidthOnMobile?: boolean;
}

export interface TextFilterConfig extends BaseFilterConfig {
    type: "text";
}

export interface SelectFilterConfig extends BaseFilterConfig {
    type: "select";
    options: FilterOption[];
}

export interface MultiSelectFilterConfig extends BaseFilterConfig {
    type: "multi-select";
    options: FilterOption[];
    checkboxProps?: Omit<React.ComponentProps<typeof Checkbox>, 'checked' | 'onChange' | 'label'>;
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
    type: "date-range";
    presets?: DateRangePreset[];
    datePickerProps?: Omit<React.ComponentProps<typeof DatePicker>, 'value' | 'onChange' | 'variant' | 'themeMode'>;
}

export interface CheckboxFilterConfig extends BaseFilterConfig {
    type: "checkbox";
    options: FilterOption[];
    checkboxProps?: Omit<React.ComponentProps<typeof Checkbox>, 'checked' | 'onChange' | 'label'>;
}

export interface NumericRangeFilterConfig extends BaseFilterConfig {
    type: "numeric-range";
    min?: number;
    max?: number;
    step?: number;
}

export type FilterConfig =
    | TextFilterConfig
    | SelectFilterConfig
    | MultiSelectFilterConfig
    | DateRangeFilterConfig
    | CheckboxFilterConfig
    | NumericRangeFilterConfig;

export interface SavedSearch {
    id: string;
    name: string;
    filters: Record<string, FilterValue>;
    createdAt?: Date;
}

export interface FacetedCategory {
    id: string;
    label: string;
    options: FilterOption[];
}

export interface DateRangeValue {
    start?: string;
    end?: string;
    preset?: DateRangePreset;
}

export interface NumericRangeValue {
    min?: number;
    max?: number;
}

export type FilterValue =
    | string
    | string[]
    | DateRangeValue
    | NumericRangeValue
    | undefined;

export interface AdvancedSearchFormProps extends VariantProps<typeof searchContainerVariants> {
    variant?: SearchVariant;
    layout?: LayoutVariant;
    filters?: FilterConfig[];
    facetedCategories?: FacetedCategory[];
    onSearch?: (filters: Record<string, FilterValue>) => void;
    onExport?: (filters: Record<string, FilterValue>, format: ExportFormat) => void;
    onSaveSearch?: (search: SavedSearch) => void;
    onDeleteSearch?: (searchId: string) => void;
    initialFilters?: Record<string, FilterValue>;
    savedSearches?: SavedSearch[];
    resultsCount?: number;
    totalResults?: number;
    autoApply?: boolean;
    debounceMs?: number;
    showExport?: boolean;
    showSaveSearch?: boolean;
    showReset?: boolean;
    showFaceted?: boolean;
    showResultsCount?: boolean;
    className?: string;
    children?: React.ReactNode;
    ariaLabel?: string;
    mobileBreakpoint?: number;
    tabletBreakpoint?: number;
    defaultCollapsedOnMobile?: boolean;
}

interface SearchContextType {
    variant: SearchVariant;
    layout: LayoutVariant;
    filters: FilterConfig[];
    activeFilters: Record<string, FilterValue>;
    setActiveFilters: React.Dispatch<React.SetStateAction<Record<string, FilterValue>>>;
    onSearch?: (filters: Record<string, FilterValue>) => void;
    autoApply: boolean;
    debounceMs: number;
    theme: "light" | "dark";
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    filtersCollapsed: boolean;
    setFiltersCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    resultsCount?: number;
    totalResults?: number;
    savedSearches?: SavedSearch[];
    onSaveSearch?: (search: SavedSearch) => void;
    onExport?: (filters: Record<string, FilterValue>, format: ExportFormat) => void;
    facetedCategories?: FacetedCategory[];
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

const useSearch = (): SearchContextType => {
    const context = React.useContext(SearchContext);
    if (!context) {
        throw new Error("Search components must be used within AdvancedSearchForm");
    }
    return context;
};

/* ============================================
   VARIANTS
============================================ */

const searchContainerVariants = cva("w-full transition-all duration-300", {
    variants: {
        variant: {
            default: "bg-white text-gray-900",
            dark: "bg-gray-950 text-white",
            light: "bg-gray-50 text-gray-900",
        },
        layout: {
            inline: "space-y-4",
            stacked: "space-y-6",
            collapsible: "",
        },
    },
    defaultVariants: {
        variant: "default",
        layout: "stacked",
    },
});

const filterGroupVariants = cva("", {
    variants: {
        layout: {
            inline: "flex flex-wrap gap-4 items-end",
            stacked: "space-y-4",
            collapsible: "space-y-4",
        },
    },
    defaultVariants: {
        layout: "stacked",
    },
});

/* ============================================
   RESPONSIVE HOOK
============================================ */
type UseResponsiveReturn = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    hasMounted: boolean;
};


const useResponsive = (mobileBreakpoint = 768, tabletBreakpoint = 1024): UseResponsiveReturn => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [isTablet, setIsTablet] = React.useState(false);
    const [isDesktop, setIsDesktop] = React.useState(true); // SSR-safe default
    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
        const checkScreenSize = (): void => {
            const width = window.innerWidth;
            setIsMobile(width < mobileBreakpoint);
            setIsTablet(width >= mobileBreakpoint && width < tabletBreakpoint);
            setIsDesktop(width >= tabletBreakpoint);
        };

        checkScreenSize();
        setHasMounted(true);

        window.addEventListener("resize", checkScreenSize);
        return (): void => window.removeEventListener("resize", checkScreenSize);
    }, [mobileBreakpoint, tabletBreakpoint]);

    return { isMobile, isTablet, isDesktop, hasMounted };
};

/* ============================================
   UTILITY FUNCTIONS
============================================ */

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
};

const getDateRangeFromPreset = (
    preset: DateRangePreset
): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date();

    switch (preset) {
        case "today":
            return {
                start: new Date(now),
                end: new Date(now),
            };

        case "yesterday":
            start.setDate(now.getDate() - 1);
            return {
                start: new Date(start),
                end: new Date(start),
            };

        case "last7days":
            start.setDate(now.getDate() - 7);
            return {
                start: new Date(start),
                end: new Date(now),
            };

        case "last30days":
            start.setDate(now.getDate() - 30);
            return {
                start: new Date(start),
                end: new Date(now),
            };

        case "last90days":
            start.setDate(now.getDate() - 90);
            return {
                start: new Date(start),
                end: new Date(now),
            };

        case "thisMonth":
            return {
                start: new Date(now.getFullYear(), now.getMonth(), 1),
                end: new Date(now),
            };

        case "lastMonth":
            return {
                start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                end: new Date(now.getFullYear(), now.getMonth(), 0),
            };

        default:
            return {
                start: new Date(now),
                end: new Date(now),
            };
    }
};

/* ============================================
   FILTER COMPONENTS
============================================ */

export interface SearchTextFilterProps {
    filter: TextFilterConfig;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const SearchTextFilter: React.FC<SearchTextFilterProps> = ({
    filter,
    value,
    onChange,
    className,
}) => {
    const { theme, autoApply, isMobile } = useSearch();
    const [localValue, setLocalValue] = React.useState(value || "");

    React.useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (autoApply) {
            onChange(newValue);
        }
    };
    return (
        <div className={cn(
            "flex flex-col gap-2",
            filter.fullWidthOnMobile !== false && isMobile && "w-full",
            className
        )}>
            <Typography
                variant="label"
                weight="medium"
                as="label"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                {filter.label}
                {filter.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <input
                id={filter.id}
                type="text"
                value={localValue}
                onChange={handleChange}
                placeholder={filter.placeholder}
                className={cn(
                    "px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all",
                    isMobile ? "text-sm px-2 py-1.5" : "text-base",
                    theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                )}
            />
        </div>
    );
};

SearchTextFilter.displayName = "SearchTextFilter";

export interface SearchSelectFilterProps {
    filter: SelectFilterConfig;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const SearchSelectFilter: React.FC<SearchSelectFilterProps> = ({
    filter,
    value,
    onChange,
    className,
}) => {
    const { theme, isMobile } = useSearch();

    return (
        <div className={cn(
            "flex flex-col gap-2",
            filter.fullWidthOnMobile !== false && isMobile && "w-full",
            className
        )}>
            <Typography
                variant="label"
                weight="medium"
                as="label"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                {filter.label}
            </Typography>
            <select
                id={filter.id}
                value={value || ""}
                onChange={(e): void => onChange(e.target.value)}
                className={cn(
                    "px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all cursor-pointer",
                    isMobile ? "text-sm px-2 py-1.5" : "text-base",
                    theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                )}
            >
                <option value="">All</option>
                {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label} {option.count !== undefined && `(${option.count})`}
                    </option>
                ))}
            </select>
        </div>
    );
};

SearchSelectFilter.displayName = "SearchSelectFilter";

export interface SearchMultiSelectFilterProps {
    filter: MultiSelectFilterConfig;
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

export const SearchMultiSelectFilter: React.FC<SearchMultiSelectFilterProps> = ({
    filter,
    value = [],
    onChange,
    className,
}) => {
    const { theme, isMobile } = useSearch();
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return (): void => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (optionValue: string): void => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const selectedLabels = filter.options
        .filter(opt => value.includes(opt.value))
        .map(opt => opt.label);

    // Fix: Add explicit return types with proper literal types
    const getCheckboxSize = (): "xs" | "sm" | "md" | "lg" | "xl" => {
        if (isMobile) return "sm";
        return "md";
    };

    const getCheckboxVariant = (): "default" | "primary" | "success" | "warning" | "danger" | "outline" | "subtle" | "glass" | "neon" => {
        if (theme === "dark") return "glass";
        return "default";
    };

    return (
        <div className={cn(
            "flex flex-col gap-2 relative",
            filter.fullWidthOnMobile !== false && isMobile && "w-full",
            className
        )} ref={dropdownRef}>
            <Typography
                variant="label"
                weight="medium"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                {filter.label}
            </Typography>
            <button
                type="button"
                onClick={(): void => setIsOpen(!isOpen)}
                className={cn(
                    "px-3 py-2 rounded-lg border transition-all",
                    "focus:outline-none focus:ring-2",
                    isMobile ? "text-sm px-2 py-1.5" : "text-base",
                    theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                    selectedLabels.length > 0 && "ring-2 ring-blue-500"
                )}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <Typography variant="body-small" color="inherit">
                    {selectedLabels.length > 0
                        ? `${selectedLabels.length} selected`
                        : "Select options..."}
                </Typography>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 overflow-y-auto",
                            isMobile ? "max-h-48" : "max-h-64",
                            theme === "dark"
                                ? "bg-gray-800 border-gray-700"
                                : "bg-white border-gray-200"
                        )}
                    >
                        {filter.options.map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    "px-3 py-2",
                                    theme === "dark"
                                        ? "hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                )}
                            >
                                <Checkbox
                                    label={`${option.label} ${option.count !== undefined ? `(${option.count})` : ""}`}
                                    checked={value.includes(option.value)}
                                    onChange={(): void => toggleOption(option.value)}
                                    size={getCheckboxSize()}
                                    variant={getCheckboxVariant()}
                                    {...(filter.checkboxProps || {})}
                                />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

SearchMultiSelectFilter.displayName = "SearchMultiSelectFilter";

export interface SearchDateRangeFilterProps {
    filter: DateRangeFilterConfig;
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
    className?: string;
}

export const SearchDateRangeFilter: React.FC<SearchDateRangeFilterProps> = ({
    filter,
    value = {},
    onChange,
    className,
}) => {
    const { theme, isMobile } = useSearch();
    const [preset, setPreset] = React.useState<DateRangePreset | undefined>(value.preset);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    // const debounceTimer = React.useRef<NodeJS.Timeout | undefined>(undefined);

    const datePickerValue = React.useMemo(() => {
        if (value.start || value.end) {
            return {
                start: value.start ? parseDate(value.start) : null,
                end: value.end ? parseDate(value.end) : null,
            };
        }
        return { start: null, end: null };
    }, [value.start, value.end]);

    const presets: DateRangePreset[] = filter.presets || ["today", "yesterday", "last7days", "last30days", "thisMonth"];

    const handlePresetChange = (newPreset: DateRangePreset): void => {
        setPreset(newPreset);
        if (newPreset !== "custom") {
            const range = getDateRangeFromPreset(newPreset);
            const newValue = {
                start: formatDate(range.start),
                end: formatDate(range.end),
                preset: newPreset,
            };

            onChange(newValue);

        } else {
            setShowDatePicker(true);
        }
    };

    const handleDatePickerChange = (range: { start: Date | null; end: Date | null } | Date | null): void => {
        let newRange: { start: Date | null; end: Date | null };

        if (range && typeof range === 'object' && 'start' in range && 'end' in range) {
            newRange = range;
        } else {
            const date = range as Date | null;
            newRange = { start: date, end: date };
        }

        const newValue: DateRangeValue = {
            start: newRange.start ? formatDate(newRange.start) : undefined,
            end: newRange.end ? formatDate(newRange.end) : undefined,
            preset: "custom",
        };

        setPreset("custom");

        onChange(newValue);

        if (newRange.start && newRange.end) {
            setTimeout(() => setShowDatePicker(false), 300);
        }
    };

    const displayText = React.useMemo(() => {
        if (value.start && value.end) {
            if (value.start === value.end) {
                return value.start;
            }
            return `${value.start} → ${value.end}`;
        }
        if (value.start) return `From ${value.start}`;
        if (value.end) return `Until ${value.end}`;
        return filter.placeholder || "Select date range";
    }, [value, filter.placeholder]);

    const datePickerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)
            ) {
                setShowDatePicker(false);
            }
        };

        if (showDatePicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return (): void => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDatePicker]);

    return (
        <div className={cn(
            "flex flex-col gap-2 relative",
            filter.fullWidthOnMobile !== false && isMobile && "w-full",
            className
        )}>
            <Typography
                variant="label"
                weight="medium"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                {filter.label}
            </Typography>

            <div className={cn(
                "flex flex-wrap gap-2 mb-2",
                isMobile && "gap-1"
            )}>
                {presets.map((p) => (
                    <button
                        key={p}
                        onClick={(): void => handlePresetChange(p)}
                        className={cn(
                            "rounded-lg transition-all whitespace-nowrap",
                            isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm",
                            preset === p
                                ? "bg-blue-500 text-white"
                                : theme === "dark"
                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        <Typography variant="caption" weight="medium" color="inherit">
                            {p === "today" && "Today"}
                            {p === "yesterday" && "Yesterday"}
                            {p === "last7days" && (isMobile ? "7d" : "Last 7 Days")}
                            {p === "last30days" && (isMobile ? "30d" : "Last 30 Days")}
                            {p === "last90days" && (isMobile ? "90d" : "Last 90 Days")}
                            {p === "thisMonth" && (isMobile ? "Month" : "This Month")}
                            {p === "lastMonth" && (isMobile ? "Last" : "Last Month")}
                        </Typography>
                    </button>
                ))}
            </div>

            <div className="relative">
                <div
                    onClick={(): void => setShowDatePicker(!showDatePicker)}
                    className={cn(
                        "px-3 py-2 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 transition-all",
                        isMobile ? "text-sm px-2 py-1.5" : "text-base",
                        theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                        preset === "custom" && "ring-2 ring-blue-500"
                    )}
                >
                    <Typography variant="body-small" color="inherit">
                        {displayText}
                    </Typography>
                </div>

                <AnimatePresence>
                    {showDatePicker && (
                        <motion.div
                            ref={datePickerRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "absolute z-50 mt-2",
                                isMobile ? "left-0 right-0" : "left-0"
                            )}
                        >
                            <DatePicker
                                variant="range"
                                value={datePickerValue}
                                onChange={handleDatePickerChange}
                                themeMode={theme}
                                colorScheme="blue"
                                format="YYYY-MM-DD"
                                placeholder={['Start date', 'End date']}
                                size={isMobile ? 'sm' : 'md'}
                                autoClose={false}
                                todayButton={true}
                                clearButton={true}
                                {...(filter.datePickerProps || {})}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

SearchDateRangeFilter.displayName = "SearchDateRangeFilter";

export interface SearchCheckboxFilterProps {
    filter: CheckboxFilterConfig;
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

export const SearchCheckboxFilter: React.FC<SearchCheckboxFilterProps> = ({
    filter,
    value = [],
    onChange,
    className,
}) => {
    const { theme, isMobile } = useSearch();

    const toggleOption = (optionValue: string, checked: boolean): void => {
        const newValue = checked
            ? [...value, optionValue]
            : value.filter(v => v !== optionValue);
        onChange(newValue);
    };

    // Fix: Add explicit return types with proper literal types
    const getCheckboxSize = (): "xs" | "sm" | "md" | "lg" | "xl" => {
        if (isMobile) return "sm";
        return "md";
    };

    const getCheckboxVariant = (): "default" | "primary" | "success" | "warning" | "danger" | "outline" | "subtle" | "glass" | "neon" => {
        if (theme === "dark") return "glass";
        return "default";
    };

    return (
        <div className={cn(
            "flex flex-col gap-2",
            filter.fullWidthOnMobile !== false && isMobile && "w-full",
            className
        )}>
            <Typography
                variant="label"
                weight="medium"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                {filter.label}
            </Typography>
            <div className={cn(
                "space-y-2",
                isMobile && "space-y-1.5"
            )}>
                {filter.options.map((option) => (
                    <Checkbox
                        key={option.value}
                        label={`${option.label} ${option.count !== undefined ? `(${option.count})` : ""}`}
                        checked={value.includes(option.value)}
                        onChange={(checked: boolean): void => toggleOption(option.value, checked)}
                        size={getCheckboxSize()}
                        variant={getCheckboxVariant()}
                        {...(filter.checkboxProps || {})}
                    />
                ))}
            </div>
        </div>
    );
};

SearchCheckboxFilter.displayName = "SearchCheckboxFilter";

export interface SearchNumericRangeFilterProps {
    filter: NumericRangeFilterConfig;
    value: NumericRangeValue;
    onChange: (value: NumericRangeValue) => void;
    className?: string;
}

export const SearchNumericRangeFilter: React.FC<SearchNumericRangeFilterProps> = ({
    filter,
    value = {},
    onChange,
    className,
}) => {
    const { theme, autoApply, isMobile } = useSearch();
    const [localMin, setLocalMin] = React.useState(value.min?.toString() || "");
    const [localMax, setLocalMax] = React.useState(value.max?.toString() || "");

    const handleChange = (field: "min" | "max", val: string): void => {
        if (field === "min") setLocalMin(val);
        else setLocalMax(val);

        if (autoApply) {
            onChange({
                min:
                    field === "min"
                        ? val
                            ? Number(val)
                            : undefined
                        : localMin
                            ? Number(localMin)
                            : undefined,
                max:
                    field === "max"
                        ? val
                            ? Number(val)
                            : undefined
                        : localMax
                            ? Number(localMax)
                            : undefined,
            });
        }
    };

    return (
        <div className={cn(
            "flex flex-col gap-2",
            filter.fullWidthOnMobile !== false && isMobile && "w-full",
            className
        )}>
            <Typography
                variant="label"
                weight="medium"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                {filter.label}
            </Typography>
            <div className={cn(
                "flex gap-2 items-center",
                isMobile && "flex-col"
            )}>
                <input
                    type="number"
                    value={localMin}
                    onChange={(e): void => handleChange("min", e.target.value)}
                    placeholder={`Min${filter.min !== undefined ? ` (${filter.min})` : ""}`}
                    step={filter.step || 1}
                    min={filter.min}
                    max={filter.max}
                    className={cn(
                        "flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2",
                        isMobile ? "text-sm px-2 py-1.5 w-full" : "text-base",
                        theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                    )}
                />
                {!isMobile && <Typography variant="body" color="muted">to</Typography>}
                <input
                    type="number"
                    value={localMax}
                    onChange={(e): void => handleChange("max", e.target.value)}
                    placeholder={`Max${filter.max !== undefined ? ` (${filter.max})` : ""}`}
                    step={filter.step || 1}
                    min={filter.min}
                    max={filter.max}
                    className={cn(
                        "flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2",
                        isMobile ? "text-sm px-2 py-1.5 w-full mt-2" : "text-base",
                        theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                    )}
                />
            </div>
        </div>
    );
};

SearchNumericRangeFilter.displayName = "SearchNumericRangeFilter";

/* ============================================
   FILTER RENDERER
============================================ */

export interface SearchFilterRendererProps {
    filter: FilterConfig;
    value: FilterValue;
    onChange: (value: FilterValue) => void;
    className?: string;
}

export const SearchFilterRenderer: React.FC<SearchFilterRendererProps> = ({
    filter,
    value,
    onChange,
    className,
}) => {
    switch (filter.type) {
        case "text":
            return <SearchTextFilter filter={filter} value={value as string || ""} onChange={onChange as (value: string) => void} className={className} />;
        case "select":
            return <SearchSelectFilter filter={filter} value={value as string || ""} onChange={onChange as (value: string) => void} className={className} />;
        case "multi-select":
            return <SearchMultiSelectFilter filter={filter} value={value as string[] || []} onChange={onChange as (value: string[]) => void} className={className} />;
        case "date-range":
            return <SearchDateRangeFilter filter={filter} value={value as DateRangeValue || {}} onChange={onChange as (value: DateRangeValue) => void} className={className} />;
        case "checkbox":
            return <SearchCheckboxFilter filter={filter} value={value as string[] || []} onChange={onChange as (value: string[]) => void} className={className} />;
        case "numeric-range":
            return <SearchNumericRangeFilter filter={filter} value={value as NumericRangeValue || {}} onChange={onChange as (value: NumericRangeValue) => void} className={className} />;
        default:
            return null;
    }
};

SearchFilterRenderer.displayName = "SearchFilterRenderer";

/* ============================================
   SUB-COMPONENTS
============================================ */

export interface SearchFiltersProps {
    children?: React.ReactNode;
    className?: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
    children,
    className,
}) => {
    const { filters, layout, activeFilters, setActiveFilters, isMobile, filtersCollapsed, setFiltersCollapsed, theme } = useSearch();

    const handleFilterChange = (filterId: string, value: FilterValue): void => {
        const newFilters = { ...activeFilters, [filterId]: value };
        setActiveFilters(newFilters);
    };

    if (layout === "collapsible" && isMobile) {
        return (
            <div className="space-y-3">
                <button
                    onClick={(): void => setFiltersCollapsed(!filtersCollapsed)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all",
                        "font-medium text-sm",
                        theme === "dark"
                            ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                >
                    <Typography variant="body-small" weight="medium" color="inherit">
                        Filter Options
                    </Typography>
                    <Typography variant="body" color="inherit">
                        {filtersCollapsed ? "▼" : "▲"}
                    </Typography>
                </button>

                <AnimatePresence>
                    {!filtersCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className={cn(
                                filterGroupVariants({ layout }),
                                "pt-2",
                                className
                            )}>
                                {children ? children : filters.map((filter) => (
                                    <SearchFilterRenderer
                                        key={filter.id}
                                        filter={filter}
                                        value={activeFilters[filter.id]}
                                        onChange={(value: FilterValue): void => handleFilterChange(filter.id, value)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className={cn(
            filterGroupVariants({ layout }),
            isMobile && "space-y-3",
            className
        )}>
            {children ? children : filters.map((filter) => (
                <SearchFilterRenderer
                    key={filter.id}
                    filter={filter}
                    value={activeFilters[filter.id]}
                    onChange={(value: FilterValue): void => handleFilterChange(filter.id, value)}
                />
            ))}
        </div>
    );
};

SearchFilters.displayName = "SearchFilters";

export interface SearchActionsProps {
    onApply?: () => void;
    onReset?: () => void;
    onSave?: () => void;
    onExport?: () => void;
    showApply?: boolean;
    showReset?: boolean;
    showSave?: boolean;
    showExport?: boolean;
    className?: string;
}

export const SearchActions: React.FC<SearchActionsProps> = ({
    onApply,
    onReset,
    onSave,
    onExport,
    showApply = true,
    showReset = true,
    showSave = true,
    showExport = true,
    className,
}) => {
    const { theme, autoApply, activeFilters, setActiveFilters, onSearch, onSaveSearch: contextOnSave, onExport: contextOnExport, isMobile } = useSearch();

    const handleApply = (): void => {
        if (onApply) onApply();
        else if (onSearch) onSearch(activeFilters);
    };

    const handleReset = (): void => {
        const resetFilters: Record<string, FilterValue> = {};
        setActiveFilters(resetFilters);
        if (onReset) onReset();
        else if (onSearch) onSearch(resetFilters);
    };

    const handleSave = (): void => {
        if (onSave) onSave();
        else if (contextOnSave) {
            const name = prompt("Enter a name for this search:");
            if (name) {
                contextOnSave({
                    id: Date.now().toString(),
                    name,
                    filters: activeFilters,
                    createdAt: new Date(),
                });
            }
        }
    };

    const EXPORT_FORMATS = ["csv", "excel", "json"] as const;
    const handleExport = (): void => {
        if (onExport) return onExport();

        if (!contextOnExport) return;

        const formatInput = prompt("Export format (csv/excel/json):", "csv");

        if (formatInput && EXPORT_FORMATS.includes(formatInput as ExportFormat)) {
            contextOnExport(activeFilters, formatInput as ExportFormat);
        }
    };

    if (!showApply && !showReset && !showSave && !showExport) return null;

    return (
        <div className={cn(
            "flex flex-wrap gap-3",
            isMobile && "gap-2",
            className
        )}>
            {showApply && !autoApply && (
                <button
                    onClick={handleApply}
                    className={cn(
                        "rounded-lg font-medium transition-all",
                        isMobile ? "px-3 py-1.5 text-sm" : "px-4 py-2",
                        "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                >
                    <Typography variant={isMobile ? "small" : "body"} weight="medium" color="inherit">
                        Apply Filters
                    </Typography>
                </button>
            )}
            {showReset && (
                <button
                    onClick={handleReset}
                    className={cn(
                        "rounded-lg font-medium transition-all",
                        isMobile ? "px-3 py-1.5 text-sm" : "px-4 py-2",
                        theme === "dark"
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                    )}
                >
                    <Typography variant={isMobile ? "small" : "body"} weight="medium" color="inherit">
                        Reset
                    </Typography>
                </button>
            )}
            {showSave && (
                <button
                    onClick={handleSave}
                    className={cn(
                        "rounded-lg font-medium transition-all",
                        isMobile ? "px-3 py-1.5 text-sm" : "px-4 py-2",
                        theme === "dark"
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                    )}
                >
                    <Typography variant={isMobile ? "small" : "body"} weight="medium" color="inherit">
                        Save Search
                    </Typography>
                </button>
            )}
            {showExport && (
                <button
                    onClick={handleExport}
                    className={cn(
                        "rounded-lg font-medium transition-all",
                        isMobile ? "px-3 py-1.5 text-sm" : "px-4 py-2",
                        theme === "dark"
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                    )}
                >
                    <Typography variant={isMobile ? "small" : "body"} weight="medium" color="inherit">
                        Export
                    </Typography>
                </button>
            )}
        </div>
    );
};

SearchActions.displayName = "SearchActions";

export interface SearchSavedSearchesProps {
    searches?: SavedSearch[];
    onApply?: (search: SavedSearch) => void;
    onDelete?: (searchId: string) => void;
    className?: string;
}

export const SearchSavedSearches: React.FC<SearchSavedSearchesProps> = ({
    searches: propSearches,
    onApply,
    onDelete,
    className,
}) => {
    const { theme, savedSearches: contextSearches, setActiveFilters, onSearch, isMobile } = useSearch();
    const searches = propSearches || contextSearches || [];

    const handleApply = (search: SavedSearch): void => {
        if (onApply) onApply(search);
        else {
            setActiveFilters(search.filters);
            if (onSearch) onSearch(search.filters);
        }
    };

    const handleDelete = (searchId: string): void => {
        if (onDelete) onDelete(searchId);
    };

    if (searches.length === 0) return null;

    return (
        <div className={cn("space-y-2", className)}>
            <Typography
                variant="label"
                weight="medium"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                Saved Searches
            </Typography>
            <div className={cn(
                "space-y-1 my-3",
                isMobile && "space-y-2"
            )}>
                {searches.map((search) => (
                    <div
                        key={search.id}
                        className={cn(
                            "flex items-center justify-between rounded-lg transition-colors",
                            isMobile ? "p-2" : "p-2",
                            theme === "dark"
                                ? "bg-gray-800 hover:bg-gray-700"
                                : "bg-gray-50 hover:bg-gray-100"
                        )}
                    >
                        <button
                            onClick={(): void => handleApply(search)}
                            className="flex-1 text-left"
                        >
                            <Typography variant="body-small" color={theme === "dark" ? "secondary" : "default"}>
                                {search.name}
                            </Typography>
                        </button>
                        {onDelete && (
                            <button
                                onClick={(): void => handleDelete(search.id)}
                                className={cn(
                                    "ml-2 p-1 rounded transition-colors",
                                    isMobile ? "text-lg" : "text-base",
                                    theme === "dark"
                                        ? "text-gray-500 hover:text-red-400"
                                        : "text-gray-400 hover:text-red-500"
                                )}
                                aria-label={`Delete ${search.name}`}
                            >
                                <Typography variant="body" color="inherit">
                                    ×
                                </Typography>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

SearchSavedSearches.displayName = "SearchSavedSearches";

export interface SearchFacetedHintsProps {
    categories?: FacetedCategory[];
    onSelect?: (categoryId: string, value: string) => void;
    className?: string;
}

export const SearchFacetedHints: React.FC<SearchFacetedHintsProps> = ({
    categories: propCategories,
    className,
}) => {
    const { theme, facetedCategories: contextCategories, activeFilters, setActiveFilters, isMobile } = useSearch();
    const categories = propCategories || contextCategories || [];

    const handleSelect = (categoryId: string, value: string): void => {
        const newFilters = { ...activeFilters, [categoryId]: [value] };
        setActiveFilters(newFilters);
    };

    if (categories.length === 0) return null;

    return (
        <div className={cn("space-y-3", className)}>
            <Typography
                variant="label"
                weight="medium"
                color={theme === "dark" ? "secondary" : "default"}
                className={isMobile ? "text-xs" : ""}
            >
                Refine by
            </Typography>
            {categories.map((category) => (
                <div key={category.id} className="space-y-1 my-3">
                    <Typography
                        variant="caption"
                        weight="semibold"
                        color="muted"
                        className={isMobile ? "text-xs" : ""}
                    >
                        {category.label}
                    </Typography>
                    <div className={cn(
                        "flex flex-wrap gap-2 my-2",
                        isMobile && "gap-1.5"
                    )}>
                        {category.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={(): void => handleSelect(category.id, option.value)}
                                className={cn(
                                    "rounded-full transition-all whitespace-nowrap",
                                    isMobile ? "px-2 py-1 text-xs" : "px-2.5 py-1 text-xs",
                                    theme === "dark"
                                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                <Typography variant="caption" weight="medium" color="inherit">
                                    {option.label}
                                    {option.count !== undefined && (
                                        <span className="ml-1 opacity-75">({option.count})</span>
                                    )}
                                </Typography>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

SearchFacetedHints.displayName = "SearchFacetedHints";

export interface SearchResultsCountProps {
    count?: number;
    total?: number;
    className?: string;
}

export const SearchResultsCount: React.FC<SearchResultsCountProps> = ({
    count: propCount,
    total: propTotal,
    className,
}) => {
    const { resultsCount, totalResults, isMobile } = useSearch();
    const count = propCount !== undefined ? propCount : resultsCount;
    const total = propTotal !== undefined ? propTotal : totalResults;

    if (count === undefined) return null;

    return (
        <Typography
            variant={isMobile ? "caption" : "body-small"}
            color="muted"
            className={className}
        >
            Showing {count.toLocaleString()} results
            {total !== undefined && total !== count && ` of ${total.toLocaleString()}`}
        </Typography>
    );
};

SearchResultsCount.displayName = "SearchResultsCount";

/* ============================================
   MAIN COMPONENT
============================================ */

export const AdvancedSearchFormRoot: React.FC<AdvancedSearchFormProps> = ({
    variant = "default",
    layout = "stacked",
    filters = [],
    facetedCategories,
    onSearch,
    onExport,
    onSaveSearch,
    onDeleteSearch,
    initialFilters = {},
    savedSearches = [],
    resultsCount,
    totalResults,
    autoApply = false,
    debounceMs = 300,
    showExport = true,
    showSaveSearch = true,
    showReset = true,
    showFaceted = true,
    showResultsCount = true,
    className,
    children,
    ariaLabel = "Advanced search form",
    mobileBreakpoint = 768,
    tabletBreakpoint = 1024,
    defaultCollapsedOnMobile = true,
}) => {
    const [activeFilters, setActiveFilters] = React.useState<Record<string, FilterValue>>(initialFilters);
    const [filtersCollapsed, setFiltersCollapsed] = React.useState(defaultCollapsedOnMobile);
    const theme: "light" | "dark" = variant === "dark" ? "dark" : "light";
    const { isMobile, isTablet, isDesktop } = useResponsive(mobileBreakpoint, tabletBreakpoint);

    React.useEffect(() => {
        if (autoApply && onSearch) {
            const timer = setTimeout(() => {
                onSearch(activeFilters);
            }, debounceMs);
            return (): void => clearTimeout(timer);
        }
    }, [activeFilters, autoApply, debounceMs, onSearch]);

    React.useEffect(() => {
        if (!isMobile) {
            setFiltersCollapsed(false);
        } else if (defaultCollapsedOnMobile) {
            setFiltersCollapsed(true);
        }
    }, [isMobile, defaultCollapsedOnMobile]);

    const contextValue: SearchContextType = {
        variant,
        layout,
        filters,
        activeFilters,
        setActiveFilters,
        onSearch,
        autoApply,
        debounceMs,
        theme,
        isMobile,
        isTablet,
        isDesktop,
        filtersCollapsed,
        setFiltersCollapsed,
        resultsCount,
        totalResults,
        savedSearches,
        onSaveSearch,
        facetedCategories,
        onExport,
    };

    const hasFaceted = showFaceted && (facetedCategories?.length || (filters as FilterConfig[]).some(f => f.type === "checkbox"));

    return (
        <SearchContext.Provider value={contextValue}>
            <div
                className={cn(
                    searchContainerVariants({ variant, layout }),
                    "rounded-lg",
                    isMobile ? "p-4" : isTablet ? "p-5" : "p-6",
                    className
                )}
                aria-label={ariaLabel}
                role="search"
            >
                <div className={cn(
                    "space-y-6",
                    isMobile && "space-y-4"
                )}>
                    {children ? (
                        children
                    ) : (
                        <>
                            <SearchFilters />
                            <div className={cn(
                                "flex flex-wrap justify-between items-start gap-4",
                                isMobile && "flex-col-reverse gap-3"
                            )}>
                                <SearchActions
                                    showApply={!autoApply}
                                    showReset={showReset}
                                    showSave={showSaveSearch}
                                    showExport={showExport}
                                />
                                {showResultsCount && (
                                    <SearchResultsCount count={resultsCount} total={totalResults} />
                                )}
                            </div>
                            {savedSearches.length > 0 && <SearchSavedSearches searches={savedSearches} onDelete={onDeleteSearch} />}
                            {hasFaceted && <SearchFacetedHints categories={facetedCategories} />}
                        </>
                    )}
                </div>
            </div>
        </SearchContext.Provider>
    );
};

AdvancedSearchFormRoot.displayName = "AdvancedSearchForm";

/* ============================================
   EXPORTS
============================================ */

export const AdvancedSearchForm = Object.assign(AdvancedSearchFormRoot, {
    Filters: SearchFilters,
    Actions: SearchActions,
    SavedSearches: SearchSavedSearches,
    FacetedHints: SearchFacetedHints,
    ResultsCount: SearchResultsCount,
    TextFilter: SearchTextFilter,
    SelectFilter: SearchSelectFilter,
    MultiSelectFilter: SearchMultiSelectFilter,
    DateRangeFilter: SearchDateRangeFilter,
    CheckboxFilter: SearchCheckboxFilter,
    NumericRangeFilter: SearchNumericRangeFilter,
    FilterRenderer: SearchFilterRenderer,
});

export default AdvancedSearchForm;
