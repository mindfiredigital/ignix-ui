import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIResponseActions } from "./index";
import React from "react";

// Mock Tooltip component to simplify DOM queries
vi.mock("../tooltip", () => ({
  Tooltip: ({ children, content }: any) => (
    <div data-testid="tooltip-wrapper" data-content={content}>
      {children}
    </div>
  ),
}));

describe("AIResponseActions component test suite", () => {
  it("triggers callbacks when copy and regenerate buttons are clicked", () => {
    const handleCopy = vi.fn();
    const handleRegenerate = vi.fn();

    render(
      <AIResponseActions
        content="Response data"
        onCopy={handleCopy}
        onRegenerate={handleRegenerate}
      />
    );

    const copyBtn = screen.getByRole("button", { name: "Copy message" });
    fireEvent.click(copyBtn);
    expect(handleCopy).toHaveBeenCalled();

    const regenerateBtn = screen.getByRole("button", { name: "Regenerate response" });
    fireEvent.click(regenerateBtn);
    expect(handleRegenerate).toHaveBeenCalled();
  });

  it("handles feedback up/down selections correctly", () => {
    const handleFeedback = vi.fn();
    render(<AIResponseActions content="Response data" onFeedback={handleFeedback} />);

    const upBtn = screen.getByRole("button", { name: "Helpful feedback" });
    fireEvent.click(upBtn);
    expect(handleFeedback).toHaveBeenCalledWith("up");

    const downBtn = screen.getByRole("button", { name: "Unhelpful feedback" });
    fireEvent.click(downBtn);
    expect(handleFeedback).toHaveBeenCalledWith("down");
  });

  it("fires bookmark toggle callback successfully", () => {
    const handleBookmark = vi.fn();
    render(<AIResponseActions content="Response data" onBookmark={handleBookmark} isBookmarked={false} />);

    const bookmarkBtn = screen.getByRole("button", { name: "Bookmark response" });
    fireEvent.click(bookmarkBtn);
    expect(handleBookmark).toHaveBeenCalled();
  });
});
