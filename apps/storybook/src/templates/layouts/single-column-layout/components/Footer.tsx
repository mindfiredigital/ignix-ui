// Footer.tsx
import * as React from "react";
import { cn } from "../../../../../utils/cn";
import { type FooterProps } from "../types";
import { FOOTER_CONTENT } from "../constants";

/**
 * Footer component for the single column layout
 * @component
 * @param {FooterProps} props - Component props
 * @returns {React.ReactElement|null} Footer component or null if not shown
 */

export const Footer: React.FC<FooterProps> = ({
    variant,
    footerContent,
    showFooter,
    renderFooter,
}) => {
    if (!showFooter) return null;

    const defaultContent = footerContent || (
        <div className={cn(
            "text-center text-sm",
            (variant === "solid" || variant === "transparent") && "text-white"
        )}>
            {FOOTER_CONTENT.default}
        </div>
    );

    if (renderFooter) {
        return renderFooter({ variant, content: defaultContent });
    }

    return (
        <div className="flex items-center justify-center w-full h-full px-4">
            {defaultContent}
        </div>
    );
};