import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AIStreamingText } from "./index";
import React from "react";

describe("AIStreamingText component test suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders text in simulation chunk-by-chunk successfully", () => {
    const handleComplete = vi.fn();
    const handleStart = vi.fn();

    render(
      <AIStreamingText
        text="Fast neural inference active"
        speed={10}
        mode="char"
        onStart={handleStart}
        onComplete={handleComplete}
      />
    );

    expect(handleStart).toHaveBeenCalled();

    // Fast-forward timers to complete simulation
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText("Fast neural inference active")).toBeInTheDocument();
    expect(handleComplete).toHaveBeenCalled();
  });

  it("renders with custom blinking cursor while streaming", () => {
    render(
      <AIStreamingText
        text="Processing stream"
        isStreaming
        showCursor
        cursor={<span data-testid="blinking-cursor">_</span>}
      />
    );

    expect(screen.getByTestId("blinking-cursor")).toBeInTheDocument();
  });
});
