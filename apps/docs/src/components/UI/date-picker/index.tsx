
'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Typography } from '../typography';
import { Button } from '../button';

// ========== TYPES ==========
export type DateFormat =
    | 'MM/DD/YYYY'
    | 'DD/MM/YYYY'
    | 'YYYY-MM-DD'
    | 'MMM DD, YYYY'
    | 'DD MMM YYYY'
    | 'YYYY/MM/DD';

export type DatePickerVariant = 'single' | 'range';
export type DatePickerSize = 'sm' | 'md' | 'lg' | 'xl';
export type PopupPosition =
    | 'bottom-left'
    | 'bottom-right'
    | 'top-left'
    | 'top-right'
    | 'left'
    | 'right';

export type ThemeMode = 'light' | 'dark';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'slate' | 'rose';

export interface DateRange {
    start: Date | null;
    end: Date | null;
}

export interface DatePickerProps {
    // Core props
    value?: Date | DateRange | null;
    onChange?: (date: Date | DateRange | null) => void;
    onError?: (error: string | null) => void;

    // Configuration
    variant?: DatePickerVariant;
    placeholder?: string | [string, string];
    format?: DateFormat;
    size?: DatePickerSize;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    highlightDates?: Date[];
    allowEmpty?: boolean;
    todayButton?: boolean;
    clearButton?: boolean;
    autoClose?: boolean;

    // Styling & UI
    className?: string;
    inputClassName?: string;
    calendarClassName?: string;
    themeMode?: ThemeMode;
    colorScheme?: ColorScheme;
    popupPosition?: PopupPosition;
    showIcon?: boolean;
    icon?: React.ReactNode;

    // Validation & Error
    error?: boolean;
    errorMessage?: string;
    validateOnChange?: boolean;

    // Labels & Internationalization
    label?: string;
    helperText?: string;
    weekStart?: 0 | 1;
    monthNames?: string[];
    dayNames?: string[];
    todayText?: string;
    clearText?: string;
}

export interface RangeInputFieldProps {
    startRef: React.Ref<HTMLInputElement>;
    endRef: React.Ref<HTMLInputElement>;
    startValue: string;
    endValue: string;
    onStartChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEndChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: [string, string] | string;
    themeMode: ThemeMode;
    disabled?: boolean;
    readOnly?: boolean;
    showIcon?: boolean;
    icon?: React.ReactNode;
    onFocus?: () => void;
}

export interface CalendarViewProps {
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    selectedDate: Date | null;
    selectedRange: DateRange;
    onDateSelect: (date: Date) => void;
    themeMode: ThemeMode;
    colorScheme: ColorScheme;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    highlightDates?: Date[];
    todayButton?: boolean;
    clearButton?: boolean;
    onTodayClick: () => void;
    onClearClick: () => void;
    weekStart?: 0 | 1;
    monthNames?: string[];
    dayNames?: string[];
    todayText?: string;
    clearText?: string;
}

export interface InputFieldProps {
    ref: React.Ref<HTMLInputElement>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    themeMode: ThemeMode;
    disabled?: boolean;
    readOnly?: boolean;
    showIcon?: boolean;
    icon?: React.ReactNode;
    onFocus?: () => void;
}

export interface ColorSchemeStyles {
    primary: {
        light: string;
        dark: string;
    };
    secondary: {
        light: string;
        dark: string;
    };
    accent: {
        light: string;
        dark: string;
    };
    border: {
        light: string;
        dark: string;
    };
    button: {
        light: string;
        dark: string;
    };
    ring: {
        light: string;
        dark: string;
    };
}

export interface ThemeModeStyles {
    bg: {
        input: string;
        calendar: string;
        disabled: string;
    };
    text: {
        primary: string;
        secondary: string;
        muted: string;
        disabled: string;
    };
    border: string;
    hover: string;
    calendar: string;
    weekday: string;
    day: {
        current: string;
        nonCurrent: string;
    };
    header: string;
    footer: string;
    placeholder: string;
}

export type IconProps = {
    className?: string;
    [key: string]: unknown;
};

// ========== CONSTANTS ==========
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// const DATE_FORMATS = {
//     'MM/DD/YYYY': 'MM/DD/YYYY',
//     'DD/MM/YYYY': 'DD/MM/YYYY',
//     'YYYY-MM-DD': 'YYYY-MM-DD',
//     'MMM DD, YYYY': 'MMM DD, YYYY',
//     'DD MMM YYYY': 'DD MMM YYYY',
//     'YYYY/MM/DD': 'YYYY/MM/DD',
// } as const;

