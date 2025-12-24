import { cn } from "../../../../utils/cn";
import { STATUS_BADGE_TYPES, STATUS_LABELS } from "../constants";
import type { StatusBadgeProps } from "../types";
import { NewBadge } from "./NewBadge";

export const StatusBadge = ({ status, badgeVariant = "tinypop", className }: StatusBadgeProps) => {
    const type = STATUS_BADGE_TYPES[status];
    const label = STATUS_LABELS[status];

    // Only animate active badges by default
    const variant = status === 'active' ? badgeVariant : undefined;

    return (
        <NewBadge
            text={label}
            type={type}
            variant={variant}
            className={cn("text-xs font-medium", className)}
        />
    );
};