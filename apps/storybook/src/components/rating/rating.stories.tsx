import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './index';
import { Card, CardContent, CardFooter, CardHeader } from '../card';
import { Star, Heart, Zap } from 'lucide-react';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Rating** component provides a visual representation of a rating value using configurable indicators (default: stars).  
It supports both read-only display and optional interactive rating selection modes.

### Features
- Visual representation using stars (or custom icons)
- Configurable maximum scale (default: 5)
- Optional rating value support
- Read-only and interactive modes
- Half-star rating support
- Accessibility features (ARIA labels, keyboard navigation)
- Responsive design with multiple sizes
- Customizable colors and icons
- User-friendly icon type selection (star, heart, emoji, etc.)
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description: 'Current rating value (0 to max)',
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum rating scale',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the rating is interactive',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the rating is disabled (only applies when interactive)',
    },
    allowHalf: {
      control: 'boolean',
      description: 'Whether half-star ratings are allowed',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the numeric rating value',
    },
    colorScheme: {
      control: 'select',
      options: ['yellow', 'red', 'blue', 'green', 'purple', 'pink', 'orange'],
      description: 'Color scheme for the rating icons',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the rating icons',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the rating is read-only',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    value: 3,
    max: 5,
    interactive: false,
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);
    return (
      <Rating
        value={value}
        max={5}
        interactive
        onChange={(newValue) => setValue(newValue)}
      />
    );
  },
};

export const HalfStars: Story = {
  render: () => {
    const [value, setValue] = React.useState(2.5);
    return (
      <Rating
        value={value}
        max={5}
        interactive
        allowHalf
        onChange={(newValue) => setValue(newValue)}
      />
    );
  },
};

export const WithValue: Story = {
  args: {
    value: 4,
    max: 5,
    showValue: true,
    interactive: true,
  },
};

export const Sizes: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    return (
      <div className="flex flex-col gap-6 items-center">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-4">
            <span className="text-sm font-medium w-12">{size.toUpperCase()}:</span>
            <Rating value={3} max={5} size={size} />
          </div>
        ))}
      </div>
    );
  },
};

export const CustomScale: Story = {
  render: () => {
    const [value3, setValue3] = React.useState(2);
    const [value5, setValue5] = React.useState(3);
    const [value7, setValue7] = React.useState(4);
    const [value10, setValue10] = React.useState(6);

    return (
      <div className="space-y-6">
        {/* 3 Star Scale */}
        <div className="space-y-2">
          <Rating
            value={value3}
            max={3}
            interactive
            onChange={setValue3}
          />
          <p className="text-sm text-muted-foreground">
            3-Star Scale: {value3} / 3
          </p>
        </div>

        {/* 5 Star Scale */}
        <div className="space-y-2">
          <Rating
            value={value5}
            max={5}
            interactive
            onChange={setValue5}
          />
          <p className="text-sm text-muted-foreground">
            5-Star Scale: {value5} / 5
          </p>
        </div>

        {/* 7 Star Scale */}
        <div className="space-y-2">
          <Rating
            value={value7}
            max={7}
            interactive
            onChange={setValue7}
          />
          <p className="text-sm text-muted-foreground">
            7-Star Scale: {value7} / 7
          </p>
        </div>

        {/* 10 Star Scale */}
        <div className="space-y-2">
          <Rating
            value={value10}
            max={10}
            interactive
            onChange={setValue10}
          />
          <p className="text-sm text-muted-foreground">
            10-Star Scale: {value10} / 10
          </p>
        </div>
      </div>
    );
  },
};

export const AllColors: Story = {
  render: () => {
    const colorSchemes = ['yellow', 'red', 'blue', 'green', 'purple', 'pink', 'orange'] as const;
    return (
      <div className="grid grid-cols-2 gap-6">
        {colorSchemes.map((colorScheme) => (
          <div key={colorScheme} className="flex items-center gap-4">
            <span className="text-sm font-medium w-20 capitalize">{colorScheme}:</span>
            <Rating value={3} max={5} colorScheme={colorScheme} />
          </div>
        ))}
      </div>
    );
  },
};

export const CompleteExample: Story = {
  render: () => {
    const [rating, setRating] = React.useState(0);
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <h3 className="text-lg font-semibold">Rate Your Experience</h3>
        </CardHeader>
        <CardContent>
          <Rating
            value={rating}
            max={5}
            interactive
            onChange={(newValue) => setRating(newValue)}
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {rating === 0 ? 'Click stars to rate' : `You rated ${rating} out of 5`}
          </p>
        </CardFooter>
      </Card>
    );
  },
};

