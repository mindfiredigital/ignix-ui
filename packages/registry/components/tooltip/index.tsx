import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { ReactNode, useState } from "react";

// Define animation variants
const motionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
  },
  slideUp: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: 6, transition: { duration: 0.1 } },
  },
  slideDown: {
    initial: { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.1 } },
  },
  slideLeft: {
    initial: { opacity: 0, x: 6 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, x: 6, transition: { duration: 0.1 } },
  },
  slideRight: {
    initial: { opacity: 0, x: -6 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, x: -6, transition: { duration: 0.1 } },
  },
};

type AnimationVariant = keyof typeof motionVariants;

// Tooltip style
const tooltipVariants = cva(
  "px-3 py-1.5 text-sm shadow-md border z-50 select-none",
  {
    variants: {
      rounded: {
        sm: "rounded-md",
        md: "rounded-xl",
        full: "rounded-full",
      },
      bg: {
        dark: "bg-zinc-900 text-white border-zinc-800",
        light: "bg-white text-zinc-900 border-zinc-200",
        slate: "bg-slate-800 text-white border-slate-700",
        default: "bg-white text-gray-900",
        transparent: "bg-transparent text-transparent",
        glass: "bg-white/10 backdrop-blur-lg text-blue-200",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
        primary: "bg-blue-400 text-white",
      },
    },
    defaultVariants: {
      rounded: "sm",
      bg: "dark",
    },
  }
);

interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  animation?: AnimationVariant;
}

export const Tooltip = ({
  children,
  content,
  className,
  animation = "fade",
  rounded,
  bg,
}: TooltipProps) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <AnimatePresence>
          {open && (
            <TooltipPrimitive.Portal forceMount>
              <TooltipPrimitive.Content asChild sideOffset={6}>
                <motion.div
                  key="tooltip"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={motionVariants[animation]}
                  className={cn(tooltipVariants({ rounded, bg }), className)}
                >
                  {content}
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          )}
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
