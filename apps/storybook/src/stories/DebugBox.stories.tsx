import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

export interface DebugBoxProps {
  children: React.ReactNode;
  showGrid?: boolean;
  showSpacing?: boolean;
  showBreakpoints?: boolean;
  showDimensions?: boolean;
}

import { DebugBox } from '../../../../packages/registry/components/DebugBox/index';
import { Box } from '../../../../packages/registry/components/layouts/box/index';

const meta: Meta<DebugBoxProps> = {
  title: 'Components/DebugBox',
  component: DebugBox as any,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<DebugBoxProps>;

export const Default: Story = {
  args: {
    children: (
      <Box
        style={{
          height: 120,
          padding: 16,
          border: '1px solid #ddd',
          borderRadius: 8,
        }}
      >
        DebugBox Overlay Example
      </Box>
    ),
    showGrid: true,
    showSpacing: true,
    showBreakpoints: true,
    showDimensions: true,
  },
};

export const OnlyGrid: Story = {
  args: {
    children: <Box style={{ height: 100, border: '1px solid #ccc' }}>Grid Only Example</Box>,
    showGrid: true,
    showSpacing: false,
    showBreakpoints: false,
    showDimensions: false,
  },
};
