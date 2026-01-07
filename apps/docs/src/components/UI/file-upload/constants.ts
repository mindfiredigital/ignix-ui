export const DEFAULT_MAX_FILES = 10;
export const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const DEFAULT_ACCEPT = '*/*';
export const DEFAULT_BUTTON_TEXT = 'Upload Files';
export const DEFAULT_DROPZONE_TEXT = 'Drag & drop files here or click to browse';

export const COLOR_PALETTE = {
    primary: {
        light: 'bg-gradient-to-r from-slate-700 to-slate-800',
        dark: 'bg-gradient-to-r from-indigo-600 to-purple-600',
        hover: 'hover:from-slate-800 hover:to-slate-900 hover:dark:from-indigo-700 hover:dark:to-purple-700',
        border: 'border-slate-300 dark:border-indigo-700',
        text: 'text-white',
        glow: 'shadow-lg shadow-slate-500/20 dark:shadow-indigo-700/30',
    },
    success: {
        light: 'bg-emerald-500',
        dark: 'bg-emerald-600',
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-700',
    },
    error: {
        light: 'bg-rose-500',
        dark: 'bg-rose-600',
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        border: 'border-rose-200 dark:border-rose-700',
    },
    warning: {
        light: 'bg-amber-500',
        dark: 'bg-amber-600',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-700',
    },
    neutral: {
        light: 'bg-slate-100',
        dark: 'bg-gray-800',
        text: 'text-slate-700 dark:text-gray-300',
        bg: 'bg-slate-50 dark:bg-gray-900/50',
        border: 'border-slate-200 dark:border-gray-700',
        hover: 'hover:border-slate-300 dark:hover:border-gray-600',
    }
} as const;