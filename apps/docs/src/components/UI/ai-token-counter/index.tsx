import * as React from "react";
import { Cpu, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../../utils/cn";
import { ProgressIndicator } from "../progress-indicator";

export interface AITokenCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  inputTokens?: number;
  outputTokens?: number;
  maxTokens?: number;
  mode?: "bar" | "circular" | "compact" | "detailed";
  variant?: "default" | "dark" | "glass" | "minimal";
  label?: string;
  animate?: boolean;
}

function AnimatedCount({ value, animate = true }: { value: number; animate?: boolean }) {
  const [displayVal, setDisplayVal] = React.useState(value);

  React.useEffect(() => {
    if (!animate) {
      setDisplayVal(value);
      return;
    }

    const startVal = displayVal;
    const endVal = value;
    if (startVal === endVal) return;

    const duration = 400; 
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress); 
      const current = Math.floor(startVal + (endVal - startVal) * ease);

      setDisplayVal(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, animate]);

  return <span>{displayVal.toLocaleString()}</span>;
}

const AITokenCounter = React.forwardRef<HTMLDivElement, AITokenCounterProps>(
  (
    {
      className,
      inputTokens = 0,
      outputTokens = 0,
      maxTokens = 4096,
      mode = "detailed",
      variant = "default",
      label,
      animate = true,
      ...props
    },
    ref
  ) => {
    const totalTokens = inputTokens + outputTokens;
    const percentage = Math.min((totalTokens / maxTokens) * 100, 100);

    const isDarkBg = variant === "dark" || variant === "glass";
    const labelColor = isDarkBg
      ? "text-white/60"
      : "text-neutral-400 dark:text-neutral-500";
    const valueColor = isDarkBg
      ? "text-white"
      : "text-neutral-850 dark:text-neutral-200";
    const borderColor = isDarkBg
      ? "border-white/10"
      : "border-neutral-150 dark:border-neutral-800/60";

    const getThresholdMeta = (pct: number) => {
      const isDark = variant === "dark";
      const isGlass = variant === "glass";

      if (pct < 60) {
        return {
          colorClass: isDark ? "text-emerald-400" : isGlass ? "text-emerald-300" : "text-emerald-600 dark:text-emerald-400",
          progressColor: "bg-emerald-500 dark:bg-emerald-500",
          bgClass: isDark
            ? "bg-emerald-950/30 border-emerald-900/50"
            : isGlass
              ? "bg-emerald-950/20 border-white/10 text-emerald-300"
              : "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/20",
          alertLabel: "Optimal usage",
          icon: <CheckCircle2 size={12} className="text-emerald-500" />,
        };
      } else if (pct < 85) {
        return {
          colorClass: isDark ? "text-orange-400" : isGlass ? "text-orange-300" : "text-orange-600 dark:text-orange-400",
          progressColor: "bg-orange-500 dark:bg-orange-500",
          bgClass: isDark
            ? "bg-orange-950/30 border-orange-900/50"
            : isGlass
              ? "bg-orange-950/20 border-white/10 text-orange-300"
              : "bg-orange-50/50 border-orange-100 dark:bg-orange-950/10 dark:border-orange-900/20",
          alertLabel: "Moderate usage warning",
          icon: <AlertCircle size={12} className="text-orange-500" />,
        };
      } else {
        return {
          colorClass: isDark ? "text-rose-400" : isGlass ? "text-rose-300" : "text-rose-600 dark:text-rose-400",
          progressColor: "bg-rose-500 dark:bg-rose-500",
          bgClass: isDark
            ? "bg-rose-950/30 border-rose-900/50"
            : isGlass
              ? "bg-rose-950/20 border-white/10 text-rose-300"
              : "bg-rose-50/50 border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/20",
          alertLabel: "Token limit warning!",
          icon: <AlertCircle size={12} className="text-rose-500 animate-pulse" />,
        };
      }
    };

    const meta = getThresholdMeta(percentage);

    if (mode === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border shadow-sm select-none",
            variant === "default" && "bg-white border-neutral-200 text-neutral-850 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100",
            variant === "dark" && "bg-neutral-950 border-neutral-900 text-white",
            variant === "glass" && "bg-white/10 border-white/20 backdrop-blur-md text-white",
            variant === "minimal" && "bg-transparent border-transparent shadow-none px-0 text-neutral-855 dark:text-neutral-200",
            className
          )}
          {...props}
        >
          <Cpu size={12} className={cn("flex-shrink-0", meta.colorClass)} />
          {label && <span className="opacity-80">{label}:</span>}
          <span className={cn("font-mono", valueColor)}>
            <AnimatedCount value={totalTokens} animate={animate} />/
            <AnimatedCount value={maxTokens} animate={animate} />
          </span>
        </div>
      );
    }

    if (mode === "circular") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-4 p-4 border rounded-2xl shadow-sm transition-all select-none",
            variant === "default" && "bg-white border-neutral-200 text-neutral-855 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100",
            variant === "dark" && "bg-neutral-955 border-neutral-900 text-white",
            variant === "glass" && "bg-white/10 border-white/20 backdrop-blur-md text-white",
            variant === "minimal" && "bg-transparent border-transparent shadow-none p-0 text-neutral-855 dark:text-neutral-200",
            className
          )}
          {...props}
        >
          <div className="flex-shrink-0 flex items-center justify-center">
            <ProgressIndicator
              type="circular"
              value={percentage}
              size={56}
              strokeWidth={5}
              fillClassName={meta.progressColor}
              trackClassName={variant === "glass" ? "bg-white/10" : "bg-neutral-100 dark:bg-neutral-800"}
              showPercentage
            />
          </div>
          <div className="flex flex-col min-w-0">
            {label && <span className={cn("text-[10px] font-bold uppercase tracking-wider truncate", labelColor)}>{label}</span>}
            <span className={cn("text-sm font-semibold mt-0.5 font-mono", valueColor)}>
              <AnimatedCount value={totalTokens} animate={animate} /> / <AnimatedCount value={maxTokens} animate={animate} />
            </span>
            <span className={cn("text-[10px] font-semibold mt-0.5", meta.colorClass)}>
              {meta.alertLabel}
            </span>
          </div>
        </div>
      );
    }

    if (mode === "bar") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col space-y-2 p-4 border rounded-2xl shadow-sm transition-all select-none",
            variant === "default" && "bg-white border-neutral-200 text-neutral-855 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100",
            variant === "dark" && "bg-neutral-955 border-neutral-900 text-white",
            variant === "glass" && "bg-white/10 border-white/20 backdrop-blur-md text-white",
            variant === "minimal" && "bg-transparent border-transparent shadow-none p-0 text-neutral-855 dark:text-neutral-200",
            className
          )}
          {...props}
        >
          <div className="flex justify-between items-center text-xs font-semibold">
            {label ? <span className={cn("truncate", labelColor)}>{label}</span> : <span className={cn("opacity-80", labelColor)}>Token usage</span>}
            <span className={cn("font-mono", valueColor)}>
              <AnimatedCount value={totalTokens} animate={animate} /> / <AnimatedCount value={maxTokens} animate={animate} />
            </span>
          </div>
          <ProgressIndicator
            type="linear"
            value={percentage}
            linearHeight={6}
            fillClassName={meta.progressColor}
            trackClassName={variant === "glass" ? "bg-white/10" : "bg-neutral-100 dark:bg-neutral-800"}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-4 p-5 border rounded-2xl shadow-sm transition-all select-none",
          variant === "default" && "bg-white border-neutral-200 text-neutral-850 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100",
          variant === "dark" && "bg-neutral-955 border-neutral-900 text-white",
          variant === "glass" && "bg-white/10 border-white/20 backdrop-blur-md text-white",
          variant === "minimal" && "bg-transparent border-transparent shadow-none p-0 text-neutral-855 dark:text-neutral-200",
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-start min-w-0">
          <div className="flex flex-col min-w-0">
            {label ? (
              <span className={cn("text-sm font-bold truncate", valueColor)}>{label}</span>
            ) : (
              <span className={cn("text-xs font-bold uppercase tracking-wider", labelColor)}>
                Token Ingestion
              </span>
            )}
            <span className={cn("text-[10px] mt-0.5", labelColor)}>
              Limit Context: <AnimatedCount value={maxTokens} animate={animate} /> tokens
            </span>
          </div>
          <div className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors", meta.bgClass)}>
            {meta.icon}
            <span>{percentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className={cn("grid grid-cols-3 gap-2 py-1 text-center font-mono border-t border-b my-1 py-3", borderColor)}>
          <div className="flex flex-col">
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", labelColor)}>Input</span>
            <span className={cn("text-sm font-bold mt-1", valueColor)}>
              <AnimatedCount value={inputTokens} animate={animate} />
            </span>
          </div>
          <div className={cn("flex flex-col border-l border-r", borderColor)}>
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", labelColor)}>Output</span>
            <span className={cn("text-sm font-bold mt-1", valueColor)}>
              <AnimatedCount value={outputTokens} animate={animate} />
            </span>
          </div>
          <div className="flex flex-col">
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", labelColor)}>Total</span>
            <span className={cn("text-sm font-bold mt-1", meta.colorClass)}>
              <AnimatedCount value={totalTokens} animate={animate} />
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <ProgressIndicator
            type="linear"
            value={percentage}
            linearHeight={6}
            fillClassName={meta.progressColor}
            trackClassName={variant === "glass" ? "bg-white/10" : "bg-neutral-100 dark:bg-neutral-800"}
          />
        </div>
      </div>
    );
  }
);

AITokenCounter.displayName = "AITokenCounter";

export { AITokenCounter };
