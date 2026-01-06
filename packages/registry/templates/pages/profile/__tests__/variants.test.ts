// variants.test.ts
import { describe, it, expect } from "vitest";
import { ProfileVariants, CardVariants, NotificationVariants, animationVariants } from "../variants";

describe("Variants", () => {
  describe("ProfileVariants", () => {
    it("returns default classes when no variant specified", () => {
      const result = ProfileVariants();
      expect(result).toBe("bg-background text-foreground");
    });

    it("returns gradient classes for gradient variant", () => {
      const result = ProfileVariants({ variant: "gradient" });
      expect(result).toBe("bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5");
    });

    it("returns card classes for card variant", () => {
      const result = ProfileVariants({ variant: "card" });
      expect(result).toBe("bg-card");
    });

    it("returns glass classes for glass variant", () => {
      const result = ProfileVariants({ variant: "glass" });
      expect(result).toBe("bg-background/80 backdrop-blur-md");
    });

    it("returns dark classes for dark variant", () => {
      const result = ProfileVariants({ variant: "dark" });
      expect(result).toBe("bg-gray-950 text-gray-50");
    });
  });

  describe("CardVariants", () => {
    it("returns default classes when no variant specified", () => {
      const result = CardVariants();
      expect(result).toBe("rounded-2xl overflow-hidden transition-smooth bg-card shadow-lg");
    });

    it("returns glass classes for glass variant", () => {
      const result = CardVariants({ variant: "glass" });
      expect(result).toBe("rounded-2xl overflow-hidden transition-smooth bg-card/80 backdrop-blur-md shadow-lg");
    });

    it("returns border classes for border variant", () => {
      const result = CardVariants({ variant: "border" });
      expect(result).toBe("rounded-2xl overflow-hidden transition-smooth bg-card border-2 border-primary/10 shadow-lg");
    });

    it("returns elevated classes for elevated variant", () => {
      const result = CardVariants({ variant: "elevated" });
      expect(result).toBe("rounded-2xl overflow-hidden transition-smooth bg-card shadow-xl");
    });
  });

  describe("NotificationVariants", () => {
    it("returns success classes for success type", () => {
      const result = NotificationVariants({ type: "success" });
      expect(result).toBe("fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-200 border transition-all duration-300 bg-green-50 text-green-800 border-green-200");
    });

    it("returns error classes for error type", () => {
      const result = NotificationVariants({ type: "error" });
      expect(result).toBe("fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-200 border transition-all duration-300 bg-red-50 text-red-800 border-red-200");
    });

    it("returns info classes for info type", () => {
      const result = NotificationVariants({ type: "info" });
      expect(result).toBe("fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-200 border transition-all duration-300 bg-blue-50 text-blue-800 border-blue-200");
    });

    it("returns warning classes for warning type", () => {
      const result = NotificationVariants({ type: "warning" });
      expect(result).toBe("fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-200 border transition-all duration-300 bg-yellow-50 text-yellow-800 border-yellow-200");
    });
  });

  describe("animationVariants", () => {
    it("contains fadeUp animation properties", () => {
      expect(animationVariants.fadeUp).toEqual({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      });
    });

    it("contains scaleIn animation properties", () => {
      expect(animationVariants.scaleIn).toEqual({
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
      });
    });

    it("contains slideUp animation properties", () => {
      expect(animationVariants.slideUp).toEqual({
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
      });
    });

    it("contains slideLeft animation properties", () => {
      expect(animationVariants.slideLeft).toEqual({
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
      });
    });

    it("contains slideRight animation properties", () => {
      expect(animationVariants.slideRight).toEqual({
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
      });
    });
  });
});