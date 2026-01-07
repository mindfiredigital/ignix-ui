import { cva } from 'class-variance-authority';

export const inputVariants = cva(
    'flex items-center gap-2 px-4 border rounded-lg transition-all duration-300 focus-within:shadow-sm',
    {
        variants: {
            size: {
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
            },
            themeMode: {
                light: '',
                dark: '',
            },
        },
        compoundVariants: [
            {
                error: false,
                disabled: false,
                className: '',
            },
            {
                error: true,
                themeMode: 'light',
                className: 'bg-red-50/50',
            },
            {
                error: true,
                themeMode: 'dark',
                className: 'bg-red-900/20',
            },
        ],
        defaultVariants: {
            size: 'md',
            error: false,
            disabled: false,
            themeMode: 'light',
        },
    }
);