/**
 * @file index.tsx
 * @description Landing Page template and composable building blocks for the
 * Ignix UI registry. A production-ready marketing/SaaS landing page composed
 * of header, hero, logo cloud, features, pricing, testimonials, FAQ, CTA and
 * footer sections. Reuses `@ignix-ui/hero`, `@ignix-ui/pricing-grid`,
 * `@ignix-ui/testimonial-card` and `@ignix-ui/navbar` for the pieces that
 * already exist in the registry, and hand-rolls the sections that don't
 * (header composition, logo cloud, feature grid, testimonial wall, FAQ
 * accordion, CTA banner, footer).
 */

"use client";

import React, { useEffect, useId, useState } from "react";
import { Menu, X, ArrowRight, Star, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@site/src/utils/cn";
import { Button } from "../button";
import { Card, CardHeader, CardTitle, CardDescription } from "../card";
import { Container } from "../container";
import { Navbar } from "../navbar";
import {
  Hero,
  HeroContent,
  HeroBadge,
  HeroHeading,
  HeroSubheading,
  HeroActions,
  HeroMedia,
} from "../hero";
import { PricingGrid, type PricingTier } from "../pricing-grid";
import {
  TestimonialCard,
  TestimonialCardQuote,
  TestimonialCardRating,
} from "../testimonial-card";

/**
 * `@ignix-ui/hero`'s `variant` prop selects between two fully hardcoded color
 * sets ("default" = light gray/white, "dark" = gray/black) rather than
 * reading the app's `--background`/`--foreground` theme tokens - unlike
 * every other section on this page, it does not auto-adapt to the current
 * theme. This hook detects the active theme (via the `.dark`/`.light`
 * class or `data-theme` attribute Ignix's own dark-mode toggle uses, falling
 * back to the OS preference) so `LandingHero` can pass the matching variant
 * and avoid rendering a light hero on an otherwise dark page (or vice versa).
 */
function useThemeMode(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const read = (): "light" | "dark" => {
      const hasDarkClass = root.classList.contains("dark") || body.classList.contains("dark");
      const hasDarkThemeAttr = root.getAttribute("data-theme") === "dark";
      if (hasDarkClass || hasDarkThemeAttr) return "dark";

      const hasLightClass = root.classList.contains("light") || body.classList.contains("light");
      const hasLightThemeAttr = root.getAttribute("data-theme") === "light";
      if (hasLightClass || hasLightThemeAttr) return "light";

      return mediaQuery.matches ? "dark" : "light";
    };

    setTheme(read());

    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    const listener = () => setTheme(read());
    mediaQuery.addEventListener("change", listener);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  return theme;
}

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
}

export interface LogoCloudItem {
  id: string;
  name: string;
  logo?: React.ReactNode;
}

export interface FeatureItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  title?: string;
  company?: string;
  rating?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FooterLinkGroup {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  id: string;
  icon: LucideIcon;
  href: string;
  label: string;
}

/* -------------------------------------------------------------------------- */
/*                              LANDING HEADER                                */
/* -------------------------------------------------------------------------- */

export interface LandingHeaderProps {
  /** Replaces the default text logo entirely. */
  logo?: React.ReactNode;
  brandName?: string;
  navLinks?: NavLink[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

/**
 * Marketing site header: logo, nav links, CTA button, and an accessible
 * mobile menu toggle. Wraps `@ignix-ui/navbar`, which is an unopinionated
 * `<nav>` shell with no built-in logo/links/CTA/mobile-menu behavior.
 */
function LandingHeader({
  logo,
  brandName = "Ignix",
  navLinks = DEFAULT_NAV_LINKS,
  ctaLabel = "Get Started",
  onCtaClick,
  className,
}: LandingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Storybook's autodocs page (and any layout rendering LandingHeader more
  // than once) puts multiple instances in the same DOM - a static id would
  // collide and break aria-controls, so each instance gets its own.
  const mobileMenuId = `landing-mobile-menu-${useId()}`;

  return (
    <header className={cn("sticky top-0 z-40 w-full", className)}>
      <Navbar variant="default" size="md">
        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
          {logo ?? <span>{brandName}</span>}
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" size="sm" className="hidden sm:inline-flex" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </Navbar>

      <div
        id={mobileMenuId}
        hidden={!mobileOpen}
        className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </a>
        ))}
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => {
            setMobileOpen(false);
            onCtaClick?.();
          }}
        >
          {ctaLabel}
        </Button>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*                               LANDING HERO                                 */
/* -------------------------------------------------------------------------- */

