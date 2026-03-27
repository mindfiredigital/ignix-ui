import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { Tooltip } from "./index";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      initial: _i,
      animate: _a,
      exit: _e,
      variants: _v,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      variants?: unknown;
    }) => (
      <div className={className} {...rest}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@radix-ui/react-tooltip", () => {
  const Provider = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );

  const Root = ({
    children,
    open,
    onOpenChange,
  }: {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (v: boolean) => void;
  }) => (
    <div
      data-testid="tooltip-root"
      data-open={String(open)}
      onMouseEnter={() => onOpenChange?.(true)}
      onMouseLeave={() => onOpenChange?.(false)}
    >
      {children}
    </div>
  );

  const Trigger = ({ children }: { children?: React.ReactNode; asChild?: boolean }) => (
    <span data-testid="tooltip-trigger">{children}</span>
  );

  const Portal = ({ children }: { children?: React.ReactNode; forceMount?: boolean }) => (
    <>{children}</>
  );

  const Content = ({
    children,
    asChild: _asChild,
    sideOffset: _so,
    ...rest
  }: {
    children?: React.ReactNode;
    asChild?: boolean;
    sideOffset?: number;
    [key: string]: unknown;
  }) => (
    <div data-testid="tooltip-content" role="tooltip" {...rest}>
      {children}
    </div>
  );

  return { Provider, Root, Trigger, Portal, Content };
});

type TooltipProps = React.ComponentProps<typeof Tooltip>;

const renderTooltip = (props: Partial<TooltipProps> = {}) =>
  render(
    <Tooltip content="Tooltip text" {...props}>
      <button>Hover me</button>
    </Tooltip>
  );

const openTooltip = () => userEvent.hover(screen.getByTestId("tooltip-root"));
const closeTooltip = () => userEvent.unhover(screen.getByTestId("tooltip-root"));

