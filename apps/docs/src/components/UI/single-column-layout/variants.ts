// variants.ts
import { cva } from "class-variance-authority";
import { cn } from "../../../utils/cn";

export const singleColumnVariants = cva("min-h-screen flex flex-col", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      light: "bg-white text-gray-900",
      dark: "bg-neutral-900 text-white",
      glass: "bg-white/10 backdrop-blur-lg text-foreground border-border",
      gradient: "bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground",
      transparent: "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800",
      solid: "bg-gradient-to-br from-slate-50 to-gray-100 text-gray-800",
      modern: "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800",
    },
  },
  defaultVariants: { variant: "default" },
});

export const headerVariants = cva("w-full transition-colors duration-300", {
  variants: {
    variant: {
      default: "bg-background border-border border-b",
      light: "bg-white border-gray-200 border-b",
      dark: "bg-neutral-900 border-neutral-700 border-b",
      glass: "bg-background/10 backdrop-blur-md border-border border-b",
      gradient: "bg-background/10 backdrop-blur-md border-border border-b",
      transparent: "bg-transparent border-transparent",
      solid: "bg-blue-600 border-blue-700 border-b text-white",
      modern: "bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm",
    },
  },
  defaultVariants: { variant: "default" },
});

export const mobileMenuVariants = cva("md:hidden absolute top-full left-0 w-full border-b", {
  variants: {
    variant: {
      default: "bg-background text-foreground border-border",
      light: "bg-white text-gray-900 border-gray-200",
      dark: "bg-neutral-900 text-white border-neutral-700",
      glass: "bg-background/95 backdrop-blur-md text-foreground border-border",
      gradient: "bg-background/95 backdrop-blur-md text-foreground border-border",
      transparent: "bg-white/95 backdrop-blur-md text-gray-800 border-blue-200",
      solid: "bg-blue-600 text-white border-blue-700",
      modern: "bg-white border-slate-200",
    },
  },
  defaultVariants: { variant: "default" },
});

export const footerVariants = cva("w-full border-t transition-colors duration-300", {
  variants: {
    variant: {
      default: "bg-background border-border",
      light: "bg-white border-gray-200",
      dark: "bg-neutral-900 border-neutral-700",
      glass: "bg-background/10 backdrop-blur-md border-border",
      gradient: "bg-background/10 backdrop-blur-md border-border",
      transparent: "bg-blue-500 border-blue-500 text-white",
      solid: "bg-blue-600 border-blue-700 text-white",
      modern: "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white",
    },
  },
  defaultVariants: { variant: "default" },
});

/**
 * Determines the appropriate button variant based on layout variant
 * @function
 * @param {string} variant - Layout variant
 * @param {'ghost'|'primary'} baseVariant - Base button variant
 * @returns {'ghost'|'primary'|'default'} - Appropriate button variant
 */
export const getButtonVariant = (variant: string, baseVariant: "ghost" | "primary") => {
  if (variant === "dark" || variant === "solid") {
    return baseVariant === "ghost" ? "ghost" : "primary";
  }
  if (variant === "glass" || variant === "transparent") {
    return baseVariant === "ghost" ? "ghost" : "primary";
  }
  return baseVariant;
};

/**
 * Generates CSS classes for navigation links based on variant and active state
 * @function
 * @param {string} variant - Layout variant
 * @param {string} linkHref - Link's href attribute
 * @param {string} [activeNavLink] - Currently active navigation link
 * @param {boolean} [isMobile=false] - Whether to generate mobile styles
 * @returns {string} - CSS class string for the navigation link
 */
export const getNavLinkClass = (
  variant: string,
  linkHref: string,
  activeNavLink?: string,
  isMobile = false
) => {
  const isActive = activeNavLink === linkHref;
  const baseClasses = "text-sm font-medium transition-all duration-200 rounded-md";

  if (isMobile) {
    if (variant === "solid") {
      return cn(
        baseClasses,
        "py-2 px-3 flex items-center justify-between group",
        isActive
          ? "bg-blue-500 text-white"
          : "text-white/90 hover:bg-blue-500/50 hover:text-white"
      );
    }
    return cn(
      baseClasses,
      "py-2 px-3 flex items-center justify-between group",
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

  if (variant === "modern") {
    return cn(
      baseClasses,
      "px-4 py-2 relative group flex items-center space-x-2",
      isActive
        ? "text-blue-600 font-semibold bg-blue-50 rounded-lg"
        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
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

/**
 * Generates CSS classes for the logo container based on variant
 * @function
 * @param {string} variant - Layout variant
 * @returns {string} - CSS class string for the logo container
 */
export const getLogoClass = (variant: string) => {
  return cn(
    "w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all duration-300",
    variant === "modern"
      ? "bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-lg group-hover:scale-105 text-white"
      : "bg-muted"
  );
};

/**
 * Generates CSS classes for the logo text based on variant
 * @function
 * @param {string} variant - Layout variant
 * @returns {string} - CSS class string for the logo text
 */

export const getLogoTextClass = (variant: string) => {
  return cn(
    "text-xl font-bold tracking-tight",
    variant === "modern" && "bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
  );
};