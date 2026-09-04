import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Badge, type BadgeVariant, type BadgeSize } from "./index";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        React.forwardRef(({ children, ...rest }: any, ref) => React.createElement(tag, { ...rest, ref }, children)),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe("Badge rendering", () => {
  it("renders without crashing", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders children as provided (text, number, node)", () => {
    render(<Badge>{42}</Badge>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("has correct displayName", () => {
    expect(Badge.displayName).toBe("Badge");
  });
});

describe("Badge variant prop", () => {
  const variantCases: Array<[BadgeVariant, string]> = [
    ["default", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["success", "bg-success"],
    ["warning", "bg-warning"],
    ["destructive", "bg-destructive"],
    ["info", "bg-info"],
    ["purple", "bg-purple"],
    ["outline", "border-border"],
    ["notification", "ring-2"],
  ];

  it.each(variantCases)('variant="%s" applies class "%s"', (variant, expectedClass) => {
    render(<Badge variant={variant}>X</Badge>);
    expect(screen.getByText("X").className).toContain(expectedClass);
  });

  it("defaults to the default variant", () => {
    render(<Badge>X</Badge>);
    expect(screen.getByText("X").className).toContain("bg-primary");
  });

  it("outline variant is transparent with a border, not a filled background", () => {
    render(<Badge variant="outline">X</Badge>);
    const classes = screen.getByText("X").className;
    expect(classes).toContain("bg-transparent");
    expect(classes).toContain("border");
  });
});

describe("Badge size prop", () => {
  const sizeCases: Array<[BadgeSize, string]> = [
    ["sm", "text-[11px]"],
    ["md", "text-xs"],
    ["lg", "text-sm"],
  ];

  it.each(sizeCases)('size="%s" applies class "%s"', (size, expectedClass) => {
    render(<Badge size={size}>X</Badge>);
    expect(screen.getByText("X").className).toContain(expectedClass);
  });

  it("defaults to the md size", () => {
    render(<Badge>X</Badge>);
    expect(screen.getByText("X").className).toContain("text-xs");
  });

  it("uses circular counter sizing for the notification variant instead of pill padding", () => {
    render(
      <Badge variant="notification" size="lg">
        9
      </Badge>
    );
    const classes = screen.getByText("9").className;
    expect(classes).toContain("h-6");
    expect(classes).toContain("min-w-[24px]");
  });
});

describe("Badge icon slot", () => {
  it("renders the icon before the children", () => {
    render(
      <Badge icon={<span data-testid="icon">*</span>}>
        Active
      </Badge>
    );
    const icon = screen.getByTestId("icon");
    const badge = screen.getByText("Active").closest("span[class]");
    expect(icon).toBeInTheDocument();
    expect(badge?.textContent?.indexOf("*")).toBeLessThan(badge?.textContent?.indexOf("Active") ?? -1);
  });

  it("marks the icon wrapper as aria-hidden", () => {
    const { container } = render(<Badge icon={<span data-testid="icon">*</span>}>Active</Badge>);
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).toContainElement(screen.getByTestId("icon"));
  });

  it("omits the icon wrapper when no icon is provided", () => {
    const { container } = render(<Badge>Active</Badge>);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });
});

describe("Badge dismiss button", () => {
  it("renders a dismiss button when onRemove is provided", () => {
    render(<Badge onRemove={vi.fn()}>Removable</Badge>);
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("omits the dismiss button when onRemove is not provided", () => {
    render(<Badge>Not removable</Badge>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRemove when the dismiss button is clicked", () => {
    const onRemove = vi.fn();
    render(<Badge onRemove={onRemove}>Removable</Badge>);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("uses a custom removeLabel for the dismiss button's accessible name", () => {
    render(
      <Badge onRemove={vi.fn()} removeLabel="Remove Draft tag">
        Draft
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Remove Draft tag" })).toBeInTheDocument();
  });
});

describe("Badge anchor (attached positioning)", () => {
  it("renders the anchor content alongside the badge", () => {
    render(
      <Badge anchor={<button>Bell</button>} variant="notification">
        3
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Bell" })).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("wraps the anchor and badge in a relative inline-flex container", () => {
    const { container } = render(<Badge anchor={<div>child</div>}>1</Badge>);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("relative");
    expect(wrapper?.className).toContain("inline-flex");
  });

  it("positions the badge absolutely in the corner when anchored", () => {
    render(<Badge anchor={<div>child</div>}>1</Badge>);
    expect(screen.getByText("1").className).toContain("absolute");
  });

  it("renders the badge itself as the root when not anchored, with no extra wrapper", () => {
    const { container } = render(<Badge>1</Badge>);
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild?.textContent).toBe("1");
  });
});

describe("Badge className", () => {
  it("applies a custom className", () => {
    render(<Badge className="custom">X</Badge>);
    expect(screen.getByText("X").className).toContain("custom");
  });

  it("merges custom className with variant classes", () => {
    render(
      <Badge variant="success" className="extra">
        X
      </Badge>
    );
    const classes = screen.getByText("X").className;
    expect(classes).toContain("bg-success");
    expect(classes).toContain("extra");
  });
});

describe("Badge structure", () => {
  it("has rounded-full", () => {
    render(<Badge>X</Badge>);
    expect(screen.getByText("X").className).toContain("rounded-full");
  });

  it("passes through extra HTML attributes", () => {
    render(<Badge data-testid="my-badge">X</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });
});