const COLOR_SCHEMES: Record<ColorScheme, ColorSchemeStyles> = {
    blue: {
        primary: {
            light: 'from-blue-600 to-blue-700',
            dark: 'from-blue-500 to-blue-600',
        },
        secondary: {
            light: 'from-blue-50 to-blue-100',
            dark: 'from-blue-900/40 to-blue-800/40',
        },
        accent: {
            light: 'bg-blue-100 text-blue-800 ring-1 ring-blue-300',
            dark: 'bg-blue-900/40 text-blue-200 ring-1 ring-blue-700',
        },
        border: {
            light: 'border-blue-200',
            dark: 'border-blue-800',
        },
        button: {
            light: 'text-blue-700 hover:bg-blue-50',
            dark: 'text-blue-400 hover:bg-blue-900/30',
        },
        ring: {
            light: 'focus-within:ring-2 focus-within:ring-blue-500/30',
            dark: 'focus-within:ring-2 focus-within:ring-blue-500/40',
        },
    },
    green: {
        primary: {
            light: 'from-emerald-600 to-teal-600',
            dark: 'from-emerald-500 to-teal-500',
        },
        secondary: {
            light: 'from-emerald-50 to-teal-50',
            dark: 'from-emerald-900/40 to-teal-900/40',
        },
        accent: {
            light: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300',
            dark: 'bg-emerald-900/40 text-emerald-200 ring-1 ring-emerald-700',
        },
        border: {
            light: 'border-emerald-200',
            dark: 'border-emerald-800',
        },
        button: {
            light: 'text-emerald-700 hover:bg-emerald-50',
            dark: 'text-emerald-400 hover:bg-emerald-900/30',
        },
        ring: {
            light: 'focus-within:ring-2 focus-within:ring-emerald-500/30',
            dark: 'focus-within:ring-2 focus-within:ring-emerald-500/40',
        },
    },
    purple: {
        primary: {
            light: 'from-violet-600 to-purple-600',
            dark: 'from-violet-500 to-purple-500',
        },
        secondary: {
            light: 'from-violet-50 to-purple-50',
            dark: 'from-violet-900/40 to-purple-900/40',
        },
        accent: {
            light: 'bg-violet-100 text-violet-800 ring-1 ring-violet-300',
            dark: 'bg-violet-900/40 text-violet-200 ring-1 ring-violet-700',
        },
        border: {
            light: 'border-violet-200',
            dark: 'border-violet-800',
        },
        button: {
            light: 'text-violet-700 hover:bg-violet-50',
            dark: 'text-violet-400 hover:bg-violet-900/30',
        },
        ring: {
            light: 'focus-within:ring-2 focus-within:ring-violet-500/30',
            dark: 'focus-within:ring-2 focus-within:ring-violet-500/40',
        },
    },
    orange: {
        primary: {
            light: 'from-orange-600 to-amber-600',
            dark: 'from-orange-500 to-amber-500',
        },
        secondary: {
            light: 'from-orange-50 to-amber-50',
            dark: 'from-orange-900/40 to-amber-900/40',
        },
        accent: {
            light: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300',
            dark: 'bg-orange-900/40 text-orange-200 ring-1 ring-orange-700',
        },
        border: {
            light: 'border-orange-200',
            dark: 'border-orange-800',
        },
        button: {
            light: 'text-orange-700 hover:bg-orange-50',
            dark: 'text-orange-400 hover:bg-orange-900/30',
        },
        ring: {
            light: 'focus-within:ring-2 focus-within:ring-orange-500/30',
            dark: 'focus-within:ring-2 focus-within:ring-orange-500/40',
        },
    },
    slate: {
        primary: {
            light: 'from-slate-800 to-slate-900',
            dark: 'from-slate-700 to-slate-800',
        },
        secondary: {
            light: 'from-slate-100 to-slate-200',
            dark: 'from-slate-800/40 to-slate-900/40',
        },
        accent: {
            light: 'bg-slate-200 text-slate-800 ring-1 ring-slate-400',
            dark: 'bg-slate-800/40 text-slate-200 ring-1 ring-slate-700',
        },
        border: {
            light: 'border-slate-300',
            dark: 'border-slate-700',
        },
        button: {
            light: 'text-slate-700 hover:bg-slate-100',
            dark: 'text-slate-400 hover:bg-slate-800/30',
        },
        ring: {
            light: 'focus-within:ring-2 focus-within:ring-slate-500/30',
            dark: 'focus-within:ring-2 focus-within:ring-slate-500/40',
        },
    },
    rose: {
        primary: {
            light: 'from-rose-600 to-pink-600',
            dark: 'from-rose-500 to-pink-500',
        },
        secondary: {
            light: 'from-rose-50 to-pink-50',
            dark: 'from-rose-900/40 to-pink-900/40',
        },
        accent: {
            light: 'bg-rose-100 text-rose-800 ring-1 ring-rose-300',
            dark: 'bg-rose-900/40 text-rose-200 ring-1 ring-rose-700',
        },
        border: {
            light: 'border-rose-200',
            dark: 'border-rose-800',
        },
        button: {
            light: 'text-rose-700 hover:bg-rose-50',
            dark: 'text-rose-400 hover:bg-rose-900/30',
        },
        ring: {
            light: 'focus-within:ring-2 focus-within:ring-rose-500/30',
            dark: 'focus-within:ring-2 focus-within:ring-rose-500/40',
        },
    },
};

