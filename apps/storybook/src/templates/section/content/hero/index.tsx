"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../../../utils/cn";
import { Typography } from "../../../../components/typography";
import { Container } from "../../../../components/layouts/container";


/* -------------------------------------------------------------------------- */
/*                              VARIANT STYLES                                */
/* -------------------------------------------------------------------------- */

const heroVariants = cva(
  "relative w-full overflow-hidden flex items-center justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px]",
  {
    variants: {
      variant: {
        dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
        default: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const contentVariants = cva("relative z-10 w-full", {
  variants: {
    align: {
      left: "text-left items-start max-w-[85%] lg:max-w-[100%] xl:max-w-7xl",
      center:
        "text-center items-center max-w-[90%] lg:max-w-[85%] xl:max-w-7xl mx-auto",
      right:
        "text-right items-end max-w-[85%] lg:max-w-[75%] xl:max-w-7xl ml-auto",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

/* -------------------------------------------------------------------------- */
/*                              ANIMATION VARIANTS                            */
/* -------------------------------------------------------------------------- */

const heroAnimations = {
  none: {
    initial: { opacity: 0 },
    animate: { opacity: 0 },
    transition: { duration: 0, ease: [0, 0, 0] },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  slideUp: {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
  slideDown: {
    initial: { opacity: 0, y: -60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
  slideLeft: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  slideRight: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  flipIn: {
    initial: { opacity: 0, rotateY: -90, scale: 0.8 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      duration: 0.8,
    },
  },
  floatIn: {
    initial: { opacity: 0, y: 100, rotateX: 45 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -180, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
};

/* -------------------------------------------------------------------------- */
/*                                INTERFACES                                  */
/* -------------------------------------------------------------------------- */

type AnimationProps = React.ComponentProps<typeof motion.div>;

export interface HeroContextValue {
  variant: "default" | "dark";
  align: "left" | "center" | "right";
  animationType: string;
  isLightVariant: boolean;
  textColor: string;
  subheadingColor: string;
  split?: boolean;
  getAnimationProps: (
    delay?: number,
  ) => Pick<AnimationProps, "initial" | "animate" | "transition">;
}

const HeroContext = React.createContext<HeroContextValue | null>(null);

const useHeroContext = () => {
  const context = React.useContext(HeroContext);
  if (!context) {
    throw new Error("Hero sub-components must be used within Hero component");
  }
  return context;
};

export interface HeroProps extends VariantProps<typeof heroVariants> {
  children: React.ReactNode;
  /**
   * Background gradient variant
   */
  variant?: "default" | "dark";
  /**
   * Custom background class (overrides variant)
   */
  backgroundClassName?: string;
  /**
   * Content alignment
   */
  align?: "left" | "center" | "right";
  /**
   * Container max width
   */
  containerSize?: "small" | "normal" | "large" | "full" | "readable";
  /**
   * Animation type for content elements
   */
  animationType?:
    | "none"
    | "fadeIn"
    | "fadeInUp"
    | "fadeInDown"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleIn"
    | "zoomIn"
    | "flipIn"
    | "bounceIn"
    | "floatIn"
    | "rotateIn";
  /**
   * 'split' for side-by-side layout
   */
  split?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                              SUB-COMPONENTS                                */
/* -------------------------------------------------------------------------- */

export interface HeroContentProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroContent = React.forwardRef<HTMLDivElement, HeroContentProps>(
  ({ children, className, ...props }, ref) => {
    const { align, split } = useHeroContext();

    // Check if there's a HeroImage with position left/right in children
    // We check for the position prop since HeroImage might not be defined yet
    const hasSplitImage = React.Children.toArray(children).some((child) => {
      if (!React.isValidElement(child)) return false;
      const props = child.props as { position?: string };
      return props.position === "left" || props.position === "right";
    });

    const isSplitLayout = split && hasSplitImage;

    // Separate text content from image for split layout
    const textChildren: React.ReactNode[] = [];
    const imageChildren: React.ReactNode[] = [];
    let imagePosition: "left" | "right" | null = null;

    if (isSplitLayout) {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const props = child.props as { position?: string };
          if (props.position === "left" || props.position === "right") {
            imageChildren.push(child);
            imagePosition = props.position as "left" | "right";
          } else {
            textChildren.push(child);
          }
        } else {
          textChildren.push(child);
        }
      });
    }

    return (
      <div
        ref={ref}
        className={cn(
          isSplitLayout
            ? "flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-12 w-full"
            : "flex flex-col gap-10 md:gap-12 max-w-5xl",
          !isSplitLayout && contentVariants({ align }),
          className,
        )}
        {...props}
      >
        {isSplitLayout ? (
          <>
            {imagePosition === "left" ? (
              <>
                {imageChildren}
                <div className="flex flex-col gap-6 lg:gap-8 lg:w-1/2 justify-center">
                  {textChildren}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-6 lg:gap-8 lg:w-1/2 justify-center">
                  {textChildren}
                </div>
                {imageChildren}
              </>
            )}
          </>
        ) : (
          children
        )}
      </div>
    );
  },
);
HeroContent.displayName = "HeroContent";

export interface HeroHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const HeroHeading = React.forwardRef<
  HTMLHeadingElement,
  HeroHeadingProps
>(({ children, className }) => {
  const { textColor, align, getAnimationProps } = useHeroContext();

  // Check if children contain gradient text pattern
  const hasGradientText =
    typeof children === "string" && children.includes("bg-gradient");

  const content = (
    <Typography
      variant="h1"
      className={cn(
        "font-bold tracking-tight text-white",
        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
        !hasGradientText && textColor,
        className,
      )}
      align={align}
    >
      {children}
    </Typography>
  );

  return <motion.div {...getAnimationProps(0)}>{content}</motion.div>;
});
HeroHeading.displayName = "HeroHeading";

export interface HeroSubheadingProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroSubheading = React.forwardRef<
  HTMLParagraphElement,
  HeroSubheadingProps
>(({ children, className }) => {
  const { subheadingColor, align, getAnimationProps } = useHeroContext();

  const content = (
    <Typography
      variant="lead"
      className={cn(
        "text-lg sm:text-xl md:text-2xl m-2",
        subheadingColor,
        align === "center" && "max-w-2xl mx-auto",
        align === "left" && "max-w-2xl",
        align === "right" && "max-w-2xl ml-auto",
        className,
      )}
      align={align}
    >
      {children}
    </Typography>
  );

  return <motion.div {...getAnimationProps(0.1)}>{content}</motion.div>;
});
HeroSubheading.displayName = "HeroSubheading";

export interface HeroImageProps {
  src: string;
  alt?: string;
  position?: "left" | "right" | "center" | "background";
  overlayOpacity?: number;
  className?: string;
}

export const HeroImage = React.forwardRef<HTMLImageElement, HeroImageProps>(
  (
    {
      src,
      alt = "background Image",
      position = "background",
      overlayOpacity = 40,
      className,
      ...props
    },
    ref,
  ) => {
    const { split } = useHeroContext();
    const isSplitLayout = split;

    if (position === "background") {
      const overlayOpacityClass =
        overlayOpacity === 0
          ? "bg-transparent"
          : overlayOpacity <= 10
            ? "bg-black/10"
            : overlayOpacity <= 20
              ? "bg-black/20"
              : overlayOpacity <= 30
                ? "bg-black/30"
                : overlayOpacity <= 40
                  ? "bg-black/40"
                  : overlayOpacity <= 50
                    ? "bg-black/50"
                    : overlayOpacity <= 60
                      ? "bg-black/60"
                      : overlayOpacity <= 70
                        ? "bg-black/70"
                        : overlayOpacity <= 80
                          ? "bg-black/80"
                          : overlayOpacity <= 90
                            ? "bg-black/90"
                            : "bg-black";

      return (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${src})`,
            }}
          />
          <div className={cn("absolute inset-0 z-1", overlayOpacityClass)} />
        </>
      );
    }

    return (
      <div
        className={cn(
          "relative z-10",
          isSplitLayout && position === "left" && "order-1 lg:order-1",
          isSplitLayout && position === "right" && "order-2 lg:order-2",
          !isSplitLayout && position === "left" && "order-1",
          !isSplitLayout && position === "right" && "order-2",
          position === "center" && "w-full",
          isSplitLayout &&
            (position === "left" || position === "right") &&
            "lg:w-1/2 flex",
        )}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn(
            "rounded-lg shadow-2xl",
            isSplitLayout && (position === "left" || position === "right")
              ? "w-full h-full object-cover"
              : "object-cover",
            !isSplitLayout && (position === "left" || position === "right")
              ? "w-full max-w-md lg:max-w-lg"
              : "",
            position === "center" && "w-full max-w-2xl mx-auto",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
HeroImage.displayName = "HeroImage";

export interface HeroActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroActions = React.forwardRef<HTMLDivElement, HeroActionsProps>(
  ({ children, className, ...props }, ref) => {
    const { align } = useHeroContext();

    const content = (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-4 mt-3",
          align === "center" && "justify-center",
          align === "left" && "justify-start",
          align === "right" && "justify-end",
          className,
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          return (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    );
    return <>{content}</>;
  },
);
HeroActions.displayName = "HeroActions";

/* -------------------------------------------------------------------------- */
/*                            ADVANCED SUB-COMPONENTS                         */
/* -------------------------------------------------------------------------- */

export interface HeroBadgeProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "glass" | "solid" | "outline";
  className?: string;
}

export const HeroBadge = React.forwardRef<HTMLDivElement, HeroBadgeProps>(
  ({ children, icon: Icon, variant = "default", className, ...props }, ref) => {
    const { getAnimationProps, align } = useHeroContext();
    const isLightVariant = useHeroContext().isLightVariant;

    const alignmentClasses = {
      center: "justify-center",
      left: "justify-start",
      right: "justify-end",
    };

    const variantClasses = {
      default: "bg-white/10 backdrop-blur-sm border border-white/20",
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      solid: isLightVariant
        ? "bg-gray-900 text-white"
        : "bg-white/20 text-white",
      outline: isLightVariant
        ? "border-gray-300 text-gray-700"
        : "border-white/30 text-white",
    };

    const content = (
      <div className={cn("flex mb-8", alignmentClasses[align])}>
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider",
            variantClasses[variant],
            className,
          )}
          {...props}
        >
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </div>
      </div>
    );

    return <motion.div {...getAnimationProps(0)}>{content}</motion.div>;
  },
);
HeroBadge.displayName = "HeroBadge";

export interface HeroFeaturesProps {
  features: string[];
  variant?: "default" | "glass";
  className?: string;
}

export const HeroFeatures = React.forwardRef<HTMLDivElement, HeroFeaturesProps>(
  ({ features, variant = "default", className, ...props }, ref) => {
    const { getAnimationProps, isLightVariant, align } = useHeroContext();

    const alignmentClasses = {
      center: "justify-center",
      left: "justify-start",
      right: "justify-end",
    };

    const variantClasses = {
      default: isLightVariant
        ? "px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700"
        : "px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white",
      glass:
        "px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white",
    };

    const content = (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap justify-center gap-3 mt-8",
          alignmentClasses[align],
          className,
        )}
        {...props}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={cn("text-sm font-medium", variantClasses[variant])}
          >
            {feature}
          </div>
        ))}
      </div>
    );

    return <motion.div {...getAnimationProps(0.3)}>{content}</motion.div>;
  },
);
HeroFeatures.displayName = "HeroFeatures";

export interface HeroGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroGlassCard = React.forwardRef<
  HTMLDivElement,
  HeroGlassCardProps
>(({ children, className, ...props }, ref) => {
  const { getAnimationProps } = useHeroContext();

  const content = (
    <div
      ref={ref}
      className={cn(
        "backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );

  return <motion.div {...getAnimationProps(0)}>{content}</motion.div>;
});
HeroGlassCard.displayName = "HeroGlassCard";

export interface StatItem {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export interface HeroStatsProps {
  stats: StatItem[];
  variant?: "default" | "cards" | "minimal";
  columns?: 2 | 3 | 4;
  className?: string;
}

export const HeroStats = React.forwardRef<HTMLDivElement, HeroStatsProps>(
  ({ stats, variant = "default", columns = 4, className, ...props }, ref) => {
    const { getAnimationProps, textColor, subheadingColor } = useHeroContext();
    const isLightVariant = useHeroContext().isLightVariant;

    const gridCols = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-2 md:grid-cols-4",
    };

    const variantClasses = {
      default: "",
      cards: isLightVariant
        ? "p-6 rounded-xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-300 group"
        : "p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group",
      minimal: "",
    };

    const content = (
      <div
        ref={ref}
        className={cn("grid gap-6 md:gap-8", gridCols[columns], className)}
        {...props}
      >
        {stats.map((stat, idx) => (
          <div key={idx} className={cn(variantClasses[variant])}>
            {stat.icon && variant === "cards" && (
              <stat.icon
                className={cn(
                  "w-6 h-6 mb-3 text-gray-300",
                  isLightVariant && "text-gray-600",
                  "group-hover:scale-110 transition-transform",
                )}
              />
            )}
            <Typography
              variant="h2"
              className={cn("text-3xl md:text-4xl font-bold mb-1", textColor)}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="small"
              className={cn(
                "uppercase tracking-wider text-xs",
                subheadingColor,
              )}
            >
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>
    );

    return <motion.div {...getAnimationProps(0.2)}>{content}</motion.div>;
  },
);
HeroStats.displayName = "HeroStats";

/* -------------------------------------------------------------------------- */
/*                                MAIN HERO COMPONENT                         */
/* -------------------------------------------------------------------------- */

/**
 * Hero Section Component
 * A flexible hero section using composition pattern.
 */
export const Hero: React.FC<HeroProps> = ({
  children,
  variant = "dark",
  backgroundClassName,
  align = "center",
  containerSize = "full",
  animationType = "slideUp",
  split,
  className,
}) => {
  const isLightVariant = variant === "default";
  const textColor = isLightVariant ? "text-gray-900" : "text-white";
  const subheadingColor = isLightVariant ? "text-gray-700" : "text-gray-100";

  // Get animation props based on animationType
  const getAnimationProps = React.useCallback(
    (delay = 0): Pick<AnimationProps, "initial" | "animate" | "transition"> => {
      const animation = heroAnimations[animationType];
      return {
        ...animation,
        transition: {
          ...animation.transition,
          delay,
        },
      } as Pick<AnimationProps, "initial" | "animate" | "transition">;
    },
    [animationType],
  );

  const contextValue = React.useMemo<HeroContextValue>(
    () => ({
      variant,
      align,
      animationType,
      isLightVariant,
      textColor,
      subheadingColor,
      split,
      getAnimationProps,
    }),
    [
      variant,
      align,
      animationType,
      isLightVariant,
      textColor,
      subheadingColor,
      split,
      getAnimationProps,
    ],
  );

  // Separate background images from other children
  const backgroundImages: React.ReactNode[] = [];
  const otherChildren: React.ReactNode[] = [];

  function isHeroImage(
    child: React.ReactNode,
  ): child is React.ReactElement<HeroImageProps> {
    return React.isValidElement(child) && child.type === HeroImage;
  }

  React.Children.forEach(children, (child) => {
    if (isHeroImage(child)) {
      backgroundImages.push(child);
    } else {
      otherChildren.push(child);
    }
  });

  const hasBackgroundImage = backgroundImages.length > 0;

  return (
    <HeroContext.Provider value={contextValue}>
      <section
        className={cn(
          "relative w-full overflow-hidden flex items-center justify-center min-h-125 md:min-h-150 lg:min-h-175",
          !backgroundClassName && heroVariants({ variant }),
          backgroundClassName,
          className,
        )}
      >
        {/* Render static background images */}
        {backgroundImages}

        <Container
          size={containerSize}
          className={cn(
            "relative",
            "z-10 py-12 md:py-10 lg:py-20",
            hasBackgroundImage && "py-16 md:py-20 lg:py-32",
          )}
        >
          {otherChildren}
        </Container>
      </section>
    </HeroContext.Provider>
  );
};

Hero.displayName = "Hero";

export default Hero;
