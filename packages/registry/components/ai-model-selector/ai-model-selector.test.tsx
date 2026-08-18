import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIModelSelector } from "./index";
import React from "react";

// Mock Tooltip/Dropdown components to simplify DOM rendering in test
vi.mock("../tooltip", () => ({
  Tooltip: ({ children }: any) => <>{children}</>,
}));

vi.mock("../dropdown", () => {
  return {
    Dropdown: ({ children, trigger }: any) => (
      <div>
        {trigger}
        <div data-testid="dropdown-content">{children}</div>
      </div>
    ),
    DropdownItem: ({ children, onClick, className }: any) => (
      <div onClick={onClick} className={className} data-testid="dropdown-item">
        {children}
      </div>
    ),
    DropdownLabel: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    DropdownSeparator: () => <hr />,
  };
});

describe("AIModelSelector component test suite", () => {
  const customModels = [
    {
      id: "model-1",
      name: "Gemini Pro",
      provider: "Google",
      description: "Balanced reasoning performance",
    },
    {
      id: "model-2",
      name: "Claude Opus",
      provider: "Anthropic",
      description: "State-of-the-art capability",
    },
  ];

  it("renders trigger with active model title", () => {
    render(
      <AIModelSelector
        models={customModels}
        selectedModelId="model-1"
        placeholder="Choose model"
      />
    );

    expect(screen.getAllByText("Gemini Pro")[0]).toBeInTheDocument();
  });

  it("renders placeholder if no model matches active id", () => {
    render(
      <AIModelSelector
        models={customModels}
        selectedModelId="unknown-id"
        placeholder="Choose model"
      />
    );

    expect(screen.getByText("Choose model")).toBeInTheDocument();
  });

  it("opens models dropdown and lists selections when trigger is clicked", async () => {
    const handleModelChange = vi.fn();
    render(
      <AIModelSelector
        models={customModels}
        selectedModelId="model-1"
        onModelChange={handleModelChange}
      />
    );

    const triggerBtn = screen.getByRole("button");
    fireEvent.click(triggerBtn);

    // Verify search box and choices are rendered in list
    expect(screen.getByPlaceholderText("Search models...")).toBeInTheDocument();
    expect(screen.getByText("Claude Opus")).toBeInTheDocument();
  });
});
