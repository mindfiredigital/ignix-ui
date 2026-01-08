import React from "react";
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
 * ListBasic Component
 * 
 * A flexible list component that supports both unordered (bullet points) and ordered (numbered) lists
 * with consistent spacing between items. Provides a clean, accessible way to display lists of content.
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
const ListBasic: React.FC<ListBasicProps> = ({
    items = [],
    type = 'unordered',
    spacing = 'md',
    className,
    children
}) => {
    /**
     * Spacing classes mapping for consistent spacing between items
     */
    const spacingClasses = {
        sm: 'space-y-2',      // 0.5rem / 8px
        md: 'space-y-3',      // 0.75rem / 12px
        lg: 'space-y-4',      // 1rem / 16px
    };

    /**
     * List marker styles for unordered lists
     * Using list-outside with padding for better visibility and consistent spacing
     */
    const unorderedMarkerStyles = {
        sm: 'list-disc list-outside ml-5',
        md: 'list-disc list-outside ml-5',
        lg: 'list-disc list-outside ml-6',
    };

    /**
     * List marker styles for ordered lists
     * Using list-outside with padding for better visibility and consistent spacing
     */
    const orderedMarkerStyles = {
        sm: 'list-decimal list-outside ml-5',
        md: 'list-decimal list-outside ml-5',
        lg: 'list-decimal list-outside ml-6',
    };

    /**
     * Base classes for the list component
     */
    const baseClasses = cn(
        spacingClasses[spacing],
        type === 'unordered' ? unorderedMarkerStyles[spacing] : orderedMarkerStyles[spacing],
        'text-foreground',
        className
    );

    /**
     * Render list items from items prop
     */
    const renderItems = () => {
        if (!items || items.length === 0) return null;
        
        return items.map((item, index) => (
            <li 
                key={index} 
                className="leading-relaxed pl-1"
            >
                {item}
            </li>
        ));
    };

    // Use children if provided, otherwise use items prop
    if (children) {
        const ListTag = type === 'ordered' ? 'ol' : 'ul';
        return (
            <ListTag className={baseClasses}>
                {children}
            </ListTag>
        );
    }

    const ListTag = type === 'ordered' ? 'ol' : 'ul';
    return (
        <ListTag className={baseClasses}>
            {renderItems()}
        </ListTag>
    );
};

ListBasic.displayName = "ListBasic";

export { ListBasic };

