import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIThinkingIndicator } from "./index";
import React from "react";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        React.forwardRef(({ children, ...rest }: any, ref) =>
          React.createElement(tag, { ...rest, ref }, children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe("AIThinkingIndicator rendering", () => {
  it("renders without crashing", () => {
    render(<AIThinkingIndicator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses a default aria-label of 'Thinking'", () => {
    render(<AIThinkingIndicator />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Thinking");
  });

  it("renders the label text when provided", () => {
    render(<AIThinkingIndicator label="Generating response..." />);
    expect(screen.getByText("Generating response...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Generating response..."
    );
  });
});

describe("AIThinkingIndicator type prop", () => {
  it.each([
    "dots",
    "pulse",
    "wave",
    "skeleton",
    "sparkle",
    "bloom",
    "ring",
    "bars",
  ] as const)('type="%s" renders', (type) => {
    render(<AIThinkingIndicator type={type} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("defaults to the dots type", () => {
    const { container } = render(<AIThinkingIndicator />);
    expect(container.querySelectorAll("span").length).toBeGreaterThanOrEqual(3);
  });

  it("renders a Sparkles icon for the sparkle type", () => {
    const { container } = render(<AIThinkingIndicator type="sparkle" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the flower glyph for the bloom type", () => {
    render(<AIThinkingIndicator type="bloom" />);
    expect(screen.getByRole("status").textContent).toContain(
      String.fromCharCode(0x273b)
    );
  });

  it("renders Spinner's ring markup for the ring type", () => {
    const { container } = render(<AIThinkingIndicator type="ring" />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders Spinner's bars markup for the bars type", () => {
    const { container } = render(<AIThinkingIndicator type="bars" />);
    expect(container.querySelectorAll("div").length).toBeGreaterThanOrEqual(8);
  });
});

describe("AIThinkingIndicator variant prop", () => {
  it.each([
    ["default", "bg-background"],
    ["dark", "bg-[var(--color-dark-dropdown-bg)]"],
    ["glass", "backdrop-blur-xl"],
    ["minimal", "bg-transparent"],
  ] as const)('variant="%s" applies class "%s"', (variant, expectedClass) => {
    render(<AIThinkingIndicator variant={variant} />);
    expect(screen.getByRole("status").className).toContain(expectedClass);
  });
});

describe("AIThinkingIndicator size prop", () => {
  it.each([
    ["sm", "text-xs"],
    ["md", "text-sm"],
    ["lg", "text-base"],
  ] as const)('size="%s" applies class "%s"', (size, expectedClass) => {
    render(<AIThinkingIndicator size={size} />);
    expect(screen.getByRole("status").className).toContain(expectedClass);
  });
});

describe("AIThinkingIndicator className", () => {
  it("applies custom className", () => {
    render(<AIThinkingIndicator className="custom" />);
    expect(screen.getByRole("status").className).toContain("custom");
  });
});

describe("AIThinkingIndicator sound prop", () => {
  it("does not throw when sound is enabled without a soundUrl", () => {
    expect(() => render(<AIThinkingIndicator sound />)).not.toThrow();
  });
});

describe("AIThinkingIndicator displayName", () => {
  it("has correct displayName", () => {
    expect(AIThinkingIndicator.displayName).toBe("AIThinkingIndicator");
  });
});
