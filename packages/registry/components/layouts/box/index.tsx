import React from "react";
import clsx from "clsx";

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  width?: "auto" | "small" | "normal" | "large" | "full" | string;
  height?: "auto" | "small" | "normal" | "large" | "screen" | string;
  padding?: "none" | "sm" | "normal" | "lg";
  background?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "subtle" | "medium" | "strong";
  className?: string;
};

const widthMap: Record<string, string> = {
  auto: "w-auto",
  small: "w-32",
  normal: "w-64",
  large: "w-96",
  full: "w-full",
};

const heightMap: Record<string, string> = {
  auto: "h-auto",
  small: "h-16",
  normal: "h-32",
  large: "h-64",
  screen: "h-screen",
};

const paddingMap: Record<string, string> = {
  none: "p-0",
  sm: "p-2",
  normal: "p-4",
  lg: "p-8",
};

const roundedMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const shadowMap: Record<string, string> = {
  none: "shadow-none",
  subtle: "shadow-sm",
  medium: "shadow-md",
  strong: "shadow-lg",
};

export const Box: React.FC<BoxProps> = ({
  children,
  width = "normal",
  height = "auto",
  padding = "normal",
  background = "white",
  rounded = "md",
  shadow = "subtle",
  className,
  ...props
}) => {
  const widthClass = widthMap[width] || width;
  const heightClass = heightMap[height] || height;
  const paddingClass = paddingMap[padding] || padding;
  const roundedClass = roundedMap[rounded] || rounded;
  const shadowClass = shadowMap[shadow] || shadow;
  const bgClass = background ? `bg-${background}` : "";

  return (
    <div
      className={clsx(
        widthClass,
        heightClass,
        paddingClass,
        roundedClass,
        shadowClass,
        bgClass,
        "max-w-full overflow-auto scrollbar-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Box;
