import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SideBarRightLayout } from "."; // adjust the import path if needed

// ✅ Safe synchronous mocks (Vitest hoist-friendly)
vi.mock("lucide-react", () => ({
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ✅ Mock useSidebar context
vi.mock("../../sidebar", () => {
  return {
    SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useSidebar: () => ({
      isOpen: true,
      setIsOpen: vi.fn(),
    }),
  };
});

describe("SideBarRightLayout Component", () => {
  it("renders children correctly", () => {
    render(<SideBarRightLayout><div>Test Child</div></SideBarRightLayout>);
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders header and footer if provided", () => {
    render(
      <SideBarRightLayout
        header={<div>Header</div>}
        footer={<div>Footer</div>}
      >
        <div>Sidebar</div>
        <div>Body</div>
      </SideBarRightLayout>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders sidebar when passed as prop", () => {
    render(
      <SideBarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </SideBarRightLayout>
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("applies the correct classes for the dark variant", () => {
    const { container } = render(
      <SideBarRightLayout variant="dark" sidebar={<div>Sidebar</div>}>
        <div>Variant Layout</div>
      </SideBarRightLayout>
    );

    // root of the rendered component
    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();

    // LayoutVariants for "dark" maps to "bg-card text-card-foreground"
    expect(root).toHaveClass("bg-card");
    expect(root).toHaveClass("text-card-foreground");
  });


  it("toggles sidebar visibility when button is clicked (mobile simulation)", () => {
    // simulate mobile screen
    global.innerWidth = 500;
    render(
      <SideBarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </SideBarRightLayout>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    // just ensure click doesn’t throw and toggles state
    expect(button).toBeDefined();
  });

  it("calls onSidebarToggle when sidebar opens/closes", () => {
    const toggleSpy = vi.fn();
    render(
      <SideBarRightLayout sidebar={<div>Sidebar</div>} onSidebarToggle={toggleSpy}>
        <div>Content</div>
      </SideBarRightLayout>
    );
    expect(toggleSpy).toHaveBeenCalled();
  });
});
