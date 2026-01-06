// SingleColumnLayout.tsx
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils/cn";
import { type SingleColumnLayoutProps } from "./types";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MobileMenu } from "./components/MobileMenu";
import {
  singleColumnVariants,
  headerVariants,
  footerVariants,
} from "./variants";
import {
  DEFAULT_NAV_LINKS,
  DEFAULT_Z_INDEX,
  DEFAULT_ANIMATION_VARIANTS,
} from "./constants";


/**
 * SingleColumnLayout - A highly customizable single-column layout component
 * with slot-based customization and multiple theme variants.
 *
 * @component
 * @example
 * ```tsx
 * <SingleColumnLayout
 *   variant="modern"
 *   navLinks={[
 *     { label: "Home", href: "/" },
 *     { label: "About", href: "/about" },
 *   ]}
 *   activeNavLink="/"
 * >
 *   <div>Your content here</div>
 * </SingleColumnLayout>
 * ```
 *
 * @param {SingleColumnLayoutProps} props - Component properties
 * @returns {React.ReactElement} SingleColumnLayout component
 */
const SingleColumnLayout: React.FC<SingleColumnLayoutProps> = ({
  // Slot-based customization
  header,
  footer,
  children,

  // Configuration
  stickyHeader = true,
  stickyFooter = false,
  variant = "default",
  animation = "none",
  contentPadding = "px-4 sm:px-6 lg:px-8 py-8",
  maxWidth = "max-w-[1200px]",
  headerHeight = 64,
  footerHeight = 64,
  zIndex = DEFAULT_Z_INDEX,

  // Header config
  logo,
  navLinks = DEFAULT_NAV_LINKS,
  showAuthControls = true,
  authComponents,

  // Footer config
  footerContent,
  showFooter = true,

  // Active state
  activeNavLink,

  // Custom classes
  className,

  // Custom render functions
  renderHeader,
  renderFooter,

  // Callbacks
  onNavLinkClick,
  onSignInClick,
  onSignUpClick,

  // Content wrapper
  contentWrapper,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const motionVariants = DEFAULT_ANIMATION_VARIANTS[animation];

  const handleNavLinkClick = (href: string, label: string) => {
    if (onNavLinkClick) {
      onNavLinkClick(href, label);
    }
    setMenuOpen(false);
  };

  const wrappedChildren = contentWrapper ? contentWrapper(children) : children;

  return (
    <div
      className={cn(
        singleColumnVariants({ variant }),
        typeof className === 'string' ? className : className?.root,
        "relative"
      )}
      style={{
        ["--header-h" as string]: `${headerHeight}px`,
        ["--footer-h" as string]: `${footerHeight}px`,
      }}
    >
      {/* Header */}
      <header
        className={cn(
          headerVariants({ variant }),
          stickyHeader && "sticky top-0",
          typeof className === 'object' && className.header
        )}
        style={{ height: headerHeight, zIndex: zIndex.header }}
      >
        {header || (
          <Header
            logo={logo}
            navLinks={navLinks}
            showAuthControls={showAuthControls}
            authComponents={authComponents}
            variant={variant}
            activeNavLink={activeNavLink}
            onNavLinkClick={handleNavLinkClick}
            onSignInClick={onSignInClick}
            onSignUpClick={onSignUpClick}
            renderHeader={renderHeader}
            isMobileMenuOpen={menuOpen}
            toggleMobileMenu={() => setMenuOpen(!menuOpen)}
          />
        )}
        <MobileMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          navLinks={navLinks}
          activeNavLink={activeNavLink}
          variant={variant}
          showAuthControls={showAuthControls}
          authComponents={authComponents}
          onNavLinkClick={handleNavLinkClick}
          onSignInClick={onSignInClick}
          onSignUpClick={onSignUpClick}
          zIndex={zIndex.mobileMenu}
        />
      </header>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 w-full mx-auto",
          contentPadding,
          maxWidth,
          stickyFooter && "pb-[var(--footer-h)]",
          typeof className === 'object' && className.main
        )}
        role="main"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={motionVariants.initial}
            animate={motionVariants.animate}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("w-full", typeof className === 'object' && className.content)}
          >
            {wrappedChildren}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className={cn(
          footerVariants({ variant }),
          stickyFooter && "fixed inset-x-0 bottom-0",
          typeof className === 'object' && className.footer
        )}
        style={{ height: footerHeight, zIndex: zIndex.footer }}
      >
        {footer || (
          <Footer
            variant={variant}
            footerContent={footerContent}
            showFooter={showFooter}
            renderFooter={renderFooter}
          />
        )}
      </footer>
    </div>
  );
};

SingleColumnLayout.displayName = "SingleColumnLayout";

export { SingleColumnLayout };