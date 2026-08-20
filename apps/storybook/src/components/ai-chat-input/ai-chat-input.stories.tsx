import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { AIChatInput } from "./index";

const meta: Meta<typeof AIChatInput> = {
  title: "Components/AI/AIChatInput",
  component: AIChatInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIChatInput** is an auto-growing chat textarea built for AI conversation interfaces.

### Features
- Auto-growing textarea, up to \`maxRows\` before scrolling internally
- Enter to send, Shift+Enter for a newline
- Swaps to a stop button while \`isStreaming\` is true
- Optional attachment slot rendered next to the send/stop button
- Four surface variants: default, dark, glass, minimal
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "glass", "minimal"],
      description: "Surface style of the input",
    },
    isStreaming: {
      control: "boolean",
      description: "Shows a stop button instead of send",
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIChatInput>;

const ControlledInput = (args: ComponentProps<typeof AIChatInput>) => {
  const [value, setValue] = useState(args.value ?? "");
  return (
    <div className="w-[420px]">
      <AIChatInput
        {...args}
        value={value}
        onChange={setValue}
        onSend={(sent) => {
          console.log("sent:", sent);
          setValue("");
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    variant: "default",
    placeholder: "Message...",
  },
};

export const Streaming: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    variant: "default",
    value: "Tell me about the Eiffel Tower",
    isStreaming: true,
  },
};

export const WithAttachment: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    variant: "default",
    attachmentSlot: (
      <button
        type="button"
        aria-label="Attach file"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 -ml-2"
      >
        <Plus size={18} />
      </button>
    ),
  },
};

export const Disabled: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    variant: "default",
    value: "",
    disabled: true,
    placeholder: "Waiting for connection...",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[420px]">
      <ControlledInput variant="default" onChange={() => undefined} onSend={() => undefined} value="" />
      <div className="bg-neutral-950 p-4 rounded-2xl">
        <ControlledInput variant="dark" onChange={() => undefined} onSend={() => undefined} value="" />
      </div>
      <div className="bg-neutral-800 p-4 rounded-2xl">
        <ControlledInput variant="glass" onChange={() => undefined} onSend={() => undefined} value="" />
      </div>
      <ControlledInput variant="minimal" onChange={() => undefined} onSend={() => undefined} value="" />
    </div>
  ),
};
