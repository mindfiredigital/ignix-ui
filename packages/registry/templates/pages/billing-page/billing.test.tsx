import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { BillingPage } from "."
import type { Feature, PlanProps, Invoice, CardDetails } from "."
import { Check } from "lucide-react"
import { FaCcVisa } from "react-icons/fa"

/* -------------------------------------------------------------------------- */
/*                               Mock Ignix UI                                */
/* -------------------------------------------------------------------------- */
Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: vi.fn(),
})

vi.mock("@ignix-ui/dialogbox/use-dialog", () => ({
  useDialog: () => ({
    openDialog: vi.fn(),
  }),
}))

vi.mock("@ignix-ui/dialogbox", () => ({
  DialogProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

vi.mock("@ignix-ui/breadcrumbs", () => ({
  Breadcrumbs: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}))

// Ignix UI (manual mocks)
vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@ignix-ui/comparison-table", () => ({
  ComparisonTable: ({ plans, currentPlanId }: any) => (
    <div>
      <h2>Simple Pricing</h2>

      {plans.map((plan: any) => (
        <div key={plan.id}>
          {plan.recommended && <span>Most Popular</span>}
          <button
            disabled={plan.id === currentPlanId}
            aria-label={plan.name}
          >
            {plan.name}
          </button>
        </div>
      ))}
    </div>
  ),
}))

/* -------------------------------------------------------------------------- */
/*                                   Mocks                                    */
/* -------------------------------------------------------------------------- */

const features: Feature[] = [
  { id: 1, label: "API Access", icon: Check },
  { id: 2, label: "Team Members", icon: Check },
  { id: 3, label: "Priority Support", icon: Check },
]

const plans: PlanProps[] = [
  {
    id: 1,
    name: "Starter",
    ctaLabel: "Starter",
    price: "$10 / mo",
    featureMap: {
      1: true,
      2: false,
      3: false,
    },
  },
  {
    id: 2,
    name: "Pro",
    price: "$30 / mo",
    ctaLabel: "pro",
    recommended: true,
    featureMap: {
      1: true,
      2: true,
      3: true,
    },
  },
]

const invoices: Invoice[] = [
  {
    id: "inv-1",
    plan: "Starter",
    date: "2024-01-01",
    amount: "$10",
    status: "Paid",
  },
  {
    id: "inv-2",
    plan: "Starter",
    date: "2024-02-01",
    amount: "$10",
    status: "Pending",
  },
]

const card: CardDetails = {
  brand: FaCcVisa,
  cardNumber: "4111111111111111",
  expiryMonth: "12",
  expiryYear: "25",
}

/* -------------------------------------------------------------------------- */
/*                                 Test Suite                                 */
/* -------------------------------------------------------------------------- */

