'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '../../../utils/cn';

// Define variant types
export type SliderVariant =
  | 'default'
  | 'minimal'
  | 'rounded'
  | 'gradient'
  | 'glass'
  | 'outline'
  | 'shadow'
  | 'neon'
  | 'material'
  | 'neumorphic'
  | 'retro'
  | 'cyberpunk'
  | 'brutalist'
  | 'skeuomorphic';

// Define animation types
export type SliderAnimationType =
  | 'none'
  | 'slide'
  | 'fade'
  | 'zoom'
  | 'spring'
  | 'elastic'
  | 'parallax'
  | 'flip'
  | 'morph'
  | 'hover'
  | 'pulse'
  | 'breathe'
  | 'wave'
  | 'rainbow'
  | 'bounce';

// Define props for our enhanced slider
export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  variant?: SliderVariant;
  animationType?: SliderAnimationType;
  animationDuration?: number;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
  valueClassName?: string;
}

// Variants styling
const variantStyles: Record<
  SliderVariant,
  {
    root: string;
    track: string;
    range: string;
    thumb: string;
    value?: string;
  }
> = {
  default: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
    range: 'absolute h-full bg-primary',
    thumb:
      'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  minimal: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-1 w-full grow overflow-hidden rounded-full bg-secondary/50',
    range: 'absolute h-full bg-primary/70',
    thumb:
      'block h-3 w-3 rounded-full bg-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  rounded: {
    root: 'relative flex w-full touch-none select-none items-center py-1',
    track: 'relative h-3 w-full grow overflow-hidden rounded-full bg-secondary/40',
    range: 'absolute h-full bg-primary rounded-full',
    thumb:
      'block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  gradient: {
    root: 'relative flex w-full touch-none select-none items-center',
    track:
      'relative h-2 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-secondary/50 to-secondary',
    range: 'absolute h-full bg-gradient-to-r from-purple-500 to-blue-500',
    thumb:
      'block h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  glass: {
    root: 'relative flex w-full touch-none select-none items-center',
    track:
      'relative h-2 w-full grow overflow-hidden rounded-full bg-white/10 backdrop-blur-sm border border-white/20',
    range: 'absolute h-full bg-white/30 backdrop-blur-md',
    thumb:
      'block h-5 w-5 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-white/40 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  outline: {
    root: 'relative flex w-full touch-none select-none items-center',
    track:
      'relative h-2 w-full grow overflow-hidden rounded-full bg-transparent border-2 border-secondary',
    range: 'absolute h-full bg-transparent border-2 border-primary',
    thumb:
      'block h-6 w-6 rounded-full bg-background border-2 border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  shadow: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/30 shadow-inner',
    range: 'absolute h-full bg-primary shadow-lg',
    thumb:
      'block h-6 w-6 rounded-full bg-background shadow-lg border border-primary/20 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  neon: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-3 w-full grow overflow-hidden rounded-full bg-black/80',
    range:
      'absolute h-full bg-cyan-500 shadow-[0_0_10px_3px_rgba(6,182,212,0.7),0_0_20px_5px_rgba(6,182,212,0.5)]',
    thumb:
      'block h-7 w-7 rounded-full bg-cyan-500 shadow-[0_0_15px_3px_rgba(6,182,212,0.8),0_0_30px_5px_rgba(6,182,212,0.6)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    value: 'text-cyan-500 text-sm font-bold',
  },
  material: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-1 w-full grow overflow-hidden rounded-full bg-secondary/40',
    range: 'absolute h-full bg-primary',
    thumb:
      'block h-6 w-6 rounded-full bg-primary shadow-md ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  neumorphic: {
    root: 'relative flex w-full touch-none select-none items-center',
    track:
      'relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.15),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]',
    range: 'absolute h-full bg-blue-400/80',
    thumb:
      'block h-6 w-6 rounded-full bg-gray-100 shadow-[2px_2px_5px_rgba(0,0,0,0.15),-2px_-2px_5px_rgba(255,255,255,0.9)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  retro: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-3 w-full grow overflow-hidden bg-amber-100 border-2 border-amber-800',
    range: 'absolute h-full bg-amber-600',
    thumb:
      'block h-7 w-7 rounded-sm bg-amber-200 border-2 border-amber-800 shadow-[2px_2px_0px_rgba(146,64,14,1)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    value: 'text-amber-800 font-mono text-sm',
  },
  cyberpunk: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-3 w-full grow overflow-hidden bg-black border-2 border-yellow-400',
    range:
      'absolute h-full bg-fuchsia-600 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600',
    thumb:
      'block h-7 w-7 bg-yellow-400 clip-path-polygon-[50%_0%,_100%_50%,_50%_100%,_0%_50%] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    value: 'text-yellow-400 font-mono text-sm',
  },
  brutalist: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-4 w-full grow overflow-hidden bg-gray-300 border-2 border-black',
    range: 'absolute h-full bg-black',
    thumb:
      'block h-8 w-8 rounded-none bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    value: 'text-black font-mono text-sm font-bold',
  },
  skeuomorphic: {
    root: 'relative flex w-full touch-none select-none items-center',
    track:
      'relative h-4 w-full grow overflow-hidden rounded-full bg-gradient-to-b from-gray-300 to-gray-400 border border-gray-500 shadow-inner',
    range: 'absolute h-full bg-gradient-to-b from-blue-400 to-blue-600 border-r border-gray-500',
    thumb:
      'block h-8 w-8 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 shadow-[0_2px_5px_rgba(0,0,0,0.3)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    value: 'text-gray-800 text-sm font-medium',
  },
};

