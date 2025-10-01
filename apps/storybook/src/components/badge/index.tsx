import React from "react";
import { motion} from "framer-motion";
import type { Variants } from "framer-motion"
import { cn } from "../../../utils/cn";

interface BadgeProps {
    text: string;
    type?: "primary" | "secondary" | "success" | "warning" | "error";
    variant?: "pulse" | "bounce" | "tinypop";
    className?: string;
    children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
    text,
    type = "primary",
    className,
    variant = "tinypop",
    children
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

    const getAnimationShadows = (type: string) => {
        const shadowColors = {
            primary: "hsl(var(--primary))",
            secondary: "hsl(var(--secondary))",
            success: "hsl(var(--success))",
            warning: "hsl(var(--warning))",
            error: "hsl(var(--destructive))",
        };
        return shadowColors[type as keyof typeof shadowColors] || shadowColors.primary;
    };

    const animationVariants:{'pulse': Variants, 'bounce': Variants, tinypop: Variants} = {
        pulse: {
            initial: {
                scale: 1,
                boxShadow: `0 0 0 0 rgba(${getAnimationShadows(type)}, 0.7)`,
            },
            animate: {
                scale: [1, 1.1, 1],
                boxShadow: [
                    `0 0 0 0 rgba(${getAnimationShadows(type)}, 0.7)`,
                    `0 0 0 8px rgba(${getAnimationShadows(type)}, 0.1)`,
                    `0 0 0 12px rgba(${getAnimationShadows(type)}, 0)`
                ],
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    times: [0, 0.5, 1]
                },
            },
        },
        bounce: {
            initial: { 
                y: -50, 
                opacity: 0,
                rotate: -15,
                scale: 0.5 
            },
            animate: {
                y: [-50, 0, -20, 0, -8, 0, -3, 0],
                opacity: 1,
                rotate: [-15, 0, -5, 0, -2, 0],
                scale: [0.5, 1.2, 0.9, 1.1, 0.95, 1],
                transition: {
                    duration: 1.5,
                    ease: "easeOut",
                    times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1]
                },
            },
        },
        tinypop: {
            initial: { scale: 1 },
            animate: { 
                scale: [1, 1.15, 1],
                rotate: [0, 2, -2, 0],
                transition: { 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.3, 1]
                }
            },           
        }
    };

    return (
        <div className="relative inline-flex items-center">
            {children}
            <motion.div
                variants={animationVariants[variant]}
                initial="initial"
                animate="animate"
                className={cn(
                    "absolute -top-1 -right-1 sm:-top-2 sm:-right-2",
                    "min-w-5 h-5 sm:min-w-6 sm:h-6",
                    "rounded-full flex items-center justify-center",
                    "text-xs sm:text-sm font-bold tracking-tight",
                    "backdrop-blur-sm",
                    "border border-white/20 dark:border-black/20",
                    "transition-all duration-200",
                    "px-1.5 sm:px-2",
                    "z-10",
                    "hover:scale-105 active:scale-95",
                    "hover:shadow-xl transition-transform duration-200",
                    types[type],
                    className
                )}
                whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                }}
                whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                }}
            >
                <span className="relative z-10 leading-none">
                    {text}
                </span>
                
                <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20 dark:to-white/10 pointer-events-none" 
                    aria-hidden="true"
                />
            </motion.div>
        </div>
    );
};

Badge.displayName = "Badge";
export { Badge };