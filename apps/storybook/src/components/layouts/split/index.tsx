import { cn } from "../../../../utils/cn";
import { useRef, useState, useEffect, type ReactNode } from "react";

export type Ratio = "30:70" | "40:60" | "50:50" | "60:40" | "70:30";
export type MobileMode = "stack" | "keep-split" | "reverse";
export type Gap = "none" | "small" | "normal" | "large";

interface SplitProps {
  children: ReactNode;
  ratio?: Ratio;
  mobile?: MobileMode;
  gap?: Gap;
  minWidth?: string;
  resizable?: boolean;
  className?: string;
}

const gapClasses: Record<Gap, string> = {
  none: "gap-0",
  small: "gap-2",
  normal: "gap-4",
  large: "gap-8",
};

export function Split({
  children,
  ratio = "50:50",
  mobile = "keep-split",
  gap = "normal",
  minWidth = "300px",
  resizable = false,
  className,
}: SplitProps) {
  const [sizes, setSizes] = useState(ratio.split(":").map(Number));
  const containerRef = useRef<HTMLDivElement>(null);

  // Update sizes when ratio prop changes
  useEffect(() => {
    setSizes(ratio.split(":").map(Number));
  }, [ratio]);

  const handleDrag = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const total = rect.width;
    const left = e.clientX - rect.left;
    const leftPct = Math.max(10, Math.min(90, (left / total) * 100));
    setSizes([leftPct, 100 - leftPct]);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full",
        gapClasses[gap],
        mobile === "stack" && "flex-col sm:flex-row",
        mobile === "reverse" && "flex-col-reverse sm:flex-row-reverse",
        className
      )}
      style={{ minWidth }}
    >
      {/* Left Panel */}
      <div className="flex-shrink-0" style={{ flexBasis: `${sizes[0]}%` }}>
        {Array.isArray(children) ? children[0] : children}
      </div>

      {/* Optional Resize Handle */}
      {resizable && (
        <div
          className="w-1 cursor-col-resize bg-gray-300 dark:bg-gray-700"
          onMouseDown={() => {
            const move = (ev: MouseEvent) => handleDrag(ev);
            const up = () => {
              document.removeEventListener("mousemove", move);
              document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
          }}
        />
      )}

      {/* Right Panel */}
      <div className="flex-1" style={{ flexBasis: `${sizes[1]}%` }}>
        {Array.isArray(children) ? children[1] : null}
      </div>
    </div>
  );
}

// Helpers for clarity
export function Left({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Right({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
