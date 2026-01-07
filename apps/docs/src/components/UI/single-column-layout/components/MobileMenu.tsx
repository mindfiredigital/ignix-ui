// MobileMenu.tsx
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../../utils/cn";
import { type MobileMenuProps } from "../types";
import { Navigation } from "./Navigation";
import { AuthControls } from "./AuthControls";
import { mobileMenuVariants } from "../variants";

/**
 * Mobile menu component with slide-down animation
 * @component
 * @param {MobileMenuProps} props - Component props
 * @returns {React.ReactElement} Mobile menu component
 */

export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    navLinks,
    activeNavLink,
    variant,
    showAuthControls,
    authComponents,
    onNavLinkClick,
    onSignInClick,
    onSignUpClick,
    zIndex = 95,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="mobile-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={cn(mobileMenuVariants({ variant }))}
                    style={{ zIndex }}
                >
                    <div className="flex flex-col space-y-2 p-4">
                        <Navigation
                            navLinks={navLinks}
                            activeNavLink={activeNavLink}
                            variant={variant}
                            isMobile={true}
                            onNavLinkClick={onNavLinkClick}
                        />
                        <AuthControls
                            showAuthControls={showAuthControls}
                            authComponents={authComponents}
                            variant={variant}
                            onSignInClick={onSignInClick}
                            onSignUpClick={onSignUpClick}
                            isMobile={true}
                            onCloseMenu={onClose}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};