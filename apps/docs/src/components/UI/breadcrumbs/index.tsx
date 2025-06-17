"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

export interface BreadcrumbsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof breadcrumbsVariants> {
  items?: { label: string; href?: string }[];
  separatorIcon?: React.ElementType;
  steps?: string[];
  currentStep?: number;
}

const breadcrumbsVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
    },
    shape: {
      rectangle: "rounded-md",
      round: "rounded-full",
      pill: "rounded-xl",
      default: "rounded-none",
    },
    variant: {
      text: "text",
      step: "step",
      progress: "progress",
      custom: "custom",
    },
    bgColor: {
      blue: "bg-blue-500 hover:bg-blue-600",
      gray: "bg-gray-300 hover:bg-gray-400",
      green: "bg-green-500 hover:bg-green-600",
      red: "bg-red-500 hover:bg-red-600",
    },
    textColor: {
      white: "text-white",
      black: "text-black",
      gray: "text-gray-600",
      blue: "text-blue-500",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "pill",
    // bgColor: "blue",
    // textColor: "white",
  },
});

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  variant = "text",
  size = "md",
  separatorIcon: SeparatorIcon,
  steps = [],
  currentStep = 0,
  className,
  shape,
  bgColor,
  textColor,
  ...props
}) => {
  return (
    <div className={cn(breadcrumbsVariants({ size }), className)} {...props}>
      {variant === "text" &&
        items.length > 0 &&
        items.map((item, index) => (
          <React.Fragment key={item.label}>
            {item.href ? (
              <a href={item.href} className="text-blue-500 hover:underline">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
            {index < items.length - 1 &&
              (SeparatorIcon ? (
                <SeparatorIcon />
              ) : (
                <span className="mx-2">/</span>
              ))}
          </React.Fragment>
        ))}

      {variant === "step" &&
        steps.length > 0 &&
        steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                "flex items-center",
                index <= currentStep ? "text-blue-500" : "text-gray-500"
              )}
            >
              <span className="rounded-full border-2 p-2 w-8 h-8 flex items-center justify-center">
                {index + 1}
              </span>
              <span className="ml-2">{step}</span>
            </div>
            {index < steps.length - 1 &&
              (SeparatorIcon ? (
                <SeparatorIcon />
              ) : (
                <span className="mx-2">/</span>
              ))}
          </React.Fragment>
        ))}

      {variant === "custom" && items.length > 0 && (
        <div className="flex items-center w-full space-x-2">
          {items.map((step, index) => (
            <React.Fragment key={step.label}>
              <a
                href={step.href || "#"}
                className={cn(
                  "flex items-center px-4 py-2 transition-all duration-300",
                  breadcrumbsVariants({
                    shape,
                    bgColor: index <= currentStep ? bgColor : "gray",
                    textColor: index <= currentStep ? textColor : "gray",
                  })
                )}
              >
                <span className="mr-2">✔</span>
                {step.label}
              </a>
              {index < items.length - 1 &&
                (SeparatorIcon ? (
                  <SeparatorIcon />
                ) : (
                  <span className="mx-2">/</span>
                ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
