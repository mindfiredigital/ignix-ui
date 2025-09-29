import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './index';

type AnimationVariant =
  | 'fade'
  | 'slideDown'
  | 'slideUp'
  | 'scaleIn'
  | 'rotate'
  | 'bounce'
  | 'flip'
  | 'zoomIn'
  | 'elastic'
  | 'springy';

interface AccordionStoryProps {
  type: 'single' | 'multiple';
  defaultValue?: string;
  collapsible?: boolean;
  variant?: AnimationVariant;
  bgColor?: 'primary' | 'secondary' | 'success' | 'destructive' | 'transparent';
  children?: React.ReactNode;
}

const meta: Meta<AccordionStoryProps> = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The **Accordion** component is a collapsible content section built with **Radix UI** and animated using **Framer Motion**.
It supports multiple animation variants, accessibility out of the box, and flexible content rendering.

### Features
- 10+ animation variants (fade, slideDown, scaleIn, rotate, bounce, etc.)
- Single or multiple expansion modes
- Smooth transitions with Framer Motion
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Accordion type: single (only one open) or multiple (multiple open)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default open item value (only for single type)',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow closing all items (only for single type)',
    },
    bgColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'destructive', 'transparent'],
      description: 'Background color class applied to Accordion container',
    },
    variant: {
      control: 'select',
      options: [
        'fade',
        'slideDown',
        'slideUp',
        'scaleIn',
        'rotate',
        'bounce',
        'flip',
        'zoomIn',
        'elastic',
        'springy',
      ],
      description: 'Animation variant for AccordionContent',
    },
    children: {
      control: 'text',
      description: 'Custom content inside Accordion items',
    },
  },
};

export default meta;
type Story = StoryObj<AccordionStoryProps>;

const items = [
  {
    value: 'item-1',
    trigger: 'What is Radix UI?',
    content: 'Radix UI is a low-level UI component library for building accessible web apps.',
  },
  {
    value: 'item-2',
    trigger: 'What is Framer Motion?',
    content: 'Framer Motion is a production-ready animation library for React.',
  },
  {
    value: 'item-3',
    trigger: 'What is Lucide?',
    content: 'Lucide is an open-source icon library built for React and other frameworks.',
  },
];

const bgColorMap: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  destructive: 'bg-destructive',
  transparent: 'bg-transparent',
};

const Template = (args: AccordionStoryProps) => {
  const { type, defaultValue, collapsible, variant, bgColor, children } = args;
  const bgClass = bgColor ? bgColorMap[bgColor] : '';

  const content = children || (
    <>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent variant={variant}>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </>
  );

  if (type === 'single') {
    return (
      <Accordion
        type="single"
        defaultValue={defaultValue}
        collapsible={collapsible}
        className={bgClass}
      >
        {content}
      </Accordion>
    );
  }

  return (
    <Accordion type="multiple" className={bgClass}>
      {content}
    </Accordion>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    type: 'single',
    defaultValue: 'item-1',
    collapsible: true,
    variant: 'fade',
    bgColor: 'transparent',
  },
};

export const BounceAnimation: Story = {
  render: Template,
  args: {
    type: 'single',
    defaultValue: 'item-2',
    collapsible: true,
    variant: 'bounce',
    bgColor: 'success',
  },
};

export const MultipleOpenWithFlip: Story = {
  render: Template,
  args: {
    type: 'multiple',
    variant: 'flip',
    bgColor: 'secondary',
  },
};
