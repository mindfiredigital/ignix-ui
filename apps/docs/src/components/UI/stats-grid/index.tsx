"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@site/src/utils/cn";

/* ============================================
   TYPES & INTERFACES
============================================ */

export type StatAccent = "default" | "emerald" | "amber" | "rose" | "violet" | "blue" | "purple" | "pink" | "indigo" | "cyan" | "orange" | "yellow" | "teal" | "red" | "green";
export type NumberFormat = "raw" | "compact" | "currency" | "percentage";
export type AnimationType = "fade" | "slide" | "scale" | "none";

export interface StatItem {
    id?: string;
    value: number;
    label: string;
    subtext?: string;
    icon?: LucideIcon;
    format?: NumberFormat;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    accent?: StatAccent;
}

export interface StatsGridProps extends VariantProps<typeof statsGridVariants> {
    // Layout & Variants
    variant?: "default" | "dark" | "light";
    columns?: 2 | 3 | 4 | 5 | 6;
    contentAlign?: "left" | "center" | "right";

    // Animation
    animated?: boolean;
    animationDelay?: number;
    animationType?: AnimationType;
    staggerDelay?: number;

    // Spacing
    padding?: "sm" | "md" | "lg" | "xl" | "2xl";
    gap?: "sm" | "md" | "lg" | "xl";
    containerSize?: "small" | "normal" | "large" | "full" | "readable";

    // Custom Colors (for the customizable demo)
    bgColor?: string;
    textColor?: string;
    cardBgColor?: string;
    cardBorderColor?: string;
    cardBorderWidth?: string;
    iconBgColor?: string;
    iconColor?: string;

    // Content
    title?: string;
    description?: string;
    stats?: StatItem[];

    // Accessibility
    ariaLabel?: string;
    role?: string;

    // Children (for compound components)
    children?: React.ReactNode;
}

interface StatsGridContextType {
    variant: string;
    columns: number;
    contentAlign: "left" | "center" | "right";
    theme: "light" | "dark";
    animated: boolean;
    animationType: AnimationType;
    animationDelay: number;
    staggerDelay: number;
    gap: "sm" | "md" | "lg" | "xl";
    isVisible: boolean;
    // Custom color props passed through context
    customBgColor?: string;
    customTextColor?: string;
    customCardBgColor?: string;
    customCardBorderColor?: string;
    customCardBorderWidth?: string;
    customIconBgColor?: string;
    customIconColor?: string;
}

const StatsGridContext = React.createContext<StatsGridContextType | undefined>(undefined);

const useStatsGrid = () => {
    const context = React.useContext(StatsGridContext);
    if (!context) {
        throw new Error("StatsGrid components must be used within StatsGrid");
    }
    return context;
};

/* ============================================
   VARIANTS
============================================ */

const statsGridVariants = cva("w-full transition-all duration-300", {
    variants: {
        variant: {
            default: "bg-white text-gray-900",
            dark: "bg-gray-950 text-white", // Solid dark, no gradient
            light: "bg-gray-50 text-gray-900",
        },
        padding: {
            sm: "py-8 md:py-12",
            md: "py-12 md:py-16",
            lg: "py-16 md:py-20",
            xl: "py-20 md:py-24",
            '2xl': "py-24 md:py-32",
        },
    },
    defaultVariants: {
        variant: "default",
        padding: "lg",
    },
});

const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8", {
    variants: {
        size: {
            small: "max-w-3xl",
            normal: "max-w-5xl",
            large: "max-w-7xl",
            full: "max-w-full",
            readable: "max-w-prose",
        },
    },
    defaultVariants: {
        size: "normal",
    },
});

const gapClasses: Record<string, string> = {
    sm: "gap-3 sm:gap-4 lg:gap-5",
    md: "gap-4 sm:gap-5 lg:gap-6",
    lg: "gap-5 sm:gap-6 lg:gap-8",
    xl: "gap-6 sm:gap-7 lg:gap-10",
};

const columnClasses: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

/* ============================================
   VIBRANT ACCENT COLOR STYLES
============================================ */

