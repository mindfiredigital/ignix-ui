/**
 * @file index.tsx
 * @description Portfolio & Showcase Page template and composable building
 * blocks for the Ignix UI registry. A production-ready personal portfolio
 * page composed of header, hero, about, skills, project gallery, experience
 * timeline, testimonials, stats, and contact sections. Reuses
 * `@ignix-ui/hero`, `@ignix-ui/avatar`, `@ignix-ui/badge`,
 * `@ignix-ui/image-card`, `@ignix-ui/testimonial-card` and
 * `@ignix-ui/navbar` for the pieces that already exist in the registry, and
 * hand-rolls the sections that don't (header composition, about, skills,
 * project gallery arrangement, experience timeline, stats, contact banner,
 * footer).
 */

"use client";

import React, { useId, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  MapPin,
  Calendar,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@site/src/utils/cn";
import { Button } from "../button";
import { Card } from "../card";
import { Container } from "../container";
import { Navbar } from "../navbar";
import { Avatar } from "../avatar";
import { Badge } from "../badge";
import { Hero, HeroContent, HeroBadge, HeroHeading, HeroSubheading, HeroActions } from "../hero";
import { ImageCard, type CardLink } from "../image-card";
import { TestimonialCard, TestimonialCardQuote, TestimonialCardRating } from "../testimonial-card";

/** Reads the current theme straight from the DOM - safe to call during render (SSR-guarded) or inside an effect. */
function readThemeMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  const root = document.documentElement;
  const body = document.body;
  const hasDarkClass = root.classList.contains("dark") || body.classList.contains("dark");
  // The dark: variant contract matches [data-theme="dark"] on any ancestor,
  // not just <html> - the .dark class check above already covers both root
  // and body, so data-theme should too, or a consumer app that sets
  // data-theme="dark" on <body> (a perfectly valid choice under that
  // contract) would style the rest of the page dark while this hook still
  // reports "light".
  const hasDarkThemeAttr = root.getAttribute("data-theme") === "dark" || body.getAttribute("data-theme") === "dark";
  return hasDarkClass || hasDarkThemeAttr ? "dark" : "light";
}

/** Watches for theme-affecting DOM mutations, for `useThemeMode`'s `useSyncExternalStore` subscription. */
function subscribeToThemeMode(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const root = document.documentElement;
  const body = document.body;

  const observer = new MutationObserver(callback);
  observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
  observer.observe(body, { attributes: true, attributeFilter: ["class", "data-theme"] });

  return () => {
    observer.disconnect();
  };
}

