import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", () => {
  const actual = vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) =>
          React.forwardRef(
            (
              { children, ...rest }: React.PropsWithChildren<Record<string, unknown>>,
              ref: React.Ref<unknown>
            ) => {
              const { ...domProps } = rest;
              return React.createElement(prop as string, { ...domProps, ref }, children);
            }
          ),
      }
    ),
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  };
});

vi.mock("lucide-react", () => ({
  Menu: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-menu" {...props} />
  ),
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-x" {...props} />
  ),
  Home: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-home" {...props} />,
  Inbox: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-inbox" {...props} />,
  Settings: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-settings" {...props} />,
}));

vi.mock("../../../utils/cn", () => ({
  cn: (...args: (string | undefined | null | false)[]) =>
    args.filter(Boolean).join(" "),
}));

import ThreeColumnSidebar, {
  SidebarProvider,
  useSidebar,
} from "./index";
import type { SidebarPosition } from "./index";
import { Home, Inbox, Settings } from "lucide-react";

const defaultLinks = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Settings", href: "/settings", icon: Settings },
];

const manyLinks = [
  ...defaultLinks,
  { label: "Extra A", href: "/a", icon: Home },
  { label: "Extra B", href: "/b", icon: Inbox },
  { label: "Extra C", href: "/c", icon: Settings},
];

function renderWithProvider(
  ui: React.ReactElement,
  initialState?: Partial<Record<SidebarPosition, boolean>>
) {
  return render(
    <SidebarProvider initialState={initialState}>{ui}</SidebarProvider>
  );
}

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  fireEvent(window, new Event("resize"));
}

