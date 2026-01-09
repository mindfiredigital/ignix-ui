import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SidebarRightLayout } from ".";

/* ---------------------------------- Mocks ---------------------------------- */

// Lucide icons
vi.mock("lucide-react", () => ({
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

// Framer motion (animation-safe)
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Sidebar context
const setIsOpenMock = vi.fn();

vi.mock("@ignix-ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSidebar: () => ({
    isOpen: true,
    setIsOpen: setIsOpenMock,
  }),
}));

/* -------------------------------- Test Suite -------------------------------- */

describe("SidebarRightLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.innerWidth = 1200;
  });

  /* ----------------------------- Basic Rendering ----------------------------- */

  it("renders children correctly", () => {
    render(
      <SidebarRightLayout>
        <div>Content</div>
      </SidebarRightLayout>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders header when provided", () => {
    render(
      <SidebarRightLayout header={<div>Header</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <SidebarRightLayout footer={<div>Footer</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders sidebar when provided", () => {
    render(
      <SidebarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders without crashing when sidebar is omitted", () => {
    render(
      <SidebarRightLayout>
        <div>Body</div>
      </SidebarRightLayout>
    );
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  /* ------------------------------ Variants ---------------------------------- */

  it("applies dark variant classes", () => {
    const { container } = render(
      <SidebarRightLayout variant="dark">
        <div>Body</div>
      </SidebarRightLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-card");
    expect(root).toHaveClass("text-card-foreground");
  });

  it("applies gradient variant classes", () => {
    const { container } = render(
      <SidebarRightLayout variant="gradient">
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(container.firstChild).toHaveClass("bg-gradient-to-br");
  });

  /* ---------------------------- CSS Variables -------------------------------- */

  it("sets CSS variables for header/footer/sidebar sizes", () => {
    const { container } = render(
      <SidebarRightLayout
        headerHeight={80}
        footerHeight={70}
        sidebarWidth="wide"
        sidebarCollapsedWidth={60}
        sidebar={<div>Sidebar</div>}
      >
        <div>Body</div>
      </SidebarRightLayout>
    );

    const root = container.firstChild as HTMLElement;

    expect(root.style.getPropertyValue("--header-h")).toBe("80px");
    expect(root.style.getPropertyValue("--footer-h")).toBe("70px");
    expect(root.style.getPropertyValue("--sidebar-w")).toBe("320px");
    expect(root.style.getPropertyValue("--sidebar-w-collapsed")).toBe("60px");
  });

  /* -------------------------- Sidebar Collapsing ----------------------------- */

  it("initializes sidebar closed when sidebarCollapsed=true", () => {
    render(
      <SidebarRightLayout sidebarCollapsed sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(setIsOpenMock).toHaveBeenCalledWith(false);
  });

  it("initializes sidebar open when sidebarCollapsed=false", () => {
    render(
      <SidebarRightLayout sidebarCollapsed={false} sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(setIsOpenMock).toHaveBeenCalledWith(true);
  });

  /* ------------------------------ Mobile Mode -------------------------------- */

  it("renders mobile toggle button on small screens", () => {
    global.innerWidth = 500;

    render(
      <SidebarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows overlay on mobile when sidebar is open", () => {
    global.innerWidth = 500;

    const { container } = render(
      <SidebarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(container.querySelector(".bg-black\\/50")).toBeInTheDocument();
  });

  it("clicking overlay closes sidebar", () => {
    global.innerWidth = 500;

    const { container } = render(
      <SidebarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    fireEvent.click(container.querySelector(".bg-black\\/50")!);
    expect(setIsOpenMock).toHaveBeenCalledWith(false);
  });

  it("does not render overlay when overlay=false", () => {
    global.innerWidth = 500;

    const { container } = render(
      <SidebarRightLayout overlay={false} sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(container.querySelector(".bg-black\\/50")).toBeNull();
  });

  /* ----------------------------- Interaction -------------------------------- */

  it("toggles sidebar when mobile button is clicked", () => {
    global.innerWidth = 500;

    render(
      <SidebarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(setIsOpenMock).toHaveBeenCalled();
  });

  it("button has correct aria-label", () => {
    global.innerWidth = 500;

    render(
      <SidebarRightLayout sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-label");
  });

  /* ----------------------------- Footer Logic -------------------------------- */

  it("uses fixed positioning when stickyFooter=true", () => {
    render(
      <SidebarRightLayout stickyFooter footer={<div>Footer</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(screen.getByText("Footer").parentElement).toHaveClass("fixed");
  });

  /* --------------------------- Callback Behavior ----------------------------- */

  it("calls onSidebarToggle when isOpen changes", () => {
    const spy = vi.fn();

    render(
      <SidebarRightLayout sidebar={<div>Sidebar</div>} onSidebarToggle={spy}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(spy).toHaveBeenCalled();
  });

  /* ---------------------------- Defensive Tests ------------------------------ */

  it("renders safely when gestures are disabled", () => {
    render(
      <SidebarRightLayout enableGestures={false} sidebar={<div>Sidebar</div>}>
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders safely with custom className", () => {
    const { container } = render(
      <SidebarRightLayout className="custom-layout">
        <div>Body</div>
      </SidebarRightLayout>
    );

    expect(container.firstChild).toHaveClass("custom-layout");
  });

  it("does not throw when no header, sidebar, or footer is provided", () => {
    expect(() =>
      render(
        <SidebarRightLayout>
          <div>Body</div>
        </SidebarRightLayout>
      )
    ).not.toThrow();
  });
});
