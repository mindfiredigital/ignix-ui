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
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown, Zap, Palette, ShieldCheck, Quote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../../../../utils/cn";
import { Button } from "../../../../components/button";
import { Card, CardHeader, CardTitle, CardDescription } from "../../../../components/card";
import { Container } from "../../../../components/layouts/container";
import { Navbar } from "../../../../components/navbar";
import {
  Hero,
  HeroContent,
  HeroBadge,
  HeroHeading,
  HeroSubheading,
  HeroActions,
  HeroMedia,
} from "../../../../templates/section/content/hero";
import { PricingGrid, type PricingTier } from "../../../../templates/section/content/pricing-grid";
import {
  TestimonialCard,
  TestimonialCardQuote,
  TestimonialCardRating,
} from "../../../../templates/patterns/testimonial-card";

/** Reads the current theme straight from the DOM - safe to call during render (SSR-guarded) or inside an effect. */
function readThemeMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  const root = document.documentElement;
  const body = document.body;
  const hasDarkClass = root.classList.contains("dark") || body.classList.contains("dark");
  const hasDarkThemeAttr = root.getAttribute("data-theme") === "dark";
  return hasDarkClass || hasDarkThemeAttr ? "dark" : "light";
}

/**
 * `@ignix-ui/hero`'s `variant` prop selects between two fully hardcoded color
 * sets ("default" = light gray/white, "dark" = gray/black) rather than
 * reading the app's `--background`/`--foreground` theme tokens - unlike
 * every other section on this page, it does not auto-adapt to the current
 * theme. This hook detects the active theme via the `.dark`/`.light` class
 * or `data-theme` attribute Ignix's own dark-mode toggle uses.
 *
 * Deliberately does NOT fall back to `prefers-color-scheme`: none of
 * `ignix.css`'s actual `--background`/`--primary`/etc. variables are wired
 * to that media query, only to the explicit class/attribute above - they
 * stay light unless something actually applies `.dark`. Falling back to the
 * OS/browser color-scheme preference previously caused a real bug: a viewer
 * with OS-level dark mode enabled (but no `.dark` class present, e.g. a
 * default Storybook page) would get `variant="dark"` - white heading text -
 * rendered over the still-light background, making it unreadable.
 */
function useThemeMode(): "light" | "dark" {
  // Lazy initializer instead of a hardcoded "light" default: without this,
  // a page that's already in dark mode still renders the Hero's light
  // variant for one frame (state starts "light" and only flips to "dark"
  // once the effect below runs after the initial paint) - a visible flash
  // of the wrong theme. Reading the DOM synchronously here means the very
  // first render already reflects reality instead of a hardcoded guess.
  const [theme, setTheme] = useState<"light" | "dark">(readThemeMode);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    setTheme(readThemeMode());

    const observer = new MutationObserver(() => setTheme(readThemeMode()));
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}

