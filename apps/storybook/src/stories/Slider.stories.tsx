import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from '../../../../packages/registry/components/slider/index';

import type { SliderVariant, SliderAnimationType } from '../../../../packages/registry/components/slider/index';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider as any,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'minimal', 'rounded', 'gradient', 'glass', 'outline', 'shadow', 'neon', 'material', 'neumorphic', 'retro', 'cyberpunk', 'brutalist', 'skeuomorphic'] },
    animationType: { control: 'select', options: ['none', 'slide', 'fade', 'zoom', 'spring', 'elastic', 'parallax', 'flip', 'morph', 'hover', 'pulse', 'breathe', 'wave', 'rainbow', 'bounce'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  decorators: [(Story) => <div className="w-[400px] p-8 bg-background rounded-lg"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: [50], min: 0, max: 100 },
};

export const WithFeatures: Story = {
  args: { defaultValue: [50], min: 0, max: 100, showValue: true, showTooltip: true, valuePrefix: 'Temperature: ', valueSuffix: ' °C' },
};

export const Range: Story = {
  args: { defaultValue: [25, 75], min: 0, max: 100, showValue: true }
};

// All Variants
export const AllVariants: Story = {
  render: () => {
    const variants: SliderVariant[] = ['default', 'minimal', 'rounded', 'gradient', 'glass', 'outline', 'shadow', 'neon', 'material', 'neumorphic', 'retro', 'cyberpunk', 'brutalist', 'skeuomorphic'];
    return (
      <div className='flex items-center justify-center'>
        <div className="space-y-4 w-[450px]">
        {variants.map((v) => (
          <div key={v} className="space-y-2">
            <label className="text-sm font-medium capitalize">{v}</label>
            <Slider defaultValue={[50]} min={0} max={100} variant={v} showValue />
          </div>
        ))}
      </div>
      </div>
    );
  },
};

// All Animations
export const AllAnimations: Story = {
  render: () => {
    const animations: SliderAnimationType[] = ['none', 'slide', 'fade', 'zoom', 'spring', 'elastic', 'parallax', 'flip', 'morph', 'hover', 'pulse', 'breathe', 'wave', 'rainbow', 'bounce'];
    return (
      <div className='flex items-center justify-center'>
        <div className="space-y-4 w-[450px]">
        {animations.map((a) => (
          <div key={a} className="space-y-2">
            <label className="text-sm font-medium capitalize">{a}</label>
            <Slider defaultValue={[50]} min={0} max={100} animationType={a} showValue />
          </div>
        ))}
      </div>
      </div>
    );
  },
};
