import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIStatusBadge } from "./index";
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

describe("AIStatusBadge rendering", () => {
  it("renders without crashing", () => {
    render(<AIStatusBadge status="idle" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the default label for the status", () => {
    render(<AIStatusBadge status="ready" />);
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<AIStatusBadge status="thinking" label="Working on it" />);
    expect(screen.getByText("Working on it")).toBeInTheDocument();
  });

  it("renders the model name when provided", () => {
    render(<AIStatusBadge status="streaming" model="gpt-4" />);
    expect(screen.getByText(/gpt-4/)).toBeInTheDocument();
  });

  it("does not render model text when not provided", () => {
    render(<AIStatusBadge status="streaming" />);
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
  });
});

describe("AIStatusBadge status prop", () => {
  it.each([
    ["idle", "Idle"],
    ["thinking", "Thinking"],
    ["streaming", "Streaming"],
    ["error", "Error"],
    ["ready", "Ready"],
  ] as const)('status="%s" renders label "%s"', (status, expectedLabel) => {
    render(<AIStatusBadge status={status} />);
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it("sets an aria-label describing the status", () => {
    render(<AIStatusBadge status="error" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "AI status: Error"
    );
  });
});

describe("AIStatusBadge variant prop", () => {
  it.each([
    ["default", "bg-background"],
    ["dark", "bg-[var(--color-dark-dropdown-bg)]"],
    ["glass", "backdrop-blur-xl"],
    ["minimal", "bg-transparent"],
  ] as const)('variant="%s" applies class "%s"', (variant, expectedClass) => {
    render(<AIStatusBadge status="idle" variant={variant} />);
    expect(screen.getByRole("status").className).toContain(expectedClass);
  });
});

describe("AIStatusBadge size prop", () => {
  it.each([
    ["sm", "text-xs"],
    ["md", "text-sm"],
    ["lg", "text-base"],
  ] as const)('size="%s" applies class "%s"', (size, expectedClass) => {
    render(<AIStatusBadge status="idle" size={size} />);
    expect(screen.getByRole("status").className).toContain(expectedClass);
  });
});

describe("AIStatusBadge className", () => {
  it("applies custom className", () => {
    render(<AIStatusBadge status="idle" className="custom" />);
    expect(screen.getByRole("status").className).toContain("custom");
  });
});

describe("AIStatusBadge displayName", () => {
  it("has correct displayName", () => {
    expect(AIStatusBadge.displayName).toBe("AIStatusBadge");
  });
});
