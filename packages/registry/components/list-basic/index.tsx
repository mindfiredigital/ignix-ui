import React, { useMemo, useCallback } from "react";
import { cn } from "../../../utils/cn";

/**
 * Props for the ListBasic component
 * 
 * @interface ListBasicProps
 * @property {React.ReactNode[]} items - Array of items to display in the list
 * @property {'unordered' | 'ordered'} type - Type of list: 'unordered' for bullet points, 'ordered' for numbers
 * @property {'sm' | 'md' | 'lg'} spacing - Spacing size between list items
 * @property {string} className - Additional CSS classes to apply to the list
 * @property {React.ReactNode} children - Alternative way to pass list items as children
 */
export interface ListBasicProps {
    /**
     * Array of items to display in the list.
     * Can be strings or React nodes.
     */
    items?: React.ReactNode[];
    
    /**
     * Type of list marker.
     * - 'unordered': Uses bullet points (disc, circle, square)
     * - 'ordered': Uses numbers (1, 2, 3...)
     * @default 'unordered'
     */
    type?: 'unordered' | 'ordered';
    
    /**
     * Spacing size between list items.
     * - 'sm': Small spacing (0.5rem / 8px)
     * - 'md': Medium spacing (0.75rem / 12px)
     * - 'lg': Large spacing (1rem / 16px)
     * @default 'md'
     */
    spacing?: 'sm' | 'md' | 'lg';
    
    /**
     * Additional CSS classes to apply to the list container.
     */
    className?: string;
    
    /**
     * Alternative way to pass list items as children.
     * If provided, items prop will be ignored.
     */
    children?: React.ReactNode;
}

/**
 * Static spacing classes mapping for consistent spacing between items
 * Moved outside component to prevent recreation on every render
 */
const SPACING_CLASSES = {
    sm: 'space-y-2',      // 0.5rem / 8px
    md: 'space-y-3',      // 0.75rem / 12px
    lg: 'space-y-4',      // 1rem / 16px
} as const;

/**
 * Static list marker styles for unordered lists
 * Using list-outside with padding for better visibility and consistent spacing
 * Moved outside component to prevent recreation on every render
 */
const UNORDERED_MARKER_STYLES = {
    sm: 'list-disc list-outside ml-5',
    md: 'list-disc list-outside ml-5',
    lg: 'list-disc list-outside ml-6',
} as const;

/**
 * Static list marker styles for ordered lists
 * Using list-outside with padding for better visibility and consistent spacing
 * Moved outside component to prevent recreation on every render
 */
const ORDERED_MARKER_STYLES = {
    sm: 'list-decimal list-outside ml-5',
    md: 'list-decimal list-outside ml-5',
    lg: 'list-decimal list-outside ml-6',
} as const;

/**
 * ListBasic Component
 * 
 * A flexible list component that supports both unordered (bullet points) and ordered (numbered) lists
 * with consistent spacing between items. Provides a clean, accessible way to display lists of content.
 * 
 * Optimized with:
 * - React.memo to prevent unnecessary rerenders
 * - useMemo for computed class names
 * - useCallback for renderItems function
 * - Static objects moved outside component
 * 
 * @component
 * @example
 * ```tsx
 * // Unordered list with items prop
 * <ListBasic 
 *   items={['Item 1', 'Item 2', 'Item 3']} 
 *   type="unordered" 
 *   spacing="md" 
 * />
 * 
 * // Ordered list with children
 * <ListBasic type="ordered" spacing="lg">
 *   <li>First item</li>
 *   <li>Second item</li>
 *   <li>Third item</li>
 * </ListBasic>
 * ```
 * 
 * @param {ListBasicProps} props - Component props
 * @returns {JSX.Element} Rendered list component
 */
const ListBasic: React.FC<ListBasicProps> = React.memo(({
    items = [],
    type = 'unordered',
    spacing = 'md',
    className,
    children
}) => {
    /**
     * Memoized base classes calculation
     * Only recalculates when spacing, type, or className changes
     */
    const baseClasses = useMemo(() => {
        const markerStyle = type === 'unordered' 
            ? UNORDERED_MARKER_STYLES[spacing] 
            : ORDERED_MARKER_STYLES[spacing];
        
        return cn(
            SPACING_CLASSES[spacing],
            markerStyle,
            'text-foreground',
            className
        );
    }, [spacing, type, className]);

    /**
     * Memoized render function for list items
     * Only recreates when items array reference changes
     */
    const renderItems = useCallback(() => {
        if (!items || items.length === 0) return null;
        
        return items.map((item, index) => (
            <li 
                key={index} 
                className="leading-relaxed pl-1"
            >
                {item}
            </li>
        ));
    }, [items]);

    /**
     * Memoized list tag selection
     * Only recalculates when type changes
     */
    const ListTag = useMemo(() => {
        return type === 'ordered' ? 'ol' : 'ul';
    }, [type]);

    // Use children if provided, otherwise use items prop
    if (children) {
        return (
            <ListTag className={baseClasses}>
                {children}
            </ListTag>
        );
    }

    return (
        <ListTag className={baseClasses}>
            {renderItems()}
        </ListTag>
    );
});

ListBasic.displayName = "ListBasic";

export { ListBasic };