const THEME_MODES: Record<ThemeMode, ThemeModeStyles> = {
    light: {
        bg: {
            input: 'bg-white',
            calendar: 'bg-white',
            disabled: 'bg-gray-100',
        },
        text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            muted: 'text-gray-500',
            disabled: 'text-gray-400',
        },
        border: 'border-gray-200',
        hover: 'hover:bg-gray-50',
        calendar: 'shadow-xl border-gray-200 bg-white',
        weekday: 'text-gray-600',
        day: {
            current: 'text-gray-800',
            nonCurrent: 'text-gray-500',
        },
        header: 'text-gray-900',
        footer: 'border-gray-200',
        placeholder: 'placeholder:text-gray-500',
    },
    dark: {
        bg: {
            input: 'bg-gray-900',
            calendar: 'bg-gray-900',
            disabled: 'bg-gray-800',
        },
        text: {
            primary: 'text-gray-100',
            secondary: 'text-gray-300',
            muted: 'text-gray-400',
            disabled: 'text-gray-600',
        },
        border: 'border-gray-700',
        hover: 'hover:bg-gray-800',
        calendar: 'shadow-2xl border-gray-700 bg-gray-900',
        weekday: 'text-gray-400',
        day: {
            current: 'text-gray-200',
            nonCurrent: 'text-gray-500',
        },
        header: 'text-gray-100',
        footer: 'border-gray-800',
        placeholder: 'placeholder:text-gray-500',
    },
};

// ========== UTILS ==========
/**
 * Formats a date object into a specified string format
 */
