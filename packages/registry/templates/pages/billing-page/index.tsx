import React, { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Ban,
  Banknote,
  Building2,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  MoveLeft,
  MoveRight,
  Shield,
  Trash2,
  Users,
} from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Avatar } from "@ignix-ui/avatar"
import { Breadcrumbs } from "@ignix-ui/breadcrumbs"
import { Button } from "@ignix-ui/button"
import { Card } from "@ignix-ui/card"
import { Typography } from "@ignix-ui/typography"
import { cn } from "../../../utils/cn"
import { useDialog } from "@ignix-ui/dialogbox/use-dialog"
import { DialogProvider } from "@ignix-ui/dialogbox"
import { ComparisonTable } from "@ignix-ui/comparison-table"

/** -------------------------------- Variants -------------------------------- */
const ModernPricingGridVariant = cva("", {
  variants: {
    variant: {
      dark: "bg-zinc-800 text-white",
      default: "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
      light: "border bg-white text-black",
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

const BillingIconVariant = cva("", {
  variants: {
    variant: {
      dark: "bg-gray-200 text-gray-700",
      default: "bg-gray-200 text-gray-700",
      light: "bg-success/90 text-white",
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

/** --------------------------------- Types ---------------------------------- */
export type FeatureValue = boolean | string | number | null

export interface BillingVariantProps {
  variant?: VariantProps<typeof ModernPricingGridVariant>["variant"]
}

export interface Feature {
  id: number
  label: string
  available?: boolean
  icon?: React.ElementType
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

export interface PricingPlan {
  id?: number
  name: string
  price: string
  features: Feature[]
  gradient?: string
  highlighted?: boolean
  ctaLabel?: string
}

export interface GlassCardProps extends BillingVariantProps, AnimationInteractionProps { 
  children: React.ReactNode
  className?: string 
}

export interface AnimationInteractionProps {
  animation?: "none"| "fadeIn"| "slideUp"| "scaleIn"| "flipIn"| "bounceIn"| "floatIn"
  interactive?: "none"| "hover"| "press"| "lift"| "tilt"| "glow"
}

export interface ActivePlanProps extends BillingVariantProps, AnimationInteractionProps {
  plan: PlanProps
  features: Feature[] 
  renewalDate: Date
  onUpgrade?: () => void
}

export interface CardDetails {
  brand: React.ElementType
  cardNumber: string // full number (never rendered)
  expiryMonth?: string
  expiryYear?: string
  cardHolderName?: string
}

export interface PaymentMethodProps extends BillingVariantProps, AnimationInteractionProps {
  card: CardDetails
  onUpdate?: () => void
  onCancelSubscription?: () => void
}

export interface Invoice {
  id: string
  plan: string
  date: string
  amount: string
  status: "Paid" | "Pending" | "Failed"
}

export interface BillingTableProps extends BillingVariantProps, AnimationInteractionProps {
  invoices?: Invoice[]
  onView?: (invoice: Invoice) => void
  onDownload?: (invoice: Invoice) => void
  onDelete?: (invoice: Invoice) => void
}

export interface UsageMetric {
  label: string
  used: number
  total: number
  unit?: string
  gradient?: string
}

export interface UpdatePaymentMethodModalProps {
  open: boolean
  onClose: () => void
  onSelect?: (methodId: string) => void
}

export interface UsageOverviewProps extends BillingVariantProps, AnimationInteractionProps {
  title?: string
  description?: string
  apiUsage?: UsageMetric
  storageUsage?: UsageMetric
  seatsUsage?: UsageMetric
}

export interface BillingPageProps extends BillingVariantProps , UsageOverviewProps, PaymentMethodProps, AnimationInteractionProps{
  headerTitle?: string
  headerIcon?: LucideIcon
  features?: Feature[]
  plans?: PlanProps[]
  currentPlanId?: number
  renewalDate?: Date

  showcurrentPlanId?: boolean
  showUsageOverview?: boolean
  showPricing?: boolean
  showBillingTable?: boolean

  pricingTitle?: string
  pricingDescription?: string

  /** Payment Method (composed, not inherited) */
  paymentMethod?: PaymentMethodProps

  /** Usage */
  usageOverview?: UsageOverviewProps

  /** Billing */
  invoices?: Invoice[]
  onInvoiceView?: (invoice: Invoice) => void
  onInvoiceDownload?: (invoice: Invoice) => void
  onInvoiceDelete?: (invoice: Invoice) => void

   /** Radix-style intent callback */
  onUpdatePaymentMethod?: () => void

  /** Optional render slot (consumer-owned UI) */
  renderUpdatePaymentMethod?: () => React.ReactNode
  layout?: "type1" | "type2"
}

/** ------------------------------ Glass Card -------------------------------- */
export const GlassCard: React.FC<GlassCardProps> = React.memo(({ children, variant,className, animation, interactive }) => {
  return (
    <Card
      className={cn(
        "relative rounded-2xl p-[1px]",
        ModernPricingGridVariant({ variant }),
        className
      )}
      animation={animation} interactive={interactive}
    >
      <div className="rounded-2xl backdrop-blur-xl p-5">{children}</div>
    </Card>
  )
})

/** ---------------------------- Current Plan -------------------------------- */
export const CurrentPlanCard: React.FC<ActivePlanProps> = React.memo(
  ({ plan, features, renewalDate, variant, onUpgrade, animation, interactive }: ActivePlanProps) => {
    
    if (!plan) return null
    return (
      <GlassCard variant={variant} animation={animation} interactive={interactive}>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                "w-10 h-10 sm:w-12 sm:h-12",
                BillingIconVariant({ variant })
              )}
            >
              {plan.icon && <plan.icon className="w-6 h-6 sm:w-8 sm:h-8" />}
            </div>

            <p className="font-semibold text-xl sm:text-2xl lg:text-3xl">
              {plan.name}
            </p>
          </div>

          {renewalDate && (
            <Button
              size="pill"
              variant="outline"
              animationVariant="scaleHeartbeat"
              className="w-auto lg:w-full md:text-wrap text-xs lg:text-md hover:cursor-pointer"
            >
              Billing Date:&nbsp;
              {renewalDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Button>
          )}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">{plan.price}</h2>
        </div>

        {/* Features */}
        <ul className="space-y-3 text-md md:text-lg mt-4">
          {features.map((feature, i) => {
            const Icon = feature.icon ?? Check
            return (
              <li key={i} className="flex gap-3">
                <Icon className="h-4 w-4" />
                {feature.label}
              </li>
            )
          })}
        </ul>

        {/* Actions */}
        <div className="mt-6 flex flex-col lg:flex-row gap-2 md:gap-2 lg:gap-3">
          <Button
            role="button"
            aria-label="upgrade-plan"
            variant="success"
            size="wide"
            className="w-full sm:w-auto hover:cursor-pointer" 
            onClick={onUpgrade}
          >
            Upgrade 
          </Button>
          <Button
            aria-label="downgrade-plan"
            variant="outline"
            size="wide"
            className="w-full sm:w-auto hover:cursor-pointer"
          >
            Downgrade 
          </Button>
        </div>
      </GlassCard>
    )
  }
)

/** --------------------------- Usage Overview ------------------------------- */
export const UsageOverviewCard: React.FC<UsageOverviewProps> = React.memo(
  ({
    variant,
    title = "Usage Overview",
    description = "Your monthly consumption report.",
    apiUsage,
    storageUsage,
    seatsUsage,
    animation,
    interactive
  }) => {
    const apiPercent = React.useMemo(() => {
      if (!apiUsage) return 0
      return Math.min(100, Math.round((apiUsage.used / apiUsage.total) * 100))
    }, [apiUsage])

    const storagePercent = React.useMemo(() => {
      if (!storageUsage) return 0
      return Math.min(100, Math.round((storageUsage.used / storageUsage.total) * 100))
      }, [storageUsage])

    const storageDashOffset = React.useMemo(() => {
      if(!storagePercent) return 0
      return 213 - (213 * storagePercent) / 100
    },[storagePercent])

    return (
      <GlassCard variant={variant} animation={animation} interactive={interactive}>
        {/* Header */}
        <div className="flex flex-row gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              BillingIconVariant({ variant })
            )}
          >
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <Typography variant="h2" className="font-medium text-md">
              {title}
            </Typography>
            <Typography variant="h6">{description}</Typography>
          </div>
        </div>

        {/* API Usage */}
        {apiUsage && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400 font-semibold">
                {apiUsage.label}
              </span>
              <span className="text-zinc-300 font-semibold">
                {apiPercent}% · {apiUsage.used.toLocaleString()} /{" "}
                {apiUsage.total.toLocaleString()} {apiUsage.unit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: `${apiPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Storage Usage */}
        {storageUsage && (
          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-sm text-zinc-400 font-semibold">
                {storageUsage.label}
              </p>
              <p className="text-2xl font-semibold mt-1">
                {storagePercent}%
              </p>
              <p className="text-sm text-zinc-500">
                {storageUsage.used}
                {storageUsage.unit} / {storageUsage.total}
                {storageUsage.unit}
              </p>
            </div>

            {/* Circular Indicator */}
            <div className="relative w-20 h-20">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-zinc-800"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="url(#grad)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="213"
                  strokeDashoffset={storageDashOffset}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}

        {/* Seats Usage */}
        {seatsUsage && (
          <div className="mt-6 mb-4 flex justify-between text-sm">
            <div className="flex flex-row gap-2">
              <Users className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-400 font-bold">
                {seatsUsage.label}
              </span>
            </div>
            <span className="font-medium">
              {seatsUsage.used} / {seatsUsage.total}
            </span>
          </div>
        )}
      </GlassCard>
    )
  }
)

/** ------------------------------ Billing Table ----------------------------- */
export const BillingTable: React.FC<BillingTableProps> = React.memo(({
  variant,
  invoices = [],
  onView,
  onDownload,
  onDelete,
  animation,
  interactive
}) => {
  const ITEMS_PER_PAGE = 3
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE)
  const currentInvoices = invoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-500 font-semibold"
      case "Failed":
        return "text-red-500 font-semibold"
      case "Pending":
        return "text-yellow-500 font-semibold"
      default:
        return "text-zinc-400"
    }
  }

  const handleView = React.useCallback(
    (inv: Invoice) => onView?.(inv),
    [onView]
  )

  const handleDownload = React.useCallback(
    (inv: Invoice) => onDownload?.(inv),
    [onDownload]
  )

  const handleDelete = React.useCallback(
    (inv: Invoice) => onDelete?.(inv),
    [onDelete]
  )

  return (
    <GlassCard variant={variant} animation={animation} interactive={interactive}>
      <div className="flex flex-row items-center gap-3 mt-3 ml-3">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-full", BillingIconVariant({ variant }))}>
          <FileText className="w-6 h-6" />
        </div>
        <Typography variant="h4" className="font-semibold">
          Billing History
        </Typography>
      </div>

      <div className="w-full overflow-x-auto mt-0 md:mt-4 ">
        <table className="min-w-full w-full text-md">
          <thead>
            <tr className="text-left text-zinc-400">
              <th className="py-2 px-2 md:px-4">Plan</th>
              <th className="hidden sm:table-cell py-2 px-2 md:px-4">Date</th>
              <th className="py-2 px-4 text-right">Amount</th>
              <th className="hidden sm:table-cell py-2 px-2 md:px-4">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                  No billing history available
                </td>
              </tr>
            )}
            {currentInvoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border">
                <td className="py-2 px-2 md:px-4">{inv.plan}</td>
                <td className="hidden sm:table-cell py-2 px-2 md:px-4">{inv.date}</td>
                <td className="py-2 px-4 text-right font-medium">{inv.amount}</td>
                <td className={`hidden sm:table-cell py-2 px-4 ${getStatusColor(inv.status)}`}>{inv.status}</td>
                <td className="py-2 px-2 sm:px-4 sm:py-0">
                  <div className="flex flex-row md:flex-row gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:cursor-pointer"
                      aria-label="view-invoice"
                      disabled={!onView}
                      onClick={() => handleView(inv)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:cursor-pointer"
                      aria-label="download-invoice"
                      disabled={!onDownload}
                      onClick={() => handleDownload(inv)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="delete-invoice"
                      disabled={!onDelete}
                      onClick={() => handleDelete(inv)}
                      className="hover:cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="outline" className="hover:cursor-pointer" disabled={currentPage === 1} onClick={handlePrev}>
            <MoveLeft />
          </Button>
          <Typography className="flex items-center gap-1 text-sm">
            Page {currentPage} of {totalPages}
          </Typography>
          <Button size="sm" variant="outline" className="hover:cursor-pointer" disabled={currentPage === totalPages} onClick={handleNext}>
            <MoveRight />
          </Button>
        </div>
      )}
    </GlassCard>
  )
})

/*** --------------------------- Payment Method ------------------------------ */
const getLast4 = (cardNumber: string) =>
  cardNumber.slice(-4)

export const PaymentMethodCard: React.FC<PaymentMethodProps> = React.memo(({
  card,
  variant,
  onUpdate,
  onCancelSubscription,
  animation,
  interactive
}) => {
  const BrandIcon = card.brand
  const last4 = getLast4(card.cardNumber)
  const { openDialog } = useDialog();

  return (
    <GlassCard variant={variant} className="max-w-sm" animation={animation} interactive={interactive}>
      <div className="flex flex-row gap-2">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-full",BillingIconVariant({variant}))}> 
          <Banknote className="w-6 h-6" /> 
        </div> 
        <Typography variant="h3" className="mb-4 font-semibold"> Payment Method </Typography> 
      </div>
      <div className="flex items-center gap-3 mb-4">
        <BrandIcon className={cn("w-9 h-9 p-1", BillingIconVariant({variant}))} />
        <div>
          <p className="text-md text-zinc-600">
            •••• •••• •••• {last4}
          </p>
          {(card.expiryMonth && card.expiryYear) && (
            <p className="text-sm text-zinc-600">
              Expires {card.expiryMonth}/{card.expiryYear}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="success"
        size="md"
        className="hover:cursor-pointer"
        onClick={onUpdate}
      >
        Update Payment Method
      </Button>

      {onCancelSubscription && (
        <div className="mt-3 text-center">
          <div className="flex flex-row gap-2">
          <div
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full",
              BillingIconVariant({ variant })
            )}
          >
            <Ban className="w-4 h-4" />
          </div>
          <button
            className="text-md text-zinc-600 hover:text-red-400 transition hover:cursor-pointer"
            onClick={() => openDialog({
              title: 'Alert',
              content: 'Confirm Subscription Cancellation',
              dialogType: 'confirm',
              animationKey: 'popIn',
              confirmationCallBack: () => {
                onCancelSubscription?.()
              },
            })}
          >
            Cancel Subscription
          </button>
          </div>
          <Typography variant="body-small" className="text-zinc-500 text-left">
            Your plan remains active until the end of the billing cycle.
          </Typography>
        </div>
      )}
    </GlassCard>
  )
})

/** ---------------------------- Billing Content ----------------------------- */
export const BillingContent:React.FC<BillingPageProps> = ({
  headerTitle = "OpenSrc",
  headerIcon = Building2,
  plans,
  features,
  showcurrentPlanId = true,
  showUsageOverview = true,
  showPricing = false,
  showBillingTable = true,
  pricingTitle = "Simple Pricing",
  pricingDescription = "Choose the plan that works best for you",
  variant = "dark",
  currentPlanId = 1,
  renewalDate,
  invoices,
  onInvoiceView,
  onInvoiceDownload,
  onInvoiceDelete,
  apiUsage,
  storageUsage,
  seatsUsage,
  onCancelSubscription,
  onUpdatePaymentMethod,
  renderUpdatePaymentMethod,
  card,
  animation = "slideUp",
  interactive = "hover",
}) => {
  const Icon = headerIcon
  const [showPricingTable, setShowPricingTable] = useState<boolean>(false)
  const pricingRef = React.useRef<HTMLDivElement | null>(null)
  const activePlan = React.useMemo(
    () => plans?.find(p => p.id === currentPlanId),
    [plans, currentPlanId]
  )
  
  const handleUpgrade = React.useCallback(() => {
    setShowPricingTable(true)
  }, [])

  React.useLayoutEffect(() => {
    if (!showPricingTable) return

    pricingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [showPricingTable])

  const activePlanFeatures = React.useMemo(() => {
    if (!features || !activePlan) return []

    return features.filter((f) => {
      const value = activePlan.featureMap[f.id]
      return (value)
    })
  }, [features, activePlan])

  return (
    <>
      { headerTitle && <header className="border-b border-border p-4 flex justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <Typography variant="h2" className="font-bold">{headerTitle}</Typography>
        </div>
        <Avatar size="lg" />
      </header> }

      <main className="max-w-7xl mx-auto p-1 space-y-4 ">
        <Breadcrumbs
          items={[
            { label: "Settings", href: "#" },
            { label: "Billing", href: "#" },
          ]}
          separatorIcon={ChevronRight}
        />

        <div className={cn("flex gap-3 p-4 rounded bg-primary/5 border", ModernPricingGridVariant({variant}))}>
          <Shield className="w-5 h-5" />
          <Typography variant="body-small" className="text-md" role="link">
            Billing information is securely managed.
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-[auto_1fr] gap-4">
          {showcurrentPlanId && activePlan && renewalDate && <CurrentPlanCard plan={activePlan} features={activePlanFeatures} renewalDate={renewalDate} variant={variant} onUpgrade={handleUpgrade} animation={animation} interactive={interactive}/>}
          {showUsageOverview && (
            <UsageOverviewCard
              variant={variant}
              apiUsage={apiUsage}
              storageUsage={storageUsage}
              seatsUsage={seatsUsage}
              animation={animation} 
              interactive={interactive}
            />
          )}
        </div>

        {(showPricingTable || showPricing) && (
          <div ref={pricingRef}>
            <ComparisonTable
              title={pricingTitle}
              description={pricingDescription}
              features={features ?? []}
              plans={plans ?? []}
              variant={variant ?? "default"}
              mobileBreakpoint="md"
              animation={animation}
              interactive={interactive}
              onCtaClick={(plan) => {
                console.log(plan.id)
              }}
              currentPlanId={currentPlanId}
            />
          </div>
        )}

        <div className="grid gap-2 lg:grid-cols-[auto_1fr] items-stretch">
          {/* Billing Table — FIRST on mobile & iPad */}
          {showBillingTable && (
            <div className="order-1 lg:order-2">
              <BillingTable
                variant={variant}
                invoices={invoices ?? []}
                onView={onInvoiceView}
                onDownload={onInvoiceDownload}
                onDelete={onInvoiceDelete}
                animation={animation}
                interactive={interactive}
              />
            </div>
          )}

          {/* Payment Method — SECOND on mobile & iPad */}
          <div className="order-2 lg:order-1">
            <PaymentMethodCard
              variant={variant}
              card={card}
              onUpdate={onUpdatePaymentMethod}
              onCancelSubscription={onCancelSubscription}
              animation={animation}
              interactive={interactive}
            />
          </div>
        
        </div>
        {renderUpdatePaymentMethod?.()}
      </main>
    </>
  )
}

export const BillingPage:React.FC<BillingPageProps> = (props) => {
  return (
  <DialogProvider>
    <BillingContent {...props} />
  </DialogProvider>
  )
}
