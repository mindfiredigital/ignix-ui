import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AICodeBlock } from "./index";

describe("AICodeBlock Component", () => {
  const sampleCode = `const x = 42;\nconsole.log(x);`;

  beforeEach(() => {
    // Mock navigator.clipboard
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
      configurable: true,
    });
  });

  it("renders code block with language label and syntax tokens", () => {
    render(
      <AICodeBlock
        code={sampleCode}
        language="typescript"
      />
    );

    // Language label shown in header
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    // Syntax tokens rendered
    expect(screen.getByText("const")).toBeInTheDocument();
    expect(screen.getByText("console")).toBeInTheDocument();
  });

  it("toggles line numbers when the Lines button is clicked", () => {
    render(
      <AICodeBlock
        code={sampleCode}
        language="typescript"
        showLineNumbers={true}
        lineNumberToggle={true}
      />
    );

    // Line numbers visible initially
    expect(screen.queryByText("1")).toBeInTheDocument();

    // The toggle button text is "Lines on" when line numbers are active
    const toggleBtn = screen.getByTitle("Hide line numbers");
    fireEvent.click(toggleBtn);

    // After toggling off, line numbers should disappear
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("triggers clipboard write when Copy code button is clicked", () => {
    const handleCopy = vi.fn();
    render(
      <AICodeBlock
        code={sampleCode}
        language="typescript"
        onCopy={handleCopy}
      />
    );

    // Button text is "Copy code" (with an icon span alongside it)
    const copyBtn = screen.getByText(/copy code/i);
    fireEvent.click(copyBtn.closest("button")!);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleCode);
    expect(handleCopy).toHaveBeenCalledWith(sampleCode);
  });
});