const getAnimationProps = (type: SliderAnimationType, duration = 0.3): MotionProps => {
  switch (type) {
    case 'slide':
      return {
        animate: { y: [0, -3, 3, 0] },
        transition: { repeat: Infinity, duration, ease: 'easeInOut' },
      };
    case 'fade':
      return {
        animate: { opacity: [1, 0, 1] },
        transition: { repeat: Infinity, duration },
      };
    case 'zoom':
      return {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { repeat: Infinity, duration },
      };
    case 'spring':
      return {
        initial: { x: -10 },
        animate: { x: 0 },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
          repeat: Infinity,
          duration,
        },
      };
    case 'elastic':
      return {
        initial: { x: -20 },
        animate: { x: 0 },
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 10,
          repeat: Infinity,
          duration,
        },
      };
    case 'parallax':
      return {
        initial: { x: -10, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { duration, delay: duration * 0.2, repeat: Infinity },
      };
    case 'flip':
      return {
        initial: { rotateY: 90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        transition: { duration, repeat: Infinity },
      };
    case 'morph':
      return {
        initial: { borderRadius: '30%', opacity: 0 },
        animate: { borderRadius: '50%', opacity: 1 },
        transition: { duration, repeat: Infinity },
      };
    case 'hover':
      return {
        whileHover: { scale: 1.3 },
        whileTap: { scale: 0.85 },
      };
    case 'pulse':
      return {
        animate: {
          scale: [1, 1.2, 1],
          opacity: [1, 0.9, 1],
        },
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: 'easeInOut',
        },
      };
    case 'breathe':
      return {
        animate: {
          boxShadow: [
            '0 0 0 rgba(var(--primary-rgb), 0.4)',
            '0 0 10px 5px rgba(var(--primary-rgb), 0.7)',
            '0 0 0 rgba(var(--primary-rgb), 0.4)',
          ],
        },
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: 'easeInOut',
          repeatType: 'mirror',
        },
      };
    case 'wave':
      return {
        animate: {
          x: [0, 4, -4, 4, 0],
        },
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: 'easeInOut',
        },
      };
    case 'rainbow':
      return {
        animate: {
          backgroundColor: [
            'rgba(255, 0, 0, 1)',
            'rgba(255, 165, 0, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(0, 128, 0, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(75, 0, 130, 1)',
            'rgba(238, 130, 238, 1)',
            'rgba(255, 0, 0, 1)',
          ],
        },
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: 'linear',
        },
      };
    case 'bounce':
      return {
        animate: {
          y: [0, -3, 3, 0],
        },
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: 'easeInOut',
        },
      };
    default:
      return {};
  }
};

const MotionThumb = motion.create(SliderPrimitive.Thumb);
const MotionRange = motion.create(SliderPrimitive.Range);
const MotionTrack = motion.create(SliderPrimitive.Track);

const Slider = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      variant = 'default',
      animationType = 'none',
      animationDuration = 0.3,
      showValue = false,
      valuePrefix = '',
      valueSuffix = '',
      trackClassName,
      rangeClassName,
      thumbClassName,
      valueClassName,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState<number[]>(props.defaultValue || props.value || [0]);
    const styles = variantStyles[variant];
    const animationProps = getAnimationProps(animationType, animationDuration);

    React.useEffect(() => {
      if (props.value) {
        setValue(props.value);
      }
    }, [props.value]);

    const handleValueChange = (newValue: number[]) => {
      setValue(newValue);
      props.onValueChange?.(newValue);
    };

    return (
      <div className="w-full space-y-2">
        <SliderPrimitive.Root
          ref={ref}
          className={cn(styles.root, className)}
          onValueChange={handleValueChange}
          {...props}
        >
          <MotionTrack
            className={cn(styles.track, trackClassName)}
            animate={
              animationType === 'breathe'
                ? {
                    boxShadow: [
                      'inset 0 0 0 rgba(0,0,0,0.2)',
                      'inset 0 0 10px rgba(0,0,0,0.4)',
                      'inset 0 0 0 rgba(0,0,0,0.2)',
                    ],
                  }
                : undefined
            }
            transition={
              animationType === 'breathe'
                ? {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: 'easeInOut',
                    repeatType: 'mirror',
                  }
                : undefined
            }
          >
            <MotionRange
              className={cn(styles.range, rangeClassName)}
              {...(animationType !== 'none' ? animationProps : {})}
            />
          </MotionTrack>

          {value.map((val, index) => (
            <MotionThumb
              key={index}
              className={cn(styles.thumb, thumbClassName)}
              {...(animationType !== 'none' ? animationProps : {})}
            />
          ))}
        </SliderPrimitive.Root>

        {showValue && (
          <motion.div className={cn('text-center text-sm', styles.value, valueClassName)}>
            {valuePrefix}
            {value.join(', ')}
            {valueSuffix}
          </motion.div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