describe("BillingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders header and security notice", () => {
    render(
      <BillingPage
        headerTitle="Billing"
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(screen.getByText("Billing")).toBeInTheDocument()

    expect(
      screen.getByRole("link", { name: /billing/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Billing information is securely managed.")
    ).toBeInTheDocument()
  })

  it("Render default header Title when no headerTitle given", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(screen.getByText("OpenSrc")).toBeInTheDocument()
  })

  it("renders breadcrumbs", () => {
    render(<BillingPage plans={plans} features={features} card={card} />)

    // Use getByRole or getByText with regex to avoid exact text issues
    expect(screen.getByLabelText("breadcrumbs")).toBeInTheDocument()
  })

  it("renders secure billing notice", () => {
    render(<BillingPage plans={plans} features={features} card={card} />)
    expect(
      screen.getByText(/billing information is securely managed/i)
    ).toBeInTheDocument()
  })

  it("renders payment method section", () => {
    render(<BillingPage plans={plans} features={features} card={card} />)
    expect(screen.getByLabelText("payment-head")).toBeInTheDocument()
  })

  it("renders masked card number", () => {
    render(<BillingPage plans={plans} features={features} card={card} />)
    expect(screen.getByText(/1111$/)).toBeInTheDocument()
  })

  it("renders expiry date", () => {
    render(<BillingPage plans={plans} features={features} card={card} />)
    expect(screen.getByText(/expire/i)).toBeInTheDocument()
  })

  it("renders current plan with filtered features", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        renewalDate={new Date("2025-01-01")}
        card={card}
      />
    )

    expect(screen.getByText("Starter")).toBeInTheDocument()
    expect(screen.getByText("$10 / mo")).toBeInTheDocument()

    // Only enabled features should render
    expect(screen.getByText("API Access")).toBeInTheDocument()
    expect(screen.queryByText("Team Members")).not.toBeInTheDocument()
  })

  it("shows usage overview when enabled", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        apiUsage={{ label: "API Calls", used: 500, total: 1000 }}
      />
    )

    expect(screen.getByText("Usage Overview")).toBeInTheDocument()
    expect(screen.getByText("API Calls")).toBeInTheDocument()
    expect(screen.getByText(/500 \/ 1,000/)).toBeInTheDocument()
  })

  it("renders billing table", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        invoices={invoices}
        card={card}
      />
    )
    expect(screen.queryByText("Billing History")).toBeInTheDocument()
  })

  it("fires invoice action callbacks", async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const onDownload = vi.fn()
    const onDelete = vi.fn()

    render(
      <BillingPage
        plans={plans}
        features={features}
        invoices={invoices}
        card={card}
        onInvoiceView={onView}
        onInvoiceDownload={onDownload}
        onInvoiceDelete={onDelete}
      />
    )

    await user.click(screen.getAllByLabelText("view-invoice")[0])
    await user.click(screen.getAllByLabelText("download-invoice")[0])
    await user.click(screen.getAllByLabelText("delete-invoice")[0])

    expect(onView).toHaveBeenCalledOnce()
    expect(onDownload).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it("renders payment method with masked card number", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(screen.getByText("Payment Method")).toBeInTheDocument()
    expect(screen.getByText(/•••• •••• •••• 1111/)).toBeInTheDocument()
    expect(screen.getByText("Expires 12/25")).toBeInTheDocument()
  })

  it("calls onUpdatePaymentMethod when button is clicked", async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()

    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        onUpdatePaymentMethod={onUpdate}
      />
    )

    await user.click(
      screen.getByLabelText("update-payment")
    )

    expect(onUpdate).toHaveBeenCalledOnce()
  })

  it("reveals comparison table after clicking Upgrade", async () => {
    const user = userEvent.setup()

    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        renewalDate={new Date()}
        card={card}
        showPricing={false}
      />
    )

    await user.click(screen.getByRole("button", { name: /upgrade/i }))

    expect(screen.getByText("Simple Pricing")).toBeInTheDocument()
    expect(screen.getByText("Pro")).toBeInTheDocument()
  })

  it("hides sections based on flags", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        showBillingTable={false}
        showUsageOverview={false}
        showcurrentPlanId={false}
      />
    )

    expect(screen.queryByText("Billing History")).not.toBeInTheDocument()
    expect(screen.queryByText("Usage Overview")).not.toBeInTheDocument()
    expect(screen.queryByText("Starter")).not.toBeInTheDocument()
  })

  it("displays renewal date for the active plan", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        renewalDate={new Date("2025-03-15")}
        card={card}
      />
    )

    expect(
      screen.getByText(/15 mar 2025/i)
    ).toBeInTheDocument()
  })

  it("does not show upgrade button if no current plan is selected", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        currentPlanId={0}
      />
    )

    expect(
      screen.queryByRole("button", { name: /upgrade-plan/i })
    ).not.toBeInTheDocument()
  })

  it("shows recommended badge for recommended plan", async () => {
    const user = userEvent.setup()

    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        showPricing
        currentPlanId={1}
        renewalDate={new Date()}
      />
    )

    await user.click(
      screen.getByRole("button", { name: /upgrade-plan/i })
    )

    expect(screen.getByText("Most Popular")).toBeInTheDocument()
  })

  it("disables CTA for the active plan in comparison table", async () => {
    const user = userEvent.setup()

    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        renewalDate={new Date()}
        card={card}
      />
    )

    await user.click(
      screen.getByRole("button", { name: /upgrade-plan/i })
    )

    const starterButton = screen.getByRole("button", {
      name: "Starter",
    })

    expect(starterButton).toBeDisabled()
  })

  it("renders without crashing when no optional props are passed", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(screen.getByText("Payment Method")).toBeInTheDocument()
  })

  it("does not render usage overview when apiUsage is undefined", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(screen.queryByLabelText("api-usage")).not.toBeInTheDocument()
  })

  it("does not render usage overview when storageUsage is undefined", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(screen.queryByLabelText("storage-usage")).not.toBeInTheDocument()
  })

  it("does not render usage overview when seats Usage is undefined", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(screen.queryByLabelText("seats-usage")).not.toBeInTheDocument()
  })

  it("renders zero usage correctly", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        apiUsage={{ label: "API Calls", used: 200, total: 1000 }}
      />
    )
    expect(screen.getByText(/200 \/ 1,000/i)).toBeInTheDocument()
    expect(screen.getByText(/20%/i)).toBeInTheDocument()
    expect(screen.getByText(/calls/i)).toBeInTheDocument()
  })

  it("renders full usage correctly", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        apiUsage={{ label: "API Calls", used: 1000, total: 1000 }}
      />
    )
    
    expect(screen.getByText(/1,000 \/ 1,000/i)).toBeInTheDocument()
    expect(screen.getByText(/100%/i)).toBeInTheDocument()
    expect(screen.getByText(/calls/i)).toBeInTheDocument()
  })

  it("renders multiple invoices correctly", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        invoices={invoices}
        card={card}
      />
    )

    expect(screen.getAllByText("Starter").length).toBeGreaterThan(0)
  })

  it("does not call invoice callbacks if not provided", async () => {
    const user = userEvent.setup()

    render(
      <BillingPage
        plans={plans}
        features={features}
        invoices={invoices}
        card={card}
      />
    )

    await user.click(screen.getAllByLabelText("view-invoice")[0])
  })

  it("renders correct card brand icon", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
      />
    )

    expect(
      screen.getByLabelText("brand-icon")
    ).toBeInTheDocument()
  })

  it("renders masked card number even for different card number", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={{
          ...card,
          cardNumber: "5555555555554444",
        }}
      />
    )

    expect(
      screen.getByText(/•••• •••• •••• 4444/)
    ).toBeInTheDocument()
  })

  it("renders upgrade button when currentPlanId is valid", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        card={card}
        renewalDate={new Date()} 
        showcurrentPlanId
      />
    )

    expect(
      screen.getByRole("button", { name: /upgrade-plan/i })
    ).toBeInTheDocument()
  })

  it("does not render comparison table initially when showPricing=false", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        showPricing={false}
      />
    )

    expect(
      screen.queryByText("Simple Pricing")
    ).not.toBeInTheDocument()
  })

  it("renders comparison table when showPricing=true by default", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        showPricing
      />
    )

    expect(screen.getByText("Simple Pricing")).toBeInTheDocument()
  })

  it("renders all plans in comparison table", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        showPricing
      />
    )

    expect(screen.getByText("Starter")).toBeInTheDocument()
    expect(screen.getByText("Pro")).toBeInTheDocument()
  })

  it("renders recommended badge only once", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        card={card}
        showPricing
      />
    )

    expect(
      screen.getAllByText("Most Popular").length
    ).toBe(1)
  })

  it("disables active plan button in comparison table", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        card={card}
        showPricing
      />
    )

    expect(
      screen.getByRole("button", { name: "Starter" })
    ).toBeDisabled()
  })

  it("keeps non-active plan button enabled", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        card={card}
        showPricing
      />
    )

    expect(
      screen.getByRole("button", { name: "Pro" })
    ).not.toBeDisabled()
  })

  it("renders Billing Table correctly on mobile view", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        card={card}
        showPricing
        invoices={invoices}
      />
    )

    const planHeader = screen.getByText("Plan")
    expect(planHeader).toBeInTheDocument()

    const amountHeader = screen.getByText("Amount")
    expect(amountHeader).toBeInTheDocument()

    const statusHeader = screen.getByText("Status")
    expect(statusHeader).toHaveClass("hidden", "sm:table-cell")
  })

  it("paginates invoices correctly", async () => {
    const manyInvoices = Array.from({ length: 7 }, (_, i) => ({
      id: `inv-${i}`,
      plan: `Plan ${i}`,
      date: "2025-01-01",
      amount: `$${i * 10}`,
      status: "Paid" as const,
    }))

    const user = userEvent.setup()

    render(
      <BillingPage
        plans={plans}
        features={features}
        currentPlanId={1}
        card={card}
        invoices={manyInvoices}
      />
    )

    // Default shows first 3 items
    expect(screen.getByText("Plan 0")).toBeInTheDocument()
    expect(screen.getByText("Plan 2")).toBeInTheDocument()

    // Click next page
    const nextBtn = screen.getByRole("button", { name: /move-right/i })
    await user.click(nextBtn)

    // Now next 3 items appear
    expect(screen.getByText("Plan 3")).toBeInTheDocument()
    expect(screen.queryByText("Plan 0")).not.toBeInTheDocument()
  })

  it("fires onView, onDownload, onDelete for invoice actions", async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const onDownload = vi.fn()
    const onDelete = vi.fn()

    render(
      <BillingPage
        card={card}
        invoices={invoices}
        onInvoiceView={onView}
        onInvoiceDownload={onDownload}
        onInvoiceDelete={onDelete}
      />
    )

    await user.click(screen.getAllByLabelText("view-invoice")[0])
    await user.click(screen.getAllByLabelText("download-invoice")[0])
    await user.click(screen.getAllByLabelText("delete-invoice")[0])

    expect(onView).toHaveBeenCalledOnce()
    expect(onDownload).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it("renders empty billing table message when no invoices", () => {
    render(<BillingPage plans={plans}
        features={features}
        currentPlanId={1}
        card={card} invoices={[]} />)
    expect(screen.getByText("No billing history available")).toBeVisible()
  })

  it("renders Billing Table correctly on tablet view", () => {
    window.innerWidth = 768 // Tailwind md breakpoint
    window.dispatchEvent(new Event("resize"))

    render(<BillingPage plans={plans}
        features={features}
        currentPlanId={1}
        card={card} invoices={invoices} />)

    // Date and Status should now be visible
    expect(screen.getByText("Date")).toBeVisible()
    expect(screen.getByText("Status")).toBeVisible()
  })

   it("renders CurrentPlanCard when active plan and renewal date exist", () => {
    render(<BillingPage plans={plans} features={features} currentPlanId={1} renewalDate={new Date()} card={card} />)
    expect(screen.getByLabelText("current-plan")).toBeInTheDocument()
  })

  it("fires invoice actions callbacks", async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const onDownload = vi.fn()
    const onDelete = vi.fn()

    render(
      <BillingPage
        invoices={invoices}
        onInvoiceView={onView}
        onInvoiceDownload={onDownload}
        onInvoiceDelete={onDelete}
        card={card}
      />
    )

    const viewButtons = screen.getAllByRole("button", { name: /view-invoice/i })
    const downloadButtons = screen.getAllByRole("button", { name: /download-invoice/i })
    const deleteButtons = screen.getAllByRole("button", { name: /delete-invoice/i })

    await user.click(viewButtons[0])
    await user.click(downloadButtons[0])
    await user.click(deleteButtons[0])
  })

  it("applies correct text color class for each status", () => {
    render(<BillingPage card={card} invoices={invoices} />)

    // Paid → text-green-500
    const paidCell = screen.getByText("Paid")
    expect(paidCell).toHaveClass("text-green-500")

    // Pending → text-yellow-500
    const pendingCell = screen.getByText("Pending")
    expect(pendingCell).toHaveClass("text-yellow-500")

  })

  it("shows 'No billing history available' when invoices is empty", () => {
    render(<BillingPage invoices={[]} card={card} />)
    expect(screen.getByText(/No billing history available/i)).toBeInTheDocument()
  })

})