/**
 * Shared entrance-animation variants, reused by every hand-rolled section so
 * the whole page animates in with one consistent motion language instead of
 * each section inventing its own. `staggerContainer` orchestrates its
 * `fadeInUp` children via variant propagation - a child only needs
 * `variants={fadeInUp}`, no `initial`/`animate` of its own.
 *
 * Deliberately mount-triggered (`animate`), not scroll-triggered
 * (`whileInView`/`viewport`): this template also renders inside Storybook's
 * aggregated docs page, where several full LandingPage instances are
 * stacked on one long page - `whileInView`'s IntersectionObserver-based
 * trigger left content below the fold permanently stuck at `opacity: 0`
 * there (never scrolled into view "enough" to fire, and `once: true` never
 * retried), which is a real content-visibility bug, not just a missed
 * flourish. Animating on mount instead guarantees everything becomes
 * visible regardless of scroll position or embedding context.
 */
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

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
    <header className={cn("sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md", className)}>
      <Navbar variant="default" size="md" className="border-b-0 shadow-none bg-transparent">
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

      {/*
       * Animated height/opacity instead of the plain `hidden` attribute's
       * abrupt jump. Stays mounted at all times (aria-hidden mirrors what
       * `hidden` used to do for the a11y tree) so the collapse can animate
       * instead of disappearing instantly.
       */}
      <motion.div
        id={mobileMenuId}
        aria-hidden={!mobileOpen}
        initial={false}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="md:hidden overflow-hidden border-t border-border bg-background"
      >
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              // `aria-hidden`/`height: 0` only hide this panel visually and
              // from the a11y tree - unlike the `hidden` attribute they
              // replaced, they don't remove its contents from the tab
              // order, so a keyboard user could still Tab into these links
              // while the menu is visually collapsed. tabIndex -1 closes
              // that gap without needing to unmount the panel.
              tabIndex={mobileOpen ? undefined : -1}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="default"
            size="sm"
            className="w-full"
            tabIndex={mobileOpen ? undefined : -1}
            onClick={() => {
              setMobileOpen(false);
              onCtaClick?.();
            }}
          >
            {ctaLabel}
          </Button>
        </div>
      </motion.div>
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
  /**
   * "default" is the clean, centered, theme-adaptive hero. "bold" is a
   * dramatic, left-aligned, always-dark hero with an oversized uppercase
   * headline - the treatment several real SaaS marketing sites (e.g.
   * beehiiv) use to open the page, independent of the site's own light/dark
   * theme toggle.
   */
  tone?: "default" | "bold";
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
  tone = "default",
  className,
}: LandingHeroProps) {
  const theme = useThemeMode();
  const isSplit = Boolean(mediaSrc);
  const isBold = tone === "bold";

  return (
    <Hero
      variant={isBold || theme === "dark" ? "dark" : "default"}
      align={isBold || isSplit ? "left" : "center"}
      animationType="fadeInUp"
      split={isSplit}
      // Hero's own variant backgrounds are flat solid gray/black. "bold"
      // tone commits to its own always-dark, deliberately moody gradient
      // regardless of site theme; otherwise a soft radial-style wash reads
      // far less "plain" while still respecting whichever theme is active.
      backgroundClassName={
        isBold
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : cn(
              "bg-gradient-to-b",
              theme === "dark"
                ? "from-primary/[0.14] via-background to-background"
                : "from-primary/[0.08] via-background to-background"
            )
      }
      // Hero's own default min-h-125/150/175 is sized for a standalone hero
      // page - inside a full landing page that stacks many sections, it
      // leaves a huge empty gap under the content. twMerge (via `cn`) only
      // dedupes classes within the same responsive prefix, so every
      // breakpoint Hero sets has to be overridden explicitly here, not just
      // the base min-h.
      className={cn("min-h-0 md:min-h-0 lg:min-h-0 py-10 md:py-14 lg:py-16", className)}
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
        <HeroHeading className={isBold ? "uppercase font-black tracking-tight" : undefined}>
          {headline}
        </HeroHeading>
        <HeroSubheading>{subheadline}</HeroSubheading>
        <HeroActions>
          {/*
           * "bold" tone forces a near-black background regardless of the
           * page's own theme, so the default variant's theme-driven
           * `bg-primary` (which can itself be a dark color, as it is here)
           * would blend into it. Explicit white-on-dark styling guarantees
           * contrast independent of whatever `--primary` resolves to.
           */}
          <Button
            variant="default"
            size="lg"
            className={isBold ? "bg-white text-slate-950 hover:bg-white/90" : undefined}
            onClick={onPrimaryCtaClick}
          >
            {primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={isBold ? "border-white/30 text-white hover:bg-white/10 hover:text-white" : undefined}
            onClick={onSecondaryCtaClick}
          >
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
    <section aria-label="Trusted by" className={cn("py-8", className)}>
      <Container size="large">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6">{title}</p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {logos.map((logo) =>
            renderLogo ? (
              <motion.div key={logo.id} variants={fadeInUp}>
                {renderLogo(logo)}
              </motion.div>
            ) : (
              <motion.span
                key={logo.id}
                variants={fadeInUp}
                className="text-lg font-semibold text-muted-foreground/70 grayscale hover:grayscale-0 hover:text-foreground transition-all"
              >
                {logo.logo ?? logo.name}
              </motion.span>
            )
          )}
        </motion.div>
      </Container>
    </section>
  );
}

/**
 * Small "EYEBROW / Title / description" heading used by every hand-rolled
 * section for visual rhythm - echoes the "PRICING" label already built into
 * `@ignix-ui/pricing-grid`'s own heading, so the page reads as one system
 * rather than pricing being the only section with that treatment.
 */
function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      className="text-center max-w-2xl mx-auto mb-10"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              LANDING FEATURES                              */
/* -------------------------------------------------------------------------- */

export interface LandingFeaturesProps {
  title?: string;
  description?: string;
  features?: FeatureItem[];
  /**
   * "grid" (default) is a card grid; "spotlight" is an alternating editorial
   * layout; "showcase" is a bold, alternating full-bleed panel layout (each
   * feature paired with a large colorful device-frame panel) - the "one
   * feature per screenful" pattern several real SaaS marketing sites use.
   */
  variant?: "grid" | "spotlight" | "showcase";
  className?: string;
}

