/**
 * TabNavigation component unit tests.
 * Covers rendering, controlled/uncontrolled mode, defaultActiveId,
 * onChange, keyboard navigation, activeId derivation when tabs change, and accessibility.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TabNavigation, type TabItem } from "./index";

const defaultTabs: TabItem[] = [
  { id: "one", label: "Tab One", content: <div>Content One</div> },
  { id: "two", label: "Tab Two", content: <div>Content Two</div> },
  { id: "three", label: "Tab Three", content: <div>Content Three</div> },
];

describe("TabNavigation", () => {
  describe("Basic rendering", () => {
    it("renders without crashing", () => {
      render(<TabNavigation tabs={defaultTabs} />);
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });

    it("renders all tab buttons with correct labels", () => {
      render(<TabNavigation tabs={defaultTabs} />);
      expect(screen.getByRole("tab", { name: "Tab One" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Tab Two" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Tab Three" })).toBeInTheDocument();
    });

    it("renders content of the active tab (first by default)", () => {
      render(<TabNavigation tabs={defaultTabs} />);
      expect(screen.getByText("Content One")).toBeInTheDocument();
      expect(screen.queryByText("Content Two")).not.toBeInTheDocument();
    });

    it("returns null when tabs array is empty", () => {
      const { container } = render(<TabNavigation tabs={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders tablist with horizontal orientation", () => {
      render(<TabNavigation tabs={defaultTabs} />);
      const tablist = screen.getByRole("tablist", { name: undefined });
      expect(tablist).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("renders a single tab when only one tab is provided", () => {
      const singleTab: TabItem[] = [
        { id: "only", label: "Only Tab", content: <div>Only content</div> },
      ];
      render(<TabNavigation tabs={singleTab} />);
      expect(screen.getByRole("tab", { name: "Only Tab" })).toBeInTheDocument();
      expect(screen.getByText("Only content")).toBeInTheDocument();
    });
  });

  describe("Uncontrolled mode and defaultActiveId", () => {
    it("uses first tab as active when defaultActiveId is not provided", () => {
      render(<TabNavigation tabs={defaultTabs} />);
      const tabOne = screen.getByRole("tab", { name: "Tab One" });
      expect(tabOne).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content One")).toBeInTheDocument();
    });

    it("uses defaultActiveId when it matches a tab id", () => {
      render(
        <TabNavigation tabs={defaultTabs} defaultActiveId="two" />
      );
      const tabTwo = screen.getByRole("tab", { name: "Tab Two" });
      expect(tabTwo).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content Two")).toBeInTheDocument();
    });

    it("falls back to first tab when defaultActiveId does not match any tab", () => {
      render(
        <TabNavigation tabs={defaultTabs} defaultActiveId="nonexistent" />
      );
      const tabOne = screen.getByRole("tab", { name: "Tab One" });
      expect(tabOne).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content One")).toBeInTheDocument();
    });
  });

  describe("Controlled mode", () => {
    it("uses activeId prop when provided", () => {
      render(
        <TabNavigation tabs={defaultTabs} activeId="three" />
      );
      const tabThree = screen.getByRole("tab", { name: "Tab Three" });
      expect(tabThree).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content Three")).toBeInTheDocument();
    });

    it("updates displayed active tab when controlled activeId changes", () => {
      const { rerender } = render(
        <TabNavigation tabs={defaultTabs} activeId="one" />
      );
      expect(screen.getByText("Content One")).toBeInTheDocument();

      rerender(<TabNavigation tabs={defaultTabs} activeId="two" />);
      expect(screen.getByText("Content Two")).toBeInTheDocument();

      rerender(<TabNavigation tabs={defaultTabs} activeId="three" />);
      expect(screen.getByText("Content Three")).toBeInTheDocument();
    });

    it("calls onChange when a tab is clicked in controlled mode", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TabNavigation tabs={defaultTabs} activeId="one" onChange={onChange} />
      );
      await user.click(screen.getByRole("tab", { name: "Tab Two" }));
      expect(onChange).toHaveBeenCalledWith("two");
    });
  });

  describe("Tab click and onChange", () => {
    it("switches active tab on click in uncontrolled mode", async () => {
      const user = userEvent.setup();
      render(<TabNavigation tabs={defaultTabs} />);
      await user.click(screen.getByRole("tab", { name: "Tab Two" }));
      expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText("Content Two")).toBeInTheDocument();
    });

    it("calls onChange with the new tab id when a tab is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TabNavigation tabs={defaultTabs} onChange={onChange} />);
      await user.click(screen.getByRole("tab", { name: "Tab Three" }));
      expect(onChange).toHaveBeenCalledWith("three");
    });

    it("calls onChange only once per click", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TabNavigation tabs={defaultTabs} onChange={onChange} />);
      await user.click(screen.getByRole("tab", { name: "Tab Two" }));
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Active id derivation when tabs change", () => {
    it("shows first tab when current active id is not in the new tab list (uncontrolled)", () => {
      const { rerender } = render(
        <TabNavigation tabs={defaultTabs} defaultActiveId="three" />
      );
      expect(screen.getByText("Content Three")).toBeInTheDocument();

      const newTabs: TabItem[] = [
        { id: "a", label: "A", content: <div>Content A</div> },
        { id: "b", label: "B", content: <div>Content B</div> },
      ];
      rerender(<TabNavigation tabs={newTabs} defaultActiveId="three" />);
      expect(screen.getByText("Content A")).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    it("shows first tab when controlled activeId is not in the new tab list", () => {
      const newTabs: TabItem[] = [
        { id: "x", label: "X", content: <div>Content X</div> },
        { id: "y", label: "Y", content: <div>Content Y</div> },
      ];
      const { rerender } = render(
        <TabNavigation tabs={defaultTabs} activeId="two" />
      );
      expect(screen.getByText("Content Two")).toBeInTheDocument();

      rerender(<TabNavigation tabs={newTabs} activeId="two" />);
      expect(screen.getByText("Content X")).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "X" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  describe("Keyboard navigation", () => {
    it("moves to next tab on ArrowRight", async () => {
      const user = userEvent.setup();
      render(<TabNavigation tabs={defaultTabs} />);
      screen.getByRole("tab", { name: "Tab One" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText("Content Two")).toBeInTheDocument();
    });

    it("moves to previous tab on ArrowLeft", async () => {
      const user = userEvent.setup();
      render(<TabNavigation tabs={defaultTabs} defaultActiveId="two" />);
      screen.getByRole("tab", { name: "Tab Two" }).focus();
      await user.keyboard("{ArrowLeft}");
      expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText("Content One")).toBeInTheDocument();
    });

    it("moves to first tab on Home", async () => {
      const user = userEvent.setup();
      render(<TabNavigation tabs={defaultTabs} defaultActiveId="three" />);
      screen.getByRole("tab", { name: "Tab Three" }).focus();
      await user.keyboard("{Home}");
      expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText("Content One")).toBeInTheDocument();
    });

    it("moves to last tab on End", async () => {
      const user = userEvent.setup();
      render(<TabNavigation tabs={defaultTabs} />);
      screen.getByRole("tab", { name: "Tab One" }).focus();
      await user.keyboard("{End}");
      expect(screen.getByRole("tab", { name: "Tab Three" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText("Content Three")).toBeInTheDocument();
    });

    it("activates tab on Enter key", async () => {
      const user = userEvent.setup();
      render(<TabNavigation tabs={defaultTabs} />);
      const tabTwo = screen.getByRole("tab", { name: "Tab Two" });
      tabTwo.focus();
      await user.keyboard("{Enter}");
      expect(tabTwo).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content Two")).toBeInTheDocument();
    });

    it("activates tab on Space key", async () => {
      const user = userEvent.setup();
      render(<TabNavigation tabs={defaultTabs} />);
      const tabThree = screen.getByRole("tab", { name: "Tab Three" });
      tabThree.focus();
      await user.keyboard(" ");
      expect(tabThree).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content Three")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("sets aria-selected on the active tab only", () => {
      render(<TabNavigation tabs={defaultTabs} />);
      expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
      expect(screen.getByRole("tab", { name: "Tab Three" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });

    it("links tab to panel via aria-controls and aria-labelledby", () => {
      render(<TabNavigation tabs={defaultTabs} defaultActiveId="two" />);
      const panel = screen.getByRole("tabpanel");
      expect(panel).toHaveAttribute("id", "panel-two");
      expect(panel).toHaveAttribute("aria-labelledby", "tab-two");
      const tabTwo = screen.getByRole("tab", { name: "Tab Two" });
      expect(tabTwo).toHaveAttribute("id", "tab-two");
      expect(tabTwo).toHaveAttribute("aria-controls", "panel-two");
    });

    it("sets tabIndex 0 on active tab and -1 on inactive tabs", () => {
      render(<TabNavigation tabs={defaultTabs} />);
      expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute(
        "tabIndex",
        "0"
      );
      expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
        "tabIndex",
        "-1"
      );
    });
  });

  describe("Custom class names", () => {
    it("applies className to root container", () => {
      const { container } = render(
        <TabNavigation tabs={defaultTabs} className="custom-root" />
      );
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass("custom-root");
    });

    it("applies tabListClassName to the tablist wrapper", () => {
      render(
        <TabNavigation tabs={defaultTabs} tabListClassName="custom-tablist" />
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass("custom-tablist");
    });

    it("applies panelClassName to the tabpanel", () => {
      render(
        <TabNavigation tabs={defaultTabs} panelClassName="custom-panel" />
      );
      const panel = screen.getByRole("tabpanel");
      expect(panel).toHaveClass("custom-panel");
    });
  });

  describe("Indicator variant", () => {
    it("renders with underline variant by default", () => {
      const { container } = render(<TabNavigation tabs={defaultTabs} />);
      const indicator = container.querySelector('[aria-hidden="true"]');
      expect(indicator).toBeInTheDocument();
    });

    it("applies pill-related classes to tablist when indicatorVariant is pill", () => {
      render(
        <TabNavigation tabs={defaultTabs} indicatorVariant="pill" />
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass("rounded-lg");
    });
  });

  describe("Badge", () => {
    it("renders badge label when provided", () => {
      const tabsWithBadge: TabItem[] = [
        {
          id: "b1",
          label: "With Badge",
          content: <div>Content</div>,
          badge: { label: "New" },
        },
      ];
      render(<TabNavigation tabs={tabsWithBadge} />);
      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("renders badge count when provided and count > 0", () => {
      const tabsWithBadge: TabItem[] = [
        {
          id: "b2",
          label: "Count",
          content: <div>Content</div>,
          badge: { count: 5 },
        },
      ];
      render(<TabNavigation tabs={tabsWithBadge} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("renders badge count 0 when showZero is true", () => {
      const tabsWithBadge: TabItem[] = [
        {
          id: "b3",
          label: "Zero",
          content: <div>Content</div>,
          badge: { count: 0, showZero: true },
        },
      ];
      render(<TabNavigation tabs={tabsWithBadge} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
});
