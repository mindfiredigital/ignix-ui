/**
 * @file landing-page.test.tsx
 * @description Unit tests for the LandingPage template and its composable sections.
 */

import React, { act } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { LucideIcon } from "lucide-react";

import {
  LandingPage,
  LandingHeader,
  LandingHero,
  LandingLogoCloud,
  LandingFeatures,
  LandingPricing,
  LandingTestimonials,
  LandingFAQ,
  LandingCTA,
  LandingFooter,
  type FeatureItem,
  type TestimonialItem,
  type FAQItem,
} from ".";

/* -------------------------------------------------------------------------- */
/*                                Mock Ignix UI                               */
/* -------------------------------------------------------------------------- */

vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@ignix-ui/card", () => {
  const Card = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  const CardHeader = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  const CardTitle = ({ children, ...props }: any) => <h3 {...props}>{children}</h3>;
  const CardDescription = ({ children, ...props }: any) => <p {...props}>{children}</p>;
  return { Card, CardHeader, CardTitle, CardDescription };
});

vi.mock("@ignix-ui/container", () => ({
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock("@ignix-ui/navbar", () => ({
  Navbar: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
}));

vi.mock("@ignix-ui/hero", () => ({
  Hero: ({ children, variant }: any) => <div data-testid="hero" data-variant={variant}>{children}</div>,
  HeroContent: ({ children }: any) => <div data-testid="hero-content">{children}</div>,
  HeroBadge: ({ children }: any) => <span>{children}</span>,
  HeroHeading: ({ children }: any) => <h1>{children}</h1>,
  HeroSubheading: ({ children }: any) => <p>{children}</p>,
  HeroActions: ({ children }: any) => <div>{children}</div>,
  HeroMedia: (props: any) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("@ignix-ui/pricing-grid", () => ({
  PricingGrid: ({ title, titleHighlight, tiers, sectionBackgroundColor, titleColor, accentColor }: any) => (
    <div
      data-testid="pricing-grid"
      data-section-bg={sectionBackgroundColor}
      data-title-color={titleColor}
      data-accent-color={accentColor}
      data-title-highlight={titleHighlight}
    >
      <span>{title}</span>
      <span data-testid="pricing-tier-count">{tiers.length}</span>
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

// Plain functions stand in for LucideIcon (a ForwardRefExoticComponent) here -
// tests only need something renderable with a className/aria-hidden prop.
const MockIconF1 = (() => <svg data-testid="icon-f1" />) as unknown as LucideIcon;
const MockIconF2 = (() => <svg data-testid="icon-f2" />) as unknown as LucideIcon;

const features: FeatureItem[] = [
  { id: "f1", icon: MockIconF1, title: "Feature one", description: "First feature" },
  { id: "f2", icon: MockIconF2, title: "Feature two", description: "Second feature" },
];

const testimonials: TestimonialItem[] = [
  { id: "t1", quote: "Great product", name: "Alex Doe", title: "CTO", company: "Acme", rating: 5 },
  { id: "t2", quote: "Love it", name: "Sam Lee" },
];

const faqItems: FAQItem[] = [
  { id: "q1", question: "Is it free?", answer: "Yes, forever." },
  { id: "q2", question: "Can I cancel?", answer: "Anytime." },
];

describe("LandingPage", () => {
  it("renders the full composition without crashing", () => {
    render(<LandingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("gives every default nav link a matching section id so anchor navigation works", () => {
    render(<LandingPage />);
    // The default header nav links point at #features/#pricing/#testimonials/#faq -
    // each corresponding section must expose that id or the links are dead.
    expect(document.getElementById("features")).not.toBeNull();
    expect(document.getElementById("pricing")).not.toBeNull();
    expect(document.getElementById("testimonials")).not.toBeNull();
    expect(document.getElementById("faq")).not.toBeNull();
  });

  it("passes brandName through to the footer, not just the header", () => {
    render(<LandingPage brandName="Acme" />);
    // Both header and footer render the brand name as plain text, so there
    // should be exactly two matches - one per section - not one.
    expect(screen.getAllByText("Acme")).toHaveLength(2);
  });

  it("forwards heroMediaAlt to the hero media image", () => {
    render(<LandingPage heroMediaSrc="/dashboard.png" heroMediaAlt="Dashboard screenshot" />);
    expect(screen.getByAltText("Dashboard screenshot")).toBeInTheDocument();
  });

  it("falls back to LandingHero's default alt text when heroMediaAlt is omitted", () => {
    render(<LandingPage heroMediaSrc="/dashboard.png" />);
    expect(screen.getByAltText("Product preview")).toBeInTheDocument();
  });
});

describe("LandingHeader", () => {
  it("renders the brand name when no logo slot is provided", () => {
    render(<LandingHeader brandName="Acme" />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("renders a custom logo slot instead of the brand name", () => {
    render(<LandingHeader brandName="Acme" logo={<span>Custom Logo</span>} />);
    expect(screen.getByText("Custom Logo")).toBeInTheDocument();
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
  });

  it("toggles the mobile menu and updates aria-expanded", async () => {
    const user = userEvent.setup();
    render(<LandingHeader navLinks={[{ label: "Pricing", href: "#pricing" }]} />);

    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu when a nav link is clicked", async () => {
    const user = userEvent.setup();
    render(<LandingHeader navLinks={[{ label: "Pricing", href: "#pricing" }]} />);

    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Two "Pricing" links exist (desktop nav + mobile panel) - click the last one.
    const links = screen.getAllByText("Pricing");
    await user.click(links[links.length - 1]);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu when the mobile CTA button is clicked", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    render(<LandingHeader ctaLabel="Join" onCtaClick={onCtaClick} />);

    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    await user.click(toggle);

    const ctaButtons = screen.getAllByRole("button", { name: "Join" });
    await user.click(ctaButtons[ctaButtons.length - 1]);

    expect(onCtaClick).toHaveBeenCalledOnce();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("uses a unique mobile-menu id per instance so two headers on one page don't collide", () => {
    render(
      <>
        <LandingHeader />
        <LandingHeader />
      </>
    );
    const toggles = screen.getAllByRole("button", { name: /toggle menu/i });
    const ids = toggles.map((toggle) => toggle.getAttribute("aria-controls"));
    expect(ids[0]).toBeTruthy();
    expect(ids[1]).toBeTruthy();
    expect(ids[0]).not.toBe(ids[1]);
    // Every aria-controls id must resolve to a real, unique element.
    expect(document.getElementById(ids[0]!)).not.toBeNull();
    expect(document.getElementById(ids[1]!)).not.toBeNull();
    expect(document.getElementById(ids[0]!)).not.toBe(document.getElementById(ids[1]!));
  });
});

describe("LandingLogoCloud", () => {
  it("renders nothing when given an empty logos array", () => {
    const { container } = render(<LandingLogoCloud logos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("uses renderLogo when provided instead of the default text fallback", () => {
    render(
      <LandingLogoCloud
        logos={[{ id: "acme", name: "Acme" }]}
        renderLogo={(logo) => <img key={logo.id} alt={logo.name} src="/acme.svg" />}
      />
    );
    expect(screen.getByAltText("Acme")).toBeInTheDocument();
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
  });
});

describe("LandingFeatures", () => {
  it("renders one card per feature item", () => {
    render(<LandingFeatures features={features} />);
    expect(screen.getByText("Feature one")).toBeInTheDocument();
    expect(screen.getByText("Feature two")).toBeInTheDocument();
  });
});

describe("LandingHero", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.removeAttribute("data-theme");
  });

  it("passes variant=\"default\" to Hero when the page is in light mode", async () => {
    await act(async () => {
      render(<LandingHero />);
    });
    expect(screen.getByTestId("hero")).toHaveAttribute("data-variant", "default");
  });

  it("passes variant=\"dark\" to Hero when the page has the .dark class", async () => {
    document.documentElement.classList.add("dark");
    await act(async () => {
      render(<LandingHero />);
    });
    expect(screen.getByTestId("hero")).toHaveAttribute("data-variant", "dark");
  });

  it("passes variant=\"dark\" to Hero when the page has data-theme=\"dark\"", async () => {
    document.documentElement.setAttribute("data-theme", "dark");
    await act(async () => {
      render(<LandingHero />);
    });
    expect(screen.getByTestId("hero")).toHaveAttribute("data-variant", "dark");
  });

  it("nests HeroMedia inside HeroContent instead of as its sibling", () => {
    // Hero treats any HeroMedia that is a *direct* child of <Hero> as
    // full-bleed background media, regardless of `position` - only media
    // nested inside HeroContent gets arranged into the real split layout.
    render(<LandingHero mediaSrc="/preview.png" mediaAlt="Preview" />);
    const heroContent = screen.getByTestId("hero-content");
    const media = screen.getByAltText("Preview");
    expect(heroContent).toContainElement(media);
  });

  it("does not render HeroMedia when no mediaSrc is provided", () => {
    render(<LandingHero />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("LandingPricing", () => {
  it("passes theme-token colors to PricingGrid instead of its hardcoded defaults", () => {
    render(<LandingPricing />);
    const grid = screen.getByTestId("pricing-grid");
    expect(grid).toHaveAttribute("data-section-bg", "bg-transparent");
    expect(grid).toHaveAttribute("data-title-color", "text-foreground");
    expect(grid).toHaveAttribute("data-accent-color", "text-primary");
  });

  it("suppresses PricingGrid's default titleHighlight text", () => {
    // PricingGrid defaults titleHighlight to "with your growth" and renders it
    // appended directly after `title` - without an explicit override every
    // custom title would get that unrelated text tacked onto the end.
    render(<LandingPricing title="Choose your plan" />);
    const grid = screen.getByTestId("pricing-grid");
    expect(grid).toHaveAttribute("data-title-highlight", "");
  });
});

describe("LandingTestimonials", () => {
  it("renders one testimonial card per item", () => {
    render(<LandingTestimonials testimonials={testimonials} />);
    expect(screen.getAllByTestId("testimonial-card")).toHaveLength(2);
    expect(screen.getByText("Great product")).toBeInTheDocument();
  });

  it("renders the author name and title/company with theme-token contrast colors", () => {
    render(<LandingTestimonials testimonials={testimonials} />);

    // Regression guard: TestimonialCardAuthor's internal text colors have no
    // className override hook, so the author line is hand-rolled with
    // explicit text-foreground/text-muted-foreground instead.
    const name = screen.getByText("Alex Doe");
    expect(name).toHaveClass("text-foreground");

    const subtitle = screen.getByText("CTO · Acme");
    expect(subtitle).toHaveClass("text-muted-foreground");
  });

  it("gives the quote text an explicit text-foreground color", () => {
    render(<LandingTestimonials testimonials={testimonials} />);
    expect(screen.getByText("Great product")).toHaveClass("text-foreground");
  });

  it("omits the subtitle line when neither title nor company is provided", () => {
    render(<LandingTestimonials testimonials={[{ id: "t3", quote: "No frills", name: "Jordan" }]} />);
    expect(screen.getByText("Jordan")).toBeInTheDocument();
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
  });
});

describe("LandingFAQ", () => {
  it("opens the first item by default and toggles others on click", async () => {
    const user = userEvent.setup();
    render(<LandingFAQ items={faqItems} />);

    const firstTrigger = screen.getByRole("button", { name: /is it free\?/i });
    const secondTrigger = screen.getByRole("button", { name: /can i cancel\?/i });

    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Yes, forever.")).toBeInTheDocument();
    expect(secondTrigger).toHaveAttribute("aria-expanded", "false");

    await user.click(secondTrigger);
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Anytime.")).toBeInTheDocument();
    expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps every panel in the DOM (hidden, not unmounted) so aria-controls always resolves", async () => {
    const user = userEvent.setup();
    render(<LandingFAQ items={faqItems} />);

    const firstTrigger = screen.getByRole("button", { name: /is it free\?/i });
    const secondTrigger = screen.getByRole("button", { name: /can i cancel\?/i });
    const firstPanelId = firstTrigger.getAttribute("aria-controls")!;
    const secondPanelId = secondTrigger.getAttribute("aria-controls")!;

    // aria-controls must reference an element that actually exists, open or not.
    expect(document.getElementById(firstPanelId)).not.toBeNull();
    expect(document.getElementById(secondPanelId)).not.toBeNull();
    expect(document.getElementById(firstPanelId)).not.toHaveAttribute("hidden");
    expect(document.getElementById(secondPanelId)).toHaveAttribute("hidden");

    await user.click(secondTrigger);
    expect(document.getElementById(firstPanelId)).toHaveAttribute("hidden");
    expect(document.getElementById(secondPanelId)).not.toHaveAttribute("hidden");
  });

  it("uses unique trigger/panel ids per instance so two FAQs on one page don't collide", () => {
    render(
      <>
        <LandingFAQ items={faqItems} />
        <LandingFAQ items={faqItems} />
      </>
    );
    const triggers = screen.getAllByRole("button", { name: /is it free\?/i });
    expect(triggers).toHaveLength(2);
    const ids = triggers.map((t) => t.getAttribute("aria-controls"));
    expect(ids[0]).not.toBe(ids[1]);
    expect(document.getElementById(ids[0]!)).not.toBe(document.getElementById(ids[1]!));
  });
});

describe("LandingCTA", () => {
  it("renders the default banner", () => {
    render(<LandingCTA />);
    expect(screen.getByText("Ready to get started?")).toBeInTheDocument();
  });
});

describe("LandingPage customCTA slot", () => {
  it("replaces the default CTA banner entirely when customCTA is provided", () => {
    render(<LandingPage customCTA={<div>Totally custom CTA</div>} />);
    expect(screen.getByText("Totally custom CTA")).toBeInTheDocument();
    expect(screen.queryByText("Ready to get started?")).not.toBeInTheDocument();
  });
});

describe("LandingFooter", () => {
  it("renders link groups and a computed copyright year by default", () => {
    render(
      <LandingFooter
        brandName="Acme"
        linkGroups={[{ id: "product", title: "Product", links: [{ label: "Pricing", href: "#pricing" }] }]}
      />
    );
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()} Acme`))).toBeInTheDocument();
  });

  it("uses a custom copyright text when provided", () => {
    render(<LandingFooter copyrightText="Custom copyright line" />);
    expect(screen.getByText("Custom copyright line")).toBeInTheDocument();
  });
});
