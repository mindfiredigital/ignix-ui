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
  value?: (index: number) => void;
}

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
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(selected);

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
            onClick={() => {
              setActiveIndex(index);
              value && value(index);
            }}
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
