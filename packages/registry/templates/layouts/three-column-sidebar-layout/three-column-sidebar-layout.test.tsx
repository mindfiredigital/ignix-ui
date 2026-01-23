// ThreeColumnSidebarLayout.test.tsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
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

/* Mock sidebar context using the exact path your component imports it from. */
vi.mock("@ignix-ui/sidebar", () => {
  const mockToggle = vi.fn();
  return {
    SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useSidebar: () => ({
      isOpen: true,
      setOpen: vi.fn(),
      toggle: mockToggle,
      onOpen: vi.fn(),
      onClose: vi.fn(),
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

  it("renders footer when provided", () => {
    render(
      <ThreeColumnSidebarLayout footer={<div>Footer Content</div>}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders right sidebar when provided", () => {
    render(
      <ThreeColumnSidebarLayout rightSidebar={<div>Right Sidebar</div>}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );
    expect(screen.getByText("Right Sidebar")).toBeInTheDocument();
  });

  it("renders navItems correctly", () => {
    const navItems = [
      {
        label: "Getting Started",
        items: [
          { label: "Installation", href: "#install", active: true },
          { label: "Quick Start", href: "#quickstart" },
        ],
      },
    ];

    render(
      <ThreeColumnSidebarLayout navItems={navItems}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Installation")).toBeInTheDocument();
    expect(screen.getByText("Quick Start")).toBeInTheDocument();
  });

  it("renders tocItems correctly", () => {
    const tocItems = [
      {
        label: "On this page",
        items: [
          { label: "Overview", href: "#overview" },
          { label: "Usage", href: "#usage" },
        ],
      },
    ];

    render(
      <ThreeColumnSidebarLayout tocItems={tocItems}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    expect(screen.getByText("On this page")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ThreeColumnSidebarLayout className="custom-class">
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("custom-class");
  });

  it("applies custom sidebar width via CSS variable", () => {
    render(
      <ThreeColumnSidebarLayout sidebarWidth={350}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--layout-sidebar-w")).toBe("350px");
  });

  it("applies custom right sidebar width via CSS variable", () => {
    render(
      <ThreeColumnSidebarLayout rightSidebarWidth={280}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--layout-right-sidebar-w")).toBe("280px");
  });

  it("applies custom header height via CSS variable", () => {
    render(
      <ThreeColumnSidebarLayout headerHeight={80}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--layout-header-h")).toBe("80px");
  });

  it("applies custom footer height via CSS variable", () => {
    render(
      <ThreeColumnSidebarLayout footerHeight={100} footer={<div>Footer</div>}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--layout-footer-h")).toBe("100px");
  });

  it("applies custom z-index values via CSS variables", () => {
    const zIndex = {
      header: 100,
      sidebar: 90,
      footer: 80,
      overlay: 200,
    };

    render(
      <ThreeColumnSidebarLayout zIndex={zIndex}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--layout-header-z")).toBe("100");
    expect(root.style.getPropertyValue("--layout-sidebar-z")).toBe("90");
    expect(root.style.getPropertyValue("--layout-footer-z")).toBe("80");
    expect(root.style.getPropertyValue("--layout-overlay-z")).toBe("200");
  });

  it("applies sticky header class when stickyHeader is true", () => {
    const { container } = render(
      <ThreeColumnSidebarLayout
        header={<div>Header</div>}
        stickyHeader={true}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky");
  });

  it("does not apply sticky header class when stickyHeader is false", () => {
    const { container } = render(
      <ThreeColumnSidebarLayout
        header={<div>Header</div>}
        stickyHeader={false}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const header = container.querySelector("header");
    expect(header).not.toHaveClass("sticky");
  });

  it("applies sticky footer class when stickyFooter is true", () => {
    const { container } = render(
      <ThreeColumnSidebarLayout
        footer={<div>Footer</div>}
        stickyFooter={true}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("sticky");
  });

  it("hides sidebars on mobile viewport with sm breakpoint", () => {
    global.innerWidth = 500; // Mobile size
    global.dispatchEvent(new Event("resize"));

    const { container } = render(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="sm"
        sidebar={<div>Left Sidebar</div>}
        rightSidebar={<div>Right Sidebar</div>}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // Desktop sidebars should not be visible
    const desktopSidebars = container.querySelectorAll(
      'aside[aria-label="Navigation sidebar"], aside[aria-label="Table of contents"]'
    );
    expect(desktopSidebars.length).toBe(0);
  });

  it("hides sidebars on tablet viewport with md breakpoint", () => {
    global.innerWidth = 700; // Tablet size
    global.dispatchEvent(new Event("resize"));

    const { container } = render(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="md"
        sidebar={<div>Left Sidebar</div>}
        rightSidebar={<div>Right Sidebar</div>}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // Desktop sidebars should not be visible
    const desktopSidebars = container.querySelectorAll(
      'aside[aria-label="Navigation sidebar"], aside[aria-label="Table of contents"]'
    );
    expect(desktopSidebars.length).toBe(0);
  });

  it("shows sidebars on desktop viewport with lg breakpoint", () => {
    global.innerWidth = 1200; // Desktop size
    global.dispatchEvent(new Event("resize"));

    const { container } = render(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="lg"
        sidebar={<div>Left Sidebar</div>}
        rightSidebar={<div>Right Sidebar</div>}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // Desktop sidebars should be visible
    const desktopSidebars = container.querySelectorAll(
      'aside[aria-label="Navigation sidebar"], aside[aria-label="Table of contents"]'
    );
    expect(desktopSidebars.length).toBeGreaterThan(0);
  });

  it("renders mobile toggle button on mobile viewport", () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    render(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="sm"
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // Since mock has isOpen: true, button should show "Close sidebar"
    const toggleButton = screen.getByLabelText("Close sidebar");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("renders mobile sidebar overlay when on mobile", () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    const { container } = render(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="sm"
        sidebar={<div>Mobile Sidebar</div>}
        overlay={true}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // Check for mobile sidebar
    const mobileSidebar = container.querySelector(
      'aside[aria-label="Mobile navigation"]'
    );
    expect(mobileSidebar).toBeInTheDocument();
  });

  it("does not render mobile sidebar when overlay is false", () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    const { container } = render(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="sm"
        sidebar={<div>Sidebar</div>}
        overlay={false}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // Overlay should not be rendered
    const overlay = container.querySelector(
      'div[style*="pointer-events"]'
    );
    expect(overlay).not.toBeInTheDocument();
  });

  it("renders main content with correct role", () => {
    const { container } = render(
      <ThreeColumnSidebarLayout>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const main = container.querySelector("main[role='main']");
    expect(main).toBeInTheDocument();
    expect(main).toHaveTextContent("Content");
  });

  it("renders header with correct role and aria attributes", () => {
    const { container } = render(
      <ThreeColumnSidebarLayout header={<div>Header</div>}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const header = container.querySelector("header[role='banner']");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header");
  });

  it("renders footer with correct role", () => {
    const { container } = render(
      <ThreeColumnSidebarLayout footer={<div>Footer</div>}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const footer = container.querySelector("footer[role='contentinfo']");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Footer");
  });

  it("applies default values when props are not provided", () => {
    render(
      <ThreeColumnSidebarLayout>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--layout-sidebar-w")).toBe("300px");
    expect(root.style.getPropertyValue("--layout-right-sidebar-w")).toBe("240px");
    expect(root.style.getPropertyValue("--layout-header-h")).toBe("60px");
    expect(root.style.getPropertyValue("--layout-footer-h")).toBe("60px");
  });

  it("cleans up CSS variables on unmount", () => {
    const { unmount } = render(
      <ThreeColumnSidebarLayout sidebarWidth={350} headerHeight={80}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--layout-sidebar-w")).toBe("350px");

    unmount();

    expect(root.style.getPropertyValue("--layout-sidebar-w")).toBe("");
    expect(root.style.getPropertyValue("--layout-header-h")).toBe("");
  });

  it("renders active nav item with correct styling class", () => {
    const navItems = [
      {
        label: "Section",
        items: [
          { label: "Active Item", href: "#active", active: true },
          { label: "Inactive Item", href: "#inactive", active: false },
        ],
      },
    ];

    const { container } = render(
      <ThreeColumnSidebarLayout navItems={navItems}>
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    const activeLink = container.querySelector('a[href="#active"]');
    const inactiveLink = container.querySelector('a[href="#inactive"]');

    expect(activeLink).toHaveClass("bg-[var(--primary)]/10");
    expect(inactiveLink).not.toHaveClass("bg-[var(--primary)]/10");
  });

  it("handles resize events correctly", () => {
    global.innerWidth = 1200;
    
    const { container, rerender } = render(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="md"
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    act(() => {
      global.dispatchEvent(new Event("resize"));
    });

    // Initially desktop - sidebars should be visible
    let desktopSidebars = container.querySelectorAll(
      'aside[aria-label="Navigation sidebar"]'
    );
    expect(desktopSidebars.length).toBeGreaterThan(0);

    // Resize to mobile
    act(() => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event("resize"));
    });
    
    rerender(
      <ThreeColumnSidebarLayout
        mobileBreakpoint="md"
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </ThreeColumnSidebarLayout>
    );

    // Desktop sidebars should be hidden
    desktopSidebars = container.querySelectorAll(
      'aside[aria-label="Navigation sidebar"]'
    );
    expect(desktopSidebars.length).toBe(0);
  });

});