const vibrantAccentStyles: Record<StatAccent, { iconBg: string; iconFg: string; lightBg: string; darkBg: string }> = {
    default: {
        iconBg: "bg-primary-500",
        iconFg: "text-white",
        lightBg: "bg-primary-100",
        darkBg: "bg-primary-900/40"
    },
    blue: {
        iconBg: "bg-blue-500",
        iconFg: "text-white",
        lightBg: "bg-blue-100",
        darkBg: "bg-blue-900/40"
    },
    emerald: {
        iconBg: "bg-emerald-500",
        iconFg: "text-white",
        lightBg: "bg-emerald-100",
        darkBg: "bg-emerald-900/40"
    },
    amber: {
        iconBg: "bg-amber-500",
        iconFg: "text-white",
        lightBg: "bg-amber-100",
        darkBg: "bg-amber-900/40"
    },
    rose: {
        iconBg: "bg-rose-500",
        iconFg: "text-white",
        lightBg: "bg-rose-100",
        darkBg: "bg-rose-900/40"
    },
    violet: {
        iconBg: "bg-violet-500",
        iconFg: "text-white",
        lightBg: "bg-violet-100",
        darkBg: "bg-violet-900/40"
    },
    purple: {
        iconBg: "bg-purple-500",
        iconFg: "text-white",
        lightBg: "bg-purple-100",
        darkBg: "bg-purple-900/40"
    },
    pink: {
        iconBg: "bg-pink-500",
        iconFg: "text-white",
        lightBg: "bg-pink-100",
        darkBg: "bg-pink-900/40"
    },
    indigo: {
        iconBg: "bg-indigo-500",
        iconFg: "text-white",
        lightBg: "bg-indigo-100",
        darkBg: "bg-indigo-900/40"
    },
    cyan: {
        iconBg: "bg-cyan-500",
        iconFg: "text-white",
        lightBg: "bg-cyan-100",
        darkBg: "bg-cyan-900/40"
    },
    orange: {
        iconBg: "bg-orange-500",
        iconFg: "text-white",
        lightBg: "bg-orange-100",
        darkBg: "bg-orange-900/40"
    },
    yellow: {
        iconBg: "bg-yellow-500",
        iconFg: "text-white",
        lightBg: "bg-yellow-100",
        darkBg: "bg-yellow-900/40"
    },
    teal: {
        iconBg: "bg-teal-500",
        iconFg: "text-white",
        lightBg: "bg-teal-100",
        darkBg: "bg-teal-900/40"
    },
    red: {
        iconBg: "bg-red-500",
        iconFg: "text-white",
        lightBg: "bg-red-100",
        darkBg: "bg-red-900/40"
    },
    green: {
        iconBg: "bg-green-500",
        iconFg: "text-white",
        lightBg: "bg-green-100",
        darkBg: "bg-green-900/40"
    },
};

/* ============================================
   NUMBER FORMATTER
============================================ */

function formatNumber(
    value: number,
    format: NumberFormat = "compact",
    decimals = 1
): string {
    if (format === "raw") {
        return value.toString();
    }

    if (format === "percentage") {
        return value.toFixed(decimals) + "%";
    }

    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (absValue >= 1_000_000_000) {
        const formatted = (absValue / 1_000_000_000).toFixed(decimals);
        return sign + (format === "currency" ? "$" : "") + formatted + "B";
    }
    if (absValue >= 1_000_000) {
        const formatted = (absValue / 1_000_000).toFixed(decimals);
        return sign + (format === "currency" ? "$" : "") + formatted + "M";
    }
    if (absValue >= 1_000) {
        const formatted = (absValue / 1_000).toFixed(decimals);
        return sign + (format === "currency" ? "$" : "") + formatted + "K";
    }
    return sign + (format === "currency" ? "$" : "") + absValue.toString();
}

/* ============================================
   COUNT UP HOOK
============================================ */

