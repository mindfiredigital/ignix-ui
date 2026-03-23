/**
 * @fileoverview Unit tests for the MegaMenuMultiColumnDropdown registry template.
 *
 * These tests focus on:
 * - Basic rendering of the trigger and columns
 * - Hover / keyboard behaviour for opening and closing the menu
 * - Link selection callbacks (including nested children)
 * - CTA rendering and click handling
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  MegaMenuMultiColumnDropdown,
  type MegaMenuColumn,
  type MegaMenuLinkItem,
} from "./index";

// Mock Button to avoid pulling in full design system behaviour
vi.mock("@ignix-ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
    type = "button",
    ...rest
  }: any) => (
    <button type={type} onClick={onClick} className={className} {...rest}>
      {children}
    </button>
  ),
}));

// Mock cn utility so className joining works in tests
vi.mock("../../../utils/cn", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

/**
 * Minimal helper to build test columns with optional nested children.
 */
const buildColumns = (withNested = false): MegaMenuColumn[] => {
  const analyticsChildren: MegaMenuLinkItem[] = withNested
    ? [
        {
          label: "Dashboards",
          href: "/analytics/dashboards",
        },
        {
          label: "Reports",
          href: "/analytics/reports",
          children: [
            {
              label: "Daily",
              href: "/analytics/reports/daily",
            },
          ],
        },
      ]
    : [];

  return [
    {
      header: "Analytics",
      links: [
        {
          label: "Overview",
          href: "/analytics/overview",
        },
        {
          label: "Events",
          href: "/analytics/events",
          children: analyticsChildren,
        },
      ],
    },
    {
      header: "Workflows",
      links: [
        {
          label: "Automations",
          href: "/workflows/automations",
        },
      ],
    },
  ];
};

describe("MegaMenuMultiColumnDropdown", () => {

  it("renders trigger button with provided label", () => {
    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Products"
        columns={buildColumns()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /products/i }),
    ).toBeInTheDocument();
  });

  it("opens menu on hover and calls onOpen callback", async () => {
    const user = userEvent.setup({ delay: null });
    const handleOpen = vi.fn();

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Products"
        columns={buildColumns()}
        onOpen={handleOpen}
      />,
    );

    const trigger = screen.getByRole("button", { name: /products/i });
    await user.hover(trigger);

    const panel = await screen.findByRole("menu", { name: /menu/i });
    expect(panel).toBeVisible();
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });

  it("closes menu on mouse leave and calls onClose callback", async () => {
    const user = userEvent.setup({ delay: null });
    const handleClose = vi.fn();

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Products"
        columns={buildColumns()}
        onClose={handleClose}
      />,
    );

    const trigger = screen.getByRole("button", { name: /products/i });
    await user.hover(trigger);

    const panel = await screen.findByRole("menu", { name: /menu/i });
    expect(panel).toBeVisible();

    // Mouse leave nav wrapper
    await user.unhover(trigger);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it("supports keyboard interaction on trigger (Enter / ArrowDown / Escape)", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Solutions"
        columns={buildColumns()}
      />,
    );

    const trigger = screen.getByRole("button", { name: /solutions/i });
    trigger.focus();

    // Enter opens
    await user.keyboard("{Enter}");
    const panel = screen.getByRole("menu", { name: /menu/i });
    expect(panel).toBeVisible();

    // ArrowDown should move focus to the first top-level link
    await user.keyboard("{ArrowDown}");
    const firstLink = screen.getByRole("link", { name: "Overview" });
    expect(firstLink).toHaveFocus();

    // Escape closes
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("invokes onLinkSelect when a leaf link is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const handleSelect = vi.fn();
    const columns = buildColumns();

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Navigation"
        columns={columns}
        onLinkSelect={handleSelect}
      />,
    );

    const trigger = screen.getByRole("button", { name: /navigation/i });
    await user.click(trigger);

    const overviewLink = screen.getByRole("link", { name: "Overview" });
    await user.click(overviewLink);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    const [itemArg, columnArg] = handleSelect.mock.calls[0] as [
      MegaMenuLinkItem,
      MegaMenuColumn,
    ];
    expect(itemArg.label).toBe("Overview");
    expect(columnArg.header).toBe("Analytics");
  });

  it("toggles nested children when parent item is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const columns = buildColumns(true);

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Nested"
        columns={columns}
      />,
    );

    const trigger = screen.getByRole("button", { name: /nested/i });
    await user.click(trigger);

    // Parent link with children is rendered as a button
    const eventsToggle = screen.getByRole("button", { name: "Events" });
    expect(screen.queryByText("Dashboards")).not.toBeInTheDocument();

    await user.click(eventsToggle);

    // Children become visible when expanded
    expect(screen.getByText("Dashboards")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("renders CTA button when cta prop is provided and handles click", async () => {
    const user = userEvent.setup({ delay: null });
    const handleCtaClick = vi.fn();

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Docs"
        columns={buildColumns()}
        cta={{
          label: "View all docs",
          onClick: handleCtaClick,
        }}
      />,
    );

    const trigger = screen.getByRole("button", { name: /docs/i });
    await user.click(trigger);

    const ctaButton = screen.getByRole("button", { name: /view all docs/i });
    expect(ctaButton).toBeInTheDocument();

    await user.click(ctaButton);
    expect(handleCtaClick).toHaveBeenCalledTimes(1);
  });

  it("toggles aria-expanded attribute correctly on trigger", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Accessibility"
        columns={buildColumns()}
      />,
    );

    const trigger = screen.getByRole("button", { name: /accessibility/i });

    // Initially closed
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Open
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Close
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("collapses nested children when parent item is toggled twice", async () => {
    const user = userEvent.setup({ delay: null });
    const columns = buildColumns(true);

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Nested Collapse"
        columns={columns}
      />,
    );

    const trigger = screen.getByRole("button", { name: /nested collapse/i });
    await user.click(trigger);

    const eventsToggle = screen.getByRole("button", { name: "Events" });

    // Expand
    await user.click(eventsToggle);
    expect(screen.getByText("Dashboards")).toBeInTheDocument();

    // Collapse
    await user.click(eventsToggle);
    expect(screen.queryByText("Dashboards")).not.toBeInTheDocument();
  });

  it("handles empty columns array without crashing", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <MegaMenuMultiColumnDropdown
        triggerLabel="Empty"
        columns={[]}
      />,
    );

    const trigger = screen.getByRole("button", { name: /empty/i });
    await user.click(trigger);

    const panel = screen.getByRole("menu", { name: /menu/i });
    expect(panel).toBeVisible();

    // No list items should be rendered
    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.length).toBe(0);
  });
});

