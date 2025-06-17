'use client';

import { useState } from 'react';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const animations = {
  default: {
    checked: { x: 16 },
    unchecked: { x: 0 },
  },
  bounce: {
    checked: {
      x: 16,
      transition: { type: 'spring', stiffness: 500, damping: 15 },
    },
    unchecked: {
      x: 0,
      transition: { type: 'spring', stiffness: 500, damping: 15 },
    },
  },
  scale: {
    checked: {
      x: 16,
      scale: 1.2,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    unchecked: {
      x: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  },
  rotate: {
    checked: {
      x: 16,
      rotate: 180,
      transition: { type: 'spring', stiffness: 300, damping: 10 },
    },
    unchecked: {
      x: 0,
      rotate: 0,
      transition: { type: 'spring', stiffness: 300, damping: 10 },
    },
  },
  fade: {
    checked: {
      x: 16,
      opacity: [0, 1],
      transition: { duration: 0.2 },
    },
    unchecked: {
      x: 0,
      opacity: [0, 1],
      transition: { duration: 0.2 },
    },
  },
  elastic: {
    checked: {
      x: 16,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 8,
        restDelta: 0.001,
      },
    },
    unchecked: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 8,
        restDelta: 0.001,
      },
    },
  },
  pulse: {
    checked: {
      x: 16,
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 },
    },
    unchecked: {
      x: 0,
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 },
    },
  },
  shake: {
    checked: {
      x: [0, 4, 8, 12, 16],
      y: [0, -2, 0, 2, 0],
      transition: { duration: 0.4 },
    },
    unchecked: {
      x: [16, 12, 8, 4, 0],
      y: [0, 2, 0, -2, 0],
      transition: { duration: 0.4 },
    },
  },
  flip: {
    checked: {
      x: 16,
      rotateY: 180,
      transition: { duration: 0.4 },
    },
    unchecked: {
      x: 0,
      rotateY: 0,
      transition: { duration: 0.4 },
    },
  },
  jelly: {
    checked: {
      x: 16,
      scale: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
      transition: { duration: 0.6 },
    },
    unchecked: {
      x: 0,
      scale: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
      transition: { duration: 0.6 },
    },
  },
  glow: {
    checked: {
      x: 16,
      boxShadow: [
        '0 0 0 0 rgba(255, 255, 255, 0)',
        '0 0 0 8px rgba(255, 255, 255, 0.5)',
        '0 0 0 0 rgba(255, 255, 255, 0)',
      ],
      transition: { duration: 0.5 },
    },
    unchecked: {
      x: 0,
      boxShadow: [
        '0 0 0 0 rgba(255, 255, 255, 0)',
        '0 0 0 8px rgba(255, 255, 255, 0.5)',
        '0 0 0 0 rgba(255, 255, 255, 0)',
      ],
      transition: { duration: 0.5 },
    },
  },
};

const variants = {
  default: {
    root: 'h-5 w-9',
    thumb: 'h-4 w-4',
    thumbOffset: 16,
  },
  large: {
    root: 'h-7 w-12',
    thumb: 'h-6 w-6',
    thumbOffset: 20,
  },
  small: {
    root: 'h-4 w-7',
    thumb: 'h-3 w-3',
    thumbOffset: 12,
  },
  pill: {
    root: 'h-5 w-9 rounded-full',
    thumb: 'h-4 w-4 rounded-full',
    thumbOffset: 16,
  },
  square: {
    root: 'h-5 w-9 rounded-md',
    thumb: 'h-4 w-4 rounded-sm',
    thumbOffset: 16,
  },
  slim: {
    root: 'h-4 w-10 rounded-full',
    thumb: 'h-3 w-3 rounded-full',
    thumbOffset: 24,
  },
  ios: {
    root: 'h-6 w-11 rounded-full bg-gray-300 data-[state=checked]:bg-green-500',
    thumb: 'h-5 w-5 rounded-full shadow-md',
    thumbOffset: 20,
  },
  material: {
    root: 'h-5 w-10 rounded-full bg-gray-400 data-[state=checked]:bg-blue-500',
    thumb: 'h-4 w-4 rounded-full shadow-md',
    thumbOffset: 20,
  },
};

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  variant?: keyof typeof variants;
  animation?: keyof typeof animations;
  thumbClassName?: string;
}

const Switch = React.forwardRef<React.ComponentRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, variant = 'default', animation = 'default', thumbClassName, ...props }, ref) => {
    const selectedVariant = variants[variant] || variants.default;

    const thumbOffset = selectedVariant.thumbOffset || 16;
    const dynamicAnimation = {
      ...animations[animation],
      checked: {
        ...animations[animation].checked,
        x: thumbOffset,
      },
    };

    const [isChecked, setIsChecked] = useState(props.checked || false);

    React.useEffect(() => {
      if (props.checked !== undefined) {
        setIsChecked(props.checked);
      }
    }, [props.checked]);

    const handleCheckedChange = (checked: boolean) => {
      setIsChecked(checked);
      props.onCheckedChange?.(checked);
    };

    return (
      <SwitchPrimitives.Root
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
          selectedVariant.root,
          className
        )}
        {...props}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        ref={ref}
      >
        <SwitchPrimitives.Thumb asChild>
          <motion.span
            className={cn(
              'pointer-events-none block rounded-full bg-background shadow-lg ring-0',
              selectedVariant.thumb,
              thumbClassName
            )}
            initial={false}
            animate={isChecked ? 'checked' : 'unchecked'}
            variants={dynamicAnimation}
          />
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    );
  }
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
