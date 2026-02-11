/**
 * Progress Indicator component (Linear + Circular).
 *
 * Features:
 * - Linear progress bar and circular progress ring
 * - Optional percentage display
 * - Determinate and indeterminate states
 * - Animated fill with multiple animation variants (Framer Motion)
 *
 * Styling:
 * - Tailwind CSS only (no separate CSS file)
 *
 * Notes on performance:
 * - Uses `React.memo`, `useMemo`, and `useCallback` to reduce unnecessary re-renders.
 */

'use client';

import * as React from 'react';
import { motion, type Transition } from 'framer-motion';
import { cn } from '../../../utils/cn';

export type ProgressIndicatorType = 'linear' | 'circular';

export type ProgressAnimationVariant = 'none' | 'smooth' | 'spring' | 'bounce' | 'snappy';

export type LinearLabelPosition =
  | 'top'
  | 'bottom'
  | 'inside-left'
  | 'inside-right'
  | 'inside-center'
  | 'outside-left'
  | 'outside-right';

export type CircularLabelPosition =
  | 'inside-center'
  | 'outside-top'
  | 'outside-bottom'
  | 'outside-left'
  | 'outside-right';

/**
 * Transition configuration for Framer Motion animations.
 * Supports both tween and spring animation types.
 */
type ProgressTransition = Transition;

export type ProgressIndicatorProps = {
  /**
   * The visual type of progress indicator.
   * @default "linear"
   */
  type?: ProgressIndicatorType;
  /**
   * Progress value in range 0..100. Ignored when `indeterminate` is true.
   * @default 0
   */
  value?: number;
  /**
   * When true, shows an indeterminate animation (unknown duration).
   * @default false
   */
  indeterminate?: boolean;
  /**
   * When true, shows a percentage label.
   * @default false
   */
  showPercentage?: boolean;
  /**
   * Position of the percentage label.
   * For linear: 'top' | 'bottom' | 'inside-left' | 'inside-right' | 'inside-center' | 'outside-left' | 'outside-right'
   * For circular: 'inside-center' | 'outside-top' | 'outside-bottom' | 'outside-left' | 'outside-right'
   * @default "bottom" for linear, "inside-center" for circular
   */
  labelPosition?: LinearLabelPosition | CircularLabelPosition;
  /**
   * Label for assistive technologies. If omitted, a sensible default is used.
   */
  ariaLabel?: string;
  /**
   * Animation style for determinate fill transitions.
   * @default "smooth"
   */
  animationVariant?: ProgressAnimationVariant;
  /**
   * Optional formatter for the percentage label.
   * @default (pct) => `${pct}%`
   */
  formatPercentage?: (pct: number) => string;
  /**
   * Tailwind class for the track (background) area.
   * @default "bg-muted/30"
   */
  trackClassName?: string;
  /**
   * Tailwind class for the filled portion (foreground).
   * @default "bg-primary"
   */
  fillClassName?: string;
  /**
   * Tailwind class applied to the outer container.
   */
  className?: string;
  /**
   * Height (px) for the linear progress bar.
   * @default 8
   */
  linearHeight?: number;
  /**
   * Size (px) for circular progress (width/height).
   * @default 64
   */
  size?: number;
  /**
   * Stroke width (px) for circular progress.
   * @default 6
   */
  strokeWidth?: number;
};

const clamp01To100 = (n: number): number => Math.min(100, Math.max(0, n));

const transitionByVariant: Record<ProgressAnimationVariant, ProgressTransition> = {
  none: { duration: 0 },
  smooth: { type: 'tween', duration: 0.35, ease: 'easeOut' },
  snappy: { type: 'tween', duration: 0.2, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 220, damping: 26 },
  bounce: { type: 'spring', stiffness: 320, damping: 18 },
};

type LinearProgressProps = Required<
  Pick<
    ProgressIndicatorProps,
    | 'value'
    | 'indeterminate'
    | 'showPercentage'
    | 'animationVariant'
    | 'formatPercentage'
    | 'trackClassName'
    | 'fillClassName'
    | 'linearHeight'
  >
> & {
  ariaLabel: string;
  labelPosition?: LinearLabelPosition;
  className?: string;
};

