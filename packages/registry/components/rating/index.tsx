'use client';

/**
 * Rating Component
 * ----------------
 * A highly customizable and accessible rating component supporting:
 * - Icon-based ratings (Lucide icons)
 * - Emoji-based ratings
 * - Half ratings
 * - Keyboard and mouse interactions
 * - Controlled and uncontrolled usage
 * - Multiple animation styles via Framer Motion
 * - Color schemes and size/orientation variants
 *
 * This file intentionally preserves **all existing logic and structure**.
 * Only JSDoc comments are added for documentation and developer clarity.
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Star, StarHalf, type LucideIcon} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '../../../utils/cn';

/* ----------------------------------------
 * Types
 * ------------------------------------- */
type ColorScheme = 'yellow' | 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'indigo' | 'teal' | 'amber';

export type AnimationType = 'bounce' | 'pulse'   | 'fade'   | 'slide'   | 'rotate'   | 'scale'   | 'elastic'   | 'spring'  | 'glow'  | 'shimmer'  | 'none';

/* ----------------------------------------
 * Layout Variants
 * ------------------------------------- */
const ratingVariants = cva('flex items-center gap-1', {
  variants: {
    size: {
      xs: 'gap-0.5',
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
      xl: 'gap-2.5',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    size: 'md',
    orientation: 'horizontal',
  },
});

const COLOR_SCHEMES: Record<ColorScheme, { filled: string; empty: string }> = {
  yellow: {
    filled: 'text-yellow-400 fill-yellow-400',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  red: {
    filled: 'text-red-500 fill-red-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  blue: {
    filled: 'text-blue-500 fill-blue-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  green: {
    filled: 'text-green-500 fill-green-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  purple: {
    filled: 'text-purple-500 fill-purple-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  pink: {
    filled: 'text-pink-500 fill-pink-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  orange: {
    filled: 'text-orange-500 fill-orange-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  indigo: {
    filled: 'text-indigo-500 fill-indigo-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  teal: {
    filled: 'text-teal-500 fill-teal-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
  amber: {
    filled: 'text-amber-500 fill-amber-500',
    empty: 'text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600',
  },
};

const starVariants = cva('transition-all duration-300 ease-in-out', {
  variants: {
    size: {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      xl: 'w-8 h-8',
    },
    filled: {
      true: '',
      false: '',
    },
    half: {
      true: '',
      false: '',
    },
    interactive: {
      true: 'cursor-pointer hover:scale-110',
      false: '',
    },
    clicked: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    filled: false,
    interactive: false,
    clicked: false,
  },
});

/* ----------------------------------------
 * Emoji Animation Variants
 * ------------------------------------- */
const baseInitial = { scale: 0, opacity: 0 };
const baseAnimate = (index: number) => ({
  scale: 1,
  opacity: 1,
  transition: {
    delay: index * 0.05,
  },
});

/**
 * Motion variants for different emoji animation styles.
 */
export const emojiMotionVariants: Record<AnimationType, Variants> = {
  bounce: {
    initial: { ...baseInitial, y: -30, rotate: -10 },
    animate: (index: number) => ({
      ...baseAnimate(index),
      y: 0,
      rotate: 0,
      transition: {
        ...baseAnimate(index).transition,
        type: "spring" as const,
        stiffness: 400,
        damping: 8,
        bounce: 0.8,
      },
    }),
  },
  pulse: {
    initial: { ...baseInitial, scale: 0.3 },
    animate: (index: number) => ({
      ...baseAnimate(index),
      transition: {
        ...baseAnimate(index).transition,
        type: "spring" as const,
        stiffness: 300,
        damping: 10,
      },
    }),
  },
  fade: {
    initial: { opacity: 0, scale: 0.5 },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.08,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    }),
  },
  slide: {
    initial: { x: -40, opacity: 0, rotate: -20 },
    animate: (index: number) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: index * 0.06,
        type: "spring" as const,
        stiffness: 300,
        damping: 15,
      },
    }),
  },
  rotate: {
    initial: { rotate: -360, opacity: 0, scale: 0 },
    animate: (index: number) => ({
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.08,
        type: "spring" as const,
        stiffness: 250,
        damping: 12,
      },
    }),
  },
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.04,
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
      },
    }),
  },
  elastic: {
    initial: { scale: 0, opacity: 0 },
    animate: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.05,
        type: "spring" as const,
        stiffness: 500,
        damping: 10,
        mass: 0.4,
      },
    }),
  },
  glow: {
    initial: { opacity: 0, scale: 0.6 },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,
      filter: "brightness(1) saturate(1)",
      transition: {
        delay: index * 0.04,
        duration: 0.5,
      },
    }),
    whileHover: {
      filter: "brightness(1.3) saturate(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))",
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    whileTap: {
      filter: "brightness(1.5) saturate(1.3) drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))",
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  },
  shimmer: {
    initial: { opacity: 0, scale: 0.3, rotate: -60 },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: index * 0.06,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
    whileHover: {
      rotate: [0, -10, 10, -10, 0],
      scale: 1.15,
      filter: "brightness(1.2) contrast(1.1)",
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const,
      },
    },
    whileTap: {
      rotate: [0, -15, 15, -15, 0],
      scale: 1.1,
      filter: "brightness(1.3) contrast(1.2)",
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const,
      },
    },
  },
  spring: {
    initial: { scale: 0, opacity: 0, rotate: -360 },
    animate: (index: number) => ({
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        delay: index * 0.04,
        type: "spring" as const,
        stiffness: 300,
        damping: 12,
      },
    }),
  },
  none: {
    initial: {},
    animate: {},
  },
};

