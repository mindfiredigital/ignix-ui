import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@site/src/utils/cn";
import { SidebarProvider, useSidebar } from "../sidebar";

/**
 * Represents a navigation or TOC section
 */
interface NavSection {
  label?: string;
  items: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
}

/**
 * Props for the ThreeColumnSidebarLayout component.
 */
export interface ThreeColumnLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  navItems?: NavSection[];
  tocItems?: NavSection[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  sidebarWidth?: number;
  rightSidebarWidth?: number;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  mobileBreakpoint?: "sm" | "md" | "lg";
  overlay?: boolean;
  transitionDuration?: number;
  headerHeight?: number;
  footerHeight?: number;
  zIndex?: {
    header?: number;
    sidebar?: number;
    footer?: number;
    overlay?: number;
  };
  className?: string;
}

/**
 * Core three-column responsive layout with:
 * - Header
 * - Left sidebar (navigation / filters)
 * - Main content
 * - Right sidebar (TOC / stats)
 * - Footer
 */
const ThreeColumnLayoutContent: React.FC<ThreeColumnLayoutProps> = ({
  header,
  sidebar,
  rightSidebar,
  navItems,
  tocItems,
  children,
  footer,
  sidebarWidth = 300,
  rightSidebarWidth = 240,
  stickyFooter = false,
  stickyHeader = true,
  mobileBreakpoint = "md",
  overlay = true,
  transitionDuration = 0.3,
  headerHeight = 60,
  footerHeight = 60,
  zIndex = { header: 50, sidebar: 40, footer: 30, overlay: 80 },
  className,
}) => {
  const { isOpen: leftOpen, toggle: toggleLeft } = useSidebar();
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  const mobileBp = mobileBreakpoint === "sm" ? 640 : mobileBreakpoint === "md" ? 768 : 1024;
  const tabletBp = 1024; // iPad and similar tablets

  React.useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsMobile(width < mobileBp);
      setIsTablet(width >= mobileBp && width < tabletBp);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [mobileBp, tabletBp]);

  // Set CSS custom properties for dynamic values (necessary for prop-based sizing)
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--layout-header-h", `${headerHeight}px`);
    root.style.setProperty("--layout-footer-h", `${footerHeight}px`);
    root.style.setProperty("--layout-sidebar-w", `${sidebarWidth}px`);
    root.style.setProperty("--layout-right-sidebar-w", `${rightSidebarWidth}px`);
    root.style.setProperty("--layout-header-z", `${zIndex.header}`);
    root.style.setProperty("--layout-footer-z", `${zIndex.footer}`);
    root.style.setProperty("--layout-sidebar-z", `${zIndex.sidebar}`);
    root.style.setProperty("--layout-overlay-z", `${zIndex.overlay}`);
    root.style.setProperty("--layout-mobile-sidebar-z", `${(zIndex.sidebar ?? 90) + 10}`);
    
    return () => {
      root.style.removeProperty("--layout-header-h");
      root.style.removeProperty("--layout-footer-h");
      root.style.removeProperty("--layout-sidebar-w");
      root.style.removeProperty("--layout-right-sidebar-w");
      root.style.removeProperty("--layout-header-z");
      root.style.removeProperty("--layout-footer-z");
      root.style.removeProperty("--layout-sidebar-z");
      root.style.removeProperty("--layout-overlay-z");
      root.style.removeProperty("--layout-mobile-sidebar-z");
    };
  }, [headerHeight, footerHeight, sidebarWidth, rightSidebarWidth, zIndex]);

  return (
    <div
      className={cn(
        "w-full min-h-screen flex flex-col",
        "bg-[var(--background)] text-[var(--foreground)]",
        className
      )}
    >
      {/* HEADER */}
      {header && (
        <header
          className={cn(
            "w-full",
            "bg-[var(--background)]",
            "h-[var(--layout-header-h)]",
            stickyHeader && "sticky top-0 z-[var(--layout-header-z)]"
          )}
          role="banner"
        >
          {header}
        </header>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - Desktop only (hidden on tablet and mobile) */}
        {(sidebar || navItems) && !isMobile && !isTablet && (
          <aside
            className={cn(
              "sticky border-r border-[var(--border)]",
              "bg-[var(--background)]",
              "overflow-y-auto overflow-x-hidden",
              "transition-all duration-300",
              "top-[var(--layout-header-h)] h-[calc(100vh-var(--layout-header-h))]",
              leftOpen ? "w-[var(--layout-sidebar-w)]" : "w-0"
            )}
            role="complementary"
            aria-label="Navigation sidebar"
          >
            {navItems ? (
              <nav className="h-full overflow-y-auto p-4">
                <div className="space-y-6">
                  {navItems.map((section) => (
                   <div key={section.label}>
                      {section.label && <h2 className="text-xs tracking-wider mb-1 px-1">
                        {section.label}
                      </h2>}
                      <ul className="space-y-1">
                        {section.items.map((item, index) => (
                          <li key={index}>
                            <a
                              href={item.href}
                              className={cn(
                                "block px-3 py-0 rounded-md text-md transition-colors",
                                item.active
                                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                                  : "text-[var(--foreground)] hover:bg-[var(--accent)]"
                              )}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </nav>
            ) : (
              sidebar
            )}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            "h-[calc(100vh-var(--layout-header-h))] scrollbar-hidden",
            // Full width on tablet (no sidebars)
            isTablet && "w-full",
            // Prevent blur on mobile when overlay is open
            isMobile && leftOpen && "relative z-0"
          )}
          role="main"
        >
          <div className={cn(
            "mx-8 px-0 py-4",
            // Wider max-width on tablet since no sidebars
            isTablet ? "max-w-5xl" : "max-w-4xl"
          )}>
            {children}
          </div>
        </main>

        {/* RIGHT SIDEBAR - Desktop only (hidden on tablet and mobile) */}
        {(rightSidebar || tocItems) && !isMobile && !isTablet && (
          <aside
            className={cn(
              "sticky border-l border-[var(--border)]",
              "bg-[var(--background)]",
              "overflow-y-auto overflow-x-hidden",
              "transition-all duration-300",
              "top-[var(--layout-header-h)] h-[calc(100vh-var(--layout-header-h))]",
              "w-[var(--layout-right-sidebar-w)]"
            )}
            role="complementary"
            aria-label="Table of contents"
          >
            {tocItems ? (
              <nav className="h-full overflow-y-auto p-4">
                <div className="space-y-6">
                  {tocItems.map((section) => (
                    <div key={section.label}>
                      <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-2">
                        {section.label}
                      </h2>
                      <ul className="space-y-1">
                        {section.items.map((item, index) => (
                          <li key={index}>
                            <a
                              href={item.href}
                              className={cn(
                                "block px-3 py-2 rounded-md text-sm transition-colors",
                                item.active
                                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
                              )}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </nav>
            ) : (
              rightSidebar
            )}
          </aside>
        )}
      </div>

      {/* MOBILE OVERLAY SIDEBAR */}
      {(sidebar || navItems) && (isMobile || isTablet) && (
        <>
          <AnimatePresence>
            {overlay && leftOpen && (
              <motion.div
                className="fixed inset-0 z-[var(--layout-overlay-z)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleLeft}
                aria-hidden="true"
                style={{ pointerEvents: leftOpen ? 'auto' : 'none' }}
              />
            )}
          </AnimatePresence>

          <motion.aside
            className={cn(
              "fixed inset-y-0 left-0",
              "bg-[var(--background)] border-r border-[var(--border)]",
              "shadow-2xl z-[var(--layout-mobile-sidebar-z)]",
              "w-[var(--layout-sidebar-w)]"
            )}
            initial={{ x: "calc(-1 * var(--layout-sidebar-w))" }}
            animate={{ x: leftOpen ? 0 : "calc(-1 * var(--layout-sidebar-w))" }}
            transition={{ duration: transitionDuration, ease: [0.4, 0, 0.2, 1] }}
            role="complementary"
            aria-label="Mobile navigation"
            aria-hidden={!leftOpen}
          >
            <div className="h-full overflow-y-auto relative isolate">
              {navItems ? (
                <nav className="h-full overflow-y-auto p-4">
                  <div className="space-y-6">
                    {navItems.map((section) => (
                      <div key={section.label}>
                        <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 px-2">
                          {section.label}
                        </h2>
                        <ul className="space-y-1">
                          {section.items.map((item, index) => (
                            <li key={index}>
                              <a
                                href={item.href}
                                className={cn(
                                  "block px-3 py-2 rounded-md text-sm transition-colors",
                                  "cursor-pointer",
                                  item.active
                                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                                    : "text-[var(--foreground)] hover:bg-[var(--accent)]"
                                )}
                                onClick={() => {
                                  // Allow navigation but also close sidebar
                                  toggleLeft();
                                }}
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </nav>
              ) : (
                sidebar
              )}
            </div>
          </motion.aside>

          {/* Mobile Toggle Button */}
          <button
            className={cn(
              "fixed z-[999] p-2 rounded-lg",
              "bg-[var(--card)] border border-[var(--border)]",
              "shadow-lg top-4 left-4",
              "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
              "hover:bg-[var(--accent)] transition-colors",
              leftOpen && "left-45 top-2.5",
            )}
            onClick={toggleLeft}
            aria-label={leftOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={leftOpen}
          >
            {leftOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </>
      )}

      {/* FOOTER */}
      {footer && (
        <footer
          className={cn(
            "w-full border-t border-[var(--border)]",
            "bg-[var(--background)]",
            "h-[var(--layout-footer-h)]",
            stickyFooter && "sticky bottom-0 z-[var(--layout-footer-z)]"
          )}
          role="contentinfo"
        >
          <div className="h-full flex items-center justify-center px-4">{footer}</div>
        </footer>
      )}
    </div>
  );
};

/**
 * Provider-wrapped exported layout.
 */
export const ThreeColumnSidebarLayout: React.FC<ThreeColumnLayoutProps> = (props) => {
  return (
    <SidebarProvider initialOpen={true}>
      <ThreeColumnLayoutContent {...props} />
    </SidebarProvider>
  );
};

ThreeColumnSidebarLayout.displayName = "ThreeColumnSidebarLayout";
