"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, Check, Circle, Home, ArrowRight } from "lucide-react";
import { cn } from "../../../utils/cn";

export interface BreadcrumbsProps 
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>,
    VariantProps<typeof breadcrumbsVariants> {
  items?: { label: string; href?: string; icon?: React.ElementType }[];
  separatorIcon?: React.ElementType;
  steps?: string[];
  currentStep?: number;
}

const breadcrumbsVariants = cva("w-full", {
  variants: {
    size: {
      sm: "text-sm gap-1",
      md: "text-base gap-2", 
      lg: "text-lg gap-3",
    },
    shape: {
      rectangle: "rounded-lg",
      round: "rounded-full",
      pill: "rounded-2xl",
      default: "rounded-xl",
    },
    variant: {
      text: "flex items-center flex-wrap bg-background/50 backdrop-blur-sm p-2 rounded-xl",
      step: "flex flex-col space-y-6",
      progress: "space-y-6 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg",
      custom: "flex flex-wrap items-center gap-2 p-3 rounded-2xl shadow-xl",
    },
    bgColor: {
      primary: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-lg shadow-primary/25",
      secondary: "bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary shadow-lg shadow-secondary/25",
      success: "bg-gradient-to-r from-success to-success/80 hover:from-success/80 hover:to-success shadow-lg shadow-success/25",
      destructive: "bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/80 hover:to-destructive shadow-lg shadow-destructive/25",
      transparent: "bg-transparent",
    },
    textColor: {
      primary: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "pill",
    variant: "text",
  },
});

// Individual item variants based on the main variant
const itemVariants = cva("relative inline-flex items-center font-medium transition-all duration-300", {
  variants: {
    variant: {
      text: "gap-2 px-3 py-1.5 rounded-xl backdrop-blur-sm hover:bg-muted/50 hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background",
      step: "gap-3 p-2",
      progress: "gap-3 p-1",
      custom: "gap-2 px-4 py-2 font-medium transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 overflow-hidden group",
    },
    size: {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base"
    },
    isActive: { 
      true: "text-foreground bg-background/80 shadow-sm ",
      false: "text-muted-foreground"  
    }
  },
  defaultVariants: {
    variant: "text",
    size: "md",
    isActive: false
  }
});

const AnimatedSeparator: React.FC<{ 
  icon?: React.ElementType; 
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "text" | "step" | "progress" | "custom";
}> = ({ 
  icon: Icon = ChevronRight, 
  isActive = false,
  size = "md",
  variant = "text"
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const variantClasses = {
    text: "mx-1 sm:mx-2",
    step: "mx-3 sm:mx-4",
    progress: "mx-2 sm:mx-3",
    custom: "mx-2"
  };

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center",
        variantClasses[variant]
      )}
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ 
        scale: isActive ? 1.1 : 1,
        opacity: isActive ? 1 : 0.6,
        rotate: isActive ? [0, 10, -10, 0] : 0
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        rotate: {
          duration: 0.6,
          ease: "easeInOut"
        }
      }}
      whileHover={{
        scale: 1.2,
        transition: { duration: 0.2 }
      }}
    >
      <Icon className={cn(
        sizeClasses[size],
        "text-muted-foreground transition-colors duration-300",
        isActive && "text-primary"
      )} />
    </motion.div>
  );
};

