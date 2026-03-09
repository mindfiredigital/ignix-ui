import React, { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MoveLeft,
  MoveRight,
  Pencil,
  XCircle,
} from "lucide-react"
import { Avatar } from "../../../../components/avatar"
import { Card } from "../../../../components/card"
import { Typography } from "../../../../components/typography"
import { cn } from "../../../../../utils/cn"
import { useDialog } from "../../../../components/dialog-box/use-dialog"
import { DialogProvider } from "../../../../components/dialog-box"
import { PricingGrid, type PricingTier } from "../../../section/content/pricing-grid"
import { ButtonWithIcon } from "../../../../components/button-with-icon"

/** --------------------------------- Types ---------------------------------- */
export type FeatureValue = boolean | string | number | null

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

export interface AnimationInteractionProps {
  animation?: "none"| "fadeIn"| "slideUp"| "scaleIn"| "flipIn"| "bounceIn"| "floatIn"
  interactive?: "none"| "hover"| "press"| "lift"| "tilt"| "glow"
}

export type SubscriptionStatus = "active" | "trial" | "canceled" | "past_due" | "expired" | "pending"

export interface ActivePlanProps extends AnimationInteractionProps {
  plan: PlanProps
  features: Feature[] 
  renewalDate: Date
  status?: SubscriptionStatus
  billingCycle?: "monthly" | "yearly"
}

export interface CardDetails {
  brand: LucideIcon
  cardNumber: string // full number (never rendered)
  expiryMonth?: string
  expiryYear?: string
  cardHolderName?: string
}

export interface PaymentMethodProps extends AnimationInteractionProps {
  card: CardDetails
  nextBillingDate?: Date
  onUpdate?: () => void
  onCancelSubscription?: () => void
  onSubscriptionCancelled?: () => void
}

export interface Invoice {
  id: string
  plan: string
  date: string
  amount: string
  status: "Paid" | "Pending" | "Failed"
  invoiceNumber?: string
  downloadUrl?: string
}

export interface BillingTableProps extends AnimationInteractionProps {
  invoices?: Invoice[]
  onDownload?: (invoice: Invoice) => void
}

export interface UsageMetric {
  label: string
  used: number
  total: number
  unit?: string
  gradient?: string
}

export interface UsageOverviewProps extends AnimationInteractionProps {
  title?: string
  description?: string
  apiUsage?: UsageMetric
  storageUsage?: UsageMetric
  seatsUsage?: UsageMetric
}

export interface BillingPageProps extends UsageOverviewProps, PaymentMethodProps, AnimationInteractionProps{
  headerTitle?: string
  headerIcon?: LucideIcon
  features?: Feature[]
  plans?: PlanProps[]
  currentPlanId?: number
  renewalDate?: Date
  subscriptionStatus?: SubscriptionStatus
  billingCycle?: "monthly" | "yearly"

  showcurrentPlanId?: boolean
  showUsageOverview?: boolean
  showPricing?: boolean
  showBillingTable?: boolean

  /** Billing */
  invoices?: Invoice[]
  onInvoiceDownload?: (invoice: Invoice) => void

  /** Radix-style intent callback */
  onUpdatePaymentMethod?: () => void

  /** Optional render slot (consumer-owned UI) */
  renderUpdatePaymentMethod?: () => React.ReactNode
  
  /** Show skeleton loaders instead of content */
  isLoading?: boolean
}

/** ---------------------------- Loading Components --------------------------- */
const CurrentPlanCardSkeleton = () => {
  const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg"
  
  return (
    <Card variant="default" className={cardClassName}>
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-7 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-muted rounded w-20"></div>
          </div>
          {/* Features */}
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
          {/* Billing Date */}
          <div className="pt-4 border-t border-border/50 space-y-2">
            <div className="h-3 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </Card>
  )
}

