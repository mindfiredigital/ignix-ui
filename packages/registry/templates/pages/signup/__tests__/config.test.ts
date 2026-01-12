// config.test.ts
import { describe, it, expect } from "vitest";
import { DEFAULT_FEATURES, DEFAULT_ANIMATION_CONFIG, DEFAULT_COMPANY_NAME, DEFAULT_STRENGTH_LABELS } from "../config";

describe("Configuration Constants", () => {
    describe("DEFAULT_FEATURES", () => {
        it("contains four default features", () => {
            expect(DEFAULT_FEATURES).toHaveLength(4);
        });

        it("contains enterprise security feature", () => {
            const securityFeature = DEFAULT_FEATURES[0];
            expect(securityFeature.text).toBe("Enterprise-grade security & encryption");
            expect(securityFeature.iconColor).toBe("text-blue-400");
            expect(securityFeature.textClassName).toBe("font-semibold text-white/95");
        });

        it("contains performance feature", () => {
            const performanceFeature = DEFAULT_FEATURES[1];
            expect(performanceFeature.text).toBe("Lightning-fast performance");
            expect(performanceFeature.iconColor).toBe("text-yellow-400");
        });

        it("contains collaboration feature", () => {
            const collaborationFeature = DEFAULT_FEATURES[2];
            expect(collaborationFeature.text).toBe("Seamless team collaboration");
            expect(collaborationFeature.iconColor).toBe("text-green-400");
        });

        it("contains availability feature", () => {
            const availabilityFeature = DEFAULT_FEATURES[3];
            expect(availabilityFeature.text).toBe("Global availability");
            expect(availabilityFeature.iconColor).toBe("text-purple-400");
        });
    });

    describe("DEFAULT_ANIMATION_CONFIG", () => {
        it("has correct animation delays", () => {
            expect(DEFAULT_ANIMATION_CONFIG.titleDelay).toBe(0.2);
            expect(DEFAULT_ANIMATION_CONFIG.descriptionDelay).toBe(0.3);
            expect(DEFAULT_ANIMATION_CONFIG.featuresDelay).toBe(0.4);
            expect(DEFAULT_ANIMATION_CONFIG.staggerChildren).toBe(0.1);
        });
    });

    describe("DEFAULT_COMPANY_NAME", () => {
        it("has correct default company name", () => {
            expect(DEFAULT_COMPANY_NAME).toBe("YourBrand");
        });
    });

    describe("DEFAULT_STRENGTH_LABELS", () => {
        it("has correct strength labels", () => {
            expect(DEFAULT_STRENGTH_LABELS.weak).toBe("Weak");
            expect(DEFAULT_STRENGTH_LABELS.medium).toBe("Medium");
            expect(DEFAULT_STRENGTH_LABELS.strong).toBe("Strong");
        });
    });
});