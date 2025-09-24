import { type ReactNode } from "react";
import { cn } from "../../../utils/cn";

export type ClusterSpacing = "none" | "small" | "normal" | "large";
export type ClusterAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type ClusterJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface ClusterProps {
  spacing?: ClusterSpacing;
  align?: ClusterAlign;
  justify?: ClusterJustify;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}

const spacingClasses: Record<ClusterSpacing, string> = {
  none: "gap-0",
  small: "gap-2",
  normal: "gap-4",
  large: "gap-8",
};

const alignClasses: Record<ClusterAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClasses: Record<ClusterJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export function Cluster({
  spacing = "normal",
  align = "center",
  justify = "start",
  wrap = true,
  className,
  children,
}: ClusterProps) {
  return (
    <div
      className={cn(
        "flex",
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap ? "flex-wrap" : "flex-nowrap",
        className
      )}
    >
      {children}
    </div>
  );
}