/* ----------------------------------------
 * Interfaces
 * ------------------------------------- */
export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof ratingVariants> {
  value?: number;
  max?: number;
  interactive?: boolean;
  disabled?: boolean;
  allowHalf?: boolean;
  showValue?: boolean;
  colorScheme?: ColorScheme;
  onChange?: (value: number) => void;
  iconType?: LucideIcon;
  icon?: React.ComponentType<{ className?: string }>;
  halfIcon?: React.ComponentType<{ className?: string }>;
  emoji?: string;
  emojis?: string[];
  emptyEmoji?: string;
  readOnly?: boolean;
  animationType?: AnimationType;
  onEmojiSelect?: (value: number, emoji: string) => void;
}

type IconProps = {
  className?: string;
  'aria-hidden': boolean;
  'aria-label'?: string;
  role?: string;
  tabIndex?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

/* ----------------------------------------
 * Component
 * ------------------------------------- */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      max = 5,
      interactive = false,
      disabled = false,
      allowHalf = false,
      showValue = false,
      colorScheme = 'yellow',
      onChange,
      iconType = Star,
      icon: customIcon,
      halfIcon: customHalfIcon,
      emoji,
      emojis,
      emptyEmoji,
      readOnly = false,
      size = 'md',
      orientation = 'horizontal',
      animationType = 'spring',
      onEmojiSelect,
      className,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [internalValue, setInternalValue] = useState<number>(value ?? 0);
    const [previousValue, setPreviousValue] = useState<number>(value ?? 0);
    const [animationVersion, setAnimationVersion] = useState<number>(0);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const prevAnimationTypeRef = useRef<AnimationType>(animationType);    
    const currentValue = value !== undefined ? value : internalValue;
    
    // Increment version when animationType changes to force remount (only for emojis)
    useEffect(() => {
      if (prevAnimationTypeRef.current !== animationType) {
        prevAnimationTypeRef.current = animationType;
        setAnimationVersion(prev => prev + 1);
      }
    }, [animationType]);
    
    // Sync internal value when controlled value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
        setPreviousValue(value);
      }
    }, [value]);
    
    // Track value changes for fill animation
    useEffect(() => {
      if (currentValue !== previousValue) {
        setPreviousValue(currentValue);
      }
    }, [currentValue, previousValue]);

    // Check if using emojis
    const useEmoji = !!(emoji || emojis);

    // Resolve icons based on iconType or custom props (only if not using emojis)
    const { Icon, HalfIcon } = useMemo(() => {
      if (useEmoji) {
        return {
          Icon: Star,
          HalfIcon: StarHalf,
        };
      }

      if (customIcon) {
        return {
          Icon: customIcon,
          HalfIcon: customHalfIcon || customIcon,
        };
      }

      if (iconType) {
        return {
          Icon: iconType,
          HalfIcon: StarHalf, 
        };
      }
      
      // Default fallback to Star
      return {
        Icon: Star,
        HalfIcon: StarHalf,
      };
    }, [iconType, customIcon, customHalfIcon, useEmoji]);

    // Get emoji for each rating item
    const getEmojiForIndex = useCallback(
      (index: number, isFilled: boolean) => {
        if (emojis && emojis.length > index) {
          return emojis[index];
        }
        if (emoji) {
          return isFilled ? emoji : emptyEmoji || emoji;
        }
        return null;
      },
      [emoji, emojis, emptyEmoji]
    );

    const isInteractive = interactive && !readOnly && !disabled;
    const displayValue = isHovering && hoverValue !== null ? hoverValue : currentValue;
    const clampedValue = Math.min(Math.max(displayValue, 0), max);

    const handleClick = useCallback(
      (index: number, isHalf: boolean) => {
        if (!isInteractive || disabled) return;
        
        if (useEmoji && isHalf) {
          return;
        }
        
        const newValue = isHalf ? index + 0.5 : index + 1;
        
        if (useEmoji) {
          setClickedIndex(index);
          setTimeout(() => setClickedIndex(null), 400);
        } else {
          setClickedIndex(index);
          setTimeout(() => setClickedIndex(null), 400);
        }
        
        if (useEmoji && onEmojiSelect) {
          const selectedEmoji = getEmojiForIndex(index, true) || emoji || '⭐';
          onEmojiSelect(newValue, selectedEmoji);
        }
        
        if (value === undefined) {
          setInternalValue(newValue);
        }
        
        onChange?.(newValue);
      },
      [isInteractive, disabled, onChange, value, useEmoji, onEmojiSelect, emoji, getEmojiForIndex]
    );
    
    // Get animation variants based on animationType - only for emojis
    const emojiAnimationVariants = useMemo(() => {
      const baseVariants = emojiMotionVariants[animationType] || emojiMotionVariants.spring;
      return {
        ...baseVariants,
        clicked: {
          scale: [1, 1.2, 1],
          transition: {
            duration: 0.4,
            ease: "easeOut" as const,
          },
        },
      };
    }, [animationType]);

    const handleMouseEnter = useCallback(
      (index: number, isHalf: boolean) => {
        if (!isInteractive) return;
        setIsHovering(true);
        setHoverValue(isHalf ? index + 0.5 : index + 1);
      },
      [isInteractive]
    );

    const handleMouseLeave = useCallback(() => {
      if (!isInteractive) return;
      setIsHovering(false);
      setHoverValue(null);
    }, [isInteractive]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent, index: number) => {
        if (!isInteractive) return;

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowUp': {
            event.preventDefault();
            const nextValue = Math.min(currentValue + 1, max);
            if (value === undefined) {
              setInternalValue(nextValue);
            }
            onChange?.(nextValue);
            break;
          }
          case 'ArrowLeft':
          case 'ArrowDown': {
            event.preventDefault();
            const prevValue = Math.max(currentValue - 1, 0);
            if (value === undefined) {
              setInternalValue(prevValue);
            }
            onChange?.(prevValue);
            break;
          }
          case 'Enter':
          case ' ': {
            event.preventDefault();
            handleClick(index, false);
            break;
          }
        }
      },
      [isInteractive, value, max, onChange, handleClick]
    );

    const renderStar = (index: number) => {
      const starValue = index + 1;
      const isFilled = clampedValue >= starValue;
      const selectedIndex = Math.ceil(currentValue) - 1;
      const selectedEmojiIndex = index === selectedIndex;
      const isSelected = Math.ceil(currentValue) >= starValue;
      const isHalfFilled = allowHalf && clampedValue >= index + 0.5 && clampedValue < starValue;
      const isEmpty = !isFilled && !isHalfFilled;
      
      // Render emoji if using emoji mode
      if (useEmoji) {
        const filledEmoji = getEmojiForIndex(index, true);
        const emptyEmojiChar = getEmojiForIndex(index, false);
        const emojiText = isFilled ? filledEmoji : emptyEmojiChar;
        
        if (!emojiText) return null;

        const emojiSizeClass = {
          xs: 'text-lg',
          sm: 'text-xl',
          md: 'text-2xl',
          lg: 'text-3xl',
          xl: 'text-4xl',
        }[size || 'md'];

        const emojiProps = {
          className: cn(
            emojiSizeClass,
            isInteractive && 'cursor-pointer',
            'select-none caret-transparent',
            'outline-none ',
            selectedEmojiIndex && 'scale-[1.25]'
          ),
          'aria-hidden': true,
          // For emojis, disable half-star functionality - always click full star
          ...(isInteractive && {
            onClick: () => handleClick(index, false),
            onMouseEnter: () => handleMouseEnter(index, false),
            onMouseLeave: handleMouseLeave,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(index, false);
              }
            },
            tabIndex: disabled ? -1 : 0,
            role: 'button',
            'aria-label': `Rate ${starValue} out of ${max}`,
          }),
        };

        // Create motion component for emoji
        const MotionEmoji = motion.span;
        const emojiKey = `${animationType}-${animationVersion}-${index}`;
        const isClicked = clickedIndex !== null && index <= clickedIndex;

        return (
          <MotionEmoji 
            key={emojiKey} 
            {...emojiProps}
            variants={emojiAnimationVariants}
            initial="initial"
            animate={isClicked ? "clicked" : "animate"}
            whileHover={isInteractive ? "whileHover" : undefined}
            whileTap={isInteractive ? "whileTap" : undefined}
            custom={index}
          >
            {emojiText}
          </MotionEmoji>
        );
      }

      // Get color classes from color scheme
      const colorConfig = COLOR_SCHEMES[colorScheme as ColorScheme] || COLOR_SCHEMES.yellow;
      const filledColorClass = isFilled ? colorConfig.filled : '';
      // For half-filled stars, base icon should always be empty (gray)
      const emptyColorClass = (isEmpty || isHalfFilled) ? colorConfig.empty : '';
      
      // Render icon with click animation
      const starClassName = cn(
        starVariants({
          size,
          filled: isFilled,
          half: isHalfFilled,
          interactive: isInteractive && !allowHalf,
          clicked: false,
        }),
        filledColorClass,
        emptyColorClass,
        isSelected && 'scale-[1.25]',
        'select-none caret-transparent',
        'outline-none focus:outline-none focus-visible:outline-none'
      );

      const getIconProps = (): IconProps => {
        const baseProps: IconProps = {
          className: starClassName,
          'aria-hidden': true,
        };
        
        if (isInteractive && !allowHalf) {
          baseProps.onClick = () => handleClick(index, false);
          baseProps.onMouseEnter = () => handleMouseEnter(index, false);
          baseProps.onMouseLeave = handleMouseLeave;
          baseProps.onKeyDown = (e: React.KeyboardEvent) => handleKeyDown(e, index);
          baseProps.tabIndex = disabled ? -1 : 0;
          baseProps.role = 'button';
          baseProps['aria-label'] = `Rate ${starValue} out of ${max}`;
        } else if (isInteractive && allowHalf) {
          baseProps.onMouseEnter = () => handleMouseEnter(index, false);
          baseProps.onMouseLeave = handleMouseLeave;
        }
        
        return baseProps;
      };

      if (allowHalf) {
        const halfColorClass = colorConfig.filled;
        const isClicked = clickedIndex !== null && index <= clickedIndex;
        const MotionIcon = motion.create(Icon);
        
        return (
          <motion.div key={index} className="relative inline-block isolate">
            <MotionIcon 
              {...getIconProps()}
              animate={isClicked ? { scale: [1, 1.2, 1] } : {}}
              transition={isClicked ? { duration: 0.4, ease: "easeOut" } : {}}
            />
            <AnimatePresence>
              {isHalfFilled && !isFilled && (
                <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none">
                  <HalfIcon
                    className={cn(starClassName, halfColorClass, 'outline-none border-0')}
                    aria-hidden={true}
                  />
                </div>
              )}
            </AnimatePresence>
            {isInteractive && (
              <div 
                className="absolute inset-0 [pointer-events:auto] select-none"
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={`Rate ${isHalfFilled ? index + 0.5 : starValue} out of ${max}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(index, false);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handleClick(index, true);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleClick(index, false);
                  }
                }}
              >
                <div
                  className="absolute left-0 top-0 w-1/2 h-full z-10 outline-none border-0 select-none caret-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(index, true);
                  }}
                  onMouseEnter={() => handleMouseEnter(index, true)}
                  onMouseLeave={handleMouseLeave}
                />
                <div
                  className="absolute right-0 top-0 w-1/2 h-full z-10 outline-none border-0 select-none caret-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(index, false);
                  }}
                  onMouseEnter={() => handleMouseEnter(index, false)}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            )}
          </motion.div>
        );
      }

      const isClicked = clickedIndex !== null && index <= clickedIndex;
      const MotionIcon = motion.create(Icon);
      
      return (
        <MotionIcon 
          key={index} 
          {...getIconProps()}
          whileHover={isInteractive ? { scale: 1.15 } : undefined}
          whileTap={isInteractive ? { scale: 0.95 } : undefined}
          animate={isClicked ? { scale: [1, 1.2, 1] } : {}}
          transition={
            isClicked 
              ? { duration: 0.4, ease: "easeOut" }
              : { duration: 0.2, ease: "easeOut" }
          }
        />
      );
    };

    return (
        <div
          ref={ref}
          className={cn(ratingVariants({ size, orientation }), className)}
          aria-label={
            isInteractive
              ? `Rating: ${currentValue} out of ${max} stars`
              : `Rating: ${currentValue} out of ${max} stars`
          }
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={max}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
        {Array.from({ length: max }, (_, index) => renderStar(index))}
        {showValue && (
          <span className={cn('ml-2 text-md text-muted-foreground', orientation === 'vertical' && 'mt-1')}>
            {currentValue.toFixed(allowHalf ? 1 : 0)} / {max}
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = 'Rating';
