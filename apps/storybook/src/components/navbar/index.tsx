"use client";

import { motion, type HTMLMotionProps, AnimatePresence } from "framer-motion";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface NavbarProps
  extends Omit<HTMLMotionProps<"nav">, "ref">,
    VariantProps<typeof navbarVariants> {
  animationType?:
    | "slide"
    | "glow"
    | "basic"
    | "spotlight"
    | "hoverSubmenu"
    | "clickSubmenu";
  direction?: "horizontal" | "vertical";
  children?: React.ReactNode;
  submenuContent?: React.ReactNode;
  header?: string;
}

const navbarVariants = cva(
  "flex items-center justify-between px-4 py-3 shadow-md transition-all",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        dark: "bg-card text-card-foreground",
        transparent: "bg-transparent text-transparent",
        glass: "bg-white/10 backdrop-blur-lg text-[var(--color-navbar-glass-text)]",
        gradient:
          "bg-gradient-to-r from-[var(--color-navbar-gradient-from)] to-[var(--color-navbar-gradient-to)] text-white",
        primary: "bg-primary text-primary-foreground",
      },
      size: {
        sm: "h-12",
        md: "h-16",
        lg: "h-20",
        xl: "h-24",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      textColor: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        white: "text-white",
      },
      direction: {
        horizontal: "flex-row",
        vertical: "flex-col items-start space-y-4 p-4",
      },
    },
    defaultVariants: {
      weight: "semibold",
      align: "left",
      direction: "horizontal",
    },
  }
);

// Improved submenu animation with subtle y translation and opacity fades
const submenuVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Refined animation variants, no infinite loops, smoother springs & easing
const animationVariants: Record<string, Partial<HTMLMotionProps<"nav">>> = {
  slide: {
    initial: { y: -40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -40, opacity: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  glow: {
    whileHover: {
      boxShadow: "0 0 12px 4px var(--primary)",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  },
  basic: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  spotlight: {
    whileHover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
  hoverSubmenu: {
    initial: { y: 0, opacity: 1 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.3 },
  },
  clickSubmenu: {
    initial: { y: 0, opacity: 1 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.3 },
  },
};

const Navbar: React.FC<NavbarProps> = ({
  className,
  variant,
  size,
  direction = "horizontal",
  children,
  animationType = "slide",
  submenuContent,
  header,
  ...props
}) => {
  const animation = animationVariants[animationType] || {};
  const [, setIsHovered] = React.useState(false); // unused but kept for API compatibility
  const [hovered, setHovered] = React.useState(false);
  direction =
    animationType === "hoverSubmenu" || animationType === "clickSubmenu"
      ? "vertical"
      : direction;
  const [clicked, setClicked] = React.useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    // Only toggle if clicking on the header area or chevron
    const target = e.target as HTMLElement;
    if (
      animationType === "clickSubmenu" &&
      (target.closest('.navbar-header') || target.closest('.navbar-chevron'))
    ) {
      e.stopPropagation();
      setClicked((prev) => !prev);
    }
  };

  const showSubmenu =
    (animationType === "hoverSubmenu" && hovered) ||
    (animationType === "clickSubmenu" && clicked);

  return (
    <motion.nav
      className={cn(
        navbarVariants({ variant, size, direction }),
        "[&_input]:text-black [&_input]:border [&_input]:border-gray-300 [&_input]:rounded [&_input]:px-2 [&_input]:py-1 relative",
        className,
        {
          'overflow-visible': showSubmenu,
          'z-50': showSubmenu
        }
      )}
      {...animation}
      {...props}
      onMouseEnter={() => {
        setIsHovered(true);
        if (animationType === "hoverSubmenu") setHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (animationType === "hoverSubmenu") setHovered(false);
      }}
      onClick={handleToggle}
    >
      {(animationType === "spotlight" || animationType === "basic") &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return (
              <motion.div
                whileHover={
                  animationType === "spotlight"
                    ? {
                        scale: 1.1,
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 80%)",
                        transition: { duration: 0.3 },
                      }
                    : { scale: 1.05, transition: { duration: 0.3 } }
                }
                className={
                  animationType === "spotlight"
                    ? "rounded-full p-3"
                    : "flex items-center space-x-2 p-3"
                }
              >
                {child}
              </motion.div>
            );
          }
          return null;
        })}
      {(animationType === "hoverSubmenu" ||
        animationType === "clickSubmenu") && (
        <>
          <div className="flex justify-between w-full space-x-2">
            <span className="text-lg font-bold float-left navbar-header cursor-pointer">{header}</span>
            {showSubmenu ? (
              <span className="float-right navbar-chevron cursor-pointer">
                <ChevronUp size={20} />
              </span>
            ) : (
              <span className="float-right navbar-chevron cursor-pointer">
                <ChevronDown size={20} />
              </span>
            )}
          </div>
          <AnimatePresence>
            {showSubmenu && (
              <motion.div
                key="hoverMenu"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={submenuVariants}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                  "absolute left-0 right-0 bg-background w-full px-6 py-4 border-t shadow-lg z-50",
                  direction === "horizontal" ? "top-full" : "top-0 mt-12",
                  variant === "dark" ? "bg-card text-card-foreground" : "",
                  variant === "primary"
                    ? "bg-primary text-primary-foreground"
                    : ""
                )}
              >
                {submenuContent}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      {!["hoverSubmenu", "clickSubmenu", "spotlight", "basic"].includes(
        animationType
      ) && children}
    </motion.nav>
  );
};

Navbar.displayName = "Navbar";

export { Navbar, navbarVariants };