/** Icon + title + description feature grid, in a card-grid or alternating "spotlight" layout. */
function LandingFeatures({
  title = "Everything you need to launch",
  description = "Built-in tools to help you move from idea to production without reinventing the basics.",
  features = DEFAULT_FEATURES,
  variant = "grid",
  className,
}: LandingFeaturesProps) {
  return (
    <section
      id="features"
      aria-label="Features"
      className={cn("relative scroll-mt-16 overflow-hidden py-12 md:py-16", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
      />
      <Container size="large" className="relative">
        <SectionHeading eyebrow="Features" title={title} description={description} />
        {variant === "showcase" ? (
          <motion.div
            className="space-y-16 md:space-y-24"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const reversed = index % 2 === 1;
              // Vivid, literal panel colors are intentional here (unlike the
              // rest of the page, which is entirely semantic-token-driven) -
              // "showcase" is the one bold, colorful variant, cycling through
              // a small fixed palette so each panel is distinct.
              const palette = SHOWCASE_PALETTE[index % SHOWCASE_PALETTE.length];
              return (
                <motion.div
                  key={feature.id}
                  variants={fadeInUp}
                  className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
                >
                  <div className={reversed ? "lg:order-2" : undefined}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-muted-foreground max-w-md">{feature.description}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl",
                      palette,
                      reversed ? "lg:order-1" : undefined
                    )}
                  >
                    <div aria-hidden className="absolute top-4 left-4 flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                    </div>
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon className="h-16 w-16 text-white/90" aria-hidden />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : variant === "spotlight" ? (
          <motion.div
            className="divide-y divide-border"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const reversed = index % 2 === 1;
              return (
                <motion.div
                  key={feature.id}
                  variants={fadeInUp}
                  className={cn(
                    "flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:text-left",
                    reversed && "sm:flex-row-reverse sm:text-right"
                  )}
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
                    <Icon className="h-7 w-7" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.id} variants={fadeInUp}>
                  <Card
                    variant="default"
                    className="transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <CardTitle size="md">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
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
    <section
      id="pricing"
      aria-label="Pricing"
      className={cn("relative scroll-mt-16 overflow-hidden py-12 md:py-16", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl"
      />
      {/*
       * PricingGrid's own card list isn't ours to stagger individually - it
       * renders as one opaque block - so the whole grid gets a single
       * reveal instead of per-card animation like the other sections.
       */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
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
      </motion.div>
    </section>
  );
}

/**
 * Single testimonial card body, shared by both LandingTestimonials layout
 * variants so the grid and the "rest" row under a spotlight quote render
 * identically.
 */
function TestimonialCardTile({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    // h-full so the card's visible box (border/shadow/rounded corners)
    // actually fills its grid cell instead of just sizing to its own quote
    // length - CSS Grid already stretches every cell in a row to match the
    // tallest one by default, but TestimonialCard itself doesn't opt into
    // filling that stretched space without this, so shorter quotes render
    // as visibly smaller boxes even though their grid cells match.
    <TestimonialCard className="h-full flex flex-col">
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
  );
}

/* -------------------------------------------------------------------------- */
/*                            LANDING TESTIMONIALS                            */
/* -------------------------------------------------------------------------- */

export interface LandingTestimonialsProps {
  title?: string;
  description?: string;
  testimonials?: TestimonialItem[];
  /** "grid" (default) is a wall of cards; "spotlight" features the first testimonial large, with the rest below. */
  variant?: "grid" | "spotlight";
  className?: string;
}

/** Grid/wall of `@ignix-ui/testimonial-card` instances, or one featured quote over a smaller supporting row. */
function LandingTestimonials({
  title = "Loved by teams everywhere",
  description = "See what our customers have to say.",
  testimonials = DEFAULT_TESTIMONIALS,
  variant = "grid",
  className,
}: LandingTestimonialsProps) {
  const [featured, ...rest] = testimonials;

  return (
    <section id="testimonials" aria-label="Testimonials" className={cn("scroll-mt-16 py-12 md:py-16", className)}>
      <Container size="large">
        <SectionHeading eyebrow="Testimonials" title={title} description={description} />
        {variant === "spotlight" && featured ? (
          <div className="space-y-10">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Quote className="mx-auto mb-4 h-10 w-10 text-primary/30" aria-hidden />
              <p className="text-xl md:text-2xl font-medium text-foreground">&ldquo;{featured.quote}&rdquo;</p>
              <p className="mt-6 font-semibold text-foreground">{featured.name}</p>
              {(featured.title || featured.company) && (
                <p className="text-sm text-muted-foreground">
                  {[featured.title, featured.company].filter(Boolean).join(" · ")}
                </p>
              )}
            </motion.div>
            {rest.length > 0 && (
              <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {rest.map((testimonial) => (
                  <motion.div key={testimonial.id} variants={fadeInUp}>
                    <TestimonialCardTile testimonial={testimonial} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeInUp}>
                <TestimonialCardTile testimonial={testimonial} />
              </motion.div>
            ))}
          </motion.div>
        )}
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
    <section id="faq" aria-label="Frequently asked questions" className={cn("scroll-mt-16 py-12 md:py-16", className)}>
      <Container size="normal">
        <SectionHeading eyebrow="FAQ" title={title} description={description} />
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                className={cn(
                  "rounded-xl border transition-colors",
                  isOpen ? "border-primary/30 bg-muted/40" : "border-border hover:border-primary/20"
                )}
              >
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
                    className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180 text-primary")}
                    aria-hidden
                  />
                </button>
                {/*
                 * Animated height/opacity instead of the plain `hidden`
                 * attribute's abrupt jump - still always mounted (aria-hidden
                 * mirrors what `hidden` used to do for the a11y tree) so
                 * aria-controls always resolves to a real element and the
                 * collapse can animate instead of disappearing instantly.
                 */}
                <motion.div
                  id={`faq-panel-${instanceId}-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${instanceId}-${item.id}`}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-sm text-muted-foreground">{item.answer}</div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
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
    <section aria-label="Call to action" className={cn("py-10 md:py-14", className)}>
      <Container size="normal">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 sm:px-12 text-center"
        >
          {/* Decorative blurred blobs, matching the same pattern used by the
              existing call-to-action section template's "gradient" variant. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-tl from-white/10 to-transparent blur-3xl"
          />
          <h2 className="relative text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">{title}</h2>
          <p className="relative mt-3 text-primary-foreground/80 max-w-xl mx-auto">{description}</p>
          {/*
           * variant="secondary" (bg-muted) is designed for the page's neutral
           * background, not a solid bg-primary banner, where it reads as flat/
           * low-contrast. Explicit primary-foreground-on-primary gives a
           * guaranteed-contrast "inverse" button instead, still theme-token-based.
           */}
          <Button
            variant="default"
            size="lg"
            className="relative mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={onCtaClick}
          >
            {ctaLabel}
          </Button>
        </motion.div>
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
        <div className="py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
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
  { id: "speed", icon: Zap, title: "Built for speed", description: "Optimized components with minimal overhead so your app stays fast." },
  { id: "themeable", icon: Palette, title: "Fully themeable", description: "Light and dark mode support out of the box, driven by CSS variables." },
  { id: "accessible", icon: ShieldCheck, title: "Accessible by default", description: "Semantic markup and keyboard support across every component." },
];

/** Panel background colors cycled through by `LandingFeatures`'s "showcase" variant. */
const SHOWCASE_PALETTE = [
  "bg-gradient-to-br from-indigo-500 to-blue-600",
  "bg-gradient-to-br from-fuchsia-500 to-pink-600",
  "bg-gradient-to-br from-amber-500 to-orange-600",
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
  heroTone?: "default" | "bold";

  /** Logo cloud */
  logoCloudTitle?: string;
  logos?: LogoCloudItem[];
  renderLogo?: (logo: LogoCloudItem) => React.ReactNode;

  /** Features */
  featuresTitle?: string;
  featuresDescription?: string;
  features?: FeatureItem[];
  featuresVariant?: "grid" | "spotlight" | "showcase";

  /** Pricing */
  pricingTitle?: string;
  pricingDescription?: string;
  pricingTiers?: PricingTier[];
  onPricingCtaClick?: (tier: PricingTier, billing: "monthly" | "annual") => void;

  /** Testimonials */
  testimonialsTitle?: string;
  testimonials?: TestimonialItem[];
  testimonialsVariant?: "grid" | "spotlight";

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
  heroTone,
  logoCloudTitle,
  logos,
  renderLogo,
  featuresTitle,
  featuresDescription,
  features,
  featuresVariant,
  pricingTitle,
  pricingDescription,
  pricingTiers,
  onPricingCtaClick,
  testimonialsTitle,
  testimonials,
  testimonialsVariant,
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
          tone={heroTone}
        />
        <LandingLogoCloud title={logoCloudTitle} logos={logos} renderLogo={renderLogo} />
        <LandingFeatures
          title={featuresTitle}
          description={featuresDescription}
          features={features}
          variant={featuresVariant}
        />
        <LandingPricing
          title={pricingTitle}
          description={pricingDescription}
          tiers={pricingTiers}
          onCtaClick={onPricingCtaClick}
        />
        <LandingTestimonials
          title={testimonialsTitle}
          testimonials={testimonials}
          variant={testimonialsVariant}
        />
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
