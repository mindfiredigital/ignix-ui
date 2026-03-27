import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import "@testing-library/jest-dom";

beforeAll(() => {
  const noop = vi.fn();
  globalThis.ResizeObserver = class ResizeObserverStub {
    observe = noop;
    unobserve = noop;
    disconnect = noop;
  };
});

vi.mock("framer-motion", () => {
  const MOTION_PROPS = new Set([
    "animate", "initial", "exit", "transition", "variants",
    "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
    "drag", "dragConstraints", "dragElastic", "dragMomentum",
    "layoutId", "layout", "onAnimationStart", "onAnimationComplete",
  ]);

  const stripMotionProps = (props: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k))
    );

  const makeTagStub = (tag: string) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>(
      (props, ref) =>
        React.createElement(tag, { ...stripMotionProps(props), ref })
    );

  const createStub = (Component: React.ElementType) =>
    React.forwardRef<unknown, Record<string, unknown>>(
      (props, ref) =>
        React.createElement(Component, { ...stripMotionProps(props), ref })
    );

  const tagCache: Record<string, unknown> = { create: createStub };

  const motion = new Proxy(tagCache, {
    get(target, prop: string) {
      if (!(prop in target)) target[prop] = makeTagStub(prop);
      return target[prop];
    },
  });

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useMotionValue: (v: unknown) => ({ get: () => v, set: vi.fn() }),
    useTransform: () => ({ get: vi.fn() }),
  };
});

import { Slider } from ".";

