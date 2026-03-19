import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown, DropdownItem } from "./index";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A Radix UI–based dropdown menu with Framer Motion animations. " +
          "Compose menu items using the exported `DropdownItem` component.",
      },
    },
  },
  argTypes: {
    animation: {
      control: "select",
      options: ["default", "fade", "scale", "slide", "flip"],
      description: "Enter/exit animation applied to the menu panel.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Font size of menu items.",
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "full"],
      description: "Border radius of the menu panel.",
    },
    bg: {
      control: "select",
      options: ["default", "dark", "transparent", "glass", "gradient", "primary"],
      description: "Background style of the menu panel.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const BasicItems = () => (
  <>
    <DropdownItem onSelect={() => console.log("Profile")}>Profile</DropdownItem>
    <DropdownItem onSelect={() => console.log("Settings")}>Settings</DropdownItem>
    <DropdownItem onSelect={() => console.log("Billing")}>Billing</DropdownItem>
    <DropdownItem onSelect={() => console.log("Sign out")} className="text-destructive">
      Sign out
    </DropdownItem>
  </>
);


export const Default: Story = {
  args: { animation: "default", size: "md", rounded: "md", bg: "default" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Open menu
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const FadeAnimation: Story = {
  name: "Animation / Fade",
  args: { animation: "fade" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Fade 
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const ScaleAnimation: Story = {
  name: "Animation / Scale",
  args: { animation: "scale" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Scale 
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const SlideAnimation: Story = {
  name: "Animation / Slide",
  args: { animation: "slide" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Slide 
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const FlipAnimation: Story = {
  name: "Animation / Flip",
  args: { animation: "flip" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Flip
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const Dark: Story = {
  args: { bg: "dark", animation: "default" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Dark 
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const Glass: Story = {
  args: { bg: "glass", animation: "fade" },
  parameters: {
    backgrounds: { disable: true },
  },
  render: (args) => (
    <div className="relative flex items-center justify-center w-64 h-48 rounded-xl overflow-visible bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500">
      <Dropdown
        {...args}
        trigger={
          <button className="px-4 py-2 rounded-md border border-white/30 bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm">
            Glass 
          </button>
        }
      >
        <BasicItems />
      </Dropdown>
    </div>
  ),
};
 

export const Transparent: Story = {
  args: { bg: "transparent", animation: "fade" },
  parameters: {
    backgrounds: { disable: true },
  },
  render: (args) => (
    <div className="relative flex items-center justify-center w-64 h-48 rounded-xl overflow-visible bg-accent-foreground">
      <Dropdown
        {...args}
        trigger={
          <button className="px-4 py-2 rounded-md border border-white/30 bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm">
            Transparent 
          </button>
        }
      >
        <BasicItems />
      </Dropdown>
    </div>
  ),
};
 
export const Gradient: Story = {
  args: { bg: "gradient", animation: "slide" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Gradient
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const Primary: Story = {
  args: { bg: "primary", animation: "scale" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Primary 
        </button>
      }
    >
      <BasicItems />
    </Dropdown>
  ),
};

export const ManyItems: Story = {
  args: { animation: "default" },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <button className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          Many items
        </button>
      }
    >
      {Array.from({ length: 10 }, (_, i) => (
        <DropdownItem key={i} onSelect={() => console.log(`Item ${i + 1}`)}>
          Item {i + 1}
        </DropdownItem>
      ))}
    </Dropdown>
  ),
};