// Animation Types Showcase
export const AnimationTypes: Story = {
  render: () => {
    const [values, setValues] = React.useState<Record<string, number>>({
      bounce: 1,
      pulse: 2,
      fade: 3,
      slide: 1,
      rotate: 2,
      scale: 3,
      elastic: 1,
      spring: 2,
      glow: 3,
      shimmer: 4,
    });

    const animationTypes: Array<{ type: string; label: string }> = [
      { type: 'bounce', label: 'Bounce' },
      { type: 'pulse', label: 'Pulse' },
      { type: 'fade', label: 'Fade' },
      { type: 'slide', label: 'Slide' },
      { type: 'rotate', label: 'Rotate' },
      { type: 'scale', label: 'Scale' },
      { type: 'elastic', label: 'Elastic' },
      { type: 'spring', label: 'Spring' },
      { type: 'glow', label: 'Glow' },
      { type: 'shimmer', label: 'Shimmer' },
    ];

    return (
      <div className="grid grid-cols-3 gap-5">
        {animationTypes.map(({ type, label }) => (
          <div key={type} className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">{label} Animation</p>
            <Rating
              value={values[type]}
              allowHalf={false}
              interactive
              size="md"
              emojis={['😡', '😠', '😐', '😊', '😍']}
              animationType={type as any}
              onChange={(val) => setValues({ ...values, [type]: val })}
            />
          </div>
        ))}
      </div>
    );
  },
};

// Icon Hover and Click Animations Showcase
export const IconAnimations: Story = {
  render: () => {
    const [values, setValues] = React.useState<Record<string, number>>({
      star: 2,
      heart: 3,
      zap: 1,
    });

    const iconExamples = [
      { name: 'Star', icon: Star, value: 'star', colorScheme: 'yellow' as const },
      { name: 'Heart', icon: Heart, value: 'heart', colorScheme: 'red' as const },
      { name: 'Zap', icon: Zap, value: 'zap', colorScheme: 'blue' as const },
    ];

    return (
      <div className="space-y-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Icon Hover & Click Animations</h3>
          <p className="text-sm text-muted-foreground">
            Hover over icons to see scale-up effect. Click icons to see scale animation on all icons up to the clicked one.
            Notice how filled icons have different colors than empty ones.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {iconExamples.map(({ name, icon: IconComponent, value, colorScheme }) => (
            <div key={value} className="space-y-4 p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <IconComponent className="w-5 h-5 text-muted-foreground" />
                <h4 className="text-base font-semibold">{name} Icon</h4>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-muted-foreground">
                  {colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1)} Color
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Rating
                  value={values[value]}
                  max={5}
                  interactive
                  size="lg"
                  iconType={IconComponent}
                  colorScheme={colorScheme}
                  onChange={(val) => setValues({ ...values, [value]: val })}
                />
                <div className="text-sm text-muted-foreground">
                  Rating: {values[value]} / 5
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Filled icons: {colorScheme} color • Empty icons: gray color</p>
                <p>• Hover: Icons scale to 1.15x</p>
                <p>• Click: All icons up to clicked one scale [1 → 1.2 → 1]</p>
                <p>• Tap: Icon scales to 0.95x for immediate feedback</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// Emoji Selection with Scale Effect Showcase
export const EmojiSelectionScale: Story = {
  render: () => {
    const [values, setValues] = React.useState<Record<string, number>>({
      emotions: 0,
      satisfaction: 0,
      quality: 0,
    });

    const emojiExamples = [
      { 
        name: 'Emotion Rating', 
        emojis: ['😡', '😠', '😐', '😊', '😍'],
        value: 'emotions',
        description: 'Rate your current emotion'
      },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {emojiExamples.map(({ name, emojis, value, description }) => (
            <Card key={value} className="p-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-semibold">{name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-muted-foreground font-medium">
                    Selected: {values[value]} / {emojis.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Rating
                    value={values[value]}
                    max={emojis.length}
                    interactive
                    size="lg"
                    emojis={emojis}
                    animationType="spring"
                    onChange={(val) => setValues({ ...values, [value]: val })}
                  />
                  <div className="text-sm text-muted-foreground min-w-[120px]">
                    <div className="font-medium">Current Rating:</div>
                    <div className="text-lg font-bold text-gray-900">
                      {values[value]} / {emojis.length}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground space-y-1 w-full">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded bg-gray-200"></span>
                    <span>Unselected emoji (normal size)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded bg-blue-500 scale-[1.15]"></span>
                    <span>Selected emoji (scaled 1.15x)</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold mb-3">How it works:</h4>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Click on any emoji to select it</li>
            <li>The clicked emoji briefly scales to 1.2x during the click animation</li>
            <li>After selection, the emoji remains at 1.15x scale (using Tailwind's <code className="bg-gray-200 px-1 rounded">scale-[1.15]</code> class)</li>
            <li>All selected emojis (up to the clicked one) maintain the 1.15x scale</li>
            <li>Unselected emojis remain at normal size (1x)</li>
            <li>The scale transition is smooth with a 300ms duration using Tailwind's transition utilities</li>
          </ol>
        </div>
      </div>
    );
  },
};
