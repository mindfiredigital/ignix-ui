// Header.tsx
import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../../../../../utils/cn";
import { type HeaderProps, type HeaderRenderProps } from "../types";
import { Navigation } from "./Navigation";
import { AuthControls } from "./AuthControls";
import { getLogoClass, getLogoTextClass } from "../variants";
import { LOGO_TEXT } from "../constants";

/**
 * Header component for the single column layout
 * @component
 * @param {HeaderProps & {
 *   isMobileMenuOpen: boolean;
 *   toggleMobileMenu: () => void;
 * }} props - Component props including mobile menu state
 * @returns {React.ReactElement} Header component
 */
export const Header: React.FC<HeaderProps & {
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
}> = ({
    logo,
    navLinks,
    showAuthControls,
    authComponents,
    variant,
    activeNavLink,
    onNavLinkClick,
    onSignInClick,
    onSignUpClick,
    renderHeader,
    isMobileMenuOpen,
    toggleMobileMenu,
}) => {
        const DefaultLogo = logo || (
            <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="flex items-center space-x-2">
                    <div className={getLogoClass(variant)} />
                    <span className={getLogoTextClass(variant)}>
                        {LOGO_TEXT[variant as keyof typeof LOGO_TEXT] || LOGO_TEXT.default}
                    </span>
                </div>
            </div>
        );

        const DesktopNav = (
            <Navigation
                navLinks={navLinks}
                activeNavLink={activeNavLink}
                variant={variant}
                onNavLinkClick={onNavLinkClick}
            />
        );

        const AuthControlsComponent = (
            <AuthControls
                showAuthControls={showAuthControls}
                authComponents={authComponents}
                variant={variant}
                onSignInClick={onSignInClick}
                onSignUpClick={onSignUpClick}
            />
        );

        const MobileMenuButton = (
            <button
                className={cn(
                    "md:hidden p-2 rounded-lg transition-colors duration-200",
                    variant === "solid"
                        ? "text-white hover:bg-white/20"
                        : variant === "modern"
                            ? "text-slate-700 hover:bg-slate-100"
                            : "hover:bg-muted/50"
                )}
                onClick={toggleMobileMenu}
                aria-label="Toggle Menu"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        );

        if (renderHeader) {
            const renderProps: HeaderRenderProps = {
                logo: DefaultLogo,
                navLinks: DesktopNav,
                authControls: AuthControlsComponent,
                mobileMenuButton: MobileMenuButton,
                variant,
                isMobileMenuOpen,
                toggleMobileMenu,
            };
            return renderHeader(renderProps);
        }

        return (
            <div className="flex items-center justify-between w-full h-full px-4 sm:px-6 lg:px-8">
                {DefaultLogo}
                <div className="hidden md:flex items-center">
                    {DesktopNav}
                    {AuthControlsComponent}
                </div>
                {MobileMenuButton}
            </div>
        );
    };