export interface LandingHeroProps {
  eyebrow?: string;
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  primaryCtaLabel?: string;
  onPrimaryCtaClick?: () => void;
  secondaryCtaLabel?: string;
  onSecondaryCtaClick?: () => void;
  mediaSrc?: string;
  mediaAlt?: string;
  className?: string;
}

/** Above-the-fold hero section, built from `@ignix-ui/hero`'s composable parts. */
function LandingHero({
  eyebrow,
  headline = "Ship your SaaS product faster",
  subheadline = "A production-ready landing page built from Ignix UI components - responsive, accessible, and themeable out of the box.",
  primaryCtaLabel = "Start free trial",
  onPrimaryCtaClick,
  secondaryCtaLabel = "View demo",
  onSecondaryCtaClick,
  mediaSrc,
  mediaAlt = "Product preview",
  className,
}: LandingHeroProps) {
  const theme = useThemeMode();
  const isSplit = Boolean(mediaSrc);

  return (
    <Hero
      variant={theme === "dark" ? "dark" : "default"}
      align={isSplit ? "left" : "center"}
      animationType="fadeInUp"
      split={isSplit}
      className={className}
    >
      {/*
       * HeroMedia must be nested inside HeroContent, not a sibling of it - Hero's
       * top-level render treats any HeroMedia that's a *direct* child of <Hero>
       * as full-bleed background media (regardless of `position`), and only
       * HeroContent's own children get arranged into the actual side-by-side
       * split layout. align switches to "left" to match Hero's own split
       * convention (see hero.stories.tsx's SplitLayout example) - centered text
       * next to a media panel reads wrong.
       */}
      <HeroContent>
        {eyebrow && <HeroBadge>{eyebrow}</HeroBadge>}
        <HeroHeading>{headline}</HeroHeading>
        <HeroSubheading>{subheadline}</HeroSubheading>
        <HeroActions>
          <Button variant="default" size="lg" onClick={onPrimaryCtaClick}>
            {primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
          <Button variant="outline" size="lg" onClick={onSecondaryCtaClick}>
            {secondaryCtaLabel}
          </Button>
        </HeroActions>
        {mediaSrc && <HeroMedia src={mediaSrc} alt={mediaAlt} position="right" />}
      </HeroContent>
    </Hero>
  );
}

/* -------------------------------------------------------------------------- */
/*                             LANDING LOGO CLOUD                             */
/* -------------------------------------------------------------------------- */

export interface LandingLogoCloudProps {
  title?: string;
  logos?: LogoCloudItem[];
  /** Custom renderer for each logo - real logos are usually brand SVGs/images, not plain text. */
  renderLogo?: (logo: LogoCloudItem) => React.ReactNode;
  className?: string;
}

/** "Trusted by" strip of partner/client logos. */
function LandingLogoCloud({
  title = "Trusted by teams at",
  logos = DEFAULT_LOGOS,
  renderLogo,
  className,
}: LandingLogoCloudProps) {
  if (logos.length === 0) return null;

  return (
    <section aria-label="Trusted by" className={cn("py-12", className)}>
      <Container size="large">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">{title}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) =>
            renderLogo ? (
              <React.Fragment key={logo.id}>{renderLogo(logo)}</React.Fragment>
            ) : (
              <span
                key={logo.id}
                className="text-lg font-semibold text-muted-foreground/70 grayscale hover:grayscale-0 hover:text-foreground transition-all"
              >
                {logo.logo ?? logo.name}
              </span>
            )
          )}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              LANDING FEATURES                              */
/* -------------------------------------------------------------------------- */

export interface LandingFeaturesProps {
  title?: string;
  description?: string;
  features?: FeatureItem[];
  className?: string;
}

/** Icon + title + description feature grid. */
function LandingFeatures({
  title = "Everything you need to launch",
  description = "Built-in tools to help you move from idea to production without reinventing the basics.",
  features = DEFAULT_FEATURES,
  className,
}: LandingFeaturesProps) {
  return (
    <section id="features" aria-label="Features" className={cn("scroll-mt-16 py-16 md:py-24", className)}>
      <Container size="large">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-4 text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} variant="default">
                <CardHeader>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle size="md">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              LANDING PRICING                               */
/* -------------------------------------------------------------------------- */

export interface LandingPricingProps {
  title?: string;
  description?: string;
  tiers?: PricingTier[];
  showToggle?: boolean;
  onCtaClick?: (tier: PricingTier, billing: "monthly" | "annual") => void;
  className?: string;
}

/**
 * Thin wrapper around `@ignix-ui/pricing-grid`. PricingGrid's own defaults are
 * hardcoded literal colors (white cards, purple accents) rather than the
 * page's semantic tokens, so every color prop is set explicitly here to
 * match the rest of the page instead of introducing an unrelated accent.
 */
function LandingPricing({
  title = "Simple, transparent pricing",
  description = "Choose the plan that fits your team. Upgrade or cancel anytime.",
  tiers = DEFAULT_PRICING_TIERS,
  showToggle = true,
  onCtaClick,
  className,
}: LandingPricingProps) {
  return (
    <section id="pricing" aria-label="Pricing" className={cn("scroll-mt-16 py-16 md:py-24", className)}>
      <PricingGrid
        title={title}
        titleHighlight=""
        description={description}
        tiers={tiers}
        showToggle={showToggle}
        onCtaClick={onCtaClick}
        sectionBackgroundColor="bg-transparent"
        titleColor="text-foreground"
        descriptionColor="text-muted-foreground"
        labelColor="text-muted-foreground"
        accentColor="text-primary"
        toggleActiveColor="bg-primary"
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            LANDING TESTIMONIALS                            */
/* -------------------------------------------------------------------------- */

export interface LandingTestimonialsProps {
  title?: string;
  description?: string;
  testimonials?: TestimonialItem[];
  className?: string;
}

/** Grid/wall of `@ignix-ui/testimonial-card` instances - no multi-testimonial layout exists upstream. */
function LandingTestimonials({
  title = "Loved by teams everywhere",
  description = "See what our customers have to say.",
  testimonials = DEFAULT_TESTIMONIALS,
  className,
}: LandingTestimonialsProps) {
  return (
    <section id="testimonials" aria-label="Testimonials" className={cn("scroll-mt-16 py-16 md:py-24", className)}>
      <Container size="large">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-4 text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id}>
              {testimonial.rating != null && <TestimonialCardRating value={testimonial.rating} />}
              {/*
               * TestimonialCardQuote's default text color resolves correctly, but
               * TestimonialCardAuthor's name/title/company colors are hardcoded
               * internally with no className hook that reaches them - so the author
               * line is hand-rolled below with explicit theme tokens instead, to
               * guarantee contrast against the card background in both themes.
               */}
              <TestimonialCardQuote className="text-foreground">{testimonial.quote}</TestimonialCardQuote>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                {(testimonial.title || testimonial.company) && (
                  <p className="text-sm text-muted-foreground">
                    {[testimonial.title, testimonial.company].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </TestimonialCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                LANDING FAQ                                 */
/* -------------------------------------------------------------------------- */

export interface LandingFAQProps {
  title?: string;
  description?: string;
  items?: FAQItem[];
  className?: string;
}

/** Self-contained FAQ accordion - a single item can be open at a time. */
function LandingFAQ({
  title = "Frequently asked questions",
  description = "Everything you need to know before you get started.",
  items = DEFAULT_FAQ_ITEMS,
  className,
}: LandingFAQProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  // Same collision risk as LandingHeader's mobile menu id - scope every
  // trigger/panel id to this component instance.
  const instanceId = useId();

  return (
    <section id="faq" aria-label="Frequently asked questions" className={cn("scroll-mt-16 py-16 md:py-24", className)}>
      <Container size="normal">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-4 text-muted-foreground">{description}</p>
        </div>
        <div className="divide-y divide-border rounded-xl border border-border">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  id={`faq-trigger-${instanceId}-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${instanceId}-${item.id}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span className="font-medium text-foreground">{item.question}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>
                <div
                  id={`faq-panel-${instanceId}-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${instanceId}-${item.id}`}
                  hidden={!isOpen}
                  className="px-5 pb-4 text-sm text-muted-foreground"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                LANDING CTA                                 */
/* -------------------------------------------------------------------------- */

export interface LandingCTAProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

/** Simple centered "ready to get started" banner. */
function LandingCTA({
  title = "Ready to get started?",
  description = "Join thousands of teams already building with Ignix UI.",
  ctaLabel = "Get started for free",
  onCtaClick,
  className,
}: LandingCTAProps) {
  return (
    <section aria-label="Call to action" className={cn("py-16 md:py-20", className)}>
      <Container size="normal">
        <div className="rounded-2xl bg-primary px-6 py-12 sm:px-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">{title}</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">{description}</p>
          {/*
           * variant="secondary" (bg-muted) is designed for the page's neutral
           * background, not a solid bg-primary banner, where it reads as flat/
           * low-contrast. Explicit primary-foreground-on-primary gives a
           * guaranteed-contrast "inverse" button instead, still theme-token-based.
           */}
          <Button
            variant="default"
            size="lg"
            className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={onCtaClick}
          >
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               LANDING FOOTER                               */
/* -------------------------------------------------------------------------- */

export interface LandingFooterProps {
  brandName?: string;
  description?: string;
  linkGroups?: FooterLinkGroup[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  className?: string;
}

/** Multi-column footer with link groups, social icons, and copyright. */
function LandingFooter({
  brandName = "Ignix",
  description = "Production-ready UI components and templates for building modern web apps.",
  linkGroups = DEFAULT_FOOTER_GROUPS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  copyrightText,
  className,
}: LandingFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border bg-muted/30", className)}>
      <Container size="large">
        <div className="py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <p className="font-bold text-lg text-foreground">{brandName}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">{description}</p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      aria-label={social.label}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          {linkGroups.map((group) => (
            <div key={group.id}>
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.id}-${link.href}`}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          {copyrightText ?? `© ${year} ${brandName}. All rights reserved.`}
        </div>
      </Container>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                                DEFAULT DATA                                */
/* -------------------------------------------------------------------------- */

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const DEFAULT_LOGOS: LogoCloudItem[] = [
  { id: "acme", name: "Acme Corp" },
  { id: "globex", name: "Globex" },
  { id: "initech", name: "Initech" },
  { id: "umbrella", name: "Umbrella" },
  { id: "soylent", name: "Soylent" },
];

const DEFAULT_FEATURES: FeatureItem[] = [
  { id: "speed", icon: Star, title: "Built for speed", description: "Optimized components with minimal overhead so your app stays fast." },
  { id: "themeable", icon: Star, title: "Fully themeable", description: "Light and dark mode support out of the box, driven by CSS variables." },
  { id: "accessible", icon: Star, title: "Accessible by default", description: "Semantic markup and keyboard support across every component." },
];

// Explicit theme-token colors on every tier - PricingGrid falls back to
// hardcoded white/purple otherwise, which clashes with the rest of the page.
const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: { monthly: "$0", annual: "$0" },
    description: "For individuals getting started.",
    ctaLabel: "Get started",
    cardBackgroundColor: "bg-card",
    borderColor: "border-border",
    buttonColor: "bg-muted hover:bg-muted/80",
    buttonTextColor: "text-foreground",
    features: [
      { label: "Up to 3 projects", available: true },
      { label: "Community support", available: true },
      { label: "Priority support", available: false },
    ],
  },
  {
    name: "Pro",
    price: { monthly: "$29", annual: "$290" },
    description: "For growing teams.",
    ctaLabel: "Start free trial",
    recommended: true,
    cardBackgroundColor: "bg-card",
    borderColor: "border-primary/60",
    buttonColor: "bg-primary hover:bg-primary/90",
    buttonTextColor: "text-primary-foreground",
    badgeColor: "bg-primary text-primary-foreground",
    features: [
      { label: "Unlimited projects", available: true },
      { label: "Priority support", available: true },
      { label: "Advanced analytics", available: true },
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    description: "For large organizations.",
    ctaLabel: "Contact sales",
    cardBackgroundColor: "bg-card",
    borderColor: "border-border",
    buttonColor: "bg-muted hover:bg-muted/80",
    buttonTextColor: "text-foreground",
    features: [
      { label: "Unlimited everything", available: true },
      { label: "Dedicated support", available: true },
      { label: "Custom integrations", available: true },
    ],
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { id: "t1", quote: "This product completely transformed how our team ships software.", name: "Sarah Johnson", title: "Product Manager", company: "TechCorp", rating: 5 },
  { id: "t2", quote: "The best developer experience we've had with a UI library.", name: "Miguel Alvarez", title: "Lead Engineer", company: "Northwind", rating: 5 },
  { id: "t3", quote: "Cut our landing page build time from weeks to days.", name: "Priya Nair", title: "Founder", company: "Loopline", rating: 4 },
];

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  { id: "f1", question: "Is there a free plan?", answer: "Yes, the Starter plan is free forever with no credit card required." },
  { id: "f2", question: "Can I cancel anytime?", answer: "Yes, you can cancel or change your plan at any time from your account settings." },
  { id: "f3", question: "Do you offer support?", answer: "All paid plans include priority email support, with dedicated support on Enterprise." },
];

const DEFAULT_FOOTER_GROUPS: FooterLinkGroup[] = [
  { id: "product", title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }] },
  { id: "company", title: "Company", links: [{ label: "About", href: "#about" }, { label: "Blog", href: "#blog" }] },
  { id: "legal", title: "Legal", links: [{ label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }] },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [];

/* -------------------------------------------------------------------------- */
/*                               LANDING PAGE                                 */
/* -------------------------------------------------------------------------- */

export interface LandingPageProps {
  /** Header */
  logo?: React.ReactNode;
  brandName?: string;
  navLinks?: NavLink[];
  headerCtaLabel?: string;
  onHeaderCtaClick?: () => void;

  /** Hero */
  heroEyebrow?: string;
  heroHeadline?: React.ReactNode;
  heroSubheadline?: React.ReactNode;
  heroPrimaryCtaLabel?: string;
  onHeroPrimaryCtaClick?: () => void;
  heroSecondaryCtaLabel?: string;
  onHeroSecondaryCtaClick?: () => void;
  heroMediaSrc?: string;
  heroMediaAlt?: string;

  /** Logo cloud */
  logoCloudTitle?: string;
  logos?: LogoCloudItem[];
  renderLogo?: (logo: LogoCloudItem) => React.ReactNode;

  /** Features */
  featuresTitle?: string;
  featuresDescription?: string;
  features?: FeatureItem[];

  /** Pricing */
  pricingTitle?: string;
  pricingDescription?: string;
  pricingTiers?: PricingTier[];
  onPricingCtaClick?: (tier: PricingTier, billing: "monthly" | "annual") => void;

  /** Testimonials */
  testimonialsTitle?: string;
  testimonials?: TestimonialItem[];

  /** FAQ */
  faqTitle?: string;
  faqItems?: FAQItem[];

  /** CTA */
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** Replaces the entire CTA section. */
  customCTA?: React.ReactNode;

  /** Footer */
  footerLinkGroups?: FooterLinkGroup[];
  footerSocialLinks?: SocialLink[];
  copyrightText?: string;

  className?: string;
}

/**
 * Production-ready marketing/SaaS landing page template. Composes header,
 * hero, logo cloud, features, pricing, testimonials, FAQ, CTA and footer
 * sections. Every section is also exported individually below for hand
 * assembly into a custom layout.
 */
const LandingPage: React.FC<LandingPageProps> = ({
  logo,
  brandName,
  navLinks,
  headerCtaLabel,
  onHeaderCtaClick,
  heroEyebrow,
  heroHeadline,
  heroSubheadline,
  heroPrimaryCtaLabel,
  onHeroPrimaryCtaClick,
  heroSecondaryCtaLabel,
  onHeroSecondaryCtaClick,
  heroMediaSrc,
  heroMediaAlt,
  logoCloudTitle,
  logos,
  renderLogo,
  featuresTitle,
  featuresDescription,
  features,
  pricingTitle,
  pricingDescription,
  pricingTiers,
  onPricingCtaClick,
  testimonialsTitle,
  testimonials,
  faqTitle,
  faqItems,
  ctaTitle,
  ctaDescription,
  ctaLabel,
  onCtaClick,
  customCTA,
  footerLinkGroups,
  footerSocialLinks,
  copyrightText,
  className,
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <LandingHeader
        logo={logo}
        brandName={brandName}
        navLinks={navLinks}
        ctaLabel={headerCtaLabel}
        onCtaClick={onHeaderCtaClick}
      />
      <main>
        <LandingHero
          eyebrow={heroEyebrow}
          headline={heroHeadline}
          subheadline={heroSubheadline}
          primaryCtaLabel={heroPrimaryCtaLabel}
          onPrimaryCtaClick={onHeroPrimaryCtaClick}
          secondaryCtaLabel={heroSecondaryCtaLabel}
          onSecondaryCtaClick={onHeroSecondaryCtaClick}
          mediaSrc={heroMediaSrc}
          mediaAlt={heroMediaAlt}
        />
        <LandingLogoCloud title={logoCloudTitle} logos={logos} renderLogo={renderLogo} />
        <LandingFeatures title={featuresTitle} description={featuresDescription} features={features} />
        <LandingPricing
          title={pricingTitle}
          description={pricingDescription}
          tiers={pricingTiers}
          onCtaClick={onPricingCtaClick}
        />
        <LandingTestimonials title={testimonialsTitle} testimonials={testimonials} />
        <LandingFAQ title={faqTitle} items={faqItems} />
        {customCTA ?? (
          <LandingCTA title={ctaTitle} description={ctaDescription} ctaLabel={ctaLabel} onCtaClick={onCtaClick} />
        )}
      </main>
      <LandingFooter
        brandName={brandName}
        linkGroups={footerLinkGroups}
        socialLinks={footerSocialLinks}
        copyrightText={copyrightText}
      />
    </div>
  );
};

export default LandingPage;
export {
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
};
