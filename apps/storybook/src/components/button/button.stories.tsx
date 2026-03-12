import { Button } from '.';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'subtle', 'elevated', 'glass', 'neon', 'pill', 'none'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'],
    },
  },
};

export const Default = {
  args: {
    children: 'Click Me',
    variant: 'default',
    size: 'md',
  },
};

export const Success = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Outline = {
    args: {
      children: 'Cancel',
      variant: 'outline',
    },
  };

export const pill = {
  args: {
    children: 'Cancel',
    size: 'pill',
  },
};

export const glass = {
  args: {
    children: 'Cancel',
    variant: 'glass',
  },
};