function useCountUp({
    end,
    format = "compact",
    prefix = "",
    suffix = "",
    decimals = 1,
    duration = 1500,
    enabled = true,
    delay = 0,
}: {
    end: number;
    format?: NumberFormat;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    enabled?: boolean;
    delay?: number;
}) {
    const [display, setDisplay] = React.useState(() => {
        if (!enabled) {
            const formatted = formatNumber(end, format, decimals);
            return prefix + formatted + suffix;
        }
        const initialFormatted = formatNumber(0, format, decimals);
        return prefix + initialFormatted + suffix;
    });
    const [hasAnimated, setHasAnimated] = React.useState(false);
    const ref = React.useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
        if (!enabled || hasAnimated) {
            if (!enabled) {
                const formatted = formatNumber(end, format, decimals);
                setDisplay(prefix + formatted + suffix);
            }
            return;
        }

        let startTime: number;
        let animationFrame: number;
        let timeoutId: NodeJS.Timeout;

        const startAnimation = () => {
            startTime = performance.now();

            const animate = (timestamp: number) => {
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = easeOutQuart * end;

                const formattedValue = formatNumber(currentValue, format, decimals);
                setDisplay(prefix + formattedValue + suffix);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    const finalFormatted = formatNumber(end, format, decimals);
                    setDisplay(prefix + finalFormatted + suffix);
                    setHasAnimated(true);
                }
            };

            animationFrame = requestAnimationFrame(animate);
        };

        if (delay > 0) {
            timeoutId = setTimeout(startAnimation, delay);
        } else {
            startAnimation();
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [end, prefix, suffix, format, decimals, duration, enabled, delay, hasAnimated]);

    return { display, ref };
}

/* ============================================
   STAT SUB-COMPONENTS
============================================ */

export interface StatValueProps {
    value: number;
    format?: NumberFormat;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    animated?: boolean;
    delay?: number;
    className?: string;
    as?: 'p' | 'span' | 'div';
    color?: string; // Custom color
}

export const StatValue: React.FC<StatValueProps> = ({
    value,
    format = "compact",
    prefix = "",
    suffix = "",
    decimals = 1,
    animated = true,
    delay = 0,
    className,
    as: Component = "p",
    color,
}) => {
    const context = useStatsGrid();
    const { display, ref } = useCountUp({
        end: value,
        format,
        prefix,
        suffix,
        decimals,
        enabled: context.animated && animated,
        delay: delay * 1000,
    });

    return (
        <Component
            ref={ref}
            className={cn(
                "font-bold tracking-tight break-words",
                color ? color : context.theme === "dark" ? "text-white" : "text-gray-900",
                className
            )}
        >
            {display}
        </Component>
    );
};

StatValue.displayName = "StatValue";

export interface StatLabelProps {
    children: React.ReactNode;
    className?: string;
    as?: 'p' | 'span' | 'div' | 'h3' | 'h4';
    color?: string;
}

export const StatLabel: React.FC<StatLabelProps> = ({
    children,
    className,
    as: Component = "p",
    color,
}) => {
    const context = useStatsGrid();

    return (
        <Component className={cn(
            "text-sm font-medium truncate",
            color ? color : context.theme === "dark" ? "text-gray-400" : "text-gray-600",
            className
        )}>
            {children}
        </Component>
    );
};

StatLabel.displayName = "StatLabel";

export interface StatSubtextProps {
    children: React.ReactNode;
    className?: string;
    as?: 'p' | 'span' | 'div';
    color?: string;
}

export const StatSubtext: React.FC<StatSubtextProps> = ({
    children,
    className,
    as: Component = "p",
    color,
}) => {
    const context = useStatsGrid();

    return (
        <Component className={cn(
            "text-xs line-clamp-2",
            color ? color : context.theme === "dark" ? "text-gray-500" : "text-gray-500",
            className
        )}>
            {children}
        </Component>
    );
};

StatSubtext.displayName = "StatSubtext";

export interface StatIconProps {
    icon: LucideIcon;
    accent?: StatAccent;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    bgColor?: string;
    iconColor?: string;
    solid?: boolean; // Use solid vibrant colors instead of light backgrounds
}

