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

// Add these types to your types.ts file
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