/**
 * Storybook Stories for ButtonGroup Component
 * 
 * This file contains various story configurations to showcase different
 * states and use cases of the ButtonGroup component.
 * 
 * Stories include:
 * - Default configuration with multiple buttons
 * - Active state highlighting
 * - Different orientations (horizontal/vertical)
 * - Responsive wrapping behavior
 * - Multiple selection mode
 * - Custom spacing and variants
 * 
 * @file button-group.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup } from './index';
import { useState } from 'react';

/**
 * Storybook metadata configuration
 * 
 * This defines the component's display name, description, and controls
 * available in the Storybook UI.
 */
const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/Button Group',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **ButtonGroup** component groups multiple buttons together with consistent spacing,
active state highlighting, and responsive wrapping capabilities.

### Features
- Multiple buttons grouped with consistent spacing
- Active button highlighted with visual indicators
- Proper button alignment
- Responsive wrapping on smaller screens
- Support for both single and multiple selection
- Controlled and uncontrolled modes
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: { type: 'object' },
      description: 'Array of button items to display in the group',
    },
    activeValue: {
      control: { type: 'text' },
      description: 'Currently active button value (controlled mode)',
    },
    defaultValue: {
      control: { type: 'text' },
      description: 'Default active button value (uncontrolled mode)',
    },
    wrap: {
      control: { type: 'boolean' },
      description: 'Whether buttons should wrap to multiple lines',
      defaultValue: true,
    },
    spacing: {
      control: { type: 'text' },
      description: 'Spacing between buttons (Tailwind spacing class)',
      defaultValue: 'gap-2',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the button group',
      defaultValue: 'horizontal',
    },
    activeVariant: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'outline',
        'ghost',
        'link',
        'subtle',
        'elevated',
        'glass',
        'neon',
        'pill',
        'none',
      ],
      description: 'Variant to apply to active buttons',
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple buttons to be active simultaneously',
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

/**
 * Default button group with multiple buttons.
 * Shows basic grouping with consistent spacing and active state highlighting.
 */
export const Default: Story = {
  args: {
    items: [
      { value: 'save', children: 'Save' },
      { value: 'cancel', children: 'Cancel' },
      { value: 'delete', children: 'Delete' },
    ],
    defaultValue: 'save',
    wrap: true,
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <ButtonGroup
        {...args}
        activeValue={activeValue}
        onChange={(value) => setActiveValue(value)}
      />
    );
  },
};

/**
 * Button group with active state highlighting.
 * Demonstrates how the active button is visually distinguished.
 */
