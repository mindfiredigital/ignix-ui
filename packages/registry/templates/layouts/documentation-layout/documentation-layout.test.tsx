// documentation-layout.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

/* ------------------ HOISTED MOCKS (must be before importing component) ------------------ */
vi.mock("lucide-react", () => ({
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Pencil: () => <div data-testid="pencil-icon" />,
}));

vi.mock("framer-motion", () => ({
  motion: {
    aside: React.forwardRef(({ children, initial: _i, animate: _a, transition: _t, ...props }: any, ref: any) => (
      <aside ref={ref} {...props}>{children}</aside>
    )),
    div: React.forwardRef(({ children, initial: _i, animate: _a, exit: _e, ...props }: any, ref: any) => (
      <div ref={ref} {...props}>{children}</div>
    )),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

/* ------------------ Now import the component under test ------------------ */
import { DocumentationLayout, type DocNavSection, type TocHeading } from ".";

const navSections: DocNavSection[] = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "/intro", active: true },
      { label: "Installation", href: "/install" },
    ],
  },
  {
    label: "Guides",
    items: [
      {
        label: "Advanced",
        items: [
          { label: "Theming", href: "/theming" },
          { label: "Plugins", href: "/plugins" },
        ],
      },
    ],
  },
];

const tocHeadings: TocHeading[] = [
  { id: "overview", label: "Overview" },
  { id: "usage", label: "Usage", depth: 3 },
];

