"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";
import { Button } from "../button";
import { Card, CardContent } from "../card";

const suggestedActionsVariants = cva("w-full transition-colors select-none", {
  variants: {
    variant: {
      default: "bg-transparent",
      dark: "bg-transparent text-white",
      glass: "bg-transparent text-white",
      minimal: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SuggestedAction {
  label: string;
  description?: string;
  actionText: string;
  icon?: React.ReactNode;
}

export interface AISuggestedActionsProps extends VariantProps<typeof suggestedActionsVariants> {
  actions: SuggestedAction[];
  onActionClick: (actionText: string) => void;
  layout?: "flex" | "grid";
  className?: string;
  animate?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
} as const;

export const AISuggestedActions = React.forwardRef<HTMLDivElement, AISuggestedActionsProps>(
  (
    {
      actions = [],
      onActionClick,
      layout = "flex",
      variant = "default",
      className,
      animate = true,
      ...props
    },
    ref
  ) => {
    if (layout === "flex") {
      return (
        <motion.div
          ref={ref}
          variants={animate ? containerVariants : undefined}
          initial="hidden"
          animate="show"
          className={cn("flex flex-wrap gap-2 items-center", className)}
          {...props}
        >
          {actions.map((act, index) => (
            <motion.div
              key={index}
              variants={animate ? itemVariants : undefined}
            >
              <Button
                type="button"
                variant="none"
                size="compact"
                onClick={() => onActionClick(act.actionText)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full shadow-sm text-xs cursor-pointer active:scale-95 transition-all select-none font-semibold px-3 py-1.5 border",
                  variant === "dark" && "bg-neutral-950 border-neutral-900 text-neutral-200 hover:bg-neutral-900 hover:text-white",
                  variant === "default" && "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/80",
                  variant === "glass" && "bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/15 hover:text-white",
                  variant === "minimal" && "bg-transparent border-transparent shadow-none hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
                )}
              >
                {act.icon && <span className="shrink-0">{act.icon}</span>}
                <span>{act.label}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        variants={animate ? containerVariants : undefined}
        initial="hidden"
        animate="show"
        className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}
        {...props}
      >
        {actions.map((act, index) => (
          <motion.div
            key={index}
            variants={animate ? itemVariants : undefined}
            className="h-full"
          >
            <Card
              className={cn(
                "h-full cursor-pointer transition-all duration-300 active:scale-[0.98] select-none group flex flex-col justify-between overflow-hidden",
                variant === "dark" && "bg-neutral-950 border-neutral-850 text-white hover:bg-neutral-900/80",
                variant === "default" && "bg-white border-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 hover:shadow-md hover:bg-neutral-50/20 dark:hover:bg-neutral-800/20 hover:border-neutral-300 dark:hover:border-neutral-700",
                variant === "glass" && "bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/15",
                variant === "minimal" && "bg-transparent border-transparent shadow-none text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/30"
              )}
              onClick={() => onActionClick(act.actionText)}
            >
              <CardContent className="p-4 flex items-start gap-3 h-full">
                {act.icon && (
                  <div className={cn(
                    "p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110",
                    variant === "glass" ? "bg-white/10 backdrop-blur-md text-white" : "bg-neutral-100 dark:bg-neutral-800 text-indigo-500 dark:text-indigo-400"
                  )}>
                    {act.icon}
                  </div>
                )}
                <div className="flex flex-col space-y-1 min-w-0">
                  <span className="text-sm font-bold truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {act.label}
                  </span>
                  {act.description && (
                    <span className={cn(
                      "text-xs leading-relaxed line-clamp-2",
                      variant === "glass" ? "text-white/60" : "text-neutral-400 dark:text-neutral-500"
                    )}>
                      {act.description}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

AISuggestedActions.displayName = "AISuggestedActions";
export { suggestedActionsVariants };
