"use client";

import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  options: string[];
  selected?: number;
  value?: (index: any) => void;
  /**
   * The selected tab is always persisted to localStorage and restored on mount, surviving a
   * page refresh. Defaults to a key derived from `options` - override it when multiple `Tabs`
   * instances share the same options but must remember their selection independently.
   */
  storageKey?: string;
}

const STORAGE_PREFIX = "ignix-tabs:";

const tabsVariants = cva("relative flex items-center", {
  variants: {
    variant: {
      underline: "border-b-2 border-transparent border-primary",
      filled: "bg-primary text-primary-foreground",
      pill: "bg-primary text-primary-foreground rounded-full px-4 py-2",
      outline: "border border-primary text-primary rounded-md px-4 py-2",
      ghost:
        "bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-md px-4 py-2",
      shadow: "shadow-lg bg-background text-foreground rounded-md px-4 py-2",
      gradient:
        "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-md px-4 py-2",
      glow: "bg-background text-foreground rounded-md px-4 py-2 shadow-lg shadow-primary/50",
      block: "border border-border rounded-md",
    },
    theme: {
      light: "bg-background text-foreground",
      dark: "bg-card text-card-foreground",
      glass: "bg-background/10 backdrop-blur-lg text-foreground",
      glassDark: "bg-card/10 backdrop-blur-lg text-card-foreground",
      glassLight: "bg-background/10 backdrop-blur-lg text-foreground",
      glassGradient:
        "bg-gradient-to-r from-primary to-accent/10 backdrop-blur-lg text-primary-foreground",
      glassGradientDark:
        "bg-gradient-to-r from-primary to-accent/10 backdrop-blur-lg text-foreground",
    },

    size: {
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "underline",
    size: "md",
  },
});

export const Tabs: React.FC<TabsProps> = ({
  options,
  selected = 0,
  value,
  variant = "underline",
  size = "md",
  className,
  theme,
  storageKey,
  ...props
}) => {
  const resolvedStorageKey = `${STORAGE_PREFIX}${storageKey ?? options.join("|")}`;

  const [activeIndex, setActiveIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(resolvedStorageKey);
      if (saved !== null) {
        const parsed = Number(saved);
        if (Number.isInteger(parsed) && parsed >= 0 && parsed < options.length) {
          return parsed;
        }
      }
    } catch {
      console.warn("Could not load tab selection from storage");
    }
    return selected;
  });

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    try {
      localStorage.setItem(resolvedStorageKey, String(index));
    } catch {
      console.warn("Could not save tab selection to storage");
    }
    value && value(index);
  };

  return (
    <div
      className={cn(
        "relative flex space-x-4",
        variant !== "ghost" ? tabsVariants({ variant, size, theme }) : "",
        className
      )}
      {...props}
    >
      {options.map((option, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.button
            key={option}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(index)}
            className={cn(
              "relative px-4 py-2 transition-all",
              isActive
                ? tabsVariants({ variant, size })
                : "text-gray-500 hover:text-primary"
            )}
          >
            {option}
            {[
              "filled",
              "pill",
              "outline",
              "ghost",
              "shadow",
              "gradient",
              "glow",
              "block",
            ].includes(variant || "") &&
              isActive && (
                <motion.div
                  layoutId={`active-tab-bg-${variant}`}
                  className="absolute inset-0 z-[-1] rounded-md bg-[rgba(0,115,230,0.1)]"
                  transition={{ duration: 0.3 }}
                />
              )}
          </motion.button>
        );
      })}
    </div>
  );
};
