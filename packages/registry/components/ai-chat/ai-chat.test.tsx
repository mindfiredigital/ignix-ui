import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import "@testing-library/jest-dom";
import { AIChat } from "./index";
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

describe("AIChat component test suite", () => {
  const sampleMessages = [
    {
      id: "msg-1",
      role: "user" as const,
      content: "Hello",
      timestamp: "Just now",
    },
    {
      id: "msg-2",
      role: "assistant" as const,
      content: "Hi there!",
      timestamp: "Just now",
    },
  ];

  it("renders messages list and chat input", () => {
    const handleSend = vi.fn();
    const handleInputChange = vi.fn();

    render(
      <AIChat
        messages={sampleMessages}
        inputValue="draft request"
        onInputChange={handleInputChange}
        onSend={handleSend}
        inputPlaceholder="Type your request"
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type your request")).toBeInTheDocument();
  });

  it("calls input change and send callback actions", () => {
    const handleSend = vi.fn();
    const handleInputChange = vi.fn();

    render(
      <AIChat
        messages={sampleMessages}
        inputValue="draft request"
        onInputChange={handleInputChange}
        onSend={handleSend}
      />
    );

    const input = screen.getByDisplayValue("draft request");
    fireEvent.change(input, { target: { value: "new request" } });
    expect(handleInputChange).toHaveBeenCalledWith("new request");

    const sendBtn = screen.getByRole("button", { name: "Send message" });
    fireEvent.click(sendBtn);
    expect(handleSend).toHaveBeenCalledWith("draft request");
  });

  it("renders emptyState component when message list is empty", () => {
    render(
      <AIChat
        messages={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onSend={vi.fn()}
        emptyState={<div data-testid="empty-layout">No conversations yet</div>}
      />
    );

    expect(screen.getByTestId("empty-layout")).toBeInTheDocument();
  });

  it("renders suggested actions and triggers click callback", () => {
    const handleActionClick = vi.fn();
    const actions = [
      { actionText: "Help me write code", label: "Developer tool" },
    ];

    render(
      <AIChat
        messages={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onSend={vi.fn()}
        suggestedActions={actions}
        onSuggestedActionClick={handleActionClick}
      />
    );

    const actionBtn = screen.getByText("Developer tool");
    expect(actionBtn).toBeInTheDocument();
    fireEvent.click(actionBtn);
    expect(handleActionClick).toHaveBeenCalledWith("Help me write code");
  });
});
