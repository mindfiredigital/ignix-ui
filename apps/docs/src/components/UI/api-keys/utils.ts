import { cva } from 'class-variance-authority';

export const PageVariants = cva("", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            gradient: "bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5",
            card: "bg-card",
            glass: "bg-background/80 backdrop-blur-md",
            dark: "bg-gray-950 text-gray-50",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export const CardVariants = cva("rounded-2xl overflow-hidden transition-smooth", {
    variants: {
        variant: {
            default: "bg-card shadow-lg",
            glass: "bg-card/80 backdrop-blur-md shadow-lg",
            border: "bg-card border-2 border-primary/10 shadow-lg",
            elevated: "bg-card shadow-xl",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export const TableVariants = cva("w-full", {
    variants: {
        variant: {
            default: "bg-card",
            glass: "bg-card/50 backdrop-blur-md",
            border: "border border-border rounded-lg",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export const NotificationVariants = cva(
    "fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-200 border transition-all duration-300",
    {
        variants: {
            type: {
                success: "bg-green-50 text-green-800 border-green-200",
                error: "bg-red-50 text-red-800 border-red-200",
                info: "bg-blue-50 text-blue-800 border-blue-200",
                warning: "bg-yellow-50 text-yellow-800 border-yellow-200"
            }
        }
    }
);

export const animationVariants = {
    fadeUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
    },
    slideUp: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
    },
    slideLeft: {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
    },
    slideRight: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
    },
};