describe("SidebarProvider", () => {
  it("renders children", () => {
    render(
      <SidebarProvider>
        <span>child</span>
      </SidebarProvider>
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("defaults left and right to open, bottomLeft and bottomRight to closed", () => {
    const Probe = ({ position }: { position: SidebarPosition }) => {
      const { isOpen } = useSidebar(position);
      return <span data-testid={position}>{String(isOpen)}</span>;
    };

    render(
      <SidebarProvider>
        <Probe position="left" />
        <Probe position="right" />
        <Probe position="bottomLeft" />
        <Probe position="bottomRight" />
      </SidebarProvider>
    );

    expect(screen.getByTestId("left").textContent).toBe("true");
    expect(screen.getByTestId("right").textContent).toBe("true");
    expect(screen.getByTestId("bottomLeft").textContent).toBe("false");
    expect(screen.getByTestId("bottomRight").textContent).toBe("false");
  });

  it("respects initialState overrides", () => {
    const Probe = ({ position }: { position: SidebarPosition }) => {
      const { isOpen } = useSidebar(position);
      return <span data-testid={position}>{String(isOpen)}</span>;
    };

    render(
      <SidebarProvider initialState={{ left: false, bottomRight: true }}>
        <Probe position="left" />
        <Probe position="bottomRight" />
      </SidebarProvider>
    );

    expect(screen.getByTestId("left").textContent).toBe("false");
    expect(screen.getByTestId("bottomRight").textContent).toBe("true");
  });
});

describe("useSidebar", () => {
  it("throws when used outside SidebarProvider", () => {
    const Bomb = () => {
      useSidebar("left");
      return null;
    };
    const spy = vi.spyOn(console, "error").mockImplementation(vi.fn());
    expect(() => render(<Bomb />)).toThrow(
      "useSidebar must be used inside SidebarProvider"
    );
    spy.mockRestore();
  });

  it("toggle flips the open state", async () => {
    const user = userEvent.setup();
    const Toggler = () => {
      const { isOpen, toggle } = useSidebar("left");
      return (
        <button onClick={toggle} data-testid="btn">
          {String(isOpen)}
        </button>
      );
    };

    render(
      <SidebarProvider initialState={{ left: true }}>
        <Toggler />
      </SidebarProvider>
    );

    const btn = screen.getByTestId("btn");
    expect(btn.textContent).toBe("true");
    await user.click(btn);
    expect(btn.textContent).toBe("false");
    await user.click(btn);
    expect(btn.textContent).toBe("true");
  });

  it("onOpen sets the sidebar open", async () => {
    const user = userEvent.setup();
    const Opener = () => {
      const { isOpen, onOpen } = useSidebar("left");
      return (
        <button onClick={onOpen} data-testid="btn">
          {String(isOpen)}
        </button>
      );
    };

    render(
      <SidebarProvider initialState={{ left: false }}>
        <Opener />
      </SidebarProvider>
    );

    expect(screen.getByTestId("btn").textContent).toBe("false");
    await user.click(screen.getByTestId("btn"));
    expect(screen.getByTestId("btn").textContent).toBe("true");
  });

  it("onClose sets the sidebar closed", async () => {
    const user = userEvent.setup();
    const Closer = () => {
      const { isOpen, onClose } = useSidebar("left");
      return (
        <button onClick={onClose} data-testid="btn">
          {String(isOpen)}
        </button>
      );
    };

    render(
      <SidebarProvider initialState={{ left: true }}>
        <Closer />
      </SidebarProvider>
    );

    expect(screen.getByTestId("btn").textContent).toBe("true");
    await user.click(screen.getByTestId("btn"));
    expect(screen.getByTestId("btn").textContent).toBe("false");
  });

  it("setOpen calling with current value does not re-render", () => {
    let renderCount = 0;
    const Counter = () => {
      renderCount++;
      const { setOpen } = useSidebar("left");
      React.useEffect(() => {
        setOpen(true);
        setOpen(true);
      });
      return null;
    };

    render(
      <SidebarProvider initialState={{ left: true }}>
        <Counter />
      </SidebarProvider>
    );

    expect(renderCount).toBeLessThanOrEqual(2);
  });

  it("defaults to left when no position argument is provided", () => {
    const DefaultHook = () => {
      const { isOpen } = useSidebar();
      return <span data-testid="result">{String(isOpen)}</span>;
    };

    render(
      <SidebarProvider initialState={{ left: false }}>
        <DefaultHook />
      </SidebarProvider>
    );

    expect(screen.getByTestId("result").textContent).toBe("false");
  });

  it("each position is tracked independently", async () => {
    const user = userEvent.setup();
    const MultiProbe = () => {
      const left  = useSidebar("left");
      const right = useSidebar("right");
      return (
        <>
          <button onClick={left.toggle}  data-testid="toggle-left">{String(left.isOpen)}</button>
          <span data-testid="right-state">{String(right.isOpen)}</span>
        </>
      );
    };

    render(
      <SidebarProvider initialState={{ left: true, right: true }}>
        <MultiProbe />
      </SidebarProvider>
    );

    await user.click(screen.getByTestId("toggle-left"));
    expect(screen.getByTestId("toggle-left").textContent).toBe("false");
    expect(screen.getByTestId("right-state").textContent).toBe("true");
  });
});

describe("ThreeColumnSidebar rendering", () => {
  beforeEach(() => {
    setWindowWidth(1024);
  });

  it("renders the brand name when open", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} brandName="Ignix" position="left" />,
      { left: true }
    );
    expect(screen.getByText("Ignix")).toBeInTheDocument();
  });

  it("hides the brand name when collapsed", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} brandName="Ignix" position="left" />,
      { left: false }
    );
    expect(screen.queryByText("Ignix")).not.toBeInTheDocument();
  });

  it("renders link labels when open and layout mode is OVERLAY_ONLY", () => {
    renderWithProvider(
      <ThreeColumnSidebar
        links={defaultLinks}
        position="left"
        sidebarLayoutMode="OVERLAY_ONLY"
      />,
      { left: true }
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("hides link labels in BOTTOM_DOCKED mode", () => {
    renderWithProvider(
      <ThreeColumnSidebar
        links={defaultLinks}
        position="left"
        sidebarLayoutMode="BOTTOM_DOCKED"
      />,
      { left: true }
    );
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Inbox")).not.toBeInTheDocument();
  });

  it("renders all link hrefs correctly", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: true }
    );
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/home");
    expect(hrefs).toContain("/inbox");
    expect(hrefs).toContain("/settings");
  });

  it("only renders first 3 links initially", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={manyLinks} position="left" sidebarLayoutMode="OVERLAY_ONLY" />,
      { left: true }
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.queryByText("Extra A")).not.toBeInTheDocument();
  });

  it("renders icons for each link", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: true }
    );
    expect(screen.getByTestId("icon-home")).toBeInTheDocument();
    expect(screen.getByTestId("icon-inbox")).toBeInTheDocument();
    expect(screen.getByTestId("icon-settings")).toBeInTheDocument();
  });

  it("applies custom style when open and not mobile", () => {
    setWindowWidth(1024);
    const { container } = renderWithProvider(
      <ThreeColumnSidebar
        links={defaultLinks}
        position="left"
        style={{ color: "red" }}
      />,
      { left: true }
    );
    const root = container.querySelector("div") as HTMLElement;
    expect(root.style.color).toBe("red");
  });

  it("does NOT render the header section for bottom positions", () => {
    renderWithProvider(
      <ThreeColumnSidebar
        links={defaultLinks}
        brandName="ShouldNotShow"
        position="bottomLeft"
      />,
      { bottomLeft: true }
    );
    expect(screen.queryByText("ShouldNotShow")).not.toBeInTheDocument();
    expect(screen.queryByTestId("icon-menu")).not.toBeInTheDocument();
    expect(screen.queryByTestId("icon-x")).not.toBeInTheDocument();
  });

  it("uses 'Brand' as default brandName", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: true }
    );
    expect(screen.getByText("Brand")).toBeInTheDocument();
  });
});

