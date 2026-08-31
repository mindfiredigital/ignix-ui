import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Menu, X, ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { cn } from "../../../utils/cn";

/* -------------------------------------------------------------------------- */
/*                              TYPES & INTERFACES                            */
/* -------------------------------------------------------------------------- */

/**
 * A single entry in the left navigation tree. Entries without `href` render
 * as a non-clickable group label; entries with nested `items` are
 * collapsible, auto-expanding when one of their descendants is `active`.
 */
export interface DocNavItem {
  label: string;
  href?: string;
  active?: boolean;
  items?: DocNavItem[];
}

/** A labeled group of {@link DocNavItem} entries in the left sidebar. */
export interface DocNavSection {
  label?: string;
  items: DocNavItem[];
}

/** A heading tracked by the right-hand "On this page" table of contents. */
export interface TocHeading {
  /** Must match the `id` of the corresponding heading element on the page. */
  id: string;
  label: string;
  /** Nesting level, used for indentation. Defaults to `2`. */
  depth?: 2 | 3;
}

/** A labeled link, used for breadcrumbs and prev/next page navigation. */
export interface DocPageLink {
  label: string;
  href: string;
}

/**
 * Props for the {@link DocumentationLayout} template.
 *
 * @property header - Custom node rendered at the start of the header (e.g. a logo/title).
 * @property searchSlot - Optional node rendered in the header (e.g. a search box).
 * @property actions - Optional node rendered at the end of the header (e.g. theme toggle, GitHub link).
 * @property navSections - Left sidebar navigation, grouped into labeled sections.
 * @property sidebar - Fully custom left sidebar content; overrides `navSections`.
 * @property tocHeadings - Headings for the right "On this page" panel; the active one is
 * tracked automatically via scroll position (`IntersectionObserver`).
 * @property toc - Fully custom right sidebar content; overrides `tocHeadings`.
 * @property scrollContainerRef - Ref to the scrollable ancestor that actually scrolls the
 * page content, used as the `IntersectionObserver` root for the scroll-spy. Only needed when
 * this layout is rendered inside a scrollable container instead of the document itself (e.g.
 * an embedded preview); omit it when the layout owns page-level scroll.
 * @property breadcrumbs - Optional breadcrumb trail rendered above the title.
 * @property title - Optional page title (rendered as the page's `<h1>`).
 * @property children - Page content.
 * @property previousPage - Optional "previous page" link rendered below the content.
 * @property nextPage - Optional "next page" link rendered below the content.
 * @property editPageUrl - Optional "Edit this page" link rendered below the content.
 * @property footer - Optional site footer, rendered below everything else.
 * @property sidebarWidth - Left sidebar width in px. Default `280`.
 * @property tocWidth - Right "On this page" panel width in px. Default `240`.
 * @property mobileBreakpoint - Breakpoint below which the left sidebar collapses into a
 * drawer opened via a hamburger button. Default `"lg"`.
 * @property className - Class name for the root container.
 */
