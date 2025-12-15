import { useState } from "react";
import { RadioGroup, type RadioOption } from ".";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta:Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "primary", "success", "warning", "danger", "neon"],
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    labelPosition: {
      control: { type: "select" },
      options: ["left", "right"],
    },
    checkedVariant: {
      control: { type: "select" },
      options: ["classic", "surface"],
    },
    animationVariant: {
      control: { type: "select" },
      options: ["bounce", "scale", "pulse", "glow", "shake", "flip", "nina"],
    },
  },
}

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("one");

    const options: RadioOption[] = [
      { value: "one", label: "Option One" },
      { value: "two", label: "Option Two" },
      { value: "three", label: "Option Three" },
    ];

    return (
      <div className="p-5">
        <RadioGroup
          name="example"
          options={options}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const LabelPositions: Story = {
  render: () => {
    const [valueLeft, setValueLeft] = useState("one");
    const [valueRight, setValueRight] = useState("one");

    const options: RadioOption[] = [
      { value: "one", label: "Option One" },
      { value: "two", label: "Option Two" },
    ];

    return (
      <div className="flex flex-col gap-6 p-5">
        <div>
          <p className="mb-2 text-sm font-medium">Label on Right (default)</p>
          <RadioGroup
            name="right-label"
            options={options}
            value={valueRight}
            onChange={setValueRight}
            labelPosition="right"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Label on Left</p>
          <RadioGroup
            name="left-label"
            options={options}
            value={valueLeft}
            onChange={setValueLeft}
            labelPosition="left"
          />
        </div>
      </div>
    );
  },
};

export const DifferentSizes: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, string>>({
      xs: "one",
      sm: "one",
      md: "one",
      lg: "one",
      xl: "one",
    });

    const options: RadioOption[] = [
      { value: "one", label: "Option One" },
      { value: "two", label: "Option Two" },
    ];

    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    return (
      <div className="flex flex-col gap-6 p-5">
        {sizes.map((size) => (
          <div key={size}>
            <p className="mb-2 text-sm font-medium">
              {size.toUpperCase()}
            </p>
            <RadioGroup
              name={`size-${size}`}
              size={size}
              options={options}
              value={values[size]}
              onChange={(val) =>
                setValues((prev) => ({ ...prev, [size]: val }))
              }
            />
          </div>
        ))}
      </div>
    );
  },
};

export const DifferentVariants: Story = {
  args: {
    size: "lg"
  },

  render: () => {
    const [value, setValue] = useState("one");

    const options: RadioOption[] = [
      { value: "one", label: "Option One" },
      { value: "two", label: "Option Two" },
      { value: "three", label: "Option Three" },
    ];

    const variants = ["default", "primary", "success", "warning", "danger", "neon"] as const;

    return (
      <div className="p-5">
      {variants.map((variant) => (
        <>
        <p className="mb-2 text-sm font-medium">
            {variant.toUpperCase()}
        </p>
        <RadioGroup
          name="example"
          options={options}
          value={value}
          onChange={setValue}
          variant={variant}
        />
        </>
        ))}
      </div>
    );
  }
};

export const CheckedVariants: Story = {
  args: {
    size: "lg"
  },

  render: () => {
    const [value, setValue] = useState("one");

    const options: RadioOption[] = [
      { value: "one", label: "Option One" },
      { value: "two", label: "Option Two" },
      { value: "three", label: "Option Three" },
    ];

    const checkedVariants = ["classic", "surface"] as const;

    return (
      <div className="p-5">
      {checkedVariants.map((checkedVariant) => (
        <>
        <p className="mb-2 text-sm font-medium">
            {checkedVariant.toUpperCase()}
        </p>
        <RadioGroup
          name="example"
          options={options}
          value={value}
          onChange={setValue}
          checkedVariant={checkedVariant}
        />
        </>
        ))}
      </div>
    );
  }
};

export const AnimationCheck: Story = {
  render: () => {
    const [value, setValue] = useState("one");

    return (
      <RadioGroup
        name="animation-test"
        options={[
          { value: "one", label: "Click me" },
          { value: "two", label: "Click me too" },
        ]}
        value={value}
        defaultChecked
        onChange={setValue}
        animationVariant="pulse" // 👈 change this manually
        size="lg"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState("one");

    return (
      <RadioGroup
        name="disabled"
        options={[
          { value: "one", label: "Click me" },
          { value: "two", label: "Click me too" },
        ]}
        value={value}
        onChange={setValue}
        disabled // 👈 change this manually
        size="lg"
      />
    );
  },
}

export const defaultChecked: Story = {
  render: () => {
    return (
      <RadioGroup
        name="example"
        options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]}
        defaultChecked
      />
    );
  },
}

