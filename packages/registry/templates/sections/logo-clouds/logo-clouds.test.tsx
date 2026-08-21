// logo-clouds.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock Typography
vi.mock("@ignix-ui/typography", () => ({
    Typography: ({ children, variant, weight, className, ...props }: any) => (
        <div
            className={className}
            data-testid="typography"
            data-variant={variant}
            data-weight={weight}
            {...props}
        >
            {children}
        </div>
    ),
}));

// Mock the cn utility
vi.mock("../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock framer-motion (including useReducedMotion, used to gate the marquee animation)
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, className, animate, transition: _transition, ...props }: any) => (
            <div
                className={className}
                data-testid="motion-div"
                data-animating={animate ? "true" : "false"}
                {...props}
            >
                {children}
            </div>
        ),
    },
    useReducedMotion: vi.fn(() => false),
}));

import { LogoClouds, type LogoCloudItem } from "./index";
import * as framerMotion from "framer-motion";

const sampleLogos: LogoCloudItem[] = [
    { id: "1", name: "Acme", src: "/acme.svg" },
    { id: "2", name: "Globex", src: "/globex.svg" },
    { id: "3", name: "Initech", src: "/initech.svg" },
    { id: "4", name: "Umbrella", src: "/umbrella.svg" },
];

describe("LogoClouds", () => {
    describe("Basic rendering", () => {
        it("renders without crashing", () => {
            render(<LogoClouds logos={sampleLogos} />);
            expect(screen.getAllByRole("listitem")).toHaveLength(sampleLogos.length);
        });

        it("returns null when logos array is empty", () => {
            const { container } = render(<LogoClouds logos={[]} />);
            expect(container.firstChild).toBeNull();
        });

        it("renders an image for each logo with the logo's name as alt text", () => {
            render(<LogoClouds logos={sampleLogos} />);
            for (const logo of sampleLogos) {
                expect(screen.getByAltText(logo.name)).toBeInTheDocument();
            }
        });

        it("renders a custom icon instead of an image when provided", () => {
            const logosWithIcon: LogoCloudItem[] = [
                { id: "1", name: "Acme", icon: <svg data-testid="custom-icon" /> },
            ];
            render(<LogoClouds logos={logosWithIcon} />);
            expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
            expect(screen.queryByRole("img")).not.toBeInTheDocument();
        });

        it("renders title and subtitle when provided", () => {
            render(
                <LogoClouds
                    logos={sampleLogos}
                    title="Trusted by teams at"
                    subtitle="Join thousands of companies"
                />
            );
            expect(screen.getByText("Trusted by teams at")).toBeInTheDocument();
            expect(screen.getByText("Join thousands of companies")).toBeInTheDocument();
        });

        it("does not render a title/subtitle block when neither is provided", () => {
            render(<LogoClouds logos={sampleLogos} />);
            expect(screen.queryByTestId("typography")).not.toBeInTheDocument();
        });
    });

    describe("Linked logos", () => {
        it("renders a logo as an anchor when href is provided", () => {
            const logosWithLink: LogoCloudItem[] = [
                { id: "1", name: "Acme", src: "/acme.svg", href: "https://acme.example" },
            ];
            render(<LogoClouds logos={logosWithLink} />);
            const link = screen.getByRole("link", { name: "Acme" });
            expect(link).toHaveAttribute("href", "https://acme.example");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("renders a logo as a plain listitem when href is not provided", () => {
            render(<LogoClouds logos={sampleLogos} />);
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });
    });

    describe("Grid variant", () => {
        it("renders a list role for the logo container by default", () => {
            render(<LogoClouds logos={sampleLogos} />);
            expect(screen.getAllByRole("list")).toHaveLength(1);
        });

        it("applies grayscale classes by default", () => {
            render(<LogoClouds logos={sampleLogos} />);
            const items = screen.getAllByRole("listitem");
            expect(items[0]).toHaveClass("grayscale");
        });

        it("omits grayscale classes when grayscale is false", () => {
            render(<LogoClouds logos={sampleLogos} grayscale={false} />);
            const items = screen.getAllByRole("listitem");
            expect(items[0]).not.toHaveClass("grayscale");
        });
    });

    describe("Marquee variant", () => {
        it("duplicates the logo list to create a seamless loop", () => {
            render(<LogoClouds logos={sampleLogos} variant="marquee" />);
            // Each logo's image appears twice: once visible, once aria-hidden duplicate.
            expect(screen.getAllByAltText(sampleLogos[0].name)).toHaveLength(2);
        });

        it("hides the duplicated set from assistive tech", () => {
            render(<LogoClouds logos={sampleLogos} variant="marquee" />);
            const images = screen.getAllByAltText(sampleLogos[0].name);
            const hiddenAncestor = images[1].closest('[aria-hidden="true"]');
            expect(hiddenAncestor).not.toBeNull();
        });

        it("animates by default when motion is not reduced", () => {
            render(<LogoClouds logos={sampleLogos} variant="marquee" />);
            expect(screen.getByTestId("motion-div")).toHaveAttribute("data-animating", "true");
        });

        it("does not animate when the user prefers reduced motion", () => {
            vi.mocked(framerMotion.useReducedMotion).mockReturnValueOnce(true);
            render(<LogoClouds logos={sampleLogos} variant="marquee" />);
            expect(screen.getByTestId("motion-div")).toHaveAttribute("data-animating", "false");
        });
    });

    describe("Accessibility", () => {
        it("sets aria-label on the section from the title", () => {
            render(<LogoClouds logos={sampleLogos} title="Trusted by teams at" />);
            expect(screen.getByRole("region", { name: "Trusted by teams at" })).toBeInTheDocument();
        });

        it("falls back to a default aria-label when no title is provided", () => {
            render(<LogoClouds logos={sampleLogos} />);
            expect(screen.getByRole("region", { name: "Trusted by" })).toBeInTheDocument();
        });
    });

    describe("Customization", () => {
        it("applies className to the root section", () => {
            const { container } = render(
                <LogoClouds logos={sampleLogos} className="custom-root" />
            );
            expect(container.firstChild).toHaveClass("custom-root");
        });

        it("applies logoClassName to each logo wrapper", () => {
            render(<LogoClouds logos={sampleLogos} logoClassName="custom-logo" />);
            const items = screen.getAllByRole("listitem");
            expect(items[0]).toHaveClass("custom-logo");
        });

        it("adds a border when bordered is true", () => {
            const { container } = render(<LogoClouds logos={sampleLogos} bordered />);
            expect(container.firstChild).toHaveClass("border-y");
        });
    });
});
