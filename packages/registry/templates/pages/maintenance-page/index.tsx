// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePage Component - Composable Maintenance Page with Sub-components
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type LucideIcon, CheckCircle, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { z } from "zod";
import { cn } from "../../../utils/cn";
import { Button } from "@ignix-ui/button";
import { Typography } from "@ignix-ui/typography";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface MaintenancePageProps extends MaintenancePageClassProps, VariantProps<typeof containerVariants> {
  /** Custom background image URL */
  backgroundImage?: string;
  /** Icon to display throughout the page with continuous motion */
  icon?: LucideIcon;
  /** Custom color class for the icon (e.g., "text-blue-500", "text-white"). Defaults to white when backgroundImage is present */
  iconColor?: string;
  /** Split layout: left side (logo, heading, icon, description) and right side (countdown) */
  split?: boolean;
}

export interface MaintenancePageClassProps {
  children?: React.ReactNode;
  className?: string;
}

export interface MaintenancePageHeadingProps extends MaintenancePageClassProps {
  /** Main maintenance title */
  title?: string;
}

export interface MaintenancePageDescProps extends MaintenancePageClassProps {
  /** Maintenance description message */
  description?: string;
}

export interface MaintenancePageCountdownProps extends MaintenancePageClassProps{
  /** Target date/time for countdown (Date object or ISO string) */
  targetDate?: Date | string;
  /** Callback when countdown reaches zero */
  onCountdownEnd?: () => void;
  /** Animation type for countdown timer */
  animationType?: AnimationType;
}

export interface MaintenancePageEmailSubscriptionProps extends MaintenancePageClassProps {
  /** Email input placeholder */
  placeholder?: string;
  /** Button text */
  buttonText?: string;
  /** Callback when email is submitted */
  onSubmit?: (email: string) => void;
}

export interface MaintenancePageSocialIconsProps extends MaintenancePageClassProps {
  /** Array of social media icons and their links */
  icons?: Array<{ icon: LucideIcon; link: string }>;
}

export interface MaintenancePageLogoProps extends MaintenancePageClassProps {
  /** Logo image URL, React node, or LucideIcon component */
  logo?: React.ReactNode | string | LucideIcon;
  /** Company/Brand name */
  companyName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = cva("min-h-screen w-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-background via-muted/30 to-background",
        minimal: "bg-background",
        gradient: "bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10",
        dark: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Animation type definition
export type AnimationType = "fade" | "slide" | "scale" | "bounce" | "flip" | "none";

// Animation variants configuration - moved outside component for better performance
type AnimationVariantConfig = {
  initial: { opacity: number; y?: number; scale?: number; rotateX?: number };
  animate: { opacity: number; y?: number; scale?: number; rotateX?: number; transition?: { type?: "spring"; stiffness?: number; damping?: number; duration?: number } };
  exit: { opacity: number; y?: number; scale?: number; rotateX?: number };
  transition?: { duration?: number; type?: "spring"; stiffness?: number; damping?: number };
};

const ANIMATION_VARIANTS: Record<AnimationType, AnimationVariantConfig> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slide: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3, y: -50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.3, y: 50 },
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 15,
    },
  },
  flip: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 },
    transition: { duration: 0.4 },
  },
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },
};

// Email validation regex - moved outside component
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePage Context
// ─────────────────────────────────────────────────────────────────────────────