export interface DocumentationLayoutProps {
  header?: React.ReactNode;
  searchSlot?: React.ReactNode;
  actions?: React.ReactNode;
  navSections?: DocNavSection[];
  sidebar?: React.ReactNode;
  tocHeadings?: TocHeading[];
  toc?: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  breadcrumbs?: DocPageLink[];
  title?: string;
  children: React.ReactNode;
  previousPage?: DocPageLink;
  nextPage?: DocPageLink;
  editPageUrl?: string;
  footer?: React.ReactNode;
  sidebarWidth?: number;
  tocWidth?: number;
  mobileBreakpoint?: "sm" | "md" | "lg";
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                              HELPERS & HOOKS                               */
/* -------------------------------------------------------------------------- */

function itemsContainActive(items: DocNavItem[]): boolean {
  return items.some((item) => item.active || (item.items ? itemsContainActive(item.items) : false));
}

/**
 * Tree-position paths (not labels) of every group that has an active descendant, so they
 * render pre-expanded. Paths (e.g. "s0-1-0") are used instead of labels throughout the nav
 * tree's expand/collapse state so that two groups sharing the same label in different
 * branches - a common case with a generic name like "Overview" - expand independently.
 */
function collectExpandedAncestors(items: DocNavItem[], parentPath: string, acc: Set<string> = new Set()): Set<string> {
  items.forEach((item, index) => {
    const path = `${parentPath}-${index}`;
    if (item.items?.length && itemsContainActive(item.items)) {
      acc.add(path);
      collectExpandedAncestors(item.items, path, acc);
    }
  });
  return acc;
}

/**
 * Tracks which {@link TocHeading} is currently in view via `IntersectionObserver`, so the
 * right-hand "On this page" panel can highlight it. Falls back to `null` in environments
 * without `IntersectionObserver` (e.g. tests) instead of throwing.
 */
function useActiveHeading(
  headings?: TocHeading[],
  scrollContainerRef?: React.RefObject<HTMLElement | null>
): string | null {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // Consumers commonly pass an inline array literal (see the Usage docs), which gets a new
  // identity every render. Keying the effect on a derived id string - instead of the array
  // reference - avoids tearing down and recreating the observer on every unrelated re-render.
  const headingsRef = React.useRef(headings);
  headingsRef.current = headings;
  const headingIds = headings?.map((heading) => heading.id).join(",") ?? "";

  React.useEffect(() => {
    const currentHeadings = headingsRef.current;
    if (!currentHeadings || currentHeadings.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;

    const elements = currentHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // `entries` order reflects browser-specific intersection-change batching, not document
        // order, so when multiple headings cross the threshold in the same batch, pick whichever
        // is first in `currentHeadings` (reading order) rather than trusting `entries[0]`.
        const visibleIds = new Set(
          entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id)
        );
        const firstVisible = currentHeadings.find((heading) => visibleIds.has(heading.id));
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      },
      { root: scrollContainerRef?.current ?? null, rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headingIds, scrollContainerRef]);

  return activeId;
}

/* -------------------------------------------------------------------------- */
/*                              NAV TREE                                      */
/* -------------------------------------------------------------------------- */

const DocNavTree: React.FC<{
  items: DocNavItem[];
  expanded: Set<string>;
  onToggle: (path: string) => void;
  onNavigate?: () => void;
  depth?: number;
  parentPath: string;
}> = ({ items, expanded, onToggle, onNavigate, depth = 0, parentPath }) => (
  <ul className={cn("space-y-0.5", depth > 0 && "ml-3 mt-0.5 border-l border-[var(--border)] pl-3")}>
    {items.map((item, index) => {
      const path = `${parentPath}-${index}`;
      const hasChildren = !!item.items?.length;
      const isExpanded = hasChildren && expanded.has(path);

      return (
        <li key={path}>
          <div className="flex items-center">
            {item.href ? (
              <a
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "flex-1 block px-3 py-1.5 rounded-md text-sm transition-colors",
                  item.active
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "text-[var(--foreground)] hover:bg-[var(--accent)]"
                )}
              >
                {item.label}
              </a>
            ) : hasChildren ? (
              <button
                type="button"
                onClick={() => onToggle(path)}
                aria-expanded={isExpanded}
                className="flex-1 rounded-md px-3 py-1.5 text-left text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--accent)]"
              >
                {item.label}
              </button>
            ) : (
              <span className="flex-1 px-3 py-1.5 text-sm font-semibold text-[var(--foreground)]">
                {item.label}
              </span>
            )}
            {hasChildren && (
              <button
                type="button"
                onClick={() => onToggle(path)}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                className="shrink-0 p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          {hasChildren && isExpanded && (
            <DocNavTree
              items={item.items!}
              expanded={expanded}
              onToggle={onToggle}
              onNavigate={onNavigate}
              depth={depth + 1}
              parentPath={path}
            />
          )}
        </li>
      );
    })}
  </ul>
);

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

/**
 * DocumentationLayout is a full-page shell for documentation/reference sites:
 * a sticky header, a collapsible-tree left navigation sidebar (a drawer on
 * mobile), the page content, and a right-hand "On this page" panel whose
 * active heading tracks scroll position automatically. Breadcrumbs, a page
 * title, and prev/next page links are optional and rendered around the
 * content when provided.
 */
