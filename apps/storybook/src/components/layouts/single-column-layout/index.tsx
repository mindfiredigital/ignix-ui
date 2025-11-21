
// ─────────────────────────────────────────────────────────────────────────────
// SingleColumnLayout Component
// Unified single-column layout for all variants (light/dark/gradient)
// Responsive header (logo left, nav & auth right with mobile menu)
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../../utils/cn";
import { Button } from "../../button";
import { ChevronRight, Home, Menu, X } from "lucide-react";

// Types
export interface SingleColumnLayoutProps {
  /** Optional header or footer overrides */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;

  /** Sticky elements */
  stickyHeader?: boolean;
  stickyFooter?: boolean;

  /** Layout theme variants */
  variant?: VariantProps<typeof singleColumnVariants>["variant"];

  /** Animation for content transition */
  animation?: "none" | "fade" | "slide" | "scale";

  /** Layout spacing & sizing */
  contentPadding?: string;
  maxWidth?: string;
  headerHeight?: number;
  footerHeight?: number;

  /** Layering */
  zIndex?: {
    header?: number;
    footer?: number;
    mobileMenu?: number;
  };

  /** Header configuration */
  logo?: React.ReactNode;
  navLinks?: { label: string; href: string }[];
  showAuthControls?: boolean;

  /** Active navigation link */
  activeNavLink?: string;

  className?: string;
}

/* ──────────────────────────────────────────────────────────────
   Variants: Theme-Aware Colors
────────────────────────────────────────────────────────────── */
const singleColumnVariants = cva("min-h-screen flex flex-col", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      light: "bg-white text-gray-900",
      dark: "bg-neutral-900 text-white",
      glass: "bg-white/10 backdrop-blur-lg text-foreground border-border",
      gradient: "bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground",
      transparent: "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800",
      solid: "bg-gradient-to-br from-slate-50 to-gray-100 text-gray-800",
      // New Modern Variant
      modern: "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800",
    },
  },
  defaultVariants: { variant: "default" },
});

/* ──────────────────────────────────────────────────────────────
   Header Variants
────────────────────────────────────────────────────────────── */
const headerVariants = cva("w-full transition-colors duration-300", {
  variants: {
    variant: {
      default: "bg-background border-border border-b",
      light: "bg-white border-gray-200 border-b",
      dark: "bg-neutral-900 border-neutral-700 border-b",
      glass: "bg-background/10 backdrop-blur-md border-border border-b",
      gradient: "bg-background/10 backdrop-blur-md border-border border-b",
      transparent: "bg-transparent border-transparent",
      solid: "bg-blue-600 border-blue-700 border-b text-white",
      // New Modern Variant
      modern: "bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm",
    },
  },
  defaultVariants: { variant: "default" },
});

/* ──────────────────────────────────────────────────────────────
   Mobile Menu Variants: Theme-Aware Colors
────────────────────────────────────────────────────────────── */
const mobileMenuVariants = cva("md:hidden absolute top-full left-0 w-full border-b", {
  variants: {
    variant: {
      default: "bg-background text-foreground border-border",
      light: "bg-white text-gray-900 border-gray-200",
      dark: "bg-neutral-900 text-white border-neutral-700",
      glass: "bg-background/95 backdrop-blur-md text-foreground border-border",
      gradient: "bg-background/95 backdrop-blur-md text-foreground border-border",
      transparent: "bg-white/95 backdrop-blur-md text-gray-800 border-blue-200",
      solid: "bg-blue-600 text-white border-blue-700",
      // New Modern Variant
      modern: "bg-white border-slate-200",
    },
  },
  defaultVariants: { variant: "default" },
});