const MaintenancePageContext = React.createContext<{ 
  variant?: "default" | "minimal" | "gradient" | "dark";
  backgroundImage?: string;
  split?: boolean;
}>({
  variant: "default",
  backgroundImage: undefined,
  split: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// Main MaintenancePage Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePage: React.FC<MaintenancePageProps> = React.memo(({
  children,
  variant = "default",
  backgroundImage,
  className,
  icon: Icon,
  iconColor = "text-black",
  split = false,
}) => {
  const childrenArray = React.useMemo(() => React.Children.toArray(children), [children]);

  // Separate absolute positioned divs (backgrounds) from content
  const backgroundChildren = React.useMemo(() =>
    childrenArray.filter((child) => {
      if (React.isValidElement(child) && typeof child.type === 'string' && child.type === 'div') {
        const divElement = child as React.ReactElement<{ className?: string }>;
        return typeof divElement.props?.className === 'string' && divElement.props.className.includes('absolute');
      }
      return false;
    }),
    [childrenArray]
  );

  // Helper function to get component display name
  const getComponentName = React.useCallback((type: React.ElementType | string): string => {
    if (typeof type === 'string') return '';
    const component = type as React.ComponentType<unknown> & { displayName?: string; name?: string };
    return component.displayName || component.name || '';
  }, []);

  // Helper function to check nested children in div wrapper
  const checkNestedChildren = React.useCallback((children: React.ReactNode, componentName: string): boolean => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.some((nestedChild) => {
      if (!React.isValidElement(nestedChild)) return false;
      const nestedType = nestedChild.type;
      const nestedDisplayName = typeof nestedType !== 'string' 
        ? getComponentName(nestedType)
        : '';
      return nestedDisplayName === componentName;
    });
  }, [getComponentName]);

  // Helper function to check if a child matches a component type
  const matchesComponent = React.useCallback((child: React.ReactNode, componentName: string, ComponentType?: React.ComponentType) => {
    if (!React.isValidElement(child)) return false;
    const childType = child.type;
    const displayName = getComponentName(childType);
    
    if (displayName === componentName || childType === ComponentType) return true;
    
    // Check if wrapped in div
    if (typeof childType === 'string' && childType === 'div') {
      const props = child.props as { children?: React.ReactNode };
      return props.children ? checkNestedChildren(props.children, componentName) : false;
    }
    
    return false;
  }, [getComponentName, checkNestedChildren]);

  {/* // For split layout, separate components: Logo (top), Heading (left), Countdown (right), Desc (below split) */}
  const logoChildren = React.useMemo(() => {
    if (!split) return [];
    return childrenArray.filter((child) => matchesComponent(child, 'MaintenancePageLogo', MaintenancePageLogo));
  }, [childrenArray, split, matchesComponent]);

  const headingChildren = React.useMemo(() => {
    if (!split) return [];
    return childrenArray.filter((child) => matchesComponent(child, 'MaintenancePageHeading', MaintenancePageHeading));
  }, [childrenArray, split, matchesComponent]);

  const descriptionChildren = React.useMemo(() => {
    if (!split) return [];
    return childrenArray.filter((child) => matchesComponent(child, 'MaintenancePageDesc', MaintenancePageDesc));
  }, [childrenArray, split, matchesComponent]);

  const rightSectionChildren = React.useMemo(() => {
    if (!split) return [];
    return childrenArray.filter((child) => 
      matchesComponent(child, 'MaintenancePageCountdown', MaintenancePageCountdown)
    );
  }, [childrenArray, split, matchesComponent]);

  const bottomSectionChildren = React.useMemo(() => {
    if (!split) return [];
    return childrenArray.filter((child) =>
      matchesComponent(child, 'MaintenancePageEmailSubscription', MaintenancePageEmailSubscription) ||
      matchesComponent(child, 'MaintenancePageSocialIcons', MaintenancePageSocialIcons) ||
      matchesComponent(child, 'MaintenancePageFooter', MaintenancePageFooter)
    );
  }, [childrenArray, split, matchesComponent]);

  // For non-split layout, ensure Logo appears first, then other content
  const contentChildren = React.useMemo(() => {
    if (split) return [];

    const filtered = childrenArray.filter((child) => {
      if (!React.isValidElement(child)) return true;
      if (typeof child.type === 'string' && child.type === 'div') {
        const divElement = child as React.ReactElement<{ className?: string }>;
        return !(typeof divElement.props?.className === 'string' && divElement.props.className.includes('absolute'));
      }
      return true;
    });

    // Sort to ensure Logo appears first
    return filtered.sort((a, b) => {
      if (!React.isValidElement(a) || !React.isValidElement(b)) return 0;

      const getOrder = (child: React.ReactElement) => {
        const childType = child.type;
        const displayName = getComponentName(childType);
        if (displayName === 'MaintenancePageLogo' || childType === MaintenancePageLogo) return 0;
        return 1;
      };

      return getOrder(a) - getOrder(b);
    });
  }, [childrenArray, split, getComponentName]);

  const backgroundStyle = React.useMemo(() =>
    backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    } : undefined,
    [backgroundImage]
  );

  const contextValue = React.useMemo(() => ({
    variant: variant || "default",
    backgroundImage,
    split
  }), [variant, backgroundImage, split]);

  // Icon positions and sizes for continuous motion
  const iconInstances = React.useMemo(() => {
    if (!Icon) return [];
    return [
      { size: 32, positionClass: "top-[10%] left-[5%]", delay: 0, duration: 8 },
      { size: 24, positionClass: "top-[20%] right-[8%]", delay: 1, duration: 10 },
      { size: 20, positionClass: "top-[40%] left-[3%]", delay: 2, duration: 12 },
      { size: 32, positionClass: "bottom-[30%] right-[5%]", delay: 0.5, duration: 9 },
      { size: 18, positionClass: "bottom-[20%] left-[10%]", delay: 1.5, duration: 11 },
      { size: 28, positionClass: "top-[60%] right-[12%]", delay: 2.5, duration: 13 },
      { size: 22, positionClass: "bottom-[10%] right-[15%]", delay: 3, duration: 10 },
      { size: 26, positionClass: "top-[80%] left-[7%]", delay: 1.2, duration: 14 },
    ];
  }, [Icon]);

  return (
    <MaintenancePageContext.Provider value={contextValue}>
      <motion.div
        className={cn(containerVariants({ variant }), className, "relative overflow-hidden")}
        role="main"
        aria-label="Maintenance page"
        style={backgroundStyle}
      >
        {/* Background overlay for better text readability when background image is present */}
        {backgroundImage && (<div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />)}

        {/* Animated icons throughout the page */}
        {Icon && iconInstances.map((instance, index) => {
          const iconColorClass = iconColor ? iconColor : (backgroundImage ? "text-white" : "");
          const opacityRange = iconColor ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1];

          return (
            <motion.div
              key={index}
              className={cn("absolute pointer-events-none z-0", instance.positionClass, iconColorClass)}
              animate={{
                rotate: [0, 360],
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
                opacity: opacityRange,
              }}
              transition={{
                rotate: {
                  duration: instance.duration,
                  repeat: Infinity,
                  ease: "linear",
                },
                y: {
                  duration: instance.duration * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: instance.delay,
                },
                scale: {
                  duration: instance.duration * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: instance.delay,
                },
                opacity: {
                  duration: instance.duration * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: instance.delay,
                },
              }}
            >
              <Icon size={instance.size}/>
            </motion.div>
          );
        })}

        {/* Render absolute positioned background elements */}
        {backgroundChildren}

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-7 relative z-10">
          {split ? (
            <motion.div
              className="flex flex-col gap-8 lg:gap-12"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Logo at Top */}
              {logoChildren.length > 0 && (
                <div className="flex items-center justify-center w-full">
                  {logoChildren.map((child, index) => {
                    if (!React.isValidElement(child)) return <React.Fragment key={index}>{child}</React.Fragment>;
                    return <React.Fragment key={index}>{child}</React.Fragment>;
                  })}
                </div>
              )}

              {/* Split Layout: Heading + Description (Left) and Countdown (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-7 items-start">
                {/* Left Section: Heading and Description */}
                <div className="flex flex-col gap-6 lg:gap-8 items-start">
                  {headingChildren.map((child, index) => {
                    if (!React.isValidElement(child)) return <React.Fragment key={index}>{child}</React.Fragment>;
                    return <React.Fragment key={index}>{child}</React.Fragment>;
                  })}
                  {descriptionChildren.map((child, index) => {
                    if (!React.isValidElement(child)) return <React.Fragment key={index}>{child}</React.Fragment>;
                    return <React.Fragment key={index}>{child}</React.Fragment>;
                  })}
                </div>

                {/* Right Section: Countdown with vertical divider */}
                <div className={cn(
                  "flex flex-col items-start lg:items-start lg:pl-8 lg:border-l",
                  variant === "dark" || backgroundImage 
                    ? "lg:border-white/20" 
                    : "lg:border-border"
                )}>
                  {rightSectionChildren}
                </div>
              </div>

              {/* Bottom Section: Email Subscription, Social Icons, Footer */}
              <div className="flex flex-col items-center justify-center gap-6 w-full">
                {bottomSectionChildren}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center gap-8 lg:gap-2"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {contentChildren}
            </motion.div>
          )}
        </div>
      </motion.div>
    </MaintenancePageContext.Provider>
  );
});

