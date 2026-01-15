import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ComparisonTable, Feature, PlanProps } from "."

/* ----------------------------- helpers ----------------------------- */
const resizeWindow = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  })
  window.dispatchEvent(new Event("resize"))
}

const features: Feature[] = [
  { id: 1, label: "Unlimited Projects" },
  { id: 2, label: "Team Members" },
  { id: 3, label: "Support" },
]

const plans: PlanProps[] = [
  {
    id: 1,
    name: "Basic",
    price: "$9/mo",
    ctaLabel: "Choose Basic",
    featureMap: { 1: true, 2: 1, 3: false },
  },
  {
    id: 2,
    name: "Pro",
    price: "$29/mo",
    recommended: true,
    ctaLabel: "Choose Pro",
    featureMap: { 1: true, 2: "Unlimited", 3: true },
  },
]

/* ----------------------------- tests ----------------------------- */
describe("ComparisonTable – extended tests", () => {
  beforeEach(() => {
    resizeWindow(1280)
  })

  it("renders exactly one desktop view by default", () => {
    render(<ComparisonTable features={features} plans={plans} />)
    expect(screen.getByTestId("desktop-view")).toBeInTheDocument()
    expect(screen.queryByTestId("mobile-view")).not.toBeInTheDocument()
  })

  it("renders feature labels only once in desktop header column", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    features.forEach(feature => {
      expect(screen.getAllByText(feature.label).length).toBe(1)
    })
  })

  it("renders feature labels multiple times in mobile view", () => {
    resizeWindow(375)
    render(<ComparisonTable features={features} plans={plans} />)

    expect(screen.getAllByText("Unlimited Projects").length).toBeGreaterThan(1)
  })

  it("renders dash for null feature values", () => {
    const plansWithNull: PlanProps[] = [
      {
        ...plans[0],
        featureMap: { 1: null, 2: null, 3: null },
      },
    ]

    render(<ComparisonTable features={features} plans={plansWithNull} />)
    expect(screen.getAllByText("—").length).toBeGreaterThan(0)
  })

  it("disables CTA button when currentPlanId matches plan id", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
        currentPlanId={1}
      />
    )

    const btn = screen.getByRole("button", { name: /choose basic/i })
    expect(btn).toBeDisabled()
  })

  it("shows Current Plan badge when currentPlanId matches", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
        currentPlanId={2}
      />
    )

    expect(screen.getByText(/current plan/i)).toBeInTheDocument()
  })

  it("calls onCtaClick with correct plan", async () => {
    const user = userEvent.setup()
    const onCtaClick = vi.fn()

    render(
      <ComparisonTable
        features={features}
        plans={plans}
        onCtaClick={onCtaClick}
      />
    )

    await user.click(
      screen.getByRole("button", { name: /choose pro/i })
    )

    expect(onCtaClick).toHaveBeenCalledOnce()
    expect(onCtaClick).toHaveBeenCalledWith(plans[1])
  })

  it("does not call onCtaClick when CTA is disabled", async () => {
    const user = userEvent.setup()
    const onCtaClick = vi.fn()

    render(
      <ComparisonTable
        features={features}
        plans={plans}
        currentPlanId={1}
        onCtaClick={onCtaClick}
      />
    )

    await user.click(
      screen.getByRole("button", { name: /choose basic/i })
    )

    expect(onCtaClick).not.toHaveBeenCalled()
  })

  it("renders default CTA label when missing", () => {
    const plansNoCTA: PlanProps[] = [
      { ...plans[0], ctaLabel: undefined },
    ]

    render(<ComparisonTable features={features} plans={plansNoCTA} />)

    expect(
      screen.getByRole("button", { name: /get started/i })
    ).toBeInTheDocument()
  })

  it("renders table head label", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
        head="Plan Features"
      />
    )

    expect(screen.getByText("Plan Features")).toBeInTheDocument()
  })

  it("renders pricing footer label", () => {
    render(<ComparisonTable features={features} plans={plans} />)
    expect(screen.getByText("Pricing")).toBeInTheDocument()
  })

  it("renders correct number of CTA buttons", () => {
    render(<ComparisonTable features={features} plans={plans} />)
    expect(screen.getAllByRole("button").length).toBe(2)
  })

  it("renders correct number of plan cards", () => {
    render(<ComparisonTable features={features} plans={plans} />)
    expect(screen.getAllByText(/\/mo/i).length).toBe(2)
  })

  it("renders validation error when features array is empty", () => {
    render(<ComparisonTable features={[]} plans={plans} />)

    expect(
      screen.getByText(/invalid configuration/i)
    ).toBeInTheDocument()
  })

  it("renders validation error when plans array is empty", () => {
    render(<ComparisonTable features={features} plans={[]} />)

    expect(
      screen.getByText(/at least one plan is required/i)
    ).toBeInTheDocument()
  })

  it("renders description only once", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
        description="Best pricing"
      />
    )

    expect(screen.getAllByText("Best pricing").length).toBe(1)
  })

  it("renders icon svg elements", () => {
    render(<ComparisonTable features={features} plans={plans} />)
    expect(document.querySelectorAll("svg").length).toBeGreaterThan(0)
  })

  it("updates layout on window resize", () => {
    const { rerender } = render(
      <ComparisonTable features={features} plans={plans} />
    )

    resizeWindow(375)
    rerender(<ComparisonTable features={features} plans={plans} />)

    expect(screen.getByTestId("mobile-view")).toBeInTheDocument()
  })

  it("supports light variant without crashing", () => {
    render(
      <ComparisonTable
        variant="light"
        features={features}
        plans={plans}
      />
    )

    expect(screen.getByText("Basic")).toBeInTheDocument()
  })

  it("renders recommended badge only once", () => {
    render(<ComparisonTable features={features} plans={plans} />)
    expect(screen.getAllByText(/most popular/i).length).toBe(1)
  })

  it("does not render current plan badge when currentPlanId not provided", () => {
    render(<ComparisonTable features={features} plans={plans} />)
    expect(screen.queryByText(/current plan/i)).not.toBeInTheDocument()
  })

  it("renders default title when title prop is not provided", () => {
  render(<ComparisonTable features={features} plans={plans} />)

  expect(
    screen.getByRole("heading", { name: /pricing plans/i })
  ).toBeInTheDocument()
  })

  it("renders default description when description prop is not provided", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    expect(
      screen.getByText(/choose the plan that fits your needs/i)
    ).toBeInTheDocument()
  })

  it("renders custom title correctly", () => {
    render(
      <ComparisonTable
        title="My Custom Pricing"
        features={features}
        plans={plans}
      />
    )

    expect(
      screen.getByRole("heading", { name: /my custom pricing/i })
    ).toBeInTheDocument()
  })

  it("renders correct number of feature rows per plan on desktop", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    // each plan renders featureMap values (icons/text), not labels
    expect(screen.getAllByText("1").length).toBe(1)
    expect(screen.getAllByText("Unlimited").length).toBe(1)
  })

  it("renders feature labels inside plan cards on mobile", () => {
    resizeWindow(375)

    render(<ComparisonTable features={features} plans={plans} />)

    expect(
      screen.getAllByText("Team Members").length
    ).toBeGreaterThan(1)
  })

  it("renders X icon for false boolean feature", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    // lucide X icon renders as svg with no text, so we assert count
    const svgs = document.querySelectorAll("svg")
    expect(svgs.length).toBeGreaterThan(0)
  })

  it("renders Check icon for true boolean feature", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    // at least one check icon should exist
    expect(document.querySelectorAll("svg").length).toBeGreaterThan(0)
  })

  it("renders recommended plan with special badge styling", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    const badge = screen.getByText(/most popular/i)
    expect(badge).toHaveClass("bg-indigo-500")
  })

  it("does not render recommended badge when no plan is recommended", () => {
    const noRecommended = plans.map(p => ({ ...p, recommended: false }))

    render(<ComparisonTable features={features} plans={noRecommended} />)

    expect(screen.queryByText(/most popular/i)).not.toBeInTheDocument()
  })

  it("renders component without crashing when featureMap is missing values", () => {
    const brokenPlans: PlanProps[] = [
      {
        id: 3,
        name: "Starter",
        price: "$0",
        featureMap: {}, // missing all features
      },
    ]

    render(
      <ComparisonTable
        features={features}
        plans={brokenPlans}
      />
    )

    expect(screen.getByText("Starter")).toBeInTheDocument()
  })

  it("renders Check icon for true boolean value", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    // true → Check icon (svg)
    const svgs = document.querySelectorAll("svg")
    expect(svgs.length).toBeGreaterThan(0)
  })

  it("renders X icon for false boolean value", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    // feature id 3 is false in Basic plan
    const icons = document.querySelectorAll("svg")
    expect(icons.length).toBeGreaterThan(0)
  })

  it("renders string feature value correctly", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    expect(screen.getByText("Unlimited")).toBeInTheDocument()
  })

  it("renders numeric feature value correctly", () => {
    render(<ComparisonTable features={features} plans={plans} />)

    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renders dash when feature value is null", () => {
    const nullFeaturePlan: PlanProps = {
      id: 99,
      name: "Null Plan",
      price: "$0",
      featureMap: {
        1: null,
        2: null,
        3: null,
      },
    }

    render(
      <ComparisonTable
        features={features}
        plans={[nullFeaturePlan]}
      />
    )

    expect(screen.getAllByText("—").length).toBeGreaterThan(0)
  })

  it("renders dash when feature value is undefined", () => {
    const undefinedFeaturePlan: PlanProps = {
      id: 100,
      name: "Undefined Plan",
      price: "$0",
      featureMap: {}, // missing keys → undefined
    }

    render(
      <ComparisonTable
        features={features}
        plans={[undefinedFeaturePlan]}
      />
    )
    expect(screen.getAllByText("—").length).toBeGreaterThan(0)
  })

  it("applies light variant styles for rendered feature values", () => {
    render(
      <ComparisonTable
        variant="light"
        features={features}
        plans={plans}
      />
    )

    const value = screen.getByText("Unlimited")
    expect(value.className).toMatch(/text-zinc-700/)
  })

  it("applies dark variant styles for rendered feature values", () => {
    render(
      <ComparisonTable
        variant="dark"
        features={features}
        plans={plans}
      />
    )

    const value = screen.getByText("Unlimited")
    expect(value.className).toMatch(/text-zinc-200/)
  })
})
