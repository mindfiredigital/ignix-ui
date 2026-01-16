// variants.ts
import { cva } from "class-variance-authority";

export const containerVariants = cva("", {
    variants: {
        variant: {
            default: "",
            modern: "",
            glass: "",
            dark: "",
        },
        type: {
            centered: "min-h-screen flex items-center justify-center p-4",
            split: "min-h-screen flex",
        },
    },
    compoundVariants: [
        {
            type: "centered",
            variant: "default",
            className: "bg-gradient-to-br from-blue-50 to-cyan-50",
        },
        {
            type: "centered",
            variant: "modern",
            className: "bg-gradient-to-br from-slate-50 to-slate-100",
        },
        {
            type: "centered",
            variant: "glass",
            className: "bg-gradient-to-br from-primary/10 to-secondary/10",
        },
        {
            type: "centered",
            variant: "dark",
            className: "bg-gradient-to-br from-gray-900 to-gray-800",
        },
        {
            type: "split",
            variant: "default",
            className: "bg-background",
        },
        {
            type: "split",
            variant: "modern",
            className: "bg-slate-50 dark:bg-slate-900",
        },
        {
            type: "split",
            variant: "glass",
            className: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800",
        },
        {
            type: "split",
            variant: "dark",
            className: "bg-gray-900",
        },
    ],
    defaultVariants: {
        type: "centered",
        variant: "default",
    },
});

export const cardVariants = cva("rounded-2xl shadow-2xl p-8 transition-all duration-300", {
    variants: {
        variant: {
            default: "bg-white",
            modern: "bg-white/95 backdrop-blur-sm border border-slate-200",
            glass: "bg-white/10 backdrop-blur-lg border border-white/20",
            dark: "bg-gray-800",
        },
        type: {
            centered: "w-full max-w-md",
            split: "w-full max-w-md bg-card rounded-xl",
        },
    },
    compoundVariants: [
        {
            type: "split",
            variant: "default",
            className: "bg-white",
        },
        {
            type: "split",
            variant: "modern",
            className: "bg-white/95 backdrop-blur-sm dark:bg-slate-900/95",
        },
        {
            type: "split",
            variant: "dark",
            className: "bg-gray-900",
        },
    ],
    defaultVariants: {
        type: "centered",
        variant: "default",
    },
});