describe("Slider", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("rendering", () => {
    it("renders the slider thumb", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("sets aria-valuenow from defaultValue", () => {
      render(<Slider defaultValue={[30]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "30");
    });

    it("renders two thumbs for a range slider", () => {
      render(<Slider defaultValue={[20, 80]} />);
      expect(screen.getAllByRole("slider")).toHaveLength(2);
    });

    it("applies custom className to the Radix root element", () => {
      const { container } = render(
        <Slider defaultValue={[0]} className="my-slider" />
      );
      expect(container.querySelector(".my-slider")).toBeInTheDocument();
    });

    it("applies trackClassName to the track element", () => {
      const { container } = render(
        <Slider defaultValue={[50]} trackClassName="custom-track" />
      );
      expect(container.querySelector(".custom-track")).toBeInTheDocument();
    });

    it("applies thumbClassName to the thumb element", () => {
      render(<Slider defaultValue={[50]} thumbClassName="custom-thumb" />);
      expect(screen.getByRole("slider")).toHaveClass("custom-thumb");
    });

    it("wraps everything in a div with w-full and space-y-3", () => {
      const { container } = render(<Slider defaultValue={[50]} />);
      const wrapper = container.firstElementChild;
      expect(wrapper?.tagName).toBe("DIV");
      expect(wrapper).toHaveClass("w-full", "space-y-3");
    });
  });

  describe("showValue", () => {
    it("does not render a value display by default", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.queryByText("50")).not.toBeInTheDocument();
    });

    it("shows the current value when showValue=true", () => {
      render(<Slider defaultValue={[42]} showValue />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("prepends valuePrefix to the displayed value", () => {
      render(<Slider defaultValue={[75]} showValue valuePrefix="$" />);
      expect(screen.getByText("$75")).toBeInTheDocument();
    });

    it("appends valueSuffix to the displayed value", () => {
      render(<Slider defaultValue={[75]} showValue valueSuffix="%" />);
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("combines valuePrefix and valueSuffix", () => {
      render(
        <Slider defaultValue={[75]} showValue valuePrefix="$" valueSuffix="%" />
      );
      expect(screen.getByText("$75%")).toBeInTheDocument();
    });

    it("shows comma-separated values for a range slider", () => {
      render(<Slider defaultValue={[20, 80]} showValue />);
      expect(screen.getByText("20, 80")).toBeInTheDocument();
    });

    it("applies valueClassName to the value display element", () => {
      render(
        <Slider defaultValue={[50]} showValue valueClassName="custom-value" />
      );
      expect(screen.getByText("50")).toHaveClass("custom-value");
    });

    it("updates displayed value when controlled value prop changes", () => {
      const { rerender } = render(
        <Slider value={[10]} showValue onValueChange={vi.fn()} />
      );
      expect(screen.getByText("10")).toBeInTheDocument();

      rerender(
        <Slider value={[90]} showValue onValueChange={vi.fn()} />
      );
      expect(screen.getByText("90")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    const variants = [
      "default", "minimal", "rounded", "gradient", "glass", "outline",
      "shadow", "neon", "material", "neumorphic", "retro", "cyberpunk",
      "brutalist", "skeuomorphic",
    ] as const;

    variants.forEach((variant) => {
      it(`renders variant="${variant}" without crashing`, () => {
        render(<Slider defaultValue={[50]} variant={variant} />);
        expect(screen.getByRole("slider")).toBeInTheDocument();
      });
    });

    it("uses default variant when no variant prop is supplied", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveClass("border-primary");
    });
  });

  describe("animationType", () => {
    const animationTypes = [
      "none", "slide", "fade", "zoom", "spring", "elastic",
      "parallax", "flip", "morph", "hover", "pulse", "breathe",
      "wave", "rainbow", "bounce",
    ] as const;

    animationTypes.forEach((animationType) => {
      it(`renders animationType="${animationType}" without crashing`, () => {
        render(<Slider defaultValue={[50]} animationType={animationType} />);
        expect(screen.getByRole("slider")).toBeInTheDocument();
      });
    });
  });

  describe("sizes", () => {
    it('renders size="sm" and applies py-2 wrapper class', () => {
      const { container } = render(<Slider defaultValue={[50]} size="sm" />);
      expect(container.firstElementChild).toHaveClass("py-2");
    });

    it('renders size="md" and applies py-3 wrapper class', () => {
      const { container } = render(<Slider defaultValue={[50]} size="md" />);
      expect(container.firstElementChild).toHaveClass("py-3");
    });

    it('renders size="lg" and applies py-4 wrapper class', () => {
      const { container } = render(<Slider defaultValue={[50]} size="lg" />);
      expect(container.firstElementChild).toHaveClass("py-4");
    });
  });

  describe("disabled", () => {
    it("sets data-disabled on the thumb when disabled=true", () => {
      render(<Slider defaultValue={[50]} disabled />);
      expect(screen.getByRole("slider")).toHaveAttribute("data-disabled", "");
    });

    it("does not set data-disabled when disabled is not passed", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).not.toHaveAttribute("data-disabled");
    });
  });

  describe("controlled value & callbacks", () => {
    it("reflects initial controlled value in aria-valuenow", () => {
      render(<Slider value={[30]} onValueChange={vi.fn()} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "30");
    });

    it("updates aria-valuenow when controlled value prop changes", () => {
      const onValueChange = vi.fn();
      const { rerender } = render(
        <Slider value={[30]} onValueChange={onValueChange} />
      );
      rerender(<Slider value={[60]} onValueChange={onValueChange} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "60");
    });

    it("calls onValueChange when the slider value changes via keyboard", () => {
      const onValueChange = vi.fn();
      render(
        <Slider defaultValue={[50]} min={0} max={100} onValueChange={onValueChange} />
      );
      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith([51]);
    });

    it("increments value by step on ArrowRight", () => {
      render(<Slider defaultValue={[50]} min={0} max={100} step={5} onValueChange={vi.fn()} />);
      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      expect(thumb).toHaveAttribute("aria-valuenow", "55");
    });

    it("decrements value by step on ArrowLeft", () => {
      render(<Slider defaultValue={[50]} min={0} max={100} step={5} onValueChange={vi.fn()} />);
      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowLeft" });
      expect(thumb).toHaveAttribute("aria-valuenow", "45");
    });

    it("does not exceed max on ArrowRight at boundary", () => {
      render(<Slider defaultValue={[100]} min={0} max={100} onValueChange={vi.fn()} />);
      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      expect(thumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("does not go below min on ArrowLeft at boundary", () => {
      render(<Slider defaultValue={[0]} min={0} max={100} onValueChange={vi.fn()} />);
      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowLeft" });
      expect(thumb).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("min / max / step", () => {
    it("sets aria-valuemin and aria-valuemax", () => {
      render(<Slider defaultValue={[5]} min={0} max={10} />);
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "0");
      expect(thumb).toHaveAttribute("aria-valuemax", "10");
    });

    it("defaults aria-valuemin to 0 and aria-valuemax to 100", () => {
      render(<Slider defaultValue={[50]} />);
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "0");
      expect(thumb).toHaveAttribute("aria-valuemax", "100");
    });
  });

  describe("showTooltip", () => {
    it("does not render tooltip content when showTooltip=false (default)", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.queryByText("50")).not.toBeInTheDocument();
    });

    it("renders tooltip with value on hover when showTooltip=true", () => {
      const { container } = render(
        <Slider defaultValue={[33]} showTooltip />
      );
      fireEvent.mouseEnter(container.firstElementChild!);
      expect(screen.getByText("33")).toBeInTheDocument();
    });

    it("renders tooltip with prefix and suffix on hover", () => {
      const { container } = render(
        <Slider defaultValue={[50]} showTooltip valuePrefix="€" valueSuffix="k" />
      );
      fireEvent.mouseEnter(container.firstElementChild!);
      expect(screen.getByText("€50k")).toBeInTheDocument();
    });

    it("hides tooltip after mouse leaves the wrapper", () => {
      const { container } = render(
        <Slider defaultValue={[50]} showTooltip />
      );
      const wrapper = container.firstElementChild!;
      fireEvent.mouseEnter(wrapper);
      expect(screen.getByText("50")).toBeInTheDocument();
      fireEvent.mouseLeave(wrapper);
      expect(screen.queryByText("50")).not.toBeInTheDocument();
    });
  });

  describe("glowEffect", () => {
    it("renders without crashing when glowEffect=true", () => {
      render(<Slider defaultValue={[50]} glowEffect />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });
  });

  describe("orientation", () => {
    it("sets aria-orientation to horizontal by default", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      );
    });

    it("sets aria-orientation to vertical when passed", () => {
      render(<Slider defaultValue={[50]} orientation="vertical" />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });
  });
});