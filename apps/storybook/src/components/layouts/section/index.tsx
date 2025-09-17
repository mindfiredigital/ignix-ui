import { cn } from '../../../../utils/cn';
import * as React from "react";
import { motion, type Variants } from "framer-motion";

export type SectionSpacing = "none" | "small" | "normal" | "large" | "xl" | string;
export type SectionBackground = "none" | "white" | "gray" | "slate" | "zinc" | "stone";
export type SectionPadding = "none" | "small" | "normal" | "large" | "comfortable" | "generous" | string;
export type SectionMaxWidth = "sm" | "md" | "lg" | "xl" | "full" | "readable" | string;
export type SectionAnimation = "none" | "fade" | "slide-up" | "zoom" | "stagger";

interface SectionProps {
  children: React.ReactNode;
  spacing?: SectionSpacing;
  maxWidth?: SectionMaxWidth;
  background?: SectionBackground;
  padding?: SectionPadding;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  animation?: SectionAnimation;
  animationDelay?: number;
}

// Animation variants for Framer Motion
const animationVariants: Record<SectionAnimation, Variants> = {
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  },
  "slide-up": {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }
};

// Child animation variants for stagger effect
const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const spacingClasses: Record<Exclude<SectionSpacing, string>, string> = {
  none: "my-0",
  small: "my-4",
  normal: "my-8",
  large: "my-12",
  xl: "my-16",
};

const backgroundClasses: Record<SectionBackground, string> = {
  none: "",
  white: "bg-white dark:bg-gray-900",
  gray: "bg-gray-50 dark:bg-gray-800",
  slate: "bg-slate-50 dark:bg-slate-900",
  zinc: "bg-zinc-50 dark:bg-zinc-900",
  stone: "bg-stone-50 dark:bg-stone-900",
};

const paddingClasses: Record<Exclude<SectionPadding, string>, string> = {
  none: "p-0",
  small: "p-4",
  normal: "p-6",
  large: "p-8",
  comfortable: "p-10",
  generous: "p-12",
};

const maxWidthClasses: Record<Exclude<SectionMaxWidth, string>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
  readable: "max-w-prose",
};

const Section = React.forwardRef<HTMLDivElement, SectionProps>(({
  children,
  spacing = "normal",
  maxWidth,
  background = "none",
  padding = "normal",
  animation = "none",
  animationDelay = 0,
  className,
  ...props
}, ref) => {
  // Handle spacing - support both predefined classes and custom values as inline styles
  const spacingStyle: React.CSSProperties = {};
  let spacingClass = "";
  
  if (spacing) {
    if (typeof spacing === 'string' && spacing in spacingClasses) {
      // Use predefined class
      spacingClass = spacingClasses[spacing as keyof typeof spacingClasses];
    } else {
      // Apply custom value as inline style
      if (typeof spacing === 'number') {
        spacingStyle.marginTop = `${spacing}px`;
        spacingStyle.marginBottom = `${spacing}px`;
      } else {
        spacingStyle.margin = spacing;
      }
    }
  }

  // Handle padding - support both predefined classes and custom values as inline styles
  const paddingStyle: React.CSSProperties = {};
  let paddingClass = "";
  
  if (padding) {
    if (typeof padding === 'string' && padding in paddingClasses) {
      // Use predefined class
      paddingClass = paddingClasses[padding as keyof typeof paddingClasses];
    } else {
      // Apply custom value as inline style
      if (typeof padding === 'number') {
        paddingStyle.padding = `${padding}px`;
      } else {
        paddingStyle.padding = padding;
      }
    }
  }

  // Handle maxWidth - support both predefined classes and custom values as inline styles
  const maxWidthStyle: React.CSSProperties = {};
  let widthClass = "";
  const childArray = React.Children.toArray(children);
  
  if (maxWidth) {
    if (typeof maxWidth === 'string' && maxWidth in maxWidthClasses) {
      // Use predefined class
      widthClass = maxWidthClasses[maxWidth as keyof typeof maxWidthClasses];
    } else {
      // Apply custom value as inline style
      if (typeof maxWidth === 'number') {
        maxWidthStyle.maxWidth = `${maxWidth}px`;
      } else {
        maxWidthStyle.maxWidth = maxWidth;
      }
    }
  }

  const sectionVariants = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      className={cn(
        "w-full",
        spacingClass,
        backgroundClasses[background],
        paddingClass,
        widthClass,
        "mx-auto", // Center content horizontally
        "px-4 sm:px-6 lg:px-8", // Responsive horizontal padding
        className
      )}
      style={{ ...spacingStyle, ...paddingStyle, ...maxWidthStyle }}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: animationDelay,
        duration: animation === "none" ? 0 : 0.6,
        ease: "easeOut"
      }}
      {...props}
    >
      {animation === "stagger" ? (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {childArray.map((child, i) => (
            <motion.div
              key={i}
              variants={childVariants}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
});

Section.displayName = 'Section';

export { Section };
export type { SectionProps };