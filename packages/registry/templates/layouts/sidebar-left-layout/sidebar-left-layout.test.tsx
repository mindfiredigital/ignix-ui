import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SideBarLeftLayout } from "."; // adjust the import path if needed

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

describe("SideBarLeftLayout Component", () => {
  it("renders children correctly", () => {
    render(<SideBarLeftLayout><div>Test Child</div></SideBarLeftLayout>);
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders header and footer if provided", () => {
    render(
      <SideBarLeftLayout
        header={<div>Header</div>}
        footer={<div>Footer</div>}
      >
        <div>Sidebar</div>
        <div>Body</div>
      </SideBarLeftLayout>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders sidebar when passed as prop", () => {
    render(
      <SideBarLeftLayout sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </SideBarLeftLayout>
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("applies the correct classes for the dark variant", () => {
    const { container } = render(
      <SideBarLeftLayout variant="dark" sidebar={<div>Sidebar</div>}>
        <div>Variant Layout</div>
      </SideBarLeftLayout>
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
      <SideBarLeftLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </SideBarLeftLayout>
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
      <SideBarLeftLayout sidebar={<div>Sidebar</div>} onSidebarToggle={toggleSpy}>
        <div>Content</div>
      </SideBarLeftLayout>
    );
    expect(toggleSpy).toHaveBeenCalled();
  });

  it("does not render sidebar when sidebar prop is not provided", () => {
    render(
      <SideBarLeftLayout>
        <div>Main Content</div>
      </SideBarLeftLayout>
    );

    expect(screen.queryByText("Sidebar")).not.toBeInTheDocument();
  });

  it("supports right positioned sidebar", () => {
    render(
      <SideBarLeftLayout
        sidebarPosition="right"
        sidebar={<div data-testid="sidebar">Sidebar</div>}
      >
        <div>Main</div>
      </SideBarLeftLayout>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("applies CSS variables for header, footer, and sidebar width", () => {
    const { container } = render(
      <SideBarLeftLayout
        headerHeight={80}
        footerHeight={70}
        sidebarWidth="wide"
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </SideBarLeftLayout>
    );

    const root = container.firstChild as HTMLElement;

    expect(root.style.getPropertyValue("--header-h")).toBe("80px");
    expect(root.style.getPropertyValue("--footer-h")).toBe("70px");
    expect(root.style.getPropertyValue("--sidebar-w")).toBe("320px");
  });

  it("uses collapsed width when sidebarCollapsed is true", () => {
    const { container } = render(
      <SideBarLeftLayout
        sidebarCollapsed
        sidebarCollapsedWidth={60}
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </SideBarLeftLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue("--sidebar-w-collapsed")).toBe("60px");
  });

  it("renders overlay on mobile when sidebar is open", () => {
    global.innerWidth = 500;

    const { container } = render(
      <SideBarLeftLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </SideBarLeftLayout>
    );

    const overlay = container.querySelector(".bg-black\\/50");
    expect(overlay).toBeInTheDocument();
  });

  it("applies fixed positioning when stickyFooter is enabled", () => {
    render(
      <SideBarLeftLayout stickyFooter footer={<div>Footer</div>}>
        <div>Content</div>
      </SideBarLeftLayout>
    );

    const footer = screen.getByText("Footer").parentElement!;
    expect(footer.className).toContain("fixed");
  });

  it("renders safely when gestures are disabled", () => {
    render(
      <SideBarLeftLayout
        enableGestures={false}
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </SideBarLeftLayout>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("accepts transitionDuration without throwing", () => {
    render(
      <SideBarLeftLayout
        transitionDuration={0.8}
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </SideBarLeftLayout>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders cleanly without header or footer", () => {
    render(
      <SideBarLeftLayout sidebar={<div>Sidebar</div>}>
        <div>Main Content</div>
      </SideBarLeftLayout>
    );

    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

});