const BreadcrumbItem: React.FC<{
  item: { label: string; href?: string; icon?: React.ElementType };
  isLast: boolean;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "text" | "step" | "progress" | "custom";
}> = ({ item, isLast, isActive = false, size = "md", variant = "text" }) => {

  const ItemContent = (
    <motion.span
      className={cn(
        itemVariants({ variant, size, isActive: isLast || isActive }),
        // Special styling for different variants
        variant === "text" && "rounded-xl",
        variant === "custom" && "rounded-2xl"
      )}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 15 }
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      layout
    >
      {item.icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <item.icon className={cn(
            "shrink-0",
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
          )} />
        </motion.div>
      )}
      
      <span className="truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
        {item.label}
      </span>
      
      {/* Enhanced glow effect for active items */}
      {(isLast || isActive) && (
        <motion.div
          className={cn(
            "absolute inset-0 -z-10",
            variant === "text" && "rounded-xl bg-gradient-to-r from-primary/10 to-primary/5",
            variant === "custom" && "rounded-2xl"
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      layout
    >
      {item.href && !isLast ? (
        <a
          href={item.href}
          className="group relative inline-block focus:outline-none"
        >
          {ItemContent}
          {variant === "text" && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 origin-left rounded-full"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </a>
      ) : (
        ItemContent
      )}
    </motion.div>
  );
};

const StepIndicator: React.FC<{
  step: string;
  index: number;
  currentStep: number;
  size?: "sm" | "md" | "lg";
  variant?: "step" | "progress";
}> = ({ step, index, currentStep, size = "md", variant = "step" }) => {
  const isCompleted = index < currentStep;
  const isActive = index === currentStep;
  const isFuture = index > currentStep;

  const sizeClasses = {
    sm: { circle: "w-6 h-6 text-xs", text: "text-xs", gap: "gap-2" },
    md: { circle: "w-8 h-8 text-sm", text: "text-sm", gap: "gap-3" },
    lg: { circle: "w-10 h-10 text-base", text: "text-base", gap: "gap-4" }
  };

  const variantClasses = {
    step: "flex items-center",
    progress: "flex items-center bg-background/50 backdrop-blur-sm p-3 rounded-xl"
  };

  return (
    <motion.div
      className={cn(
        variantClasses[variant],
        sizeClasses[size].gap
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className={cn(
          "relative flex items-center justify-center rounded-full font-bold transition-all duration-500",
          sizeClasses[size].circle,
          "border-2 backdrop-blur-sm",
          isCompleted && "bg-gradient-to-br from-success to-success/80 border-success text-white shadow-lg shadow-success/25",
          isActive && "bg-gradient-to-br from-primary to-primary/80 border-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary/20",
          isFuture && "bg-muted/50 border-border text-muted-foreground"
        )}
        whileHover={{
          scale: 1.1,
          transition: { type: "spring", stiffness: 400, damping: 15 }
        }}
        animate={isActive ? {
          boxShadow: [
            "0 0 0 0 hsl(var(--primary) / 0.4)",
            "0 0 0 8px hsl(var(--primary) / 0.1)",
            "0 0 0 0 hsl(var(--primary) / 0)"
          ]
        } : {}}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Check className={cn(
                "shrink-0",
                size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
              )} />
            </motion.div>
          ) : (
            <motion.span
              key="number"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {index + 1}
            </motion.span>
          )}
        </AnimatePresence>

        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      <motion.span
        className={cn(
          "font-medium transition-colors duration-300 truncate max-w-[100px] sm:max-w-[150px] lg:max-w-none",
          sizeClasses[size].text,
          isCompleted && "text-success-foreground",
          isActive && "text-primary font-semibold",
          isFuture && "text-muted-foreground"
        )}
        animate={isActive ? {
          scale: [1, 1.05, 1]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {step}
      </motion.span>
    </motion.div>
  );
};

const ProgressBreadcrumbs: React.FC<{
  steps: string[];
  currentStep: number;
  size?: "sm" | "md" | "lg";
}> = ({ steps, currentStep, size = "md" }) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Enhanced progress bar with gradient */}
      <div className="relative mb-6 sm:mb-8">
        <div className="h-3 bg-gradient-to-r from-muted/30 to-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/30 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary shadow-sm relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
        
        {/* Enhanced progress percentage */}
        <motion.div
          className="absolute -top-10 bg-gradient-to-br from-background/95 to-muted/30 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-border/60 text-xs font-bold text-primary"
          initial={{ left: 0 }}
          animate={{ left: `calc(${progress}% - 1.5rem)` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {Math.round(progress)}%
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-border/60" />
        </motion.div>
      </div>

      {/* Steps with progress variant styling */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <StepIndicator 
              step={step} 
              index={index} 
              currentStep={currentStep}
              size={size}
              variant="progress"
            />
            {index < steps.length - 1 && (
              <AnimatedSeparator 
                icon={ArrowRight}
                isActive={index < currentStep}
                size={size}
                variant="progress"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  variant = "text",
  size = "md",
  separatorIcon: SeparatorIcon,
  steps = [],
  currentStep = 0,
  className,
  shape,
  ...props
}) => {
  // Add home icon to first item if not present
  const processedItems = items.map((item, index) => ({
    ...item,
    icon: item.icon || (index === 0 ? Home : undefined)
  }));

  return (
    <motion.nav
      className={cn(
        breadcrumbsVariants({ size, variant, shape }), 
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="Breadcrumb navigation"
      {...props}
    >
      {variant === "text" && processedItems.length > 0 && (
        <>
          {processedItems.map((item, index) => (
            <React.Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem
                item={item}
                isLast={index === processedItems.length - 1}
                size={size}
                variant={variant}
              />
              {index < processedItems.length - 1 && (
                <AnimatedSeparator 
                  icon={SeparatorIcon}
                  isActive={index < processedItems.length - 1}
                  size={size}
                  variant={variant}
                />
              )}
            </React.Fragment>
          ))}
        </>
      )}

      {variant === "step" && steps.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <StepIndicator 
                step={step} 
                index={index} 
                currentStep={currentStep}
                size={size}
                variant={variant}
              />
              {index < steps.length - 1 && (
                <AnimatedSeparator 
                  icon={SeparatorIcon}
                  isActive={index < currentStep}
                  size={size}
                  variant={variant}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {variant === "progress" && steps.length > 0 && (
        <ProgressBreadcrumbs 
          steps={steps} 
          currentStep={currentStep}
          size={size}
        />
      )}

      {variant === "custom" && processedItems.length > 0 && (
        <>
          {processedItems.map((item, index) => (
            <React.Fragment key={`${item.label}-${index}`}>
              <motion.a
                href={item.href || "#"}
                className={cn(
                  itemVariants({ variant, size }),
                  breadcrumbsVariants({
                    shape,
                  })
                )}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.span
                  className="relative z-10 flex items-center gap-2"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {index <= currentStep ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  {item.label}
                </motion.span>
                
                {index <= currentStep && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-2xl"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ originX: 0 }}
                  />
                )}
              </motion.a>
              {index < processedItems.length - 1 && (
                <AnimatedSeparator 
                  icon={SeparatorIcon}
                  isActive={index < currentStep}
                  size={size}
                  variant={variant}
                />
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </motion.nav>
  );
};
