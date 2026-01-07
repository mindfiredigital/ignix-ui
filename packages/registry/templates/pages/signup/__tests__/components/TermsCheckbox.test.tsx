// components/TermsCheckbox.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TermsCheckbox } from "../../components/TermsCheckbox";

// Mock dependencies
vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

describe("TermsCheckbox Component", () => {
    const mockOnChange = vi.fn();
    const mockOnTermsClick = vi.fn();
    const mockOnPrivacyClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders checkbox and terms text", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        expect(screen.getByRole("checkbox")).toBeInTheDocument();
        expect(screen.getByText(/I agree to the/)).toBeInTheDocument();
        expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
        expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });

    it("checkbox is checked when acceptTerms is true", () => {
        render(
            <TermsCheckbox
                acceptTerms={true}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeChecked();
    });

    it("checkbox is unchecked when acceptTerms is false", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();
    });

    it("calls onChange when checkbox is clicked", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it("calls onTermsClick when terms link is clicked", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                termsConfig={{ onTermsClick: mockOnTermsClick }}
                isDarkVariant={false}
            />
        );

        const termsLink = screen.getByText("Terms & Conditions");
        fireEvent.click(termsLink);

        expect(mockOnTermsClick).toHaveBeenCalled();
    });

    it("calls onPrivacyClick when privacy link is clicked", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                termsConfig={{ onPrivacyClick: mockOnPrivacyClick }}
                isDarkVariant={false}
            />
        );

        const privacyLink = screen.getByText("Privacy Policy");
        fireEvent.click(privacyLink);

        expect(mockOnPrivacyClick).toHaveBeenCalled();
    });

    it("shows error message when error prop is provided", () => {
        const errorMessage = "You must accept the terms";
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                error={errorMessage}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("does not show error message when error prop is not provided", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    it("renders custom terms text", () => {
        const customTermsText = "By signing up, you agree to our custom terms";
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                termsConfig={{ termsText: customTermsText }}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText(customTermsText)).toBeInTheDocument();
    });

    it("applies dark variant styles", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={true}
            />
        );

        const label = screen.getByText(/I agree to the/);
        expect(label).toHaveClass("text-gray-400");

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass("border-gray-600");
        expect(checkbox).toHaveClass("bg-gray-700");
    });

    it("applies light variant styles", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const label = screen.getByText(/I agree to the/);
        expect(label).toHaveClass("text-gray-600");

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass("border-gray-300");
    });

    it("applies error styles to checkbox when error exists", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                error="Error message"
                isDarkVariant={false}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass("border-red-500");
    });

    it("has proper accessibility attributes", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                error="Error message"
                isDarkVariant={false}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("aria-label", "Accept terms and conditions");
        expect(checkbox).toHaveAttribute("aria-invalid", "true");
    });

    it("has hover effects on label", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const label = screen.getByText(/I agree to the/);
        expect(label).toHaveClass("group-hover:text-gray-900");
    });

    it("has hover effects on links", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const termsLink = screen.getByText("Terms & Conditions");
        expect(termsLink).toHaveClass("hover:text-blue-700");
    });

    it("handles no termsConfig gracefully", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const termsLink = screen.getByText("Terms & Conditions");
        expect(() => fireEvent.click(termsLink)).not.toThrow();
    });

    it("applies focus styles to checkbox", () => {
        render(
            <TermsCheckbox
                acceptTerms={false}
                onChange={mockOnChange}
                isDarkVariant={false}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass("focus:ring-2");
        expect(checkbox).toHaveClass("focus:ring-blue-500");
    });
});