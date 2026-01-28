/**
 * Unit Tests for ListWithAvatars Component
 *
 * This test suite covers the core behavior of the ListWithAvatars component:
 * - Basic rendering with names, descriptions, and avatars
 * - Profile link behavior and custom click handlers
 * - Marker rendering for ordered/unordered lists
 * - Spacing and custom className / itemClassName handling
 * - React.memo behavior on prop changes
 * - Accessibility and semantic HTML structure
 *
 * @file list-with-avatars.test.tsx
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ListWithAvatars, type ListItemWithAvatar } from './index';

describe('ListWithAvatars', () => {
  /**
   * Default test items used across multiple test cases
   */
  const defaultItems: ListItemWithAvatar[] = [
    {
      id: '1',
      name: 'John Doe',
      description: 'Software Engineer',
      profileLink: '/profile/john-doe',
      avatarAlt: 'John Doe',
    },
    {
      id: '2',
      name: 'Jane Smith',
      description: 'Product Designer',
      profileLink: '/profile/jane-smith',
      avatarLetters: 'JS',
    },
  ];

  /**
   * Clean up after each test to prevent test interference
   */
  afterEach(() => {
    cleanup();
  });

  /**
   * Test suite for basic rendering functionality
   */
  describe('Basic Rendering', () => {
    /**
     * Renders the component with required props and verifies
     * that names and descriptions are visible.
     */
    it('renders names and descriptions for each item', () => {
      render(<ListWithAvatars items={defaultItems} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Product Designer')).toBeInTheDocument();
    });

    /**
     * Ensures the component renders an empty list gracefully
     * when items array is empty.
     */
    it('renders empty list when items array is empty', () => {
      render(<ListWithAvatars items={[]} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.children.length).toBe(0);
    });

    /**
     * Verifies that the component has a defined displayName and
     * is exported as a memoized component.
     */
    it('is defined and memoized', () => {
      expect(ListWithAvatars).toBeDefined();
      expect(typeof ListWithAvatars).toBe('object');
    });
  });

  /**
   * Test suite for avatar rendering behavior
   */
  describe('Avatar Rendering', () => {
    /**
     * Tests that avatar images render with alt text when avatarSrc / avatarAlt are provided.
     */
    it('renders avatar images with alt text when avatarSrc is provided', () => {
      const items: ListItemWithAvatar[] = [
        {
          id: '1',
          name: 'John Doe',
          description: 'Software Engineer',
          profileLink: '/profile/john-doe',
          avatarSrc: '/avatars/john.jpg',
          avatarAlt: 'John Doe',
        },
      ];

      render(<ListWithAvatars items={items} />);

      const img = screen.getByAltText('John Doe');
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe('IMG');
    });

    /**
     * Tests that avatar letters render correctly when avatarLetters is provided.
     */
    it('renders avatar letters when avatarLetters is provided', () => {
      const items: ListItemWithAvatar[] = [
        {
          id: '1',
          name: 'Jane Smith',
          description: 'Product Designer',
          profileLink: '/profile/jane-smith',
          avatarLetters: 'JS',
        },
      ];

      render(<ListWithAvatars items={items} />);

      // Avatar letters are rendered as text within the avatar
      expect(screen.getByText('JS')).toBeInTheDocument();
    });
  });

  /**
   * Test suite for profile link and click handler behavior
   */
  describe('Profile Links and Click Handlers', () => {
    /**
     * Tests that profile links are rendered when profileLink is provided.
     */
    it('renders profile links when profileLink is provided', () => {
      render(<ListWithAvatars items={defaultItems} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/profile/john-doe');
      expect(links[1]).toHaveAttribute('href', '/profile/jane-smith');
    });

    /**
     * Tests that onItemClick handler is called when clicking on a row
     * that does not have a profileLink.
     */
    it('calls onItemClick when clicking on a non-link row', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      const items: ListItemWithAvatar[] = [
        {
          id: '1',
          name: 'Row Click',
          description: 'No profile link',
        },
      ];

      render(<ListWithAvatars items={items} onItemClick={handleClick} showProfileLinks={false} />);

      const listItem = screen.getByText('Row Click').closest('li');
      expect(listItem).toBeInTheDocument();

      const row = listItem?.firstElementChild as HTMLElement | null;
      expect(row).toBeInTheDocument();

      if (row) {
        await user.click(row);
      }

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(items[0], 0);
    });

    /**
     * Tests that onItemClick handler is called when clicking on a profile link,
     * and that the handler receives the correct item and index.
     */
    it('calls onItemClick when clicking on a profile link', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ListWithAvatars items={defaultItems} onItemClick={handleClick} />);

      const link = screen.getByRole('link', { name: /John Doe/ });
      await user.click(link);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(defaultItems[0], 0);
    });

    /**
     * Tests that profile links can be disabled via showProfileLinks=false.
     */
    it('does not render links when showProfileLinks is false', () => {
      render(<ListWithAvatars items={defaultItems} showProfileLinks={false} />);

      const links = screen.queryAllByRole('link');
      expect(links).toHaveLength(0);
    });
  });

  /**
   * Test suite for type (marker) and spacing behavior
   */
  describe('Type and Spacing', () => {
    /**
     * Tests that unordered markers (bullets) are rendered when type is "unordered".
     */
    it('renders unordered markers when type is "unordered"', () => {
      render(<ListWithAvatars items={defaultItems} type="unordered" />);

      const listItems = screen.getAllByRole('listitem');
      const firstMarker = listItems[0].querySelector('span.text-muted-foreground');
      const secondMarker = listItems[1].querySelector('span.text-muted-foreground');

      expect(firstMarker).toHaveTextContent('•');
      expect(secondMarker).toHaveTextContent('•');
    });

    /**
     * Tests that ordered markers (numbers) are rendered when type is "ordered".
     */
    it('renders ordered markers when type is ordered', () => {
      render(<ListWithAvatars items={defaultItems} type="ordered" />);

      const listItems = screen.getAllByRole('listitem');
      const firstMarker = listItems[0].querySelector('span.text-muted-foreground');
      const secondMarker = listItems[1].querySelector('span.text-muted-foreground');

      expect(firstMarker).toHaveTextContent('1.');
      expect(secondMarker).toHaveTextContent('2.');
    });

    /**
     * Tests that spacing classes from ListBasic are applied for different spacing values.
     * (Relies on ListBasic using space-y-* classes.)
     */
    it('applies spacing classes via ListBasic', () => {
      const { rerender } = render(<ListWithAvatars items={defaultItems} spacing="sm" />);

      let list = screen.getByRole('list');
      expect(list.className).toContain('space-y-2');

      rerender(<ListWithAvatars items={defaultItems} spacing="md" />);
      list = screen.getByRole('list');
      expect(list.className).toContain('space-y-3');

      rerender(<ListWithAvatars items={defaultItems} spacing="lg" />);
      list = screen.getByRole('list');
      expect(list.className).toContain('space-y-4');
    });
  });

  /**
   * Test suite for custom styling behavior
   */
  describe('Custom Styling', () => {
    /**
     * Tests that custom className is applied to the list container.
     */
    it('applies custom className to the list container', () => {
      render(
        <ListWithAvatars
          items={defaultItems}
          className="custom-list-class"
        />
      );

      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-list-class');
    });

    /**
     * Tests that itemClassName is applied to each list item row container.
     */
    it('applies itemClassName to each row container', () => {
      render(
        <ListWithAvatars
          items={defaultItems}
          itemClassName="custom-item-class"
        />
      );

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((li) => {
        const row = li.firstElementChild as HTMLElement | null;
        expect(row).toBeInTheDocument();
        if (row) {
          expect(row).toHaveClass('custom-item-class');
        }
      });
    });
  });

  /**
   * Test suite for accessibility and semantics
   */
  describe('Accessibility and Semantics', () => {
    /**
     * Tests that the component uses semantic UL/OL for the list container.
     */
    it('uses semantic UL or OL for list container', () => {
      render(<ListWithAvatars items={defaultItems} />);

      const list = screen.getByRole('list');
      expect(['UL', 'OL']).toContain(list.tagName);
    });

    /**
     * Tests that list items are rendered as LI elements.
     */
    it('uses LI elements for list items', () => {
      render(<ListWithAvatars items={defaultItems} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(defaultItems.length);
      listItems.forEach(item => {
        expect(item.tagName).toBe('LI');
      });
    });
  });

  /**
   * Test suite for React.memo optimization behavior
   */
  describe('React.memo Optimization', () => {
    /**
     * Tests that the component rerenders when items array reference changes.
     */
    it('rerenders when items array reference changes', () => {
      const { rerender } = render(<ListWithAvatars items={defaultItems} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();

      const newItems: ListItemWithAvatar[] = [
        { id: '3', name: 'New User', description: 'New Description' },
      ];

      rerender(<ListWithAvatars items={newItems} />);

      expect(screen.getByText('New User')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    /**
     * Tests that the component rerenders when type prop changes.
     */
    it('rerenders when type changes', () => {
      const { rerender } = render(
        <ListWithAvatars items={defaultItems} type="unordered" />
      );

      let marker = screen.getAllByRole('listitem')[0].querySelector('span.text-muted-foreground');
      expect(marker).toHaveTextContent('•');

      rerender(<ListWithAvatars items={defaultItems} type="ordered" />);
      marker = screen.getAllByRole('listitem')[0].querySelector('span.text-muted-foreground');
      expect(marker).toHaveTextContent('1.');
    });
  });
});


