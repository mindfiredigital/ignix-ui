import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AITokenCounter } from "./index";
import { Button } from "../button";

const meta: Meta<typeof AITokenCounter> = {
  title: "Components/AI/AITokenCounter",
  component: AITokenCounter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AITokenCounter** provides real-time monitoring of input, output, and cumulative context window usage. It leverages the ignix-ui \`ProgressIndicator\` layout under the hood to render linear progress bars and circular tracking rings. It automatically calculates usage percentage risk levels (Green: optimal, Orange: warning, Red: danger context threshold limit warning).
        `,
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["bar", "circular", "compact", "detailed"],
    },
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AITokenCounter>;

export const Detailed: Story = {
  args: {
    inputTokens: 1200,
    outputTokens: 450,
    maxTokens: 4096,
    mode: "detailed",
    label: "GPT-4o Context",
    variant: "default",
  },
};

export const Bar: Story = {
  args: {
    inputTokens: 800,
    outputTokens: 250,
    maxTokens: 2000,
    mode: "bar",
    label: "Input Ingestion",
    variant: "default",
  },
};

export const Circular: Story = {
  args: {
    inputTokens: 1500,
    outputTokens: 900,
    maxTokens: 4096,
    mode: "circular",
    label: "Claude 3.5 Sonnet",
    variant: "default",
  },
};

export const Compact: Story = {
  args: {
    inputTokens: 320,
    outputTokens: 90,
    maxTokens: 1000,
    mode: "compact",
    label: "Token Limit",
    variant: "default",
  },
};

export const DarkTheme: Story = {
  args: {
    inputTokens: 2400,
    outputTokens: 850,
    maxTokens: 4096,
    mode: "detailed",
    label: "Llama 3 70B",
    variant: "dark",
  },
};

export const Glassmorphic: Story = {
  args: {
    inputTokens: 1100,
    outputTokens: 400,
    maxTokens: 3000,
    mode: "detailed",
    label: "Gemini 1.5 Pro",
    variant: "glass",
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-black via-red-950 to-neutral-900 max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const NearLimitWarning: Story = {
  args: {
    inputTokens: 3200,
    outputTokens: 600,
    maxTokens: 4000,
    mode: "detailed",
    label: "Danger Limit Warnings",
    variant: "default",
  },
};

const TokenSimulator = () => {
  const [inputs, setInputs] = useState(500);
  const [outputs, setOutputs] = useState(200);
  const max = 2000;

  return (
    <div className="flex flex-col space-y-5 max-w-sm">
      <AITokenCounter
        inputTokens={inputs}
        outputTokens={outputs}
        maxTokens={max}
        mode="detailed"
        label="Dynamic Simulator"
      />
      <div className="flex gap-2 justify-center">
        <Button
          size="compact"
          variant="subtle"
          onClick={() => setInputs((prev) => Math.min(prev + 150, max - outputs))}
        >
          +150 Input
        </Button>
        <Button
          size="compact"
          variant="subtle"
          onClick={() => setOutputs((prev) => Math.min(prev + 150, max - inputs))}
        >
          +150 Output
        </Button>
        <Button
          size="compact"
          variant="outline"
          onClick={() => {
            setInputs(500);
            setOutputs(200);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export const InteractiveSimulator: Story = {
  render: () => <TokenSimulator />,
};