export const StatIcon: React.FC<StatIconProps> = ({
    icon: Icon,
    accent = "default",
    className,
    size = "md",
    bgColor,
    iconColor,
    solid = false,
}) => {
    const context = useStatsGrid();
    const styles = vibrantAccentStyles[accent];

    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    // Determine background color
    const getBgClass = () => {
        if (bgColor) return bgColor;
        if (solid) return styles.iconBg;
        return context.theme === "dark" ? styles.darkBg : styles.lightBg;
    };

    // Determine icon color
    const getFgClass = () => {
        if (iconColor) return iconColor;
        if (solid) return styles.iconFg;
        return context.theme === "dark" ? "text-gray-200" : `text-${accent}-600`;
    };

    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center rounded-lg",
                sizeClasses[size],
                getBgClass(),
                className
            )}
            aria-hidden="true"
        >
            <Icon className={cn(
                iconSizes[size],
                getFgClass()
            )} />
        </div>
    );
};

StatIcon.displayName = "StatIcon";

/* ============================================
   BASIC CHILD COMPONENTS
============================================ */

export const StatsGridTitle: React.FC<{
    children: React.ReactNode;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    color?: string;
}> = ({ children, className, as: Component = "h2", color }) => {
    const { theme, contentAlign, isVisible, animationDelay, animationType, customTextColor } = useStatsGrid();

    return (
        <motion.div
            initial={animationType === "fade" ? { opacity: 0 } :
                animationType === "slide" ? { opacity: 0, y: 20 } :
                    animationType === "scale" ? { opacity: 0, scale: 0.95 } :
                        { opacity: 1 }}
            animate={isVisible ? {
                opacity: 1,
                y: 0,
                scale: 1
            } : animationType === "fade" ? { opacity: 0 } :
                animationType === "slide" ? { opacity: 0, y: 20 } :
                    animationType === "scale" ? { opacity: 0, scale: 0.95 } :
                        { opacity: 1 }}
            transition={{ duration: 0.6, delay: animationDelay }}
            className={cn(
                contentAlign === "center" && "text-center",
                contentAlign === "right" && "text-right",
                className
            )}
        >
            <Component className={cn(
                "text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
                color || customTextColor || (theme === "dark" ? "text-white" : "text-gray-900")
            )}>
                {children}
            </Component>
        </motion.div>
    );
};

StatsGridTitle.displayName = "StatsGridTitle";

export const StatsGridDescription: React.FC<{
    children: React.ReactNode;
    className?: string;
    color?: string;
}> = ({ children, className, color }) => {
    const { theme, contentAlign, isVisible, animationDelay, animationType, customTextColor } = useStatsGrid();

    return (
        <motion.div
            initial={animationType === "fade" ? { opacity: 0 } :
                animationType === "slide" ? { opacity: 0, y: 20 } :
                    animationType === "scale" ? { opacity: 0, scale: 0.95 } :
                        { opacity: 1 }}
            animate={isVisible ? {
                opacity: 1,
                y: 0,
                scale: 1
            } : animationType === "fade" ? { opacity: 0 } :
                animationType === "slide" ? { opacity: 0, y: 20 } :
                    animationType === "scale" ? { opacity: 0, scale: 0.95 } :
                        { opacity: 1 }}
            transition={{ duration: 0.6, delay: animationDelay + 0.1 }}
            className={cn(
                "mt-4 text-lg max-w-3xl mx-auto",
                contentAlign === "center" && "text-center",
                contentAlign === "right" && "text-right",
                className
            )}
        >
            <p className={cn(
                "text-sm sm:text-base",
                color || customTextColor || (theme === "dark" ? "text-gray-300" : "text-gray-600")
            )}>
                {children}
            </p>
        </motion.div>
    );
};

StatsGridDescription.displayName = "StatsGridDescription";

/* ============================================
   STAT CARD COMPONENT
============================================ */

export interface StatsGridCardProps {
    stat: StatItem;
    index?: number;
    className?: string;
    bgColor?: string;
    borderColor?: string;
    borderWidth?: string;
    textColor?: string;
    iconBgColor?: string;
    iconColor?: string;
    iconSolid?: boolean;
}

