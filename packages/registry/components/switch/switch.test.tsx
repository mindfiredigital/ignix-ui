import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Switch } from ".";

vi.mock("@radix-ui/react-switch", async () => {
  const actual = await vi.importActual("@radix-ui/react-switch");
  return actual;
});

describe("Switch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Switch />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("is unchecked by default", () => {
      render(<Switch />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    });

    it("renders as checked when checked prop is true", () => {
      const onCheckedChange = vi.fn()
      render(<Switch checked onCheckedChange={onCheckedChange} />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("renders as disabled", () => {
      render(<Switch disabled />);
      expect(screen.getByRole("switch")).toBeDisabled();
    });
  });

  describe("interaction", () => {
    it("calls onCheckedChange when clicked", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch onCheckedChange={onCheckedChange} />);
      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("toggles from checked to unchecked", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch checked onCheckedChange={onCheckedChange} />);
      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });

    it("does not call onCheckedChange when disabled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch disabled onCheckedChange={onCheckedChange} />);
      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe("controlled mode", () => {
    it("updates when checked prop changes", () => {
      const onCheckedChange = vi.fn()
      const { rerender } = render(
        <Switch checked={false} onCheckedChange={onCheckedChange} />
      );
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
      rerender(<Switch checked={true} onCheckedChange={onCheckedChange} />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("variants", () => {
    const variants = ["default", "large", "small", "pill", "square", "slim", "ios", "material"] as const;

    variants.forEach((variant) => {
      it(`renders variant="${variant}" without crashing`, () => {
        render(<Switch variant={variant} />);
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });
    });
  });

  describe("animations", () => {
    const animations = ["default", "bounce", "scale", "rotate", "fade", "elastic", "pulse", "shake", "flip", "jelly", "glow"] as const;

    animations.forEach((animation) => {
      it(`renders animation="${animation}" without crashing`, () => {
        render(<Switch animation={animation} />);
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });
    });
  });

  describe("className forwarding", () => {
    it("applies custom className via thumbClassName", () => {
      render(<Switch thumbClassName="my-thumb" />);
      const thumb = document.querySelector(".my-thumb");
      expect(thumb).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("is keyboard focusable", () => {
      render(<Switch />);
      const sw = screen.getByRole("switch");
      sw.focus();
      expect(document.activeElement).toBe(sw);
    });

    it("toggles on Space key press", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch onCheckedChange={onCheckedChange} />);
      screen.getByRole("switch").focus();
      await user.keyboard(" ");
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
  });
});
