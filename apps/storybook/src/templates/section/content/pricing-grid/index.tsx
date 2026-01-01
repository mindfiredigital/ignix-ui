import { Check, Star, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { Button } from "../../../../components/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../../../components/card"
import { Typography } from "../../../../components/typography"
import { cn } from "../../../../../utils/cn"
import React, { useMemo, useState } from "react"
import { Switch } from "../../../../components/switch"
import z from "zod"

/* -------------------------------------------------------------------------- */
/*                                ZOD SCHEMAS                                 */
/* -------------------------------------------------------------------------- */
const FeatureSchema = z.object({
  label: z
    .string()
    .min(1, "Feature label is required"),

  available: z.boolean().default(true),

  icon: z.custom<React.ElementType>().optional(),
})

const PlanSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Plan name is required" }),

  price: z
    .string()
    .min(1, { message: "Plan price is required" }),

  highlighted: z.boolean().optional(),

  gradient: z.string().optional(),

  features: z
    .array(FeatureSchema)
    .min(1, { message: "At least one feature is required" }),

  ctaLabel: z.string().optional(),

})

const PricingGridSchema = z.object({
  plans: z
    .array(PlanSchema)
    .min(1, "At least one pricing plan is required"),
})

/* -------------------------------------------------------------------------- */
/*                                INTERFACES                                  */
/* -------------------------------------------------------------------------- */

/** -------------------- Shared / Base -------------------- */

export interface PricingVisualProps {
  variant?: VariantProps<typeof PricingGridVariant>["variant"]
  isHighlighted?: boolean
  modernUI?: "vector" | "basic" | "advance"
}

/** -------------------- Domain Models -------------------- */

export interface Feature {
  label: string
  available?: boolean
  icon?: React.ElementType
}

export interface PlanProps {
  id?: number
  name: string
  icon?: React.ElementType
  price: string
  features: Feature[]
  gradient?: string
  highlighted?: boolean
  ctaLabel?: string
}

/** -------------------- Card Sub-Components -------------------- */

export interface CardPlansProps {
  allowDifferentCardColors?: boolean
  currentPlan?: number
}

export interface CardContentActionProps  extends PricingVisualProps, iPlanProps, CardPlansProps{
  features: Feature[]
  table?: boolean
}

export interface iPlanProps {
  plan: PlanProps
}

export interface CardFooterActionProps extends PricingVisualProps, iPlanProps {
  modernVariant?: "default" | "dark" | "light"
  onCtaClick?: (plan: PlanProps) => void
}

export interface CardHeaderActionProps extends PricingVisualProps, iPlanProps, CardPlansProps {
  pricingBadgePosition?: "none" | "top" | "middle"
}

/** -------------------- Grid -------------------- */
export interface PricingGridProps  extends PricingVisualProps, CardPlansProps{
  title?: string
  description?: string
  plans: PlanProps[]
  variant?: VariantProps<typeof PricingGridVariant>["variant"]
  pricingBadgePosition?: "none" | "top" | "middle"
  className?: string
  animation?: "none"| "fadeIn"| "slideUp"| "scaleIn"| "flipIn"| "bounceIn"| "floatIn"
  interactive?: "none"| "hover"| "press"| "lift"| "tilt"| "glow"
  modernVariant?: "default" | "dark"
  table?: boolean
  toggleOptions?: [ToggleOption, ToggleOption];
  value?: string;
  onValueChange?: (value: string) => void;
  onCtaClick?: (plan: PlanProps) => void
}

export interface ToggleOption<T extends string = string> {
  label: React.ReactNode;
  value: T;
}


export interface PriceProps {
  price: string;
} 