export const StatsGridCard: React.FC<StatsGridCardProps> = ({
    stat,
    index = 0,
    className,
    bgColor,
    borderColor,
    borderWidth,
    textColor,
    iconBgColor,
    iconColor,
    iconSolid = false,
}) => {
    const {
        value,
        label,
        subtext,
        icon: Icon,
        format = "compact",
        prefix = "",
        suffix = "",
        decimals = 1,
        accent = "default",
    } = stat;

    const {
        theme,
        animated,
        animationType,
        staggerDelay,
        gap,
        isVisible,
        customCardBgColor,
        customCardBorderColor,
        customCardBorderWidth,
        customIconBgColor,
        customIconColor,
    } = useStatsGrid();

    const getAnimation = () => {
        if (!animated || animationType === "none") return {};

        switch (animationType) {
            case "fade":
                return {
                    initial: { opacity: 0 },
                    animate: isVisible ? { opacity: 1 } : { opacity: 0 },
                    transition: {
                        duration: 0.5,
                        delay: index * staggerDelay,
                        ease: "easeOut" as const // ✅ Valid preset
                    }
                };
            case "slide":
                return {
                    initial: { opacity: 0, y: 30 },
                    animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
                    transition: {
                        duration: 0.5,
                        delay: index * staggerDelay,
                        ease: "easeOut" as const // ✅ Valid preset
                    }
                };
            case "scale":
                return {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 },
                    transition: {
                        duration: 0.5,
                        delay: index * staggerDelay,
                        ease: "backOut" as const // ✅ Valid preset
                    }
                };
            default:
                return {};
        }
    };

    const cardContent = (
        <article
            className={cn(
                "group relative flex flex-col rounded-xl p-5 sm:p-6",
                "transition-all duration-200",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                "h-full w-full",
                gap === "sm" && "p-4 sm:p-5",
                gap === "xl" && "p-6 sm:p-8",
                borderWidth === "0" || borderWidth === "none" ? "border-0" : borderWidth || "border",
                bgColor || customCardBgColor || (theme === "dark" ? "bg-gray-900" : "bg-white"),
                borderColor || customCardBorderColor || (theme === "dark" ? "border-gray-800" : "border-gray-200"),
                className
            )}
            tabIndex={0}
            aria-label={`${label}: ${prefix}${value.toLocaleString()}${suffix}`}
            style={{
                borderWidth: customCardBorderWidth || borderWidth,
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                    <StatLabel color={textColor}>{label}</StatLabel>
                    <StatValue
                        value={value}
                        format={format}
                        prefix={prefix}
                        suffix={suffix}
                        decimals={decimals}
                        delay={index * staggerDelay}
                        color={textColor}
                    />
                </div>
                {Icon && (
                    <StatIcon
                        icon={Icon}
                        accent={accent}
                        bgColor={iconBgColor || customIconBgColor}
                        iconColor={iconColor || customIconColor}
                        solid={iconSolid}
                    />
                )}
            </div>
            {subtext && <StatSubtext color={textColor}>{subtext}</StatSubtext>}
        </article>
    );

    if (animated && animationType !== "none") {
        return (
            <motion.div {...getAnimation()} className="h-full w-full">
                {cardContent}
            </motion.div>
        );
    }

    return cardContent;
};

StatsGridCard.displayName = "StatsGridCard";

/* ============================================
   GRID CONTAINER COMPONENT
============================================ */

export const StatsGridContainer: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { columns, gap, contentAlign } = useStatsGrid();

    return (
        <div className={cn(
            "mt-4 sm:mt-6 lg:mt-8 grid auto-rows-fr",
            columnClasses[columns],
            gapClasses[gap],
            contentAlign === "center" && "justify-items-center",
            contentAlign === "right" && "justify-items-end",
            className
        )}>
            {children}
        </div>
    );
};

StatsGridContainer.displayName = "StatsGridContainer";