/** This template has no way to know the real theme before hydration, so the server always renders "light". */
function getServerThemeSnapshot(): "light" | "dark" {
  return "light";
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
 * stay light unless something actually applies `.dark`.
 *
 * Built on `useSyncExternalStore` rather than `useState`+`useEffect` - it's
 * the React-recommended primitive for exactly this shape of external,
 * mutable source, and it also avoids a flash of the wrong theme on mount:
 * the first client render already reflects the DOM's real state
 * (`readThemeMode` is the client snapshot) instead of a hardcoded guess.
 */
function useThemeMode(): "light" | "dark" {
  return useSyncExternalStore(subscribeToThemeMode, readThemeMode, getServerThemeSnapshot);
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
 * aggregated docs page, where several full PortfolioPage instances are
 * stacked on one long page - `whileInView`'s IntersectionObserver-based
 * trigger would leave content below the fold permanently stuck at
 * `opacity: 0` there (never scrolled into view "enough" to fire). Animating
 * on mount instead guarantees everything becomes visible regardless of
 * scroll position or embedding context.
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

export interface SocialLink {
  id: string;
  icon: LucideIcon;
  href: string;
  label: string;
}

export interface AboutFact {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  links?: CardLink[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description?: string;
  current?: boolean;
  achievements?: string[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  title?: string;
  company?: string;
  rating?: number;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface FooterLinkGroup {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

/* -------------------------------------------------------------------------- */
/*                             PORTFOLIO HEADER                               */
/* -------------------------------------------------------------------------- */

export interface PortfolioHeaderProps {
  /** Replaces the default text logo entirely. */
  logo?: React.ReactNode;
  brandName?: string;
  navLinks?: NavLink[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

/**
 * Portfolio site header: name/logo, section nav links, CTA button, and an
 * accessible mobile menu toggle. Wraps `@ignix-ui/navbar`, which is an
 * unopinionated `<nav>` shell with no built-in logo/links/CTA/mobile-menu
 * behavior.
 */
function PortfolioHeader({
  logo,
  brandName = "Alex Rivera",
  navLinks = DEFAULT_NAV_LINKS,
  ctaLabel = "Get in touch",
  onCtaClick,
  className,
}: PortfolioHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Storybook's autodocs page (and any layout rendering PortfolioHeader more
  // than once) puts multiple instances in the same DOM - a static id would
  // collide and break aria-controls, so each instance gets its own.
  const mobileMenuId = `portfolio-mobile-menu-${useId()}`;

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
              // from the a11y tree - they don't remove its contents from the
              // tab order, so a keyboard user could still Tab into these
              // links while the menu is visually collapsed. tabIndex -1
              // closes that gap without needing to unmount the panel.
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
/*                              PORTFOLIO HERO                                */
/* -------------------------------------------------------------------------- */

export interface PortfolioHeroProps {
  eyebrow?: string;
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  avatarSrc?: string;
  avatarAlt?: string;
  primaryCtaLabel?: string;
  onPrimaryCtaClick?: () => void;
  secondaryCtaLabel?: string;
  onSecondaryCtaClick?: () => void;
  socialLinks?: SocialLink[];
  /**
   * "default" is the clean, centered, theme-adaptive hero. "bold" is a
   * dramatic, always-dark hero with an oversized uppercase headline -
   * independent of the site's own light/dark theme toggle.
   */
  tone?: "default" | "bold";
  className?: string;
}

/** Above-the-fold intro section, built from `@ignix-ui/hero`'s composable parts plus an `Avatar` portrait. */
function PortfolioHero({
  eyebrow,
  headline = "Hi, I'm Alex Rivera",
  subheadline = "Product designer and frontend engineer building fast, accessible interfaces - here's a look at what I've been working on.",
  avatarSrc,
  avatarAlt = "Profile photo",
  primaryCtaLabel = "View my work",
  onPrimaryCtaClick,
  secondaryCtaLabel = "Get in touch",
  onSecondaryCtaClick,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  tone = "default",
  className,
}: PortfolioHeroProps) {
  const theme = useThemeMode();
  const isBold = tone === "bold";

  return (
    <Hero
      variant={isBold || theme === "dark" ? "dark" : "default"}
      align="center"
      animationType="fadeInUp"
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
      // page - inside a full portfolio page that stacks many sections, it
      // leaves a huge empty gap under the content. twMerge (via `cn`) only
      // dedupes classes within the same responsive prefix, so every
      // breakpoint Hero sets has to be overridden explicitly here, not just
      // the base min-h.
      className={cn("min-h-0 md:min-h-0 lg:min-h-0 py-14 md:py-20 lg:py-24", className)}
    >
      <HeroContent>
        <Avatar
          src={avatarSrc}
          alt={avatarAlt}
          size="3xl"
          shape="circle"
          bordered
          className="mx-auto mb-6"
        />
        {/* HeroBadge sets no text color of its own, so it would inherit black on any background. */}
        {eyebrow && (
          <HeroBadge className={isBold ? "text-white" : "border-border bg-primary/10 text-foreground"}>
            {eyebrow}
          </HeroBadge>
        )}
        <HeroHeading className={isBold ? "uppercase font-black tracking-tight" : undefined}>
          {headline}
        </HeroHeading>
        <HeroSubheading>{subheadline}</HeroSubheading>
        <HeroActions>
          {/*
           * "bold" tone forces a near-black background regardless of the
           * page's own theme, so the default variant's theme-driven
           * `bg-primary` (which can itself be a dark color) would blend
           * into it. Explicit white-on-dark styling guarantees contrast
           * independent of whatever `--primary` resolves to.
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
            // The outline variant sets no text color, so it would inherit
            // black - invisible on the dark-theme hero.
            className={
              isBold ? "border-white/30 text-white hover:bg-white/10 hover:text-white" : "text-foreground"
            }
            onClick={onSecondaryCtaClick}
          >
            {secondaryCtaLabel}
          </Button>
        </HeroActions>
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "transition-colors",
                    isBold ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </a>
              );
            })}
          </div>
        )}
      </HeroContent>
    </Hero>
  );
}

/**
 * Small "EYEBROW / Title / description" heading used by every hand-rolled
 * section for visual rhythm.
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
/*                              PORTFOLIO ABOUT                               */
/* -------------------------------------------------------------------------- */

export interface PortfolioAboutProps {
  title?: string;
  bio?: React.ReactNode;
  facts?: AboutFact[];
  className?: string;
}

/** Bio paragraph plus a row of "quick facts" (location, availability, experience, etc.). */
function PortfolioAbout({
  title = "About me",
  bio = "I'm a product-focused engineer with a background in visual design. I care about the details that make an interface feel fast, clear, and trustworthy - and I like shipping things people actually use.",
  facts = DEFAULT_ABOUT_FACTS,
  className,
}: PortfolioAboutProps) {
  return (
    <section id="about" aria-label="About" className={cn("scroll-mt-16 py-14 md:py-20", className)}>
      <Container size="full" className="max-w-4xl">
        <SectionHeading eyebrow="About" title={title} />
        <motion.p
          className="text-center text-lg text-muted-foreground max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {bio}
        </motion.p>
        {facts.length > 0 && (
          <motion.div
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <motion.div key={fact.id} variants={fadeInUp}>
                  <Card className="flex h-full items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{fact.label}</p>
                      <p className="text-sm font-semibold text-foreground">{fact.value}</p>
                    </div>
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
/*                              PORTFOLIO SKILLS                              */
/* -------------------------------------------------------------------------- */

export interface PortfolioSkillsProps {
  title?: string;
  description?: string;
  groups?: SkillGroup[];
  className?: string;
}

/** Skill categories, each rendered as a group heading plus a row of `Badge` pills. */
function PortfolioSkills({
  title = "Skills & tools",
  description = "The languages, frameworks, and tools I use most.",
  groups = DEFAULT_SKILL_GROUPS,
  className,
}: PortfolioSkillsProps) {
  return (
    <section id="skills" aria-label="Skills" className={cn("scroll-mt-16 py-14 md:py-20", className)}>
      <Container size="full" className="max-w-6xl">
        <SectionHeading eyebrow="Skills" title={title} description={description} />
        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {groups.map((group) => (
            <motion.div key={group.id} variants={fadeInUp}>
              <h3 className="text-sm font-semibold text-foreground mb-3">{group.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="secondary">{skill}</Badge>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             PORTFOLIO PROJECTS                             */
/* -------------------------------------------------------------------------- */

export interface PortfolioProjectsProps {
  title?: string;
  description?: string;
  projects?: ProjectItem[];
  /**
   * "grid" (default) is a uniform card grid; "masonry" arranges cards in
   * CSS columns so varying description lengths create a less uniform,
   * more visually varied gallery.
   */
  variant?: "grid" | "masonry";
  className?: string;
}

/** Project gallery, each project rendered as an `ImageCard` with a title/description below the image and action links. */
function PortfolioProjects({
  title = "Selected work",
  description = "A few projects I've designed, built, or shipped recently.",
  projects = DEFAULT_PROJECTS,
  variant = "grid",
  className,
}: PortfolioProjectsProps) {
  const isMasonry = variant === "masonry";

  return (
    <section id="projects" aria-label="Projects" className={cn("relative scroll-mt-16 overflow-hidden py-14 md:py-20", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
      />
      <Container size="full" className="relative max-w-6xl">
        <SectionHeading eyebrow="Projects" title={title} description={description} />
        <motion.div
          className={
            isMasonry
              ? "columns-1 gap-6 sm:columns-2 lg:columns-3"
              : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className={isMasonry ? "mb-6 break-inside-avoid" : undefined}
            >
              {/*
               * layout="below" (title/description rendered under the image
               * in normal theme-token text), not "overlay" - overlay only
               * has a contrast backdrop for the title when a real `image`
               * is provided; ImageCard's own "no image" fallback state
               * renders the overlay title with no gradient scrim behind it
               * at all, making it illegible white-on-light-gray. This
               * template's projects don't ship with real image URLs by
               * default (to avoid depending on external hosting), so
               * "below" is the layout that's actually correct without one.
               */}
              <ImageCard
                image={project.image}
                title={project.title}
                description={project.description}
                category={project.category}
                button={project.links}
                layout="below"
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            PORTFOLIO EXPERIENCE                            */
/* -------------------------------------------------------------------------- */

export interface PortfolioExperienceProps {
  title?: string;
  description?: string;
  items?: ExperienceItem[];
  className?: string;
}

/** Vertical timeline of roles/education - a connecting line with a dot per entry. */
function PortfolioExperience({
  title = "Experience",
  description = "Where I've worked and what I've learned along the way.",
  items = DEFAULT_EXPERIENCE_ITEMS,
  className,
}: PortfolioExperienceProps) {
  return (
    <section id="experience" aria-label="Experience" className={cn("scroll-mt-16 py-14 md:py-20", className)}>
      <Container size="full" className="max-w-4xl">
        <SectionHeading eyebrow="Experience" title={title} description={description} />
        <motion.div
          className="relative space-y-10 border-l border-border pl-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={fadeInUp} className="relative">
              <span
                aria-hidden
                // pl-8 (32px) + half the 1px border + half the 10px dot, so the
                // dot sits centered on the timeline's left border line.
                className={cn(
                  "absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background",
                  item.current ? "bg-primary" : "bg-muted-foreground/50"
                )}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {item.role} <span className="font-normal text-muted-foreground">· {item.company}</span>
                </h3>
                {item.current && <Badge variant="success">Current</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.period}</p>
              {item.description && <p className="mt-3 text-muted-foreground">{item.description}</p>}
              {item.achievements && item.achievements.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/**
 * Single testimonial card body, shared by the testimonials grid.
 */
function TestimonialCardTile({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    // h-full so the card's visible box (border/shadow/rounded corners)
    // actually fills its grid cell instead of just sizing to its own quote
    // length - CSS Grid already stretches every cell in a row to match the
    // tallest one by default, but TestimonialCard itself doesn't opt into
    // filling that stretched space without this.
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
/*                           PORTFOLIO TESTIMONIALS                           */
/* -------------------------------------------------------------------------- */

export interface PortfolioTestimonialsProps {
  title?: string;
  description?: string;
  testimonials?: TestimonialItem[];
  className?: string;
}

/** Grid/wall of `@ignix-ui/testimonial-card` instances, reframed as recommendations from colleagues/clients. */
function PortfolioTestimonials({
  title = "What people say",
  description = "Recommendations from people I've worked with.",
  testimonials = DEFAULT_TESTIMONIALS,
  className,
}: PortfolioTestimonialsProps) {
  return (
    <section id="testimonials" aria-label="Testimonials" className={cn("scroll-mt-16 py-14 md:py-20", className)}>
      <Container size="full" className="max-w-6xl">
        <SectionHeading eyebrow="Testimonials" title={title} description={description} />
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
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PORTFOLIO STATS                               */
/* -------------------------------------------------------------------------- */

export interface PortfolioStatsProps {
  title?: string;
  stats?: StatItem[];
  className?: string;
}

/** Optional row of achievement numbers - renders nothing when `stats` is empty, so it's easy to omit entirely. */
function PortfolioStats({ title = "By the numbers", stats = DEFAULT_STATS, className }: PortfolioStatsProps) {
  if (stats.length === 0) return null;

  return (
    <section id="stats" aria-label="Stats" className={cn("scroll-mt-16 py-14 md:py-20", className)}>
      <Container size="full" className="max-w-5xl">
        <SectionHeading eyebrow="Stats" title={title} />
        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {stats.map((stat) => (
            <motion.div key={stat.id} variants={fadeInUp}>
              <Card className="h-full py-8 text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            PORTFOLIO CONTACT CTA                           */
/* -------------------------------------------------------------------------- */

export interface PortfolioContactCTAProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

/** Simple centered "let's work together" closing banner. */
function PortfolioContactCTA({
  title = "Let's work together",
  description = "I'm currently open to new opportunities and collaborations - feel free to reach out.",
  ctaLabel = "Say hello",
  onCtaClick,
  className,
}: PortfolioContactCTAProps) {
  return (
    <section id="contact" aria-label="Contact" className={cn("scroll-mt-16 py-14 md:py-16", className)}>
      <Container size="full" className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 sm:px-12 text-center"
        >
          {/* Decorative blurred blobs, matching the pattern used elsewhere in this template's sections. */}
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
           * Explicit primary-foreground-on-primary gives a guaranteed-
           * contrast "inverse" button, still theme-token-based, rather than
           * a variant designed for a neutral background reading flat here.
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
/*                              PORTFOLIO FOOTER                              */
/* -------------------------------------------------------------------------- */

export interface PortfolioFooterProps {
  brandName?: string;
  description?: string;
  linkGroups?: FooterLinkGroup[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  className?: string;
}

/** Multi-column footer with link groups, social icons, and copyright. */
function PortfolioFooter({
  brandName = "Alex Rivera",
  description = "Product designer and frontend engineer.",
  linkGroups = DEFAULT_FOOTER_GROUPS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  copyrightText,
  className,
}: PortfolioFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border bg-muted/30", className)}>
      <Container size="full" className="max-w-6xl">
        <div className="py-10 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="col-span-2 sm:col-span-1">
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
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: "github", icon: Github, href: "#", label: "GitHub" },
  { id: "linkedin", icon: Linkedin, href: "#", label: "LinkedIn" },
  { id: "twitter", icon: Twitter, href: "#", label: "Twitter" },
  { id: "email", icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

const DEFAULT_ABOUT_FACTS: AboutFact[] = [
  { id: "location", icon: MapPin, label: "Location", value: "San Francisco, CA" },
  { id: "availability", icon: Calendar, label: "Availability", value: "Open to work" },
  { id: "experience", icon: Briefcase, label: "Experience", value: "6+ years" },
];

const DEFAULT_SKILL_GROUPS: SkillGroup[] = [
  { id: "frontend", title: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"] },
  { id: "design", title: "Design", skills: ["Figma", "Design Systems", "Prototyping"] },
  { id: "backend", title: "Backend & Tools", skills: ["Node.js", "PostgreSQL", "Git", "Docker"] },
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    title: "Ignix UI",
    description: "An accessible, animated component library and design system built on Tailwind CSS.",
    category: "Design System",
    links: [{ label: "View project" }],
  },
  {
    id: "p2",
    title: "Orbit Dashboard",
    description: "A real-time analytics dashboard with customizable widgets and live data streaming.",
    category: "Web App",
    links: [{ label: "View project" }],
  },
  {
    id: "p3",
    title: "Loop Notes",
    description: "A minimalist note-taking app with offline sync and end-to-end encryption.",
    category: "Mobile",
    links: [{ label: "View project" }],
  },
  {
    id: "p4",
    title: "Marketplace Redesign",
    description: "End-to-end redesign of a marketplace checkout flow, improving conversion by 18%.",
    category: "Case Study",
    links: [{ label: "View project" }],
  },
];

const DEFAULT_EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "e1",
    role: "Senior Frontend Engineer",
    company: "TechCorp",
    period: "2023 - Present",
    current: true,
    description: "Leading the design system team, building reusable component libraries used across 12 product teams.",
    achievements: ["Cut new-feature build time by 40% with a shared component library", "Mentored 4 junior engineers"],
  },
  {
    id: "e2",
    role: "Product Designer",
    company: "Northwind",
    period: "2020 - 2023",
    description: "Designed and shipped core product flows for a B2B SaaS platform, from research to production.",
    achievements: ["Redesigned onboarding, reducing time-to-first-value by 30%"],
  },
  {
    id: "e3",
    role: "B.S. Computer Science",
    company: "State University",
    period: "2016 - 2020",
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    quote: "Alex has an incredible eye for detail and consistently ships polished, accessible interfaces.",
    name: "Sarah Johnson",
    title: "Product Manager",
    company: "TechCorp",
    rating: 5,
  },
  {
    id: "t2",
    quote: "One of the best engineers I've worked with - fast, thoughtful, and great at communicating tradeoffs.",
    name: "Miguel Alvarez",
    title: "Engineering Lead",
    company: "Northwind",
    rating: 5,
  },
  {
    id: "t3",
    quote: "Turned a vague idea into a shipped, well-designed product in record time.",
    name: "Priya Nair",
    title: "Founder",
    company: "Loopline",
    rating: 4,
  },
];

const DEFAULT_STATS: StatItem[] = [
  { id: "s1", value: "6+", label: "Years experience" },
  { id: "s2", value: "40+", label: "Projects shipped" },
  { id: "s3", value: "12", label: "Teams supported" },
  { id: "s4", value: "18%", label: "Avg. conversion lift" },
];

const DEFAULT_FOOTER_GROUPS: FooterLinkGroup[] = [
  { id: "site", title: "Site", links: [{ label: "About", href: "#about" }, { label: "Projects", href: "#projects" }] },
  { id: "connect", title: "Connect", links: [{ label: "Email", href: "mailto:hello@example.com" }, { label: "LinkedIn", href: "#" }] },
];

/* -------------------------------------------------------------------------- */
/*                               PORTFOLIO PAGE                               */
/* -------------------------------------------------------------------------- */

export interface PortfolioPageProps {
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
  heroAvatarSrc?: string;
  heroAvatarAlt?: string;
  heroPrimaryCtaLabel?: string;
  onHeroPrimaryCtaClick?: () => void;
  heroSecondaryCtaLabel?: string;
  onHeroSecondaryCtaClick?: () => void;
  heroSocialLinks?: SocialLink[];
  heroTone?: "default" | "bold";

  /** About */
  aboutTitle?: string;
  aboutBio?: React.ReactNode;
  aboutFacts?: AboutFact[];

  /** Skills */
  skillsTitle?: string;
  skillsDescription?: string;
  skillGroups?: SkillGroup[];

  /** Projects */
  projectsTitle?: string;
  projectsDescription?: string;
  projects?: ProjectItem[];
  projectsVariant?: "grid" | "masonry";

  /** Experience */
  experienceTitle?: string;
  experienceDescription?: string;
  experienceItems?: ExperienceItem[];

  /** Testimonials */
  testimonialsTitle?: string;
  testimonialsDescription?: string;
  testimonials?: TestimonialItem[];

  /** Stats */
  statsTitle?: string;
  stats?: StatItem[];

  /** Contact CTA */
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** Replaces the entire contact CTA section. */
  customCTA?: React.ReactNode;

  /** Footer */
  footerDescription?: string;
  footerLinkGroups?: FooterLinkGroup[];
  footerSocialLinks?: SocialLink[];
  copyrightText?: string;

  className?: string;
}

/**
 * Production-ready personal portfolio & showcase page template. Composes
 * header, hero, about, skills, project gallery, experience, testimonials,
 * stats, and contact sections. Every section is also exported individually
 * below for hand assembly into a custom layout.
 */
const PortfolioPage: React.FC<PortfolioPageProps> = ({
  logo,
  brandName,
  navLinks,
  headerCtaLabel,
  onHeaderCtaClick,
  heroEyebrow,
  heroHeadline,
  heroSubheadline,
  heroAvatarSrc,
  heroAvatarAlt,
  heroPrimaryCtaLabel,
  onHeroPrimaryCtaClick,
  heroSecondaryCtaLabel,
  onHeroSecondaryCtaClick,
  heroSocialLinks,
  heroTone,
  aboutTitle,
  aboutBio,
  aboutFacts,
  skillsTitle,
  skillsDescription,
  skillGroups,
  projectsTitle,
  projectsDescription,
  projects,
  projectsVariant,
  experienceTitle,
  experienceDescription,
  experienceItems,
  testimonialsTitle,
  testimonialsDescription,
  testimonials,
  statsTitle,
  stats,
  ctaTitle,
  ctaDescription,
  ctaLabel,
  onCtaClick,
  customCTA,
  footerDescription,
  footerLinkGroups,
  footerSocialLinks,
  copyrightText,
  className,
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <PortfolioHeader
        logo={logo}
        brandName={brandName}
        navLinks={navLinks}
        ctaLabel={headerCtaLabel}
        onCtaClick={onHeaderCtaClick}
      />
      <main>
        <PortfolioHero
          eyebrow={heroEyebrow}
          headline={heroHeadline}
          subheadline={heroSubheadline}
          avatarSrc={heroAvatarSrc}
          avatarAlt={heroAvatarAlt}
          primaryCtaLabel={heroPrimaryCtaLabel}
          onPrimaryCtaClick={onHeroPrimaryCtaClick}
          secondaryCtaLabel={heroSecondaryCtaLabel}
          onSecondaryCtaClick={onHeroSecondaryCtaClick}
          socialLinks={heroSocialLinks}
          tone={heroTone}
        />
        <PortfolioAbout title={aboutTitle} bio={aboutBio} facts={aboutFacts} />
        <PortfolioSkills title={skillsTitle} description={skillsDescription} groups={skillGroups} />
        <PortfolioProjects
          title={projectsTitle}
          description={projectsDescription}
          projects={projects}
          variant={projectsVariant}
        />
        <PortfolioExperience title={experienceTitle} description={experienceDescription} items={experienceItems} />
        <PortfolioTestimonials
          title={testimonialsTitle}
          description={testimonialsDescription}
          testimonials={testimonials}
        />
        <PortfolioStats title={statsTitle} stats={stats} />
        {customCTA ?? (
          <PortfolioContactCTA title={ctaTitle} description={ctaDescription} ctaLabel={ctaLabel} onCtaClick={onCtaClick} />
        )}
      </main>
      <PortfolioFooter
        brandName={brandName}
        description={footerDescription}
        linkGroups={footerLinkGroups}
        socialLinks={footerSocialLinks}
        copyrightText={copyrightText}
      />
    </div>
  );
};

export default PortfolioPage;
export {
  PortfolioPage,
  PortfolioHeader,
  PortfolioHero,
  PortfolioAbout,
  PortfolioSkills,
  PortfolioProjects,
  PortfolioExperience,
  PortfolioTestimonials,
  PortfolioStats,
  PortfolioContactCTA,
  PortfolioFooter,
};
