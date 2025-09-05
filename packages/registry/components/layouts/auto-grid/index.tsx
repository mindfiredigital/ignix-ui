import React, { ReactNode, CSSProperties } from "react";

type Gap = "none" | "small" | "normal" | "comfortable" | "large" | string;

interface AutoGridProps {
  children: ReactNode;
  minItemWidth?: string; // e.g. "200px"
  maxColumns?: number;   // max number of columns
  gap?: Gap;             // spacing between grid items
  balanced?: boolean;    // balance row heights
  className?: string;
}

const gapMap: Record<Exclude<Gap, string>, string> = {
  none: "0",
  small: "0.5rem",
  normal: "1rem",
  comfortable: "1.5rem",
  large: "2rem",
};

const AutoGrid: React.FC<AutoGridProps> = ({
  children,
  minItemWidth = "200px",
  maxColumns,
  gap = "normal",
  balanced = false,
  className = "",
}) => {
  const computedGap = gapMap[gap as keyof typeof gapMap] || gap;

  const style: CSSProperties = {
    display: "grid",
    gap: computedGap,
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
    alignItems: balanced ? "stretch" : "start",
    maxWidth: maxColumns
      ? `calc(${maxColumns} * ${minItemWidth} + (${maxColumns} - 1) * ${computedGap})`
      : "100%",
  };

  return (
    <div style={style} className={`auto-grid mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default AutoGrid;
