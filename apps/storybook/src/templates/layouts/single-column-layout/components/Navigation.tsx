// Navigation.tsx
import * as React from "react";
import { cn } from "../../../../../utils/cn";
import { ChevronRight } from "lucide-react";
import { type NavigationProps } from "../types";
import { getNavLinkClass } from "../variants";

/**
 * Navigation component for both desktop and mobile views
 * @component
 * @param {NavigationProps} props - Component props
 * @returns {React.ReactElement} Navigation component
 */
export const Navigation: React.FC<NavigationProps> = ({
    navLinks,
    activeNavLink,
    variant,
    isMobile = false,
    onNavLinkClick,
}) => {
    const handleClick = (href: string, label: string) => {
        if (onNavLinkClick) {
            onNavLinkClick(href, label);
        }
    };

    if (isMobile) {
        return (
            <>
                {navLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className={getNavLinkClass(variant, link.href, activeNavLink, true)}
                        onClick={(e) => {
                            e.preventDefault();
                            handleClick(link.href, link.label);
                        }}
                    >
                        <span className="flex items-center space-x-2">
                            {link.icon && <span>{link.icon}</span>}
                            <span>{link.label}</span>
                        </span>
                        {variant === "modern" && (
                            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        )}
                    </a>
                ))}
            </>
        );
    }

    return (
        <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
                const isActive = activeNavLink === link.href;
                return (
                    <a
                        key={link.label}
                        href={link.href}
                        className={cn(
                            "text-sm font-medium transition-all duration-300 rounded-lg px-4 py-2 relative",
                            isActive
                                ? "text-blue-600 font-semibold bg-blue-50"
                                : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            handleClick(link.href, link.label);
                        }}
                    >
                        <span className="flex items-center space-x-2">
                            {link.icon && <span>{link.icon}</span>}
                            <span>{link.label}</span>
                        </span>
                    </a>
                );
            })}
        </div>
    );
};