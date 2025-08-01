import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { ReactNode } from "react";

// Styling variants using CVA
const dropdownVariants = cva("z-50 min-w-[10rem] border p-2 shadow-lg", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-md",
      md: "rounded-xl",
      full: "rounded-full",
    },
    bg: {
      default: "bg-background text-foreground",
      dark: "bg-card text-card-foreground",
      transparent: "bg-transparent text-transparent",
      glass: "bg-white/10 backdrop-blur-lg text-[var(--color-glass-text)]",
      gradient: "bg-gradient-to-r from-[var(--color-gradient-from-dropdown)] to-[var(--color-gradient-to-dropdown)] text-white",
      primary: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: "md",
    bg: "default",
  },
});

// Animation variants
const animations = {
  default: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -5, scale: 0.95, transition: { duration: 0.1 } },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.15 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.1 } },
  },
  slide: {
    initial: { y: -12, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
    exit: { y: -8, opacity: 0, transition: { duration: 0.1 } },
  },
  flip: {
    initial: { rotateX: -90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1, transition: { duration: 0.25 } },
    exit: { rotateX: -90, opacity: 0, transition: { duration: 0.15 } },
  },
};

type AnimationVariant = keyof typeof animations;

interface DropdownProps extends VariantProps<typeof dropdownVariants> {
  children: ReactNode;
  trigger: ReactNode;
  animation?: AnimationVariant;
  className?: string;
}

export const Dropdown = ({
  children,
  trigger,
  animation = "default",
  size,
  rounded,
  bg,
  className,
}: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild sideOffset={8}>
          <motion.div
            variants={animations[animation]}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(dropdownVariants({ size, rounded, bg }), className)}
          >
            {children}
          </motion.div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const DropdownItem = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentProps<typeof DropdownMenu.Item>) => (
  <DropdownMenu.Item
    className={cn(
      "cursor-pointer select-none rounded-md px-3 py-2 text-sm outline-transparent",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenu.Item>
);