describe("DocumentationLayout", () => {
  beforeEach(() => {
    global.innerWidth = 1280;
  });

  describe("rendering", () => {
    it("renders children in the main content area", () => {
      render(
        <DocumentationLayout>
          <p>Page body</p>
        </DocumentationLayout>
      );
      expect(screen.getByRole("main")).toHaveTextContent("Page body");
    });

    it("renders header, searchSlot, and actions", () => {
      render(
        <DocumentationLayout
          header={<span>Logo</span>}
          searchSlot={<input placeholder="Search docs" />}
          actions={<button>GitHub</button>}
        >
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByText("Logo")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search docs")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "GitHub" })).toBeInTheDocument();
    });

    it("renders the page title as an h1", () => {
      render(<DocumentationLayout title="Getting Started"><p>Body</p></DocumentationLayout>);
      expect(screen.getByRole("heading", { level: 1, name: "Getting Started" })).toBeInTheDocument();
    });

    it("renders a custom sidebar override instead of navSections", () => {
      render(
        <DocumentationLayout sidebar={<div>Custom Sidebar</div>} navSections={navSections}>
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByText("Custom Sidebar")).toBeInTheDocument();
      expect(screen.queryByText("Introduction")).not.toBeInTheDocument();
    });

    it("applies a custom className to the root container", () => {
      const { container } = render(
        <DocumentationLayout className="custom-root"><p>Content</p></DocumentationLayout>
      );
      expect(container.firstChild).toHaveClass("custom-root");
    });
  });

  describe("navigation sidebar", () => {
    it("renders section labels and leaf links", () => {
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);
      expect(screen.getByText("Getting Started")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute("href", "/intro");
      expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute("href", "/install");
    });

    it("marks the active item with aria-current", () => {
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);
      expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute("aria-current", "page");
      expect(screen.getByRole("link", { name: "Installation" })).not.toHaveAttribute("aria-current");
    });

    it("auto-expands a group that contains no active descendant only after being toggled", () => {
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);
      // "Advanced" has no active descendant, so its children start collapsed.
      expect(screen.queryByRole("link", { name: "Theming" })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Expand Advanced" }));
      expect(screen.getByRole("link", { name: "Theming" })).toBeInTheDocument();
    });

    it("collapses an expanded group when toggled again", () => {
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);
      fireEvent.click(screen.getByRole("button", { name: "Expand Advanced" }));
      expect(screen.getByRole("link", { name: "Theming" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Collapse Advanced" }));
      expect(screen.queryByRole("link", { name: "Theming" })).not.toBeInTheDocument();
    });

    it("also expands and collapses a group when its label text is clicked", () => {
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);
      const label = screen.getByRole("button", { name: "Advanced" });
      expect(label).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(label);
      expect(screen.getByRole("link", { name: "Theming" })).toBeInTheDocument();
      expect(label).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(label);
      expect(screen.queryByRole("link", { name: "Theming" })).not.toBeInTheDocument();
      expect(label).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("breadcrumbs", () => {
    it("renders breadcrumb links and marks the last one as the current page", () => {
      render(
        <DocumentationLayout
          breadcrumbs={[
            { label: "Docs", href: "/docs" },
            { label: "Components", href: "/docs/components" },
          ]}
        >
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
      const current = screen.getByText("Components");
      expect(current).toHaveAttribute("aria-current", "page");
      expect(current.tagName).not.toBe("A");
    });

    it("renders every breadcrumb even when hrefs are duplicated (e.g. placeholder '#' links)", () => {
      const warnSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
      render(
        <DocumentationLayout
          breadcrumbs={[
            { label: "Docs", href: "#" },
            { label: "Templates", href: "#" },
            { label: "Documentation Layout", href: "#" },
          ]}
        >
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getAllByRole("link", { name: /Docs|Templates/ })).toHaveLength(2);
      expect(screen.getByText("Documentation Layout")).toHaveAttribute("aria-current", "page");
      // React logs a "two children with the same key" warning via console.error
      // when list keys collide - duplicate hrefs must not trigger that.
      const keyWarning = warnSpy.mock.calls.some((call) =>
        String(call[0]).includes("same key")
      );
      expect(keyWarning).toBe(false);
      warnSpy.mockRestore();
    });

    it("does not render a breadcrumb nav when omitted", () => {
      render(<DocumentationLayout><p>Content</p></DocumentationLayout>);
      expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
    });
  });

  describe("page navigation footer", () => {
    it("renders previous/next page links", () => {
      render(
        <DocumentationLayout
          previousPage={{ label: "Installation", href: "/install" }}
          nextPage={{ label: "Configuration", href: "/config" }}
        >
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByRole("link", { name: /Installation/ })).toHaveAttribute("href", "/install");
      expect(screen.getByRole("link", { name: /Configuration/ })).toHaveAttribute("href", "/config");
    });

    it("renders an edit-this-page link when editPageUrl is provided", () => {
      render(
        <DocumentationLayout editPageUrl="https://github.com/org/repo/edit/main/page.mdx">
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByRole("link", { name: /Edit this page/ })).toHaveAttribute(
        "href",
        "https://github.com/org/repo/edit/main/page.mdx"
      );
    });

    it("renders neither prev/next nor edit link, and no divider, when none are provided", () => {
      render(<DocumentationLayout><p>Content</p></DocumentationLayout>);
      expect(screen.queryByRole("navigation", { name: "Page navigation" })).not.toBeInTheDocument();
      expect(screen.queryByText(/Edit this page/)).not.toBeInTheDocument();
    });
  });

  describe("table of contents", () => {
    it("renders tocHeadings as anchor links", () => {
      render(<DocumentationLayout tocHeadings={tocHeadings}><p>Content</p></DocumentationLayout>);
      expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "#overview");
      expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("href", "#usage");
    });

    it("renders a custom toc override instead of tocHeadings", () => {
      render(
        <DocumentationLayout toc={<div>Custom TOC</div>} tocHeadings={tocHeadings}>
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByText("Custom TOC")).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Overview" })).not.toBeInTheDocument();
    });

    it("does not render a table-of-contents complementary region when omitted", () => {
      render(<DocumentationLayout><p>Content</p></DocumentationLayout>);
      expect(screen.queryByRole("complementary", { name: "Table of contents" })).not.toBeInTheDocument();
    });
  });

  describe("scroll-spy (IntersectionObserver)", () => {
    it("observes each heading element when IntersectionObserver is available", () => {
      const observe = vi.fn();
      const disconnect = vi.fn();
      class MockIntersectionObserver {
        constructor(_cb: IntersectionObserverCallback) {
          void _cb;
        }
        observe = observe;
        disconnect = disconnect;
        unobserve = vi.fn();
        takeRecords = vi.fn();
      }
      vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

      const overview = document.createElement("div");
      overview.id = "overview";
      document.body.appendChild(overview);

      render(<DocumentationLayout tocHeadings={tocHeadings}><p>Content</p></DocumentationLayout>);

      expect(observe).toHaveBeenCalledWith(overview);

      document.body.removeChild(overview);
      vi.unstubAllGlobals();
    });
  });

  describe("responsive behavior", () => {
    it("renders the desktop sidebar (no hamburger) at desktop widths", () => {
      global.innerWidth = 1280;
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);
      expect(screen.getByRole("complementary", { name: "Sidebar navigation" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Open navigation" })).not.toBeInTheDocument();
    });

    it("hides the desktop sidebar and shows a hamburger toggle at mobile widths", () => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event("resize"));
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);
      expect(screen.queryByRole("complementary", { name: "Sidebar navigation" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open navigation" })).toBeInTheDocument();
    });

    it("opens the mobile drawer when the hamburger button is clicked", () => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event("resize"));
      render(<DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>);

      const toggle = screen.getByRole("button", { name: "Open navigation" });
      fireEvent.click(toggle);

      expect(screen.getByRole("complementary", { name: "Mobile sidebar navigation" })).toHaveAttribute(
        "aria-hidden",
        "false"
      );
      expect(screen.getByRole("button", { name: "Close navigation" })).toBeInTheDocument();
    });

    it("closes the mobile drawer when a nav link is clicked", () => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event("resize"));
      const { container } = render(
        <DocumentationLayout navSections={navSections}><p>Content</p></DocumentationLayout>
      );

      fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
      const mobileLinks = screen.getAllByRole("link", { name: "Introduction" });
      fireEvent.click(mobileLinks[mobileLinks.length - 1]);

      // Once closed, the drawer is aria-hidden, which `getByRole` correctly
      // excludes from the accessibility tree by default (mirroring assistive
      // tech) - so this specific check queries the raw DOM attribute instead.
      const drawer = container.querySelector('[aria-label="Mobile sidebar navigation"]');
      expect(drawer).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("landmarks", () => {
    it("exposes banner, main, and contentinfo roles", () => {
      render(
        <DocumentationLayout footer={<span>Footer</span>}>
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("contentinfo")).toHaveTextContent("Footer");
    });
  });

  describe("sizing", () => {
    it("applies sidebarWidth and tocWidth as inline styles", () => {
      render(
        <DocumentationLayout navSections={navSections} tocHeadings={tocHeadings} sidebarWidth={320} tocWidth={200}>
          <p>Content</p>
        </DocumentationLayout>
      );
      expect(screen.getByRole("complementary", { name: "Sidebar navigation" })).toHaveStyle({ width: "320px" });
      expect(screen.getByRole("complementary", { name: "Table of contents" })).toHaveStyle({ width: "200px" });
    });
  });
});
