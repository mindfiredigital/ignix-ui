import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full border transition-colors',
  {
    variants: {
      variant: {
        default: "bg-background border-border text-foreground px-3 py-1.5",
        dark: "bg-[var(--color-dark-dropdown-bg)] border-[var(--color-dark-dropdown-border)] text-[var(--color-dark-dropdown-text)] px-3 py-1.5",
        glass: "bg-[var(--color-glass-bg)] border-[var(--color-glass-border)] backdrop-blur-xl backdrop-saturate-150 shadow-[var(--color-glass-shadow)] text-[var(--color-glass-text)] hover:bg-[var(--color-glass-hover)] transition-all duration-200 px-3 py-1.5",
        minimal: "bg-transparent border-transparent shadow-none px-0 py-0"
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export type AIStatus = 'idle' | 'thinking' | 'streaming' | 'error' | 'ready';

type IndicatorSize = 'sm' | 'md' | 'lg';

const dotSizeMap: Record<IndicatorSize, number> = { sm: 6, md: 8, lg: 10 };

const STATUS_CONFIG: Record<AIStatus, { label: string; dot: string; text: string }> = {
  idle: { label: 'Idle', dot: 'bg-muted-foreground/50', text: 'text-muted-foreground' },
  thinking: { label: 'Thinking', dot: 'bg-warning', text: 'text-warning' },
  streaming: { label: 'Streaming', dot: 'bg-primary', text: 'text-primary' },
  error: { label: 'Error', dot: 'bg-destructive', text: 'text-destructive' },
  ready: { label: 'Ready', dot: 'bg-success', text: 'text-success' },
};

export interface AIStatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
  VariantProps<typeof statusBadgeVariants> {
  status: AIStatus;
  model?: string;
  label?: string;
}

const StatusDot = ({ status, size }: { status: AIStatus; size: IndicatorSize }) => {
  const dotSize = dotSizeMap[size];
  const dotColor = STATUS_CONFIG[status].dot;
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span
        className={cn('shrink-0 rounded-full', dotColor)}
        style={{ width: dotSize, height: dotSize }}
      />
    );
  }

  if (status === 'streaming') {
    return (
      <span className="relative inline-flex shrink-0" style={{ width: dotSize, height: dotSize }}>
        <motion.span
          className={cn('absolute inline-flex h-full w-full rounded-full', dotColor)}
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <span
          className={cn('relative inline-flex rounded-full', dotColor)}
          style={{ width: dotSize, height: dotSize }}
        />
      </span>
    );
  }

  if (status === 'thinking') {
    return (
      <motion.span
        className={cn('shrink-0 rounded-full', dotColor)}
        style={{ width: dotSize, height: dotSize }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
    );
  }

  if (status === 'error') {
    return (
      <motion.span
        className={cn('shrink-0 rounded-full', dotColor)}
        style={{ width: dotSize, height: dotSize }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 0.6, repeat: 2, ease: 'easeInOut' }}
      />
    );
  }

  return (
    <motion.span
      className={cn('shrink-0 rounded-full', dotColor)}
      style={{ width: dotSize, height: dotSize }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    />
  );
};

const AIStatusBadge = React.forwardRef<HTMLDivElement, AIStatusBadgeProps>(
  ({ className, variant, size = 'md', status, model, label, ...props }, ref) => {
    const resolvedSize = size ?? 'md';
    const config = STATUS_CONFIG[status];
    const displayLabel = label ?? config.label;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={`AI status: ${displayLabel}`}
        className={cn(statusBadgeVariants({ variant, size }), className)}
        {...props}
      >
        <StatusDot status={status} size={resolvedSize} />
        <span className={cn('font-medium', config.text)}>{displayLabel}</span>
        {model && <span className="text-muted-foreground">&middot; {model}</span>}
      </div>
    );
  }
);

AIStatusBadge.displayName = 'AIStatusBadge';

export { AIStatusBadge };
