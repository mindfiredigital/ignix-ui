import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { AIMessageBubble } from "./index";
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
  };
});

describe("AIMessageBubble component test suite", () => {
  it("renders content and sender details successfully", () => {
    render(
      <AIMessageBubble
        role="assistant"
        senderName="Ignix AI Helper"
        timestamp="Just now"
        content="Response text content"
      />
    );

    expect(screen.getByText("Response text content")).toBeInTheDocument();
    expect(screen.getByText("Ignix AI Helper")).toBeInTheDocument();
    expect(screen.getByText("Just now")).toBeInTheDocument();
  });

  const roles = ["user", "assistant", "system"] as const;
  roles.forEach((r) => {
    it(`renders bubble variant for role ${r} without crashing`, () => {
      const { container } = render(
        <AIMessageBubble role={r} content="Test text" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it("renders copy button if showCopy is true and invokes copy operation", async () => {
    // Mock navigator.clipboard
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      configurable: true,
      writable: true,
    });

    const { container } = render(
      <AIMessageBubble
        role="user"
        content="Text to be copied"
        showCopy
      />
    );

    const copyBtn = screen.getByRole("button", { name: "Copy message" });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);
    expect(mockWriteText).toHaveBeenCalledWith("Text to be copied");

    // Expect the copy button icon/label to show Copied check icon
    await waitFor(() => {
      expect(container.querySelector(".lucide-check")).toBeInTheDocument();
    });
  });

  it("renders custom actions and avatar slot content", () => {
    render(
      <AIMessageBubble
        role="assistant"
        content="Hello helper"
        avatar={<div data-testid="user-avatar">AV</div>}
        actions={<button data-testid="custom-action-btn">Regenerate</button>}
      />
    );

    expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("custom-action-btn")).toBeInTheDocument();
  });
});
