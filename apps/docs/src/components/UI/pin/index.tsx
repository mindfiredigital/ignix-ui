import React from "react";
import * as Slot from "@radix-ui/react-slot";
import clsx from "clsx";

type PinPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type PinOffset = "none" | "small" | "normal" | "large" | "xl";
type PinMobile = "relative" | "absolute";
type PinZIndex = "low" | "normal" | "high" | number;

export interface PinProps extends React.HTMLAttributes<HTMLElement> {
  to?: PinPosition;
  offset?: PinOffset;
  mobile?: PinMobile;
  zIndex?: PinZIndex;
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}

export function Pin({
  to = "top-right",
  offset = "normal",
  mobile,
  zIndex = "normal",
  as: Component = Slot.Slot,
  children,
  className,
  ...rest
}: PinProps): React.ReactElement {
  // Position mapping
  const positionMap: Record<PinPosition, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  // Offset mapping (spacing tokens)
  const offsetMap: Record<PinOffset, string> = {
    none: "m-0",
    small: "m-1",
    normal: "m-2",
    large: "m-4",
    xl: "m-6",
  };

  // z-index mapping
  const zIndexMap: Record<Exclude<PinZIndex, number>, string> = {
    low: "z-10",
    normal: "z-20",
    high: "z-50",
  };

  const positionClasses = positionMap[to];
  const offsetClasses = offsetMap[offset];
  const zIndexClasses =
    typeof zIndex === "number" ? `z-[${zIndex}]` : zIndexMap[zIndex];

  // Mobile override
  const mobileClasses =
    mobile === "relative"
      ? "sm:relative sm:static"
      : mobile === "absolute"
      ? "sm:absolute"
      : "";

  const classes = clsx(
    "absolute",
    positionClasses,
    offsetClasses,
    zIndexClasses,
    mobileClasses,
    className
  );

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}

export default Pin;