export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({
  header,
  searchSlot,
  actions,
  navSections,
  sidebar,
  tocHeadings,
  toc,
  scrollContainerRef,
  breadcrumbs,
  title,
  children,
  previousPage,
  nextPage,
  editPageUrl,
  footer,
  sidebarWidth = 280,
  tocWidth = 240,
  mobileBreakpoint = "lg",
  className,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  // Tracks whether the close slide-out has actually finished (via onAnimationComplete below),
  // so `visibility: hidden` only applies once it's done - not the instant `isMobileNavOpen`
  // flips false, which would clip the exit animation instead of letting it play out.
  const [isDrawerFullyClosed, setIsDrawerFullyClosed] = React.useState(true);
  const mobileDrawerRef = React.useRef<HTMLElement>(null);
  const mobileNavTriggerRef = React.useRef<HTMLButtonElement>(null);

  const mobileBp = mobileBreakpoint === "sm" ? 640 : mobileBreakpoint === "md" ? 768 : 1024;

  // Starts `false` unconditionally (not derived from `window.innerWidth`) so server and client
  // render the same markup on first paint; the mount effect below corrects it via `matchMedia`
  // right after hydration. Deriving this from `window` would only match on truly client-only
  // renders - during SSR hydration the client's own first pass already sees `window`, so the
  // guard doesn't help there and the two renders could still disagree.
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBp - 1}px)`);
    setIsMobile(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent): void => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mobileBp]);

  const [expanded, setExpanded] = React.useState<Set<string>>(() =>
    navSections
      ? navSections.reduce((acc, section, index) => collectExpandedAncestors(section.items, `s${index}`, acc), new Set<string>())
      : new Set()
  );

  const toggleExpanded = React.useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const activeHeadingId = useActiveHeading(tocHeadings, scrollContainerRef);

  const hasLeftNav = !!(sidebar || navSections);
  const hasToc = !!(toc || (tocHeadings && tocHeadings.length > 0));

  // `aria-hidden` alone doesn't stop the closed drawer's links from being keyboard-focusable.
  // `inert` (not yet in framer-motion's HTMLMotionProps types) is set imperatively via the DOM
  // property instead, so focus/tab order and clicks are actually blocked while it's off-screen.
  React.useEffect(() => {
    if (mobileDrawerRef.current) {
      mobileDrawerRef.current.inert = !isMobileNavOpen;
    }
  }, [isMobileNavOpen, isMobile, hasLeftNav]);

  // Dialog-like focus behavior for the mobile drawer: move focus into it on open, restore
  // focus to the hamburger trigger on close. Skips the very first run so mounting with the
  // drawer already closed doesn't yank focus onto the (not-yet-clicked) trigger button.
  const hasOpenedDrawerRef = React.useRef(false);
  React.useEffect(() => {
    if (!hasOpenedDrawerRef.current) {
      hasOpenedDrawerRef.current = true;
      return;
    }
    if (isMobileNavOpen) {
      mobileDrawerRef.current?.focus();
    } else {
      mobileNavTriggerRef.current?.focus();
    }
  }, [isMobileNavOpen]);

  const handleDrawerKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Escape") {
      setIsMobileNavOpen(false);
      return;
    }
    if (event.key !== "Tab" || !mobileDrawerRef.current) return;

    // Trap focus within the open drawer: wrap Tab/Shift+Tab at its edges instead of
    // letting focus escape into the (inert-but-visually-hidden) rest of the page.
    const focusable = mobileDrawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const renderNav = (onNavigate?: () => void): React.ReactNode => {
    if (sidebar) return sidebar;
    if (!navSections) return null;
    return (
      <nav className="space-y-6 p-4" aria-label="Documentation navigation">
        {navSections.map((section, index) => (
          <div key={section.label ?? index}>
            {section.label && (
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                {section.label}
              </h2>
            )}
            <DocNavTree
              items={section.items}
              expanded={expanded}
              onToggle={toggleExpanded}
              onNavigate={onNavigate}
              parentPath={`s${index}`}
            />
          </div>
        ))}
      </nav>
    );
  };

  return (
    <div
      className={cn("flex min-h-screen w-full flex-col bg-[var(--background)] text-[var(--foreground)]", className)}
    >
      <header
        className="sticky top-0 z-40 flex h-16 w-full items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] px-4"
        role="banner"
      >
        {hasLeftNav && isMobile && (
          <button
            ref={mobileNavTriggerRef}
            type="button"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileNavOpen}
            className="shrink-0 rounded-md p-2 text-[var(--foreground)] hover:bg-[var(--accent)]"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
        {header && <div className="flex shrink-0 items-center">{header}</div>}
        {searchSlot && <div className="min-w-0 flex-1 md:max-w-sm">{searchSlot}</div>}
        {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        {hasLeftNav && !isMobile && (
          <aside
            className="sticky top-16 h-[calc(100vh-4rem)] shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--background)]"
            style={{ width: sidebarWidth }}
            role="complementary"
            aria-label="Sidebar navigation"
          >
            {renderNav()}
          </aside>
        )}

        {hasLeftNav && isMobile && (
          <>
            <AnimatePresence>
              {isMobileNavOpen && (
                <motion.div
                  className="fixed inset-0 z-40 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
            <motion.aside
              ref={mobileDrawerRef}
              tabIndex={-1}
              onKeyDown={handleDrawerKeyDown}
              className="fixed inset-y-0 left-0 z-50 h-full overflow-y-auto bg-[var(--background)] shadow-2xl"
              style={{
                width: sidebarWidth,
                visibility: isMobileNavOpen || !isDrawerFullyClosed ? "visible" : "hidden",
              }}
              initial={false}
              animate={{ x: isMobileNavOpen ? 0 : "-100%" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onAnimationComplete={() => setIsDrawerFullyClosed(!isMobileNavOpen)}
              role="complementary"
              aria-label="Mobile sidebar navigation"
              aria-hidden={!isMobileNavOpen}
            >
              {renderNav(() => setIsMobileNavOpen(false))}
            </motion.aside>
          </>
        )}

        <main className="min-w-0 flex-1 px-6 py-8 md:px-10" role="main">
          <div className="mx-auto max-w-3xl">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                      {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                      {index === breadcrumbs.length - 1 ? (
                        <span aria-current="page" className="text-[var(--foreground)]">
                          {crumb.label}
                        </span>
                      ) : (
                        <a href={crumb.href} className="hover:text-[var(--foreground)]">
                          {crumb.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {title && <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--foreground)]">{title}</h1>}

            {children}

            {(previousPage || nextPage || editPageUrl) && (
              <div className="mt-12 border-t border-[var(--border)] pt-6">
                {editPageUrl && (
                  <a
                    href={editPageUrl}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit this page
                  </a>
                )}
                {(previousPage || nextPage) && (
                  <nav aria-label="Page navigation" className="flex items-stretch gap-4">
                    {previousPage ? (
                      <a
                        href={previousPage.href}
                        className="flex flex-1 flex-col items-start gap-1 rounded-lg border border-[var(--border)] p-4 text-left transition-colors hover:bg-[var(--accent)]"
                      >
                        <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                          Previous
                        </span>
                        <span className="text-sm font-medium text-[var(--foreground)]">{previousPage.label}</span>
                      </a>
                    ) : (
                      <span className="flex-1" />
                    )}
                    {nextPage && (
                      <a
                        href={nextPage.href}
                        className="flex flex-1 flex-col items-end gap-1 rounded-lg border border-[var(--border)] p-4 text-right transition-colors hover:bg-[var(--accent)]"
                      >
                        <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          Next
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-medium text-[var(--foreground)]">{nextPage.label}</span>
                      </a>
                    )}
                  </nav>
                )}
              </div>
            )}
          </div>
        </main>

        {hasToc && !isMobile && (
          <aside
            className="sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] p-4 xl:block"
            style={{ width: tocWidth }}
            role="complementary"
            aria-label="Table of contents"
          >
            {toc ? (
              toc
            ) : tocHeadings ? (
              <>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  On this page
                </h2>
                <ul className="space-y-1.5 border-l border-[var(--border)]">
                  {tocHeadings.map((heading) => {
                    const isActive = heading.id === activeHeadingId;
                    return (
                      <li key={heading.id} style={{ paddingLeft: heading.depth === 3 ? 24 : 12 }}>
                        <a
                          href={`#${heading.id}`}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "-ml-px block border-l-2 pl-3 text-sm transition-colors",
                            isActive
                              ? "border-[var(--primary)] font-medium text-[var(--primary)]"
                              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          )}
                        >
                          {heading.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </aside>
        )}
      </div>

      {footer && (
        <footer className="w-full border-t border-[var(--border)] bg-[var(--background)]" role="contentinfo">
          {footer}
        </footer>
      )}
    </div>
  );
};

DocumentationLayout.displayName = "DocumentationLayout";

export default DocumentationLayout;
