import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '.';
import React from 'react';

const meta = {
  title: 'Layouts/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Block = ({
  label,
  accent = false,
}: {
  label: string;
  accent?: boolean;
}) => (
  <div
    style={{
      padding: '10px 16px',
      borderRadius: 6,
      background: accent ? '#6366f1' : '#e0e7ff',
      color: accent ? '#fff' : '#3730a3',
      fontFamily: 'ui-monospace, monospace',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

const SpacerDebug = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', display: 'inline-flex' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'repeating-linear-gradient(45deg,rgba(99,102,241,.12) 0px,rgba(99,102,241,.12) 4px,transparent 4px,transparent 8px)',
        borderRadius: 2,
        pointerEvents: 'none',
      }}
    />
    {children}
  </div>
);

export const Playground: Story = {
  args: {
    size: 'md',
    direction: 'vertical',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: args.direction === 'horizontal' ? 'row' : 'column',
        alignItems: 'flex-start',
      }}
    >
      <Block label="Element A" />
      <SpacerDebug>
        <Spacer {...args} />
      </SpacerDebug>
      <Block label="Element B" accent />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    return (
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
        {sizes.map((size) => (
          <div
            key={size}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Block label={`size="${size}"`} />
            <SpacerDebug>
              <Spacer size={size} direction="vertical" />
            </SpacerDebug>
            <Block label="↓" accent />
          </div>
        ))}
      </div>
    );
  },
};

export const AllSizesHorizontal: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sizes.map((size) => (
          <div
            key={size}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Block label="A" />
            <SpacerDebug>
              <Spacer size={size} direction="horizontal" />
            </SpacerDebug>
            <Block label={`← size="${size}" →`} accent />
            <SpacerDebug>
              <Spacer size={size} direction="horizontal" />
            </SpacerDebug>
            <Block label="B" />
          </div>
        ))}
      </div>
    );
  },
};

export const DirectionComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      {/* Vertical */}
      <div>
        <p
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            color: '#6b7280',
            marginBottom: 8,
          }}
        >
          direction="vertical"
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Block label="Top" />
          <SpacerDebug>
            <Spacer size="lg" direction="vertical" />
          </SpacerDebug>
          <Block label="Bottom" accent />
        </div>
      </div>

      {/* Horizontal */}
      <div>
        <p
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            color: '#6b7280',
            marginBottom: 8,
          }}
        >
          direction="horizontal"
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Block label="Left" />
          <SpacerDebug>
            <Spacer size="lg" direction="horizontal" />
          </SpacerDebug>
          <Block label="Right" accent />
        </div>
      </div>

      <div>
        <p
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            color: '#6b7280',
            marginBottom: 8,
          }}
        >
          direction="both"
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            gridTemplateRows: 'auto auto auto',
            placeItems: 'center',
          }}
        >
          <Block label="TL" />
          <span />
          <Block label="TR" accent />
          <span />
          <SpacerDebug>
            <Spacer size="xl" direction="both" />
          </SpacerDebug>
          <span />
          <Block label="BL" accent />
          <span />
          <Block label="BR" />
        </div>
      </div>
    </div>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[
        { size: '20px', label: 'size="20px"' },
        { size: '2rem', label: 'size="2rem"' },
        { size: '48', label: 'size="48" (raw number → 48px)' },
      ].map(({ size, label }) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 11,
              color: '#6b7280',
              margin: '0 0 4px',
            }}
          >
            {label}
          </p>
          <Block label="Above" />
          <SpacerDebug>
            <Spacer size={size as any} direction="vertical" />
          </SpacerDebug>
          <Block label="Below" accent />
        </div>
      ))}
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>
      <p style={{ color: '#374151', marginBottom: 12 }}>
        Spacer renders a{' '}
        <code
          style={{ background: '#f3f4f6', padding: '1px 4px', borderRadius: 3 }}
        >
          &lt;div aria-hidden="true"&gt;
        </code>{' '}
        so screen-readers skip it entirely.
      </p>
      <div
        role="list"
        style={{ display: 'flex', flexDirection: 'column', width: 200 }}
      >
        {['First item', 'Second item', 'Third item'].map((text, i) => (
          <React.Fragment key={text}>
            {i > 0 && <Spacer size="sm" />}
            <div
              role="listitem"
              style={{
                background: i % 2 === 0 ? '#ede9fe' : '#ddd6fe',
                padding: '8px 12px',
                borderRadius: 4,
                color: '#4c1d95',
                fontWeight: 600,
              }}
            >
              {text}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
