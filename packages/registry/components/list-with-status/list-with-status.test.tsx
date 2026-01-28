/**
 * Unit Tests for ListWithStatus Component
 *
 * This test suite covers the core behavior of the ListWithStatus component:
 * - Basic rendering with titles, descriptions, and status badges
 * - Marker rendering for ordered/unordered lists
 * - Spacing and custom className / itemClassName handling
 * - Click handler behavior
 * - Accessibility and semantic HTML structure
 *
 * @file list-with-status.test.tsx
 */

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach, vi } from "vitest";
import "@testing-library/jest-dom";
import { ListWithStatus, type ListItemWithStatus } from "./index";

describe("ListWithStatus", () => {
  /**
   * Default test items used across multiple test cases.
   */
  const defaultItems: ListItemWithStatus[] = [
    {
      id: "1",
      title: "Payment Processed",
      description: "Your payment has been successfully processed",
      status: "success",
    },
    {
      id: "2",
      title: "Order Failed",
      description: "Unable to process your order",
      status: "error",
    },
  ];

  /**
   * Clean up after each test to prevent test interference.
   */
  afterEach(() => {
    cleanup();
  });

  /**
   * Test suite for basic rendering functionality.
   */
  describe("Basic Rendering", () => {
    /**
     * Renders the component with required props and verifies
     * that titles and descriptions are visible.
     */
    it("renders titles and descriptions for each item", () => {
      render(<ListWithStatus items={defaultItems} />);

      expect(screen.getByText("Payment Processed")).toBeInTheDocument();
      expect(
        screen.getByText("Your payment has been successfully processed"),
      ).toBeInTheDocument();
      expect(screen.getByText("Order Failed")).toBeInTheDocument();
      expect(
        screen.getByText("Unable to process your order"),
      ).toBeInTheDocument();
    });

    /**
     * Ensures the component renders an empty list gracefully
     * when items array is empty.
     */
    it("renders empty list when items array is empty", () => {
      render(<ListWithStatus items={[]} />);

      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(list.children.length).toBe(0);
    });

    /**
     * Verifies that the component is defined and memoized.
     */
    it("is defined and memoized", () => {
      expect(ListWithStatus).toBeDefined();
      expect(typeof ListWithStatus).toBe("object");
    });
  });

  /**
   * Test suite for status badge rendering behavior.
   */
  describe("Status Badges", () => {
    /**
     * Tests that badges are rendered for each item with default labels.
     */
    it("renders status badges with default labels", () => {
      render(<ListWithStatus items={defaultItems} />);

      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    /**
     * Tests that custom status labels override defaults.
     */
    it("renders custom status labels when provided", () => {
      const items: ListItemWithStatus[] = [
        {
          id: "1",
          title: "Custom Label",
          status: "success",
          statusLabel: "Completed",
        },
      ];

      render(<ListWithStatus items={items} />);

      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.queryByText("Success")).not.toBeInTheDocument();
    });

    /**
     * Tests that aria-label is applied to status badges.
     */
    it("applies aria-label to status badges", () => {
      render(<ListWithStatus items={defaultItems} />);

      const successBadge = screen.getByLabelText("Status: Success");
      const errorBadge = screen.getByLabelText("Status: Error");

      expect(successBadge).toBeInTheDocument();
      expect(errorBadge).toBeInTheDocument();
    });
  });

  /**
   * Test suite for marker and spacing behavior.
   */
  describe("Type and Spacing", () => {
    /**
     * Tests that unordered markers (bullets) are rendered when type is "unordered".
     */
    it('renders unordered markers when type is "unordered"', () => {
      render(<ListWithStatus items={defaultItems} type="unordered" />);

      const listItems = screen.getAllByRole("listitem");
      const firstMarker =
        listItems[0].querySelector("span.text-muted-foreground");
      const secondMarker =
        listItems[1].querySelector("span.text-muted-foreground");

      expect(firstMarker).toHaveTextContent("•");
      expect(secondMarker).toHaveTextContent("•");
    });

    /**
     * Tests that ordered markers (numbers) are rendered when type is "ordered".
     */
    it('renders ordered markers when type is "ordered"', () => {
      render(<ListWithStatus items={defaultItems} type="ordered" />);

      const listItems = screen.getAllByRole("listitem");
      const firstMarker =
        listItems[0].querySelector("span.text-muted-foreground");
      const secondMarker =
        listItems[1].querySelector("span.text-muted-foreground");

      expect(firstMarker).toHaveTextContent("1.");
      expect(secondMarker).toHaveTextContent("2.");
    });

    /**
     * Tests that spacing classes from ListBasic are applied for different spacing values.
     * (Relies on ListBasic using space-y-* classes.)
     */
    it("applies spacing classes via ListBasic", () => {
      const { rerender } = render(
        <ListWithStatus items={defaultItems} spacing="sm" />,
      );

      let list = screen.getByRole("list");
      expect(list.className).toContain("space-y-2");

      rerender(<ListWithStatus items={defaultItems} spacing="md" />);
      list = screen.getByRole("list");
      expect(list.className).toContain("space-y-3");

      rerender(<ListWithStatus items={defaultItems} spacing="lg" />);
      list = screen.getByRole("list");
      expect(list.className).toContain("space-y-4");
    });
  });

  /**
   * Test suite for custom styling behavior.
   */
  describe("Custom Styling", () => {
    /**
     * Tests that custom className is applied to the list container.
     */
    it("applies custom className to the list container", () => {
      render(
        <ListWithStatus
          items={defaultItems}
          className="custom-list-class"
        />,
      );

      const list = screen.getByRole("list");
      expect(list).toHaveClass("custom-list-class");
    });

    /**
     * Tests that itemClassName is applied to each list item row container.
     */
    it("applies itemClassName to each row container", () => {
      render(
        <ListWithStatus
          items={defaultItems}
          itemClassName="custom-item-class"
        />,
      );

      const listItems = screen.getAllByRole("listitem");
      listItems.forEach((li) => {
        const row = li.firstElementChild as HTMLElement | null;
        expect(row).toBeInTheDocument();
        if (row) {
          expect(row).toHaveClass("custom-item-class");
        }
      });
    });
  });

  /**
   * Test suite for click handler behavior.
   */
  describe("Click Handlers", () => {
    /**
     * Tests that onItemClick handler is called when clicking on a row.
     */
    it("calls onItemClick when clicking on a row", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <ListWithStatus
          items={defaultItems}
          onItemClick={handleClick}
        />,
      );

      const listItem = screen.getByText("Payment Processed").closest("li");
      expect(listItem).toBeInTheDocument();

      const row = listItem?.firstElementChild as HTMLElement | null;
      expect(row).toBeInTheDocument();

      if (row) {
        await user.click(row);
      }

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(defaultItems[0], 0);
    });
  });

  /**
   * Test suite for accessibility and semantics.
   */
  describe("Accessibility and Semantics", () => {
    /**
     * Tests that the component uses semantic UL/OL for the list container.
     */
    it("uses semantic UL or OL for list container", () => {
      render(<ListWithStatus items={defaultItems} />);

      const list = screen.getByRole("list");
      expect(["UL", "OL"]).toContain(list.tagName);
    });

    /**
     * Tests that list items are rendered as LI elements.
     */
    it("uses LI elements for list items", () => {
      render(<ListWithStatus items={defaultItems} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBe(defaultItems.length);
      listItems.forEach((item) => {
        expect(item.tagName).toBe("LI");
      });
    });
  });
});

