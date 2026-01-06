import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Footer } from "../../components/Footer";
import type { FooterProps } from "../../types";

// Mock utils
vi.mock("../../../../utils/cn", () => ({
    cn: (...classes: (string | undefined | boolean)[]) =>
        classes.filter(Boolean).join(" "),
}));

// Mock constants
vi.mock("../constants", () => ({
    FOOTER_CONTENT: {
        default: "© 2025 My Application. All rights reserved.",
    },
}));

describe("Footer Component", () => {
    const defaultProps: FooterProps = {
        variant: "default",
        showFooter: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when showFooter is false", () => {
        const { container } = render(
            <Footer {...defaultProps} showFooter={false} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders default footer content", () => {
        render(<Footer {...defaultProps} />);

        expect(screen.getByText("© 2025 My Application. All rights reserved.")).toBeInTheDocument();
    });

    it("renders custom footer content when provided", () => {
        const customContent = <div data-testid="custom-footer">Custom Footer</div>;
        render(
            <Footer {...defaultProps} footerContent={customContent} />
        );

        expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
        expect(screen.queryByText("© 2025 My Application. All rights reserved.")).not.toBeInTheDocument();
    });

    it("applies solid variant text color", () => {
        const { container } = render(
            <Footer {...defaultProps} variant="solid" />
        );

        const textElement = container.querySelector(".text-center");
        expect(textElement).toHaveClass("text-white");
    });

    it("applies transparent variant text color", () => {
        const { container } = render(
            <Footer {...defaultProps} variant="transparent" />
        );

        const textElement = container.querySelector(".text-center");
        expect(textElement).toHaveClass("text-white");
    });

    it("calls renderFooter when provided", () => {
        const renderFooter = vi.fn(({ variant, content }) => (
            <div data-testid="rendered-footer">
                <div data-testid="footer-variant">{variant}</div>
                {content}
            </div>
        ));

        render(
            <Footer {...defaultProps} renderFooter={renderFooter} />
        );

        expect(renderFooter).toHaveBeenCalledWith({
            variant: "default",
            content: expect.anything(),
        });
        expect(screen.getByTestId("rendered-footer")).toBeInTheDocument();
        expect(screen.getByTestId("footer-variant")).toHaveTextContent("default");
    });

    it("has correct layout classes", () => {
        const { container } = render(<Footer {...defaultProps} />);

        expect(container.firstChild).toHaveClass("flex");
        expect(container.firstChild).toHaveClass("items-center");
        expect(container.firstChild).toHaveClass("justify-center");
        expect(container.firstChild).toHaveClass("w-full");
        expect(container.firstChild).toHaveClass("h-full");
        expect(container.firstChild).toHaveClass("px-4");
    });

    it("renders with different variants", () => {
        const variants = ["default", "light", "dark", "solid", "modern"] as const;

        variants.forEach((variant) => {
            const { container } = render(
                <Footer {...defaultProps} variant={variant} />
            );

            expect(container.firstChild).toBeInTheDocument();
        });
    });
});