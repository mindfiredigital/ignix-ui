// AuthControls.tsx
import * as React from "react";
import { Button } from "../../../../components/button";
import { cn } from "../../../../../utils/cn";
import { type AuthControlsProps } from "../types";
import { getButtonVariant } from "../variants";

/**
 * Authentication controls component (Sign In / Sign Up buttons)
 * @component
 * @param {AuthControlsProps} props - Component props
 * @returns {React.ReactElement|null} Authentication controls or null if not shown
 */

export const AuthControls: React.FC<AuthControlsProps> = ({
    showAuthControls,
    authComponents,
    variant,
    onSignInClick,
    onSignUpClick,
    isMobile = false,
    onCloseMenu,
}) => {
    if (!showAuthControls) return null;

    const handleSignIn = () => {
        if (isMobile && onCloseMenu) onCloseMenu();
        onSignInClick?.();
    };

    const handleSignUp = () => {
        if (isMobile && onCloseMenu) onCloseMenu();
        onSignUpClick?.();
    };

    const controls = (
        <>
            {authComponents?.signIn || (
                <Button
                    variant={getButtonVariant(variant, "ghost")}
                    size="sm"
                    className={cn(
                        variant === "modern" && "text-slate-700 hover:text-blue-600 hover:bg-blue-50",
                        variant === "solid" && "text-white hover:bg-white/20",
                        isMobile && "justify-start"
                    )}
                    onClick={handleSignIn}
                >
                    Sign In
                </Button>
            )}
            {authComponents?.signUp || (
                <Button
                    variant={getButtonVariant(variant, "primary")}
                    size="sm"
                    className={cn(
                        variant === "modern" && "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-md hover:shadow-lg",
                        variant === "solid" && "bg-white text-blue-600 hover:bg-white/90",
                        isMobile && "justify-start"
                    )}
                    onClick={handleSignUp}
                >
                    Sign Up
                </Button>
            )}
        </>
    );

    if (isMobile) {
        return (
            <div className={cn(
                "flex flex-col space-y-2 pt-4",
                variant !== "modern" && "border-t border-border"
            )}>
                {controls}
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-3 ml-4">
            {controls}
        </div>
    );
};