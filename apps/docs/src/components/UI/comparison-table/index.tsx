import React from "react"
import {
  Check,
  X,
  Crown,
  Star,
  type LucideIcon,
  Trophy,
} from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@site/src/utils/cn"
import { Typography } from "../typography"
import { Card, CardContent, CardFooter, CardHeader } from "../card"
import z from "zod"

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
/**
 * Represents a value in the comparison table.
 * - boolean → check / cross
 * - string | number → rendered as text
 * - null → dash placeholder
 */
export type FeatureValue = boolean | string | number | null

/**
 * Single feature definition.
 */
export interface Feature {
  id: number
  label: string
}

export interface VariantsProps {
  variant?: VariantProps<typeof ComparisonTableVariant>["variant"]
  recommendationGradient?: string
  onCtaClick?: (plan: PlanProps) => void
}

export interface CardContentActionProps extends VariantsProps {
  features: Feature[]
  featureGradient?: string
  featureMap?: Record<number, FeatureValue>
}

export interface PlanProps {
  id: number
  name: string
  price: string
  ctaLabel?: string
  recommended?: boolean
  icon?: LucideIcon
  gradient?: string
  featureMap: Record<number, FeatureValue>
}

export interface CardHeaderActionProps extends VariantsProps {
  header: string
  recommendation?: boolean
  icon?: LucideIcon
}

export interface AnimationProps {
  interactive?: "none"| "hover"| "press"| "lift"| "tilt"| "glow"
  animation?: "none"| "fadeIn"| "slideUp"| "scaleIn"| "flipIn"| "bounceIn"| "floatIn"
}

export interface CurrentPlanProps {
  id?: number
  currentPlanId?: number
}

export interface PlanCardProps extends VariantsProps, AnimationProps, CurrentPlanProps {
  plan: PlanProps
  features: Feature[]
  layout: "mobile" | "desktop"
}

export interface CardFooterActionProps extends VariantsProps{
  plan: PlanProps
  price?: string
  recommended?: boolean
  ctaLabel?: string
}

export interface ComparisonTableData extends VariantsProps, AnimationProps, CurrentPlanProps {
  title?: string
  description?: string
  head?: string
  icon?: LucideIcon
  features: Feature[]
  plans: PlanProps[]
  mobileBreakpoint?: "sm" | "md" | "lg"
  featureGradient?: string
  className?: string
}

/* -------------------------------------------------------------------------- */
/* PLAN                                                                         */
/* -------------------------------------------------------------------------- */

/* Feature Schema */
export const FeatureSchema = z.object({
  id: z.number(),
  label: z.string().min(1, "Feature label is required"),
})

/* Plan Schema */
export const PlanSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Plan name is required"),
  price: z.string().min(1, "Price is missing"),
  ctaLabel: z.string().min(1, "CTA Label is empty").optional(),
  recommended: z.boolean().optional(),
  gradient: z.string().optional(),
  icon: z.any().optional(),
})

/* Root Table Schema */
export const ComparisonTableSchema = z.object({
  features: z.array(FeatureSchema).min(1, "At least one feature is required"),
  plans: z.array(PlanSchema).min(1, "At least one plan is required"),
})
/* -------------------------------------------------------------------------- */
/*                              VALIDATION                                     */
/* -------------------------------------------------------------------------- */
type ValidationError = {
  title: string
  messages: string[]
}

const validateComparisonTable = (data: unknown): ValidationError | null => {
  const result = ComparisonTableSchema.safeParse(data)

  if (!result.success) {
    return {
      title: "Invalid configuration",
      messages: result.error.issues.map(err => err.message), // Only the message
    }
  }

  return null
}


