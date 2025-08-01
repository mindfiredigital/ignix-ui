'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '../../../utils/cn';

// Define variant types (keeping all existing)
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

// Define animation types (keeping all existing)
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

// Enhanced props interface
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
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  glowEffect?: boolean;
}

// Enhanced variants styling with premium effects
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
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-2 w-full grow overflow-hidden rounded-full',
      'bg-gradient-to-r from-muted/80 to-muted backdrop-blur-sm',
      'border border-border/40 shadow-inner shadow-black/5',
      'dark:shadow-white/5 transition-all duration-300',
      'group-hover:shadow-md group-hover:border-border/60'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-r from-primary to-primary/90',
      'shadow-lg shadow-primary/25 dark:shadow-primary/20',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-white/20 before:to-transparent',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-5 w-5 rounded-full border-2 border-primary bg-background',
      'shadow-lg shadow-primary/20 dark:shadow-primary/30',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-xl hover:shadow-primary/30',
      'active:scale-95',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-white/30 before:to-transparent',
      'before:pointer-events-none'
    ),
  },

  minimal: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-1 w-full grow overflow-hidden rounded-full',
      'bg-muted/60 backdrop-blur-sm transition-all duration-300',
      'group-hover:bg-muted/80'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-r from-primary/80 to-primary/70',
      'shadow-sm shadow-primary/20 transition-all duration-300'
    ),
    thumb: cn(
      'block h-3 w-3 rounded-full bg-gradient-to-br from-primary to-primary/80',
      'shadow-md shadow-primary/25 transition-all duration-300',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-125 hover:shadow-lg active:scale-90'
    ),
  },

  rounded: {
    root: 'relative flex w-full touch-none select-none items-center py-1 group',
    track: cn(
      'relative h-3 w-full grow overflow-hidden rounded-full',
      'bg-gradient-to-r from-muted/50 to-muted/70 backdrop-blur-sm',
      'border border-border/30 shadow-inner shadow-black/5',
      'transition-all duration-300 group-hover:shadow-md'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-r from-primary via-primary/95 to-primary/90',
      'shadow-lg shadow-primary/30 transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:via-white/10 before:to-white/20',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-6 w-6 rounded-full border-2 border-primary/80 bg-background',
      'shadow-xl shadow-primary/25 backdrop-blur-sm',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-2xl hover:shadow-primary/35',
      'active:scale-95 hover:border-primary',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent',
      'before:pointer-events-none'
    ),
  },

  gradient: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-2 w-full grow overflow-hidden rounded-full',
      'bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40',
      'backdrop-blur-sm border border-border/30',
      'shadow-inner shadow-black/10 dark:shadow-white/5',
      'transition-all duration-300'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500',
      'shadow-lg shadow-purple-500/30 transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-black/10 before:to-white/30',
      'before:pointer-events-none',
      'after:absolute after:inset-0 after:rounded-full',
      'after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
      'after:pointer-events-none'
    ),
    thumb: cn(
      'block h-5 w-5 rounded-full',
      'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500',
      'border-2 border-white/80 shadow-xl shadow-purple-500/30',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40',
      'active:scale-95',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/40',
      'before:pointer-events-none'
    ),
  },

  glass: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-2 w-full grow overflow-hidden rounded-full',
      'bg-white/10 dark:bg-black/10 backdrop-blur-xl',
      'border border-white/20 dark:border-white/10',
      'shadow-lg shadow-black/10 dark:shadow-white/5',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent',
      'before:pointer-events-none'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-white/30 dark:bg-white/20 backdrop-blur-md',
      'shadow-lg shadow-white/20 dark:shadow-white/10',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/30',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-5 w-5 rounded-full',
      'bg-white/80 dark:bg-white/70 backdrop-blur-md',
      'shadow-xl shadow-white/30 dark:shadow-white/20',
      'border border-white/40 dark:border-white/30',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-2xl hover:bg-white/90',
      'active:scale-95',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-br before:from-white/50 before:to-transparent',
      'before:pointer-events-none'
    ),
  },

  outline: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-2 w-full grow overflow-hidden rounded-full',
      'bg-transparent border-2 border-muted',
      'backdrop-blur-sm transition-all duration-300',
      'group-hover:border-muted/80 group-hover:shadow-sm'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-transparent border-2 border-primary',
      'shadow-lg shadow-primary/20 transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-r before:from-primary/10 before:to-primary/5',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-6 w-6 rounded-full bg-background',
      'border-2 border-primary shadow-lg shadow-primary/20',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-xl hover:shadow-primary/30',
      'active:scale-95 hover:border-primary/80',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-br before:from-primary/10 before:to-transparent',
      'before:pointer-events-none'
    ),
  },

  shadow: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-2 w-full grow overflow-hidden rounded-full',
      'bg-gradient-to-b from-muted/40 to-muted/60',
      'shadow-inner shadow-black/20 dark:shadow-white/10',
      'border border-border/30 backdrop-blur-sm',
      'transition-all duration-300'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-b from-primary/90 to-primary',
      'shadow-lg shadow-primary/30 transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/20',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-6 w-6 rounded-full',
      'bg-gradient-to-b from-background to-muted/20',
      'shadow-xl shadow-black/15 dark:shadow-white/10',
      'border border-primary/20 backdrop-blur-sm',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-2xl hover:shadow-black/20',
      'active:scale-95',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-br before:from-white/30 before:to-transparent',
      'before:pointer-events-none'
    ),
  },

  neon: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-3 w-full grow overflow-hidden rounded-full',
      'bg-black/90 backdrop-blur-sm',
      'border border-cyan-500/30 transition-all duration-300',
      'shadow-lg shadow-cyan-500/20'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-r from-cyan-500 to-cyan-400',
      'shadow-[0_0_15px_3px_rgba(6,182,212,0.7),0_0_30px_5px_rgba(6,182,212,0.5)]',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/20',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-7 w-7 rounded-full',
      'bg-gradient-to-br from-cyan-400 to-cyan-500',
      'shadow-[0_0_20px_3px_rgba(6,182,212,0.8),0_0_40px_5px_rgba(6,182,212,0.6)]',
      'border border-cyan-300/50 backdrop-blur-sm',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-[0_0_25px_5px_rgba(6,182,212,0.9)]',
      'active:scale-95',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/30',
      'before:pointer-events-none'
    ),
    value: 'text-cyan-500 text-sm font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  },

  material: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-1 w-full grow overflow-hidden rounded-full',
      'bg-gradient-to-r from-muted/50 to-muted/70',
      'transition-all duration-300 group-hover:from-muted/60 group-hover:to-muted/80'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-r from-primary to-primary/90',
      'shadow-md shadow-primary/25 transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/15',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-6 w-6 rounded-full',
      'bg-gradient-to-br from-primary to-primary/90',
      'shadow-lg shadow-primary/30 transition-all duration-300',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 hover:shadow-xl hover:shadow-primary/40',
      'active:scale-95',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/25',
      'before:pointer-events-none'
    ),
  },

  neumorphic: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-2 w-full grow overflow-hidden rounded-full',
      'bg-gradient-to-b from-gray-200 to-gray-300',
      'dark:from-gray-700 dark:to-gray-800',
      'shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]',
      'dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.1)]',
      'transition-all duration-300'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-r from-blue-400 to-blue-500',
      'shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1),inset_2px_2px_4px_rgba(255,255,255,0.2)]',
      'transition-all duration-300'
    ),
    thumb: cn(
      'block h-6 w-6 rounded-full',
      'bg-gradient-to-br from-gray-100 to-gray-200',
      'dark:from-gray-600 dark:to-gray-700',
      'shadow-[3px_3px_6px_rgba(0,0,0,0.15),-3px_-3px_6px_rgba(255,255,255,0.9)]',
      'dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.1)]',
      'ring-offset-background transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 active:scale-95',
      'hover:shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.95)]'
    ),
  },

  retro: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-3 w-full grow overflow-hidden',
      'bg-gradient-to-b from-amber-100 to-amber-200',
      'border-2 border-amber-800 transition-all duration-300',
      'shadow-[inset_0_2px_4px_rgba(146,64,14,0.3)]'
    ),
    range: cn(
      'absolute h-full',
      'bg-gradient-to-b from-amber-500 to-amber-600',
      'shadow-[inset_0_1px_2px_rgba(146,64,14,0.4)]',
      'transition-all duration-300',
      'before:absolute before:inset-0',
      'before:bg-gradient-to-t before:from-transparent before:to-amber-400/30',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-7 w-7 rounded-sm',
      'bg-gradient-to-b from-amber-100 to-amber-200',
      'border-2 border-amber-800 transition-all duration-300',
      'shadow-[3px_3px_0px_rgba(146,64,14,1),inset_1px_1px_2px_rgba(255,255,255,0.5)]',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-amber-600 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-105 active:scale-95',
      'hover:shadow-[4px_4px_0px_rgba(146,64,14,1)]'
    ),
    value: 'text-amber-800 font-mono text-sm font-bold drop-shadow-[1px_1px_0px_rgba(255,255,255,0.8)]',
  },

  cyberpunk: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-3 w-full grow overflow-hidden',
      'bg-gradient-to-r from-black via-gray-900 to-black',
      'border-2 border-yellow-400 transition-all duration-300',
      'shadow-[0_0_10px_rgba(234,179,8,0.5),inset_0_0_10px_rgba(0,0,0,0.8)]'
    ),
    range: cn(
      'absolute h-full',
      'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600',
      'shadow-[0_0_15px_rgba(192,38,211,0.7)]',
      'transition-all duration-300',
      'before:absolute before:inset-0',
      'before:bg-gradient-to-t before:from-transparent before:to-white/20',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-7 w-7 bg-gradient-to-br from-yellow-300 to-yellow-500',
      'clip-path-polygon-[50%_0%,_100%_50%,_50%_100%,_0%_50%]',
      'shadow-[0_0_15px_rgba(234,179,8,0.8)]',
      'border border-yellow-300 transition-all duration-300',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-yellow-400 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-110 active:scale-95',
      'hover:shadow-[0_0_20px_rgba(234,179,8,1)]'
    ),
    value: 'text-yellow-400 font-mono text-sm font-bold drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]',
  },

  brutalist: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-4 w-full grow overflow-hidden',
      'bg-gradient-to-b from-gray-200 to-gray-400',
      'border-2 border-black transition-all duration-200',
      'shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
    ),
    range: cn(
      'absolute h-full',
      'bg-gradient-to-b from-gray-800 to-black',
      'shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]',
      'transition-all duration-200'
    ),
    thumb: cn(
      'block h-8 w-8 rounded-none',
      'bg-gradient-to-b from-white to-gray-100',
      'border-2 border-black transition-all duration-200',
      'shadow-[5px_5px_0px_rgba(0,0,0,1),inset_1px_1px_2px_rgba(255,255,255,0.8)]',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-black focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-105 active:scale-95',
      'hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]'
    ),
    value: 'text-black font-mono text-sm font-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]',
  },

  skeuomorphic: {
    root: 'relative flex w-full touch-none select-none items-center group',
    track: cn(
      'relative h-4 w-full grow overflow-hidden rounded-full',
      'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500',
      'border border-gray-500 transition-all duration-300',
      'shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.8)]'
    ),
    range: cn(
      'absolute h-full rounded-full',
      'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600',
      'border-r border-gray-500 transition-all duration-300',
      'shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.2)]',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-t before:from-transparent before:to-white/25',
      'before:pointer-events-none'
    ),
    thumb: cn(
      'block h-8 w-8 rounded-full',
      'bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300',
      'border border-gray-400 transition-all duration-300',
      'shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)]',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-gray-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-105 active:scale-95',
      'hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]',
      'before:absolute before:inset-0 before:rounded-full',
      'before:bg-gradient-to-br before:from-white/50 before:via-white/20 before:to-transparent',
      'before:pointer-events-none'
    ),
    value: 'text-gray-800 text-sm font-medium drop-shadow-[1px_1px_1px_rgba(255,255,255,0.8)]',
  },
};

