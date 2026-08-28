'use client';

import * as React from "react";
import { cn } from "../../../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
    animation?: "shimmer" | "wave" | "pulse" | "none";
    colorTheme?: "default" | "primary" | "success" | "warning" | "danger";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    (
        {
            className,
            variant = "rectangular",
            width,
            height,
            animation = "shimmer",
            colorTheme = "default",
            style,
            ...props
        },
        ref
    ) => {
        const customStyle: React.CSSProperties = {
            ...style,
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
        };

        const isAnimatedGradient = animation === "shimmer" || animation === "wave";

        const themeClasses = {
            default: isAnimatedGradient
                ? "bg-gradient-to-r from-slate-100 via-slate-200/80 to-slate-100 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900"
                : "bg-slate-200 dark:bg-slate-800/80",
            primary: isAnimatedGradient
                ? "bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 dark:from-primary/20 dark:via-primary/35 dark:to-primary/20"
                : "bg-primary/10 dark:bg-primary/25",
            success: isAnimatedGradient
                ? "bg-gradient-to-r from-green-50 via-green-100 to-green-50 dark:from-emerald-950/40 dark:via-emerald-900/30 dark:to-emerald-950/40"
                : "bg-green-100 dark:bg-emerald-950/40",
            warning: isAnimatedGradient
                ? "bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-950/40"
                : "bg-amber-100 dark:bg-amber-950/40",
            danger: isAnimatedGradient
                ? "bg-gradient-to-r from-rose-50 via-rose-100 to-rose-50 dark:from-rose-950/40 dark:via-rose-900/30 dark:to-rose-950/40"
                : "bg-rose-100 dark:bg-rose-950/40",
        }[colorTheme];

        return (
            <>
                {isAnimatedGradient && (
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
                                @keyframes ignix-shimmer {
                                    0% { background-position: 200% 0; }
                                    100% { background-position: -200% 0; }
                                }
                                @keyframes ignix-wave {
                                    0% { background-position: 100% 0; }
                                    100% { background-position: -100% 0; }
                                }
                                .ignix-skeleton-shimmer {
                                    background-size: 200% 100%;
                                    animation: ignix-shimmer 1.6s infinite linear;
                                }
                                .ignix-skeleton-wave {
                                    background-size: 200% 100%;
                                    animation: ignix-wave 2.2s infinite linear;
                                }
                            `,
                        }}
                    />
                )}
                <div
                    ref={ref}
                    style={customStyle}
                    className={cn(
                        themeClasses,
                        animation === "shimmer" && "ignix-skeleton-shimmer",
                        animation === "wave" && "ignix-skeleton-wave",
                        animation === "pulse" && "animate-pulse",
                        variant === "circular" && "rounded-full",
                        variant === "text" && "rounded h-4 w-full",
                        variant === "rectangular" && "rounded-xl",
                        className
                    )}
                    {...props}
                />
            </>
        );
    }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
