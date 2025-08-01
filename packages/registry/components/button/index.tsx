'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animationVariant?: string;
  children?: React.ReactNode;
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'px-4 py-2 bg-primary text-white hover:bg-primary/90',
        primary: 'px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90',
        secondary: 'bg-muted text-muted-foreground hover:bg-muted/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        subtle: 'bg-accent text-accent-foreground hover:bg-accent/80',
        elevated: 'bg-background shadow-md hover:shadow-lg',
        glass: 'bg-black/10 backdrop-blur-lg text-white hover:bg-black/20',
        neon: 'bg-pink-500 text-white shadow-lg shadow-pink-500/50 hover:bg-pink-600',
        pill: 'rounded-full px-6 py-2 bg-pill text-white hover:bg-pill/90',
        none: '',
      },
      size: {
        xs: 'h-8 px-2 text-xs rounded-sm',
        sm: 'h-9 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-lg',
        xl: 'h-14 px-8 text-xl rounded-lg',
        icon: 'h-10 w-10 p-2',
        pill: 'h-10 px-6 text-base rounded-full',
        block: 'w-full py-3 text-lg',
        compact: 'h-8 px-2 text-xs',
        wide: 'px-12 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const animations = {
  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { repeat: Infinity, duration: 0.5 },
  },
  bounceSlow: {
    animate: { y: [0, -15, 0] },
    transition: { repeat: Infinity, duration: 0.8 },
  },
  bounceFast: {
    animate: { y: [0, -8, 0] },
    transition: { repeat: Infinity, duration: 0.3 },
  },
  bounceSmooth: {
    animate: { y: [0, -20, 0] },
    transition: { repeat: Infinity, duration: 1, ease: 'easeInOut' },
  },
  bounceJelly: {
    animate: { scale: [1, 1.2, 0.9, 1.1, 1] },
    transition: { repeat: Infinity, duration: 1, ease: 'easeInOut' },
  },
  rotateClockwiseSlow: {
    whileHover: { rotate: 360 },
    transition: { duration: 0.3 },
  },
  rotateClockwiseFast: {
    whileHover: { rotate: 360 },
    transition: { duration: 0.5 },
  },
  rotateAntiClockwiseSlow: {
    whileHover: { rotate: -360 },
    transition: { duration: 0.3 },
  },
  rotateAntiClockwiseFast: {
    whileHover: { rotate: -360 },
    transition: { duration: 0.5 },
  },
  rotatePingPong: {
    whileHover: { rotate: [0, 15, -15, 0] },
    transition: { repeat: Infinity, duration: 1, ease: 'easeInOut' },
  },
  scaleUp: { whileHover: { scale: 1.2 }, transition: { duration: 0.3 } },
  scaleDown: { whileHover: { scale: 0.9 }, transition: { duration: 0.3 } },
  scalePulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { repeat: Infinity, duration: 0.6 },
  },
  scaleExpandContract: {
    animate: { scale: [1, 1.3, 1] },
    transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
  },
  scaleHeartbeat: {
    animate: { scale: [1, 1.15, 1] },
    transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' },
  },
  flipX: { whileHover: { rotateY: 360 }, transition: { duration: 0.5 } },
  flipY: { whileHover: { rotateX: 360 }, transition: { duration: 0.5 } },
  flipCard: {
    animate: { rotateY: [0, 180, 360] },
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },

  fadeBlink: {
    animate: { opacity: [1, 0, 1] },
    transition: { repeat: Infinity, duration: 0.5 },
  },
  fadeInOut: {
    animate: { opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutTop: {
    animate: { y: [-20, 0, -20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutBottom: {
    animate: { y: [20, 0, 20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutLeft: {
    animate: { x: [-20, 0, -20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutRight: {
    animate: { x: [20, 0, 20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutTopLeft: {
    animate: { x: [-20, 0, -20], y: [-20, 0, -20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutTopRight: {
    animate: { x: [20, 0, 20], y: [-20, 0, -20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutBottomLeft: {
    animate: { x: [-20, 0, -20], y: [20, 0, 20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  fadeInOutBottomRight: {
    animate: { x: [20, 0, 20], y: [20, 0, 20], opacity: [0, 1, 0] },
    transition: { repeat: Infinity, duration: 2 },
  },
  swipeRight: { whileHover: { x: 20 }, transition: { duration: 0.3 } },
  swipeLeft: { whileHover: { x: -20 }, transition: { duration: 0.3 } },
  swipeUp: { whileHover: { y: 20 }, transition: { duration: 0.3 } },
  swipeDown: { whileHover: { y: -20 }, transition: { duration: 0.3 } },
  slideLeftRight: {
    animate: { x: [0, -20, 20, 0] },
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  slideUpDown: {
    animate: { y: [0, -20, 20, 0] },
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  press3D: {
    whileTap: { scale: 0.9, y: 5 },
    transition: { duration: 0.1 },
  },
  press3DSoft: {
    whileTap: { scale: 0.95, y: 3 },
    transition: { duration: 0.1 },
  },
  press3DHard: {
    whileTap: { scale: 0.85, y: 8 },
    transition: { duration: 0.1 },
  },
  press3DPop: {
    whileTap: { scale: 1.05, y: -2 },
    transition: { duration: 0.1 },
  },
  press3DDepth: {
    whileTap: {
      scale: 0.9,
      y: 5,
      boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.2)',
    },
    transition: { duration: 0.1 },
  },
  spinSlow: {
    animate: { rotate: [0, 360] },
    transition: { repeat: Infinity, duration: 5, ease: 'linear' },
  },
  spinFast: {
    animate: { rotate: [0, 360] },
    transition: { repeat: Infinity, duration: 1, ease: 'linear' },
  },
  spinPingPong: {
    animate: { rotate: [0, 90, -90, 0] },
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  shake: {
    animate: { x: [0, -5, 5, -5, 5, 0] },
    transition: { repeat: Infinity, duration: 0.5 },
  },
  wobble: {
    animate: { rotate: [0, -5, 5, -5, 5, 0] },
    transition: { repeat: Infinity, duration: 0.8 },
  },
  tilt3D: {
    animate: { rotateX: 15, rotateY: 15 },
    transition: { repeat: Infinity, duration: 1, ease: 'easeInOut' },
  },
  tiltCrazy: {
    animate: {
      rotateX: [0, 15, -15, 10, -10, 0],
      rotateY: [0, -10, 10, -15, 15, 0],
    },
    transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
  },
  pulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { repeat: Infinity, duration: 0.6 },
  },
  gradientShift: {
    animate: {
      background: [
        'linear-gradient(45deg, #ff0000, #00ff00)',
        'linear-gradient(45deg, #00ff00, #0000ff)',
        'linear-gradient(45deg, #0000ff, #ff0000)',
      ],
    },
    transition: { repeat: Infinity, duration: 3, ease: 'linear' },
  },
  borderPulse: {
    whileHover: {
      border: '2px solid #ff0000',
      boxShadow: '0 0 10px #ff0000',
    },
    transition: { repeat: Infinity, duration: 1, ease: 'easeInOut' },
  },
  borderPulseRainbow: {
    animate: {
      boxShadow: ['0 0 10px #ff0000', '0 0 10px #0000ff', '0 0 10px #00ff00', '0 0 10px #ff00ff'],
    },
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  shadowGlow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(37, 99, 255, 0.8)',
    },
    transition: { duration: 0.5 },
  },
  neonGlow: {
    whileHover: {
      boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00',
    },
    transition: { duration: 0.5 },
  },
  rippleBorder: {
    whileHover: {
      scale: 1.1,
      boxShadow: '0 0 0 10px rgba(0, 255, 0, 0.2)',
    },
    transition: { duration: 0.5 },
  },
  ping: {
    animate: { scale: [1, 1.3], opacity: [1, 0] },
    transition: { duration: 0.8, repeat: Infinity },
  },
  reveal: {
    initial: { scale: 0 },
    animate: { rotate: 360, scale: 1 },
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 0.8,
      repeat: Infinity,
    },
  },
  nina: {},
};

// nina
const ninaTextVariants = {
  initial: { opacity: 0, y: -10 },
  hover: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.045, duration: 0.3, ease: [0.75, 0, 0.125, 1] },
  }),
};

const ninaBeforeVariants = {
  initial: { opacity: 1, y: 0 },
  hover: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3, ease: [0.75, 0, 0.125, 1] },
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, animationVariant, children, ...props }, ref) => {
    const animationProps = animationVariant ? animations[animationVariant as keyof typeof animations] || {} : {};

    const slotProps = asChild ? { ...props } : {};
    const motionProps = !asChild ? { ...props, ...animationProps } : {};

    const renderNinaVariant = () => {
      const content = typeof children === 'string' ? (
        <>
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            variants={ninaBeforeVariants}
          >
            {children}
          </motion.span>
          <motion.div className="relative flex gap-1" initial="initial" whileHover="hover">
            {children.split('').map((char, i) => (
              <motion.span key={i} custom={i} variants={ninaTextVariants}>
                {char}
              </motion.span>
            ))}
          </motion.div>
        </>
      ) : (
        <span>{children}</span>
      );

      return (
        <motion.button
          className={cn(buttonVariants({ variant, size }), className, 'relative overflow-hidden')}
          ref={ref}
          {...(motionProps as any)}
          initial="initial"
          whileHover="hover"
        >
          {content}
        </motion.button>
      );
    };

    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...slotProps}>
          {children}
        </Slot>
      );
    }

    if (animationVariant === 'nina') {
      return renderNinaVariant();
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...(motionProps as any)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
