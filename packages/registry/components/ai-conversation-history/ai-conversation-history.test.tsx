import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIConversationHistory } from "./index";
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
    useMotionValue: (initial: any) => ({
      get: () => initial,
      set: vi.fn(),
      onChange: vi.fn(),
    }),
    useSpring: () => 0,
    useTransform: () => 0,
  };
});

describe("AIConversationHistory component test suite", () => {
  const sampleSessions = [
    {
      id: "session-1",
      title: "Model parameters question",
      timestamp: new Date(),
    },
    {
      id: "session-2",
      title: "React components performance",
      timestamp: new Date(),
    },
  ];

  it("renders sessions list and search box", () => {
    render(
      <AIConversationHistory
        sessions={sampleSessions}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByText("Model parameters question")).toBeInTheDocument();
    expect(screen.getByText("React components performance")).toBeInTheDocument();
    expect(screen.getByText("Search chat history...")).toBeInTheDocument();
  });

  it("triggers search callbacks when query changes", () => {
    const handleSearchChange = vi.fn();
    render(
      <AIConversationHistory
        sessions={sampleSessions}
        searchQuery="react"
        onSearchChange={handleSearchChange}
      />
    );

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "performance" } });
    expect(handleSearchChange).toHaveBeenCalledWith("performance");
  });

  it("invokes session callbacks when selecting a session", () => {
    const handleSelect = vi.fn();
    render(
      <AIConversationHistory
        sessions={sampleSessions}
        searchQuery=""
        onSearchChange={vi.fn()}
        onSessionSelect={handleSelect}
      />
    );

    const sessionEl = screen.getByText("React components performance");
    fireEvent.click(sessionEl);
    expect(handleSelect).toHaveBeenCalledWith("session-2");
  });

  it("triggers onNewChat callback when 'New Chat' button is clicked", () => {
    const handleNewChat = vi.fn();
    render(
      <AIConversationHistory
        sessions={sampleSessions}
        searchQuery=""
        onSearchChange={vi.fn()}
        onNewChat={handleNewChat}
      />
    );

    const newChatBtn = screen.getByRole("button", { name: /New/i });
    fireEvent.click(newChatBtn);
    expect(handleNewChat).toHaveBeenCalled();
  });
});
