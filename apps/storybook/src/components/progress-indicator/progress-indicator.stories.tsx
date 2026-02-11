/**
 * Storybook stories for `ProgressIndicator`.
 *
 * Demonstrates:
 * - Linear progress bar
 * - Circular progress
 * - Percentage display
 * - Animated fill variants
 * - Indeterminate state
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
  ProgressIndicator,
  type ProgressIndicatorProps,
  type LinearLabelPosition,
  type CircularLabelPosition,
} from '.';

type Story = StoryObj<ProgressIndicatorProps>;

const meta: Meta<ProgressIndicatorProps> = {
  title: 'Components/Progress Indicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The **ProgressIndicator** component supports both **linear** and **circular** display modes.

### Features
- Determinate progress (\`value\` 0..100)
- Indeterminate mode (\`indeterminate\`)
- Percentage display (\`showPercentage\`)
- Multiple animation variants (\`animationVariant\`)
        `,
      },
    },
  },
  argTypes: {
    type: { control: 'radio', options: ['linear', 'circular'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    indeterminate: { control: 'boolean' },
    showPercentage: { control: 'boolean' },
    animationVariant: {
      control: 'select',
      options: ['none', 'smooth', 'snappy', 'spring', 'bounce'],
    },
    linearHeight: { control: { type: 'range', min: 4, max: 20, step: 1 } },
    size: { control: { type: 'range', min: 32, max: 160, step: 1 } },
    strokeWidth: { control: { type: 'range', min: 2, max: 16, step: 1 } },
    labelPosition: {
      control: 'select',
      options: [
        // Linear options
        'top',
        'bottom',
        'inside-left',
        'inside-right',
        'inside-center',
        // Circular options
        'inside-center',
        'outside-top',
        'outside-bottom',
        'outside-left',
        'outside-right',
      ],
      description: 'Position of the percentage label',
    },
    trackClassName: { control: 'text' },
    fillClassName: { control: 'text' },
    className: { control: 'text' },
    ariaLabel: { control: 'text' },
    formatPercentage: { control: false },
  },
};

export default meta;

export const Linear: Story = {
  args: {
    type: 'linear',
    value: 71,
    indeterminate: false,
    showPercentage: true,
    animationVariant: "spring",
    linearHeight: 20,
    trackClassName: 'bg-slate-200 dark:bg-slate-800',
    fillClassName: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    className: 'w-[360px]',
    size: 48,
    strokeWidth: 8
  },
};

export const LinearIndeterminate: Story = {
  args: {
    type: 'linear',
    indeterminate: true,
    showPercentage: false,
    animationVariant: 'smooth',
    linearHeight: 10,
    trackClassName: 'bg-slate-200 dark:bg-slate-800',
    fillClassName: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500',
    className: 'w-[360px]',
  },
};

export const LinearAnimationVariants: Story = {
  render: (args) => {
    const variants: NonNullable<ProgressIndicatorProps['animationVariant']>[] = [
      'none',
      'snappy',
      'smooth',
      'spring',
      'bounce',
    ];

    return (
      <div className="w-[420px] space-y-4">
        {variants.map((v) => (
          <div key={v} className="space-y-2">
            <div className="text-xs text-muted-foreground">{v}</div>
            <ProgressIndicator {...args} animationVariant={v} />
          </div>
        ))}
      </div>
    );
  },
  args: {
    type: 'linear',
    value: 68,
    indeterminate: false,
    showPercentage: false,
    linearHeight: 10,
    trackClassName: 'bg-slate-200 dark:bg-slate-800',
    fillClassName: 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
    className: 'w-full',
  },
};

export const Circular: Story = {
  args: {
    type: 'circular',
    value: 72,
    indeterminate: false,
    showPercentage: true,
    animationVariant: 'smooth',
    size: 80,
    strokeWidth: 8,
    trackClassName: 'text-slate-300 dark:text-slate-700',
    fillClassName: 'text-blue-500',
    labelPosition: "outside-left"
  },
};

export const CircularIndeterminate: Story = {
  args: {
    type: 'circular',
    indeterminate: true,
    showPercentage: false,
    animationVariant: "bounce",
    size: 160,
    strokeWidth: 16,
    trackClassName: 'text-slate-300 dark:text-slate-700',
    fillClassName: 'text-emerald-500',
    ariaLabel: "",
    linearHeight: 4
  },
};

export const PercentageCustomFormatter: Story = {
  render: (args) => {
    const formatPercentage = React.useCallback((pct: number) => `Done ${Math.round(pct)}%`, []);
    return <ProgressIndicator {...args} formatPercentage={formatPercentage} />;
  },
  args: {
    type: 'linear',
    value: 33,
    indeterminate: false,
    showPercentage: true,
    animationVariant: 'spring',
    linearHeight: 8,
    trackClassName: 'bg-slate-200 dark:bg-slate-800',
    fillClassName: 'bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500',
    className: 'w-[360px]',
  },
};

export const LinearLabelPositions: Story = {
  render: () => {
    const positions: LinearLabelPosition[] = ['top', 'bottom', 'inside-left', 'inside-right', 'inside-center'];
    return (
      <div className="w-[500px] space-y-8 p-6">
        {positions.map((position) => (
          <div key={position} className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">{position}</div>
            <ProgressIndicator
              type="linear"
              value={65}
              showPercentage={true}
              labelPosition={position}
              trackClassName="bg-slate-200 dark:bg-slate-800"
              fillClassName="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              className="w-full"
              linearHeight={12}
            />
          </div>
        ))}
      </div>
    );
  },
  args: {},
};

export const CircularLabelPositions: Story = {
  render: () => {
    const positions: CircularLabelPosition[] = [
      'inside-center',
      'outside-top',
      'outside-bottom',
      'outside-left',
      'outside-right',
    ];
    return (
      <div className="w-[500px] space-y-12 p-6">
        {positions.map((position) => (
          <div key={position} className="space-y-2 flex flex-col items-center">
            <div className="text-sm font-medium text-muted-foreground">{position}</div>
            <ProgressIndicator
              type="circular"
              value={72}
              showPercentage={true}
              labelPosition={position}
              size={80}
              strokeWidth={8}
              trackClassName="text-slate-300 dark:text-slate-700"
              fillClassName="text-blue-500"
            />
          </div>
        ))}
      </div>
    );
  },
  args: {},
};

export const AllVariants: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }, []);

    const colorSchemes = [
      { track: 'bg-slate-200 dark:bg-slate-800', fill: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' },
      { track: 'bg-slate-200 dark:bg-slate-800', fill: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500' },
      { track: 'bg-slate-200 dark:bg-slate-800', fill: 'bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500' },
      { track: 'bg-slate-200 dark:bg-slate-800', fill: 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500' },
    ];

    return (
      <div className="w-[500px] space-y-8 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Linear Progress</h3>
          <div className="space-y-3">
            <ProgressIndicator
              type="linear"
              value={progress}
              showPercentage={true}
              animationVariant="smooth"
              trackClassName={colorSchemes[0].track}
              fillClassName={colorSchemes[0].fill}
              className="w-full"
            />
            <ProgressIndicator
              type="linear"
              indeterminate={true}
              trackClassName={colorSchemes[1].track}
              fillClassName={colorSchemes[1].fill}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Circular Progress</h3>
          <div className="flex items-center gap-6">
            <ProgressIndicator
              type="circular"
              value={progress}
              showPercentage={true}
              animationVariant="spring"
              size={80}
              trackClassName="text-slate-300 dark:text-slate-700"
              fillClassName="text-blue-500"
            />
            <ProgressIndicator
              type="circular"
              indeterminate={true}
              size={80}
              trackClassName="text-slate-300 dark:text-slate-700"
              fillClassName="text-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Animation Variants</h3>
          <div className="space-y-3">
            {(['smooth', 'snappy', 'spring', 'bounce'] as const).map((variant, idx) => (
              <div key={variant} className="space-y-1">
                <div className="text-xs text-muted-foreground">{variant}</div>
                <ProgressIndicator
                  type="linear"
                  value={75}
                  animationVariant={variant}
                  trackClassName={colorSchemes[idx % colorSchemes.length].track}
                  fillClassName={colorSchemes[idx % colorSchemes.length].fill}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  args: {
    linearHeight: 18,
    size: 95
  },
};