const UsageOverviewCardSkeleton = () => {
  const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg"
  
  return (
    <Card variant="default" className={cardClassName}>
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
          {/* Usage Items */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/5"></div>
              </div>
              <div className="h-2.5 bg-muted rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/5"></div>
              </div>
              <div className="h-2.5 bg-muted rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/5"></div>
              </div>
              <div className="h-2.5 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

const BillingTableSkeleton = () => {
  const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg"
  
  return (
    <Card variant="default" className={cardClassName}>
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
          {/* Table */}
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-border/50">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
            {/* Table Rows */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-8"></div>
              <div className="h-8 bg-muted rounded w-8"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

const PaymentMethodCardSkeleton = () => {
  const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg"
  
  return (
    <Card variant="default" className={cardClassName}>
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
          {/* Card Display */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className="w-12 h-12 bg-muted rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted rounded w-2/3"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          </div>
          {/* Button */}
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
      </div>
    </Card>
  )
}

const PricingGridSkeleton = () => {
  const containerClassName = "space-y-4 rounded-lg border border-border bg-background/50 p-6"
  
  return (
    <div className={containerClassName}>
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
        </div>
        {/* Toggle */}
        <div className="flex justify-center">
          <div className="h-10 bg-muted rounded-full w-48"></div>
        </div>
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border/50 rounded-xl p-6 space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-10 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="space-y-2 pt-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-10 bg-muted rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** ---------------------------- Current Plan -------------------------------- */
const getStatusConfig = (status: SubscriptionStatus) => {
  switch (status) {
    case "active":
      return {
        label: "Active",
        type: "success" as const,
        icon: CheckCircle2,
        className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      }
    case "trial":
      return {
        label: "Trial",
        type: "warning" as const,
        icon: Clock,
        className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      }
    case "canceled":
      return {
        label: "Canceled",
        type: "error" as const,
        icon: XCircle,
        className: "bg-red-500/20 text-red-400 border-red-500/30",
      }
    case "past_due":
      return {
        label: "Past Due",
        type: "error" as const,
        icon: AlertTriangle,
        className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      }
    case "expired":
      return {
        label: "Expired",
        type: "error" as const,
        icon: XCircle,
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      }
    case "pending":
      return {
        label: "Pending",
        type: "warning" as const,
        icon: Clock,
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      }
    default:
      return {
        label: "Active",
        type: "success" as const,
        icon: CheckCircle2,
        className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      }
  }
}

export const CurrentPlanCard: React.FC<ActivePlanProps> = React.memo(
  ({ plan, features, renewalDate, status = "active", billingCycle = "monthly" }: ActivePlanProps) => {
    if (!plan) return null
    
    const statusConfig = getStatusConfig(status)
    const StatusIcon = statusConfig.icon
    
    const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg hover:shadow-xl transition-all duration-300"
    
    return (
      <Card variant="default" className={cardClassName}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {plan.name} Plan
                </h3>
                {/* Subscription Status Badge */}
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
                  statusConfig.className
                )}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusConfig.label}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                You are currently on the {plan.name} plan.
              </p>
            </div>
            
            {/* Price */}
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">
                {plan.price.split('/')[0]}
              </div>
              <div className="text-sm text-muted-foreground">
                per {billingCycle === "monthly" ? "month" : "year"}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <ul className="space-y-3">
              {features.map((feature, i) => {
                const Icon = feature.icon ?? Check
                const value = plan.featureMap[feature.id]

                return (
                  <li key={`${feature.id}-${i}`} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Icon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-foreground">
                      {feature.label}
                      {typeof value === "string" || typeof value === "number" ? (
                        <span className="text-muted-foreground ml-1">
                          ({value})
                        </span>
                      ) : null}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Next Billing Date */}
          {renewalDate && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Next Billing Date</p>
              <p className="text-base font-semibold text-foreground">
                {renewalDate.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </Card>
    )
  }
)

/** --------------------------- Usage Overview ------------------------------- */
export const UsageOverviewCard: React.FC<UsageOverviewProps> = React.memo(
  ({
    title = "Usage Details",
    description = "Your resource consumption this billing cycle.",
    apiUsage,
    storageUsage,
    seatsUsage,
  }) => {
    const apiPercent = apiUsage ? Math.min(100, Math.round((apiUsage.used / apiUsage.total) * 100)) : 0
    const storagePercent = storageUsage ? Math.min(100, Math.round((storageUsage.used / storageUsage.total) * 100)) : 0
    const seatsPercent = seatsUsage ? Math.min(100, Math.round((seatsUsage.used / seatsUsage.total) * 100)) : 0

    const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg hover:shadow-xl transition-all duration-300"

    return (
      <Card variant="default" className={cardClassName}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          {/* API Usage */}
          {apiUsage && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  {apiUsage.label}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {apiUsage.used.toLocaleString()} / {apiUsage.total.toLocaleString()} {apiUsage.unit}
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${apiPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Seats Usage */}
          {seatsUsage && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  {seatsUsage.label}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {seatsUsage.used} / {seatsUsage.total}
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${seatsPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Storage Usage */}
          {storageUsage && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  {storageUsage.label} ({storageUsage.unit})
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {storageUsage.used} / {storageUsage.total} {storageUsage.unit}
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }
)

/** ------------------------------ Billing Table ----------------------------- */
export const BillingTable: React.FC<BillingTableProps> = React.memo(({
  invoices = [],
  onDownload,
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

  const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg hover:shadow-xl transition-all duration-300"

  return (
    <Card variant="default" className={cardClassName}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Billing History</h3>
          <p className="text-sm text-muted-foreground">View and download your past invoices.</p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border/50">
                <th className="py-3 px-4 font-semibold text-foreground">Date</th>
                <th className="py-3 px-4 font-semibold text-foreground">Amount</th>
                <th className="py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="py-3 px-4 font-semibold text-foreground">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {currentInvoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground opacity-50" />
                      </div>
                      <p className="text-muted-foreground font-medium">No billing history available</p>
                    </div>
                  </td>
                </tr>
              )}
              {currentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 text-foreground">{inv.date}</td>
                  <td className="py-3 px-4 font-semibold text-foreground">{inv.amount}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold",
                      inv.status === "Paid" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                      inv.status === "Pending" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                      inv.status === "Failed" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {inv.status === "Paid" && <CheckCircle2 className="w-3 h-3" />}
                      {inv.status === "Pending" && <Clock className="w-3 h-3" />}
                      {inv.status === "Failed" && <XCircle className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <ButtonWithIcon 
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs"
                        icon={<Download />}
                        onClick={() => onDownload?.(inv)}
                        disabled={!onDownload}
                      >
                        PDF
                      </ButtonWithIcon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <ButtonWithIcon 
                size="sm" 
                variant="outline" 
                disabled={currentPage === 1} 
                icon={<MoveLeft />}
                onClick={handlePrev}
              />
              <ButtonWithIcon
                size="sm" 
                icon={<MoveRight />}
                variant="outline" 
                disabled={currentPage === totalPages} 
                onClick={handleNext}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
})

/*** --------------------------- Payment Method ------------------------------ */
const getLast4 = (cardNumber: string) =>
  cardNumber.slice(-4)

export const PaymentMethodCard: React.FC<PaymentMethodProps> = React.memo(({
  card,
  onUpdate,
  onCancelSubscription,
  nextBillingDate,
  onSubscriptionCancelled,
}) => {
  const BrandIcon = card.brand
  const last4 = getLast4(card.cardNumber)
  const { openDialog } = useDialog();
  const [isCancelled, setIsCancelled] = useState<boolean>(false)

  // Auto-dismiss cancellation message after 3 seconds
  React.useEffect(() => {
    if (isCancelled) {
      const timer = setTimeout(() => {
        setIsCancelled(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isCancelled])

  const cardClassName = "rounded-2xl border border-border/50 bg-background shadow-lg hover:shadow-xl transition-all duration-300"

  return (
    <Card variant="default" className={cardClassName}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Payment Method</h3>
          <p className="text-sm text-muted-foreground">Your current payment details.</p>
        </div>
        
        {/* Card Display */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-background">
            <BrandIcon className="w-8 h-8 text-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground mb-1">
              VISA •••• •••• •••• {last4}
            </p>
            {(card.expiryMonth && card.expiryYear) && (
              <p className="text-sm text-muted-foreground">
                Expires {card.expiryMonth}/{card.expiryYear}
              </p>
            )}
          </div>
        </div>

        <ButtonWithIcon
          variant="default"
          size="md"
          className="w-full"
          icon={<Pencil />}
          onClick={onUpdate}
        >
          Update Payment Details
        </ButtonWithIcon>

      </div>
      
      {/* Danger Zone / Cancellation Success Message */}
      <div className="mt-6 border-border/50">
        {isCancelled ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Subscription cancelled.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">Danger Zone</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Permanently cancel your subscription. This action takes effect at the end of your current billing cycle.
                </p>
                <ButtonWithIcon
                  variant="danger"
                  size="md"
                  className="w-full text-white"
                  icon={<XCircle />}
                  onClick={() => {
                    if (onCancelSubscription) {
                      openDialog({
                        title: 'Cancel Subscription',
                        content: `Are you sure you want to cancel your subscription? Your subscription will remain active until ${nextBillingDate?.toLocaleDateString() || 'the end of your billing cycle'}. You'll lose access to premium features after cancellation, but you can reactivate anytime before the end of your billing period.`,
                        dialogType: 'confirm',
                        animationKey: 'popIn',
                        confirmationCallBack: () => {
                          onCancelSubscription()
                          onSubscriptionCancelled?.()
                          setIsCancelled(true)
                        },
                      })
                    } else {
                      openDialog({
                        title: 'Cancel Subscription',
                        content: `Are you sure you want to cancel your subscription? Your subscription will remain active until ${nextBillingDate?.toLocaleDateString() || 'the end of your billing cycle'}. You'll lose access to premium features after cancellation, but you can reactivate anytime before the end of your billing period.`,
                        dialogType: 'confirm',
                        animationKey: 'popIn',
                      confirmationCallBack: () => {
                        onSubscriptionCancelled?.()
                        setIsCancelled(true)
                      },
                      })
                    }
                  }}
                >
                  Cancel Subscription
                </ButtonWithIcon>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
})

/** ---------------------------- Billing Content ----------------------------- */
export const BillingContent:React.FC<BillingPageProps> = ({
  headerTitle,
  headerIcon,
  plans,
  features,
  showcurrentPlanId = true,
  showUsageOverview = true,
  showPricing = true,
  showBillingTable = true,
  currentPlanId = 0,
  renewalDate,
  subscriptionStatus = "active",
  billingCycle = "monthly",
  invoices,
  onInvoiceDownload,
  apiUsage,
  storageUsage,
  seatsUsage,
  onCancelSubscription,
  onUpdatePaymentMethod,
  renderUpdatePaymentMethod,
  card,
  isLoading = false,
}) => {
  const Icon = headerIcon
  const pricingRef = React.useRef<HTMLDivElement | null>(null)
  
  const activePlan = plans?.find(p => p.id === currentPlanId)
  
  const activePlanFeatures = React.useMemo(() => {
    if (!features || !activePlan) return []
    return features.filter((f) => {
      const value = activePlan.featureMap[f.id]
      return (value)
    })
  }, [features, activePlan])

  // Convert plans to PricingGrid format
  const pricingTiers: PricingTier[] = React.useMemo(() => {
    if (!plans || !features) return []
    
    return plans.map((plan) => {
      const priceMatch = plan.price.match(/\$(\d+)/);
      const priceValue = priceMatch ? priceMatch[1] : "0";
      const isMonthly = plan.price.toLowerCase().includes("/month");
      
      const planFeatures = features.map((feature) => {
        const value = plan.featureMap[feature.id];
        return {
          label: feature.label,
          available: value === true || (typeof value === "string" && value !== ""),
        };
      });

      return {
        name: plan.name,
        price: {
          monthly: `$${priceValue}`,
          annual: isMonthly ? `$${Math.round(parseInt(priceValue) * 12 * 0.9)}` : undefined,
        },
        description: "Perfect for growing businesses",
        features: planFeatures,
        ctaLabel: plan.ctaLabel || (plan.id === currentPlanId ? "Current Plan" : "Upgrade"),
        recommended: plan.recommended || false,
        cardColor: "purple",
      };
    });
  }, [plans, features, currentPlanId])

  return (
    <div className="min-h-screen bg-background">
      { headerTitle && (
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
              <Typography variant="h2" className="font-bold text-xl sm:text-2xl text-foreground">{headerTitle}</Typography>
            </div>
            <Avatar size="lg" />
          </div>
        </header>
      ) }

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your plan, payment methods, and billing history.</p>
        </div>


        {/* Current Plan and Usage */}
        <div className="grid md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              {showcurrentPlanId && <CurrentPlanCardSkeleton />}
              {showUsageOverview && <UsageOverviewCardSkeleton />}
            </>
          ) : (
            <>
              {showcurrentPlanId && activePlan && renewalDate && (
                <CurrentPlanCard 
                  plan={activePlan} 
                  features={activePlanFeatures} 
                  renewalDate={renewalDate} 
                  status={subscriptionStatus}
                  billingCycle={billingCycle}
                />
              )}
              {showUsageOverview && (
                <UsageOverviewCard
                  apiUsage={apiUsage}
                  storageUsage={storageUsage}
                  seatsUsage={seatsUsage}
                />
              )}
            </>
          )}
        </div>

        {/* Plan & Pricing Section */}
        {showPricing && (
          <div 
            ref={pricingRef} 
            className="space-y-4 rounded-lg border border-border bg-background/50"
          >
            {isLoading ? (
              <PricingGridSkeleton />
            ) : (
              <PricingGrid
                title="Plan & Pricing"
                description="Choose the plan that fits your needs. You can upgrade or downgrade at any time."
                tiers={pricingTiers}
                showToggle={true}
                scaleRecommended
              />
            )}
          </div>
        )}

        {/* Payment Method and Billing History */}
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {isLoading ? (
            <>
              <PaymentMethodCardSkeleton />
              {showBillingTable && <BillingTableSkeleton />}
            </>
          ) : (
            <>
              {card && (
                <PaymentMethodCard
                  card={card}
                  nextBillingDate={renewalDate}
                  onUpdate={onUpdatePaymentMethod}
                  onCancelSubscription={onCancelSubscription}
                />
              )}
              
              {showBillingTable && invoices && invoices.length > 0 && (
                <BillingTable
                  invoices={invoices}
                  onDownload={onInvoiceDownload}
                />
              )}
            </>
          )}
        </div>
        
        {renderUpdatePaymentMethod?.()}
      </main>
    </div>
  )
}

export const BillingPage:React.FC<BillingPageProps> = (props) => {
  return (
  <DialogProvider>
    <BillingContent {...props} />
  </DialogProvider>
  )
}
