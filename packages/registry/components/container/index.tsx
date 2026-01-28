import { cn } from '../../../../utils/cn';
import * as React from "react";

export type ContainerSize = "small" | "normal" | "large" | "full" | "readable";
export type ContainerPadding = "none" | "small" | "normal" | "large" | "xl";
export type MaxWidth = "sm" | "md" | "lg" | "xl" | "full" | string; 

interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  center?: boolean;
  padding?: ContainerPadding;
  maxWidth?: MaxWidth;
  responsive?: boolean;
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  small: "max-w-sm",
  normal: "max-w-md",
  large: "max-w-3xl",
  full: "max-w-full",
  readable: "max-w-prose", // good for long text
};

const paddingClasses: Record<ContainerPadding, string> = {
  none: "p-0",
  small: "p-2",
  normal: "p-4",
  large: "p-6",
  xl: "p-8",
};

const maxWidthClasses: Record<Exclude<MaxWidth, string>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function Container({
  children,
  size = "normal",
  center = true,
  padding = "normal",
  maxWidth,
  responsive = true,
  className,
  ...props
}: ContainerProps) {
  // Handle maxWidth - support both predefined classes and custom values as inline styles
  const maxWidthStyle: React.CSSProperties = {};
  let widthClass = sizeClasses[size];
  
  if (maxWidth) {
    if (typeof maxWidth === 'string' && maxWidth in maxWidthClasses) {
      // Use predefined class
      widthClass = maxWidthClasses[maxWidth as keyof typeof maxWidthClasses];
    } else {
      // Apply custom value as inline style
      if (typeof maxWidth === 'number') {
        maxWidthStyle.maxWidth = `${maxWidth}px`;
      } else {
        maxWidthStyle.maxWidth = maxWidth;
      }
    }
  }

  return (
    <div
      className={cn(
        "w-full",
        widthClass,
        paddingClasses[padding],
        center && "mx-auto",
        responsive && "px-4 sm:px-6 lg:px-8",
        className
      )}
      style={maxWidthStyle}
      {...props}
    >
      {children}
    </div>
  );
}
 