/* ──────────────────────────────────────────────────────────────
   Footer Variants
────────────────────────────────────────────────────────────── */
const footerVariants = cva("w-full border-t transition-colors duration-300", {
  variants: {
    variant: {
      default: "bg-background border-border",
      light: "bg-white border-gray-200",
      dark: "bg-neutral-900 border-neutral-700",
      glass: "bg-background/10 backdrop-blur-md border-border",
      gradient: "bg-background/10 backdrop-blur-md border-border",
      transparent: "bg-blue-500 border-blue-500 text-white",
      solid: "bg-blue-600 border-blue-700 text-white",
      // New Modern Variant
      modern: "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white",
    },
  },
  defaultVariants: { variant: "default" },
});

/* ──────────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────────── */
const SingleColumnLayout: React.FC<SingleColumnLayoutProps> = ({
  header,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  footer,
  children,
  stickyHeader = true,
  stickyFooter = false,
  variant = "default",
  animation = "none",
  contentPadding = "px-4 sm:px-6 lg:px-8 py-8",
  maxWidth = "max-w-[1200px]",
  headerHeight = 64,
  footerHeight = 64,
  zIndex = { header: 100, footer: 50, mobileMenu: 95 },
  className,
  logo,
  navLinks = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "#" },
  ],
  showAuthControls = true,
  activeNavLink,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // motion variants for content
  const motionVariants = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    slide: { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    scale: { initial: { scale: 0.98, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
    none: { initial: {}, animate: {} },
  }[animation];

  // Get appropriate button variants based on layout variant
  const getButtonVariant = (baseVariant: "ghost" | "primary") => {
    if (variant === "dark" || variant === "solid") {
      return baseVariant === "ghost" ? "ghost" : "primary";
    }
    if (variant === "glass" || variant === "transparent") {
      return baseVariant === "ghost" ? "ghost" : "primary";
    }
    return baseVariant;
  };

  // Get nav link styles based on variant and active state
  const getNavLinkClass = (linkHref: string, isMobile = false) => {
    const isActive = activeNavLink === linkHref;
    const baseClasses = "text-sm font-medium transition-all duration-200 rounded-md";

    if (isMobile) {
      if (variant === "solid") {
        return cn(
          baseClasses,
          "py-2 px-3",
          isActive
            ? "bg-blue-500 text-white"
            : "text-white/90 hover:bg-blue-500/50 hover:text-white"
        );
      }
      return cn(
        baseClasses,
        "py-2 px-3",
        isActive
          ? "bg-blue-100 text-blue-700"
          : "hover:bg-gray-100 hover:text-gray-900"
      );
    }

    // Desktop styles
    if (variant === "solid") {
      return cn(
        baseClasses,
        "px-3 py-2",
        isActive
          ? "bg-white/20 text-white border border-white/30"
          : "text-white/90 hover:bg-white/10 hover:text-white"
      );
    }

    if (variant === "transparent") {
      return cn(
        baseClasses,
        "px-3 py-2",
        isActive
          ? "bg-blue-500 text-white shadow-sm"
          : "text-gray-700 hover:bg-blue-500/10 hover:text-blue-700"
      );
    }

    // Inside getNavLinkClass function, add modern variant styles:
    if (variant === "modern") {
      return cn(
        baseClasses,
        "px-4 py-2 relative group",
        isActive
          ? "text-blue-600 font-semibold"
          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
      );
    }

    return cn(
      baseClasses,
      "px-3 py-2",
      isActive
        ? "text-primary-foreground"
        : "hover:text-primary"
    );
  };


  /* ─────────────── Default Header (shared across variants) ─────────────── */
  const DefaultHeader = (
    <div className="flex items-center justify-between w-full h-full px-4 sm:px-6 lg:px-8">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2 group cursor-pointer">
        {logo || (
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all duration-300",
              variant === "modern"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-lg group-hover:scale-105 text-white"
                : "bg-muted"
            )}>
              {variant === "modern" ? (
                <Home className="w-5 h-5" />
              ) : (
                <span className="text-lg font-semibold">L</span>
              )}
            </div>
            <span className={cn(
              "text-xl font-bold tracking-tight",
              variant === "modern" && "bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
            )}>
              {variant === "modern" ? "YourBrand" : "Logo"}
            </span>
          </div>
        )}
      </div>

      {/* Right: Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        {navLinks.map((link) => {
          const isActive = activeNavLink === link.href;
          return (
            <a
              key={link.label}
              href={link.href}
              className={getNavLinkClass(link.href)}
            >
              {link.label}
              {/* Modern variant underline animation */}
              {variant === "modern" && (
                <span className={cn(
                  "absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300",
                  isActive ? "w-full" : "group-hover:w-full"
                )} />
              )}
            </a>
          );
        })}
        {showAuthControls && (
          <div className="flex items-center space-x-3 ml-4">
            <Button
              variant={getButtonVariant("ghost")}
              size="sm"
              className={cn(
                variant === "modern" && "text-slate-700 hover:text-blue-600 hover:bg-blue-50",
                variant === "solid" && "text-white hover:bg-white/20"
              )}
            >
              Sign In
            </Button>
            <Button
              variant={getButtonVariant("primary")}
              size="sm"
              className={cn(
                variant === "modern" && "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-md hover:shadow-lg",
                variant === "solid" && "bg-white text-blue-600 hover:bg-white/90"
              )}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className={cn(
          "md:hidden p-2 rounded-lg transition-colors duration-200",
          variant === "solid"
            ? "text-white hover:bg-white/20"
            : variant === "modern"
              ? "text-slate-700 hover:bg-slate-100"
              : "hover:bg-muted/50"
        )}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
  /* ─────────────── Mobile Dropdown Menu (shared across variants) ─────────────── */
  /* ─────────────── Mobile Dropdown Menu ─────────────── */
  const MobileMenu = (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={cn(mobileMenuVariants({ variant }))}
          style={{ zIndex: zIndex.mobileMenu }}
        >
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={getNavLinkClass(link.href, true)}
                onClick={() => setMenuOpen(false)}
              >
                <span>{link.label}</span>
                {variant === "modern" && (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                )}
              </a>
            ))}

            {showAuthControls && (
              <div className={cn(
                "flex flex-col space-y-2 pt-4",
                variant !== "modern" && "border-t border-border"
              )}>
                <Button
                  variant={getButtonVariant("ghost")}
                  size="sm"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "justify-start",
                    variant === "modern" && "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  Sign In
                </Button>
                <Button
                  variant={getButtonVariant("primary")}
                  size="sm"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "justify-start",
                    variant === "modern" && "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  )}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ─────────────── Default Footer ─────────────── */
  const DefaultFooter = (
    <div className="flex items-center justify-center w-full h-full">
      <div className={cn(
        "text-center text-sm",
        (variant === "solid" || variant === "transparent") && "text-white"
      )}>
        © 2025 My Application. All rights reserved.
      </div>
    </div>
  );

  /* ─────────────── Render Layout ─────────────── */
  return (
    <div
      className={cn(singleColumnVariants({ variant }), className, "relative")}
      style={{
        ["--header-h" as string]: `${headerHeight}px`,
        ["--footer-h" as string]: `${footerHeight}px`,
      }}
    >
      {/* Header */}
      <header
        className={cn(
          headerVariants({ variant }),
          stickyHeader && "sticky top-0 backdrop-blur-md"
        )}
        style={{ height: headerHeight, zIndex: zIndex.header }}
      >
        {header || DefaultHeader}
        {MobileMenu}
      </header>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 w-full mx-auto",
          contentPadding,
          maxWidth,
          stickyFooter && "pb-[var(--footer-h)]"
        )}
        role="main"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={motionVariants.initial}
            animate={motionVariants.animate}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {DefaultFooter && (
        <footer
          className={cn(
            footerVariants({ variant }),
            stickyFooter && "fixed inset-x-0 bottom-0"
          )}
          style={{ height: footerHeight, zIndex: zIndex.footer }}
        >
          {DefaultFooter}
        </footer>
      )}
    </div>
  );
};

SingleColumnLayout.displayName = "SingleColumnLayout";

export { SingleColumnLayout };