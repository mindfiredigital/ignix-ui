"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarSeries {
  name: string;
  data: BarDataPoint[];
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

export interface AnimatedBarChartProps extends VariantProps<typeof chartVariants> {
  data: BarDataPoint[];
  series?: BarSeries[];
  title?: string;
  subtitle?: string;
  height?: number;
  showXLabels?: boolean;
  showYLabels?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showValues?: boolean;
  barRadius?: number;
  defaultColor?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  "var(--ifm-color-primary)",  
  "var(--info)",                
  "var(--success-light)",      
  "var(--warning-light)",      
  "var(--label-violet)",       
  "var(--label-rose)",         
];

export const AnimatedBarChart = React.forwardRef<HTMLDivElement, AnimatedBarChartProps>(
  (
    {
      data,
      series,
      title,
      subtitle,
      height = 280,
      showXLabels = true,
      showYLabels = true,
      showGrid = true,
      showLegend = true,
      showValues = false,
      barRadius = 4,
      defaultColor,
      variant = "default",
      className,
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: "-60px" });
    const [hoveredBar, setHoveredBar] = React.useState<number | null>(null);
    const [svgWidth, setSvgWidth] = React.useState(600);

    React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver(() => setSvgWidth(el.clientWidth));
      ro.observe(el);
      setSvgWidth(el.clientWidth);
      return (): void => ro.disconnect();
    }, []);

    const isGrouped = Boolean(series && series.length > 0);
    const effectiveData = isGrouped && series && series[0] ? series[0].data : data;
    const numBars = effectiveData.length;

    const PAD_LEFT = showYLabels ? 52 : 12;
    const PAD_RIGHT = 16;
    const PAD_TOP = 20;
    const PAD_BOTTOM = showXLabels ? 40 : 12;

    const svgW = Math.max(svgWidth, 120);
    const svgH = height;
    const chartW = svgW - PAD_LEFT - PAD_RIGHT;
    const chartH = svgH - PAD_TOP - PAD_BOTTOM;

    const allValues = isGrouped && series
      ? series.flatMap((s) => s.data.map((d) => d.value))
      : data.map((d) => d.value);
    const hasData = allValues.length > 0 && numBars > 0;
    const rawMax = hasData ? Math.max(...allValues) : 0;
    const yMax = hasData ? Math.ceil(rawMax * 1.1) || 10 : 100;
    const yMin = 0;

    const Y_TICKS = 5;
    const yTicks = Array.from({ length: Y_TICKS }, (_, i) =>
      Math.round((yMax / (Y_TICKS - 1)) * (Y_TICKS - 1 - i))
    );

    const numGroups = isGrouped && series ? series.length : 1;
    const totalBarSlotWidth = numBars > 0 ? chartW / numBars : 0;
    const barGroupPad = totalBarSlotWidth * 0.25;
    const barGroupWidth = totalBarSlotWidth - barGroupPad;
    const individualBarWidth = numGroups > 0 ? barGroupWidth / numGroups : 0;

    const barX = (barIndex: number, seriesIndex = 0): number =>
      PAD_LEFT + barIndex * totalBarSlotWidth + barGroupPad / 2 + seriesIndex * individualBarWidth;

    const barHeight = (v: number): number => ((v - yMin) / (yMax - yMin || 1)) * chartH;
    const barY = (v: number): number => PAD_TOP + chartH - barHeight(v);

    const textColor = variant === "glass" || variant === "dark"
      ? "fill-white/60"
      : "fill-neutral-400 dark:fill-neutral-500";
    const gridColor = variant === "glass" || variant === "dark"
      ? "stroke-white/10"
      : "stroke-neutral-200 dark:stroke-neutral-700";

    return (
      <div
        ref={(node): void => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(chartVariants({ variant }), "p-5", className)}
      >
        {(title || subtitle) && (
          <div className="mb-3">
            {title && (
              <p className={cn(
                "text-sm font-bold tracking-tight",
                variant === "glass" || variant === "dark" ? "text-white" : "text-neutral-800 dark:text-neutral-100"
              )}>{title}</p>
            )}
            {subtitle && (
              <p className={cn(
                "text-xs mt-0.5",
                variant === "glass" || variant === "dark" ? "text-white/60" : "text-neutral-500"
              )}>{subtitle}</p>
            )}
          </div>
        )}

        <svg
          width="100%"
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="overflow-visible"
        >
          {showGrid && yTicks.map((tick, i) => (
            <line
              key={i}
              x1={PAD_LEFT}
              y1={barY(tick)}
              x2={svgW - PAD_RIGHT}
              y2={barY(tick)}
              strokeWidth={1}
              className={gridColor}
              strokeDasharray="4 4"
            />
          ))}

          {showYLabels && yTicks.map((tick, i) => (
            <text
              key={i}
              x={PAD_LEFT - 8}
              y={barY(tick)}
              dominantBaseline="middle"
              textAnchor="end"
              fontSize={10}
              className={textColor}
            >
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          ))}

          {/* Bars */}
          {isGrouped && series
            ? series.map((s, si) =>
              s.data.map((point, bi) => {
                const color = s.color ?? defaultColor ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
                const bh = barHeight(point.value);
                const by = barY(point.value);
                const bx = barX(bi, si);
                const isHovered = hoveredBar === bi * 100 + si;
                return (
                  <g key={`${si}-${bi}`}>
                    <motion.rect
                      x={bx}
                      y={by}
                      width={individualBarWidth - 2}
                      height={bh}
                      rx={barRadius}
                      ry={barRadius}
                      fill={color}
                      opacity={hoveredBar !== null && !isHovered ? 0.5 : 1}
                      initial={{ scaleY: 0, originY: 1 }}
                      animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.6, delay: bi * 0.05 + si * 0.1, ease: "easeOut" }}
                      style={{ transformOrigin: `${bx}px ${PAD_TOP + chartH}px` }}
                      onMouseEnter={(): void => setHoveredBar(bi * 100 + si)}
                      onMouseLeave={(): void => setHoveredBar(null)}
                      className="cursor-pointer"
                    />
                    {isHovered && (
                      <motion.rect
                        x={bx - 1}
                        y={by - 1}
                        width={individualBarWidth}
                        height={bh + 1}
                        rx={barRadius + 1}
                        ry={barRadius + 1}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        opacity={0.5}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                      />
                    )}
                  </g>
                );
              })
            )
            : data.map((point, bi) => {
              const color = point.color ?? defaultColor ?? DEFAULT_COLORS[bi % DEFAULT_COLORS.length];
              const bh = barHeight(point.value);
              const by = barY(point.value);
              const bx = barX(bi);
              const isHovered = hoveredBar === bi;
              return (
                <g key={bi}>
                  <motion.rect
                    x={bx}
                    y={by}
                    width={barGroupWidth}
                    height={bh}
                    rx={barRadius}
                    ry={barRadius}
                    fill={color}
                    opacity={hoveredBar !== null && !isHovered ? 0.55 : 1}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.6, delay: bi * 0.07, ease: "easeOut" }}
                    style={{ transformOrigin: `${bx}px ${PAD_TOP + chartH}px` }}
                    onMouseEnter={(): void => setHoveredBar(bi)}
                    onMouseLeave={(): void => setHoveredBar(null)}
                    className="cursor-pointer"
                  />
                  {showValues && (
                    <motion.text
                      x={bx + barGroupWidth / 2}
                      y={by - 6}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={600}
                      className={textColor}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: bi * 0.07 + 0.6 }}
                    >
                      {point.value >= 1000 ? `${(point.value / 1000).toFixed(1)}k` : point.value}
                    </motion.text>
                  )}
                </g>
              );
            })}

          {/* X Labels */}
          {showXLabels && effectiveData.map((point, bi) => (
            <text
              key={bi}
              x={barX(bi) + barGroupWidth / 2}
              y={svgH - PAD_BOTTOM + 18}
              textAnchor="middle"
              fontSize={10}
              className={textColor}
            >
              {point.label}
            </text>
          ))}

          {/* Empty state */}
          {numBars === 0 && (
            <text
              x={PAD_LEFT + chartW / 2}
              y={PAD_TOP + chartH / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              className={textColor}
            >
              No data available
            </text>
          )}
        </svg>

        {/* Legend (series mode) */}
        {showLegend && isGrouped && series && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {series.map((s, si) => {
              const color = s.color ?? defaultColor ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
              return (
                <div key={si} className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  <span className={cn(
                    "text-xs font-medium",
                    variant === "glass" || variant === "dark" ? "text-white/70" : "text-neutral-500 dark:text-neutral-400"
                  )}>{s.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

AnimatedBarChart.displayName = "AnimatedBarChart";
