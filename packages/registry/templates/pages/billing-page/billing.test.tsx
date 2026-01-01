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

  it("renders billing table with invoices", () => {
    render(
      <BillingPage
        plans={plans}
        features={features}
        invoices={invoices}
        card={card}
      />
    )

    expect(screen.getByText("Billing History")).toBeInTheDocument()
    expect(screen.getByText("Paid")).toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeInTheDocument()
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
      screen.getByRole("button", { name: /update payment method/i })
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
      screen.queryByRole("button", { name: /upgrade/i })
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

})
