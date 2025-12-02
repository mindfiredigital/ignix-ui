import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResponsiveGridLayout, type ResponsiveGridItem } from ".";

// NOTE:
// This test suite focuses on verifying the *behaviour* of the responsive grid layout
// rather than TailwindCSS itself. We assert for key classes / ARIA roles / text content
// that prove the layout is wiring props and state correctly.

describe("ResponsiveGridLayout - default rendering and basic structure", () => {
  // This block validates that the component renders a grid and items with minimal props.
  it("renders a grid with provided items and displays their titles and descriptions", () => {
    const items: ResponsiveGridItem[] = [
      { id: 1, title: "Card One", description: "First card description" },
      { id: 2, title: "Card Two", description: "Second card description" },
    ];

    render(<ResponsiveGridLayout items={items} />);

    // Items should be rendered as articles with aria-label matching title
    expect(
      screen.getByRole("article", { name: "Card One" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("article", { name: "Card Two" })
    ).toBeInTheDocument();

    expect(screen.getByText("First card description")).toBeInTheDocument();
    expect(screen.getByText("Second card description")).toBeInTheDocument();

    // The grid section should be present with aria-live for polite updates.
    // We don't rely on ARIA roles here because jsdom may not always map them as in browsers.
    const gridSection = document.querySelector("section");
    expect(gridSection).toBeTruthy();
  });

  // This block ensures that passing no items does not crash and renders an empty grid.
  it("handles empty or undefined items gracefully", () => {
    const { container } = render(<ResponsiveGridLayout items={[]} />);
    const cards = container.querySelectorAll("article");
    expect(cards.length).toBe(0);

    const { container: containerUndefined } = render(
      // ts-expect-error: intentionally pass undefined to mirror runtime usage
      <ResponsiveGridLayout items={undefined} />
    );
    const cardsUndefined = containerUndefined.querySelectorAll("article");
    expect(cardsUndefined.length).toBe(0);
  });
});

describe("ResponsiveGridLayout - header and footer behaviour", () => {
  // This block verifies that header and footer content is rendered when provided.
  it("renders header and footer content when passed as props", () => {
    render(
      <ResponsiveGridLayout
        header={<div>Header Content</div>}
        footer={<div>Footer Content</div>}
      />
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  // This block checks the sticky behaviour by asserting sticky-related classes.
  it("applies sticky classes to header and footer when sticky props are true", () => {
    const { container } = render(
      <ResponsiveGridLayout
        header={<div>Sticky Header</div>}
        footer={<div>Sticky Footer</div>}
        stickyHeader
        stickyFooter
      />
    );

    const header = container.querySelector("header") as HTMLElement | null;
    const footer = container.querySelector("footer") as HTMLElement | null;

    expect(header).toBeTruthy();
    expect(header).toHaveClass("sticky");
    expect(header).toHaveClass("top-0");

    expect(footer).toBeTruthy();
    expect(footer).toHaveClass("sticky");
    expect(footer).toHaveClass("bottom-0");
  });
});

describe("ResponsiveGridLayout - spacing, sizing and card behaviour", () => {
  // This block asserts that padding, gap and maxWidth props map to expected Tailwind classes.
  it("applies padding, gap and maxWidth classes based on props", () => {
    const { container } = render(
      <ResponsiveGridLayout
        padding="lg"
        gap="lg"
        maxWidth="4xl"
        items={[{ title: "Item" }]}
      />
    );

    const contentWrapper = container.querySelector("div.mx-auto") as
      | HTMLElement
      | null;
    expect(contentWrapper).toBeTruthy();
    // paddingMap["lg"] => "px-6 py-10 sm:px-10 lg:px-12"
    expect(contentWrapper).toHaveClass("px-6");
    expect(contentWrapper).toHaveClass("py-10");
    // maxWidthMap["4xl"] => "max-w-4xl"
    expect(contentWrapper).toHaveClass("max-w-4xl");

    const gridSection = container.querySelector("section") as HTMLElement | null;
    expect(gridSection).toBeTruthy();
    // gapMap["lg"] => "gap-8"
    expect(gridSection).toHaveClass("gap-8");
  });

  // This block validates card-specific behaviours like minCardHeight and hover classes.
  it("applies minCardHeight and hover styles to default cards", () => {
    const { container } = render(
      <ResponsiveGridLayout
        items={[{ title: "Hover Card" }]}
        minCardHeight={300}
        enableHover
      />
    );

    const card = container.querySelector("article") as HTMLElement | null;
    expect(card).toBeTruthy();
    expect(card!.style.minHeight).toBe("300px");
    // enableHover => "hover:-translate-y-1 hover:shadow-lg"
    expect(card).toHaveClass("hover:-translate-y-1");
    expect(card).toHaveClass("hover:shadow-lg");
  });
});

describe("ResponsiveGridLayout - default item rendering (badge, meta, stats and actions)", () => {
  // This block checks badge + meta text rendering including simple string badges.
  it("renders badge and meta information when present", () => {
    const items: ResponsiveGridItem[] = [
      {
        title: "Analytics",
        badge: "New",
        meta: "Updated 1h ago",
      },
    ];

    render(<ResponsiveGridLayout items={items} />);

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Updated 1h ago")).toBeInTheDocument();
  });

  // This block ensures stat values, changes and trend arrows/colors are rendered correctly.
  it("renders stat value and change with appropriate trend icon and color", () => {
    const items: ResponsiveGridItem[] = [
      {
        title: "Revenue",
        statValue: "$12k",
        statChange: "+15%",
        statTrend: "up",
      },
    ];

    const { container } = render(<ResponsiveGridLayout items={items} />);

    expect(screen.getByText("$12k")).toBeInTheDocument();
    // text may be split across text nodes, so use a matcher function
    expect(
      screen.getByText((content) => content.includes("+15%"))
    ).toBeInTheDocument();

    // trendColorMap["up"] => "text-emerald-500"
    const trendElement = container.querySelector(
      ".text-emerald-500"
    ) as HTMLElement | null;
    expect(trendElement).toBeTruthy();
    // The arrow is rendered as text prefix, ensure it is present in textContent
    expect(trendElement!.textContent).toContain("▲");
  });

  // This block validates footer / action rendering including button and link variants.
  it("renders custom footer, button or link actions based on item props", () => {
    const items: ResponsiveGridItem[] = [
      {
        title: "With Custom Footer",
        footer: <div>Custom Footer Action</div>,
      },
      {
        title: "With Button Action",
        actionLabel: "Click Me",
      },
      {
        title: "With Link Action",
        actionLabel: "Visit",
        actionHref: "https://example.com",
      },
    ];

    render(<ResponsiveGridLayout items={items} />);

    expect(screen.getByText("Custom Footer Action")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Visit" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});

describe("ResponsiveGridLayout - custom renderItem behaviour", () => {
  // This block tests that a custom renderItem callback is used instead of DefaultGridItem.
  it("uses custom renderItem when provided", () => {
    const items: ResponsiveGridItem[] = [
      { id: "a", title: "Custom 1" },
      { id: "b", title: "Custom 2" },
    ];

    const renderItem = (item: ResponsiveGridItem, index: number) => (
      <div data-testid={`custom-${index}`}>{item.title}</div>
    );

    render(<ResponsiveGridLayout items={items} renderItem={renderItem} />);

    expect(screen.getByTestId("custom-0")).toHaveTextContent("Custom 1");
    expect(screen.getByTestId("custom-1")).toHaveTextContent("Custom 2");

    // Ensure default article-based cards are not rendered for these items
    const articles = document.querySelectorAll("article");
    expect(articles.length).toBe(0);
  });
});


