import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonWithIcon } from './index';
import { Download, Send, Heart, Settings, Search, Plus, Trash2, Edit } from 'lucide-react';

const meta: Meta<typeof ButtonWithIcon> = {
  title: 'Components/Button With Icon',
  component: ButtonWithIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Button With Icon** component extends the base Button component with icon support.  
It supports multiple icon positions, icon-only buttons, and loading states.

### Features
- Icon positioned left or right of text
- Icon-only button variant
- Loading spinner state
- All Button variants and sizes supported
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'ghost', 'link', 'subtle', 'elevated', 'glass', 'neon', 'pill', 'none'],
      description: 'Visual variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'],
      description: 'Size of the button',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right', 'only'],
      description: 'Position of the icon relative to text',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading spinner',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the button',
    },
    iconSize: {
      control: { type: 'number' },
      description: 'Size of the icon in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonWithIcon>;

/**
 * Button with icon positioned to the left of the text.
 * This is the most common pattern for buttons with icons.
 */
export const IconLeftOfText: Story = {
  args: {
    children: 'Download',
    icon: <Download />,
    iconPosition: 'left',
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} variant="default">
          Download
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="primary" icon={<Send />}>
          Send Message
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="success" icon={<Heart />}>
          Like
        </ButtonWithIcon>
      </div>
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} variant="outline" icon={<Settings />}>
          Settings
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="ghost" icon={<Search />}>
          Search
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="danger" icon={<Trash2 />}>
          Delete
        </ButtonWithIcon>
      </div>
    </div>
  ),
};

/**
 * Button with icon positioned to the right of the text.
 * Useful for actions like "Next" or "Continue" where the icon indicates direction.
 */
export const IconRightOfText: Story = {
  args: {
    children: 'Next',
    icon: <Send />,
    iconPosition: 'right',
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} variant="default" icon={<Send />}>
          Send
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="primary" icon={<Download />}>
          Download File
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="success" icon={<Heart />}>
          Save
        </ButtonWithIcon>
      </div>
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} variant="outline" icon={<Settings />}>
          Configure
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="ghost" icon={<Search />}>
          Find
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="danger" icon={<Trash2 />}>
          Remove
        </ButtonWithIcon>
      </div>
    </div>
  ),
};

/**
 * Icon-only buttons are compact and space-efficient.
 * Perfect for toolbars, action menus, or when space is limited.
 */
export const IconOnlyButton: Story = {
  args: {
    icon: <Settings />,
    iconPosition: 'only',
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} icon={<Settings />} variant="default" />
        <ButtonWithIcon {...args} icon={<Search />} variant="primary" />
        <ButtonWithIcon {...args} icon={<Plus />} variant="success" />
        <ButtonWithIcon {...args} icon={<Edit />} variant="warning" />
        <ButtonWithIcon {...args} icon={<Trash2 />} variant="danger" />
      </div>
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} icon={<Settings />} variant="outline" />
        <ButtonWithIcon {...args} icon={<Search />} variant="ghost" />
        <ButtonWithIcon {...args} icon={<Heart />} variant="subtle" />
        <ButtonWithIcon {...args} icon={<Download />} variant="elevated" />
        <ButtonWithIcon {...args} icon={<Send />} variant="glass" />
      </div>
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} icon={<Settings />} size="xs" />
        <ButtonWithIcon {...args} icon={<Search />} size="sm" />
        <ButtonWithIcon {...args} icon={<Plus />} size="md" />
        <ButtonWithIcon {...args} icon={<Edit />} size="lg" />
        <ButtonWithIcon {...args} icon={<Trash2 />} size="xl" />
      </div>
    </div>
  ),
};

/**
 * Loading spinner state for buttons.
 * Automatically disables the button and shows a spinner.
 * Useful for async operations like form submissions or API calls.
 */
export const LoadingSpinner: Story = {
  args: {
    children: 'Loading...',
    loading: true,
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} variant="default">
          Processing
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="primary">
          Saving
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="success">
          Uploading
        </ButtonWithIcon>
      </div>
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} variant="outline">
          Loading
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="ghost">
          Please Wait
        </ButtonWithIcon>
        <ButtonWithIcon {...args} variant="danger">
          Deleting
        </ButtonWithIcon>
      </div>
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} loading={true} iconPosition="only" />
        <ButtonWithIcon {...args} loading={true} variant="primary" iconPosition="only" />
        <ButtonWithIcon {...args} loading={true} variant="success" iconPosition="only" />
        <ButtonWithIcon {...args} loading={true} variant="outline" iconPosition="only" />
      </div>
      <div className="flex gap-2 items-center">
        <ButtonWithIcon {...args} size="xs">
          Small
        </ButtonWithIcon>
        <ButtonWithIcon {...args} size="sm">
          Small
        </ButtonWithIcon>
        <ButtonWithIcon {...args} size="md">
          Medium
        </ButtonWithIcon>
        <ButtonWithIcon {...args} size="lg">
          Large
        </ButtonWithIcon>
        <ButtonWithIcon {...args} size="xl">
          Extra Large
        </ButtonWithIcon>
      </div>
    </div>
  ),
};