export const ActiveStateHighlighted: Story = {
  args: {
    items: [
      { value: 'all', children: 'All' },
      { value: 'active', children: 'Active' },
      { value: 'inactive', children: 'Inactive' },
      { value: 'archived', children: 'Archived' },
    ],
    defaultValue: 'active',
    wrap: true,
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Click buttons to see active state highlighting:
          </p>
          <ButtonGroup
            {...args}
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Active: <strong>{activeValue}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Button group with consistent spacing.
 * Shows proper alignment and spacing between buttons.
 */
export const ConsistentSpacing: Story = {
  args: {
    items: [
      { value: 'xs', children: 'Extra Small', size: 'xs' },
      { value: 'sm', children: 'Small', size: 'sm' },
      { value: 'md', children: 'Medium', size: 'md' },
      { value: 'lg', children: 'Large', size: 'lg' },
      { value: 'xl', children: 'Extra Large', size: 'xl' },
    ],
    defaultValue: 'md',
    wrap: true,
    spacing: 'gap-3',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Buttons with consistent spacing (gap-3):
          </p>
          <ButtonGroup
            {...args}
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Buttons with tighter spacing (gap-1):
          </p>
          <ButtonGroup
            {...args}
            spacing="gap-1"
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Buttons with wider spacing (gap-4):
          </p>
          <ButtonGroup
            {...args}
            spacing="gap-4"
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
      </div>
    );
  },
};

/**
 * Responsive wrapping behavior.
 * Demonstrates how buttons wrap to multiple lines on smaller screens.
 */
export const ResponsiveWrapping: Story = {
  args: {
    items: [
      { value: 'option1', children: 'Option 1' },
      { value: 'option2', children: 'Option 2' },
      { value: 'option3', children: 'Option 3' },
      { value: 'option4', children: 'Option 4' },
      { value: 'option5', children: 'Option 5' },
      { value: 'option6', children: 'Option 6' },
      { value: 'option7', children: 'Option 7' },
      { value: 'option8', children: 'Option 8' },
    ],
    defaultValue: 'option1',
    wrap: true,
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            With wrapping enabled (default):
          </p>
          <div className="border rounded-lg p-4">
            <ButtonGroup
              {...args}
              wrap={true}
              activeValue={activeValue}
              onChange={(value) => setActiveValue(value)}
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Without wrapping (flex-nowrap):
          </p>
          <div className="border rounded-lg p-4 overflow-x-auto">
            <ButtonGroup
              {...args}
              wrap={false}
              activeValue={activeValue}
              onChange={(value) => setActiveValue(value)}
            />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Vertical orientation.
 * Shows buttons arranged vertically instead of horizontally.
 */
export const VerticalOrientation: Story = {
  args: {
    items: [
      { value: 'top', children: 'Top' },
      { value: 'middle', children: 'Middle' },
      { value: 'bottom', children: 'Bottom' },
    ],
    defaultValue: 'middle',
    orientation: 'vertical',
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Vertical button group:
          </p>
          <ButtonGroup
            {...args}
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
      </div>
    );
  },
};

/**
 * Multiple selection mode.
 * Allows multiple buttons to be active simultaneously.
 */
export const MultipleSelection: Story = {
  args: {
    items: [
      { value: 'bold', children: 'Bold' },
      { value: 'italic', children: 'Italic' },
      { value: 'underline', children: 'Underline' },
      { value: 'strikethrough', children: 'Strikethrough' },
    ],
    multiple: true,
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValues, setActiveValues] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Click multiple buttons to select them:
          </p>
          <ButtonGroup
            {...args}
            activeValues={activeValues}
            onChange={(value) => {
              setActiveValues((prev) =>
                prev.includes(value)
                  ? prev.filter((v) => v !== value)
                  : [...prev, value]
              );
            }}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Active: <strong>{activeValues.length > 0 ? activeValues.join(', ') : 'None'}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Different button variants.
 * Shows how different button variants work within a group.
 */
export const DifferentVariants: Story = {
  args: {
    items: [
      { value: 'default', children: 'Default', variant: 'default' },
      { value: 'primary', children: 'Primary', variant: 'primary' },
      { value: 'success', children: 'Success', variant: 'success' },
      { value: 'warning', children: 'Warning', variant: 'warning' },
      { value: 'danger', children: 'Danger', variant: 'danger' },
      { value: 'outline', children: 'Outline', variant: 'outline' },
    ],
    defaultValue: 'primary',
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Button group with different variants:
          </p>
          <ButtonGroup
            {...args}
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            With custom active variant (all active buttons use 'success'):
          </p>
          <ButtonGroup
            {...args}
            activeVariant="success"
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
      </div>
    );
  },
};

/**
 * Real-world example: Filter buttons.
 * Demonstrates a practical use case for filtering content.
 */
export const FilterButtons: Story = {
  args: {
    items: [
      { value: 'all', children: 'All Items' },
      { value: 'published', children: 'Published' },
      { value: 'draft', children: 'Draft' },
      { value: 'archived', children: 'Archived' },
    ],
    defaultValue: 'all',
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Filter by status:</p>
          <ButtonGroup
            {...args}
            activeValue={activeValue}
            onChange={(value) => {
              setActiveValue(value);
              console.log(`Filter changed to: ${value}`);
            }}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing: <strong>{activeValue}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Real-world example: Size selector.
 * Shows button group used for selecting sizes.
 */
export const SizeSelector: Story = {
  args: {
    items: [
      { value: 'xs', children: 'XS' },
      { value: 'sm', children: 'SM' },
      { value: 'md', children: 'MD' },
      { value: 'lg', children: 'LG' },
      { value: 'xl', children: 'XL' },
    ],
    defaultValue: 'md',
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Select size:</p>
          <ButtonGroup
            {...args}
            activeValue={activeValue}
            onChange={(value) => setActiveValue(value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Selected size: <strong>{activeValue?.toUpperCase() ?? 'None'}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Alignment demonstration.
 * Shows proper button alignment in different scenarios.
 */
export const ProperAlignment: Story = {
  args: {
    items: [
      { value: 'left', children: 'Left Aligned' },
      { value: 'center', children: 'Center' },
      { value: 'right', children: 'Right Aligned' },
    ],
    defaultValue: 'right',
    spacing: 'gap-2',
  },
  render: (args) => {
    const [activeValue, setActiveValue] = useState(args.defaultValue);
    return (
      <div className="flex flex-col gap-6 w-[500px]">
        {/* //w-full max-w-[720px] */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Left aligned group:
          </p>
          <div className="flex justify-start w-full border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
            <ButtonGroup
              {...args}
              activeValue={activeValue}
              onChange={(value) => setActiveValue(value)}
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Center aligned group:
          </p>
          <div className="flex justify-center w-full border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
            <ButtonGroup
              {...args}
              activeValue={activeValue}
              onChange={(value) => setActiveValue(value)}
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Right aligned group:
          </p>
          <div className="flex justify-end w-full border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
            <ButtonGroup
              {...args}
              activeValue={activeValue}
              onChange={(value) => setActiveValue(value)}
            />
          </div>
        </div>
      </div>
    );
  },
};

