import type { ScopeBadgeProps } from "../types";
import { cn } from '../../../../utils/cn';
import { SCOPE_RISK_BADGE_TYPES, SCOPES } from "../constants";
import { NewBadge } from "./NewBadge";

export const ScopeBadge = ({ scope, badgeVariant = "tinypop", showIcon = true, className }: ScopeBadgeProps) => {
    const scopeInfo = SCOPES.find(s => s.id === scope);
    if (!scopeInfo) return null;

    const Icon = scopeInfo.icon;
    const type = SCOPE_RISK_BADGE_TYPES[scopeInfo.risk];

    // Only animate high-risk scopes by default
    const variant = scopeInfo.risk === 'high' ? badgeVariant : undefined;

    return (
        <NewBadge
            text={scopeInfo.name}
            type={type}
            variant={variant}
            className={cn("text-xs font-normal", className)}
            icon={showIcon ? Icon : undefined}
        />
    );
};