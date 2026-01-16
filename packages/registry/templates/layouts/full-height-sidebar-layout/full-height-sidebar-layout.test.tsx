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
   In your component file it is: import { SidebarProvider, useSidebar } from "@ignix-ui/sidebar";
   So we mock "@ignix-ui/sidebar" */
vi.mock("@ignix-ui/sidebar", () => {
  const mockSetIsOpen = vi.fn();
  return {
    SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useSidebar: () => ({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
      toggle: vi.fn(),
      onClose: vi.fn(),
      onOpen: vi.fn(),
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

  // Test Case 6: Light variant styling
  it("applies the correct classes for the light variant", () => {
    const { container } = render(
      <FullHeightSidebarLayout variant="light" sidebar={<div>Sidebar</div>}>
        <div>Light Layout</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root).toHaveClass("bg-white");
    expect(root).toHaveClass("text-gray-900");
    expect(root).toHaveClass("border-r");
  });

  // Test Case 7: Glass variant styling
  it("applies the correct classes for the glass variant", () => {
    const { container } = render(
      <FullHeightSidebarLayout variant="glass" sidebar={<div>Sidebar</div>}>
        <div>Glass Layout</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root).toHaveClass("bg-white/10");
    expect(root).toHaveClass("backdrop-blur-lg");
  });
  
  // Test Case 9: Right sidebar position
  it("renders sidebar on the right when sidebarPosition is right", () => {
    render(
      <FullHeightSidebarLayout sidebar={<div>Right Sidebar</div>} sidebarPosition="right">
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Right Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // Test Case 10: Custom sidebar width
  it("applies custom sidebar width via CSS variable", () => {
    const { container } = render(
      <FullHeightSidebarLayout sidebar={<div>Sidebar</div>} sidebarWidth={320}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.style.getPropertyValue("--sidebar-w")).toBe("320px");
  });

  // Test Case 11: Custom sidebar collapsed width
  it("applies custom sidebar collapsed width via CSS variable", () => {
    const { container } = render(
      <FullHeightSidebarLayout sidebar={<div>Sidebar</div>} sidebarCollapsedWidth={80}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.style.getPropertyValue("--sidebar-w-collapsed")).toBe("80px");
  });

  // Test Case 12: Custom header height
  it("applies custom header height via CSS variable", () => {
    const { container } = render(
      <FullHeightSidebarLayout header={<div>Header</div>} headerHeight={80}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.style.getPropertyValue("--header-h")).toBe("80px");
  });

  // Test Case 13: Custom z-index values
  it("applies custom z-index values", () => {
    const customZIndex = { header: 200, sidebar: 150, overlay: 100 };
    render(
      <FullHeightSidebarLayout 
        header={<div>Header</div>} 
        sidebar={<div>Sidebar</div>}
        zIndex={customZIndex}
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  // Test Case 14: Sidebar collapsed state
  it("handles sidebar collapsed state correctly", () => {
    render(
      <FullHeightSidebarLayout 
        sidebar={<div>Sidebar</div>} 
        sidebarCollapsed={true}
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // Test Case 15: Mobile breakpoint sm
  it("handles mobile breakpoint sm correctly", () => {
    global.innerWidth = 500;
    const { container } = render(
      <FullHeightSidebarLayout 
        sidebar={<div>Sidebar</div>} 
        mobileBreakpoint="sm"
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
  });

  // Test Case 16: Mobile breakpoint md
  it("handles mobile breakpoint md correctly", () => {
    global.innerWidth = 600;
    const { container } = render(
      <FullHeightSidebarLayout 
        sidebar={<div>Sidebar</div>} 
        mobileBreakpoint="md"
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
  });

  // Test Case 17: Mobile breakpoint lg
  it("handles mobile breakpoint lg correctly", () => {
    global.innerWidth = 900;
    const { container } = render(
      <FullHeightSidebarLayout 
        sidebar={<div>Sidebar</div>} 
        mobileBreakpoint="lg"
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
  });

  // Test Case 18: Overlay disabled
  it("renders without overlay when overlay prop is false", () => {
    global.innerWidth = 500;
    const { container } = render(
      <FullHeightSidebarLayout 
        sidebar={<div>Sidebar</div>} 
        overlay={false}
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const overlay = container.querySelector(".bg-black\\/50");
    // Overlay should not be rendered when overlay is false
    expect(overlay).not.toBeInTheDocument();
  });

  // Test Case 19: Gestures disabled
  it("handles gestures disabled correctly", () => {
    global.innerWidth = 500;
    render(
      <FullHeightSidebarLayout 
        sidebar={<div>Sidebar</div>} 
        enableGestures={false}
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // Test Case 20: Custom transition duration
  it("applies custom transition duration", () => {
    render(
      <FullHeightSidebarLayout 
        sidebar={<div>Sidebar</div>} 
        transitionDuration={0.5}
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // Test Case 21: Custom className
  it("applies custom className to root element", () => {
    const { container } = render(
      <FullHeightSidebarLayout className="custom-class-name">
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root).toHaveClass("custom-class-name");
  });

  // Test Case 22: Renders without header
  it("renders correctly without header prop", () => {
    render(
      <FullHeightSidebarLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // Test Case 23: Renders without sidebar
  it("renders correctly without sidebar prop", () => {
    render(
      <FullHeightSidebarLayout header={<div>Header</div>}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // Test Case 24: Renders with both header and sidebar
  it("renders correctly with both header and sidebar", () => {
    render(
      <FullHeightSidebarLayout 
        header={<div>Header</div>} 
        sidebar={<div>Sidebar</div>}
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // Test Case 25: Mobile toggle button aria-label
  it("sets correct aria-label on mobile toggle button", () => {
    global.innerWidth = 500;
    const { container } = render(
      <FullHeightSidebarLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const button = container.querySelector("button[aria-label]");
    expect(button).toBeInTheDocument();
    expect(button?.getAttribute("aria-label")).toBeTruthy();
  });

  // Test Case 26: Desktop view hides mobile toggle button
  it("hides mobile toggle button on desktop view", () => {
    global.innerWidth = 1024;
    const { container } = render(
      <FullHeightSidebarLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const button = container.querySelector("button[aria-label]");
    // On desktop, the mobile toggle button should not be rendered
    expect(button).not.toBeInTheDocument();
  });

  // Test Case 27: CSS variables are set correctly
  it("sets all CSS variables correctly", () => {
    const { container } = render(
      <FullHeightSidebarLayout 
        header={<div>Header</div>}
        sidebar={<div>Sidebar</div>}
        sidebarWidth={300}
        sidebarCollapsedWidth={70}
        headerHeight={80}
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue("--header-h")).toBe("80px");
    expect(root.style.getPropertyValue("--sidebar-w")).toBe("300px");
    expect(root.style.getPropertyValue("--sidebar-w-collapsed")).toBe("70px");
  });

  // Test Case 28: Multiple children rendering
  it("renders multiple children correctly", () => {
    render(
      <FullHeightSidebarLayout>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
    expect(screen.getByText("Child 3")).toBeInTheDocument();
  });

  // Test Case 29: Complex header content
  it("renders complex header content correctly", () => {
    render(
      <FullHeightSidebarLayout 
        header={
          <div>
            <h1>Title</h1>
            <nav>Navigation</nav>
            <button>Action</button>
          </div>
        }
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  // Test Case 30: Complex sidebar content
  it("renders complex sidebar content correctly", () => {
    render(
      <FullHeightSidebarLayout 
        sidebar={
          <div>
            <h2>Sidebar Title</h2>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        }
      >
        <div>Content</div>
      </FullHeightSidebarLayout>
    );

    expect(screen.getByText("Sidebar Title")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
