// components/SocialSignUp.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SocialSignUp } from "../../components/SocialSignUp";

// Mock dependencies
vi.mock("../../../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
    Loader2: () => <div data-testid="loader-icon" />,
}));

vi.mock("react-icons/fc", () => ({
    FcGoogle: () => <div data-testid="google-icon" />,
}));

vi.mock("react-icons/fa", () => ({
    FaGithub: () => <div data-testid="github-icon" />,
    FaMicrosoft: () => <div data-testid="microsoft-icon" />,
}));

describe("SocialSignUp Component", () => {
    const mockOnGoogleSignUp = vi.fn();
    const mockOnGitHubSignUp = vi.fn();
    const mockOnMicrosoftSignUp = vi.fn();
    const mockOnSocialSignUp = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all social sign up buttons", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                onGoogleSignUp={mockOnGoogleSignUp}
                onGitHubSignUp={mockOnGitHubSignUp}
                onMicrosoftSignUp={mockOnMicrosoftSignUp}
            />
        );

        expect(screen.getByTestId("google-icon")).toBeInTheDocument();
        expect(screen.getByTestId("github-icon")).toBeInTheDocument();
        expect(screen.getByTestId("microsoft-icon")).toBeInTheDocument();
        expect(screen.getByText("Or sign up with")).toBeInTheDocument();
    });

    it("calls onGoogleSignUp when Google button is clicked", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                onGoogleSignUp={mockOnGoogleSignUp}
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        fireEvent.click(googleButton);

        expect(mockOnGoogleSignUp).toHaveBeenCalled();
    });

    it("calls onGitHubSignUp when GitHub button is clicked", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                onGitHubSignUp={mockOnGitHubSignUp}
            />
        );

        const githubButton = screen.getByRole("button", { name: /sign up with github/i });
        fireEvent.click(githubButton);

        expect(mockOnGitHubSignUp).toHaveBeenCalled();
    });

    it("calls onMicrosoftSignUp when Microsoft button is clicked", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                onMicrosoftSignUp={mockOnMicrosoftSignUp}
            />
        );

        const microsoftButton = screen.getByRole("button", { name: /sign up with microsoft/i });
        fireEvent.click(microsoftButton);

        expect(mockOnMicrosoftSignUp).toHaveBeenCalled();
    });

    it("calls onSocialSignUp with provider when using unified handler", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                onSocialSignUp={mockOnSocialSignUp}
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        fireEvent.click(googleButton);

        expect(mockOnSocialSignUp).toHaveBeenCalledWith('google');
    });

    it("prioritizes onSocialSignUp over individual handlers", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                onSocialSignUp={mockOnSocialSignUp}
                onGoogleSignUp={mockOnGoogleSignUp}
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        fireEvent.click(googleButton);

        expect(mockOnSocialSignUp).toHaveBeenCalledWith('google');
        expect(mockOnGoogleSignUp).not.toHaveBeenCalled();
    });

    it("shows loading state for Google", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                socialLoading="google"
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        expect(googleButton).toHaveClass("opacity-50");
        expect(googleButton).toHaveClass("cursor-wait");
        expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("google-icon")).not.toBeInTheDocument();
    });

    it("shows loading state for GitHub", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                socialLoading="github"
            />
        );

        const githubButton = screen.getByRole("button", { name: /sign up with github/i });
        expect(githubButton).toHaveClass("opacity-50");
        expect(githubButton).toHaveClass("cursor-wait");
        expect(screen.queryByTestId("github-icon")).not.toBeInTheDocument();
    });

    it("shows loading state for Microsoft", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                socialLoading="microsoft"
            />
        );

        const microsoftButton = screen.getByRole("button", { name: /sign up with microsoft/i });
        expect(microsoftButton).toHaveClass("opacity-50");
        expect(microsoftButton).toHaveClass("cursor-wait");
        expect(screen.queryByTestId("microsoft-icon")).not.toBeInTheDocument();
    });

    it("disables button when loading", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
                socialLoading="google"
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        expect(googleButton).toBeDisabled();
    });


    it("has correct accessibility labels", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
            />
        );

        expect(screen.getByRole("button", { name: /sign up with google/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up with github/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up with microsoft/i })).toBeInTheDocument();
    });

    it("applies hover effects", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        expect(googleButton).toHaveClass("hover:bg-gray-50");
        expect(googleButton).toHaveClass("hover:shadow-md");
    });

    it("applies active scale effect", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        expect(googleButton).toHaveClass("active:scale-95");
    });

    it("applies focus styles", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        expect(googleButton).toHaveClass("focus:ring-2");
        expect(googleButton).toHaveClass("focus:ring-blue-500");
    });

    it("renders buttons in grid layout", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
            />
        );

        const buttonsContainer = screen.getByRole("button", { name: /sign up with google/i }).parentElement;
        expect(buttonsContainer).toHaveClass("grid");
        expect(buttonsContainer).toHaveClass("grid-cols-3");
        expect(buttonsContainer).toHaveClass("gap-3");
    });

    it("handles no callback functions gracefully", () => {
        render(
            <SocialSignUp
                isDarkVariant={false}
            />
        );

        const googleButton = screen.getByRole("button", { name: /sign up with google/i });
        expect(() => fireEvent.click(googleButton)).not.toThrow();
    });
});