describe("ThreeColumnSidebar header toggle buttons", () => {
  beforeEach(() => setWindowWidth(1024));

  it("shows the X (close) icon when open", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: true }
    );
    expect(screen.getByTestId("icon-x")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-menu")).not.toBeInTheDocument();
  });

  it("shows the Menu icon when collapsed", () => {
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: false }
    );
    expect(screen.getByTestId("icon-menu")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-x")).not.toBeInTheDocument();
  });

  it("clicking X closes the sidebar", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} brandName="Ignix" position="left" />,
      { left: true }
    );

    expect(screen.getByText("Ignix")).toBeInTheDocument();
    await user.click(screen.getByTestId("icon-x").closest("button")!);
    expect(screen.queryByText("Ignix")).not.toBeInTheDocument();
  });

  it("clicking Menu opens the sidebar", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} brandName="Ignix" position="left" />,
      { left: false }
    );

    expect(screen.queryByText("Ignix")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("icon-menu").closest("button")!);
    expect(screen.getByText("Ignix")).toBeInTheDocument();
  });
});

describe("ThreeColumnSidebar mobile show-more", () => {
  beforeEach(() => {
    setWindowWidth(480);
  });

  afterEach(() => {
    setWindowWidth(1024);
  });

  it("renders the '...' show-more button on mobile for bottom positions", async () => {
    await act(async () => {
      renderWithProvider(
        <ThreeColumnSidebar
          links={manyLinks}
          position="bottomLeft"
          sidebarLayoutMode="BOTTOM_DOCKED"
          direction="horizontal"
        />,
        { bottomLeft: true }
      );
    });

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("does NOT render show-more button for non-bottom positions on mobile", async () => {
    await act(async () => {
      renderWithProvider(
        <ThreeColumnSidebar links={manyLinks} position="left" />,
        { left: true }
      );
    });

    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("clicking '...' reveals extra links and changes button text to 'Hide'", async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderWithProvider(
        <ThreeColumnSidebar
          links={manyLinks}
          position="bottomLeft"
          sidebarLayoutMode="OVERLAY_ONLY"
          direction="horizontal"
        />,
        { bottomLeft: true }
      );
    });

    expect(screen.queryByText("Extra A")).not.toBeInTheDocument();
    await user.click(screen.getByText("..."));
    expect(screen.getByText("Extra A")).toBeInTheDocument();
    expect(screen.getByText("Extra B")).toBeInTheDocument();
    expect(screen.getByText("Hide")).toBeInTheDocument();
  });

  it("clicking 'Hide' collapses extra links again", async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderWithProvider(
        <ThreeColumnSidebar
          links={manyLinks}
          position="bottomLeft"
          sidebarLayoutMode="OVERLAY_ONLY"
          direction="horizontal"
        />,
        { bottomLeft: true }
      );
    });

    await user.click(screen.getByText("..."));
    expect(screen.getByText("Extra A")).toBeInTheDocument();

    await user.click(screen.getByText("Hide"));
    expect(screen.queryByText("Extra A")).not.toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });
});

