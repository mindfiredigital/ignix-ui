import { describe, it, expect } from "vitest";
import {
  DEFAULT_NAV_LINKS,
  DEFAULT_Z_INDEX,
  DEFAULT_ANIMATION_VARIANTS,
  FOOTER_CONTENT,
  LOGO_TEXT,
} from "../constants";

describe("Constants", () => {
  describe("DEFAULT_NAV_LINKS", () => {
    it("has correct default navigation links", () => {
      expect(DEFAULT_NAV_LINKS).toHaveLength(4);
      expect(DEFAULT_NAV_LINKS[0].label).toBe("Home");
      expect(DEFAULT_NAV_LINKS[0].href).toBe("#");
      expect(DEFAULT_NAV_LINKS[1].label).toBe("Features");
      expect(DEFAULT_NAV_LINKS[2].label).toBe("Pricing");
      expect(DEFAULT_NAV_LINKS[3].label).toBe("Contact");
    });

    it("all links have href starting with #", () => {
      DEFAULT_NAV_LINKS.forEach((link) => {
        expect(link.href).toMatch(/^#/);
      });
    });
  });

  describe("DEFAULT_Z_INDEX", () => {
    it("has correct default z-index values", () => {
      expect(DEFAULT_Z_INDEX.header).toBe(100);
      expect(DEFAULT_Z_INDEX.footer).toBe(50);
      expect(DEFAULT_Z_INDEX.mobileMenu).toBe(95);
    });

    it("has proper layering order", () => {
      expect(DEFAULT_Z_INDEX.header).toBeGreaterThan(DEFAULT_Z_INDEX.footer);
      expect(DEFAULT_Z_INDEX.mobileMenu).toBeGreaterThan(DEFAULT_Z_INDEX.footer);
      expect(DEFAULT_Z_INDEX.header).toBeGreaterThan(DEFAULT_Z_INDEX.mobileMenu);
    });
  });

  describe("DEFAULT_ANIMATION_VARIANTS", () => {
    it("has fade animation variant", () => {
      const fade = DEFAULT_ANIMATION_VARIANTS.fade;
      expect(fade.initial).toEqual({ opacity: 0 });
      expect(fade.animate).toEqual({ opacity: 1 });
    });

    it("has slide animation variant", () => {
      const slide = DEFAULT_ANIMATION_VARIANTS.slide;
      expect(slide.initial).toEqual({ y: 20, opacity: 0 });
      expect(slide.animate).toEqual({ y: 0, opacity: 1 });
    });

    it("has scale animation variant", () => {
      const scale = DEFAULT_ANIMATION_VARIANTS.scale;
      expect(scale.initial).toEqual({ scale: 0.98, opacity: 0 });
      expect(scale.animate).toEqual({ scale: 1, opacity: 1 });
    });

    it("has none animation variant", () => {
      const none = DEFAULT_ANIMATION_VARIANTS.none;
      expect(none.initial).toEqual({});
      expect(none.animate).toEqual({});
    });
  });

  describe("FOOTER_CONTENT", () => {
    it("has default footer content", () => {
      expect(FOOTER_CONTENT.default).toBe(
        "© 2025 My Application. All rights reserved."
      );
    });
  });

  describe("LOGO_TEXT", () => {
    it("has modern logo text", () => {
      expect(LOGO_TEXT.modern).toBe("YourBrand");
    });

    it("has default logo text", () => {
      expect(LOGO_TEXT.default).toBe("Logo");
    });
  });
});