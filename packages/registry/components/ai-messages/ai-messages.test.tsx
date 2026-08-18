import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { AIMessages } from "./index";
import React from "react";

beforeAll(() => {
  if (typeof window !== "undefined") {
    window.Element.prototype.scrollTo = vi.fn();
    window.HTMLElement.prototype.scrollTo = vi.fn();
  }
});

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

describe("AIMessages component test suite", () => {
  const sampleMessages = [
    {
      id: 1,
      role: "user" as const,
      content: "Hello systems engineering",
      senderName: "User",
    },
    {
      id: 2,
      role: "assistant" as const,
      content: "Deep learning parameters active",
      senderName: "Assistant",
    },
  ];

  it("renders messages content and thinking indicators correctly", () => {
    const { rerender } = render(
      <AIMessages messages={sampleMessages} isThinking={false} />
    );

    expect(screen.getByText("Hello systems engineering")).toBeInTheDocument();
    expect(screen.getByText("Deep learning parameters active")).toBeInTheDocument();
    expect(screen.queryByTestId("thinking-indicator")).not.toBeInTheDocument();

    // Rerender with isThinking
    rerender(
      <AIMessages
        messages={sampleMessages}
        isThinking
        thinkingNode={<div data-testid="thinking-indicator">Thinking...</div>}
      />
    );
    expect(screen.getByTestId("thinking-indicator")).toBeInTheDocument();
  });

  it("renders emptyState node when message history list is empty", () => {
    render(
      <AIMessages
        messages={[]}
        emptyState={<div data-testid="empty-messages">Chat list empty</div>}
      />
    );
    expect(screen.getByTestId("empty-messages")).toBeInTheDocument();
  });
});
