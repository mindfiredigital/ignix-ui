import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { AISuggestedActions } from "./index";
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

describe("AISuggestedActions component test suite", () => {
  const actionsList = [
    { actionText: "Draft professional email", label: "Business tool" },
    { actionText: "Help me study React patterns", label: "Educational helper" },
  ];

  it("renders suggested actions list correctly", () => {
    render(<AISuggestedActions actions={actionsList} onActionClick={vi.fn()} />);

    expect(screen.getByText("Business tool")).toBeInTheDocument();
    expect(screen.getByText("Educational helper")).toBeInTheDocument();
  });

  it("calls onActionClick callback when an action is selected", () => {
    const handleActionClick = vi.fn();
    render(<AISuggestedActions actions={actionsList} onActionClick={handleActionClick} />);

    const item = screen.getByText("Business tool");
    fireEvent.click(item);
    expect(handleActionClick).toHaveBeenCalledWith("Draft professional email");
  });

  const layouts = ["flex", "grid"] as const;
  layouts.forEach((l) => {
    it(`renders SuggestedActions under layout ${l} without crashing`, () => {
      const { container } = render(
        <AISuggestedActions actions={actionsList} layout={l} onActionClick={vi.fn()} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