const formatDate = (date: Date | null, format: DateFormat): string => {
    if (!date) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthName = MONTH_NAMES[date.getMonth()]?.slice(0, 3) || '';

    switch (format) {
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'MMM DD, YYYY':
            return `${monthName} ${day}, ${year}`;
        case 'DD MMM YYYY':
            return `${day} ${monthName} ${year}`;
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}`;
        default:
            return date.toLocaleDateString();
    }
};

/**
 * Parses a date string into a Date object based on specified format
 */
const parseDate = (str: string, format: DateFormat): Date | null => {
    if (!str) return null;

    try {
        let day, month, year;

        switch (format) {
            case 'MM/DD/YYYY':
                [month, day, year] = str.split('/').map(Number);
                break;
            case 'DD/MM/YYYY':
                [day, month, year] = str.split('/').map(Number);
                break;
            case 'YYYY-MM-DD':
                [year, month, day] = str.split('-').map(Number);
                break;
            case 'YYYY/MM/DD':
                [year, month, day] = str.split('/').map(Number);
                break;
            case 'MMM DD, YYYY': {
                const parts = str.split(' ');
                month = MONTH_NAMES.findIndex(m => m.startsWith(parts[0])) + 1;
                day = parseInt(parts[1]);
                year = parseInt(parts[2]);
                break;
            }
            case 'DD MMM YYYY': {
                const parts2 = str.split(' ');
                day = parseInt(parts2[0]);
                month = MONTH_NAMES.findIndex(m => m.startsWith(parts2[1])) + 1;
                year = parseInt(parts2[2]);
                break;
            }
        }

        const date = new Date(year!, month! - 1, day!);
        return date.toString() !== 'Invalid Date' ? date : null;
    } catch {
        return null;
    }
};

/**
 * Compares two dates to check if they represent the same calendar day
 */
const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};

/**
 * Checks if a date falls within a specified range (inclusive)
 */
const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    return date >= start && date <= end;
};

/**
 * Determines if a date should be disabled based on various constraints
 */
const isDateDisabled = (
    date: Date,
    minDate?: Date,
    maxDate?: Date,
    disabledDates?: Date[]
): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disabledDates?.some(d => isSameDay(d, date))) return true;
    return false;
};

/**
 * Generates an array of Date objects representing a calendar month view
 */
const getDaysInMonth = (date: Date, weekStart: 0 | 1 = 0): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];
    const startDay = firstDay.getDay();
    const offset = weekStart === 1 ? (startDay === 0 ? 6 : startDay - 1) : startDay;

    // Previous month days
    for (let i = offset - 1; i >= 0; i--) {
        const day = new Date(year, month, -i);
        days.push(day);
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push(new Date(year, month + 1, i));
    }

    return days;
};

/**
 * Retrieves theme-specific styles for the application
 */
const getThemeStyles = (themeMode: ThemeMode): ThemeModeStyles => THEME_MODES[themeMode] as ThemeModeStyles;

/**
 * Retrieves color scheme-specific styles for the application
 */
const getColorStyles = (colorScheme: ColorScheme): ColorSchemeStyles => COLOR_SCHEMES[colorScheme] as ColorSchemeStyles;

/**
 * Generates CSS classes for date range highlighting with appropriate opacity
 */
const getInRangeStyle = (themeMode: ThemeMode, colorScheme: ColorScheme): string => {
    const scheme = COLOR_SCHEMES[colorScheme];
    if (themeMode === 'light') {
        return scheme.accent.light.replace('bg-', 'bg-opacity-30 bg-');
    } else {
        return scheme.accent.dark.replace('bg-', 'bg-opacity-30 bg-');
    }
};

/**
 * Determines CSS classes for positioning a popup relative to its trigger element
 */
const getPopupPositionClasses = (position: string): string => {
    const positions: Record<string, string> = {
        'bottom-left': 'top-full left-0 mt-2',
        'bottom-right': 'top-full right-0 mt-2',
        'top-left': 'bottom-full left-0 mb-2',
        'top-right': 'bottom-full right-0 mb-2',
        'left': 'right-full top-0 mr-2',
        'right': 'left-full top-0 ml-2',
    };
    return positions[position] || positions['bottom-left'];
};

// ========== VARIANTS ==========
const inputVariants = {
    base: 'flex items-center gap-2 px-4 border rounded-lg transition-all duration-300 focus-within:shadow-sm',
    sizes: {
        sm: 'h-9 text-sm px-3',
        md: 'h-11 text-base',
        lg: 'h-13 text-lg',
        xl: 'h-15 text-xl',
    },
    error: {
        true: 'border-red-400 focus-within:ring-2 focus-within:ring-red-500/20 dark:focus-within:ring-red-500/30',
        false: '',
    },
    disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
    }
};

// ========== COMPONENTS ==========
const isReactElementWithProps = (
    element: React.ReactNode
): element is React.ReactElement<{ className?: string }> => {
    return React.isValidElement(element);
};

const isIconElement = (node: React.ReactNode): node is React.ReactElement<IconProps> => {
    return React.isValidElement(node);
};

/**
 * InputField component for single date selection
 */
const InputField: React.FC<InputFieldProps> = ({
    ref,
    value,
    onChange,
    placeholder,
    themeMode,
    disabled,
    readOnly,
    showIcon = true,
    icon,
    onFocus,
}) => {
    const themeStyles = getThemeStyles(themeMode);
    const themedIcon = React.useMemo(() => {
        if (!showIcon) return null;

        if (isReactElementWithProps(icon)) {
            return React.cloneElement(icon, {
                ...icon.props,
                className: cn(
                    icon.props.className,
                    themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400'
                )
            });
        }

        return <Calendar className={cn("w-4 h-4", themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400')} />;
    }, [showIcon, icon, themeMode]);

    return (
        <div className="relative flex-1">
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    "w-full bg-transparent outline-none font-medium tracking-wide",
                    themeStyles.text.primary,
                    themeStyles.placeholder,
                    disabled && "cursor-not-allowed",
                    readOnly && "cursor-default"
                )}
                disabled={disabled}
                readOnly={readOnly}
                onFocus={onFocus}
            />
            {showIcon && (
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                    {themedIcon}
                </motion.div>
            )}
        </div>
    );
};

/**
 * RangeInputField component for date range selection
 */
const RangeInputField: React.FC<RangeInputFieldProps> = ({
    startRef,
    endRef,
    startValue,
    endValue,
    onStartChange,
    onEndChange,
    placeholder,
    themeMode,
    disabled,
    readOnly,
    showIcon = true,
    icon,
    onFocus,
}) => {
    const themeStyles = getThemeStyles(themeMode);
    const themedIcon = React.useMemo(() => {
        if (!showIcon) return null;

        if (isIconElement(icon)) {
            return React.cloneElement(icon, {
                ...icon.props,
                className: cn(
                    icon.props.className,
                    themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400'
                )
            });
        }

        return <Calendar className={cn("w-4 h-4", themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400')} />;
    }, [showIcon, icon, themeMode]);

    return (
        <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1">
                <input
                    ref={startRef}
                    type="text"
                    value={startValue}
                    onChange={onStartChange}
                    placeholder={Array.isArray(placeholder) ? placeholder[0] : 'Start date'}
                    className={cn(
                        "w-full bg-transparent outline-none font-medium tracking-wide",
                        themeStyles.text.primary,
                        themeStyles.placeholder,
                        disabled && "cursor-not-allowed",
                        readOnly && "cursor-default"
                    )}
                    disabled={disabled}
                    readOnly={readOnly}
                    onFocus={onFocus}
                />
            </div>

            <Typography
                variant="body"
                className={themeStyles.text.muted}
            >
                –
            </Typography>

            <div className="relative flex-1">
                <input
                    ref={endRef}
                    type="text"
                    value={endValue}
                    onChange={onEndChange}
                    placeholder={Array.isArray(placeholder) ? placeholder[1] : 'End date'}
                    className={cn(
                        "w-full bg-transparent outline-none font-medium tracking-wide",
                        themeStyles.text.primary,
                        themeStyles.placeholder,
                        disabled && "cursor-not-allowed",
                        readOnly && "cursor-default"
                    )}
                    disabled={disabled}
                    readOnly={readOnly}
                    onFocus={onFocus}
                />
                {showIcon && (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        {themedIcon}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

/**
 * CalendarView component - The main calendar grid UI
 */
const CalendarView: React.FC<CalendarViewProps> = ({
    currentMonth,
    onMonthChange,
    selectedDate,
    selectedRange,
    onDateSelect,
    themeMode = 'light',
    colorScheme = 'blue',
    minDate,
    maxDate,
    disabledDates,
    highlightDates,
    todayButton = true,
    clearButton = true,
    onTodayClick,
    onClearClick,
    weekStart = 0,
    monthNames = MONTH_NAMES,
    dayNames = DAY_NAMES,
    todayText = 'Today',
    clearText = 'Clear',
}) => {
    const themeStyles = getThemeStyles(themeMode);
    const colorStyles = getColorStyles(colorScheme);
    const days = getDaysInMonth(currentMonth, weekStart);
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentYear, currentMonthIndex - 1, 1);
        onMonthChange(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentYear, currentMonthIndex + 1, 1);
        onMonthChange(nextMonth);
    };

    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentMonthIndex;
    };

    const getDayName = (index: number): string => {
        const adjustedIndex = weekStart === 1 ? (index === 6 ? 0 : index + 1) : index;
        return dayNames[adjustedIndex] || DAY_NAMES[adjustedIndex];
    };

    return (
        <div className={cn(
            "w-80 p-5 rounded-2xl shadow-xl border",
            themeStyles.calendar,
            colorStyles.border[themeMode]
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className={cn(
                        "rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
                        colorStyles.button[themeMode]
                    )}
                    aria-label="Previous month"
                    animationVariant="press3DSoft"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <Typography
                        variant="h6"
                        weight="bold"
                        className={cn("tracking-tight", themeStyles.header)}
                    >
                        {monthNames[currentMonthIndex]} {currentYear}
                    </Typography>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className={cn(
                        "rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
                        colorStyles.button[themeMode]
                    )}
                    aria-label="Next month"
                    animationVariant="press3DSoft"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-2 mb-3">
                {Array.from({ length: 7 }).map((_, index) => (
                    <Typography
                        key={index}
                        variant="caption"
                        weight="semibold"
                        align="center"
                        className={cn("py-2 tracking-wide", themeStyles.weekday)}
                    >
                        {getDayName(index)}
                    </Typography>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isInRange = isDateInRange(date, selectedRange.start, selectedRange.end);
                    const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);
                    const isHighlighted = highlightDates?.some(d => isSameDay(d, date));
                    const isToday = isSameDay(date, new Date());

                    const isStart = selectedRange.start && isSameDay(date, selectedRange.start);
                    const isEnd = selectedRange.end && isSameDay(date, selectedRange.end);
                    const isCurrent = isCurrentMonth(date);

                    return (
                        <motion.div
                            key={index}
                            className="relative"
                            whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => !isDisabled && onDateSelect(date)}
                                disabled={isDisabled}
                                className={cn(
                                    "h-11 w-11 rounded-xl text-sm font-medium transition-all duration-300 relative cursor-pointer",
                                    !isCurrent && "opacity-40",
                                    isDisabled && cn("cursor-not-allowed opacity-20", themeStyles.text.disabled),

                                    // Range styling
                                    isInRange && !isStart && !isEnd && cn(
                                        getInRangeStyle(themeMode, colorScheme),
                                        "rounded-xl"
                                    ),
                                    isStart && cn("rounded-l-xl bg-gradient-to-r", colorStyles.primary[themeMode], "text-white shadow-sm"),
                                    isEnd && cn("rounded-r-xl bg-gradient-to-r", colorStyles.primary[themeMode], "text-white shadow-sm"),

                                    // Single date selection
                                    isSelected && !isStart && !isEnd && cn("bg-gradient-to-r", colorStyles.primary[themeMode], "text-white shadow-sm"),

                                    // Today
                                    isToday && !isSelected && !isInRange && cn(colorStyles.accent[themeMode]),

                                    // Highlighted dates
                                    isHighlighted && !isSelected && !isInRange && "ring-2 ring-yellow-400 shadow-sm",

                                    // Default hover
                                    !isSelected && !isInRange && !isDisabled && cn(
                                        "hover:bg-opacity-50",
                                        themeStyles.hover
                                    ),

                                    // Base styling
                                    "shadow-sm"
                                )}
                                aria-label={`Select ${date.toLocaleDateString()}`}
                                animationVariant={isDisabled ? undefined : "press3DSoft"}
                            >
                                <Typography
                                    variant="body-small"
                                    weight={(isSelected || isStart || isEnd) ? "bold" : "normal"}
                                    className={cn(
                                        "relative z-10",
                                        (isSelected || isStart || isEnd) && "!text-white",
                                        !isSelected && !isStart && !isEnd && isCurrent
                                            ? themeStyles.day.current
                                            : themeStyles.day.nonCurrent
                                    )}
                                >
                                    {date.getDate()}
                                </Typography>

                                {/* Range indicators */}
                                {isStart && selectedRange.end && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '50%' }}
                                        className="absolute inset-y-0 right-0 h-full bg-gradient-to-l from-white/20 to-transparent rounded-r-xl"
                                    />
                                )}
                                {isEnd && selectedRange.start && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '50%' }}
                                        className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-white/20 to-transparent rounded-l-xl"
                                    />
                                )}

                                {/* Today indicator dot */}
                                {isToday && !isSelected && !isInRange && (
                                    <div className={cn(
                                        "absolute -top-1 right-1 w-1.5 h-1.5 rounded-full opacity-60",
                                        themeMode === 'dark' ? 'bg-blue-300' : 'bg-blue-500'
                                    )} />
                                )}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer buttons */}
            {(todayButton || clearButton) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3 mt-6 pt-5 border-t", themeStyles.footer)}
                >
                    {todayButton && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onTodayClick}
                            className="flex-1 rounded-xl shadow-sm hover:shadow text-slate-500 cursor-pointer"
                            animationVariant="press3DSoft"
                        >
                            <Typography variant="body-small" weight="medium">
                                {todayText}
                            </Typography>
                        </Button>
                    )}
                    {clearButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearClick}
                            className={cn(
                                "flex-1 rounded-xl shadow-sm hover:shadow cursor-pointer",
                                themeMode === 'dark'
                                    ? "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300"
                                    : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600"
                            )}
                            animationVariant="press3DSoft"
                        >
                            <Typography variant="body-small" weight="medium">
                                {clearText}
                            </Typography>
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

// ========== MAIN DATEPICKER COMPONENT ==========
/**
 * A versatile DatePicker component supporting single dates and date ranges
 * @example
 * // Single date picker
 * <DatePicker value={date} onChange={setDate} />
 * 
 * // Date range picker
 * <DatePicker variant="range" value={range} onChange={setRange} />
 */
const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
    (
        {
            value,
            onChange,
            onError,
            variant = 'single',
            placeholder = 'Select date',
            format = 'MM/DD/YYYY',
            size = 'md',
            disabled = false,
            readOnly = false,
            required = false,
            minDate,
            maxDate,
            disabledDates,
            highlightDates,
            allowEmpty = false,
            todayButton = true,
            clearButton = true,
            autoClose = false,
            className,
            inputClassName,
            calendarClassName,
            themeMode = 'light',
            colorScheme = 'blue',
            popupPosition = 'bottom-left',
            showIcon = true,
            icon = <Calendar className="w-4 h-4" />,
            error = false,
            errorMessage,
            validateOnChange = true,
            label,
            helperText,
            weekStart = 0,
            monthNames = MONTH_NAMES,
            dayNames = DAY_NAMES,
            todayText = 'Today',
            clearText = 'Clear',
            ...props
        },
        ref
    ) => {
        const isDate = (value: unknown): value is Date => {
            return value instanceof Date;
        };

        const isDateRange = (value: unknown): value is DateRange => {
            return (
                typeof value === 'object' &&
                value !== null &&
                'start' in value &&
                'end' in value
            );
        };

        const [isOpen, setIsOpen] = useState(false);
        const [selectedDate, setSelectedDate] = useState<Date | null>(null);
        const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const [inputValue, setInputValue] = useState('');
        const [rangeInputValue, setRangeInputValue] = useState<[string, string]>(['', '']);
        const [internalError, setInternalError] = useState<string | null>(null);

        const containerRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);
        const startInputRef = useRef<HTMLInputElement>(null);
        const endInputRef = useRef<HTMLInputElement>(null);

        const themeStyles = getThemeStyles(themeMode);
        const colorStyles = getColorStyles(colorScheme);

        useEffect(() => {
            if (variant === 'single' && isDate(value)) {
                setSelectedDate(value);
                setInputValue(formatDate(value, format));
                setCurrentMonth(value);
            } else if (variant === 'range' && isDateRange(value)) {
                setSelectedRange(value);
                setRangeInputValue([
                    formatDate(value.start, format),
                    formatDate(value.end, format)
                ]);
                if (value.start) setCurrentMonth(value.start);

            } else if (value === null || value === undefined) {
                // Handle null/undefined values
                if (variant === 'single') {
                    setSelectedDate(null);
                    setInputValue('');
                } else {
                    setSelectedRange({ start: null, end: null });
                    setRangeInputValue(['', '']);
                }
            }
        }, [value, variant, format]);

        // Handle click outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [isOpen]);

        // Validate date
        const validateDate = (date: Date | null): string | null => {
            if (required && !date) return 'Date is required';
            if (date && minDate && date < minDate) return `Date must be after ${formatDate(minDate, format)}`;
            if (date && maxDate && date > maxDate) return `Date must be before ${formatDate(maxDate, format)}`;
            if (date && disabledDates?.some(d => isSameDay(d, date))) return 'This date is not available';
            return null;
        };

        // Handle single date selection
        const handleDateSelect = (date: Date) => {
            const error = validateOnChange ? validateDate(date) : null;
            setInternalError(error);
            onError?.(error);

            setSelectedDate(date);
            setInputValue(formatDate(date, format));

            if (onChange) {
                onChange(date);
            }

            if (autoClose) {
                setTimeout(() => setIsOpen(false), 100);
            }
        };

        // Handle range date selection
        const handleRangeDateSelect = (date: Date) => {
            let newRange = { ...selectedRange };
            const error = validateOnChange ? validateDate(date) : null;
            setInternalError(error);
            onError?.(error);

            if (!newRange.start || (newRange.start && newRange.end)) {
                // Start new range
                newRange = { start: date, end: null };
            } else if (newRange.start && !newRange.end) {
                // Complete the range
                if (date < newRange.start) {
                    newRange = { start: date, end: newRange.start };
                } else {
                    newRange = { start: newRange.start, end: date };
                }
            }

            setSelectedRange(newRange);
            setRangeInputValue([
                formatDate(newRange.start, format),
                formatDate(newRange.end, format)
            ]);

            if (onChange && newRange.start && newRange.end) {
                onChange(newRange);
                if (autoClose) {
                    setTimeout(() => setIsOpen(false), 100);
                }
            } else if (onChange && allowEmpty) {
                onChange(newRange);
            }
        };

        // Handle input change for single date
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setInputValue(value);

            if (value) {
                const date = parseDate(value, format);
                if (date) {
                    const error = validateDate(date);
                    setInternalError(error);
                    onError?.(error);

                    if (!error) {
                        setSelectedDate(date);
                        onChange?.(date);
                        setCurrentMonth(date);
                    }
                } else {
                    setInternalError('Invalid date format');
                    onError?.('Invalid date format');
                }
            } else if (allowEmpty) {
                setSelectedDate(null);
                onChange?.(null);
                setInternalError(null);
                onError?.(null);
            }
        };

        // Handle input change for range dates
        const handleRangeInputChange = (index: 0 | 1, value: string) => {
            const newValues = [...rangeInputValue] as [string, string];
            newValues[index] = value;
            setRangeInputValue(newValues);

            const date = parseDate(value, format);
            const newRange = { ...selectedRange };

            if (index === 0) {
                newRange.start = date;
            } else {
                newRange.end = date;
            }

            // Validate if both dates are set
            if (newRange.start && newRange.end) {
                const error = validateOnChange ? validateDate(newRange.start) || validateDate(newRange.end) : null;
                setInternalError(error);
                onError?.(error);

                if (!error) {
                    setSelectedRange(newRange);
                    onChange?.(newRange);
                }
            } else if (allowEmpty) {
                setSelectedRange(newRange);
                onChange?.(newRange);
            }
        };

        // Handle today button click
        const handleTodayClick = () => {
            const today = new Date();
            const error = validateDate(today);

            if (!error) {
                if (variant === 'single') {
                    handleDateSelect(today);
                } else {
                    handleRangeDateSelect(today);
                }
            } else {
                setInternalError(error);
                onError?.(error);
            }
        };

        // Handle clear button click
        const handleClearClick = () => {
            if (variant === 'single') {
                setSelectedDate(null);
                setInputValue('');
                onChange?.(null);
            } else {
                setSelectedRange({ start: null, end: null });
                setRangeInputValue(['', '']);
                onChange?.({ start: null, end: null });
            }
            setInternalError(null);
            onError?.(null);
        };

        const hasError = Boolean(error) || !!internalError;

        return (
            <div ref={containerRef} className={cn("relative", className)}>
                {label && (
                    <motion.label
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block mb-2"
                    >
                        <Typography
                            variant="label"
                            weight="semibold"
                            className={cn("tracking-wide", themeStyles.text.primary)}
                        >
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </Typography>
                    </motion.label>
                )}

                <motion.div
                    ref={ref}
                    className={cn(
                        inputVariants.base,
                        inputVariants.sizes[size],
                        hasError ? inputVariants.error.true : inputVariants.error.false,
                        disabled ? inputVariants.disabled.true : inputVariants.disabled.false,
                        themeStyles.bg.input,
                        themeStyles.text.primary,
                        themeStyles.border,
                        !hasError && colorStyles.ring[themeMode],
                        !hasError && !disabled && "hover:border-gray-300 dark:hover:border-gray-600",
                        "shadow-sm hover:shadow transition-shadow duration-300",
                        inputClassName
                    )}
                    onClick={() => !disabled && !readOnly && setIsOpen(true)}
                    whileHover={{ scale: disabled ? 1 : 1.005 }}
                    whileTap={{ scale: disabled ? 1 : 0.995 }}
                    {...props}
                >
                    {variant === 'single' ? (
                        <InputField
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={typeof placeholder === 'string' ? placeholder : placeholder[0]}
                            themeMode={themeMode}
                            disabled={disabled}
                            readOnly={readOnly}
                            showIcon={showIcon}
                            icon={icon}
                            onFocus={() => !disabled && !readOnly && setIsOpen(true)}
                        />
                    ) : (
                        <RangeInputField
                            startRef={startInputRef}
                            endRef={endInputRef}
                            startValue={rangeInputValue[0]}
                            endValue={rangeInputValue[1]}
                            onStartChange={(e) => handleRangeInputChange(0, e.target.value)}
                            onEndChange={(e) => handleRangeInputChange(1, e.target.value)}
                            placeholder={placeholder}
                            themeMode={themeMode}
                            disabled={disabled}
                            readOnly={readOnly}
                            showIcon={showIcon}
                            icon={icon}
                            onFocus={() => !disabled && !readOnly && setIsOpen(true)}
                        />
                    )}
                </motion.div>

                <AnimatePresence>
                    {isOpen && !disabled && !readOnly && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                            className={cn(
                                "absolute z-50",
                                getPopupPositionClasses(popupPosition),
                                calendarClassName
                            )}
                        >
                            <CalendarView
                                currentMonth={currentMonth}
                                onMonthChange={setCurrentMonth}
                                selectedDate={selectedDate}
                                selectedRange={selectedRange}
                                onDateSelect={variant === 'single' ? handleDateSelect : handleRangeDateSelect}
                                themeMode={themeMode}
                                colorScheme={colorScheme}
                                minDate={minDate}
                                maxDate={maxDate}
                                disabledDates={disabledDates}
                                highlightDates={highlightDates}
                                todayButton={todayButton}
                                clearButton={clearButton}
                                onTodayClick={handleTodayClick}
                                onClearClick={handleClearClick}
                                weekStart={weekStart}
                                monthNames={monthNames}
                                dayNames={dayNames}
                                todayText={todayText}
                                clearText={clearText}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {(hasError || helperText) && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2"
                    >
                        {hasError && (
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <AlertCircle className="w-4 h-4 text-red-500" />
                            </motion.div>
                        )}
                        <Typography
                            variant="caption"
                            color={hasError ? "error" : "muted"}
                            weight="medium"
                            className="tracking-wide"
                        >
                            {hasError ? internalError || errorMessage : helperText}
                        </Typography>
                    </motion.div>
                )}
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;