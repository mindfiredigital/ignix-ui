import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ComparisonTable, Feature, Plan } from "."

export const resizeWindow = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  })
  window.dispatchEvent(new Event("resize"))
}

export const features: Feature[] = [
  { id: 1, label: "Unlimited Projects" },
  { id: 2, label: "Team Members" },
  { id: 3, label: "Support" },
]

export const plans: Plan[] = [
  {
    id: 1,
    name: "Basic",
    price: "$9/mo",
    ctaLabel: "Choose Basic",
    featureMap: {
      1: true,
      2: 1,
      3: false,
    },
  },
  {
    id: 2,
    name: "Pro",
    price: "$29/mo",
    recommended: true,
    ctaLabel: "Choose Pro",
    featureMap: {
      1: true,
      2: "Unlimited",
      3: true,
    },
  },
]

describe("ComparisonTable", () => {
  beforeEach(() => {
    resizeWindow(1280) // default to desktop
  })

  it("renders title and description", () => {
    render(
      <ComparisonTable
        title="Pricing Plans"
        description="Choose the plan that fits your needs"
        features={features}
        plans={plans}
      />
    )

    expect(
      screen.getByRole("heading", { name: /pricing plans/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/choose the plan that fits your needs/i)
    ).toBeInTheDocument()
  })

  it("renders feature labels column on desktop", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
      />
    )

    features.forEach(feature => {
      expect(screen.getByText(feature.label)).toBeInTheDocument()
    })
  })

  it("renders plan cards with prices", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
      />
    )

    expect(screen.getByText("Basic")).toBeInTheDocument()
    expect(screen.getByText("$9/mo")).toBeInTheDocument()

    expect(screen.getByText("Pro")).toBeInTheDocument()
    expect(screen.getByText("$29/mo")).toBeInTheDocument()
  })

  it("shows recommended badge for recommended plan", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
      />
    )

    expect(
      screen.getByText(/most popular/i)
    ).toBeInTheDocument()
  })

  it("renders check and cross icons for boolean feature values", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
      />
    )

    // aria-hidden icons exist
    const icons = document.querySelectorAll("svg")
    expect(icons.length).toBeGreaterThan(0)
  })

  it("renders mobile layout when viewport is below breakpoint", () => {
    resizeWindow(375)

    render(
      <ComparisonTable
        features={features}
        plans={plans}
        mobileBreakpoint="md"
      />
    )

    // In mobile view, feature labels appear inside each card
    expect(screen.getAllByText("Unlimited Projects").length).toBeGreaterThan(1)
  })

  it("renders CTA buttons with correct labels", async () => {
    const user = userEvent.setup()

    render(
      <ComparisonTable
        features={features}
        plans={plans}
      />
    )

    const basicBtn = screen.getByRole("button", { name: /choose basic/i })
    const proBtn = screen.getByRole("button", { name: /choose pro/i })

    expect(basicBtn).toBeInTheDocument()
    expect(proBtn).toBeInTheDocument()

    await user.click(proBtn)
  })

  it("applies light variant styles", () => {
    render(
      <ComparisonTable
        variant="light"
        features={features}
        plans={plans}
      />
    )

    // Root section should not be dark themed
    const section = document.querySelector("section")
    expect(section).toHaveClass("bg-white")
  })

  it("renders numeric and string feature values", () => {
    render(
      <ComparisonTable
        features={features}
        plans={plans}
      />
    )

    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("Unlimited")).toBeInTheDocument()
  })

  it("handles single plan gracefully on mobile", () => {
    render(
      <ComparisonTable
        features={features}
        plans={[plans[0]]}
      />
    )

    expect(screen.getByText("Basic")).toBeInTheDocument()
    expect(screen.queryByText("Pro")).not.toBeInTheDocument()
  })

  it("renders mobile view when viewport is below breakpoint", () => {
    resizeWindow(640)

    render(
      <ComparisonTable features={features} plans={plans} />
    )

    expect(screen.getByTestId("mobile-view")).toBeInTheDocument()
    expect(screen.queryByTestId("desktop-view")).not.toBeInTheDocument()
  })

})


