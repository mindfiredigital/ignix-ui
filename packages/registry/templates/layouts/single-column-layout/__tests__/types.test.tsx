import { describe, it, expect } from "vitest";
import type {
  NavLink,
  AuthComponents,
  ZIndexConfig,
  ClassNameConfig,
  SingleColumnLayoutProps,
  HeaderRenderProps,
  NavigationProps,
  AuthControlsProps,
  MobileMenuProps,
  FooterProps,
} from "../types";

describe("Type definitions", () => {
  describe("NavLink interface", () => {
    it("has correct structure", () => {
      const navLink: NavLink = {
        label: "Home",
        href: "/",
        icon: <span>🏠</span>,
      };

      expect(navLink.label).toBe("Home");
      expect(navLink.href).toBe("/");
      expect(navLink.icon).toBeDefined();
    });
  });

  describe("AuthComponents interface", () => {
    it("has correct structure", () => {
      const authComponents: AuthComponents = {
        signIn: <button>Sign In</button>,
        signUp: <button>Sign Up</button>,
      };

      expect(authComponents.signIn).toBeDefined();
      expect(authComponents.signUp).toBeDefined();
    });
  });

  describe("ZIndexConfig interface", () => {
    it("has correct structure", () => {
      const zIndex: ZIndexConfig = {
        header: 100,
        footer: 50,
        mobileMenu: 95,
      };

      expect(zIndex.header).toBe(100);
      expect(zIndex.footer).toBe(50);
      expect(zIndex.mobileMenu).toBe(95);
    });
  });

  describe("ClassNameConfig interface", () => {
    it("has correct structure", () => {
      const classNameConfig: ClassNameConfig = {
        root: "custom-root",
        header: "custom-header",
        main: "custom-main",
        footer: "custom-footer",
        content: "custom-content",
      };

      expect(classNameConfig.root).toBe("custom-root");
      expect(classNameConfig.header).toBe("custom-header");
      expect(classNameConfig.main).toBe("custom-main");
    });
  });

  describe("SingleColumnLayoutProps interface", () => {
    it("has required children property", () => {
      const props: SingleColumnLayoutProps = {
        children: <div>Content</div>,
      };

      expect(props.children).toBeDefined();
    });

    it("has optional variant property", () => {
      const props: SingleColumnLayoutProps = {
        children: <div>Content</div>,
        variant: "modern",
      };

      expect(props.variant).toBe("modern");
    });

    it("has all optional properties", () => {
      const props: SingleColumnLayoutProps = {
        children: <div>Content</div>,
        stickyHeader: true,
        stickyFooter: false,
        variant: "light",
        animation: "fade",
        contentPadding: "px-4 py-8",
        maxWidth: "max-w-6xl",
        headerHeight: 64,
        footerHeight: 48,
        zIndex: { header: 100, footer: 50, mobileMenu: 95 },
        navLinks: [{ label: "Home", href: "/" }],
        showAuthControls: true,
        showFooter: true,
        className: { root: "custom" },
      };

      expect(props.stickyHeader).toBe(true);
      expect(props.variant).toBe("light");
      expect(props.navLinks?.length).toBe(1);
    });
  });

  describe("HeaderRenderProps interface", () => {
    it("has correct structure", () => {
      const props: HeaderRenderProps = {
        logo: <div>Logo</div>,
        navLinks: <nav>Links</nav>,
        authControls: <div>Auth</div>,
        mobileMenuButton: <button>Menu</button>,
        variant: "modern",
        isMobileMenuOpen: false,
        toggleMobileMenu: () => {
          // toggle menu
        },
      };

      expect(props.logo).toBeDefined();
      expect(props.navLinks).toBeDefined();
      expect(props.authControls).toBeDefined();
      expect(props.variant).toBe("modern");
    });
  });

  describe("NavigationProps interface", () => {
    it("has correct structure", () => {
      const props: NavigationProps = {
        navLinks: [{ label: "Home", href: "/" }],
        variant: "modern",
        isMobile: false,
        onNavLinkClick: () => {
          // handle nav link click
        },
      };

      expect(props.navLinks.length).toBe(1);
      expect(props.variant).toBe("modern");
      expect(props.isMobile).toBe(false);
      expect(props.onNavLinkClick).toBeDefined();
    });
  });

  describe("AuthControlsProps interface", () => {
    it("has correct structure", () => {
      const props: AuthControlsProps = {
        showAuthControls: true,
        variant: "modern",
        onSignInClick: () => {
          // handle sign in click
        },
        onSignUpClick: () => {
          // handle sign up click
        },
      };

      expect(props.showAuthControls).toBe(true);
      expect(props.variant).toBe("modern");
    });
  });

  describe("MobileMenuProps interface", () => {
    it("has correct structure", () => {
      const props: MobileMenuProps = {
        isOpen: true,
        onClose: () => {
          // handle close
        },
        navLinks: [{ label: "Home", href: "/" }],
        variant: "modern",
        showAuthControls: true,
      };

      expect(props.isOpen).toBe(true);
      expect(props.navLinks.length).toBe(1);
      expect(props.variant).toBe("modern");
    });
  });

  describe("FooterProps interface", () => {
    it("has correct structure", () => {
      const props: FooterProps = {
        variant: "modern",
        showFooter: true,
      };

      expect(props.variant).toBe("modern");
      expect(props.showFooter).toBe(true);
    });
  });
});