const LinearProgress = React.memo(function LinearProgress({
  value,
  indeterminate,
  showPercentage,
  animationVariant,
  formatPercentage,
  trackClassName,
  fillClassName,
  linearHeight,
  ariaLabel,
  labelPosition = 'bottom',
  className,
}: LinearProgressProps) {
  const pct = React.useMemo(() => clamp01To100(value), [value]);
  const label = React.useMemo(() => formatPercentage(pct), [formatPercentage, pct]);

  const containerStyle = React.useMemo<React.CSSProperties>(
    () => ({ height: linearHeight }),
    [linearHeight]
  );

  const renderLabel = React.useCallback(() => {
    if (!showPercentage || indeterminate) return null;

    const labelClasses = 'text-xs font-medium text-muted-foreground';

    // Inside positions
    if (labelPosition === 'inside-left') {
      return (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white drop-shadow-sm">
          {label}
        </div>
      );
    }
    if (labelPosition === 'inside-right') {
      return (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white drop-shadow-sm">
          {label}
        </div>
      );
    }
    if (labelPosition === 'inside-center') {
      return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white drop-shadow-sm">
          {label}
        </div>
      );
    }

    // Outside positions (inline with bar)
    if (labelPosition === 'top') {
      return <div className={cn('mb-2', labelClasses)}>{label}</div>;
    }
    if (labelPosition === 'outside-left' || labelPosition === 'outside-right') {
      return <span className={labelClasses}>{label}</span>;
    }
    // Default: bottom
    return <div className={cn('mt-2', labelClasses)}>{label}</div>;
  }, [showPercentage, indeterminate, labelPosition, label]);

  return (
    <div className={cn('w-full', className)}>
      {labelPosition === 'top' && renderLabel()}
      <div className={cn('flex items-center gap-2')}>
        {labelPosition === 'outside-left' && renderLabel()}
        <div
          className={cn('relative w-full overflow-hidden rounded-full', trackClassName)}
          style={containerStyle}
          role="progressbar"
          aria-label={ariaLabel}
          aria-valuemin={indeterminate ? undefined : 0}
          aria-valuemax={indeterminate ? undefined : 100}
          aria-valuenow={indeterminate ? undefined : pct}
        >
          {!indeterminate ? (
            <motion.div
              className={cn('h-full rounded-full', fillClassName)}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={transitionByVariant[animationVariant]}
              style={{ willChange: 'width' } as React.CSSProperties}
            />
          ) : (
            <motion.div
              className={cn('absolute inset-y-0 left-0 rounded-full', fillClassName)}
              style={{ width: '40%', willChange: 'transform' } as React.CSSProperties}
              animate={{ x: ['-60%', '140%'] }}
              transition={
                { repeat: Infinity, duration: 1.1, ease: 'easeInOut' } satisfies ProgressTransition
              }
            />
          )}
          {(labelPosition === 'inside-left' ||
            labelPosition === 'inside-right' ||
            labelPosition === 'inside-center') &&
            renderLabel()}
        </div>
        {labelPosition === 'outside-right' && renderLabel()}
      </div>
      {labelPosition === 'bottom' && renderLabel()}
    </div>
  );
});

type CircularProgressProps = Required<
  Pick<
    ProgressIndicatorProps,
    | 'value'
    | 'indeterminate'
    | 'showPercentage'
    | 'animationVariant'
    | 'formatPercentage'
    | 'trackClassName'
    | 'fillClassName'
    | 'size'
    | 'strokeWidth'
  >
> & {
  ariaLabel: string;
  labelPosition?: CircularLabelPosition;
  className?: string;
};

