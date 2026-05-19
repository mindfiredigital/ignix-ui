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
      transparent: "bg-transparent",
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
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export const Dropdown = ({
  children,
  trigger,
  animation = "default",
  size,
  rounded,
  bg,
  className,
  side = "bottom",
  sideOffset = 8,
  align = "center",
}: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild sideOffset={sideOffset} side={side} align={align}>
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
      "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-transparent focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenu.Item>
);
export const DropdownCheckboxItem = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentProps<typeof DropdownMenu.CheckboxItem>) => (
  <DropdownMenu.CheckboxItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenu.ItemIndicator>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </DropdownMenu.ItemIndicator>
    </span>
    {children}
  </DropdownMenu.CheckboxItem>
);

export const DropdownLabel = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Label>) => (
  <DropdownMenu.Label
    className={cn("px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}
    {...props}
  />
);

export const DropdownSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>) => (
  <DropdownMenu.Separator
    className={cn("-mx-2 my-2 h-px bg-border/50", className)}
    {...props}
  />
);

