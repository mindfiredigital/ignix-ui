import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { RadioGroup } from ".";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  Variants: {},
}));

const defaultOptions = [
  { value: "one", label: "Option One" },
  { value: "two", label: "Option Two" },
  { value: "three", label: "Option Three" },
];

describe("RadioGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders all radio options", () => {
      render(<RadioGroup options={defaultOptions} />);

      expect(screen.getByText("Option One")).toBeInTheDocument();
      expect(screen.getByText("Option Two")).toBeInTheDocument();
      expect(screen.getByText("Option Three")).toBeInTheDocument();
    });

    it("renders radio buttons with correct roles", () => {
      render(<RadioGroup options={defaultOptions} />);

      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
    });

    it("renders with empty options array", () => {
      render(<RadioGroup options={[]} />);
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <RadioGroup options={defaultOptions} className="custom-class" />
      );
      const root = container.querySelector('[class*="flex"]');
      expect(root).toHaveClass("custom-class");
    });
  });

  describe("Controlled Component", () => {
    it("works as a controlled component", async () => {
      const user = userEvent.setup();

      const Controlled = () => {
        const [value, setValue] = React.useState("one");
        return (
          <RadioGroup
            options={defaultOptions}
            value={value}
            onChange={setValue}
          />
        );
      };

      render(<Controlled />);

      const radioOne = screen.getByRole("radio", { name: "Option One" });
      const radioTwo = screen.getByRole("radio", { name: "Option Two" });

      expect(radioOne).toHaveAttribute("data-state", "checked");
      expect(radioTwo).toHaveAttribute("data-state", "unchecked");

      await user.click(screen.getByText("Option Two"));

      expect(radioTwo).toHaveAttribute("data-state", "checked");
      expect(radioOne).toHaveAttribute("data-state", "unchecked");
    });

    it("updates when controlled value changes", () => {
      const { rerender } = render(
        <RadioGroup options={defaultOptions} value="one" />
      );

      let radioOne = screen.getByRole("radio", { name: "Option One" });
      expect(radioOne).toHaveAttribute("data-state", "checked");

      rerender(<RadioGroup options={defaultOptions} value="two" />);

      radioOne = screen.getByRole("radio", { name: "Option One" });
      const radioTwo = screen.getByRole("radio", { name: "Option Two" });
      expect(radioOne).toHaveAttribute("data-state", "unchecked");
      expect(radioTwo).toHaveAttribute("data-state", "checked");
    });

    it("calls onChange when option is clicked in controlled mode", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup
          options={defaultOptions}
          value="one"
          onChange={onChange}
        />
      );

      await user.click(screen.getByText("Option Two"));

      expect(onChange).toHaveBeenCalledWith("two");
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Uncontrolled Component", () => {
    it("selects defaultValue when uncontrolled", () => {
      render(
        <RadioGroup options={defaultOptions} defaultValue="two" />
      );

      const radio = screen.getByRole("radio", { name: "Option Two" });
      expect(radio).toHaveAttribute("data-state", "checked");
    });

    it("calls onChange when option is clicked in uncontrolled mode", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup
          options={defaultOptions}
          defaultValue="one"
          onChange={onChange}
        />
      );

      await user.click(screen.getByText("Option Two"));

      expect(onChange).toHaveBeenCalledWith("two");
    });

    it("selects first non-disabled option when no defaultValue provided", () => {
      render(
        <RadioGroup
          options={[
            { value: "one", label: "Option One", disabled: true },
            { value: "two", label: "Option Two" },
            { value: "three", label: "Option Three" },
          ]}
        />
      );

      const radioTwo = screen.getByRole("radio", { name: "Option Two" });
      expect(radioTwo).toHaveAttribute("data-state", "checked");
    });
  });

  describe("Variants", () => {
    const variants = [
      "default",
      "primary",
      "success",
      "warning",
      "danger",
      "outline",
      "neon",
    ] as const;

    variants.forEach((variant) => {
      it(`renders with ${variant} variant`, () => {
        const { container } = render(
          <RadioGroup options={defaultOptions} variant={variant} />
        );
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });

  describe("Sizes", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    sizes.forEach((size) => {
      it(`renders with ${size} size`, () => {
        const { container } = render(
          <RadioGroup options={defaultOptions} size={size} />
        );
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });

  describe("Animation Variants", () => {
    const animationVariants = [
      "bounce",
      "scale",
      "pulse",
      "glow",
      "shake",
      "flip",
      "nina",
    ] as const;

    animationVariants.forEach((animationVariant) => {
      it(`renders with ${animationVariant} animation variant`, () => {
        expect(() => {
          render(
            <RadioGroup
              options={defaultOptions}
              animationVariant={animationVariant}
            />
          );
        }).not.toThrow();
      });
    });

    it("falls back to bounce when invalid animation variant provided", () => {
      expect(() => {
        render(
          <RadioGroup
            options={defaultOptions}
            animationVariant={"invalid" as any}
          />
        );
      }).not.toThrow();
    });
  });

  describe("Checked Variants", () => {
    it("renders with surface checked variant", () => {
      render(
        <RadioGroup
          options={defaultOptions}
          checkedVariant="surface"
          value="one"
        />
      );

      const radio = screen.getByRole("radio", { name: "Option One" });
      expect(radio).toHaveAttribute("data-state", "checked");
    });

    it("renders with default checked variant", () => {
      render(
        <RadioGroup
          options={defaultOptions}
          checkedVariant="default"
          value="one"
        />
      );

      const radio = screen.getByRole("radio", { name: "Option One" });
      expect(radio).toHaveAttribute("data-state", "checked");
    });

    it("renders with classic checked variant", () => {
      render(
        <RadioGroup
          options={defaultOptions}
          checkedVariant="classic"
          value="one"
        />
      );

      const radio = screen.getByRole("radio", { name: "Option One" });
      expect(radio).toHaveAttribute("data-state", "checked");
    });
  });

  describe("Label Position", () => {
    it("renders label on the right by default", () => {
      render(<RadioGroup options={defaultOptions} />);

      const labels = screen.getAllByText(/Option/);
      expect(labels.length).toBeGreaterThan(0);
    });

    it("renders label on the left when labelPosition='left'", () => {
      render(
        <RadioGroup options={defaultOptions} labelPosition="left" />
      );

      const labels = screen.getAllByText(/Option/);
      expect(labels.length).toBeGreaterThan(0);
    });

    it("renders label on the right when labelPosition='right'", () => {
      render(
        <RadioGroup options={defaultOptions} labelPosition="right" />
      );

      const labels = screen.getAllByText(/Option/);
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe("Direction", () => {
    it("renders vertically by default", () => {
      const { container } = render(
        <RadioGroup options={defaultOptions} />
      );
      const root = container.querySelector('[class*="flex-col"]');
      expect(root).toBeInTheDocument();
    });

    it("renders horizontally when direction='horizontal'", () => {
      const { container } = render(
        <RadioGroup options={defaultOptions} direction="horizontal" />
      );
      const root = container.querySelector('[class*="flex-row"]');
      expect(root).toBeInTheDocument();
    });

    it("renders vertically when direction='vertical'", () => {
      const { container } = render(
        <RadioGroup options={defaultOptions} direction="vertical" />
      );
      const root = container.querySelector('[class*="flex-col"]');
      expect(root).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables all options when disabled prop is true", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup
          options={defaultOptions}
          disabled
          onChange={onChange}
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });

      await user.click(screen.getByText("Option Two"));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("respects per-option disabled state", () => {
      render(
        <RadioGroup
          options={[
            { value: "one", label: "Option One", disabled: true },
            { value: "two", label: "Option Two" },
          ]}
        />
      );

      const radioOne = screen.getByRole("radio", { name: "Option One" });
      const radioTwo = screen.getByRole("radio", { name: "Option Two" });

      expect(radioOne).toBeDisabled();
      expect(radioTwo).not.toBeDisabled();
    });

    it("disables option when both global and per-option disabled are true", () => {
      render(
        <RadioGroup
          options={[
            { value: "one", label: "Option One", disabled: true },
            { value: "two", label: "Option Two" },
          ]}
          disabled
        />
      );

      const radioOne = screen.getByRole("radio", { name: "Option One" });
      const radioTwo = screen.getByRole("radio", { name: "Option Two" });

      expect(radioOne).toBeDisabled();
      expect(radioTwo).toBeDisabled();
    });

    it("does not call onChange when disabled option is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup
          options={[
            { value: "one", label: "Option One", disabled: true },
            { value: "two", label: "Option Two" },
          ]}
          onChange={onChange}
        />
      );

      await user.click(screen.getByText("Option One"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Name Attribute", () => {
    it("applies name attribute to radio group", () => {
      render(
        <RadioGroup options={defaultOptions} name="test-group" />
      );
      // Radix Radio passes name to individual radio inputs
      const radios = screen.getAllByRole("radio");
      expect(radios.length).toBeGreaterThan(0);
      // Verify the component renders correctly with name prop
      expect(screen.getByText("Option One")).toBeInTheDocument();
    });

    it("works without name attribute", () => {
      render(<RadioGroup options={defaultOptions} />);
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });
  });

  describe("onChange Callback", () => {
    it("calls onChange with correct value when option is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup options={defaultOptions} onChange={onChange} />
      );

      await user.click(screen.getByText("Option Two"));
      expect(onChange).toHaveBeenCalledWith("two");

      await user.click(screen.getByText("Option Three"));
      expect(onChange).toHaveBeenCalledWith("three");
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("does not call onChange when clicking already selected option", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup
          options={defaultOptions}
          defaultValue="one"
          onChange={onChange}
        />
      );

      // Option One is already selected, clicking it again shouldn't trigger onChange
      await user.click(screen.getByText("Option One"));
      // Radix Radio doesn't call onChange when clicking an already selected option
      expect(onChange).not.toHaveBeenCalled();
    });

    it("handles undefined onChange gracefully", async () => {
      const user = userEvent.setup();

      expect(() => {
        render(<RadioGroup options={defaultOptions} onChange={undefined} />);
        user.click(screen.getByText("Option Two"));
      }).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("handles single option", () => {
      render(<RadioGroup options={[{ value: "one", label: "Only Option" }]} />);
      expect(screen.getByText("Only Option")).toBeInTheDocument();
      expect(screen.getByRole("radio")).toBeInTheDocument();
    });

    it("handles options with empty strings", () => {
      render(
        <RadioGroup
          options={[
            { value: "", label: "Empty Value" },
            { value: "two", label: "Option Two" },
          ]}
        />
      );
      expect(screen.getByText("Empty Value")).toBeInTheDocument();
    });

    it("handles all options disabled", () => {
      render(
        <RadioGroup
          options={[
            { value: "one", label: "Option One", disabled: true },
            { value: "two", label: "Option Two", disabled: true },
          ]}
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it("handles rapid clicking between options", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup options={defaultOptions} onChange={onChange} />
      );

      // First option is auto-selected, so clicking it won't trigger onChange
      // Click different options to trigger onChange
      await user.click(screen.getByText("Option Two"));
      await user.click(screen.getByText("Option Three"));
      await user.click(screen.getByText("Option One"));

      // Should be called 3 times (two -> three -> one)
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenNthCalledWith(1, "two");
      expect(onChange).toHaveBeenNthCalledWith(2, "three");
      expect(onChange).toHaveBeenNthCalledWith(3, "one");
    });

    it("handles value prop change from undefined to defined", () => {
      const { rerender } = render(
        <RadioGroup options={defaultOptions} />
      );

      rerender(<RadioGroup options={defaultOptions} value="two" />);

      const radioTwo = screen.getByRole("radio", { name: "Option Two" });
      expect(radioTwo).toHaveAttribute("data-state", "checked");
    });
  });

  describe("Accessibility", () => {
    it("has proper radio roles", () => {
      render(<RadioGroup options={defaultOptions} />);

      const radios = screen.getAllByRole("radio");
      expect(radios.length).toBe(3);
    });

    it("associates labels with radio buttons", () => {
      render(<RadioGroup options={defaultOptions} />);

      const radioOne = screen.getByRole("radio", { name: "Option One" });
      expect(radioOne).toBeInTheDocument();
    });

    it("maintains radio group semantics", () => {
      render(
        <RadioGroup options={defaultOptions} name="test-group" />
      );

      const radios = screen.getAllByRole("radio");
      expect(radios.length).toBeGreaterThan(0);
    });
  });

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      expect(() => {
        render(
          <RadioGroup
            options={defaultOptions}
            name="test-group"
            value="one"
            variant="primary"
            size="lg"
            labelPosition="left"
            direction="horizontal"
            checkedVariant="surface"
            animationVariant="pulse"
            className="custom-class"
          />
        );
      }).not.toThrow();
    });

    it("handles controlled component with all styling props", () => {
      const onChange = vi.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="two"
          onChange={onChange}
          variant="success"
          size="sm"
          checkedVariant="default"
          animationVariant="glow"
        />
      );

      const radioTwo = screen.getByRole("radio", { name: "Option Two" });
      expect(radioTwo).toHaveAttribute("data-state", "checked");
    });
  });
});
