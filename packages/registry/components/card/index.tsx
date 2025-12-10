import { cn } from '../../../utils/cn';
import * as React from "react"
import { type HTMLMotionProps, motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

// Card Animation Variants
const cardAnimations = {
  none: {},
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  slideUp: {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8, rotateX: 15 },
    animate: { opacity: 1, scale: 1, rotateX: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  flipIn: {
    initial: { opacity: 0, rotateY: -90, scale: 0.8 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20,
      duration: 0.8 
    }
  },
  floatIn: {
    initial: { opacity: 0, y: 100, rotateX: 45 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
  }
};

type AnimationVariant = keyof typeof cardAnimations;

// CVA Variants for Card
const cardVariants = cva(
  "relative overflow-hidden transition-all duration-300 transform-gpu will-change-transform group",
  {
    variants: {
      variant: {
        default: cn(
          "rounded-xl bg-background/80 backdrop-blur-sm text-foreground",
          "border border-border/60 shadow-lg shadow-black/5",
          "dark:shadow-white/5 hover:shadow-xl hover:shadow-black/10",
          "dark:hover:shadow-white/10 hover:border-border/80",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
        ),
        elevated: cn(
          "rounded-2xl bg-background text-foreground",
          "shadow-2xl shadow-black/15 dark:shadow-black/40",
          "hover:shadow-3xl hover:-translate-y-2 hover:shadow-black/20",
          "dark:hover:shadow-black/50 border border-border/40",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent before:pointer-events-none"
        ),
        glass: cn(
          "rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl",
          "text-foreground border border-white/20 dark:border-white/10",
          "shadow-xl shadow-black/10 dark:shadow-white/5",
          "hover:bg-white/20 dark:hover:bg-black/20 hover:shadow-2xl",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-white/10 before:to-transparent before:pointer-events-none"
        ),
        gradient: cn(
          "rounded-2xl bg-gradient-to-br from-blue-500/90 via-purple-600/90 to-pink-500/90",
          "text-white border border-white/20 backdrop-blur-sm",
          "shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-purple-500/30",
          "hover:from-blue-600/90 hover:via-purple-700/90 hover:to-pink-600/90",
          "before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-white/20 before:pointer-events-none"
        ),
        neon: cn(
          "rounded-2xl bg-black text-white border-2 border-cyan-400/50",
          "shadow-xl shadow-cyan-400/25 hover:shadow-2xl hover:shadow-cyan-400/40",
          "hover:border-cyan-400/80 animate-pulse hover:animate-none",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-400/10 before:to-transparent before:pointer-events-none"
        ),
        outline: cn(
          "rounded-xl bg-transparent text-foreground",
          "border-2 border-border/60 hover:border-border",
          "hover:bg-muted/30 backdrop-blur-sm",
          "shadow-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
        ),
        minimal: cn(
          "rounded-lg bg-transparent text-foreground",
          "hover:bg-muted/40 transition-colors duration-200"
        ),
        premium: cn(
          "rounded-3xl bg-gradient-to-br from-background/95 to-muted/30",
          "text-foreground border border-border/40 backdrop-blur-xl",
          "shadow-2xl shadow-black/10 dark:shadow-black/30",
          "hover:shadow-3xl hover:shadow-black/15 dark:hover:shadow-black/40",
          "hover:-translate-y-1 hover:scale-[1.02]",
          "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent before:pointer-events-none",
          "after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-t after:from-black/5 after:to-transparent after:pointer-events-none"
        ),
        success: cn(
          "rounded-xl bg-gradient-to-br from-emerald-500/90 to-green-600/90",
          "text-white border border-emerald-400/30",
          "shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40",
          "hover:from-emerald-600/90 hover:to-green-700/90"
        ),
        warning: cn(
          "rounded-xl bg-gradient-to-br from-amber-400/90 to-orange-500/90",
          "text-amber-950 border border-amber-300/30",
          "shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40",
          "hover:from-amber-500/90 hover:to-orange-600/90"
        ),
        error: cn(
          "rounded-xl bg-gradient-to-br from-red-500/90 to-rose-600/90",
          "text-white border border-red-400/30",
          "shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40",
          "hover:from-red-600/90 hover:to-rose-700/90"
        ),
        info: cn(
          "rounded-xl bg-gradient-to-br from-blue-500/90 to-cyan-600/90",
          "text-white border border-blue-400/30",
          "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40",
          "hover:from-blue-600/90 hover:to-cyan-700/90"
        )
      },
      size: {
        sm: "text-sm",
        md: "text-base", 
        lg: "text-lg",
        xl: "text-xl"
      },
      interactive: {
        none: "",
        hover: "hover:scale-[1.02] cursor-pointer",
        press: "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        lift: "hover:-translate-y-2 hover:scale-[1.02] cursor-pointer",
        tilt: "hover:rotate-1 hover:scale-[1.02] cursor-pointer",
        glow: "hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: "none"
    }
  }
);

type CardProps = React.PropsWithChildren<
  HTMLMotionProps<"div"> &
  VariantProps<typeof cardVariants> &
  {
    asChild?: boolean;
    animation?: AnimationVariant;
  }
>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, animation = "none", asChild = false, children, ...props }, ref) => {
    const animationProps = cardAnimations[animation];
    
    if (asChild) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardVariants({ variant, size, interactive }), className)}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, size, interactive }), className)}
        {...animationProps}
        whileHover={
          interactive !== "none" 
            ? { 
                scale: interactive === "tilt" ? 1.02 : undefined,
                rotate: interactive === "tilt" ? 1 : undefined,
                y: interactive === "lift" ? -8 : undefined 
              }
            : undefined
        }
        whileTap={
          interactive === "press" 
            ? { scale: 0.98, transition: { duration: 0.1 } }
            : undefined
        }
        {...props}
      >
        {/* Animated shimmer effect - FIXED: Moved outside children */}
        {(variant === "premium" || variant === "glass" || variant === "gradient") && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
            initial={{ x: "-100%" }}
            whileHover={{ 
              x: "100%",
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
          />
        )}
        
        {/* Properly typed children */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";

// Enhanced Card Header - FIXED: Proper typing
const cardHeaderVariants = cva(
  "flex flex-col space-y-1.5 relative",
  {
    variants: {
      variant: {
        default: "p-6",
        compact: "p-4", 
        spacious: "p-8",
        minimal: "p-3"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type CardHeaderProps = React.PropsWithChildren<HTMLMotionProps<"div"> & VariantProps<typeof cardHeaderVariants>>;


const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(cardHeaderVariants({ variant }), className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
CardHeader.displayName = "CardHeader";

// Enhanced Card Title - FIXED: Proper typing with React.ReactNode
const cardTitleVariants = cva(
  "font-semibold leading-none tracking-tight",
  {
    variants: {
      size: {
        sm: "text-lg",
        md: "text-xl", 
        lg: "text-2xl",
        xl: "text-3xl"
      },
      gradient: {
        none: "",
        blue: "bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent",
        purple: "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
        green: "bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent",
        gold: "bg-gradient-to-r from-warning to-orange-600 bg-clip-text text-transparent"
      }
    },
    defaultVariants: {
      size: "lg",
      gradient: "none"
    }
  }
);

type CardTitleProps = React.PropsWithChildren<HTMLMotionProps<"h3"> & VariantProps<typeof cardTitleVariants>>;

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, gradient, children, ...props }, ref) => (
    <motion.h3
      ref={ref}
      className={cn(cardTitleVariants({ size, gradient }), className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.h3>
  )
);
CardTitle.displayName = "CardTitle";

// Enhanced Card Description - FIXED: Proper typing
type CardDescriptionProps = React.PropsWithChildren<HTMLMotionProps<"p"> & VariantProps<typeof cardHeaderVariants>>;

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <motion.p
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.p>
  )
);
CardDescription.displayName = "CardDescription";

// Enhanced Card Content - FIXED: Proper typing
const cardContentVariants = cva(
  "relative",
  {
    variants: {
      variant: {
        default: "p-6 pt-0",
        compact: "p-4 pt-0",
        spacious: "p-8 pt-0", 
        minimal: "p-3 pt-0",
        flush: "p-0"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type CardContentProps = React.PropsWithChildren<
  HTMLMotionProps<"div"> & VariantProps<typeof cardContentVariants>
>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(cardContentVariants({ variant }), className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
CardContent.displayName = "CardContent";

// Enhanced Card Footer - FIXED: Proper typing
const cardFooterVariants = cva(
  "flex items-center relative",
  {
    variants: {
      variant: {
        default: "p-6 pt-0",
        compact: "p-4 pt-0",
        spacious: "p-8 pt-0",
        minimal: "p-3 pt-0"
      },
      justify: {
        start: "justify-start",
        center: "justify-center", 
        end: "justify-end",
        between: "justify-between",
        around: "justify-around"
      }
    },
    defaultVariants: {
      variant: "default",
      justify: "start"
    }
  }
);

type CardFooterProps = React.PropsWithChildren<
  HTMLMotionProps<"div"> & VariantProps<typeof cardFooterVariants>
>;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant, justify, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(cardFooterVariants({ variant, justify }), className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
CardFooter.displayName = "CardFooter";

// Special Card Components - FIXED: Proper typing
interface FeatureCardProps extends CardProps {
  icon?: React.ReactNode;
  }

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, children, className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="premium"
      interactive="lift"
      animation="slideUp"
      className={cn("text-center", className)}
      {...props}
    >
      {icon && (
        <CardHeader variant="spacious">
          <>
            <motion.div
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {icon}
            </motion.div>
            {children}
          </>
        </CardHeader>
      )}
    </Card>
  )
);
FeatureCard.displayName = "FeatureCard";

// Stat Card - FIXED: Proper typing
interface StatCardProps extends CardProps {
  value: string | number; 
  label: string; 
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ value, label, trend, trendValue, className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      interactive="hover"
      animation="scaleIn"
      className={cn("text-center", className)}
      {...props}
    >
      <CardContent variant="spacious">
        <motion.div
          className="text-3xl font-bold text-primary mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          {value}
        </motion.div>
        <div className="text-sm text-muted-foreground mb-2">{label}</div>
        {trend && trendValue && (
          <div className={cn(
            "text-xs font-medium",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive", 
            trend === "neutral" && "text-muted-foreground"
          )}>
            {trend === "up" && "↗ "}
            {trend === "down" && "↘ "}
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
);
StatCard.displayName = "StatCard";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  FeatureCard,
  StatCard,
  cardVariants,
  type AnimationVariant,
  type CardProps
};
