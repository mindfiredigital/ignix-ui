"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../../../utils/cn";

/* -------------------------------------------------------------------------- */
/*                              VARIANT STYLES                                */
/* -------------------------------------------------------------------------- */
const statsGridVariants = cva("w-full py-12 md:py-16 lg:py-20", {
    variants: {
        variant: {
            default: "bg-background",
            dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
            light: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
            primary: "bg-gradient-to-br from-primary-50 via-primary-100/50 to-primary-50",
            secondary: "bg-gradient-to-br from-secondary-50 via-secondary-100/50 to-secondary-50",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const columnClasses: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

/* -------------------------------------------------------------------------- */
/*                                INTERFACES                                  */
/* -------------------------------------------------------------------------- */
export type StatAccent = "default" | "emerald" | "amber" | "rose" | "violet" | "blue" | "purple";

export interface StatItem {
    id?: string;
    value: number;
    label: string;
    subtext?: string;
    icon?: LucideIcon;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    accent?: StatAccent;
}

export interface StatsGridProps extends VariantProps<typeof statsGridVariants> {
    title?: string;
    description?: string;
    stats: StatItem[];
    columns?: 2 | 3 | 4 | 5 | 6;
    variant?: "default" | "dark" | "light" | "primary" | "secondary";
    animated?: boolean;
    containerSize?: "small" | "normal" | "large" | "full" | "readable";
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                              ACCENT STYLES                                  */
/* -------------------------------------------------------------------------- */
const accentStyles: Record<StatAccent, { iconBg: string; iconFg: string }> = {
    default: { iconBg: "bg-primary-100 dark:bg-primary-900/30", iconFg: "text-primary-600 dark:text-primary-400" },
    emerald: { iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconFg: "text-emerald-600 dark:text-emerald-400" },
    amber: { iconBg: "bg-amber-100 dark:bg-amber-900/30", iconFg: "text-amber-600 dark:text-amber-400" },
    rose: { iconBg: "bg-rose-100 dark:bg-rose-900/30", iconFg: "text-rose-600 dark:text-rose-400" },
    violet: { iconBg: "bg-violet-100 dark:bg-violet-900/30", iconFg: "text-violet-600 dark:text-violet-400" },
    blue: { iconBg: "bg-blue-100 dark:bg-blue-900/30", iconFg: "text-blue-600 dark:text-blue-400" },
    purple: { iconBg: "bg-purple-100 dark:bg-purple-900/30", iconFg: "text-purple-600 dark:text-purple-400" },
};

/* -------------------------------------------------------------------------- */
/*                              COUNT UP HOOK                                 */
/* -------------------------------------------------------------------------- */
function useCountUp({
    end,
    prefix = "",
    suffix = "",
    decimals = 0,
    duration = 1500,
    enabled = true,
}: {
    end: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    enabled?: boolean;
}) {
    const [display, setDisplay] = React.useState(() =>
        enabled ? prefix + "0" + suffix : prefix + end.toLocaleString() + suffix
    );
    const ref = React.useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
        if (!enabled) {
            setDisplay(prefix + end.toLocaleString() + suffix);
            return;
        }

        let startTime: number;
        let animationFrame: number;
        // const startValue = 0;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = easeOutQuart * end;

            const formattedValue = currentValue.toFixed(decimals);
            setDisplay(prefix + formattedValue + suffix);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setDisplay(prefix + end.toFixed(decimals) + suffix);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [end, prefix, suffix, decimals, duration, enabled]);

    return { display, ref };
}

/* -------------------------------------------------------------------------- */
/*                              STAT CARD COMPONENT                           */
/* -------------------------------------------------------------------------- */
interface StatCardProps {
    stat: StatItem;
    animated?: boolean;
    index?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
    stat,
    animated = true,
    index = 0
}) => {
    const {
        value,
        label,
        subtext,
        icon: Icon,
        prefix = "",
        suffix = "",
        decimals = 0,
        accent = "default",
    } = stat;

    const { display, ref } = useCountUp({
        end: value,
        prefix,
        suffix,
        decimals,
        duration: 1500,
        enabled: animated,
    });

    const styles = accentStyles[accent];

    // Animation variants for staggered entrance
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const cardContent = (
        <article
            className={cn(
                "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:p-6",
                "transition-all duration-200 hover:bg-accent/50 hover:shadow-md",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                "h-full w-full"
            )}
            tabIndex={0}
            aria-label={`${label}: ${prefix}${value.toLocaleString()}${suffix}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p
                        ref={ref}
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        {display}
                    </p>
                </div>
                {Icon && (
                    <div
                        className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            styles.iconBg
                        )}
                        aria-hidden="true"
                    >
                        <Icon className={cn("h-5 w-5", styles.iconFg)} />
                    </div>
                )}
            </div>
            {subtext && (
                <p className="text-xs text-muted-foreground/80">{subtext}</p>
            )}
        </article>
    );

    if (animated) {
        return (
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={variants}
                className="h-full w-full"
            >
                {cardContent}
            </motion.div>
        );
    }

    return cardContent;
};

StatCard.displayName = "StatCard";

/* -------------------------------------------------------------------------- */
/*                              MAIN STATS GRID COMPONENT                     */
/* -------------------------------------------------------------------------- */
export const StatsGrid: React.FC<StatsGridProps> = ({
    title,
    description,
    stats,
    columns = 4,
    variant = "default",
    animated = true,
    containerSize = "normal",
    className,
}) => {
    // Validate stats count
    const validStats = React.useMemo(() => {
        if (!stats || stats.length === 0) {
            console.warn("StatsGrid: No stats provided");
            return [];
        }
        if (stats.length < 4) {
            console.warn(`StatsGrid: Only ${stats.length} stats provided. Consider using at least 4 for optimal layout.`);
        }
        if (stats.length > 6) {
            console.warn(`StatsGrid: ${stats.length} stats provided. Consider using max 6 for optimal layout.`);
        }
        return stats.slice(0, 6); // Limit to 6 stats
    }, [stats]);

    if (validStats.length === 0) {
        return null;
    }

    // Determine grid columns based on number of stats
    const effectiveColumns = Math.min(columns, validStats.length) as typeof columns;

    // Container width classes
    const containerClasses = {
        small: "max-w-3xl",
        normal: "max-w-5xl",
        large: "max-w-7xl",
        full: "max-w-full",
        readable: "max-w-prose",
    };

    return (
        <section
            className={cn(
                statsGridVariants({ variant }),
                "px-4 sm:px-6 lg:px-8",
                className
            )}
            aria-label={title ?? "Key metrics"}
        >
            <div className={cn("mx-auto w-full", containerClasses[containerSize])}>
                {/* Header */}
                {(title || description) && (
                    <div className="mb-8 sm:mb-10 lg:mb-12">
                        {title && (
                            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {/* Grid */}
                <div className={cn("grid gap-4 sm:gap-5 lg:gap-6 auto-rows-fr", columnClasses[effectiveColumns])}>
                    {validStats.map((stat, index) => (
                        <StatCard
                            key={stat.id || index}
                            stat={stat}
                            animated={animated}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

StatsGrid.displayName = "StatsGrid";

export default StatsGrid;