import { type DateFormat, type ThemeMode, type ColorScheme, type ThemeModeStyles, type ColorSchemeStyles } from './types';
import { MONTH_NAMES, THEME_MODES, COLOR_SCHEMES } from './constants';

/**
 * Formats a date object into a specified string format
 * @param date - Date object to format (null allowed)
 * @param format - Desired output format from DateFormat type
 * @returns Formatted date string or empty string if date is null
 */

export const formatDate = (date: Date | null, format: DateFormat): string => {
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
 * @param str - Date string to parse
 * @param format - Expected format of the input string
 * @returns Date object if parsing successful, null otherwise
 */
export const parseDate = (str: string, format: DateFormat): Date | null => {
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
            case 'MMM DD, YYYY':{
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
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns True if both dates represent the same day, false otherwise
 */
export const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};


/**
 * Checks if a date falls within a specified range (inclusive)
 * @param date - The date to check
 * @param start - Start of the range (inclusive)
 * @param end - End of the range (inclusive)
 * @returns True if date is within range, false otherwise
 */
export const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    return date >= start && date <= end;
};


/**
 * Determines if a date should be disabled based on various constraints
 * @param date - The date to check
 * @param minDate - Minimum allowed date (optional)
 * @param maxDate - Maximum allowed date (optional)
 * @param disabledDates - Array of specific dates to disable (optional)
 * @returns True if date should be disabled, false otherwise
 */
export const isDateDisabled = (
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
 * Includes days from previous and next months to fill the 6x7 grid (42 days)
 * @param date - Any date within the target month
 * @param weekStart - Which day starts the week: 0 for Sunday, 1 for Monday
 * @returns Array of Date objects for the calendar grid
 */
export const getDaysInMonth = (date: Date, weekStart: 0 | 1 = 0): Date[] => {
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
 * @param themeMode - Current theme mode (light/dark)
 * @returns ThemeModeStyles object with styling configurations
 */
export const getThemeStyles = (themeMode: ThemeMode): ThemeModeStyles => THEME_MODES[themeMode] as ThemeModeStyles;

/**
 * Retrieves color scheme-specific styles for the application
 * @param colorScheme - Current color scheme (blue, green, etc.)
 * @returns ColorSchemeStyles object with styling configurations
 */
export const getColorStyles = (colorScheme: ColorScheme): ColorSchemeStyles => COLOR_SCHEMES[colorScheme] as ColorSchemeStyles;

/**
 * Generates CSS classes for date range highlighting with appropriate opacity
 * @param themeMode - Current theme mode (light/dark)
 * @param colorScheme - Current color scheme
 * @returns CSS class string for range highlighting
 */
export const getInRangeStyle = (themeMode: ThemeMode, colorScheme: ColorScheme): string => {
    const scheme = COLOR_SCHEMES[colorScheme];
    if (themeMode === 'light') {
        return scheme.accent.light.replace('bg-', 'bg-opacity-30 bg-');
    } else {
        return scheme.accent.dark.replace('bg-', 'bg-opacity-30 bg-');
    }
};

/**
 * Determines CSS classes for positioning a popup relative to its trigger element
 * @param position - Desired popup position relative to trigger
 * @returns CSS class string for positioning the popup
 */
export const getPopupPositionClasses = (position: string): string => {
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