// Enhanced animation props with better physics and easing
const getAnimationProps = (type: SliderAnimationType, duration = 0.3): MotionProps => {
  switch (type) {
    case 'slide':
      return {
        animate: { y: [0, -4, 4, 0] },
        transition: { 
          repeat: Infinity, 
          duration: duration * 3, 
          ease: [0.4, 0, 0.6, 1],
          repeatType: "loop"
        },
      };
    case 'fade':
      return {
        animate: { opacity: [1, 0.6, 1] },
        transition: { 
          repeat: Infinity, 
          duration: duration * 4,
          ease: "easeInOut",
          repeatType: "loop"
        },
      };
    case 'zoom':
      return {
        initial: { scale: 0.8, opacity: 0 },
        animate: { 
          scale: [0.8, 1.1, 1], 
          opacity: [0, 1, 1] 
        },
        transition: { 
          repeat: Infinity, 
          duration: duration * 3,
          ease: [0.68, -0.55, 0.265, 1.55],
          repeatType: "loop",
          repeatDelay: 1
        },
      };
    case 'spring':
      return {
        initial: { x: -8 },
        animate: { x: 0 },
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 15,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        },
      };
    case 'elastic':
      return {
        initial: { x: -15 },
        animate: { x: 0 },
        transition: {
          type: 'spring',
          stiffness: 600,
          damping: 8,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.8
        },
      };
    case 'parallax':
      return {
        initial: { x: -12, opacity: 0.7 },
        animate: { x: 0, opacity: 1 },
        transition: { 
          duration: duration * 2, 
          delay: duration * 0.1, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.4, 0, 0.2, 1]
        },
      };
    case 'flip':
      return {
        initial: { rotateY: 90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        transition: { 
          duration: duration * 2, 
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 1,
          ease: "easeInOut"
        },
      };
    case 'morph':
      return {
        initial: { borderRadius: '20%', opacity: 0.8 },
        animate: { borderRadius: '50%', opacity: 1 },
        transition: { 
          duration: duration * 2, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        },
      };
    case 'hover':
      return {
        whileHover: { 
          scale: 1.15,
          transition: { type: "spring", stiffness: 400, damping: 15 }
        },
        whileTap: { 
          scale: 0.9,
          transition: { type: "spring", stiffness: 600, damping: 20 }
        },
      };
    case 'pulse':
      return {
        animate: {
          scale: [1, 1.15, 1],
          opacity: [1, 0.8, 1],
        },
        transition: {
          repeat: Infinity,
          duration: duration * 4,
          ease: "easeInOut",
          repeatType: "loop"
        },
      };
    case 'breathe':
      return {
        animate: {
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0.4)',
            '0 0 0 8px rgba(59, 130, 246, 0.1)',
            '0 0 0 0 rgba(59, 130, 246, 0.4)',
          ],
          scale: [1, 1.05, 1]
        },
        transition: {
          repeat: Infinity,
          duration: duration * 8,
          ease: "easeInOut",
          repeatType: "loop"
        },
      };
    case 'wave':
      return {
        animate: {
          x: [0, 6, -6, 6, 0],
          rotate: [0, 2, -2, 1, 0]
        },
        transition: {
          repeat: Infinity,
          duration: duration * 4,
          ease: "easeInOut",
          repeatType: "loop"
        },
      };
    case 'rainbow':
      return {
        animate: {
          background: [
            'linear-gradient(0deg, #ff0000, #ff0000)',
            'linear-gradient(60deg, #ff8c00, #ff8c00)', 
            'linear-gradient(120deg, #ffff00, #ffff00)',
            'linear-gradient(180deg, #00ff00, #00ff00)',
            'linear-gradient(240deg, #0000ff, #0000ff)',
            'linear-gradient(300deg, #8b00ff, #8b00ff)',
            'linear-gradient(360deg, #ff1493, #ff1493)',
            'linear-gradient(0deg, #ff0000, #ff0000)',
          ],
        },
        transition: {
          repeat: Infinity,
          duration: duration * 8,
          ease: "linear",
        },
      };
    case 'bounce':
      return {
        animate: {
          y: [0, -6, 6, 0],
          scale: [1, 1.05, 0.98, 1]
        },
        transition: {
          repeat: Infinity,
          duration: duration * 3,
          ease: [0.68, -0.55, 0.265, 1.55],
          repeatType: "loop"
        },
      };
    default:
      return {};
  }
};