/* ============================================
   HEADER COMPONENT
============================================ */

export const StatsGridHeader: React.FC<{
    title?: string;
    description?: string;
    className?: string;
}> = ({ title, description, className }) => {
    const { contentAlign } = useStatsGrid();

    if (!title && !description) return null;

    return (
        <div className={cn(
            "mb-8 sm:mb-10 lg:mb-12",
            contentAlign === "center" && "text-center",
            contentAlign === "right" && "text-right",
            className
        )}>
            {title && <StatsGridTitle>{title}</StatsGridTitle>}
            {description && <StatsGridDescription>{description}</StatsGridDescription>}
        </div>
    );
};

StatsGridHeader.displayName = "StatsGridHeader";

/* ============================================
   MAIN COMPONENT
============================================ */

export const StatsGridRoot: React.FC<StatsGridProps> = ({
    // Layout & Variants
    variant = "default",
    columns = 4,
    contentAlign = "center",

    // Animation
    animated = true,
    animationDelay = 0,
    animationType = "slide",
    staggerDelay = 0.1,

    // Spacing
    padding = "lg",
    gap = "md",
    containerSize = "normal",

    // Custom Colors
    bgColor,
    textColor,
    cardBgColor,
    cardBorderColor,
    cardBorderWidth,
    iconBgColor,
    iconColor,

    // Content
    title,
    description,
    stats = [],

    // Accessibility
    ariaLabel,
    role = "region",

    // Children
    children,
}) => {
    // State for animation
    const [isVisible, setIsVisible] = React.useState(!animated);

    // Determine theme based on variant (simplified)
    const theme: "light" | "dark" = variant === "dark" ? "dark" : "light";

    // Validate stats
    const validStats = React.useMemo(() => {
        if (!stats || stats.length === 0) {
            return [];
        }
        return stats.slice(0, 6);
    }, [stats]);

    // Trigger animation on mount
    React.useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [animated]);

    // Context value
    const contextValue: StatsGridContextType = {
        variant,
        columns,
        contentAlign,
        theme,
        animated,
        animationType,
        animationDelay,
        staggerDelay,
        gap,
        isVisible,
        customBgColor: bgColor,
        customTextColor: textColor,
        customCardBgColor: cardBgColor,
        customCardBorderColor: cardBorderColor,
        customCardBorderWidth: cardBorderWidth,
        customIconBgColor: iconBgColor,
        customIconColor: iconColor,
    };

    // If no stats and no children, return null
    if (validStats.length === 0 && !children) {
        return null;
    }

    // Determine effective columns
    // const effectiveColumns = children ? columns : Math.min(columns, validStats.length) as typeof columns;

    return (
        <StatsGridContext.Provider value={contextValue}>
            <section
                className={cn(
                    statsGridVariants({ variant, padding }),
                    bgColor,
                    "relative"
                )}
                aria-label={ariaLabel ?? title ?? "Statistics grid"}
                role={role}
                style={bgColor && !bgColor.startsWith('bg-') ? { backgroundColor: bgColor } : undefined}
            >
                <div className={containerVariants({ size: containerSize })}>
                    {children ? (
                        children
                    ) : (
                        <>
                            <StatsGridHeader title={title} description={description} />
                            <StatsGridContainer>
                                {validStats.map((stat, index) => (
                                    <StatsGridCard
                                        key={stat.id || index}
                                        stat={stat}
                                        index={index}
                                    />
                                ))}
                            </StatsGridContainer>
                        </>
                    )}
                </div>
            </section>
        </StatsGridContext.Provider>
    );
};

StatsGridRoot.displayName = "StatsGrid";

/* ============================================
   EXPORTS
============================================ */

export const StatsGrid = Object.assign(StatsGridRoot, {
    Title: StatsGridTitle,
    Description: StatsGridDescription,
    Card: StatsGridCard,
    Container: StatsGridContainer,
    Header: StatsGridHeader,
    Value: StatValue,
    Label: StatLabel,
    Subtext: StatSubtext,
    Icon: StatIcon,
});

export default StatsGrid;