/**
 * @file portfolio-page.test.tsx
 * @description Unit tests for the PortfolioPage template and its composable sections.
 */

import React, { act } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  PortfolioPage,
  PortfolioHeader,
  PortfolioHero,
  PortfolioProjects,
  PortfolioStats,
  PortfolioFooter,
  type ProjectItem,
  type StatItem,
} from ".";

/* -------------------------------------------------------------------------- */
/*                                Mock Ignix UI                               */
/* -------------------------------------------------------------------------- */

// Real framer-motion still renders actual DOM elements in jsdom, but its
// motion-only props (initial/animate/whileInView/variants/...) aren't valid
// HTML attributes - mocking it to a plain tag, stripping those props, keeps
// tests warning-free and fast, matching how every other external import
// here is already mocked rather than exercised for real.
vi.mock("framer-motion", () => {
  const MOTION_ONLY_PROPS = [
    "initial", "animate", "exit", "variants", "transition", "viewport",
    "whileInView", "whileHover", "whileTap", "whileFocus", "whileDrag",
  ];
  const stripMotionProps = (props: Record<string, unknown>) => {
    const rest = { ...props };
    for (const key of MOTION_ONLY_PROPS) delete rest[key];
    return rest;
  };
  // Cache one component per tag so `motion.div` resolves to the *same*
  // function reference across renders - a fresh function on every property
  // access would give React a new component type each render, forcing an
  // unmount/remount of the whole subtree instead of a normal reconcile.
  const cache = new Map<string, (props: any) => any>();
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        if (!cache.has(tag)) {
          cache.set(tag, ({ children, ...props }: any) => React.createElement(tag, stripMotionProps(props), children));
        }
        return cache.get(tag);
      },
    }
  );
  return { motion };
});

vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@ignix-ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock("@ignix-ui/container", () => ({
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock("@ignix-ui/navbar", () => ({
  Navbar: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
}));

vi.mock("@ignix-ui/avatar", () => ({
  Avatar: ({ alt, src }: any) => <img alt={alt} src={src} />,
}));

vi.mock("@ignix-ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

vi.mock("@ignix-ui/hero", () => ({
  Hero: ({ children, variant }: any) => <div data-testid="hero" data-variant={variant}>{children}</div>,
  HeroContent: ({ children }: any) => <div data-testid="hero-content">{children}</div>,
  HeroBadge: ({ children }: any) => <span>{children}</span>,
  HeroHeading: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
  HeroSubheading: ({ children }: any) => <p>{children}</p>,
  HeroActions: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@ignix-ui/image-card", () => ({
  ImageCard: ({ title, description, category, layout }: any) => (
    <div data-testid="image-card" data-layout={layout} data-category={category}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock("@ignix-ui/testimonial-card", () => ({
  TestimonialCard: ({ children }: any) => <div data-testid="testimonial-card">{children}</div>,
  TestimonialCardQuote: ({ children, className }: any) => <p className={className}>{children}</p>,
  TestimonialCardRating: ({ value }: any) => <span data-testid="rating">{value}</span>,
}));

/* -------------------------------------------------------------------------- */
/*                                  Fixtures                                  */
/* -------------------------------------------------------------------------- */

const projects: ProjectItem[] = [
  { id: "p1", title: "Project one", description: "First project", category: "Web" },
  { id: "p2", title: "Project two", description: "Second project", category: "Mobile" },
];

const stats: StatItem[] = [
  { id: "s1", value: "10", label: "Things shipped" },
];

describe("PortfolioPage", () => {
  it("renders the full composition without crashing", () => {
    render(<PortfolioPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("gives every default nav link a matching section id so anchor navigation works", () => {
    render(<PortfolioPage />);
    // The default header nav links point at #about/#skills/#projects/
    // #experience/#contact - each corresponding section must expose that id
    // or the links are dead.
    expect(document.getElementById("about")).not.toBeNull();
    expect(document.getElementById("skills")).not.toBeNull();
    expect(document.getElementById("projects")).not.toBeNull();
    expect(document.getElementById("experience")).not.toBeNull();
    expect(document.getElementById("contact")).not.toBeNull();
  });

  it("passes brandName through to both the header and the footer", () => {
    render(<PortfolioPage brandName="Jordan Lee" />);
    expect(screen.getAllByText("Jordan Lee")).toHaveLength(2);
  });

  it("passes footerDescription through to the footer", () => {
    render(<PortfolioPage footerDescription="Designing calm software." />);
    expect(screen.getByText("Designing calm software.")).toBeInTheDocument();
    expect(screen.queryByText("Product designer and frontend engineer.")).not.toBeInTheDocument();
  });

  it("replaces the default contact CTA entirely when customCTA is provided", () => {
    render(<PortfolioPage customCTA={<div data-testid="custom-cta">Custom CTA</div>} />);
    expect(screen.getByTestId("custom-cta")).toBeInTheDocument();
    expect(screen.queryByText("Let's work together")).not.toBeInTheDocument();
  });
});

describe("PortfolioHeader", () => {
  it("toggles the mobile menu and updates aria-expanded", async () => {
    const user = userEvent.setup();
    render(<PortfolioHeader navLinks={[{ label: "Projects", href: "#projects" }]} />);

    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("removes the mobile menu's links and CTA from the tab order while it's closed", () => {
    // Regression coverage for the same fix applied to LandingHeader: the
    // mobile panel is always mounted (aria-hidden + animated height/opacity,
    // not the native `hidden` attribute) so it can transition, which means
    // its contents must be explicitly removed from the tab order while
    // collapsed or a keyboard user could still Tab into invisible controls.
    render(<PortfolioHeader navLinks={[{ label: "Projects", href: "#projects" }]} />);

    const links = screen.getAllByText("Projects");
    const mobileLink = links[links.length - 1];
    const ctaButtons = screen.getAllByRole("button", { name: "Get in touch", hidden: true });
    const mobileCta = ctaButtons[ctaButtons.length - 1];

    expect(mobileLink.getAttribute("tabindex")).toBe("-1");
    expect(mobileCta.getAttribute("tabindex")).toBe("-1");
  });

  it("uses a unique mobile-menu id per instance so two headers on one page don't collide", () => {
    render(
      <>
        <PortfolioHeader />
        <PortfolioHeader />
      </>
    );
    const toggles = screen.getAllByRole("button", { name: /toggle menu/i });
    const ids = toggles.map((toggle) => toggle.getAttribute("aria-controls"));
    expect(ids[0]).toBeTruthy();
    expect(ids[1]).not.toBe(ids[0]);
    expect(document.getElementById(ids[0]!)).not.toBeNull();
  });
});

describe("PortfolioHero", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.removeAttribute("data-theme");
    document.body.classList.remove("dark", "light");
    document.body.removeAttribute("data-theme");
  });

  it("passes variant=\"default\" to Hero when the page is in light mode", async () => {
    await act(async () => {
      render(<PortfolioHero />);
    });
    expect(screen.getByTestId("hero")).toHaveAttribute("data-variant", "default");
  });

  it("passes variant=\"dark\" to Hero when the page has the .dark class", async () => {
    document.documentElement.classList.add("dark");
    await act(async () => {
      render(<PortfolioHero />);
    });
    expect(screen.getByTestId("hero")).toHaveAttribute("data-variant", "dark");
  });

  it("forces the dark variant for tone=\"bold\" even in light mode", async () => {
    await act(async () => {
      render(<PortfolioHero tone="bold" />);
    });
    expect(screen.getByTestId("hero")).toHaveAttribute("data-variant", "dark");
  });

  it("applies uppercase/font-black styling to the heading for tone=\"bold\"", async () => {
    await act(async () => {
      render(<PortfolioHero tone="bold" headline="Bold headline" />);
    });
    expect(screen.getByText("Bold headline")).toHaveClass("uppercase", "font-black");
  });
});

describe("PortfolioProjects", () => {
  it("defaults to the grid layout", () => {
    const { container } = render(<PortfolioProjects projects={projects} />);
    const gallery = container.querySelector(".grid.grid-cols-1");
    expect(gallery).not.toBeNull();
    expect(container.querySelector(".columns-1")).toBeNull();
  });

  it("renders a CSS-columns masonry layout when variant is \"masonry\"", () => {
    const { container } = render(<PortfolioProjects projects={projects} variant="masonry" />);
    const gallery = container.querySelector(".columns-1");
    expect(gallery).not.toBeNull();
    expect(gallery).toHaveClass("sm:columns-2", "lg:columns-3");
    expect(container.querySelector(".grid.grid-cols-1")).toBeNull();
  });

  it("renders one ImageCard per project", () => {
    render(<PortfolioProjects projects={projects} />);
    expect(screen.getAllByTestId("image-card")).toHaveLength(2);
    expect(screen.getByText("Project one")).toBeInTheDocument();
    expect(screen.getByText("Project two")).toBeInTheDocument();
  });
});

describe("PortfolioStats", () => {
  it("renders the default stats when no stats prop is provided", () => {
    render(<PortfolioStats />);
    expect(screen.getByText("By the numbers")).toBeInTheDocument();
  });

  it("renders nothing when stats is an empty array", () => {
    const { container } = render(<PortfolioStats stats={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a stat tile per provided item", () => {
    render(<PortfolioStats stats={stats} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Things shipped")).toBeInTheDocument();
  });
});

describe("PortfolioFooter", () => {
  it("renders link groups and a computed copyright year by default", () => {
    render(<PortfolioFooter />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("uses a custom copyright text when provided", () => {
    render(<PortfolioFooter copyrightText="All rights reserved, forever." />);
    expect(screen.getByText("All rights reserved, forever.")).toBeInTheDocument();
  });
});
