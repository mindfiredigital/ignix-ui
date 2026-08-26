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

/** Labels of every group that has an active descendant, so they render pre-expanded. */
function collectExpandedAncestors(items: DocNavItem[], acc: Set<string> = new Set()): Set<string> {
  for (const item of items) {
    if (item.items?.length && itemsContainActive(item.items)) {
      acc.add(item.label);
      collectExpandedAncestors(item.items, acc);
    }
  }
  return acc;
}

/**
 * Tracks which {@link TocHeading} is currently in view via `IntersectionObserver`,
 * so the right-hand "On this page" panel can highlight it. Falls back to `null`
 * in environments without `IntersectionObserver` (e.g. tests) instead of throwing.
 */
function useActiveHeading(headings?: TocHeading[]): string | null {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!headings || headings.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

/* -------------------------------------------------------------------------- */
/*                              NAV TREE                                      */
/* -------------------------------------------------------------------------- */

const DocNavTree: React.FC<{
  items: DocNavItem[];
  expanded: Set<string>;
  onToggle: (label: string) => void;
  onNavigate?: () => void;
  depth?: number;
}> = ({ items, expanded, onToggle, onNavigate, depth = 0 }) => (
  <ul className={cn("space-y-0.5", depth > 0 && "ml-3 mt-0.5 border-l border-[var(--border)] pl-3")}>
    {items.map((item) => {
      const hasChildren = !!item.items?.length;
      const isExpanded = hasChildren && expanded.has(item.label);

      return (
        <li key={item.label}>
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
                onClick={() => onToggle(item.label)}
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
                onClick={() => onToggle(item.label)}
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
  const [isMobile, setIsMobile] = React.useState(false);

  const mobileBp = mobileBreakpoint === "sm" ? 640 : mobileBreakpoint === "md" ? 768 : 1024;

  React.useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth < mobileBp);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [mobileBp]);

  const [expanded, setExpanded] = React.useState<Set<string>>(() =>
    navSections ? navSections.reduce((acc, section) => collectExpandedAncestors(section.items, acc), new Set<string>()) : new Set()
  );

  const toggleExpanded = React.useCallback((label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const activeHeadingId = useActiveHeading(tocHeadings);

  const hasLeftNav = !!(sidebar || navSections);
  const hasToc = !!(toc || (tocHeadings && tocHeadings.length > 0));

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
            <DocNavTree items={section.items} expanded={expanded} onToggle={toggleExpanded} onNavigate={onNavigate} />
          </div>
        ))}
      </nav>
    );
  };

  return (
    <div
      className={cn("flex min-h-screen w-full flex-col bg-[var(--background)] text-[var(--foreground)]", className)}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-40 flex h-16 w-full items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] px-4"
        role="banner"
      >
        {hasLeftNav && isMobile && (
          <button
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
        {/* LEFT SIDEBAR - desktop */}
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

        {/* LEFT SIDEBAR - mobile drawer */}
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
              className="fixed inset-y-0 left-0 z-50 h-full overflow-y-auto bg-[var(--background)] shadow-2xl"
              style={{ width: sidebarWidth }}
              initial={false}
              animate={{ x: isMobileNavOpen ? 0 : "-100%" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              role="complementary"
              aria-label="Mobile sidebar navigation"
              aria-hidden={!isMobileNavOpen}
            >
              {renderNav(() => setIsMobileNavOpen(false))}
            </motion.aside>
          </>
        )}

        {/* MAIN CONTENT */}
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

        {/* RIGHT SIDEBAR - "On this page" */}
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

      {/* FOOTER */}
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