// Enhanced motion components
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
      size = 'md',
      showTooltip = false,
      glowEffect = false,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState<number[]>(props.defaultValue || props.value || [0]);
    const [isHovered, setIsHovered] = React.useState(false);
    const styles = variantStyles[variant];
    const animationProps = getAnimationProps(animationType, animationDuration);

    // Size configurations
    const sizeConfig = {
      sm: { root: 'py-2', multiplier: 0.8 },
      md: { root: 'py-3', multiplier: 1 },
      lg: { root: 'py-4', multiplier: 1.2 }
    };

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
      <div 
        className={cn("w-full space-y-3", sizeConfig[size].root)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SliderPrimitive.Root
          ref={ref}
          className={cn(styles.root, className)}
          onValueChange={handleValueChange}
          {...props}
        >
          <MotionTrack
            className={cn(styles.track, trackClassName)}
            style={{ 
              transform: `scale(${sizeConfig[size].multiplier})`,
              transformOrigin: 'center'
            }}
            animate={
              animationType === 'breathe'
                ? {
                    boxShadow: [
                      'inset 0 0 0 rgba(0,0,0,0.2)',
                      'inset 0 0 12px rgba(0,0,0,0.4)',
                      'inset 0 0 0 rgba(0,0,0,0.2)',
                    ],
                  }
                : undefined
            }
            transition={
              animationType === 'breathe'
                ? {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    repeatType: "loop",
                  }
                : undefined
            }
            whileHover={{
              scale: sizeConfig[size].multiplier * 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <MotionRange
              className={cn(styles.range, rangeClassName)}
              {...(animationType !== 'none' ? animationProps : {})}
              style={{
                ...(glowEffect && {
                  boxShadow: `0 0 20px rgba(59, 130, 246, ${isHovered ? '0.4' : '0.2'})`
                })
              }}
            />
          </MotionTrack>

          {value.map((val, index) => (
            <MotionThumb
              key={index}
              className={cn(styles.thumb, thumbClassName)}
              style={{ 
                transform: `scale(${sizeConfig[size].multiplier})`,
                transformOrigin: 'center'
              }}
              {...(animationType !== 'none' ? animationProps : {})}
              whileHover={{
                scale: sizeConfig[size].multiplier * 1.15,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              whileTap={{
                scale: sizeConfig[size].multiplier * 0.9,
                transition: { type: "spring", stiffness: 600, damping: 20 }
              }}
            >
              {/* Tooltip */}
              {showTooltip && isHovered && (
                <motion.div
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border/40 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {valuePrefix}{val}{valueSuffix}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-border/40" />
                </motion.div>
              )}
            </MotionThumb>
          ))}
        </SliderPrimitive.Root>

        {showValue && (
          <motion.div 
            className={cn('text-center text-sm font-medium', styles.value, valueClassName)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
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
