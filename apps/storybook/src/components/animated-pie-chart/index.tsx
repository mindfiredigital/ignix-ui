"use client";

import * as React from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

export interface PieDataPoint {
  label: string;
  value: number;
  color?: string;
}

const chartVariants = cva(
  "relative w-full rounded-2xl overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm",
        dark: "bg-neutral-950 border border-neutral-800 shadow-lg",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl",
        minimal: "bg-transparent border-transparent shadow-none",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface AnimatedPieChartProps extends VariantProps<typeof chartVariants> {
  data: PieDataPoint[];
  title?: string;
  subtitle?: string;
  radius?: number;
  donutRatio?: number;
  centerLabel?: string;
  centerSubLabel?: string;
  showLegend?: boolean;
  showPercentages?: boolean;
  animate?: boolean;
  className?: string;
}


const DEFAULT_COLORS = [
  "var(--ifm-color-primary)",    
  "var(--info)",                
  "var(--success-light)",       
  "var(--warning-light)",       
  "var(--label-violet)",        
  "var(--label-rose)",          
  "var(--info-light)",        
  "var(--priority-high)", 
];


function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
) {
  const safeEnd = Math.min(endAngle, startAngle + 359.99);
  const outerStart = polarToCartesian(cx, cy, outerR, safeEnd);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, safeEnd);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
  const large = safeEnd - startAngle > 180 ? 1 : 0;

  if (innerR === 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${outerEnd.x} ${outerEnd.y}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${outerStart.x} ${outerStart.y}`,
      "Z",
    ].join(" ");
  }
  return [
    `M ${outerEnd.x} ${outerEnd.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${outerStart.x} ${outerStart.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}


export const AnimatedPieChart = React.forwardRef<HTMLDivElement, AnimatedPieChartProps>(
  (
    {
      data,
      title,
      subtitle,
      radius = 110,
      donutRatio = 0,
      centerLabel,
      centerSubLabel,
      showLegend = true,
      showPercentages = false,
      animate = true,
      variant = "default",
      className,
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: "-60px" });
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [tooltip, setTooltip] = React.useState<{ x: number; y: number; item: PieDataPoint; pct: number } | null>(null);

    const textColor = variant === "glass" || variant === "dark"
      ? "text-white/70"
      : "text-neutral-500 dark:text-neutral-400";

    const validData = (data || []).filter(
      (d) => typeof d.value === "number" && Number.isFinite(d.value) && d.value > 0
    );
    const total = validData.reduce((sum, d) => sum + d.value, 0);

    if (total <= 0) {
      return (
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node!);
            else if (ref) ref.current = node;
          }}
          className={cn(chartVariants({ variant }), "p-5", className)}
        >
          {(title || subtitle) && (
            <div className="mb-4">
              {title && (
                <p className={cn(
                  "text-sm font-bold tracking-tight",
                  variant === "glass" || variant === "dark" ? "text-white" : "text-neutral-800 dark:text-neutral-100"
                )}>{title}</p>
              )}
              {subtitle && (
                <p className={cn("text-xs mt-0.5", textColor)}>{subtitle}</p>
              )}
            </div>
          )}
          <div className="flex items-center justify-center h-48 text-sm text-neutral-400 dark:text-neutral-500">
            No data available
          </div>
        </div>
      );
    }

    const innerR = donutRatio > 0 ? radius * donutRatio : 0;
    const cx = radius + 8;
    const cy = radius + 8;
    const svgSize = (radius + 8) * 2;

    let cumAngle = 0;
    const slices = validData.map((d, i) => {
      const angle = (d.value / total) * 360;
      const start = cumAngle;
      cumAngle += angle;
      return {
        ...d,
        startAngle: start,
        endAngle: cumAngle,
        color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        pct: (d.value / total) * 100,
      };
    });

    const handleMouseEnter = (e: React.MouseEvent, index: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setHoveredIndex(index);
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        item: validData[index],
        pct: slices[index].pct,
      });
    };

    const handleMouseMove = (e: React.MouseEvent, _index: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTooltip((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
    };

    const handleSliceFocus = (index: number) => {
      const midAngle = (slices[index].startAngle + slices[index].endAngle) / 2;
      const labelR = innerR > 0 ? (radius + innerR) / 2 : radius * 0.7;
      const pos = polarToCartesian(cx, cy, labelR, midAngle);
      setHoveredIndex(index);
      setTooltip({
        x: pos.x,
        y: pos.y,
        item: validData[index],
        pct: slices[index].pct,
      });
    };

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node!);
          else if (ref) ref.current = node;
        }}
        className={cn(chartVariants({ variant }), "p-5", className)}
      >
        
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <p className={cn(
                "text-sm font-bold tracking-tight",
                variant === "glass" || variant === "dark" ? "text-white" : "text-neutral-800 dark:text-neutral-100"
              )}>{title}</p>
            )}
            {subtitle && (
              <p className={cn("text-xs mt-0.5", textColor)}>{subtitle}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <svg
              width={svgSize}
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="overflow-visible"
            >
              {slices.map((slice, i) => {
                const isHovered = hoveredIndex === i;
                const scaleVal = isHovered ? 1.06 : 1;
                return (
                  <motion.path
                    key={i}
                    d={describeArc(cx, cy, radius, innerR, slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    stroke={variant === "glass" || variant === "dark" ? "rgba(0,0,0,0.3)" : "#fff"}
                    strokeWidth={2}
                    tabIndex={0}
                    role="graphics-symbol"
                    aria-label={`${slice.label}: ${slice.value.toLocaleString()} (${slice.pct.toFixed(1)}%)`}
                    initial={animate ? { scale: 0, opacity: 0 } : { scale: scaleVal, opacity: 1 }}
                    animate={inView
                      ? { scale: scaleVal, opacity: 1 }
                      : animate ? { scale: 0, opacity: 0 } : { scale: scaleVal, opacity: 1 }
                    }
                    transition={animate ? { duration: 0.5, delay: i * 0.08, ease: "backOut" } : { duration: 0 }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                    onMouseEnter={(e) => handleMouseEnter(e, i)}
                    onMouseMove={(e) => handleMouseMove(e, i)}
                    onMouseLeave={() => { setHoveredIndex(null); setTooltip(null); }}
                    onFocus={() => handleSliceFocus(i)}
                    onBlur={() => { setHoveredIndex(null); setTooltip(null); }}
                    className="cursor-pointer outline-none focus-visible:stroke-neutral-900 dark:focus-visible:stroke-white focus-visible:stroke-[3]"
                  />
                );
              })}

              {showPercentages && slices.map((slice, i) => {
                if (slice.pct < 6) return null;
                const midAngle = (slice.startAngle + slice.endAngle) / 2;
                const labelR = innerR > 0 ? (radius + innerR) / 2 : radius * 0.65;
                const pos = polarToCartesian(cx, cy, labelR, midAngle);
                return (
                  <motion.text
                    key={i}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="#fff"
                    initial={animate ? { opacity: 0 } : { opacity: 1 }}
                    animate={inView
                      ? { opacity: 1 }
                      : animate ? { opacity: 0 } : { opacity: 1 }
                    }
                    transition={animate ? { delay: i * 0.08 + 0.5 } : { duration: 0 }}
                  >
                    {slice.pct.toFixed(1)}%
                  </motion.text>
                );
              })}
            </svg>

            {donutRatio > 0 && (centerLabel || centerSubLabel) && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                {centerLabel && (
                  <p className={cn(
                    "text-lg font-bold",
                    variant === "glass" || variant === "dark" ? "text-white" : "text-neutral-800 dark:text-neutral-100"
                  )}>
                    {centerLabel}
                  </p>
                )}
                {centerSubLabel && (
                  <p className={cn("text-xs", textColor)}>{centerSubLabel}</p>
                )}
              </div>
            )}
          </div>

          {showLegend && (
            <div className="flex flex-col gap-2 min-w-[130px]">
              {slices.map((slice, i) => (
                <motion.button
                  key={i}
                  type="button"
                  className="flex items-center gap-2 cursor-pointer select-none text-left bg-transparent border-0 p-0 rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400"
                  aria-label={`${slice.label}: ${slice.value.toLocaleString()} (${slice.pct.toFixed(1)}%)`}
                  initial={animate ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                  animate={inView
                    ? { opacity: 1, x: 0 }
                    : animate ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }
                  }
                  transition={animate ? { delay: i * 0.06 + 0.4 } : { duration: 0 }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex(null)}
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full shrink-0 transition-transform duration-150"
                    style={{
                      backgroundColor: slice.color,
                      transform: hoveredIndex === i ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                  <span className={cn(
                    "text-xs font-medium truncate max-w-[120px]",
                    variant === "glass" || variant === "dark" ? "text-white/80" : "text-neutral-600 dark:text-neutral-300"
                  )}>
                    {slice.label}
                  </span>
                  <span className={cn("text-xs ml-auto pl-2", textColor)}>
                    {slice.pct.toFixed(1)}%
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {tooltip && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className={cn(
                "absolute z-10 pointer-events-none px-2.5 py-2 rounded-xl text-xs shadow-xl border",
                variant === "glass" || variant === "dark"
                  ? "bg-neutral-900/90 border-white/10 text-white"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200"
              )}
              style={{ left: tooltip.x + 14, top: tooltip.y - 40 }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: slices[hoveredIndex!]?.color }}
                />
                <span className="font-bold">{tooltip.item.label}</span>
              </div>
              <div className="opacity-70">
                {tooltip.item.value.toLocaleString()} &middot; {tooltip.pct.toFixed(1)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedPieChart.displayName = "AnimatedPieChart";
