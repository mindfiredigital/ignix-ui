import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./index";

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Set up your profile" },
  { label: "Plan", description: "Choose a plan" },
  { label: "Done", description: "You're all set!" },
];

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A horizontal step progress indicator. Completed steps show a checkmark, " +
          "the active step is highlighted in primary color, and future steps are muted.",
      },
    },
  },
  argTypes: {
    activeStep: {
      control: { type: "number", min: 0, max: 3, step: 1 },
      description: "Zero-based index of the currently active step.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const StepOne: Story = {
  name: "Step 1 / 4",
  args: { steps, activeStep: 0 },
};

export const StepTwo: Story = {
  name: "Step 2 / 4",
  args: { steps, activeStep: 1 },
};

export const StepFour: Story = {
  name: "Step 4 / 4 (complete)",
  args: { steps, activeStep: 3 },
};

export const NoDescriptions: Story = {
  name: "No descriptions",
  args: {
    steps: steps.map(({ label }) => ({ label })),
    activeStep: 1,
  },
};

export const Interactive: Story = {
  name: "Interactive wizard",
  render: () => {
    const [active, setActive] = useState(0);
    return (
      <div className="flex flex-col gap-8">
        <Stepper steps={steps} activeStep={active} />
        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded border border-border text-sm disabled:opacity-40"
            onClick={() => setActive((p) => Math.max(0, p - 1))}
            disabled={active === 0}
          >
            Back
          </button>
          <button
            className="px-4 py-2 rounded bg-primary text-white text-sm disabled:opacity-40"
            onClick={() => setActive((p) => Math.min(steps.length - 1, p + 1))}
            disabled={active === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};
