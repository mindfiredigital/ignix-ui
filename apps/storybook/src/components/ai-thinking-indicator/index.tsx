import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { Spinner } from '../spinner';

const thinkingIndicatorVariants = cva(
  'inline-flex items-center gap-2 rounded-full border transition-colors',
  {
    variants: {
      variant: {
        default: "bg-background border-border text-foreground px-3 py-2",
        dark: "bg-[var(--color-dark-dropdown-bg)] border-[var(--color-dark-dropdown-border)] text-[var(--color-dark-dropdown-text)] px-3 py-2",
        glass: "bg-[var(--color-glass-bg)] border-[var(--color-glass-border)] backdrop-blur-xl backdrop-saturate-150 shadow-[var(--color-glass-shadow)] text-[var(--color-glass-text)] hover:bg-[var(--color-glass-hover)] transition-all duration-200 px-3 py-2",
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

type IndicatorSize = 'sm' | 'md' | 'lg';

const dotSizeMap: Record<IndicatorSize, number> = { sm: 4, md: 6, lg: 8 };
const iconSizeMap: Record<IndicatorSize, number> = { sm: 16, md: 20, lg: 24 };
const glyphSizeMap: Record<IndicatorSize, number> = { sm: 16, md: 20, lg: 26 };
const ringSizeMap: Record<IndicatorSize, number> = { sm: 16, md: 20, lg: 24 };
const ringThicknessMap: Record<IndicatorSize, number> = { sm: 2, md: 2, lg: 3 };
const barsSizeMap: Record<IndicatorSize, number> = { sm: 16, md: 20, lg: 24 };

export interface AIThinkingIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
  VariantProps<typeof thinkingIndicatorVariants> {
  type?: 'dots' | 'pulse' | 'wave' | 'skeleton' | 'sparkle' | 'bloom' | 'ring' | 'bars';
  label?: string;
  sound?: boolean;
  soundUrl?: string;
}

const Dots = ({ size }: { size: IndicatorSize }) => {
  const dotSize = dotSizeMap[size];
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full bg-current"
          style={{ width: dotSize, height: dotSize }}
          animate={{ y: [0, -dotSize, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

const Pulse = ({ size }: { size: IndicatorSize }) => {
  const dotSize = dotSizeMap[size] * 1.5;
  return (
    <motion.span
      className="rounded-full bg-current"
      style={{ width: dotSize, height: dotSize }}
      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
};

const Wave = ({ size }: { size: IndicatorSize }) => {
  const barWidth = dotSizeMap[size] * 0.6;
  const barHeight = dotSizeMap[size] * 2.5;
  return (
    <div className="flex items-end gap-0.5" style={{ height: barHeight }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="rounded-sm bg-current"
          style={{ width: barWidth }}
          animate={{ height: [barHeight * 0.3, barHeight, barHeight * 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

const Skeleton = ({ size }: { size: IndicatorSize }) => {
  const height = size === 'sm' ? 8 : size === 'lg' ? 14 : 10;
  return (
    <div className="flex flex-col gap-1 w-24">
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="rounded bg-current opacity-20"
          style={{ height, width: i === 1 ? '60%' : '100%' }}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

const Sparkle = ({ size }: { size: IndicatorSize }) => {
  const px = iconSizeMap[size];
  return (
    <motion.span
      className="inline-flex"
      animate={{
        rotate: [0, 20, -10, 0],
        scale: [1, 1.15, 0.95, 1],
        color: ['#4285F4', '#9B72CB', '#D96570', '#F2A600', '#4285F4'],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Sparkles size={px} strokeWidth={0} fill="currentColor" />
    </motion.span>
  );
};

const BLOOM_GLYPH = String.fromCharCode(0x273b);

const Bloom = ({ size }: { size: IndicatorSize }) => {
  const px = glyphSizeMap[size];
  return (
    <motion.span
      className="inline-block leading-none select-none text-[#D97757]"
      style={{ fontSize: px }}
      animate={{ rotate: 360, scale: [1, 1.12, 1] }}
      transition={{
        rotate: { duration: 1.6, repeat: Infinity, ease: 'linear' },
        scale: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
      }}
      aria-hidden="true"
    >
      {BLOOM_GLYPH}

    </motion.span>
  );
};

const Ring = ({ size }: { size: IndicatorSize }) => (
  <Spinner
    size={ringSizeMap[size]}
    thickness={ringThicknessMap[size]}
    color="border-current"
  />
);

const Bars = ({ size }: { size: IndicatorSize }) => {
  const px = barsSizeMap[size];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: px, height: px }}
    >
      <Spinner variant="bars" size={px} color="bg-current" />
    </span>
  );
};

const indicatorByType: Record<
  NonNullable<AIThinkingIndicatorProps['type']>,
  React.FC<{ size: IndicatorSize }>
> = {
  dots: Dots,
  pulse: Pulse,
  wave: Wave,
  skeleton: Skeleton,
  sparkle: Sparkle,
  bloom: Bloom,
  ring: Ring,
  bars: Bars,
};

const AIThinkingIndicator = React.forwardRef<HTMLDivElement, AIThinkingIndicatorProps>(
  (
    { className, variant, size = 'md', type = 'dots', label, sound = false, soundUrl, ...props },
    ref
  ) => {
    const resolvedSize = size ?? 'md';
    const Indicator = indicatorByType[type];

    React.useEffect(() => {
      if (!sound || !soundUrl) return;
      const audio = new Audio(soundUrl);
      void audio.play().catch(() => {/* ignore */ });
    }, [sound, soundUrl]);

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label ?? 'Thinking'}
        className={cn(thinkingIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        <Indicator size={resolvedSize} />
        {label && <span>{label}</span>}
      </div>
    );
  }
);

AIThinkingIndicator.displayName = 'AIThinkingIndicator';

export { AIThinkingIndicator, thinkingIndicatorVariants };
