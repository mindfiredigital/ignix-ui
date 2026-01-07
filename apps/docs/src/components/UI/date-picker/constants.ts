import type { ColorScheme, ColorSchemeStyles, ThemeMode, ThemeModeStyles } from './types';

export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DATE_FORMATS = {
    'MM/DD/YYYY': 'MM/DD/YYYY',
    'DD/MM/YYYY': 'DD/MM/YYYY',
    'YYYY-MM-DD': 'YYYY-MM-DD',
    'MMM DD, YYYY': 'MMM DD, YYYY',
    'DD MMM YYYY': 'DD MMM YYYY',
    'YYYY/MM/DD': 'YYYY/MM/DD',
} as const;

export const COLOR_SCHEMES: Record<ColorScheme, ColorSchemeStyles> = {
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

export const THEME_MODES: Record<ThemeMode, ThemeModeStyles> = {
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