/* -------------------------------------------------------------------------- */
/*                              VARIANTS                                      */
/* -------------------------------------------------------------------------- */
const ComparisonTableVariant = cva("", {
  variants: {
    variant: {
      dark: "bg-gradient-to-b from-zinc-700 via-zinc-900 to-black",
      default: "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
      light: "bg-white text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const ComparisonTableTextVariant = cva("", {
  variants: {
    variant: {
      default: "text-zinc-300",
      dark: "text-zinc-200",
      light: "text-zinc-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const ComparisonTableIconVariant = cva("", {
  variants: {
    variant: {
      default: "text-indigo-400",
      dark: "text-emerald-200",
      light: "text-indigo-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/* -------------------------------------------------------------------------- */
/*                              CONSTANTS                                     */
/* -------------------------------------------------------------------------- */
const ROW_HEIGHT = "h-14"

/* -------------------------------------------------------------------------- */
/*                              VALUE RENDERER                                */
/* -------------------------------------------------------------------------- */
/**
 * Renders a feature value based on its type.
 *
 * @param value - Feature value (boolean, string, number, null)
 * @param variant - Visual theme variant
 */
const renderFeatureValue = (
  value: FeatureValue,
  variant?: VariantProps<typeof ComparisonTableVariant>["variant"],
) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check aria-hidden="true" focusable="false" className={cn("h-5 w-5", ComparisonTableIconVariant({variant}))} />
    ) : (
      <X aria-hidden="true" focusable="false" className={cn("h-5 w-5", ComparisonTableTextVariant({ variant }))} />
    )
  }

  if (typeof value === "string" || typeof value === "number") {
    return (
      <span className={cn("text-md", ComparisonTableTextVariant({ variant }))}>
        {value}
      </span>
    )
  }

  return <span className={cn(ComparisonTableTextVariant({ variant }))}>—</span>
}

/* -------------------------------------------------------------------------- */
/*                          SHARED SUB COMPONENTS                              */
/* -------------------------------------------------------------------------- */

/**
 * Header section for comparison cards.
 * Displays icon + title and optional recommendation styling.
 */
const CardHeaderAction: React.FC<CardHeaderActionProps> = React.memo(({
  header,
  recommendation,
  icon: Icon = Star,
  variant,
  recommendationGradient
}) => {
  return (
  <CardHeader className="pt-8 pb-6 text-center border-b border-white/10 space-y-3">
    <div
      className={cn(
        "mx-auto flex h-10 w-10 items-center justify-center rounded-full",
        recommendation && !recommendationGradient? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-300/50",
        ComparisonTableTextVariant({ variant })
      )}
    >
      <Icon className="h-5 w-5"/>
    </div>

    <Typography
      variant="h4"
      className={cn(
        "text-center",
        ComparisonTableTextVariant({ variant })
      )}
    >
      {header}
    </Typography>
  </CardHeader>
  )
})

/**
 * Renders feature rows or labels for a plan.
 */
const CardContentAction: React.FC<CardContentActionProps> = React.memo(({
  features,
  featureMap,
  variant,
}) => {
  return (
  <CardContent className="p-0">
    <ul className="divide-y divide-white/10">
      {features.map(feature => (
        <li
          key={feature.id}
          className={cn(
            "flex items-center justify-center px-4 text-center",
            ROW_HEIGHT
          )}
        >
          {featureMap ? (
            renderFeatureValue(featureMap[feature.id] ?? null, variant)
          ) : (
            <span className={cn("text-md", ComparisonTableTextVariant({ variant }))}>
              {feature.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  </CardContent>
  )
})

/**
 * Footer section containing price and CTA button.
 */
const CardFooterAction: React.FC<CardFooterActionProps> = React.memo(({
  price,
  recommended,
  ctaLabel= "Get Started",
  variant,
  plan,
  recommendationGradient,
  onCtaClick
}) => {

  const handleClick = () => {
    onCtaClick?.(plan)
  }

  return (
    <CardFooter className="flex flex-col items-center justify-center gap-3 border-t border-white/10 py-6">
      {price && <span className={cn("text-lg font-semibold", ComparisonTableTextVariant({variant}))}>{price}</span>}
      <button
        type="button"
        aria-label={`${ctaLabel}`}
        onClick={handleClick}
        className={cn(
          "w-full rounded-lg py-2 text-sm font-semibold transition hover:cursor-pointer",
          recommended
            ? "bg-indigo-500 text-white hover:bg-indigo-400"
            : variant === "light" 
            ? "bg-zinc-800 text-white hover:bg-zinc-700"
            : "bg-white/10 text-white hover:bg-white/20",
          recommendationGradient && variant === "light" ? `${recommendationGradient}` : ""
        )}
      >
        {ctaLabel}
      </button>
    </CardFooter>
  )
})

/* -------------------------------------------------------------------------- */
/*                              PLAN CARD                                     */
/* -------------------------------------------------------------------------- */
/**
 * Individual pricing plan card.
 */
const PlanCard: React.FC<PlanCardProps> = React.memo(({
  plan,
  features,
  variant,
  layout,
  recommendationGradient,
  animation,
  interactive,
  onCtaClick,
  currentPlanId
}) => {
  const isMobile = layout === "mobile"

  return  (
    <Card
      className={cn(
        "relative rounded-2xl border backdrop-blur transition-all overflow-visible",

        plan.recommended &&
          (variant === "light" && recommendationGradient
            ? recommendationGradient + " scale-105"
            : "bg-white/10 border-white/30 shadow-xl ring-1 ring-indigo-500/30 scale-105"),

        !plan.recommended && "bg-white/5 border-white/10",

        isMobile && "pt-6",
        variant === "light" && "border-black/10",
        plan?.gradient && variant === "light" ? `${plan?.gradient}` : "",
      )}
      animation={animation}
      interactive={interactive}
    >
      {plan.recommended && (
        <span
          className={`absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold text-white ${
            recommendationGradient ? "bg-red-500" : "bg-indigo-500"
          }`}
        >
        <Trophy className="h-4 w-4" />
        Most Popular
        </span>
      )}
      {currentPlanId === plan.id && (
        <span
          className={cn(
            "absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
            "bg-emerald-500 text-white border border-emerald-500/30"
          )}
        >
          <Star className="h-4 w-4 fill-emerald-400" />
          Current Plan
        </span>
      )}

      <CardHeaderAction
        header={plan.name}
        recommendation={plan.recommended}
        icon={plan.icon}
        variant={variant}
      />

      {isMobile ? (
        <CardContent className="px-6 mt-2">
          <ul className="space-y-4">
            {features.map(feature => (
              <li
                key={feature.id}
                className="flex items-center justify-between border-b border-white/10 pb-3"
              >
                <span className={cn("text-sm", ComparisonTableTextVariant({ variant }))}>
                  {feature.label}
                </span>
                {renderFeatureValue(plan.featureMap[feature.id] ?? null, variant)}
              </li>
            ))}
          </ul>
        </CardContent>
      ) : (
        <CardContentAction
          features={features}
          featureMap={plan.featureMap}
          variant={variant}
          recommendationGradient={recommendationGradient}
        />
      )}

      <CardFooterAction
        plan={plan}
        price={plan.price}
        recommended={plan.recommended}
        ctaLabel={plan.ctaLabel}
        variant={variant}
        recommendationGradient={recommendationGradient}
        onCtaClick={onCtaClick}
      />
    </Card>
  )
})

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */
/**
 * Responsive pricing comparison table.
 */
export const ComparisonTableContent: React.FC<ComparisonTableData> = ({
  title = "Pricing Plans",
  description = "Choose the plan that fits your needs",
  head = "Features",
  icon: Icon = Crown,
  features,
  plans,
  mobileBreakpoint = "md",
  variant = "default",
  recommendationGradient,
  animation = "slideUp",
  interactive = "press",
  featureGradient,
  currentPlanId = 0,
  onCtaClick,
  className
}) => {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const bp = (mobileBreakpoint === "sm" ? 640 : mobileBreakpoint === "md" ? 768 : 1024)
 
 const [validationError, setValidationError] =
  React.useState<ValidationError | null>(null)

  React.useEffect(() => {
    const error = validateComparisonTable({ features, plans })
    setValidationError(error)
  }, [features, plans])

  React.useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < bp)
    }
    checkViewport()
    window.addEventListener("resize", checkViewport)
    return () => window.removeEventListener("resize", checkViewport)
  }, [bp])
  
  if (validationError) {
    return (
      <section className={cn("w-full py-20 px-6", ComparisonTableVariant({ variant }))}>
        <div className="mx-auto max-w-3xl rounded-xl border border-red-500/50 bg-red-900/20 p-6">
          <h2 className="text-lg font-semibold mb-3">{validationError.title}</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {validationError.messages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs opacity-80">
            Please fix the configuration and reload.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("w-full py-20 px-6", ComparisonTableVariant({ variant }), className)}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Icon className={cn("h-6 w-6",ComparisonTableIconVariant({variant}))} />
          </div>
          <Typography variant="h2" className={cn("text-center", ComparisonTableTextVariant({ variant }))}>
            {title}
          </Typography>
          <p className={cn("mt-3 text-sm max-w-xl mx-auto text-right", ComparisonTableTextVariant({ variant }))}>
            {description}
          </p>
        </div>

        {isMobile ? (
          <div data-testid="mobile-view" className="grid gap-6 md:hidden">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                id={plan.id}
                plan={plan}
                features={features}
                variant={variant}
                layout="mobile"
                recommendationGradient={recommendationGradient}
                animation={animation}
                interactive={interactive}
                onCtaClick={onCtaClick}
                currentPlanId={currentPlanId}
              />
            ))}
          </div>
        ) : (
          <div data-testid="desktop-view" className="hidden md:block">
            <CardContent
              className="grid grid-cols-4 gap-6"
            >
              <Card
                className={`rounded-2xl bg-white/5 border ${
                  variant === "light" ? "border-black/10" : "border-white/10"
                }
                ${variant === "light" && featureGradient ?  `${featureGradient}` : ""}`}
                animation={animation}
                interactive={interactive}
              >                
              <CardHeaderAction header={head} icon={Star} variant={variant} />
                <CardContentAction features={features} variant={variant} />
                <CardFooter className="h-20 flex items-center justify-center border-t border-white/10">
                  <span className={cn("text-md", ComparisonTableTextVariant({ variant }))}>
                    Pricing
                  </span>
                </CardFooter>
              </Card>

              {plans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  features={features}
                  variant={variant}
                  layout="desktop"
                  recommendationGradient={recommendationGradient}
                  animation={animation}
                  interactive={interactive}
                  onCtaClick={onCtaClick}
                  currentPlanId={currentPlanId}
                />
              ))}
            </CardContent>
          </div>
        )}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              EXPORT WRAPPER                                 */
/* -------------------------------------------------------------------------- */

export const ComparisonTable: React.FC<ComparisonTableData> = props => {
  return <ComparisonTableContent {...props} />
}