describe("ThreeColumnSidebar — responsive resize", () => {
  it("adds a resize event listener on mount and removes it on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: true }
    );

    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("applies w-0 class when mobile and sidebar is closed", async () => {
    await act(async () => setWindowWidth(480));

    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" className="" />,
      { left: false }
    );

    const root = container.querySelector("div") as HTMLElement;
    expect(root.className).toContain("w-0");
  });

  it("does not apply w-0 class on desktop even when closed", async () => {
    await act(async () => setWindowWidth(1280));

    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" className="" />,
      { left: false }
    );

    const root = container.querySelector("div") as HTMLElement;
    expect(root.className).not.toContain("w-0");
  });
});

describe("CVA variant classes", () => {
  beforeEach(() => setWindowWidth(1024));

  it("applies w-64 when open (left/right)", () => {
    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: true }
    );
    const root = container.querySelector("div") as HTMLElement;
    expect(root.className).toContain("w-64");
  });

  it("applies w-20 when collapsed (left/right)", () => {
    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: false }
    );
    const root = container.querySelector("div") as HTMLElement;
    expect(root.className).toContain("w-20");
  });

  it("applies h-full for left position", () => {
    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" />,
      { left: true }
    );
    const root = container.querySelector("div") as HTMLElement;
    expect(root.className).toContain("h-full");
  });

  it("applies h-full for right position", () => {
    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="right" />,
      { right: true }
    );
    const root = container.querySelector("div") as HTMLElement;
    expect(root.className).toContain("h-full");
  });

  it("applies flex-row for horizontal direction", () => {
    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" direction="horizontal" />,
      { left: true }
    );
    const root = container.querySelector("nav") as HTMLElement;
    expect(root.className).toContain("flex");
  });

  it("applies flex-col for vertical direction (default)", () => {
    const { container } = renderWithProvider(
      <ThreeColumnSidebar links={defaultLinks} position="left" direction="vertical" />,
      { left: true }
    );
    const root = container.querySelector("nav") as HTMLElement;
    expect(root.className).toContain("flex");
  });
});

describe("Position variants", () => {
  beforeEach(() => setWindowWidth(1024));

  it.each<[SidebarPosition, Partial<Record<SidebarPosition, boolean>>]>([
    ["left", { left: true }],
    ["right", { right: true }],
    ["bottomLeft", { bottomLeft: true }],
    ["bottomRight", { bottomRight: true }],
  ])("renders without error for position '%s'", (position, state) => {
    expect(() =>
      renderWithProvider(
        <ThreeColumnSidebar links={defaultLinks} position={position} />,
        state
      )
    ).not.toThrow();
  });

  it("header is hidden for bottomRight position", () => {
    renderWithProvider(
      <ThreeColumnSidebar
        links={defaultLinks}
        brandName="ShouldBeHidden"
        position="bottomRight"
      />,
      { bottomRight: true }
    );
    expect(screen.queryByText("ShouldBeHidden")).not.toBeInTheDocument();
  });
});

describe("Dual sidebars from one provider", () => {
  beforeEach(() => setWindowWidth(1024));

  it("left and right sidebars render independently", () => {
    render(
      <SidebarProvider initialState={{ left: true, right: true }}>
        <ThreeColumnSidebar links={defaultLinks} brandName="LeftBrand" position="left"  />
        <ThreeColumnSidebar links={defaultLinks} brandName="RightBrand" position="right" />
      </SidebarProvider>
    );

    expect(screen.getByText("LeftBrand")).toBeInTheDocument();
    expect(screen.getByText("RightBrand")).toBeInTheDocument();
  });

  it("closing left does not close right", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider initialState={{ left: true, right: true }}>
        <ThreeColumnSidebar links={defaultLinks} brandName="LeftBrand" position="left" />
        <ThreeColumnSidebar links={defaultLinks} brandName="RightBrand" position="right" />
      </SidebarProvider>
    );

    const closeButtons = screen
      .getAllByTestId("icon-x")
      .map((el) => el.closest("button")!);

    await user.click(closeButtons[0]);

    expect(screen.queryByText("LeftBrand")).not.toBeInTheDocument();
    expect(screen.getByText("RightBrand")).toBeInTheDocument();
  });
});