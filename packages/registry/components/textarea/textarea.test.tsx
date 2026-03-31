import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual };
});
import AnimatedTextarea from ".";

const renderTextarea = (
  props: Partial<React.ComponentProps<typeof AnimatedTextarea>> = {}
) => {
  const onChange = vi.fn();
  const result = render(
    <AnimatedTextarea
      placeholder="Your message"
      variant="clean"
      value=""
      onChange={onChange}
      {...props}
    />
  );
  return { ...result, onChange };
};

describe("AnimatedTextarea", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("rendering", () => {
    it("renders a textarea element", () => {
      renderTextarea();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders the floating label", () => {
      renderTextarea({ placeholder: "Write here" });
      expect(screen.getByText("Write here")).toBeInTheDocument();
    });

    it("renders as disabled when disabled=true", () => {
      renderTextarea({ disabled: true });
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("applies minRows as the rows attribute", () => {
      renderTextarea({ minRows: 5 });
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
    });
  });

  describe("onChange", () => {
    it("calls onChange when the user types", async () => {
      const user = userEvent.setup();
      const { onChange } = renderTextarea();
      await user.type(screen.getByRole("textbox"), "hello");
      expect(onChange).toHaveBeenCalled();
    });

    it("does not call onChange when disabled", async () => {
      const { onChange } = renderTextarea({ disabled: true });
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "hi" } });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("maxLength", () => {
    it("sets maxLength on the textarea element", () => {
      renderTextarea({ maxLength: 100 });
      expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "100");
    });

    it("does not call onChange when value exceeds maxLength", () => {
      const { onChange } = renderTextarea({ maxLength: 5 });
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "123456" },
      });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("character count display", () => {
    it("shows character count when showCharacterCount=true", () => {
      render(
        <AnimatedTextarea
          variant="characterCount"
          placeholder="Count"
          value="hello"
          onChange={vi.fn()}
          showCharacterCount
          maxLength={200}
        />
      );
      expect(screen.getByText("5 / 200")).toBeInTheDocument();
    });

    it("does not show character count by default", () => {
      renderTextarea({ value: "abc" });
      expect(screen.queryByText(/\/ /)).not.toBeInTheDocument();
    });
  });

  describe("focus / blur", () => {
    it("calls onFocus when textarea is focused", async () => {
      const onFocus = vi.fn();
      renderTextarea({ onFocus });
      await userEvent.click(screen.getByRole("textbox"));
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when textarea loses focus", async () => {
      const onBlur = vi.fn();
      renderTextarea({ onBlur });
      const textarea = screen.getByRole("textbox");
      await userEvent.click(textarea);
      await userEvent.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("variants", () => {
    const variants = [
      "clean", "expandable", "smoothExpand", "glowBorder", "characterCount",
      "lineHighlight", "typewriterSound", "markdownPreview", "autoComplete",
      "syntaxHighlight", "rippleEffect", "gradientBorder", "neonGlow",
      "particleField", "elastic", "wave", "spotlight", "liquid", "cosmic", "hologram",
    ] as const;

    variants.forEach((variant) => {
      it(`renders variant="${variant}" without crashing`, () => {
        render(
          <AnimatedTextarea
            variant={variant}
            placeholder="Test"
            value=""
            onChange={vi.fn()}
          />
        );
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });
    });
  });

  describe("controlled value", () => {
    it("reflects external value prop in the textarea", () => {
      const { rerender } = render(
        <AnimatedTextarea variant="clean" placeholder="p" value="initial" onChange={vi.fn()} />
      );
      expect(screen.getByRole("textbox")).toHaveValue("initial");

      rerender(
        <AnimatedTextarea variant="clean" placeholder="p" value="updated" onChange={vi.fn()} />
      );
      expect(screen.getByRole("textbox")).toHaveValue("updated");
    });
  });
});