MaintenancePage.displayName = "MaintenancePage";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePageLogo Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePageLogo: React.FC<MaintenancePageLogoProps> = React.memo(({
  logo,
  companyName,
  children,
  className,
}) => {
  const { variant, backgroundImage } = React.useContext(MaintenancePageContext);
  const isDark = variant === "dark";
  const hasBackgroundImage = !!backgroundImage;

  const alignmentClass = "items-center text-center";

  const companyTextClass = React.useMemo(
    () => (isDark || hasBackgroundImage ? "text-white" : "text-foreground"),
    [isDark, hasBackgroundImage]
  );

  const logoWrapperBgClass = React.useMemo(
    () =>
      isDark || hasBackgroundImage
        ? "bg-white/10 border-white/20"
        : "bg-primary/10 border-primary/20",
    [isDark, hasBackgroundImage]
  );

  const logoIconColorClass = React.useMemo(
    () => (isDark || hasBackgroundImage ? "text-white" : "text-primary"),
    [isDark, hasBackgroundImage]
  );

  const renderLogo = () => {
    if (!logo) return null;

    // If a string is passed, treat it as an image URL
    if (typeof logo === "string") {
      return (
        <div
          className={cn(
            "w-16 h-16 flex items-center justify-center overflow-hidden",
          )}
        >
          <img src={logo} alt={companyName || "Logo"} className="w-full h-full object-cover" />
        </div>
      );
    }

    // If a React node is passed, render it directly
    if (React.isValidElement(logo)) {
      return logo;
    }

    // Otherwise, assume it's a LucideIcon component
    const IconComponent = logo as LucideIcon;
    return (
      <div
        className={cn(
          "w-14 h-14 rounded-xl border flex items-center justify-center",
          logoWrapperBgClass,
          logoIconColorClass
        )}
      >
        <IconComponent size={28} />
      </div>
    );
  };

  // Allow complete custom content if children are provided
  if (children) {
    return (
      <div className={cn("flex flex-col gap-2 mb-6 font-bold", alignmentClass, className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-row gap-2 mb-6", alignmentClass, className)}>
      {renderLogo()}

      {companyName && (
        <div className={cn("mt-2 text-center")}>
          <Typography
            variant="h4"
            className={cn("font-semibold tracking-wide uppercase", companyTextClass)}
          >
            {companyName}
          </Typography>
        </div>
      )}
    </div>
  );
});

MaintenancePageLogo.displayName = "MaintenancePageLogo";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePageHeading Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePageHeading: React.FC<MaintenancePageHeadingProps> = React.memo(({
  title,
  children,
  className,
}) => {
  const { variant, backgroundImage, split } = React.useContext(MaintenancePageContext);
  const isDark = variant === "dark" ;
  const hasBackgroundImage = !!backgroundImage;
  const textColorClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-white" : "text-primary",
    [isDark, hasBackgroundImage]
  );

  const alignmentClass = split ? "text-left" : "text-center";

  if (children) {
    return (
      <div>
        <Typography variant="h1" className={cn("text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 uppercase tracking-wide", alignmentClass, textColorClass, className)}>
          {children}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h1" className={cn("text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 uppercase tracking-wide", alignmentClass, textColorClass, className)}>
        {title || "SITE UNDER MAINTENANCE"}
      </Typography>
    </div>
  );
});

MaintenancePageHeading.displayName = "MaintenancePageHeading";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePageDesc Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePageDesc: React.FC<MaintenancePageDescProps> = React.memo(({
  description,
  children,
  className,
}) => {
  const { variant, backgroundImage, split } = React.useContext(MaintenancePageContext);
  const isDark = variant === "dark" ;
  const hasBackgroundImage = !!backgroundImage;
  const textColorClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-white" : "text-muted-foreground",
    [isDark, hasBackgroundImage]
  );

  const alignmentClass = split ? "text-left" : "text-center";
  const maxWidthClass = split ? "max-w-none" : "max-w-2xl";

  if (children) {
    return (
      <div>
        <Typography
          variant="body-large"
          className={cn(
            "mb-8 leading-relaxed",
            alignmentClass,
            maxWidthClass,
            textColorClass,
            className
          )}
        >
          {children}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="body-large" className={cn("mb-8 leading-relaxed", alignmentClass, maxWidthClass, textColorClass, className)}>
        {description || "Sorry for the inconvenience. To improve our services, we have momentarily shutdown our site."}
      </Typography>
    </div>
  );
});

MaintenancePageDesc.displayName = "MaintenancePageDesc";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePageCountdown Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePageCountdown: React.FC<MaintenancePageCountdownProps> = React.memo(({
  targetDate,
  onCountdownEnd,
  className,
  animationType = "fade",
}) => {
  const { variant, backgroundImage, split } = React.useContext(MaintenancePageContext);
  const isDark = variant === "dark";
  const hasBackgroundImage = !!backgroundImage;

  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    if (!targetDate) {
      // Default: 30 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      const target = new Date(defaultDate).getTime();

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = target - now;

        if (distance < 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          onCountdownEnd?.();
          clearInterval(timer);
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }

    const target = typeof targetDate === 'string' ? new Date(targetDate).getTime() : targetDate.getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onCountdownEnd?.();
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onCountdownEnd]);

  const borderColorClass = React.useMemo(() =>
    isDark || hasBackgroundImage ? "border-white/30" : "border-border",
    [isDark, hasBackgroundImage]
  );

  const bgColorClass = React.useMemo(() =>
    isDark || hasBackgroundImage ? "bg-white/10 backdrop-blur-sm" : "bg-background/90 backdrop-blur-sm",
    [isDark, hasBackgroundImage]
  );

  const textColorClass = React.useMemo(() =>
    isDark || hasBackgroundImage ? "text-white" : "text-foreground",
    [isDark, hasBackgroundImage]
  );

  const labelColorClass = React.useMemo(() =>
    isDark || hasBackgroundImage ? "text-white/80" : "text-muted-foreground",
    [isDark, hasBackgroundImage]
  );

  const containerClass = split ? "w-full" : "w-full max-w-4xl";

  // For split layout, use white boxes with rounded corners
  const countdownBoxClass = React.useMemo(() => {
    if (split && (isDark || hasBackgroundImage)) {
      return cn(bgColorClass, borderColorClass);
    }
    return cn("rounded-lg border", bgColorClass, borderColorClass);
  }, [split, isDark, hasBackgroundImage, bgColorClass, borderColorClass]);

  const countdownTextClass = React.useMemo(() => {
    return textColorClass;
  }, [split, isDark, hasBackgroundImage, textColorClass]);

  const countdownLabelClass = React.useMemo(() => {
    return labelColorClass;
  }, [split, isDark, hasBackgroundImage, labelColorClass]);

  // Get animation variants - use static object for better performance
  const animationVariants = React.useMemo(() => {
    const type: AnimationType = (animationType || "fade") as AnimationType;
    return ANIMATION_VARIANTS[type] || ANIMATION_VARIANTS.fade;
  }, [animationType]);

  // Helper component to render animated countdown value
  const AnimatedValue = React.useCallback(({ value, label }: { value: number; label: string }) => {
    const displayValue = String(value).padStart(2, '0');
    const key = `${label}-${value}`;

    return (
      <motion.div
        key={key}
        className={cn("flex flex-col items-center justify-center p-6 rounded-lg border", countdownBoxClass)}
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        exit={animationVariants.exit}
        transition={animationVariants.transition}
      >
        <Typography variant="body-small" className={cn("uppercase mb-2 text-xs font-semibold", countdownLabelClass)}>
          {label}
        </Typography>
        <Typography variant="h2" className={cn("text-4xl sm:text-5xl lg:text-6xl font-bold", countdownTextClass)}>
          {displayValue}
        </Typography>
      </motion.div>
    );
  }, [countdownBoxClass, countdownLabelClass, countdownTextClass, animationVariants]);

  return (
    <div className={cn(containerClass, "mb-8", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatePresence mode="wait" key={`days-${timeLeft.days}`}>
          <AnimatedValue value={timeLeft.days} label="Days" />
        </AnimatePresence>
        <AnimatePresence mode="wait" key={`hours-${timeLeft.hours}`}>
          <AnimatedValue value={timeLeft.hours} label="Hours" />
        </AnimatePresence>
        <AnimatePresence mode="wait" key={`minutes-${timeLeft.minutes}`}>
          <AnimatedValue value={timeLeft.minutes} label="Minutes" />
        </AnimatePresence>
        <AnimatePresence mode="wait" key={`seconds-${timeLeft.seconds}`}>
          <AnimatedValue value={timeLeft.seconds} label="Seconds" />
        </AnimatePresence>
      </div>
    </div>
  );
});

MaintenancePageCountdown.displayName = "MaintenancePageCountdown";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePageEmailSubscription Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePageEmailSubscription: React.FC<MaintenancePageEmailSubscriptionProps> = React.memo(({
  placeholder = "Enter your email address",
  buttonText = "Get Notified!",
  onSubmit,
  className,
}) => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const { variant, backgroundImage, split } = React.useContext(MaintenancePageContext);
  const isDark = variant === "dark" ;
  const hasBackgroundImage = !!backgroundImage;

  // Zod validation schema for email validation (uses EMAIL_REGEX constant)
  const emailSchema = React.useMemo(() => 
    z
      .string()
      .min(1, "Email is required")
      .refine((val) => EMAIL_REGEX.test(val.trim()), {
        message: "Please enter a valid email address",
      }),
    []
  );

  const validateEmail = React.useCallback((emailValue: string): boolean => {
    const result = emailSchema.safeParse(emailValue.trim());
    
    if (!result.success) {
      const zodError = result.error.issues[0]?.message || "Please enter a valid email address";
      setError(zodError);
      return false;
    }
    
    setError("");
    return true;
  }, [emailSchema]);

  const handleEmailChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear success message when user starts typing
    if (success) {
      setSuccess(false);
    }
    
    // Real-time validation as user types
    if (value.trim()) {
      const zodResult = emailSchema.safeParse(value.trim());
      if (!zodResult.success) {
        const zodError = zodResult.error.issues[0]?.message || "Please enter a valid email address";
        setError(zodError);
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  }, [success, emailSchema]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onSubmit?.(email.trim());
      setEmail("");
      setSuccess(true);
      setError("");
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
  }, [email, onSubmit, validateEmail]);
  
  // For split layout, use light grey input and dark grey button
  const inputBgClass = React.useMemo(() => {
    if (split && (isDark || hasBackgroundImage)) {
      return "bg-gray-200 border-gray-300";
    }
    return isDark || hasBackgroundImage 
      ? "bg-white/10 backdrop-blur-sm border-white/30" 
      : "bg-background/90 backdrop-blur-sm border-border";
  }, [isDark, hasBackgroundImage, split]);

  const inputTextClass = React.useMemo(() => {
    if (split && (isDark || hasBackgroundImage)) {
      return "text-slate-800 placeholder:text-slate-500";
    }
    return isDark || hasBackgroundImage 
      ? "text-white placeholder:text-white/60" 
      : "text-foreground placeholder:text-muted-foreground";
  }, [isDark, hasBackgroundImage, split]);

  const buttonBgClass = React.useMemo(() => {
    if (split && (isDark || hasBackgroundImage)) {
      return "bg-slate-700 hover:bg-slate-800";
    }
    return isDark || hasBackgroundImage 
      ? "bg-blue-600 hover:bg-blue-700" 
      : "bg-primary hover:bg-primary/90";
  }, [isDark, hasBackgroundImage, split]);

  const errorBorderClass = React.useMemo(() => {
    if (error) {
      return "border-red-500 focus:border-red-500 focus:ring-red-500/20";
    }
    return "";
  }, [error]);

  const successBorderClass = React.useMemo(() => {
    if (success) {
      return "border-green-500 focus:border-green-500 focus:ring-green-500/20";
    }
    return "";
  }, [success]);

  const errorTextClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-red-300" : "text-red-600",
    [isDark, hasBackgroundImage]
  );

  const successTextClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-green-300" : "text-green-600",
    [isDark, hasBackgroundImage]
  );
  
  return (
    <div className={cn("w-full mb-8", split ? "max-w-2xl mx-auto" : "max-w-md mx-auto", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={placeholder}
              className={cn(
                "flex-1 w-full h-16 sm:h-12 px-5 sm:px-4 py-4 sm:py-0 rounded-lg border focus:outline-none focus:ring-2 transition-all text-base sm:text-sm",
                inputBgClass,
                inputTextClass,
                errorBorderClass,
                successBorderClass,
                !error && !success && "focus:ring-primary/20"
              )}
            />
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XCircle className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </div>
          <Button
            type="submit"
            className={cn("h-16 sm:h-12 px-6 sm:px-6 py-4 sm:py-0 text-white font-medium whitespace-nowrap text-base sm:text-sm", buttonBgClass)}
          >
            {buttonText}
          </Button>
        </div>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn("flex items-center gap-2 text-sm", errorTextClass)}
            >
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn("flex items-center gap-2 text-sm", successTextClass)}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Thank you! We'll notify you when we're back online.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
});

MaintenancePageEmailSubscription.displayName = "MaintenancePageEmailSubscription";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePageSocialIcons Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePageSocialIcons: React.FC<MaintenancePageSocialIconsProps> = React.memo(({
  icons,
  className,
}) => {
  const { variant, backgroundImage, split } = React.useContext(MaintenancePageContext);
  const isDark = variant === "dark" ;
  const hasBackgroundImage = !!backgroundImage;

  // Icons are always passed from stories, use them directly
  const linksToRender = icons || [];
  
  // For split layout with background, use white icons with dark symbols
  const iconBgClass = React.useMemo(() => {
    if (split && (isDark || hasBackgroundImage)) {
      return "bg-white border-white hover:bg-white/90";
    }
    return isDark || hasBackgroundImage 
      ? "bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20" 
      : "bg-background/90 backdrop-blur-sm border-border hover:bg-background";
  }, [isDark, hasBackgroundImage, split]);

  const iconColorClass = React.useMemo(() => {
    if (split && (isDark || hasBackgroundImage)) {
      return "text-slate-800"; // Dark symbols on white background
    }
    return isDark || hasBackgroundImage ? "text-white" : "text-muted-foreground";
  }, [isDark, hasBackgroundImage, split]);

  if (linksToRender.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex gap-4 justify-center mb-8 w-full", className)}>
      {linksToRender.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110",
              iconBgClass,
              iconColorClass
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconComponent size={20} />
          </motion.a>
        );
      })}
    </div>
  );
});

MaintenancePageSocialIcons.displayName = "MaintenancePageSocialIcons";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenancePageFooter Component
// ─────────────────────────────────────────────────────────────────────────────

export const MaintenancePageFooter: React.FC<MaintenancePageClassProps> = React.memo(({
  children,
  className,
}) => {
  const { variant, backgroundImage } = React.useContext(MaintenancePageContext);
  const isDark = variant === "dark" ;
  const hasBackgroundImage = !!backgroundImage;
  
  const textColorClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-white/70" : "text-muted-foreground",
    [isDark, hasBackgroundImage]
  );
  
  return (
    <div className={cn("text-sm text-center w-full", textColorClass, className)}>
      {children}
    </div>
  );

});

MaintenancePageFooter.displayName = "MaintenancePageFooter";