const CircularProgress = React.memo(function CircularProgress({
  value,
  indeterminate,
  showPercentage,
  animationVariant,
  formatPercentage,
  trackClassName,
  fillClassName,
  size,
  strokeWidth,
  ariaLabel,
  labelPosition = 'inside-center',
  className,
}: CircularProgressProps) {
  const pct = React.useMemo(() => clamp01To100(value), [value]);
  const label = React.useMemo(() => formatPercentage(pct), [formatPercentage, pct]);

  const radius = React.useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = React.useMemo(() => 2 * Math.PI * radius, [radius]);
  const dashOffset = React.useMemo(
    () => circumference * (1 - pct / 100),
    [circumference, pct]
  );

  const svgBox = React.useMemo<React.CSSProperties>(
    () => ({ width: size, height: size }),
    [size]
  );

  const center = React.useMemo<number>(() => size / 2, [size]);

  const labelClasses = 'text-xs font-medium text-muted-foreground whitespace-nowrap';

  return (
    <div className={cn('inline-flex flex-col items-center justify-center', className)}>
      {labelPosition === 'outside-top' && showPercentage && !indeterminate && (
        <span className={cn(labelClasses, 'mb-2')}>{label}</span>
      )}
      <div className="flex items-center gap-2">
        {labelPosition === 'outside-left' && showPercentage && !indeterminate && (
          <span className={labelClasses}>{label}</span>
        )}
        <div
          className="relative inline-flex items-center justify-center"
          style={svgBox}
          role="progressbar"
          aria-label={ariaLabel}
          aria-valuemin={indeterminate ? undefined : 0}
          aria-valuemax={indeterminate ? undefined : 100}
          aria-valuenow={indeterminate ? undefined : pct}
        >
          <motion.svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="block"
            animate={indeterminate ? { rotate: 360 } : undefined}
            transition={
              indeterminate
                ? ({ repeat: Infinity, ease: 'linear', duration: 1 } satisfies ProgressTransition)
                : undefined
            }
            style={
              ({ willChange: indeterminate ? 'transform' : undefined } as React.CSSProperties)
            }
          >
            {/* Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              className={cn('fill-transparent', trackClassName)}
              stroke="currentColor"
              opacity={0.25}
            />

            {/* Fill */}
            {!indeterminate ? (
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                className={cn('fill-transparent', fillClassName)}
                stroke="currentColor"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={transitionByVariant[animationVariant]}
                style={
                  {
                    transform: `rotate(-90deg)`,
                    transformOrigin: '50% 50%',
                    willChange: 'stroke-dashoffset',
                  } as React.CSSProperties
                }
              />
            ) : (
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                className={cn('fill-transparent', fillClassName)}
                stroke="currentColor"
                strokeLinecap="round"
                strokeDasharray={`${circumference * 0.25} ${circumference}`}
                animate={{ strokeDashoffset: [0, -circumference] }}
                transition={
                  { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } satisfies ProgressTransition
                }
                style={
                  {
                    transform: `rotate(-90deg)`,
                    transformOrigin: '50% 50%',
                    willChange: 'stroke-dashoffset',
                  } as React.CSSProperties
                }
              />
            )}
          </motion.svg>

          {labelPosition === 'inside-center' && showPercentage && !indeterminate && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={labelClasses}>{label}</span>
            </div>
          )}
        </div>
        {labelPosition === 'outside-right' && showPercentage && !indeterminate && (
          <span className={labelClasses}>{label}</span>
        )}
      </div>
      {labelPosition === 'outside-bottom' && showPercentage && !indeterminate && (
        <span className={cn(labelClasses, 'mt-2')}>{label}</span>
      )}
    </div>
  );
});

/**
 * ProgressIndicator renders either a linear bar or circular ring.
 */
export const ProgressIndicator = React.memo(function ProgressIndicator({
  type = 'linear',
  value = 0,
  indeterminate = false,
  showPercentage = false,
  labelPosition,
  ariaLabel,
  animationVariant = 'smooth',
  formatPercentage,
  trackClassName = 'bg-slate-200 dark:bg-slate-800',
  fillClassName = 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
  className,
  linearHeight = 20,
  size = 100,
  strokeWidth = 16,
}: ProgressIndicatorProps) {
  const defaultFormatter = React.useCallback((pct: number) => `${Math.round(pct)}%`, []);
  const formatPct = formatPercentage ?? defaultFormatter;

  const computedAriaLabel = React.useMemo(() => {
    if (ariaLabel) return ariaLabel;
    return indeterminate ? 'Loading' : 'Progress';
  }, [ariaLabel, indeterminate]);

  // Set default label position based on type
  const defaultLabelPosition = React.useMemo(() => {
    if (labelPosition) return labelPosition;
    return type === 'circular' ? 'inside-center' : 'bottom';
  }, [labelPosition, type]);

  if (type === 'circular') {
    return (
      <CircularProgress
        value={value}
        indeterminate={indeterminate}
        showPercentage={showPercentage}
        animationVariant={animationVariant}
        formatPercentage={formatPct}
        trackClassName={trackClassName}
        fillClassName={fillClassName}
        size={size}
        strokeWidth={strokeWidth}
        ariaLabel={computedAriaLabel}
        labelPosition={defaultLabelPosition as CircularLabelPosition}
        className={className}
      />
    );
  }

  return (
    <LinearProgress
      value={value}
      indeterminate={indeterminate}
      showPercentage={showPercentage}
      animationVariant={animationVariant}
      formatPercentage={formatPct}
      trackClassName={trackClassName}
      fillClassName={fillClassName}
      linearHeight={linearHeight}
      ariaLabel={computedAriaLabel}
      labelPosition={defaultLabelPosition as LinearLabelPosition}
      className={className}
    />
  );
});

