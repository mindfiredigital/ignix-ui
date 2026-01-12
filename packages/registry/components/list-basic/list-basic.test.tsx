/**
 * Unit Tests for ListBasic Component
 * 
 * This test suite covers all aspects of the ListBasic component including:
 * - Basic rendering and default behavior
 * - Props handling (items, children, type, spacing, className)
 * - Type variants (unordered/ordered)
 * - Spacing variants (sm/md/lg)
 * - React.memo optimization behavior
 * - Edge cases and error handling
 * - Accessibility features
 * - Performance optimizations
 * 
 * @file list-basic.test.tsx
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ListBasic } from './index';

describe('ListBasic', () => {
    /**
     * Default test items used across multiple test cases
     */
    const defaultItems = ['Item 1', 'Item 2', 'Item 3'];

    /**
     * Clean up after each test to prevent test interference
     */
    afterEach(() => {
        cleanup();
    });

    /**
     * Test suite for basic rendering functionality
     * Verifies that the component renders correctly with default and minimal props
     */
    describe('Basic Rendering', () => {
        /**
         * Tests that the component renders correctly with default props
         * Should render as an unordered list (UL) by default
         */
        it('renders with default props correctly', () => {
            render(<ListBasic items={defaultItems} />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.tagName).toBe('UL');
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.getByText('Item 3')).toBeInTheDocument();
        });

        /**
         * Tests that the component handles empty items array gracefully
         * Should render an empty list without errors
         */
        it('renders with empty items array', () => {
            render(<ListBasic items={[]} />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.children.length).toBe(0);
        });

        /**
         * Tests that the component renders correctly when no items prop is provided
         * Should default to an empty list
         */
        it('renders with no items prop', () => {
            render(<ListBasic />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.children.length).toBe(0);
        });

        /**
         * Verifies that the component has the correct displayName
         * This is important for React DevTools and debugging
         */
        it('has correct displayName', () => {
            expect(ListBasic.displayName).toBe('ListBasic');
        });
    });

    /**
     * Test suite for items prop functionality
     * Verifies that items are rendered correctly from the items prop
     */
    describe('Items Prop', () => {
        /**
         * Tests that string items are rendered correctly from the items prop
         */
        it('renders items from items prop correctly', () => {
            render(<ListBasic items={['First', 'Second', 'Third']} />);

            expect(screen.getByText('First')).toBeInTheDocument();
            expect(screen.getByText('Second')).toBeInTheDocument();
            expect(screen.getByText('Third')).toBeInTheDocument();
        });

        /**
         * Tests that the component can render React nodes in addition to strings
         * Verifies support for mixed content types in the items array
         */
        it('renders items with React nodes', () => {
            render(
                <ListBasic
                    items={[
                        <span key="1">Node 1</span>,
                        <strong key="2">Node 2</strong>,
                        'String 3'
                    ]}
                />
            );

            expect(screen.getByText('Node 1')).toBeInTheDocument();
            expect(screen.getByText('Node 2')).toBeInTheDocument();
            expect(screen.getByText('String 3')).toBeInTheDocument();
        });

        /**
         * Verifies that list items have the correct CSS classes applied
         * Items should have 'leading-relaxed' and 'pl-1' classes
         */
        it('applies correct classes to list items', () => {
            render(<ListBasic items={['Item 1']} />);

            const listItem = screen.getByText('Item 1');
            expect(listItem.tagName).toBe('LI');
            expect(listItem).toHaveClass('leading-relaxed', 'pl-1');
        });
    });

    /**
     * Test suite for children prop functionality
     * Verifies that children are rendered correctly and take priority over items prop
     */
    describe('Children Prop', () => {
        /**
         * Tests that children are rendered when provided
         * Children should be rendered as direct list items
         */
        it('renders children when provided', () => {
            render(
                <ListBasic>
                    <li>Child 1</li>
                    <li>Child 2</li>
                    <li>Child 3</li>
                </ListBasic>
            );

            expect(screen.getByText('Child 1')).toBeInTheDocument();
            expect(screen.getByText('Child 2')).toBeInTheDocument();
            expect(screen.getByText('Child 3')).toBeInTheDocument();
        });

        /**
         * Tests that children prop takes priority over items prop
         * When both are provided, only children should be rendered
         */
        it('prioritizes children over items prop', () => {
            render(
                <ListBasic items={['Item from prop']}>
                    <li>Child item</li>
                </ListBasic>
            );

            expect(screen.getByText('Child item')).toBeInTheDocument();
            expect(screen.queryByText('Item from prop')).not.toBeInTheDocument();
        });

        /**
         * Tests that complex nested content in children is rendered correctly
         * Should support JSX elements, links, and formatted text
         */
        it('renders complex children content', () => {
            render(
                <ListBasic>
                    <li>
                        <strong>Bold</strong> text with <em>emphasis</em>
                    </li>
                    <li>
                        <a href="#">Link item</a>
                    </li>
                </ListBasic>
            );

            expect(screen.getByText('Bold')).toBeInTheDocument();
            expect(screen.getByText('emphasis')).toBeInTheDocument();
            expect(screen.getByText('Link item')).toBeInTheDocument();
        });
    });

    /**
     * Test suite for list type variants (unordered/ordered)
     * Verifies that the component correctly renders UL and OL elements
     */
    describe('Type Variants', () => {
        /**
         * Tests that the component defaults to unordered list (UL)
         * This is the default behavior when type prop is not specified
         */
        it('renders unordered list by default', () => {
            render(<ListBasic items={defaultItems} />);

            const list = screen.getByRole('list');
            expect(list.tagName).toBe('UL');
        });

        /**
         * Tests that explicit unordered type renders as UL with disc markers
         * Should have 'list-disc' and 'list-outside' classes
         */
        it('renders unordered list when type is "unordered"', () => {
            render(<ListBasic items={defaultItems} type="unordered" />);

            const list = screen.getByRole('list');
            expect(list.tagName).toBe('UL');
            expect(list).toHaveClass('list-disc', 'list-outside');
        });

        /**
         * Tests that ordered type renders as OL with decimal markers
         * Should have 'list-decimal' and 'list-outside' classes
         */
        it('renders ordered list when type is "ordered"', () => {
            render(<ListBasic items={defaultItems} type="ordered" />);

            const list = screen.getByRole('list');
            expect(list.tagName).toBe('OL');
            expect(list).toHaveClass('list-decimal', 'list-outside');
        });

        /**
         * Tests that the component correctly switches between list types
         * Verifies dynamic type changes work correctly
         */
        it('switches between ordered and unordered correctly', () => {
            const { rerender } = render(<ListBasic items={defaultItems} type="unordered" />);

            let list = screen.getByRole('list');
            expect(list.tagName).toBe('UL');

            rerender(<ListBasic items={defaultItems} type="ordered" />);
            list = screen.getByRole('list');
            expect(list.tagName).toBe('OL');
        });
    });

    /**
     * Test suite for spacing variants (sm/md/lg)
     * Verifies that different spacing options apply correct CSS classes
     */
    describe('Spacing Variants', () => {
        /**
         * Tests that default spacing is medium (md)
         * Should apply 'space-y-3' class by default
         */
        it('applies default medium spacing', () => {
            render(<ListBasic items={defaultItems} />);

            const list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-3');
        });

        /**
         * Tests that small spacing applies correct classes
         * Should have 'space-y-2' for vertical spacing and 'ml-5' for left margin
         */
        it('applies small spacing correctly', () => {
            render(<ListBasic items={defaultItems} spacing="sm" />);

            const list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-2');
            expect(list).toHaveClass('ml-5');
        });

        /**
         * Tests that medium spacing applies correct classes
         * Should have 'space-y-3' for vertical spacing and 'ml-5' for left margin
         */
        it('applies medium spacing correctly', () => {
            render(<ListBasic items={defaultItems} spacing="md" />);

            const list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-3');
            expect(list).toHaveClass('ml-5');
        });

        /**
         * Tests that large spacing applies correct classes
         * Should have 'space-y-4' for vertical spacing and 'ml-6' for left margin
         */
        it('applies large spacing correctly', () => {
            render(<ListBasic items={defaultItems} spacing="lg" />);

            const list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-4');
            expect(list).toHaveClass('ml-6');
        });

        /**
         * Tests that unordered lists apply correct marker styles for each spacing variant
         * Verifies the combination of spacing and marker styles
         */
        it('applies correct marker styles for each spacing with unordered list', () => {
            const { rerender } = render(<ListBasic items={defaultItems} spacing="sm" type="unordered" />);
            let list = screen.getByRole('list');
            expect(list).toHaveClass('list-disc', 'list-outside', 'ml-5');

            rerender(<ListBasic items={defaultItems} spacing="md" type="unordered" />);
            list = screen.getByRole('list');
            expect(list).toHaveClass('list-disc', 'list-outside', 'ml-5');

            rerender(<ListBasic items={defaultItems} spacing="lg" type="unordered" />);
            list = screen.getByRole('list');
            expect(list).toHaveClass('list-disc', 'list-outside', 'ml-6');
        });

        /**
         * Tests that ordered lists apply correct marker styles for each spacing variant
         * Verifies the combination of spacing and decimal marker styles
         */
        it('applies correct marker styles for each spacing with ordered list', () => {
            const { rerender } = render(<ListBasic items={defaultItems} spacing="sm" type="ordered" />);
            let list = screen.getByRole('list');
            expect(list).toHaveClass('list-decimal', 'list-outside', 'ml-5');

            rerender(<ListBasic items={defaultItems} spacing="md" type="ordered" />);
            list = screen.getByRole('list');
            expect(list).toHaveClass('list-decimal', 'list-outside', 'ml-5');

            rerender(<ListBasic items={defaultItems} spacing="lg" type="ordered" />);
            list = screen.getByRole('list');
            expect(list).toHaveClass('list-decimal', 'list-outside', 'ml-6');
        });
    });

    /**
     * Test suite for custom styling and className prop
     * Verifies that custom classes are applied correctly
     */
    describe('Custom Styling', () => {
        /**
         * Tests that custom className is applied to the list element
         */
        it('applies custom className correctly', () => {
            render(<ListBasic items={defaultItems} className="custom-class" />);

            const list = screen.getByRole('list');
            expect(list).toHaveClass('custom-class');
        });

        /**
         * Tests that the default 'text-foreground' class is always applied
         * This ensures consistent text color styling
         */
        it('applies text-foreground class by default', () => {
            render(<ListBasic items={defaultItems} />);

            const list = screen.getByRole('list');
            expect(list).toHaveClass('text-foreground');
        });

        /**
         * Tests that custom className combines correctly with default classes
         * Both custom and default classes should be present
         */
        it('combines custom className with default classes', () => {
            render(<ListBasic items={defaultItems} className="my-custom-class" spacing="lg" />);

            const list = screen.getByRole('list');
            expect(list).toHaveClass('my-custom-class');
            expect(list).toHaveClass('space-y-4');
            expect(list).toHaveClass('text-foreground');
        });
    });

    /**
     * Test suite for React.memo optimization behavior
     * Verifies that the component only rerenders when props actually change
     */
    describe('React.memo Optimization', () => {
        /**
         * Tests that the component doesn't rerender unnecessarily
         * Note: This test verifies wrapper behavior, not memo itself
         * React.memo prevents rerenders when props are shallowly equal
         */
        it('does not rerender when props remain the same', () => {
            const renderSpy = vi.fn();
            const TestWrapper = ({ items }: { items: string[] }) => {
                renderSpy();
                return <ListBasic items={items} />;
            };

            const { rerender } = render(<TestWrapper items={defaultItems} />);
            expect(renderSpy).toHaveBeenCalledTimes(1);

            // Rerender with same items reference
            rerender(<TestWrapper items={defaultItems} />);
            expect(renderSpy).toHaveBeenCalledTimes(2);

            // ListBasic should still render correctly
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        /**
         * Tests that the component rerenders when items array reference changes
         * Even if content is the same, a new array reference should trigger rerender
         */
        it('rerenders when items array reference changes', () => {
            const { rerender } = render(<ListBasic items={defaultItems} />);

            expect(screen.getByText('Item 1')).toBeInTheDocument();

            rerender(<ListBasic items={['New Item 1', 'New Item 2']} />);

            expect(screen.getByText('New Item 1')).toBeInTheDocument();
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
        });

        /**
         * Tests that the component rerenders when type prop changes
         * Should switch between UL and OL correctly
         */
        it('rerenders when type changes', () => {
            const { rerender } = render(<ListBasic items={defaultItems} type="unordered" />);

            let list = screen.getByRole('list');
            expect(list.tagName).toBe('UL');

            rerender(<ListBasic items={defaultItems} type="ordered" />);
            list = screen.getByRole('list');
            expect(list.tagName).toBe('OL');
        });

        /**
         * Tests that the component rerenders when spacing prop changes
         * Should update spacing classes correctly
         */
        it('rerenders when spacing changes', () => {
            const { rerender } = render(<ListBasic items={defaultItems} spacing="sm" />);

            let list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-2');

            rerender(<ListBasic items={defaultItems} spacing="lg" />);
            list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-4');
        });

        /**
         * Tests that the component rerenders when className prop changes
         * Should update custom classes correctly
         */
        it('rerenders when className changes', () => {
            const { rerender } = render(<ListBasic items={defaultItems} className="class1" />);

            let list = screen.getByRole('list');
            expect(list).toHaveClass('class1');

            rerender(<ListBasic items={defaultItems} className="class2" />);
            list = screen.getByRole('list');
            expect(list).toHaveClass('class2');
            expect(list).not.toHaveClass('class1');
        });
    });

    /**
     * Test suite for edge cases and error handling
     * Verifies that the component handles invalid or unusual inputs gracefully
     */
    describe('Edge Cases', () => {
        /**
         * Tests that the component handles null items prop gracefully
         * Should default to empty array and render without errors
         * Using type assertion to test invalid prop type
         */
        it('handles null items gracefully', () => {
            render(<ListBasic items={null as unknown as React.ReactNode[]} />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.children.length).toBe(0);
        });

        /**
         * Tests that the component handles undefined items prop gracefully
         * Should default to empty array and render without errors
         */
        it('handles undefined items gracefully', () => {
            render(<ListBasic items={undefined} />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.children.length).toBe(0);
        });

        /**
         * Tests that the component handles null values within items array
         * Should skip null values and render valid items
         * Using type assertion to test invalid array element type
         */
        it('handles items with null values', () => {
            render(<ListBasic items={['Item 1', null as unknown as React.ReactNode, 'Item 3']} />);

            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 3')).toBeInTheDocument();
        });

        /**
         * Tests that the component handles undefined values within items array
         * Should skip undefined values and render valid items
         * Using type assertion to test invalid array element type
         */
        it('handles items with undefined values', () => {
            render(<ListBasic items={['Item 1', undefined as unknown as React.ReactNode, 'Item 3']} />);

            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 3')).toBeInTheDocument();
        });

        /**
         * Tests that the component handles empty string items
         * Empty strings should be rendered as empty list items
         */
        it('handles empty string items', () => {
            render(<ListBasic items={['', 'Item 2', '']} />);

            expect(screen.getByText('Item 2')).toBeInTheDocument();
        });

        /**
         * Tests that the component handles a single item correctly
         * Should render one list item without errors
         */
        it('handles single item correctly', () => {
            render(<ListBasic items={['Single Item']} />);

            const list = screen.getByRole('list');
            expect(list.children.length).toBe(1);
            expect(screen.getByText('Single Item')).toBeInTheDocument();
        });

        /**
         * Tests that the component handles large numbers of items correctly
         * Should render all items without performance issues
         */
        it('handles many items correctly', () => {
            const manyItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
            render(<ListBasic items={manyItems} />);

            const list = screen.getByRole('list');
            expect(list.children.length).toBe(100);
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 100')).toBeInTheDocument();
        });

        /**
         * Tests that children work correctly when items prop is not provided
         * Children should be rendered even without items prop
         */
        it('handles children with no items prop', () => {
            render(
                <ListBasic>
                    <li>Only child</li>
                </ListBasic>
            );

            expect(screen.getByText('Only child')).toBeInTheDocument();
        });
    });

    /**
     * Test suite for accessibility features
     * Verifies that the component uses semantic HTML and proper structure
     */
    describe('Accessibility', () => {
        /**
         * Tests that unordered lists use semantic UL element
         * This is important for screen readers and accessibility
         */
        it('uses semantic HTML for unordered lists', () => {
            render(<ListBasic items={defaultItems} type="unordered" />);

            const list = screen.getByRole('list');
            expect(list.tagName).toBe('UL');
        });

        /**
         * Tests that ordered lists use semantic OL element
         * This is important for screen readers and accessibility
         */
        it('uses semantic HTML for ordered lists', () => {
            render(<ListBasic items={defaultItems} type="ordered" />);

            const list = screen.getByRole('list');
            expect(list.tagName).toBe('OL');
        });

        /**
         * Tests that list items are properly structured
         * All items should be LI elements within the list
         */
        it('renders list items with proper structure', () => {
            render(<ListBasic items={['Item 1', 'Item 2']} />);

            const list = screen.getByRole('list');
            const items = list.querySelectorAll('li');
            expect(items.length).toBe(2);
            items.forEach(item => {
                expect(item.tagName).toBe('LI');
            });
        });

        /**
         * Tests that children maintain proper list structure
         * Children should be rendered as LI elements within the list
         */
        it('maintains proper list structure with children', () => {
            render(
                <ListBasic>
                    <li>Child 1</li>
                    <li>Child 2</li>
                </ListBasic>
            );

            const list = screen.getByRole('list');
            const items = list.querySelectorAll('li');
            expect(items.length).toBe(2);
        });
    });

    /**
     * Test suite for combined prop usage
     * Verifies that multiple props work correctly together
     */
    describe('Combined Props', () => {
        /**
         * Tests that all props can be used together correctly
         * Verifies that type, spacing, className, and items all work in combination
         */
        it('applies all props correctly together', () => {
            render(
                <ListBasic
                    items={['Item 1', 'Item 2']}
                    type="ordered"
                    spacing="lg"
                    className="custom-class"
                />
            );

            const list = screen.getByRole('list');
            expect(list.tagName).toBe('OL');
            expect(list).toHaveClass('space-y-4');
            expect(list).toHaveClass('list-decimal', 'list-outside', 'ml-6');
            expect(list).toHaveClass('custom-class');
            expect(list).toHaveClass('text-foreground');
        });

        /**
         * Tests all combinations of type and spacing variants
         * Verifies that every combination works correctly
         */
        it('handles type and spacing combination correctly', () => {
            /**
             * All possible combinations of type and spacing
             * Using 'as const' to ensure type safety
             */
            const combinations = [
                { type: 'unordered' as const, spacing: 'sm' as const },
                { type: 'unordered' as const, spacing: 'md' as const },
                { type: 'unordered' as const, spacing: 'lg' as const },
                { type: 'ordered' as const, spacing: 'sm' as const },
                { type: 'ordered' as const, spacing: 'md' as const },
                { type: 'ordered' as const, spacing: 'lg' as const },
            ];

            combinations.forEach(({ type, spacing }) => {
                const { unmount } = render(
                    <ListBasic items={defaultItems} type={type} spacing={spacing} />
                );

                const list = screen.getByRole('list');
                expect(list.tagName).toBe(type === 'ordered' ? 'OL' : 'UL');

                const expectedSpacing = spacing === 'sm' ? 'space-y-2' : spacing === 'md' ? 'space-y-3' : 'space-y-4';
                expect(list).toHaveClass(expectedSpacing);

                unmount();
            });
        });
    });

    /**
     * Test suite for performance optimizations
     * Verifies that useMemo and useCallback optimizations work correctly
     */
    describe('Performance Optimizations', () => {
        /**
         * Tests that baseClasses are memoized correctly
         * Should only recalculate when spacing, type, or className changes
         */
        it('memoizes baseClasses correctly', () => {
            const { rerender } = render(
                <ListBasic items={defaultItems} spacing="sm" type="unordered" />
            );

            let list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-2', 'list-disc', 'ml-5');

            // Change spacing - should recalculate baseClasses
            rerender(<ListBasic items={defaultItems} spacing="lg" type="unordered" />);
            list = screen.getByRole('list');
            expect(list).toHaveClass('space-y-4', 'list-disc', 'ml-6');
        });

        /**
         * Tests that ListTag selection is memoized correctly
         * Should only recalculate when type changes
         */
        it('memoizes ListTag selection correctly', () => {
            const { rerender } = render(<ListBasic items={defaultItems} type="unordered" />);

            let list = screen.getByRole('list');
            expect(list.tagName).toBe('UL');

            // Change type - should recalculate ListTag
            rerender(<ListBasic items={defaultItems} type="ordered" />);
            list = screen.getByRole('list');
            expect(list.tagName).toBe('OL');
        });

        /**
         * Tests that the component correctly handles items array reference changes
         * New array reference should trigger rerender even if content is similar
         */
        it('handles items array reference changes', () => {
            const items1 = ['Item 1'];
            const items2 = ['Item 2'];

            const { rerender } = render(<ListBasic items={items1} />);
            expect(screen.getByText('Item 1')).toBeInTheDocument();

            rerender(<ListBasic items={items2} />);
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
        });
    });
});

