import { describe, it, expect } from "vitest";
import {
  singleColumnVariants,
  headerVariants,
  mobileMenuVariants,
  footerVariants,
  getButtonVariant,
  getNavLinkClass,
  getLogoClass,
  getLogoTextClass,
} from "../variants";

describe("Variants utilities", () => {
  describe("singleColumnVariants", () => {
    it("returns default variant classes", () => {
      const classes = singleColumnVariants({});
      expect(classes).toContain("min-h-screen");
      expect(classes).toContain("flex");
      expect(classes).toContain("flex-col");
      expect(classes).toContain("bg-background");
      expect(classes).toContain("text-foreground");
    });

    it("returns light variant classes", () => {
      const classes = singleColumnVariants({ variant: "light" });
      expect(classes).toContain("bg-white");
      expect(classes).toContain("text-gray-900");
    });

    it("returns dark variant classes", () => {
      const classes = singleColumnVariants({ variant: "dark" });
      expect(classes).toContain("bg-neutral-900");
      expect(classes).toContain("text-white");
    });

    it("returns glass variant classes", () => {
      const classes = singleColumnVariants({ variant: "glass" });
      expect(classes).toContain("bg-white/10");
      expect(classes).toContain("backdrop-blur-lg");
    });

    it("returns modern variant classes", () => {
      const classes = singleColumnVariants({ variant: "modern" });
      expect(classes).toContain("bg-gradient-to-br");
      expect(classes).toContain("from-slate-50");
      expect(classes).toContain("to-slate-100");
    });
  });

  describe("headerVariants", () => {
    it("returns default variant classes", () => {
      const classes = headerVariants({});
      expect(classes).toContain("w-full");
      expect(classes).toContain("transition-colors");
      expect(classes).toContain("bg-background");
      expect(classes).toContain("border-border");
    });

    it("returns solid variant classes", () => {
      const classes = headerVariants({ variant: "solid" });
      expect(classes).toContain("bg-blue-600");
      expect(classes).toContain("text-white");
      expect(classes).toContain("border-blue-700");
    });

    it("returns modern variant classes", () => {
      const classes = headerVariants({ variant: "modern" });
      expect(classes).toContain("bg-white/95");
      expect(classes).toContain("backdrop-blur-sm");
      expect(classes).toContain("border-slate-200");
    });
  });

  describe("mobileMenuVariants", () => {
    it("returns default variant classes", () => {
      const classes = mobileMenuVariants({});
      expect(classes).toContain("md:hidden");
      expect(classes).toContain("absolute");
      expect(classes).toContain("top-full");
      expect(classes).toContain("bg-background");
    });

    it("returns dark variant classes", () => {
      const classes = mobileMenuVariants({ variant: "dark" });
      expect(classes).toContain("bg-neutral-900");
      expect(classes).toContain("text-white");
    });

    it("returns glass variant classes", () => {
      const classes = mobileMenuVariants({ variant: "glass" });
      expect(classes).toContain("bg-background/95");
      expect(classes).toContain("backdrop-blur-md");
    });
  });

  describe("footerVariants", () => {
    it("returns default variant classes", () => {
      const classes = footerVariants({});
      expect(classes).toContain("w-full");
      expect(classes).toContain("border-t");
      expect(classes).toContain("bg-background");
    });

    it("returns transparent variant classes", () => {
      const classes = footerVariants({ variant: "transparent" });
      expect(classes).toContain("bg-blue-500");
      expect(classes).toContain("text-white");
    });

    it("returns modern variant classes", () => {
      const classes = footerVariants({ variant: "modern" });
      expect(classes).toContain("bg-gradient-to-br");
      expect(classes).toContain("from-slate-800");
      expect(classes).toContain("text-white");
    });
  });

  describe("getButtonVariant", () => {
    it("returns ghost for dark variant with ghost base", () => {
      const result = getButtonVariant("dark", "ghost");
      expect(result).toBe("ghost");
    });

    it("returns primary for dark variant with primary base", () => {
      const result = getButtonVariant("dark", "primary");
      expect(result).toBe("primary");
    });

    it("returns ghost for solid variant with ghost base", () => {
      const result = getButtonVariant("solid", "ghost");
      expect(result).toBe("ghost");
    });

    it("returns ghost for glass variant with ghost base", () => {
      const result = getButtonVariant("glass", "ghost");
      expect(result).toBe("ghost");
    });

    it("returns primary for glass variant with primary base", () => {
      const result = getButtonVariant("glass", "primary");
      expect(result).toBe("primary");
    });

    it("returns base variant for other variants", () => {
      expect(getButtonVariant("light", "ghost")).toBe("ghost");
      expect(getButtonVariant("light", "primary")).toBe("primary");
    });
  });

  describe("getNavLinkClass", () => {
    describe("mobile links", () => {
      it("returns mobile classes for solid variant", () => {
        const classes = getNavLinkClass("solid", "/test", "/test", true);
        expect(classes).toContain("py-2 px-3");
        expect(classes).toContain("text-sm");
        expect(classes).toContain("bg-blue-500");
        expect(classes).toContain("text-white");
      });

      it("returns mobile hover classes for inactive link", () => {
        const classes = getNavLinkClass("solid", "/test", "/other", true);
        expect(classes).toContain("text-white/90");
        expect(classes).toContain("hover:bg-blue-500/50");
      });

      it("returns default mobile classes for other variants", () => {
        const classes = getNavLinkClass("default", "/test", "/test", true);
        expect(classes).toContain("bg-blue-100");
        expect(classes).toContain("text-blue-700");
      });
    });

    describe("desktop links", () => {
      it("returns solid variant classes for active link", () => {
        const classes = getNavLinkClass("solid", "/test", "/test", false);
        expect(classes).toContain("bg-white/20");
        expect(classes).toContain("text-white");
      });

      it("returns transparent variant classes for active link", () => {
        const classes = getNavLinkClass("transparent", "/test", "/test", false);
        expect(classes).toContain("bg-blue-500");
        expect(classes).toContain("text-white");
      });

      it("returns modern variant classes for active link", () => {
        const classes = getNavLinkClass("modern", "/test", "/test", false);
        expect(classes).toContain("text-blue-600");
        expect(classes).toContain("bg-blue-50");
      });

      it("returns default classes for other variants", () => {
        const classes = getNavLinkClass("light", "/test", "/test", false);
        expect(classes).toContain("text-primary-foreground");
      });
    });
  });

  describe("getLogoClass", () => {
    it("returns modern variant classes", () => {
      const classes = getLogoClass("modern");
      expect(classes).toContain("bg-gradient-to-br");
      expect(classes).toContain("from-blue-500");
      expect(classes).toContain("to-blue-600");
      expect(classes).toContain("text-white");
    });

    it("returns muted background for other variants", () => {
      const classes = getLogoClass("light");
      expect(classes).toContain("bg-muted");
    });
  });

  describe("getLogoTextClass", () => {
    it("returns modern variant classes", () => {
      const classes = getLogoTextClass("modern");
      expect(classes).toContain("bg-gradient-to-r");
      expect(classes).toContain("from-slate-800");
      expect(classes).toContain("to-slate-600");
      expect(classes).toContain("bg-clip-text");
      expect(classes).toContain("text-transparent");
    });

    it("returns base classes for other variants", () => {
      const classes = getLogoTextClass("light");
      expect(classes).toContain("text-xl");
      expect(classes).toContain("font-bold");
      expect(classes).toContain("tracking-tight");
    });
  });
});