import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AITokenCounter } from "./index";
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

describe("AITokenCounter component test suite", () => {
  it("renders input, output and percentage bounds correctly", () => {
    render(
      <AITokenCounter
        inputTokens={1000}
        outputTokens={500}
        maxTokens={3000}
        mode="detailed"
        label="Deepmind Gemini"
        animate={false}
      />
    );

    expect(screen.getByText("Deepmind Gemini")).toBeInTheDocument();
    expect(screen.getByText("1,500")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument(); 
    expect(screen.getByText("500")).toBeInTheDocument(); 
  });

  const modes = ["bar", "circular", "compact", "detailed"] as const;
  modes.forEach((m) => {
    it(`renders token counter layout mode ${m} without crashing`, () => {
      const { container } = render(
        <AITokenCounter inputTokens={200} outputTokens={100} mode={m} animate={false} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
