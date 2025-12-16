import * as React from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

/* ----------------------------------------
 * Types
 * ------------------------------------- */
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "onChange" | "defaultValue"
    >,
    VariantProps<typeof radioItemVariants> {
  name: string;
  options: RadioOption[];
  value?: string;                // 👈 optional now
  defaultValue?: string;         // 👈 NEW (Radix-style)
  onChange?: (value: string) => void;
  disabled?: boolean;
  labelPosition?: "left" | "right";
  checkedVariant?: "classic" | "surface";
  animationVariant?: "bounce" | "scale" | "pulse" | "glow" | "shake" | "flip" | "nina";
}

/* ----------------------------------------
 * CVA – Radio Item (Outer Circle)
 * ------------------------------------- */
const radioItemVariants = cva(
  "relative inline-flex items-center justify-center rounded-full border-2 bg-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400",
        primary:
          "border-blue-800 data-[state=checked]:bg-blue-800 data-[state=checked]:border-blue-800",
        success:
          "border-success data-[state=checked]:bg-success data-[state=checked]:border-success",
        warning:
          "border-warning data-[state=checked]:bg-warning data-[state=checked]:border-warning",
        danger:
          "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive",
        outline:
          "border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        subtle:
          "border-muted data-[state=checked]:bg-accent data-[state=checked]:border-accent",
        neon:
          "border-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 shadow shadow-pink-500/40",
      },
      disabled: {
        true:
          "cursor-not-allowed border-gray-500 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500 opacity-50",
        false: "",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
);

/* ----------------------------------------
 * CVA – Indicator (Inner Dot)
 * ------------------------------------- */
const radioIndicatorVariants = cva(
  "rounded-full bg-white transition-transform duration-200 scale-0 data-[state=checked]:scale-100",
  {
    variants: {
      size: {
        xs: "h-1 w-1",
        sm: "h-1.5 w-1.5",
        md: "h-2 w-2",
        lg: "h-2.5 w-2.5",
        xl: "h-3 w-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/* ----------------------------------------
 * Motion Variants
 * ------------------------------------- */
export const radioMotionVariants: Record<string, Variants> = {
  bounce: {
    unchecked: { scale: 1 },
    checked: {
      scale: [1, 1.4, 0.9, 1],
      transition: { duration: 0.4 },
    },
  },
  scale: {
    unchecked: { scale: 1 },
    checked: {
      scale: 1.3,
      transition: { type: "spring", stiffness: 300 },
    },
  },
  pulse: {
    unchecked: { boxShadow: "0 0 0 rgba(59,130,246,0)" },
    checked: {
      boxShadow: [
        "0 0 0 rgba(59,130,246,0)",
        "0 0 0 10px rgba(59,130,246,0.4)",
        "0 0 0 rgba(59,130,246,0)",
      ],
      transition: { duration: 0.6 },
    },
  },
  glow: {
    unchecked: { boxShadow: "0 0 0 transparent" },
    checked: {
      boxShadow: "0 0 20px rgba(59,130,246,0.8)",
      transition: { duration: 0.3 },
    },
  },
  shake: {
    unchecked: { x: 0 },
    checked: {
      x: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.4 },
    },
  },
  flip: {
    unchecked: { rotateY: 0 },
    checked: {
      rotateY: 180,
      transition: { duration: 0.5 },
    },
  },
  nina: {
    unchecked: { scale: 1 },
    checked: {
      scale: [1, 0.8, 1.2, 1],
      transition: { duration: 0.35 },
    },
  },
};

/* ----------------------------------------
 * Component
 * ------------------------------------- */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  defaultValue,
  onChange,
  variant = "default",
  size = "md",
  disabled,
  labelPosition = "right",
  checkedVariant = "surface",
  animationVariant = "bounce",
}) => {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState<string>(
    value ??
      defaultValue ??
      options.find((o) => !o.disabled)?.value ??
      ""
  );

  React.useEffect(() => {
    if (isControlled && value !== undefined) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  const currentValue = isControlled ? value : internalValue;

  return (
    <RadixRadio.Root
      name={name}
      value={currentValue}
      onValueChange={(val) => {
        if (!isControlled) {
          setInternalValue(val);
        }
        onChange?.(val);
      }}
      className="flex flex-col gap-2"
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1",
            opt.disabled || disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-muted/50"
          )}
        >
          {labelPosition === "left" && (
            <span className="text-sm font-medium">{opt.label}</span>
          )}

          <motion.div
            variants={radioMotionVariants[animationVariant]}
            initial="unchecked"
            animate={currentValue === opt.value ? "checked" : "unchecked"}
            className="rounded-full"
          >
            <RadixRadio.Item
              value={opt.value}
              disabled={disabled || opt.disabled}
              className={cn(
                radioItemVariants({
                  variant,
                  size,
                  disabled: disabled || opt.disabled,
                })
              )}
            >
              {checkedVariant === "surface" && (
                <RadixRadio.Indicator
                  forceMount
                  className={cn(
                    "flex items-center justify-center",
                    radioIndicatorVariants({ size })
                  )}
                />
              )}
            </RadixRadio.Item>
          </motion.div>

          {labelPosition === "right" && (
            <span className="text-sm font-medium">{opt.label}</span>
          )}
        </label>
      ))}
    </RadixRadio.Root>
  );
};
