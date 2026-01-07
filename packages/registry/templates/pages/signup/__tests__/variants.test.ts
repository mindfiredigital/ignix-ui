// variants.test.ts
import { describe, it, expect } from "vitest";
import { containerVariants, cardVariants } from "../variants";

describe("Variants Utility Functions", () => {
    describe("containerVariants", () => {
        it("returns default centered variant classes", () => {
            const result = containerVariants();
            expect(result).toBe("min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50");
        });

        it("returns split variant with default styling", () => {
            const result = containerVariants({ type: "split" });
            expect(result).toBe("min-h-screen flex bg-background");
        });

        it("returns centered modern variant classes", () => {
            const result = containerVariants({ 
                type: "centered", 
                variant: "modern" 
            });
            expect(result).toBe("min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100");
        });

        it("returns centered glass variant classes", () => {
            const result = containerVariants({ 
                type: "centered", 
                variant: "glass" 
            });
            expect(result).toBe("min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10");
        });

        it("returns centered dark variant classes", () => {
            const result = containerVariants({ 
                type: "centered", 
                variant: "dark" 
            });
            expect(result).toBe("min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800");
        });

        it("returns split modern variant classes", () => {
            const result = containerVariants({ 
                type: "split", 
                variant: "modern" 
            });
            expect(result).toBe("min-h-screen flex bg-slate-50 dark:bg-slate-900");
        });

        it("returns split glass variant classes", () => {
            const result = containerVariants({ 
                type: "split", 
                variant: "glass" 
            });
            expect(result).toBe("min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800");
        });

        it("returns split dark variant classes", () => {
            const result = containerVariants({ 
                type: "split", 
                variant: "dark" 
            });
            expect(result).toBe("min-h-screen flex bg-gray-900");
        });
    });

    describe("cardVariants", () => {
        it("returns default centered variant classes", () => {
            const result = cardVariants();
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-white w-full max-w-md");
        });

        it("returns split variant with default styling", () => {
            const result = cardVariants({ type: "split" });
            // The compound variant adds "bg-white" again, so it appears twice
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-white w-full max-w-md bg-card rounded-xl bg-white");
        });

        it("returns centered modern variant classes", () => {
            const result = cardVariants({ 
                type: "centered", 
                variant: "modern" 
            });
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-white/95 backdrop-blur-sm border border-slate-200 w-full max-w-md");
        });

        it("returns centered glass variant classes", () => {
            const result = cardVariants({ 
                type: "centered", 
                variant: "glass" 
            });
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-white/10 backdrop-blur-lg border border-white/20 w-full max-w-md");
        });

        it("returns centered dark variant classes", () => {
            const result = cardVariants({ 
                type: "centered", 
                variant: "dark" 
            });
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-gray-800 w-full max-w-md");
        });

        it("returns split modern variant classes", () => {
            const result = cardVariants({ 
                type: "split", 
                variant: "modern" 
            });
            // Both the variant and compound variant add classes
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-white/95 backdrop-blur-sm border border-slate-200 w-full max-w-md bg-card rounded-xl bg-white/95 backdrop-blur-sm dark:bg-slate-900/95");
        });

        it("returns split glass variant classes", () => {
            const result = cardVariants({ 
                type: "split", 
                variant: "glass" 
            });
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-white/10 backdrop-blur-lg border border-white/20 w-full max-w-md bg-card rounded-xl");
        });

        it("returns split dark variant classes", () => {
            const result = cardVariants({ 
                type: "split", 
                variant: "dark" 
            });
            // Variant adds "bg-gray-800", compound adds "bg-gray-900"
            expect(result).toBe("rounded-2xl shadow-2xl p-8 transition-all duration-300 bg-gray-800 w-full max-w-md bg-card rounded-xl bg-gray-900");
        });
    });
});