/* -------------------------------------------------------------------------- */
/*                              ANIMATION                                */
/* -------------------------------------------------------------------------- */
const cardAnimations = {
  none: {},
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  slideUp: {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8, rotateX: 15 },
    animate: { opacity: 1, scale: 1, rotateX: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  flipIn: {
    initial: { opacity: 0, rotateY: -90, scale: 0.8 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20,
      duration: 0.8 
    }
  },
  floatIn: {
    initial: { opacity: 0, y: 100, rotateX: 45 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
  }
};

/* -------------------------------------------------------------------------- */
/*                              VARIANT STYLES                                */
/* -------------------------------------------------------------------------- */
const PricingGridVariant = cva("", {
  variants: {
    variant: {
      default:
        "bg-gradient-to-r from-gray-800 via-gray-400 to-gray-500 text-primary-foreground",
      dark:
        "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
      gradient:
        "border border-teal-500 bg-gradient-to-br from-teal-500 to-emerald-500 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const PricingGridPriceVariant = cva("", {
  variants: {
    variant: {
      default: "bg-white text-gray-500",
      dark: "bg-white text-slate-900",
      gradient:
        "bg-white text-gray-900",
    },
    interactive: {
      none: "",
      hover: "hover:scale-[1.02] cursor-pointer",
      press: "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
      lift: "hover:-translate-y-2 hover:scale-[1.02] cursor-pointer",
      tilt: "hover:rotate-1 hover:scale-[1.02] cursor-pointer",
      glow: "hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
    }
  },
  defaultVariants: {
    variant: "default",
    interactive: "lift"
  },
})

const ModernPricingGridVariant = cva("", {
  variants: {
    variant: {
      dark: "bg-black text-white",
      default: "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
      light: "border bg-white text-black"
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const ModernPricingGridGlowVariant = cva("before:absolute before:inset-[-4px] before:rounded-[inherit]", {
  variants: {
    variant: {
      dark: "border border-white/30 before:bg-emerald-400/40 before:blur-2xl before:opacity-70 before:-z-10 before:animate-pulse",
      default: "before:bg-gradient-to-r before:from-purple-500 before:via-indigo-500 before:to-blue-500 opacity:50 before:blur-2xl before:opacity-75 before:-z-10 before:animate-pulse",
      light: "border border-emerald-300"
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const defaultTrioColors = [
  "border border-green-500/50 bg-green-500 p-8 text-white",
  "border border-purple-500/50 bg-purple-500 p-8 text-white",
  "border border-emerald-500/50 bg-emerald-500 p-8 text-white",
]

/* -------------------------------------------------------------------------- */
/*                                UTILITIES                                   */
/* -------------------------------------------------------------------------- */

/**
 * Splits a price string like "49/month" into amount and period.
 */
export const SplitPrice:React.FC<PriceProps> = React.memo(({ price }) => {
  if (!price) {
    return (
      <div className="text-center leading-tight">
        <span className="block text-2xl font-bold">{" "}</span>
        <span className="block text-sm">{" "}</span>
      </div>
    );
  }

  const [amount, period] = price.split("/");

  return (
    <div className="text-center leading-tight">
      <span className="block text-2xl font-bold">{amount}</span>
      <span className="block text-sm">/ {period}</span>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                            CARD SUB-COMPONENTS                             */
/* -------------------------------------------------------------------------- */

/**
 * Card footer with CTA button
 */
export const CardFooterAction: React.FC<CardFooterActionProps> = React.memo(
  ({ variant, isHighlighted, modernUI, modernVariant, plan, onCtaClick }) => {
  
  const handleClick = () => {
    onCtaClick?.(plan)
  }
  
  return (
    <CardFooter className="px-8 pb-10 flex justify-center">
      {modernUI === "advance" ? (
        <Button
          size="wide"
          aria-label={`${plan?.name} plan action`}
          animationVariant="fadeInOut"
          className={`${plan?.gradient}`}
          onClick={handleClick}
        >
          {plan.ctaLabel}
        </Button>
      ) : (
        <Button
          size="wide"  
          aria-label={`${plan?.name} plan action`}       
          animationVariant="fadeInOut"
          className={cn(
            "w-full max-w-[220px] font-semibold transition",
            modernUI === "vector"
              ? isHighlighted
                ? PricingGridPriceVariant({ variant })
                : PricingGridVariant({ variant })
              : modernVariant === "light"
              ? "bg-black text-white"
              : "bg-white text-black"
          )}
          onClick={handleClick}
        >
          {plan.ctaLabel}
        </Button>
      )}
    </CardFooter>
  )
})

/**
 * Card content showing feature list
 */
export const CardContentAction: React.FC<CardContentActionProps> = React.memo(
  ({ features, modernUI, table, plan }) => {
return (
    <CardContent className="px-6 pb-3">
      {table  || modernUI === "basic" ? (<table className="w-full text-left text-md border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4">Feature</th>
            <th className="py-2 px-4">Available</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => {
            const Icon =
              feature?.icon ??
              (feature.available === false ? X : Check);

            return (
              <tr key={i} className="border-t">
                <td className="py-2 px-4 flex items-center gap-3">
                  {plan?.gradient && modernUI ==="advance" ? (
                  <Icon className={`w-5 h-5 text-white ${plan?.gradient}`} aria-hidden="true"/>
                  ): <Icon className="h-5 w-5 mt-0.5" aria-hidden="true"/>}
                  {feature?.label}
                </td>
                <td className="py-2 px-4">
                  {feature.available === false ? "No" : "Yes"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table> ) : ( 
        <ul className="space-y-3 text-md">
          {features.map((feature, i) => {
            const Icon =
              feature?.icon ??
              (feature.available === false ? X : Check)

            return (
              <li key={i} className="flex items-start gap-3">
                {plan?.gradient && modernUI === "advance" ? (
                  <Icon className={`w-5 h-5 text-white ${plan?.gradient}`} aria-hidden="true"/>
                ): <Icon className="h-5 w-5 mt-0.5" aria-hidden="true"/>}
                <span>{feature?.label}</span>
              </li>
            )
          })}
        </ul>
      )}

    </CardContent>
  )
})

/**
 * Card header with plan name and badge
 */
export const CardHeaderAction: React.FC<CardHeaderActionProps>  = React.memo(({
  pricingBadgePosition,
  isHighlighted,
  allowDifferentCardColors,
  plan,
  variant,
  modernUI,
  currentPlan
}) => {
  return (
    <>
      {modernUI === "vector" ? (
        /* ---------------- BASIC ---------------- */
        <CardHeader className="text-center pt-10 pb-6">
          <h3
            className={cn(
              "text-2xl font-semibold uppercase tracking-wide",
              pricingBadgePosition === "top" && "pt-8",
              isHighlighted || allowDifferentCardColors
                ? "text-white"
                : "text-muted-foreground"
            )}
          >
            {plan?.name}
          </h3>

          {pricingBadgePosition === "middle" && (
            <div className="flex justify-center pb-8">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-28 h-28 rounded-full p-[3px]">
                  <div
                    className={cn(
                      "w-full h-full rounded-full bg-primary/30 backdrop-blur-sm flex items-center justify-center",
                      isHighlighted || allowDifferentCardColors
                        ? PricingGridPriceVariant({ variant })
                        : PricingGridVariant({ variant })
                    )}
                  >
                    <div className="text-center">
                      <SplitPrice price={plan.price} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {pricingBadgePosition === "top" && (
            <motion.div
              className="absolute -top-14 left-1/2 -translate-x-1/2 z-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-30 h-30 rounded-full p-[3px]">
                <div
                  className={cn(
                    "w-full h-full rounded-full bg-primary/30 backdrop-blur-sm flex items-center justify-center",
                    isHighlighted || allowDifferentCardColors
                      ? PricingGridPriceVariant({ variant })
                      : PricingGridVariant({ variant })
                  )}
                >
                  <div className="text-center">
                    <SplitPrice price={plan.price} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardHeader>
      ) : modernUI === "basic" ? (
        /* ---------------- BASIC ---------------- */
        <>
          <div className="flex items-center justify-between m-5">
            <div className="flex items-center justify-start gap-2">
              {plan.icon && (
                <div className="flex items-center justify-center w-15 h-15 rounded-full border border-white/30">
                  <plan.icon className={`w-8 h-10 text-white font-small`} />
                </div>
              )}
              <Typography variant="h4" className="font-bold">
                {plan?.name}
              </Typography>
            </div>

           {plan.highlighted && plan.id !== currentPlan && 
              <Star className="w-8 h-8 fill-emerald-500 stroke-emerald-500" />
            }
            { plan.id === currentPlan ? (
              <Button variant="success" size="sm">
                Current Plan
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        /* ---------------- ADVANCE / FALLBACK ---------------- */
        <>
          <div className={`relative z-10 flex flex-col items-center pt-8 pb-4 gap-3`}>
          {plan.icon && (
            <div className={`flex items-center justify-center w-20 h-20 rounded-full border border-white/30 ${plan?.gradient}`}>
              <plan.icon className={`w-10 h-15 text-white font-small`} />
            </div>
          )}

          <h3 className={`text-2xl font-bold tracking-wide ${plan?.gradient} bg-clip-text`}>
            {plan?.name}
          </h3>
          <p className="text-sm text-zinc-800">
            Lorem ipsum dolor sit amet
          </p>
        </div>
        </>
        )}
    </>
  )
})

const ValidationError: React.FC<{ error: string }> = React.memo(({ error }) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mb-6 rounded-lg border border-red-500 bg-red-50 px-4 py-3 text-red-700"
    >
      <strong className="block font-semibold">Configuration Error</strong>
      <span>{error}</span>
    </div>
  )
})

/* -------------------------------------------------------------------------- */
/*                               MAIN GRID                                    */
/* -------------------------------------------------------------------------- */

/**
 * PricingGrid
 *
 * Renders a pricing table with animations, feature comparison,
 * billing toggle, and accessible CTA actions.
 */
const PricingGridContent: React.FC<PricingGridProps> = ({
  title = "Our Pricing Table",
  description = "Choose the plan that fits your needs",
  plans,
  className,
  variant = "dark",
  pricingBadgePosition = "middle",
  allowDifferentCardColors,
  modernUI = "basic",
  animation = "slideUp",
  interactive = "press",
  modernVariant = "dark",
  table,
  toggleOptions = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ],
  onValueChange,
  value,
  currentPlan = 1,
  onCtaClick
}) => {

  const validationResult = PricingGridSchema.safeParse({ plans })

  if (!validationResult.success) {
    const issue = validationResult.error.issues[0]
    const path =
      issue.path.length > 0
        ? issue.path.join(" → ")
        : "Pricing configuration"

    const errorMessage = `${path}: ${issue.message}`

    return <ValidationError error={errorMessage} />
  }

  const [internalValue, setInternalValue] = useState<string | undefined>(
    toggleOptions?.[0]?.value
  );

  const currentValue = value ?? internalValue;

  /**
 * Handles the billing period toggle (e.g. Monthly ↔ Yearly).
 *
 * - Determines the next toggle value based on the current selection
 * - Updates internal state when the component is uncontrolled
 * - Notifies the parent via `onValueChange` when provided
 *
 * Memoized with `useCallback` to avoid unnecessary re-creations
 * when passed to child components.
 */
  const handleToggle = React.useCallback(() => {
    if (!toggleOptions) return;

    const [left, right] = toggleOptions;
    const next = currentValue === left.value ? right.value : left.value;

    setInternalValue(next);
    onValueChange?.(next);
  }, [currentValue, toggleOptions, onValueChange]);

  /**
 * Computes the background / gradient class for each pricing card.
 *
 * Behavior:
 * - Applies only when `modernUI === "vector"`
 * - If `allowDifferentCardColors` is enabled:
 *   - Uses `plan.gradient` when available
 *   - Falls back to a rotating palette from `defaultTrioColors`
 * - If disabled:
 *   - Applies the default highlighted variant to highlighted plans only
 *
 * Memoized with `useMemo` to ensure stable class values
 * and prevent recalculation on every render.
 */
  const colorCard = useMemo(() => {
    return plans.map((plan, index) => {
      if (modernUI !== "vector") return "";
      
      if (allowDifferentCardColors) {
        // Use plan.gradient if defined, else fallback to defaultTrioColors
        return plan.gradient || defaultTrioColors[index % defaultTrioColors.length];
      }

      return plan.highlighted ? PricingGridVariant({ variant }) : "";
    });
  }, [plans, modernUI, allowDifferentCardColors, variant]);

  return (
    <div className="w-full px-4 py-10">
      <Card 
        className={cn(
          "mx-auto max-w-7xl rounded-3xl bg-background shadow-lg",
          className
        )}
      >
        <CardHeader
          className={cn(
            "text-center py-12",
          )}
        >
          <h2 className="text-4xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground max-w-2xl text-md mx-auto">
            {description}
          </p>
          {/* Toggle */}
          {toggleOptions && (
            <div className="mb-6 flex items-center justify-center gap-3 text-sm font-medium text-gray-800">
              <span>{toggleOptions[0].label}</span>

              <Switch
                variant="default"
                checked={currentValue === toggleOptions[1].value}
                onCheckedChange={handleToggle}
              />

              <span>{toggleOptions[1].label}</span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
            
            {plans.map((plan, index) => {
              const isHighlighted = plan.highlighted
              const cardColorClass = colorCard[index];
              return (
              <motion.div
                key={plan?.name}
                {...(animation !== "none" ? cardAnimations[animation] : {})}
                whileHover={
                  interactive === "lift"
                    ? { y: -10, scale: 1.04 }
                    : interactive === "glow"
                    ? { scale: 1.04 }
                    : interactive === "tilt"
                    ? { rotateX: 6, rotateY: -6, scale: 1.03 }
                    : interactive === "press"
                    ? { scale: 1.02 }
                    : undefined
                }
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className={cn(
                  "relative overflow-visible origin-center z-30 rounded-3xl shadow-xl -top-1.5 transform-gpu",
                  PricingGridPriceVariant({ interactive }),
                  pricingBadgePosition === "top" ? "pt-8" : "p-0",
                  !allowDifferentCardColors && "border-0",
                  isHighlighted && [
                    "scale-105",
                    modernUI ==="basic" ? ModernPricingGridGlowVariant({variant:modernVariant}) :
                    ""],
                  modernUI==="vector" ? cardColorClass : 'border',
                  modernUI === "basic" &&
                    ModernPricingGridVariant({variant:modernVariant})
                )}
              >
                <CardHeaderAction variant={variant} isHighlighted={isHighlighted} plan={plan}  pricingBadgePosition={pricingBadgePosition} allowDifferentCardColors={allowDifferentCardColors} modernUI={modernUI} currentPlan={currentPlan}/>

                {modernUI === "advance" && (
                  <div className="rounded-xl mt-2 mb-2">
                    <Typography
                      variant="h4"
                      className={cn(
                        plan?.gradient,
                        "bg-clip-text text-transparent text-center font-bold"
                      )}
                    >
                      {plan.price}
                    </Typography>
                  </div>
                )}

                <CardContentAction features={plan.features}  modernUI={modernUI} table={table} plan={plan} allowDifferentCardColors={allowDifferentCardColors}/>

                {modernUI === "basic" && (
                  <div className="mx-8 my-2">
                    <Typography variant="h6" className="text-center">From</Typography>
                    <Typography variant="h5" className="text-center">{plan?.price}</Typography>
                 </div>
                )}

                {!(modernUI === "basic" && currentPlan === plan.id) && (
                  <CardFooterAction
                    variant={variant}
                    isHighlighted={isHighlighted}
                    modernUI={modernUI}
                    plan={plan}
                    modernVariant={modernVariant}
                    onCtaClick={onCtaClick}
                  />
                )}
                                
              </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * PricingGrid
 */
export const PricingGrid: React.FC<PricingGridProps> = (props) => {
  return <PricingGridContent {...props} />
}

