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

  it("renders prices correctly using SplitPrice", () => {
    render(<PricingGrid plans={mockPlans} />)

    expect(screen.getAllByText("19")[0]).toBeInTheDocument()
    expect(screen.getAllByText("/ month")[0]).toBeInTheDocument()
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

    expect(toggle).toHaveAttribute("aria-pressed", "true")

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  it("renders vector UI decorations when modernUI=vector", () => {
    const { container } = render(
      <PricingGrid plans={mockPlans} modernUI="vector" />
    )

    expect(
      container.querySelector('[style*="clip-path"]')
    ).toBeTruthy()
  })

  it("renders CTA buttons", () => {
    render(<PricingGrid plans={mockPlans} />)

    expect(screen.getAllByText("Order Now").length).toBe(3)
  })

  it("calls onCtaClick with correct plan", () => {
    render(<PricingGrid plans={mockPlans} />)

    fireEvent.click(screen.getAllByText("Order Now")[0])

    expect(onCtaClick).toHaveBeenCalledTimes(1)
    expect(onCtaClick).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Starter" })
    )
  })
})
