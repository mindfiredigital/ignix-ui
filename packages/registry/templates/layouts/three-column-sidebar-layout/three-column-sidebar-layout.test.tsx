// ThreeColumnSidebarLayout.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
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
import { ThreeColumnSidebarLayout } from "."; // adjust path if your file location differs

/* ------------------ Tests ------------------ */
describe("ThreeColumnSidebarLayout Component", () => {
  beforeEach(() => {
    // reset innerWidth to a typical desktop size by default
    global.innerWidth = 1024;
  });

  it("renders children correctly", () => {
    render(
      <ThreeColumnSidebarLayout>
        <div>Test Child</div>
      </ThreeColumnSidebarLayout>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders header & sidebar when passed as prop", () => {
    render(
      <ThreeColumnSidebarLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </ThreeColumnSidebarLayout>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("No footer (mobile simulation)", () => {
    // simulate mobile screen
    global.innerWidth = 500;

    // 🔥 IMPORTANT: trigger resize event
    global.dispatchEvent(new Event("resize"));

    render(
      <ThreeColumnSidebarLayout
        sidebar={<div>Sidebar</div>}
        footer={<div>Footer</div>}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // ✅ Use queryByText + not.toBeInTheDocument
    expect(screen.queryByText("Footer")).not.toBeInTheDocument();
  });

});
