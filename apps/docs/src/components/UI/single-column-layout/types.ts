// types.ts
import * as React from "react";

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface AuthComponents {
  signIn?: React.ReactNode;
  signUp?: React.ReactNode;
}

export interface ZIndexConfig {
  header?: number;
  footer?: number;
  mobileMenu?: number;
}

export interface ClassNameConfig {
  root?: string;
  header?: string;
  main?: string;
  footer?: string;
  content?: string;
}

export interface SingleColumnLayoutProps {
  /** Slot-based customization */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;

  /** Sticky elements */
  stickyHeader?: boolean;
  stickyFooter?: boolean;

  /** Layout theme variants */
  variant?: "default" | "light" | "dark" | "glass" | "gradient" | "transparent" | "solid" | "modern";

  /** Animation for content transition */
  animation?: "none" | "fade" | "slide" | "scale";

  /** Layout spacing & sizing */
  contentPadding?: string;
  maxWidth?: string;
  headerHeight?: number;
  footerHeight?: number;

  /** Layering */
  zIndex?: ZIndexConfig;

  /** Header configuration - Can use either slot or config */
  logo?: React.ReactNode;
  navLinks?: NavLink[];
  showAuthControls?: boolean;
  authComponents?: AuthComponents;

  /** Footer configuration */
  footerContent?: React.ReactNode;
  showFooter?: boolean;

  /** Active navigation link */
  activeNavLink?: string;

  /** Custom classes for each section */
  className?: ClassNameConfig;

  /** Custom header/footer render functions */
  renderHeader?: (props: HeaderRenderProps) => React.ReactNode;
  renderFooter?: (props: FooterRenderProps) => React.ReactNode;

  /** Callback events */
  onNavLinkClick?: (href: string, label: string) => void;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;

  /** Content wrapper */
  contentWrapper?: (children: React.ReactNode) => React.ReactNode;
}

export interface HeaderRenderProps {
  logo: React.ReactNode;
  navLinks: React.ReactNode;
  authControls: React.ReactNode;
  mobileMenuButton: React.ReactNode;
  variant: string;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export interface FooterRenderProps {
  variant: string;
  content: React.ReactNode;
}

export interface NavigationProps {
  navLinks: NavLink[];
  activeNavLink?: string;
  variant: string;
  isMobile?: boolean;
  onNavLinkClick?: (href: string, label: string) => void;
}

export interface AuthControlsProps {
  showAuthControls: boolean;
  authComponents?: AuthComponents;
  variant: string;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  isMobile?: boolean;
  onCloseMenu?: () => void;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navLinks: NavLink[];
  showAuthControls: boolean;
  authComponents?: AuthComponents;
  variant: string;
  activeNavLink?: string;
  onNavLinkClick?: (href: string, label: string) => void;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  renderHeader?: (props: HeaderRenderProps) => React.ReactNode;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  activeNavLink?: string;
  variant: string;
  showAuthControls: boolean;
  authComponents?: AuthComponents;
  onNavLinkClick?: (href: string, label: string) => void;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  zIndex?: number;
}

export interface FooterProps {
  variant: string;
  footerContent?: React.ReactNode;
  showFooter: boolean;
  renderFooter?: (props: FooterRenderProps) => React.ReactNode;
}