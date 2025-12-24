import { cn } from "../../../../../utils/cn"
import { Button } from "../../../../components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../../components/card"
import { Check, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { Switch } from "../../../../components/switch"

/* -------------------- Shared / Base -------------------- */

interface PricingVisualProps {
  variant?: VariantProps<typeof PricingGridVariant>["variant"]
  isHighlighted?: boolean
  modernUI?: "basic" | "vector" | "advance"
}

/* -------------------- Domain Models -------------------- */

export interface Feature {
  label: string
  available?: boolean
  icon?: React.ElementType
}

export interface PlanProps {
  id?: string
  name: string
  icon?: React.ElementType
  price: string
  features: Feature[]
  gradient?: string
  buttonColor?: string
  highlighted?: boolean
  ctaLabel?: string
  onCtaClick?: (plan: PlanProps) => void
}

/* -------------------- Card Sub-Components -------------------- */

export interface CardContentActionProps  extends PricingVisualProps{
  features: Feature[]
  table?: boolean
}
export interface iPlanProps {
  plan: PlanProps
}

export interface CardFooterActionProps extends PricingVisualProps, iPlanProps {}

export interface CardHeaderActionProps extends PricingVisualProps, iPlanProps {
  pricingBadgePosition?: "none" | "top" | "middle"
  allowDifferentCardColors?: boolean
  modernVariant?: "default" | "dark"
}

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

/* -------------------- Grid -------------------- */

export interface PricingGridProps  extends PricingVisualProps{
  title?: string
  description?: string
  plans: PlanProps[]
  variant?: VariantProps<typeof PricingGridVariant>["variant"]
  allowDifferentCardColors?: boolean
  pricingBadgePosition?: "none" | "top" | "middle"
  className?: string
  animation?: "none"| "fadeIn"| "slideUp"| "scaleIn"| "flipIn"| "bounceIn"| "floatIn"
  interactive?: "none"| "hover"| "press"| "lift"| "tilt"| "glow"
  modernVariant?: "default" | "dark"
  table?: boolean
}

const PricingGridVariant = cva("", {
  variants: {
    variant: {
      default:
        "bg-gradient-to-r from-gray-800 via-gray-400 to-gray-500 text-primary-foreground",
      dark:
        "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
      gradient:
        "bg-gradient-to-r from-gray-800 via-slate-600 to-slate-950 text-primary-foreground",
      light: "bg-white",
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
      light: "bg-black",
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
      default:
        "bg-gradient-to-br from-slate-800 via-slate-400 to-slate-500 text-white",
      dark:
        "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});


const defaultTrioColors = [
  "border border-green-500/30 bg-green-500/10 p-8 text-white",
  "border border-purple-500 bg-purple-500/20 p-8 text-white",
  "border border-emerald-500/30 bg-emerald-500/10 p-8 text-white",
]

interface PriceProps {
  price: string;
} 

export const SplitPrice = ({ price }: PriceProps) => {
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
};

export const CardFooterAction = ({
  variant,
  isHighlighted,
  modernUI,
  plan
}: CardFooterActionProps) => {

  return (
    <CardFooter className="px-8 pb-10 flex justify-center">
      {modernUI === "advance" ? (
        <div
          className="w-full max-w-[220px] overflow-hidden rounded-bl-5xl rounded-tr-3xl"
          style={{
            clipPath: "inset(0 0 0 0 round 0 24px 0 24px)",
          }}
        >
          <Button
            size="wide"
            animationVariant="fadeInOut"
            className={cn(
              "w-full rounded-none font-semibold transition bg-gray-400 text-white",
            )}
            onClick={() => plan.onCtaClick?.(plan)}
          >
            {plan.ctaLabel}
          </Button>
        </div>
      ) : (
        <Button
          size="wide"         
          animationVariant="fadeInOut"
          className={cn(
            "w-full max-w-[220px] rounded-full font-semibold transition",
            !isHighlighted
              ? PricingGridVariant({ variant })
              : PricingGridPriceVariant({ variant })
          )}
          onClick={() => plan.onCtaClick?.(plan)}
        >
          {plan.ctaLabel}
        </Button>
      )}
    </CardFooter>
  )
}

export const CardContentAction = ({features , modernUI, table}:CardContentActionProps) => {
  return (
    <CardContent className="px-8 pb-8" style={modernUI === "advance" ? { paddingTop: "50px" } : {}}>
      {table ? (<table className="w-full text-left text-md border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4">Feature</th>
            <th className="py-2 px-4">Available</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => {
            const Icon =
              feature.icon ??
              (feature.available === false ? X : Check);

            return (
              <tr key={i} className="border-t">
                <td className="py-2 px-4 flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {feature.label}
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
              feature.icon ??
              (feature.available === false ? X : Check)

            return (
              <li key={i} className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5" />
                <span>{feature.label}</span>
              </li>
            )
          })}
        </ul>
      )}

    </CardContent>
  )
}

export const CardHeaderAction = ({
  pricingBadgePosition,
  isHighlighted,
  allowDifferentCardColors,
  plan,
  variant,
  modernUI,
  modernVariant
}: CardHeaderActionProps) => {
  return (
    <>
      {modernUI === "basic" ? (
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
            {plan.name}
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
              className="absolute -top-12 left-1/2 -translate-x-1/2 z-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-40 h-20 rounded-full p-[3px]">
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
      ) : modernUI === "vector" ? (
        /* ---------------- VECTOR ---------------- */
        <>
          <div
            className="absolute inset-0 bg-gray-50 opacity-70"
            style={{
              clipPath:
                "polygon(91% 0%, 91% 12%, 51% 19%, 10% 12%, 10% 0%)",
            }}
          />

          <h3 className="text-center text-white font-bold text-2xl tracking-wider uppercase mb-4 mt-3">
            {plan.name}
          </h3>

          {plan.icon && (
            <div className="flex justify-center mb-5">
              <div
                className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <plan.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          )}
        </>
      ) : (
        /* ---------------- ADVANCE / FALLBACK ---------------- */
        <>
          <div
            className="absolute inset-0 bg-gray-400 opacity-70"
            style={{
              clipPath: 
                "inset(0 0 65% 0 round 5% 5% 0 10%)",
            }}
          />
          {/* Content */}
          <div className="relative overflow-visible z-10 flex flex-row items-center text-center px-6 top-3 gap-3">
              {/* Icon hexagon */}
            {plan.icon && (
              <div className="mb-4 mt-3">
                {/* OUTER HEX (BORDER) */}
                <div
                  className="w-20 h-20 bg-white flex items-center justify-center"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  }}
                >
                  {/* INNER HEX (FILL) */}
                  <div
                    className={cn("w-20 h-20 flex items-center justify-center",ModernPricingGridVariant({variant:modernVariant}))}
                    style={{
                      clipPath:
                        "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                    }}
                  >
                    <plan.icon className="w-7 h-7" />
                  </div>
                </div>
              </div>
            )}
            {/* Price */}
            <div className={cn("flex items-center justify-center rounded-xl",ModernPricingGridVariant({variant:modernVariant}))} style={{ width: "200px", height: "65px"}}>
              <SplitPrice price={plan.price} />
            </div>
          </div>
          {/* Plan Name */}
          <h3 className="text-white text-center font-bold text-3xl uppercase tracking-wide">
            {plan.name}
          </h3>
          <p className="text-md text-center text-wrap">Lorem ipsum dolor sit amet.</p>
          </>
        )}
    </>
  )
}

const PricingGridContent = ({
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
  modernVariant = "default",
  table
}: PricingGridProps) => {
  
  return (
    <div className="w-full px-4 py-10">
      <Card 
        className={cn(
          "mx-auto max-w-7xl rounded-3xl bg-background shadow-lg",
          variant === "dark" && "bg-slate-800",
          className
        )}
      >
        <CardHeader
          className={cn(
            "text-center py-12",
            allowDifferentCardColors && "text-white"
          )}
        >
          <h2 className="text-4xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground max-w-2xl text-md mx-auto">
            {description}
          </p>
          {/* Toggle */}
          <div className="mb-6 flex items-center justify-center gap-3 text-sm font-medium text-gray-800">
            <span>Paid</span>
            <Switch variant="default"/>
            <span>Free</span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
            {plans.map((plan, index) => {
              const isHighlighted = plan.highlighted

              const cardColorClass = allowDifferentCardColors
                ? plan.buttonColor ||
                  defaultTrioColors[index % defaultTrioColors.length]
                : isHighlighted
                ? PricingGridVariant({ variant })
                : ""

              return (
              <motion.div
                key={plan.name}
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
                  isHighlighted && "scale-105 z-40",
                  cardColorClass,
                  (modernUI === "vector" || modernUI === "advance") &&
                    ModernPricingGridVariant({variant:modernVariant})
                )}
              >
                <CardHeaderAction variant={variant} isHighlighted={isHighlighted} plan={plan}  pricingBadgePosition={pricingBadgePosition} allowDifferentCardColors={allowDifferentCardColors} modernUI={modernUI} modernVariant={modernVariant}/>

                <CardContentAction features={plan.features}  modernUI={modernUI} table={table}/>

                {modernUI === "vector" && (
                  <div className="text-center mb-4">
                    <SplitPrice price={plan.price} />
                 </div>
                )}

                <CardFooterAction variant={variant} isHighlighted={isHighlighted} modernUI={modernUI} plan={plan}/>
                
              </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const PricingGridPage = (props: any) => {
  return <PricingGridContent {...props} />
}

