// components/PasswordStrength.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Use vi.hoisted to create mocks that can be referenced in vi.mock factories
const { mockCheckPasswordStrength } = vi.hoisted(() => ({
    mockCheckPasswordStrength: vi.fn(),
}));

// Mock dependencies
vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
    CheckCircle: () => <div data-testid="check-circle-icon" />,
    XCircle: () => <div data-testid="x-circle-icon" />,
}));

vi.mock("../../utils", () => ({
    checkPasswordStrength: mockCheckPasswordStrength,
}));

// Import the component AFTER setting up all mocks
import { PasswordStrength } from "../../components/PasswordStrength";

describe("PasswordStrength Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCheckPasswordStrength.mockReset();
    });

    it("returns null when showStrengthMeter is false", () => {
        const { container } = render(
            <PasswordStrength
                password="test123"
                passwordStrength={{ showStrengthMeter: false }}
                isDarkVariant={false}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("returns null when password is empty", () => {
        const { container } = render(
            <PasswordStrength
                password=""
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("renders weak password strength", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'weak' as const,
            score: 30,
            checks: [
                { label: 'At least 8 characters', passed: true },
                { label: 'Contains uppercase letter', passed: false },
                { label: 'Contains lowercase letter', passed: true },
                { label: 'Contains number', passed: false },
                { label: 'Contains special character', passed: false },
            ]
        });

        render(
            <PasswordStrength
                password="weakpass"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("Password strength: Weak")).toBeInTheDocument();
        expect(screen.getByText("30%")).toBeInTheDocument();
        expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
        expect(screen.getByText("Contains uppercase letter")).toBeInTheDocument();
    });

    it("renders medium password strength", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'medium' as const,
            score: 65,
            checks: [
                { label: 'At least 8 characters', passed: true },
                { label: 'Contains uppercase letter', passed: true },
                { label: 'Contains lowercase letter', passed: true },
                { label: 'Contains number', passed: false },
                { label: 'Contains special character', passed: false },
            ]
        });

        render(
            <PasswordStrength
                password="MediumPass"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("Password strength: Medium")).toBeInTheDocument();
        expect(screen.getByText("65%")).toBeInTheDocument();
    });

    it("renders strong password strength", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'strong' as const,
            score: 100,
            checks: [
                { label: 'At least 8 characters', passed: true },
                { label: 'Contains uppercase letter', passed: true },
                { label: 'Contains lowercase letter', passed: true },
                { label: 'Contains number', passed: true },
                { label: 'Contains special character', passed: true },
            ]
        });

        render(
            <PasswordStrength
                password="StrongPass123!"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("Password strength: Strong")).toBeInTheDocument();
        expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("uses custom strength labels", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'medium' as const,
            score: 65,
            checks: []
        });

        const customLabels = {
            weak: "Poor",
            medium: "Fair",
            strong: "Excellent"
        };

        render(
            <PasswordStrength
                password="test123"
                passwordStrength={{
                    showStrengthMeter: true,
                    strengthLabels: customLabels
                }}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("Password strength: Fair")).toBeInTheDocument();
    });

    it("shows check icons for passed requirements", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'medium' as const,
            score: 65,
            checks: [
                { label: 'At least 8 characters', passed: true },
                { label: 'Contains uppercase letter', passed: false },
            ]
        });

        render(
            <PasswordStrength
                password="test1234"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        expect(screen.getAllByTestId("check-circle-icon")).toHaveLength(1);
        expect(screen.getAllByTestId("x-circle-icon")).toHaveLength(1);
    });

    it("applies correct color classes for weak strength", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'weak' as const,
            score: 30,
            checks: []
        });

        render(
            <PasswordStrength
                password="weak"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        const strengthText = screen.getByText(/Password strength:/);
        expect(strengthText).toHaveClass("text-red-500");
    });

    it("applies correct color classes for medium strength", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'medium' as const,
            score: 65,
            checks: []
        });

        render(
            <PasswordStrength
                password="medium"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        const strengthText = screen.getByText(/Password strength:/);
        expect(strengthText).toHaveClass("text-yellow-500");
    });

    it("applies correct color classes for strong strength", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'strong' as const,
            score: 100,
            checks: []
        });

        render(
            <PasswordStrength
                password="strong"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        const strengthText = screen.getByText(/Password strength:/);
        expect(strengthText).toHaveClass("text-green-500");
    });

    it("handles custom password strength configuration", () => {
        const customConfig = {
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            showStrengthMeter: true
        };

        mockCheckPasswordStrength.mockReturnValue({
            strength: 'strong' as const,
            score: 100,
            checks: []
        });

        render(
            <PasswordStrength
                password="TestPassword123!"
                passwordStrength={customConfig}
                isDarkVariant={false}
            />
        );

        expect(mockCheckPasswordStrength).toHaveBeenCalledWith("TestPassword123!", customConfig);
    });

    it("renders checks in grid layout", () => {
        mockCheckPasswordStrength.mockReturnValue({
            strength: 'medium' as const,
            score: 65,
            checks: [
                { label: 'Check 1', passed: true },
                { label: 'Check 2', passed: true },
                { label: 'Check 3', passed: false },
                { label: 'Check 4', passed: false },
            ]
        });

        render(
            <PasswordStrength
                password="test123"
                passwordStrength={{ showStrengthMeter: true }}
                isDarkVariant={false}
            />
        );

        const checksContainer = screen.getByText("Check 1").parentElement?.parentElement;
        expect(checksContainer).toHaveClass("grid");
        expect(checksContainer).toHaveClass("grid-cols-1");
        expect(checksContainer).toHaveClass("md:grid-cols-2");
    });
});