describe("Tooltip – rendering", () => {
  it("renders the trigger child", () => {
    renderTooltip();
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
  });

  it("does not render tooltip content before hover", () => {
    renderTooltip();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("renders tooltip content after hover", async () => {
    renderTooltip();
    await openTooltip();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();
  });

  it("hides tooltip content after mouse leave", async () => {
    renderTooltip();
    await openTooltip();
    await closeTooltip();
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    );
  });

  it("renders a ReactNode as content", async () => {
    render(
      <Tooltip content={<span data-testid="rich-tip">Rich <strong>content</strong></span>}>
        <button>Trigger</button>
      </Tooltip>
    );
    await openTooltip();
    expect(screen.getByTestId("rich-tip")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders any ReactNode as the trigger child", () => {
    render(
      <Tooltip content="tip">
        <a href="#">Link trigger</a>
      </Tooltip>
    );
    expect(screen.getByRole("link", { name: "Link trigger" })).toBeInTheDocument();
  });
});

describe("Tooltip – cva classes applied to content", () => {
  const getContentDiv = () =>
    screen.getByRole("tooltip").firstElementChild as HTMLElement;

  it("applies bg-zinc-900 for default bg (dark)", async () => {
    renderTooltip();
    await openTooltip();
    expect(getContentDiv().className).toContain("bg-zinc-900");
  });

  it("applies rounded-md for default rounded (sm)", async () => {
    renderTooltip();
    await openTooltip();
    expect(getContentDiv().className).toContain("rounded-md");
  });

  it("applies bg-white for bg=light", async () => {
    renderTooltip({ bg: "light" });
    await openTooltip();
    expect(getContentDiv().className).toContain("bg-white");
  });

  it("applies bg-slate-800 for bg=slate", async () => {
    renderTooltip({ bg: "slate" });
    await openTooltip();
    expect(getContentDiv().className).toContain("bg-slate-800");
  });

  it("applies gradient classes for bg=gradient", async () => {
    renderTooltip({ bg: "gradient" });
    await openTooltip();
    expect(getContentDiv().className).toContain("from-blue-500");
    expect(getContentDiv().className).toContain("to-purple-500");
  });

  it("applies glass classes for bg=glass", async () => {
    renderTooltip({ bg: "glass" });
    await openTooltip();
    expect(getContentDiv().className).toContain("backdrop-blur-lg");
  });

  it("applies bg-blue-400 for bg=primary", async () => {
    renderTooltip({ bg: "primary" });
    await openTooltip();
    expect(getContentDiv().className).toContain("bg-blue-400");
  });

  it("applies rounded-xl for rounded=md", async () => {
    renderTooltip({ rounded: "md" });
    await openTooltip();
    expect(getContentDiv().className).toContain("rounded-xl");
  });

  it("applies rounded-full for rounded=full", async () => {
    renderTooltip({ rounded: "full" });
    await openTooltip();
    expect(getContentDiv().className).toContain("rounded-full");
  });

  it("merges a custom className into the content wrapper", async () => {
    renderTooltip({ className: "my-custom-class" });
    await openTooltip();
    expect(getContentDiv().className).toContain("my-custom-class");
  });

  it("preserves base cva classes alongside custom className", async () => {
    renderTooltip({ className: "extra" });
    await openTooltip();
    const cls = getContentDiv().className;
    expect(cls).toContain("px-3");
    expect(cls).toContain("py-1.5");
    expect(cls).toContain("text-sm");
    expect(cls).toContain("extra");
  });
});

describe("Tooltip – smoke tests (all variants)", () => {
  const bgVariants = [
    "dark", "light", "slate", "default", "transparent", "glass", "gradient", "primary",
  ] as const;
  const roundedVariants = ["sm", "md", "full"] as const;
  const animationVariants = [
    "fade", "scale", "slideUp", "slideDown", "slideLeft", "slideRight",
  ] as const;

  bgVariants.forEach((bg) => {
    it(`renders without error: bg=${bg}`, async () => {
      expect(() => renderTooltip({ bg })).not.toThrow();
      await openTooltip();
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  roundedVariants.forEach((rounded) => {
    it(`renders without error: rounded=${rounded}`, async () => {
      expect(() => renderTooltip({ rounded })).not.toThrow();
      await openTooltip();
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  animationVariants.forEach((animation) => {
    it(`renders without error: animation=${animation}`, async () => {
      expect(() => renderTooltip({ animation })).not.toThrow();
      await openTooltip();
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
});

describe("Tooltip – open/close state", () => {
  it("toggles correctly across multiple hover/unhover cycles", async () => {
    renderTooltip();

    await openTooltip();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await closeTooltip();
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    );

    await openTooltip();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("reflects open state in data-open attribute on root", async () => {
    renderTooltip();
    const root = screen.getByTestId("tooltip-root");

    expect(root).toHaveAttribute("data-open", "false");
    await openTooltip();
    expect(root).toHaveAttribute("data-open", "true");
  });

  it("only shows content for the hovered tooltip when multiple are mounted", async () => {
    render(
      <>
        <Tooltip content="Tip A">
          <button>A</button>
        </Tooltip>
        <Tooltip content="Tip B">
          <button>B</button>
        </Tooltip>
      </>
    );

    const [rootA] = screen.getAllByTestId("tooltip-root");
    await userEvent.hover(rootA);

    expect(screen.getByText("Tip A")).toBeInTheDocument();
    expect(screen.queryByText("Tip B")).not.toBeInTheDocument();
  });
});

describe("Tooltip – prop updates", () => {
  it("reflects updated content when the content prop changes", async () => {
    const { rerender } = renderTooltip({ content: "First" });
    await openTooltip();
    expect(screen.getByText("First")).toBeInTheDocument();

    rerender(
      <Tooltip content="Updated">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();
  });

  it("applies updated className when prop changes", async () => {
    const { rerender } = renderTooltip({ className: "class-one" });
    await openTooltip();
    expect(
      (screen.getByRole("tooltip").firstElementChild as HTMLElement).className
    ).toContain("class-one");

    rerender(
      <Tooltip content="Tooltip text" className="class-two">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(
      (screen.getByRole("tooltip").firstElementChild as HTMLElement).className
    ).toContain("class-two");
  });

  it("updates bg variant styling when bg prop changes", async () => {
    const { rerender } = renderTooltip({ bg: "dark" });
    await openTooltip();
    expect(
      (screen.getByRole("tooltip").firstElementChild as HTMLElement).className
    ).toContain("bg-zinc-900");

    rerender(
      <Tooltip content="Tooltip text" bg="light">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(
      (screen.getByRole("tooltip").firstElementChild as HTMLElement).className
    ).toContain("bg-white");
  });
});