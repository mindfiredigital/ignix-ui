import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { PricingGrid } from "."

/* -------------------- Mocks -------------------- */

vi.mock("@ignix-ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@ignix-ui/switch", () => ({
  Switch: ({ checked, onCheckedChange }: any) => (
    <button
      aria-pressed={checked}
      onClick={() => onCheckedChange(!checked)}
    >
      Toggle
    </button>
  ),
}))

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

/* -------------------- Mock Data -------------------- */

const onCtaClick = vi.fn()

const mockPlans = [
  {
    name: "Starter",
    price: "19/month",
    ctaLabel: "Order Now",
    features: [{ label: "Feature A" }, { label: "Feature B" }],
    onCtaClick,
  },
  {
    name: "Pro",
    price: "49/month",
    highlighted: true,
    ctaLabel: "Order Now",
    features: [{ label: "Feature C" }],
    onCtaClick,
  },
  {
    name: "Enterprise",
    price: "99/month",
    ctaLabel: "Order Now",
    features: [{ label: "Feature D", available: false }],
    onCtaClick,
  },
]

/* -------------------- Tests -------------------- */

describe("PricingGrid", () => {
  it("renders title and description", () => {
    render(
      <PricingGrid
        title="Pricing"
        description="Choose your plan"
        plans={mockPlans}
      />
    )

    expect(screen.getByText("Pricing")).toBeInTheDocument()
    expect(screen.getByText("Choose your plan")).toBeInTheDocument()
  })

  it("renders all plans", () => {
    render(<PricingGrid plans={mockPlans} />)

    expect(screen.getByText("Starter")).toBeInTheDocument()
    expect(screen.getByText("Pro")).toBeInTheDocument()
    expect(screen.getByText("Enterprise")).toBeInTheDocument()
  })

  it("renders highlighted plan", () => {
    render(<PricingGrid plans={mockPlans} />)

    expect(screen.getByText("Pro")).toBeInTheDocument()
  })

  it("renders feature list correctly", () => {
    render(<PricingGrid plans={mockPlans} />)

    expect(screen.getByText("Feature A")).toBeInTheDocument()
    expect(screen.getByText("Feature D")).toBeInTheDocument()
  })

  it("toggles paid/free switch", () => {
    render(<PricingGrid plans={mockPlans} />)

    const toggle = screen.getByRole("button", { name: "Toggle" })

    // Initial state is first toggle option, i.e., "monthly" → checked=false
    expect(toggle).toHaveAttribute("aria-pressed", "false")

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute("aria-pressed", "true")
  })

  it("renders vector UI decorations when modernUI=vector", () => {
    const { container } = render(
      <PricingGrid plans={mockPlans} modernUI="vector" />
    )

    // Check for presence of gradient-based vector card class
    expect(container.querySelector('.bg-gradient-to-r, .bg-gradient-to-br')).toBeTruthy()
  })

  it("renders CTA Labels", () => {
    render(<PricingGrid plans={mockPlans} />)

    expect(screen.getAllByText("Order Now").length).toBe(3)
  })

  it("calls onCtaClick with correct plan", () => {
    const onCtaClick = vi.fn()

    render(
      <PricingGrid
        plans={mockPlans}
        onCtaClick={onCtaClick}
      />
    )

    fireEvent.click(
      screen.getByLabelText("Starter plan action")
    )

    expect(onCtaClick).toHaveBeenCalledTimes(1)
    expect(onCtaClick).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Starter" })
    )
  })

  it("renders validation error when a plan has no features", () => {
    const plans = [
      {
        name: "Empty Plan",
        price: "0/month",
        ctaLabel: "Subscribe",
        features: [],
      },
    ]

    render(<PricingGrid plans={plans} />)

    expect(
      screen.getByText(/at least one feature is required/i)
    ).toBeInTheDocument()

    // Plan content should NOT render
    expect(screen.queryByText("Empty Plan")).not.toBeInTheDocument()
  })

  it("renders correctly when plan has unavailable features", () => {
    const plans = [
      { name: "Partial Plan", price: "20/month", ctaLabel: "Subscribe", features: [{ label: "Feature X", available: false }], onCtaClick }
    ]
    render(<PricingGrid plans={plans} />)

    expect(screen.getByText("Feature X")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()
  })

  it("renders correctly with custom toggleOptions", () => {
    const toggleOptions = [
      { label: "Weekly", value: "weekly" },
      { label: "Monthly", value: "monthly" }
    ]

    render(<PricingGrid plans={mockPlans} toggleOptions={toggleOptions} />)

    expect(screen.getByText("Weekly")).toBeInTheDocument()
    expect(screen.getByText("Monthly")).toBeInTheDocument()
  })

  it("handles onValueChange when toggle is clicked", () => {
    const handleValueChange = vi.fn()
    render(<PricingGrid plans={mockPlans} onValueChange={handleValueChange} />)

    const toggle = screen.getByRole("button", { name: "Toggle" })
    fireEvent.click(toggle)

    expect(handleValueChange).toHaveBeenCalledTimes(1)
    expect(handleValueChange).toHaveBeenCalledWith("yearly")
  })

  it("renders the current plan button when currentPlan={1}", () => {
    const plans = [
      { id:1, name: "Pro Plan", price: "49/month", ctaLabel: "Subscribe", features: [{ label: "Feature A" }], onCtaClick }
    ]
    render(<PricingGrid plans={plans} currentPlan={1}/>)

    expect(screen.getByText("Current Plan")).toBeInTheDocument()
  })

  it("renders multiple icons when provided in features", () => {
    const CustomIcon = () => <svg data-testid="custom-icon" />
    const plans = [
      { name: "Icon Plan", price: "10/month", ctaLabel: "Buy", features: [{ label: "Feature Y", icon: CustomIcon }], onCtaClick }
    ]
    render(<PricingGrid plans={plans} />)

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
  })

  it("renders correct gradient for vector mode with allowDifferentCardColors", () => {
    const plans = [
      { name: "Gradient Plan", price: "15/month", ctaLabel: "Buy", features: [{ label: "Feature Z" }], gradient: "bg-red-500", onCtaClick }
    ]
    const { container } = render(<PricingGrid plans={plans} modernUI="vector" allowDifferentCardColors />)

    expect(container.querySelector(".bg-red-500")).toBeTruthy()
  })

})
