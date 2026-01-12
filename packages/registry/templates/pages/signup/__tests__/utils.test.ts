// utils.test.ts
import { describe, it, expect } from "vitest";
import { checkPasswordStrength, getInputClasses } from "../utils";

describe("Utility Functions", () => {
    describe("checkPasswordStrength", () => {
        it("returns weak for empty password", () => {
            const result = checkPasswordStrength("");
            expect(result.strength).toBe("weak");
            expect(result.score).toBe(0);
            expect(result.checks).toHaveLength(5);
        });

        it("returns weak for short password", () => {
            const result = checkPasswordStrength("short");
            expect(result.strength).toBe("weak");
            expect(result.score).toBeLessThan(50);
        });

        it("returns medium for decent password", () => {
            // "Password" - has uppercase and lowercase, 8+ chars, but no numbers or special chars
            // Length: ✓ (1), Uppercase: ✓ (0.5), Lowercase: ✓ (0.5), Number: ✗ (0.5), Special: ✗ (0.5)
            // Total weight: 3.0, Passed weight: 2.0, Score: 66.67% = medium
            const result = checkPasswordStrength("Password");
            expect(result.strength).toBe("medium");
            expect(result.score).toBeGreaterThanOrEqual(50);
            expect(result.score).toBeLessThan(80);
        });

        it("returns strong for complex password", () => {
            const result = checkPasswordStrength("StrongPassword123!");
            expect(result.strength).toBe("strong");
            expect(result.score).toBeGreaterThanOrEqual(80);
        });

        it("returns strong for password meeting most requirements", () => {
            // "Password1" meets 4 out of 5 default requirements
            // Score = (1 + 0.5 + 0.5 + 0.5) / 3.0 * 100 = 83.33% = strong
            const result = checkPasswordStrength("Password1");
            expect(result.strength).toBe("strong");
            expect(result.score).toBeCloseTo(83.33, 2);
        });

        it("respects custom minimum length", () => {
            const result = checkPasswordStrength("12345678", { minLength: 10 });
            expect(result.checks[0].passed).toBe(false);
            expect(result.checks[0].label).toBe("At least 10 characters");
        });

        it("filters checks based on config", () => {
            const result = checkPasswordStrength("password", {
                requireUppercase: false,
                requireNumbers: false,
                requireSpecialChars: false
            });
            // Only length and lowercase checks should remain
            expect(result.checks).toHaveLength(2);
            expect(result.checks[0].label).toContain("characters");
            expect(result.checks[1].label).toBe("Contains lowercase letter");
        });

        it("checks all requirements when enabled", () => {
            const result = checkPasswordStrength("Aa1!aaaaaaaa", {
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: true
            });
            expect(result.checks).toHaveLength(5);
            expect(result.checks.every(check => check.passed)).toBe(true);
        });

        it("returns correct check labels", () => {
            const result = checkPasswordStrength("test");
            expect(result.checks.map(c => c.label)).toEqual([
                "At least 8 characters",
                "Contains uppercase letter",
                "Contains lowercase letter",
                "Contains number",
                "Contains special character"
            ]);
        });

        it("returns medium when only some requirements met", () => {
            // "PASSWORD" - has length and uppercase but no lowercase, number, or special
            // Length: ✓ (1), Uppercase: ✓ (0.5), Lowercase: ✗ (0.5), Number: ✗ (0.5), Special: ✗ (0.5)
            // Total weight: 3.0, Passed weight: 1.5, Score: 50% = medium
            const result = checkPasswordStrength("PASSWORD");
            expect(result.strength).toBe("medium");
            expect(result.score).toBe(50);
        });

        it("returns 100% when all enabled requirements are met", () => {
            const result = checkPasswordStrength("Aa1!aaaa", {
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: true
            });
            expect(result.score).toBe(100);
            expect(result.strength).toBe("strong");
        });
    });

    describe("getInputClasses", () => {
        it("returns default variant classes without error", () => {
            const classes = getInputClasses("default", false);
            expect(classes).toContain("bg-white");
            expect(classes).toContain("text-gray-900");
            expect(classes).toContain("border-gray-300");
            expect(classes).not.toContain("border-red-500");
        });

        it("returns default variant classes with error", () => {
            const classes = getInputClasses("default", true);
            expect(classes).toContain("border-red-500");
        });

        it("returns modern variant classes", () => {
            const classes = getInputClasses("modern", false);
            expect(classes).toContain("bg-white/80");
            expect(classes).toContain("backdrop-blur-sm");
            expect(classes).toContain("border-slate-200");
        });

        it("returns glass variant classes", () => {
            const classes = getInputClasses("glass", false);
            expect(classes).toContain("bg-white/5");
            expect(classes).toContain("backdrop-blur-md");
            expect(classes).toContain("text-white");
            expect(classes).toContain("border-white/10");
        });

        it("returns dark variant classes without error", () => {
            const classes = getInputClasses("dark", false);
            expect(classes).toContain("bg-white");
            expect(classes).toContain("text-wblack");
            expect(classes).toContain("border-gray-600");
            expect(classes).toContain("focus:ring-emerald-500/20");
        });

        it("returns dark variant classes with error", () => {
            const classes = getInputClasses("dark", true);
            expect(classes).toContain("border-red-500");
            expect(classes).toContain("focus:ring-red-500/20");
        });

        it("includes base styles for all variants", () => {
            const variants: Array<'default' | 'modern' | 'glass' | 'dark'> = 
                ['default', 'modern', 'glass', 'dark'];
            
            variants.forEach(variant => {
                const classes = getInputClasses(variant, false);
                expect(classes).toContain("w-full");
                expect(classes).toContain("px-4");
                expect(classes).toContain("py-3");
                expect(classes).toContain("rounded-lg");
                expect(classes).toContain("border");
                expect(classes).toContain("transition-all");
                expect(classes).toContain("duration-300");
            });
        });
    });
});