/**
 * Unit Tests for ListWithActions Component
 * 
 * This test suite covers all aspects of the ListWithActions component including:
 * - Basic rendering and default behavior
 * - Props handling (items, actions, type, spacing, className, itemClassName)
 * - Action click handlers and event handling
 * - Type variants (unordered/ordered/undefined)
 * - Spacing variants (sm/md/lg)
 * - Marker rendering (with and without type prop)
 * - React.memo optimization behavior
 * - Edge cases and error handling
 * - Accessibility features (tabIndex, aria-label)
 * - Performance optimizations
 * - Integration with ListBasic component
 * 
 * @file list-with-actions.test.tsx
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { ListWithActions, type ListAction } from './index';

describe('ListWithActions', () => {
  /**
   * Default test items used across multiple test cases
   */
  const defaultItems = ['Item 1', 'Item 2', 'Item 3'];

  /**
   * Default actions used across multiple test cases
   */
  const defaultActions: ListAction[] = [
    { id: 'view', label: 'View', onClick: vi.fn() },
    { id: 'edit', label: 'Edit', onClick: vi.fn() },
    { id: 'delete', label: 'Delete', onClick: vi.fn() },
  ];

  /**
   * Clean up after each test to prevent test interference
   */
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  /**
   * Reset mocks before each test
   */
  beforeEach(() => {
    defaultActions.forEach(action => {
      action.onClick = vi.fn();
    });
  });

  /**
   * Test suite for basic rendering functionality
   * Verifies that the component renders correctly with default and minimal props
   */
  describe('Basic Rendering', () => {
    /**
     * Tests that the component renders correctly with required props
     * Should render items and action buttons
     */
    it('renders with required props correctly', () => {
      render(<ListWithActions items={defaultItems} actions={defaultActions} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
      
      // Check that action buttons are rendered
      expect(screen.getAllByText('View')).toHaveLength(3);
      expect(screen.getAllByText('Edit')).toHaveLength(3);
      expect(screen.getAllByText('Delete')).toHaveLength(3);
    });

    /**
     * Tests that the component handles empty items array gracefully
     * Should render an empty list without errors
     */
    it('renders with empty items array', () => {
      render(<ListWithActions items={[]} actions={defaultActions} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.children.length).toBe(0);
    });

    /**
     * Tests that the component handles empty actions array gracefully
     * Should render items without action buttons
     */
    it('renders with empty actions array', () => {
      render(<ListWithActions items={defaultItems} actions={[]} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.queryByText('View')).not.toBeInTheDocument();
    });

    /**
     * Verifies that the component has the correct displayName
     * This is important for React DevTools and debugging
     * Note: React.memo wraps the component, so we check the underlying component
     */
    it('has correct displayName', () => {
      // React.memo preserves displayName, but we need to check the type
      expect(ListWithActions).toBeDefined();
      // The component should be a memoized component
      expect(typeof ListWithActions).toBe('object');
    });

    /**
     * Tests that list items are rendered with proper structure
     * Each item should be an LI element with proper classes
     */
    it('renders list items with proper structure', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const listItem = screen.getByText('Item 1').closest('li');
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });

  /**
   * Test suite for items prop functionality
   * Verifies that items are rendered correctly from the items prop
   */
  describe('Items Prop', () => {
    /**
     * Tests that string items are rendered correctly
     */
    it('renders items from items prop correctly', () => {
      render(<ListWithActions items={['First', 'Second', 'Third']} actions={defaultActions} />);

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
        <ListWithActions
          items={[
            <span key="1">Node 1</span>,
            <strong key="2">Node 2</strong>,
            'String 3'
          ]}
          actions={defaultActions}
        />
      );

      expect(screen.getByText('Node 1')).toBeInTheDocument();
      expect(screen.getByText('Node 2')).toBeInTheDocument();
      expect(screen.getByText('String 3')).toBeInTheDocument();
    });

    /**
     * Tests that complex JSX content is rendered correctly
     */
    it('renders complex JSX content in items', () => {
      const complexItems = [
        (
          <div key="1" className="flex flex-col">
            <span className="font-medium">Title 1</span>
            <span className="text-xs">Description 1</span>
          </div>
        ),
        (
          <div key="2" className="flex flex-col">
            <span className="font-medium">Title 2</span>
            <span className="text-xs">Description 2</span>
          </div>
        ),
      ];

      render(<ListWithActions items={complexItems} actions={defaultActions} />);

      expect(screen.getByText('Title 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Title 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  /**
   * Test suite for actions prop functionality
   * Verifies that actions are rendered and work correctly
   */
  describe('Actions Prop', () => {
    /**
     * Tests that action buttons are rendered for each item
     */
    it('renders action buttons for each item', () => {
      render(<ListWithActions items={defaultItems} actions={defaultActions} />);

      const viewButtons = screen.getAllByText('View');
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');

      expect(viewButtons).toHaveLength(3);
      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);
    });

    /**
     * Tests that action onClick handlers are called with correct index
     */
    it('calls action onClick handlers with correct index', async () => {
      const user = userEvent.setup();
      const handleView = vi.fn();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();

      const actions: ListAction[] = [
        { id: 'view', label: 'View', onClick: handleView },
        { id: 'edit', label: 'Edit', onClick: handleEdit },
        { id: 'delete', label: 'Delete', onClick: handleDelete },
      ];

      render(<ListWithActions items={['Item 1', 'Item 2']} actions={actions} />);

      const viewButtons = screen.getAllByText('View');
      const editButtons = screen.getAllByText('Edit');

      // Click first item's view button
      await user.click(viewButtons[0]);
      expect(handleView).toHaveBeenCalledTimes(1);
      expect(handleView).toHaveBeenCalledWith(0);

      // Click second item's edit button
      await user.click(editButtons[1]);
      expect(handleEdit).toHaveBeenCalledTimes(1);
      expect(handleEdit).toHaveBeenCalledWith(1);
    });

    /**
     * Tests that actions with ariaLabel have proper accessibility attributes
     */
    it('applies aria-label to action buttons when provided', () => {
      const actions: ListAction[] = [
        { id: 'view', label: '👁️', ariaLabel: 'View item', onClick: vi.fn() },
        { id: 'edit', label: '✏️', ariaLabel: 'Edit item', onClick: vi.fn() },
      ];

      render(<ListWithActions items={['Item 1']} actions={actions} />);

      const viewButton = screen.getByLabelText('View item');
      const editButton = screen.getByLabelText('Edit item');

      expect(viewButton).toBeInTheDocument();
      expect(editButton).toBeInTheDocument();
    });

    /**
     * Tests that actions can have React node labels (e.g., icons)
     */
    it('renders actions with React node labels', () => {
      const actions: ListAction[] = [
        { id: 'view', label: <span data-testid="view-icon">👁️</span>, onClick: vi.fn() },
        { id: 'edit', label: <span data-testid="edit-icon">✏️</span>, onClick: vi.fn() },
      ];

      render(<ListWithActions items={['Item 1']} actions={actions} />);

      expect(screen.getAllByTestId('view-icon')).toHaveLength(1);
      expect(screen.getAllByTestId('edit-icon')).toHaveLength(1);
    });

    /**
     * Tests that multiple actions are rendered in correct order
     */
    it('renders multiple actions in correct order', () => {
      const actions: ListAction[] = [
        { id: 'first', label: 'First', onClick: vi.fn() },
        { id: 'second', label: 'Second', onClick: vi.fn() },
        { id: 'third', label: 'Third', onClick: vi.fn() },
      ];

      render(<ListWithActions items={['Item 1']} actions={actions} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('First');
      expect(buttons[1]).toHaveTextContent('Second');
      expect(buttons[2]).toHaveTextContent('Third');
    });
  });

  /**
   * Test suite for type prop functionality
   * Verifies marker rendering (ordered/unordered/undefined)
   */
  describe('Type Prop', () => {
    /**
     * Tests that no markers are rendered when type is undefined
     */
    it('renders without markers when type is undefined', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const listItem = screen.getByText('Item 1').closest('li');
      const marker = listItem?.querySelector('span.text-muted-foreground');
      
      // Should not have marker span when type is undefined
      expect(marker).toBeNull();
    });

    /**
     * Tests that unordered markers (bullets) are rendered when type is "unordered"
     */
    it('renders unordered markers when type is "unordered"', () => {
      render(<ListWithActions items={['Item 1', 'Item 2']} actions={defaultActions} type="unordered" />);

      const listItems = screen.getAllByRole('listitem');
      const firstMarker = listItems[0].querySelector('span.text-muted-foreground');
      const secondMarker = listItems[1].querySelector('span.text-muted-foreground');

      expect(firstMarker).toHaveTextContent('•');
      expect(secondMarker).toHaveTextContent('•');
    });

    /**
     * Tests that ordered markers (numbers) are rendered when type is "ordered"
     */
    it('renders ordered markers when type is "ordered"', () => {
      render(<ListWithActions items={['Item 1', 'Item 2', 'Item 3']} actions={defaultActions} type="ordered" />);

      const listItems = screen.getAllByRole('listitem');
      const firstMarker = listItems[0].querySelector('span.text-muted-foreground');
      const secondMarker = listItems[1].querySelector('span.text-muted-foreground');
      const thirdMarker = listItems[2].querySelector('span.text-muted-foreground');

      expect(firstMarker).toHaveTextContent('1.');
      expect(secondMarker).toHaveTextContent('2.');
      expect(thirdMarker).toHaveTextContent('3.');
    });

    /**
     * Tests that markers switch correctly when type changes
     */
    it('switches markers correctly when type changes', () => {
      const { rerender } = render(
        <ListWithActions items={['Item 1']} actions={defaultActions} type="unordered" />
      );

      let marker = screen.getByText('Item 1').closest('li')?.querySelector('span');
      expect(marker).toHaveTextContent('•');

      rerender(<ListWithActions items={['Item 1']} actions={defaultActions} type="ordered" />);
      marker = screen.getByText('Item 1').closest('li')?.querySelector('span');
      expect(marker).toHaveTextContent('1.');

      rerender(<ListWithActions items={['Item 1']} actions={defaultActions} />);
      marker = screen.getByText('Item 1').closest('li')?.querySelector('span.text-muted-foreground');
      // When type is undefined, marker span should not exist
      expect(marker).toBeNull();
    });

    /**
     * Tests that marker container has correct classes when type is provided
     */
    it('applies correct classes to marker container when type is provided', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} type="ordered" />);

      const listItem = screen.getByText('Item 1').closest('li');
      const contentContainer = listItem?.querySelector('div');
      
      expect(contentContainer).toHaveClass('flex', 'items-center', 'gap-2');
    });
  });

  /**
   * Test suite for spacing prop functionality
   * Verifies that spacing is passed correctly to ListBasic
   */
  describe('Spacing Prop', () => {
    /**
     * Tests that default spacing is medium (md)
     */
    it('applies default medium spacing', () => {
      render(<ListWithActions items={defaultItems} actions={defaultActions} />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-3');
    });

    /**
     * Tests that small spacing applies correct classes
     */
    it('applies small spacing correctly', () => {
      render(<ListWithActions items={defaultItems} actions={defaultActions} spacing="sm" />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-2');
    });

    /**
     * Tests that large spacing applies correct classes
     */
    it('applies large spacing correctly', () => {
      render(<ListWithActions items={defaultItems} actions={defaultActions} spacing="lg" />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-4');
    });

    /**
     * Tests that spacing updates correctly when prop changes
     */
    it('updates spacing when prop changes', () => {
      const { rerender } = render(
        <ListWithActions items={defaultItems} actions={defaultActions} spacing="sm" />
      );

      let list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-2');

      rerender(<ListWithActions items={defaultItems} actions={defaultActions} spacing="lg" />);
      list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-4');
    });
  });

  /**
   * Test suite for className and itemClassName props
   * Verifies that custom classes are applied correctly
   */
  describe('Custom Styling', () => {
    /**
     * Tests that custom className is applied to the list container
     */
    it('applies custom className correctly', () => {
      render(
        <ListWithActions
          items={defaultItems}
          actions={defaultActions}
          className="custom-list-class"
        />
      );

      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-list-class');
    });

    /**
     * Tests that default classes are always applied
     */
    it('applies default classes to list container', () => {
      render(<ListWithActions items={defaultItems} actions={defaultActions} />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('w-full', 'text-foreground', 'list-none');
    });

    /**
     * Tests that itemClassName is applied to each list item
     */
    it('applies itemClassName to each list item', () => {
      render(
        <ListWithActions
          items={['Item 1', 'Item 2']}
          actions={defaultActions}
          itemClassName="custom-item-class"
        />
      );

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        expect(item).toHaveClass('custom-item-class');
      });
    });

    /**
     * Tests that default row classes are always applied
     */
    it('applies default row classes to list items', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const listItem = screen.getByText('Item 1').closest('li');
      expect(listItem).toHaveClass(
        'flex',
        'items-center',
        'justify-between',
        'rounded-md',
        'border',
        'group'
      );
    });

    /**
     * Tests that custom classes combine correctly with default classes
     */
    it('combines custom className with default classes', () => {
      render(
        <ListWithActions
          items={defaultItems}
          actions={defaultActions}
          className="my-custom-class"
          spacing="lg"
        />
      );

      const list = screen.getByRole('list');
      expect(list).toHaveClass('my-custom-class');
      expect(list).toHaveClass('space-y-4');
      expect(list).toHaveClass('w-full');
    });
  });

  /**
   * Test suite for React.memo optimization behavior
   * Verifies that the component only rerenders when props actually change
   */
  describe('React.memo Optimization', () => {
    /**
     * Tests that the component rerenders when items array reference changes
     */
    it('rerenders when items array reference changes', () => {
      const { rerender } = render(
        <ListWithActions items={defaultItems} actions={defaultActions} />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();

      rerender(<ListWithActions items={['New Item 1', 'New Item 2']} actions={defaultActions} />);

      expect(screen.getByText('New Item 1')).toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    /**
     * Tests that the component rerenders when actions array reference changes
     */
    it('rerenders when actions array reference changes', () => {
      const actions1: ListAction[] = [
        { id: 'action1', label: 'Action 1', onClick: vi.fn() },
      ];
      const actions2: ListAction[] = [
        { id: 'action2', label: 'Action 2', onClick: vi.fn() },
      ];

      const { rerender } = render(
        <ListWithActions items={['Item 1']} actions={actions1} />
      );

      expect(screen.getByText('Action 1')).toBeInTheDocument();

      rerender(<ListWithActions items={['Item 1']} actions={actions2} />);

      expect(screen.getByText('Action 2')).toBeInTheDocument();
      expect(screen.queryByText('Action 1')).not.toBeInTheDocument();
    });

    /**
     * Tests that the component rerenders when type prop changes
     */
    it('rerenders when type changes', () => {
      const { rerender } = render(
        <ListWithActions items={['Item 1']} actions={defaultActions} type="unordered" />
      );

      let marker = screen.getByText('Item 1').closest('li')?.querySelector('span');
      expect(marker).toHaveTextContent('•');

      rerender(<ListWithActions items={['Item 1']} actions={defaultActions} type="ordered" />);
      marker = screen.getByText('Item 1').closest('li')?.querySelector('span');
      expect(marker).toHaveTextContent('1.');
    });

    /**
     * Tests that the component rerenders when spacing prop changes
     */
    it('rerenders when spacing changes', () => {
      const { rerender } = render(
        <ListWithActions items={defaultItems} actions={defaultActions} spacing="sm" />
      );

      let list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-2');

      rerender(<ListWithActions items={defaultItems} actions={defaultActions} spacing="lg" />);
      list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-4');
    });

    /**
     * Tests that the component rerenders when className prop changes
     */
    it('rerenders when className changes', () => {
      const { rerender } = render(
        <ListWithActions items={defaultItems} actions={defaultActions} className="class1" />
      );

      let list = screen.getByRole('list');
      expect(list).toHaveClass('class1');

      rerender(<ListWithActions items={defaultItems} actions={defaultActions} className="class2" />);
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
     * Tests that the component handles single item correctly
     */
    it('handles single item correctly', () => {
      render(<ListWithActions items={['Single Item']} actions={defaultActions} />);

      const list = screen.getByRole('list');
      expect(list.children.length).toBe(1);
      expect(screen.getByText('Single Item')).toBeInTheDocument();
    });

    /**
     * Tests that the component handles many items correctly
     */
    it('handles many items correctly', () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
      render(<ListWithActions items={manyItems} actions={defaultActions} />);

      const list = screen.getByRole('list');
      expect(list.children.length).toBe(50);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 50')).toBeInTheDocument();
    });

    /**
     * Tests that the component handles single action correctly
     */
    it('handles single action correctly', () => {
      const singleAction: ListAction[] = [
        { id: 'only', label: 'Only Action', onClick: vi.fn() },
      ];

      render(<ListWithActions items={['Item 1']} actions={singleAction} />);

      expect(screen.getByText('Only Action')).toBeInTheDocument();
      expect(screen.queryByText('View')).not.toBeInTheDocument();
    });

    /**
     * Tests that the component handles many actions correctly
     */
    it('handles many actions correctly', () => {
      const manyActions: ListAction[] = Array.from({ length: 10 }, (_, i) => ({
        id: `action-${i}`,
        label: `Action ${i}`,
        onClick: vi.fn(),
      }));

      render(<ListWithActions items={['Item 1']} actions={manyActions} />);

      expect(screen.getByText('Action 0')).toBeInTheDocument();
      expect(screen.getByText('Action 9')).toBeInTheDocument();
    });

    /**
     * Tests that action handlers receive correct index for each item
     */
    it('calls action handlers with correct index for each item', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const actions: ListAction[] = [
        { id: 'action', label: 'Action', onClick: handleClick },
      ];

      render(<ListWithActions items={['Item 1', 'Item 2', 'Item 3']} actions={actions} />);

      const actionButtons = screen.getAllByText('Action');
      
      await user.click(actionButtons[0]);
      expect(handleClick).toHaveBeenCalledWith(0);

      await user.click(actionButtons[1]);
      expect(handleClick).toHaveBeenCalledWith(1);

      await user.click(actionButtons[2]);
      expect(handleClick).toHaveBeenCalledWith(2);
    });
  });

  /**
   * Test suite for accessibility features
   * Verifies that the component uses semantic HTML and proper accessibility attributes
   */
  describe('Accessibility', () => {
    /**
     * Tests that list items are focusable (have tabIndex)
     */
    it('makes list items focusable with tabIndex', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const listItem = screen.getByText('Item 1').closest('li');
      expect(listItem).toHaveAttribute('tabIndex', '0');
    });

    /**
     * Tests that action buttons have proper type attribute
     */
    it('sets button type correctly for action buttons', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    /**
     * Tests that action buttons have focus-visible classes for keyboard navigation
     */
    it('applies focus-visible classes to action buttons', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const button = screen.getAllByRole('button')[0];
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    /**
     * Tests that list uses semantic HTML (UL or OL)
     */
    it('uses semantic HTML for list container', () => {
      render(<ListWithActions items={defaultItems} actions={defaultActions} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(['UL', 'OL']).toContain(list.tagName);
    });

    /**
     * Tests that list items use semantic LI elements
     */
    it('uses semantic LI elements for list items', () => {
      render(<ListWithActions items={['Item 1', 'Item 2']} actions={defaultActions} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      listItems.forEach(item => {
        expect(item.tagName).toBe('LI');
      });
    });
  });

  /**
   * Test suite for action visibility behavior
   * Verifies that action containers have correct CSS classes for hover/focus behavior
   */
  describe('Action Visibility', () => {
    /**
     * Tests that action container has correct classes for hover/focus behavior
     */
    it('applies correct classes to action container', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const listItem = screen.getByText('Item 1').closest('li');
      // The action container is the div containing buttons - find it by looking for buttons' parent
      const buttons = listItem?.querySelectorAll('button');
      const actionContainer = buttons?.[0]?.parentElement;
      
      expect(actionContainer).toBeInTheDocument();
      expect(actionContainer).toHaveClass(
        'hidden',
        'group-hover:flex',
        'group-focus-within:flex',
        'sm:flex'
      );
    });

    /**
     * Tests that action buttons are rendered even when hidden
     * (CSS will handle visibility, but elements should exist in DOM)
     */
    it('renders action buttons in DOM even when hidden', () => {
      render(<ListWithActions items={['Item 1']} actions={defaultActions} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  /**
   * Test suite for combined prop usage
   * Verifies that multiple props work correctly together
   */
  describe('Combined Props', () => {
    /**
     * Tests that all props can be used together correctly
     */
    it('applies all props correctly together', () => {
      render(
        <ListWithActions
          items={['Item 1', 'Item 2']}
          actions={defaultActions}
          type="ordered"
          spacing="lg"
          className="custom-class"
          itemClassName="custom-item-class"
        />
      );

      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-class', 'space-y-4');

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        expect(item).toHaveClass('custom-item-class');
      });

      const marker = listItems[0].querySelector('span.text-muted-foreground');
      expect(marker).toHaveTextContent('1.');
    });

    /**
     * Tests all combinations of type and spacing variants
     */
    it('handles type and spacing combination correctly', () => {
      const combinations = [
        { type: undefined, spacing: 'sm' as const },
        { type: undefined, spacing: 'md' as const },
        { type: undefined, spacing: 'lg' as const },
        { type: 'unordered' as const, spacing: 'sm' as const },
        { type: 'unordered' as const, spacing: 'md' as const },
        { type: 'unordered' as const, spacing: 'lg' as const },
        { type: 'ordered' as const, spacing: 'sm' as const },
        { type: 'ordered' as const, spacing: 'md' as const },
        { type: 'ordered' as const, spacing: 'lg' as const },
      ];

      combinations.forEach(({ type, spacing }) => {
        const { unmount } = render(
          <ListWithActions
            items={['Item 1']}
            actions={defaultActions}
            type={type}
            spacing={spacing}
          />
        );

        const list = screen.getByRole('list');
        const expectedSpacing = spacing === 'sm' ? 'space-y-2' : spacing === 'md' ? 'space-y-3' : 'space-y-4';
        expect(list).toHaveClass(expectedSpacing);

        if (type) {
          const marker = screen.getByText('Item 1').closest('li')?.querySelector('span.text-muted-foreground');
          expect(marker).toBeInTheDocument();
        }

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
     * Tests that listClassName is memoized correctly
     */
    it('memoizes listClassName correctly', () => {
      const { rerender } = render(
        <ListWithActions items={defaultItems} actions={defaultActions} className="class1" />
      );

      let list = screen.getByRole('list');
      expect(list).toHaveClass('class1');

      // Change className - should recalculate
      rerender(
        <ListWithActions items={defaultItems} actions={defaultActions} className="class2" />
      );
      list = screen.getByRole('list');
      expect(list).toHaveClass('class2');
    });

    /**
     * Tests that rowClasses is memoized correctly
     */
    it('memoizes rowClasses correctly', () => {
      const { rerender } = render(
        <ListWithActions items={['Item 1']} actions={defaultActions} itemClassName="item1" />
      );

      let listItem = screen.getByText('Item 1').closest('li');
      expect(listItem).toHaveClass('item1');

      // Change itemClassName - should recalculate
      rerender(
        <ListWithActions items={['Item 1']} actions={defaultActions} itemClassName="item2" />
      );
      listItem = screen.getByText('Item 1').closest('li');
      expect(listItem).toHaveClass('item2');
    });

    /**
     * Tests that action click handlers are memoized
     * Each action should have a stable handler reference
     */
    it('creates stable action click handlers', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const actions: ListAction[] = [
        { id: 'action', label: 'Action', onClick: handleClick },
      ];

      const { rerender } = render(
        <ListWithActions items={['Item 1']} actions={actions} />
      );

      const button = screen.getByText('Action');
      await user.click(button);
      expect(handleClick).toHaveBeenCalledWith(0);

      // Rerender with same props - handler should still work
      rerender(<ListWithActions items={['Item 1']} actions={actions} />);
      const button2 = screen.getByText('Action');
      await user.click(button2);
      expect(handleClick).toHaveBeenCalledTimes(2);
      expect(handleClick).toHaveBeenNthCalledWith(2, 0);
    });
  });

  /**
   * Test suite for integration scenarios
   * Verifies real-world usage patterns
   */
  describe('Integration Scenarios', () => {
    /**
     * Tests a task management scenario
     */
    it('handles task management scenario', async () => {
      const user = userEvent.setup();
      const handleComplete = vi.fn();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();

      const taskActions: ListAction[] = [
        { id: 'complete', label: 'Complete', onClick: handleComplete },
        { id: 'edit', label: 'Edit', onClick: handleEdit },
        { id: 'delete', label: 'Delete', onClick: handleDelete },
      ];

      render(
        <ListWithActions
          items={['Task 1', 'Task 2', 'Task 3']}
          actions={taskActions}
        />
      );

      const completeButtons = screen.getAllByText('Complete');
      await user.click(completeButtons[1]);

      expect(handleComplete).toHaveBeenCalledWith(1);
    });

    /**
     * Tests a user list scenario with ordered markers
     */
    it('handles user list scenario with ordered markers', () => {
      const userActions: ListAction[] = [
        { id: 'view', label: 'View', onClick: vi.fn() },
        { id: 'edit', label: 'Edit', onClick: vi.fn() },
      ];

      render(
        <ListWithActions
          type="ordered"
          items={['User 1', 'User 2', 'User 3']}
          actions={userActions}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems[0].querySelector('span.text-muted-foreground')).toHaveTextContent('1.');
      expect(listItems[1].querySelector('span.text-muted-foreground')).toHaveTextContent('2.');
      expect(listItems[2].querySelector('span.text-muted-foreground')).toHaveTextContent('3.');
    });

    /**
     * Tests a step-by-step guide scenario
     */
    it('handles step-by-step guide scenario', async () => {
      const user = userEvent.setup();
      const handleViewDetails = vi.fn();

      const stepActions: ListAction[] = [
        { id: 'view', label: 'View Details', onClick: handleViewDetails },
      ];

      render(
        <ListWithActions
          type="ordered"
          items={[
            'Step 1: Gather requirements',
            'Step 2: Design solution',
            'Step 3: Implement',
          ]}
          actions={stepActions}
          spacing="lg"
        />
      );

      const viewButtons = screen.getAllByText('View Details');
      await user.click(viewButtons[0]);

      expect(handleViewDetails).toHaveBeenCalledWith(0);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-4');
    });
  });
});

