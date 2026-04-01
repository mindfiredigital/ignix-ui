import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        ({ children, ...props }: any) => {
          const { ...domProps} = props;
          return React.createElement(tag, domProps, children);
        },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

import React from "react";
import { Tabs } from ".";

const options = ["Overview", "Analytics", "Reports", "Settings"];

describe("Tabs", () => {
  describe("rendering", () => {
    it("renders all tab options as buttons", () => {
      render(<Tabs options={options} />);
      options.forEach((label) => {
        expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
      });
    });

    it("applies active styling to the first tab by default", () => {
      render(<Tabs options={options} />);
      const first = screen.getByRole("button", { name: "Overview" });
      expect(first).toBeInTheDocument();
      expect(first.className).not.toContain("text-gray-500");
    });

    it("respects the selected prop as the initial active tab", () => {
      render(<Tabs options={options} selected={2} />);
      const reports = screen.getByRole("button", { name: "Reports" });
      const overview = screen.getByRole("button", { name: "Overview" });
      expect(reports.className).not.toContain("text-gray-500");
      expect(overview.className).toContain("text-gray-500");
    });

    it("renders a custom className on the root div", () => {
      const { container } = render(
        <Tabs options={options} className="custom-tabs" />
      );
      expect(container.firstChild).toHaveClass("custom-tabs");
    });

    it("inactive tabs have text-gray-500 class", () => {
      render(<Tabs options={options} selected={0} />);
      ["Analytics", "Reports", "Settings"].forEach((label) => {
        expect(screen.getByRole("button", { name: label }).className).toContain(
          "text-gray-500"
        );
      });
    });
  });

  describe("interaction", () => {
    it("switches active tab on click — clicked tab loses text-gray-500", async () => {
      const user = userEvent.setup();
      render(<Tabs options={options} />);

      expect(screen.getByRole("button", { name: "Analytics" }).className).toContain("text-gray-500");

      await user.click(screen.getByRole("button", { name: "Analytics" }));

      expect(screen.getByRole("button", { name: "Analytics" }).className).not.toContain("text-gray-500");
    });

    it("previously active tab becomes inactive after switching", async () => {
      const user = userEvent.setup();
      render(<Tabs options={options} />);

      expect(screen.getByRole("button", { name: "Overview" }).className).not.toContain("text-gray-500");

      await user.click(screen.getByRole("button", { name: "Analytics" }));

      expect(screen.getByRole("button", { name: "Overview" }).className).toContain("text-gray-500");
    });

    it("calls value callback with the clicked index", async () => {
      const user = userEvent.setup();
      const onValue = vi.fn();
      render(<Tabs options={options} value={onValue} />);

      await user.click(screen.getByRole("button", { name: "Reports" }));
      expect(onValue).toHaveBeenCalledWith(2);
    });

    it("calls value with 0 when first tab is clicked", async () => {
      const user = userEvent.setup();
      const onValue = vi.fn();
      render(<Tabs options={options} selected={2} value={onValue} />);

      await user.click(screen.getByRole("button", { name: "Overview" }));
      expect(onValue).toHaveBeenCalledWith(0);
    });

    it("does not call value callback if prop is not provided", async () => {
      const user = userEvent.setup();
      render(<Tabs options={options} />);
      await expect(
        user.click(screen.getByRole("button", { name: "Analytics" }))
      ).resolves.not.toThrow();
    });
  });

  describe("variants", () => {
    const variants = [
      "underline",
      "filled",
      "pill",
      "outline",
      "ghost",
      "shadow",
      "gradient",
      "glow",
      "block",
    ] as const;

    variants.forEach((variant) => {
      it(`renders variant="${variant}" without crashing`, () => {
        render(<Tabs options={options} variant={variant} />);
        expect(
          screen.getByRole("button", { name: "Overview" })
        ).toBeInTheDocument();
      });

      it(`variant="${variant}" — active tab does not have text-gray-500`, () => {
        render(<Tabs options={options} variant={variant} selected={0} />);
        expect(
          screen.getByRole("button", { name: "Overview" }).className
        ).not.toContain("text-gray-500");
      });

      it(`variant="${variant}" — inactive tabs have text-gray-500`, () => {
        render(<Tabs options={options} variant={variant} selected={0} />);
        expect(
          screen.getByRole("button", { name: "Analytics" }).className
        ).toContain("text-gray-500");
      });
    });
  });

  describe("sizes", () => {
    const sizes = ["sm", "md", "lg"] as const;

    sizes.forEach((size) => {
      it(`renders size="${size}" without crashing`, () => {
        render(<Tabs options={options} size={size} />);
        expect(
          screen.getByRole("button", { name: "Overview" })
        ).toBeInTheDocument();
      });
    });
  });

  describe("empty options", () => {
    it("renders without crashing when options is empty", () => {
      const { container } = render(<Tabs options={[]} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });
  });

  describe("single tab", () => {
    it("renders a single tab correctly", () => {
      render(<Tabs options={["Only"]} />);
      expect(
        screen.getByRole("button", { name: "Only" })
      ).toBeInTheDocument();
    });

    it("single tab is active by default and has no text-gray-500", () => {
      render(<Tabs options={["Only"]} />);
      expect(
        screen.getByRole("button", { name: "Only" }).className
      ).not.toContain("text-gray-500");
    });
  });
});