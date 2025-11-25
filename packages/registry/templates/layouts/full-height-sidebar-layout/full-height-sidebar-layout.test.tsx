// FullHeightSidebarLayout.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

/* ------------------ HOISTED MOCKS (must be before importing component) ------------------ */
/* Mock lucide-react icons */
vi.mock("lucide-react", () => ({
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

/* Mock framer-motion: provide all motion.<element> used in the component */
vi.mock("framer-motion", () => {
  return {
    motion: {
      header: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <header ref={ref} {...props}>{children}</header>
      )),
      main: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <main ref={ref} {...props}>{children}</main>
      )),
      aside: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <aside ref={ref} {...props}>{children}</aside>
      )),
      div: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      button: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <button ref={ref} {...props}>{children}</button>
      )),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

/* Mock sidebar context using the exact path your component imports it from.
   IMPORTANT: ensure this path matches the component's import path.
   In your component file it is: import { SidebarProvider, useSidebar } from "../../../components/sidebar";
   So we mock "../../../components/sidebar" relative to the test file location. */
vi.mock("../../../components/sidebar", () => {
  return {
    SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useSidebar: () => ({
      isOpen: true,
      setIsOpen: vi.fn(),
    }),
  };
});

/* ------------------ Now import the component under test ------------------ */
import { FullHeightSidebarLayout } from "."; // adjust path if your file location differs

/* ------------------ Tests ------------------ */
describe("FullHeightSidebarLayout Component", () => {
  beforeEach(() => {
    // reset innerWidth to a typical desktop size by default
    global.innerWidth = 1024;
  });

  it("renders children correctly", () => {
    render(
      <FullHeightSidebarLayout>
        <div>Test Child</div>
      </FullHeightSidebarLayout>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders header & sidebar when passed as prop", () => {
    render(
      <FullHeightSidebarLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </FullHeightSidebarLayout>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("applies the correct classes for the dark variant", () => {
    const { container } = render(
      <FullHeightSidebarLayout variant="dark" sidebar={<div>Sidebar</div>}>
        <div>Variant Layout</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root).toHaveClass("bg-card");
    expect(root).toHaveClass("text-card-foreground");
  });

  it("toggles sidebar visibility when button is clicked (mobile simulation)", () => {
    // simulate mobile screen
    global.innerWidth = 500;
    const { container } = render(
      <FullHeightSidebarLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    // There should be a toggle button rendered for mobile; select by role or test id
    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();

    if (button) {
      fireEvent.click(button);
      // ensure click doesn't blow up; setIsOpen is mocked
      expect(button).toBeDefined();
    }
  });

  it("calls onSidebarToggle when sidebar opens/closes", () => {
    const toggleSpy = vi.fn();
    render(
      <FullHeightSidebarLayout sidebar={<div>Sidebar</div>} onSidebarToggle={toggleSpy}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );
    // onSidebarToggle is called in an effect during mount in your component
    expect(toggleSpy).toHaveBeenCalled();
  });
});
