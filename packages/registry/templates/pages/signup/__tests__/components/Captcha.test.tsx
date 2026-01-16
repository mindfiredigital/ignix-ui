// components/Captcha.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Captcha } from "../../components/Captcha";

// Mock dependencies
vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
    Shield: () => <div data-testid="shield-icon" />,
}));

describe("Captcha Component", () => {
    const mockOnVerify = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when CAPTCHA is not enabled", () => {
        const { container } = render(
            <Captcha
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("renders when CAPTCHA is enabled", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("Security Verification")).toBeInTheDocument();
        expect(screen.getByText("Complete the CAPTCHA")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Click to Verify" })).toBeInTheDocument();
    });

    it("shows verified state when verified is true", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={true}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("✓ Verified")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Verified ✓" })).toBeInTheDocument();
    });

    it("calls onVerify when button is clicked", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        const verifyButton = screen.getByRole("button", { name: "Click to Verify" });
        fireEvent.click(verifyButton);

        expect(mockOnVerify).toHaveBeenCalledWith(true);
    });

    it("toggles verification state when clicked", () => {
        const { rerender } = render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        const verifyButton = screen.getByRole("button", { name: "Click to Verify" });
        fireEvent.click(verifyButton);
        expect(mockOnVerify).toHaveBeenCalledWith(true);

        rerender(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={true}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        const verifiedButton = screen.getByRole("button", { name: "Verified ✓" });
        fireEvent.click(verifiedButton);
        expect(mockOnVerify).toHaveBeenCalledWith(false);
    });

    it("applies dark variant styles", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={true}
            />
        );

        const container = screen.getByText("Security Verification").parentElement?.parentElement;
        expect(container).toHaveClass("bg-gray-800/50");
        expect(container).toHaveClass("border-gray-700");
    });

    it("applies light variant styles", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        const container = screen.getByText("Security Verification").parentElement?.parentElement;
        expect(container).toHaveClass("bg-gray-50");
        expect(container).toHaveClass("border-gray-200");
    });

    it("shows error message when provided", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                error="CAPTCHA verification failed"
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("CAPTCHA verification failed")).toBeInTheDocument();
    });

    it("does not show error message when not provided", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    it("has correct accessibility attributes", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        const verifyButton = screen.getByRole("button", { name: "Click to Verify" });
        expect(verifyButton).toBeEnabled();
    });

    it("shows help text", () => {
        render(
            <Captcha
                captchaConfig={{ enabled: true }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("This helps prevent spam")).toBeInTheDocument();
    });

    it("handles custom CAPTCHA configuration", () => {
        render(
            <Captcha
                captchaConfig={{
                    enabled: true,
                    siteKey: "test-site-key",
                    type: "checkbox",
                    theme: "dark"
                }}
                verified={false}
                onVerify={mockOnVerify}
                isDarkVariant={false}
            />
        );

        expect(screen.getByText("Security Verification")).toBeInTheDocument();
    });
});