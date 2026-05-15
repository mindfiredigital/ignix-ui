import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "../../../utils/cn";

type BadgeBaseProps = {
    text?: string;
    type?: "primary" | "secondary" | "success" | "warning" | "error";
    variant?: "pulse" | "bounce" | "tinypop" | "none";
    className?: string;
};

type InlineBadgeProps = BadgeBaseProps & {
    mode?: "inline";
    children?: never;
};

type AttachedBadgeProps = BadgeBaseProps & {
    mode: "attached";
    children: React.ReactNode;
};

type BadgeProps = InlineBadgeProps | AttachedBadgeProps;

const Badge: React.FC<BadgeProps> = ({
    text,
    type = "primary",
    variant = "tinypop",
    mode = "inline",
    className,
    children,
}) => {
    const types = {
        primary: cn(
            "bg-primary text-primary-foreground",
            "shadow-lg shadow-primary/25",
            "ring-2 ring-primary/20"
        ),
        secondary: cn(
            "bg-secondary text-secondary-foreground",
            "shadow-lg shadow-secondary/25",
            "ring-2 ring-secondary/20"
        ),
        success: cn(
            "bg-success text-success-foreground",
            "shadow-lg shadow-success/25",
            "ring-2 ring-success/20"
        ),
        warning: cn(
            "bg-warning text-warning-foreground",
            "shadow-lg shadow-warning/25",
            "ring-2 ring-warning/30"
        ),
        error: cn(
            "bg-destructive text-destructive-foreground",
            "shadow-lg shadow-destructive/25",
            "ring-2 ring-destructive/20"
        ),
    };

    const animationVariants: Record<string, Variants> = {
        none: {
            initial: {},
            animate: {},
        },
        pulse: {
            initial: { scale: 1 },
            animate: {
                scale: [1, 1.1, 1],
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                },
            },
        },
        bounce: {
            initial: { y: 0, scale: 1 },
            animate: {
                y: [0, -6, 0],
                scale: [1, 1.15, 1],
                transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeOut",
                },
            },
        },
        tinypop: {
            initial: { scale: 1 },
            animate: {
                scale: [1, 1.25, 1],
                transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                },
            },
        },
    };

    const isAttached = mode === "attached";

    // Base styles
    const baseStyles = cn(
        "flex items-center justify-center",
        "rounded-full font-bold tracking-tight",
        "text-xs sm:text-sm px-1.5 sm:px-2 h-5 sm:h-6 min-w-[20px]",

        types[type],
        className
    );

    const positionStyles = isAttached
        ? "absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
        : "relative -top-2 sm:-top-2";

    const badgeContent = (
        <motion.div
            variants={animationVariants[variant]}
            initial="initial"
            animate="animate"
            className={cn(baseStyles, positionStyles)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="leading-none">{text}</span>

            <div
                className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20 dark:to-white/10 pointer-events-none"
                aria-hidden="true"
            />
        </motion.div>
    );

    if (isAttached) {
        return (
            <div className="relative inline-flex items-center">
                {children}
                {badgeContent}
            </div>
        );
    }

    return badgeContent;
};

Badge.displayName = "Badge";
export { Badge };