import type { NewBadgeProps } from "../types";
import { cn } from '../../../../utils/cn';

export const NewBadge = ({
    text,
    type = 'default',
    variant,
    className,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showIcon = false,
    icon: Icon
}: NewBadgeProps) => {
    const typeStyles = {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    };

    const animationStyles = {
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        tinypop: "",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                typeStyles[type],
                variant && animationStyles[variant],
                className
            )}
        >
            {Icon && <Icon className="w-3 h-3" />}
            {text}
        </span>
    );
};