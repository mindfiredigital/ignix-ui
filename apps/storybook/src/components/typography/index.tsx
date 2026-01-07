'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    asChild?: boolean;
    as?: React.ElementType;
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: 'default' | 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning' | 'inherit';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    decoration?: 'none' | 'underline' | 'line-through' | 'overline';
    transform?: 'normal' | 'uppercase' | 'lowercase' | 'capitalize';
    hover?: 'underline' | 'color' | 'scale' | 'none';
    mark?: boolean;
    truncate?: boolean;
}

const typographyVariants = cva('transition-all duration-200', {
    variants: {
        variant: {
            // Headings
            'h1': 'text-4xl font-bold tracking-tight lg:text-5xl',
            'h2': 'text-3xl font-bold tracking-tight lg:text-4xl',
            'h3': 'text-2xl font-semibold tracking-tight lg:text-3xl',
            'h4': 'text-xl font-semibold tracking-tight lg:text-2xl',
            'h5': 'text-lg font-medium lg:text-xl',
            'h6': 'text-base font-medium lg:text-lg',

            // Body text
            'body-large': 'text-lg leading-relaxed',
            'body': 'text-base leading-relaxed',
            'body-small': 'text-sm leading-relaxed',

            // Specialized text
            'lead': 'text-xl text-muted-foreground',
            'large': 'text-lg font-semibold',
            'small': 'text-sm font-medium',

            // Labels and captions
            'label': 'text-sm font-medium leading-none',
            'caption': 'text-xs leading-none text-muted-foreground',
            'muted': 'text-sm text-muted-foreground',

            // Interactive text
            'link': 'text-primary underline-offset-4 hover:underline cursor-pointer',
            'code': 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium',
            'blockquote': 'mt-6 border-l-2 pl-6 italic',
            'list': 'my-6 ml-6 list-disc [&>li]:mt-2',
        },
        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        },
        color: {
            default: 'text-foreground',
            primary: 'text-primary',
            secondary: 'text-secondary',
            muted: 'text-muted-foreground',
            error: 'text-destructive',
            success: 'text-emerald-600 dark:text-emerald-400',
            warning: 'text-amber-600 dark:text-amber-400',
            inherit: 'text-inherit',
        },
        weight: {
            light: 'font-light',
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
        },
        decoration: {
            none: 'no-underline',
            underline: 'underline',
            'line-through': 'line-through',
            overline: 'overline',
        },
        transform: {
            normal: '',
            uppercase: 'uppercase',
            lowercase: 'lowercase',
            capitalize: 'capitalize',
        },
        hover: {
            none: '',
            underline: 'hover:underline cursor-pointer',
            color: 'hover:text-primary cursor-pointer transition-colors',
            scale: 'hover:scale-105 cursor-pointer transition-transform',
        },
    },
    defaultVariants: {
        variant: 'body',
        align: 'left',
        color: 'default',
        weight: 'normal',
        decoration: 'none',
        transform: 'normal',
        hover: 'none',
    },
});

// Helper function to determine default HTML tag based on variant
const getDefaultTag = (variant?: string) => {
    switch (variant) {
        case 'h1':
            return 'h1';
        case 'h2':
            return 'h2';
        case 'h3':
            return 'h3';
        case 'h4':
            return 'h4';
        case 'h5':
            return 'h5';
        case 'h6':
            return 'h6';
        case 'blockquote':
            return 'blockquote';
        case 'list':
            return 'ul';
        case 'code':
            return 'code';
        default:
            return 'p';
    }
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    (
        {
            className,
            variant,
            align,
            color,
            weight,
            decoration,
            transform,
            hover,
            asChild = false,
            as,
            mark = false,
            truncate = false,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : as || getDefaultTag(variant || 'body');

        // Handle mark highlighting
        const renderContent = () => {
            if (mark) {
                return (
                    <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                        {children}
                    </mark>
                );
            }
            return children;
        };

        return (
            <Comp
                className={cn(
                    typographyVariants({
                        variant,
                        align,
                        color,
                        weight,
                        decoration,
                        transform,
                        hover,
                    }),
                    truncate && 'truncate',
                    className
                )}
                ref={ref}
                {...props}
            >
                {renderContent()}
            </Comp>
        );
    }
);

Typography.displayName = 'Typography';

export { Typography };