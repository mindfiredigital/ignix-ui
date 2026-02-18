import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

/* -------------------- Mocks -------------------- */

vi.mock("@ignix-ui/button", () => {
  return {
    Button: React.forwardRef(({ children, onClick, className, variant, size, ...props }: any, ref: any) => {
      return React.createElement("button", {
        ref,
        onClick,
        className,
        "data-variant": variant,
        "data-size": size,
        ...props,
      }, children)
    }),
  }
})

import { PricingGrid } from "."
import React from "react"

vi.mock("lucide-react", () => ({
  Check: ({ className, ...props }: any) => (
    <svg data-testid="check-icon" className={className} {...props} />
  ),
}))

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, initial: _initial, animate: _animate, transition: _transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    li: ({ children, initial: _initial, animate: _animate, transition: _transition, ...props }: any) => (
      <li {...props}>{children}</li>
    ),
    span: ({ children, initial: _initial, animate: _animate, transition: _transition, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
}))

vi.mock("../../../utils/cn", () => ({
  cn: (...args: any[]) => {
    return args.filter(Boolean).join(" ")
  },
}))

/* -------------------- Mock Data -------------------- */

const mockTiers = [
  {
    name: "Starter",
    price: {
      monthly: "$9 /mo",
      annual: "$7 /mo",
    },
    description: "Perfect for getting started",
    features: [
      { label: "Up to 3 projects" },
      { label: "1 GB storage" },
      { label: "Basic analytics" },
    ],
    ctaLabel: "Get Started",
    recommended: false,
  },
  {
    name: "Pro",
    price: {
      monthly: "$29 /mo",
      annual: "$23 /mo",
    },
    description: "For growing teams",
    features: [
      { label: "Unlimited projects" },
      { label: "50 GB storage" },
      { label: "Advanced analytics" },
      { label: "Priority support" },
    ],
    ctaLabel: "Start Free Trial",
    recommended: true,
  },
  {
    name: "Enterprise",
    price: {
      monthly: "$99 /mo",
    },
    description: "For organizations",
    features: [
      { label: "Everything in Pro" },
      { label: "Custom integrations" },
      { label: "Dedicated support", available: false },
    ],
    ctaLabel: "Contact Sales",
    recommended: false,
  },
]

const onCtaClick = vi.fn()

/* -------------------- Tests -------------------- */

describe("PricingGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Basic Rendering Tests (1-10)
  describe("Basic Rendering", () => {
    it("renders default title and description", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Plans that scale")).toBeInTheDocument()
      expect(screen.getByText("with your growth")).toBeInTheDocument()
      expect(
        screen.getByText("Start free, upgrade when you're ready. No hidden fees, cancel anytime.")
      ).toBeInTheDocument()
    })

    it("renders custom title and description", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          title="Custom Title"
          titleHighlight="Custom Highlight"
          description="Custom description"
        />
      )
      expect(screen.getByText("Custom Title")).toBeInTheDocument()
      expect(screen.getByText("Custom Highlight")).toBeInTheDocument()
      expect(screen.getByText("Custom description")).toBeInTheDocument()
    })

    it("renders PRICING label", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("PRICING")).toBeInTheDocument()
    })

    it("renders all tier names", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
      expect(screen.getByText("Pro")).toBeInTheDocument()
      expect(screen.getByText("Enterprise")).toBeInTheDocument()
    })

    it("renders tier descriptions", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Perfect for getting started")).toBeInTheDocument()
      expect(screen.getByText("For growing teams")).toBeInTheDocument()
      expect(screen.getByText("For organizations")).toBeInTheDocument()
    })

    it("renders monthly prices by default", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("$9")).toBeInTheDocument()
      expect(screen.getByText("$29")).toBeInTheDocument()
      expect(screen.getByText("$99")).toBeInTheDocument()
    })

    it("renders CTA labels", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Get Started")).toBeInTheDocument()
      expect(screen.getByText("Start Free Trial")).toBeInTheDocument()
      expect(screen.getByText("Contact Sales")).toBeInTheDocument()
    })

    it("renders default CTA label when not provided", () => {
      const tiersWithoutCta = [
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithoutCta} />)
      expect(screen.getAllByText("Get Started").length).toBeGreaterThan(0)
    })

    it("renders features list", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Up to 3 projects")).toBeInTheDocument()
      expect(screen.getByText("Unlimited projects")).toBeInTheDocument()
      expect(screen.getByText("Everything in Pro")).toBeInTheDocument()
    })

    it("renders WHAT'S INCLUDED heading", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const headings = screen.getAllByText("WHAT'S INCLUDED")
      expect(headings.length).toBeGreaterThan(0)
    })
  })

  // Recommended Badge Tests (11-15)
  describe("Recommended Badge", () => {
    it("renders recommended badge for recommended tier", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("MOST POPULAR")).toBeInTheDocument()
    })

    it("does not render badge for non-recommended tiers", () => {
      const tiersWithoutRecommended = [
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          recommended: false,
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
          recommended: false,
        },
      ]
      render(<PricingGrid tiers={tiersWithoutRecommended} />)
      expect(screen.queryByText("MOST POPULAR")).not.toBeInTheDocument()
    })

    it("renders badge with custom color", () => {
      const tiersWithCustomBadge = [
        {
          name: "Pro",
          price: { monthly: "$29 /mo" },
          features: [{ label: "Feature A" }],
          recommended: true,
          badgeColor: "bg-blue-600 text-white",
        },
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature B" }],
          recommended: false,
        },
      ]
      render(<PricingGrid tiers={tiersWithCustomBadge} />)
      expect(screen.getByText("MOST POPULAR")).toBeInTheDocument()
    })

    it("handles multiple recommended tiers", () => {
      const multipleRecommended = [
        {
          name: "Plan A",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          recommended: true,
        },
        {
          name: "Plan B",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
          recommended: true,
        },
      ]
      render(<PricingGrid tiers={multipleRecommended} />)
      const badges = screen.getAllByText("MOST POPULAR")
      expect(badges.length).toBe(2)
    })

    it("renders badge with white text on image background", () => {
      const tierWithImage = [
        {
          name: "Pro",
          price: { monthly: "$29 /mo" },
          features: [{ label: "Feature A" }],
          recommended: true,
          cardBackgroundImage: "https://example.com/image.jpg",
          badgeColor: "bg-white text-gray-900",
        },
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature B" }],
          recommended: false,
        },
      ]
      render(<PricingGrid tiers={tierWithImage} />)
      expect(screen.getByText("MOST POPULAR")).toBeInTheDocument()
    })
  })

  // Toggle Functionality Tests (16-25)
  describe("Billing Toggle", () => {
    it("renders toggle by default", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Monthly")).toBeInTheDocument()
      expect(screen.getByText("Annual")).toBeInTheDocument()
    })

    it("hides toggle when showToggle is false", () => {
      render(<PricingGrid tiers={mockTiers} showToggle={false} />)
      expect(screen.queryByText("Monthly")).not.toBeInTheDocument()
      expect(screen.queryByText("Annual")).not.toBeInTheDocument()
    })

    it("displays monthly prices by default", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("$9")).toBeInTheDocument()
      expect(screen.getByText("$29")).toBeInTheDocument()
    })

    it("switches to annual prices when annual is clicked", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const annualButton = screen.getByText("Annual")
      fireEvent.click(annualButton)
      expect(screen.getByText("$7")).toBeInTheDocument()
      expect(screen.getByText("$23")).toBeInTheDocument()
    })

    it("switches back to monthly prices when monthly is clicked", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const annualButton = screen.getByText("Annual")
      const monthlyButton = screen.getByText("Monthly")
      fireEvent.click(annualButton)
      fireEvent.click(monthlyButton)
      expect(screen.getByText("$9")).toBeInTheDocument()
      expect(screen.getByText("$29")).toBeInTheDocument()
    })

    it("uses defaultBilling prop correctly", () => {
      render(<PricingGrid tiers={mockTiers} defaultBilling="annual" />)
      expect(screen.getByText("$7")).toBeInTheDocument()
      expect(screen.getByText("$23")).toBeInTheDocument()
    })

    it("displays annual discount indicator", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("-20%")).toBeInTheDocument()
    })

    it("handles tiers without annual pricing", () => {
      const tiersWithoutAnnual = [
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithoutAnnual} />)
      const annualButton = screen.getByText("Annual")
      fireEvent.click(annualButton)
      expect(screen.getByText("$10")).toBeInTheDocument()
    })

    it("applies custom toggle active color", () => {
      render(
        <PricingGrid tiers={mockTiers} toggleActiveColor="bg-blue-600" />
      )
      const monthlyButton = screen.getByText("Monthly")
      expect(monthlyButton).toBeInTheDocument()
    })

    it("maintains toggle state across re-renders", () => {
      const { rerender } = render(<PricingGrid tiers={mockTiers} />)
      const annualButton = screen.getByText("Annual")
      fireEvent.click(annualButton)
      rerender(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("$7")).toBeInTheDocument()
    })
  })

  // CTA Click Tests (26-30)
  describe("CTA Button Clicks", () => {
    it("calls onCtaClick when button is clicked", () => {
      render(<PricingGrid tiers={mockTiers} onCtaClick={onCtaClick} />)
      const buttons = screen.getAllByRole("button")
      const ctaButton = buttons.find((btn) => btn.textContent === "Get Started")
      if (ctaButton) {
        fireEvent.click(ctaButton)
        expect(onCtaClick).toHaveBeenCalledTimes(1)
        expect(onCtaClick).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Starter" }),
          "monthly"
        )
      }
    })

    it("calls onCtaClick with correct billing period", () => {
      render(<PricingGrid tiers={mockTiers} onCtaClick={onCtaClick} defaultBilling="annual" />)
      const buttons = screen.getAllByRole("button")
      const ctaButton = buttons.find((btn) => btn.textContent === "Get Started")
      if (ctaButton) {
        fireEvent.click(ctaButton)
        expect(onCtaClick).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Starter" }),
          "annual"
        )
      }
    })

    it("calls onCtaClick for each tier separately", () => {
      render(<PricingGrid tiers={mockTiers} onCtaClick={onCtaClick} />)
      const buttons = screen.getAllByRole("button")
      const starterButton = buttons.find((btn) => btn.textContent === "Get Started")
      const proButton = buttons.find((btn) => btn.textContent === "Start Free Trial")
      if (starterButton) fireEvent.click(starterButton)
      if (proButton) fireEvent.click(proButton)
      expect(onCtaClick).toHaveBeenCalledTimes(2)
    })

    it("does not call onCtaClick when prop is not provided", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const buttons = screen.getAllByRole("button")
      const ctaButton = buttons.find((btn) => btn.textContent === "Get Started")
      if (ctaButton) {
        fireEvent.click(ctaButton)
        expect(onCtaClick).not.toHaveBeenCalled()
      }
    })

    it("handles click on recommended tier", () => {
      render(<PricingGrid tiers={mockTiers} onCtaClick={onCtaClick} />)
      const buttons = screen.getAllByRole("button")
      const proButton = buttons.find((btn) => btn.textContent === "Start Free Trial")
      if (proButton) {
        fireEvent.click(proButton)
        expect(onCtaClick).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Pro", recommended: true }),
          "monthly"
        )
      }
    })
  })

  // Feature Availability Tests (31-35)
  describe("Feature Availability", () => {
    it("renders check icon for available features", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const checkIcons = screen.getAllByTestId("check-icon")
      expect(checkIcons.length).toBeGreaterThan(0)
    })

    it("renders unavailable features with opacity", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const unavailableFeature = screen.getByText("Dedicated support")
      expect(unavailableFeature).toBeInTheDocument()
    })

    it("handles features without available property", () => {
      const tiersWithDefaultFeatures = [
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithDefaultFeatures} />)
      expect(screen.getByText("Feature A")).toBeInTheDocument()
      const checkIcons = screen.getAllByTestId("check-icon")
      expect(checkIcons.length).toBeGreaterThan(0)
    })

    it("renders multiple features correctly", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Up to 3 projects")).toBeInTheDocument()
      expect(screen.getByText("1 GB storage")).toBeInTheDocument()
      expect(screen.getByText("Basic analytics")).toBeInTheDocument()
    })

    it("handles empty features array", () => {
      const tiersWithNoFeatures = [
        {
          name: "Empty",
          price: { monthly: "$10 /mo" },
          features: [],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature A" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithNoFeatures} />)
      expect(screen.getByText("Empty")).toBeInTheDocument()
    })
  })

  // Color Customization Tests (36-45)
  describe("Color Customization", () => {
    it("applies cardColor to generate color classes", () => {
      const tiersWithCardColor = [
        {
          name: "Blue Plan",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardColor: "blue",
        },
        {
          name: "Red Plan",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
          cardColor: "red",
        },
      ]
      render(<PricingGrid tiers={tiersWithCardColor} />)
      expect(screen.getByText("Blue Plan")).toBeInTheDocument()
    })

    it("applies custom borderColor", () => {
      const tiersWithBorder = [
        {
          name: "Custom Border",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          borderColor: "border-red-500",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithBorder} />)
      expect(screen.getByText("Custom Border")).toBeInTheDocument()
    })

    it("applies custom buttonColor", () => {
      const tiersWithButtonColor = [
        {
          name: "Custom Button",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          buttonColor: "bg-green-600 hover:bg-green-700",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithButtonColor} />)
      expect(screen.getByText("Custom Button")).toBeInTheDocument()
    })

    it("applies custom buttonTextColor", () => {
      const tiersWithTextColor = [
        {
          name: "Custom Text",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          buttonTextColor: "text-yellow-600",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithTextColor} />)
      expect(screen.getByText("Custom Text")).toBeInTheDocument()
    })

    it("applies custom badgeColor", () => {
      const tiersWithBadgeColor = [
        {
          name: "Pro",
          price: { monthly: "$29 /mo" },
          features: [{ label: "Feature A" }],
          recommended: true,
          badgeColor: "bg-orange-600 text-white",
        },
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature B" }],
          recommended: false,
        },
      ]
      render(<PricingGrid tiers={tiersWithBadgeColor} />)
      expect(screen.getByText("MOST POPULAR")).toBeInTheDocument()
    })

    it("overrides cardColor with individual color props", () => {
      const tiersWithOverride = [
        {
          name: "Override",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardColor: "blue",
          buttonColor: "bg-red-600",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithOverride} />)
      expect(screen.getByText("Override")).toBeInTheDocument()
    })

    it("applies different colors for recommended vs non-recommended", () => {
      const mixedTiers = [
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardColor: "purple",
          recommended: false,
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
          cardColor: "purple",
          recommended: true,
        },
      ]
      render(<PricingGrid tiers={mixedTiers} />)
      expect(screen.getByText("Basic")).toBeInTheDocument()
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("applies cardBackgroundColor", () => {
      const tiersWithBg = [
        {
          name: "Background",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundColor: "bg-gray-100",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithBg} />)
      expect(screen.getByText("Background")).toBeInTheDocument()
    })

    it("handles multiple color names", () => {
      const colorNames = ["blue", "purple", "green", "orange", "pink"]
      colorNames.forEach((color) => {
        const tiers = [
          {
            name: `${color} Plan`,
            price: { monthly: "$10 /mo" },
            features: [{ label: "Feature A" }],
            cardColor: color,
          },
          {
            name: "Pro",
            price: { monthly: "$20 /mo" },
            features: [{ label: "Feature B" }],
          },
        ]
        const { unmount } = render(<PricingGrid tiers={tiers} />)
        expect(screen.getByText(`${color} Plan`)).toBeInTheDocument()
        unmount()
      })
    })

    it("applies global accentColor", () => {
      render(<PricingGrid tiers={mockTiers} accentColor="text-blue-600" />)
      expect(screen.getByText("with your growth")).toBeInTheDocument()
    })
  })

  // Background Image Tests (46-50)
  describe("Background Images", () => {
    it("applies cardBackgroundImage", () => {
      const tiersWithImage = [
        {
          name: "Image Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundImage: "https://example.com/image.jpg",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      const { container } = render(<PricingGrid tiers={tiersWithImage} />)
      const card = container.querySelector('[style*="background-image"]')
      expect(card).toBeTruthy()
    })

    it("applies cardBackgroundOverlay", () => {
      const tiersWithOverlay = [
        {
          name: "Overlay Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundImage: "https://example.com/image.jpg",
          cardBackgroundOverlay: "bg-black/50",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithOverlay} />)
      expect(screen.getByText("Overlay Card")).toBeInTheDocument()
    })

    it("uses white buttons when card has background image", () => {
      const tiersWithImage = [
        {
          name: "Image Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundImage: "https://example.com/image.jpg",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithImage} />)
      expect(screen.getByText("Image Card")).toBeInTheDocument()
    })

    it("applies sectionBackgroundImage", () => {
      const { container } = render(
        <PricingGrid tiers={mockTiers} sectionBackgroundImage="https://example.com/bg.jpg" />
      )
      const section = container.querySelector("section")
      expect(section).toHaveStyle({ backgroundImage: expect.stringContaining("example.com") })
    })

    it("applies sectionBackgroundOverlay", () => {
      const { container } = render(
        <PricingGrid
          tiers={mockTiers}
          sectionBackgroundImage="https://example.com/bg.jpg"
          sectionBackgroundOverlay="bg-black/20"
        />
      )
      expect(container.querySelector(".bg-black\\/20")).toBeTruthy()
    })
  })

  // Animation Tests (51-60)
  describe("Animations", () => {
    it("applies fade animation", () => {
      render(<PricingGrid tiers={mockTiers} animation="fade" />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies slide animation", () => {
      render(<PricingGrid tiers={mockTiers} animation="slide" />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies scale animation", () => {
      render(<PricingGrid tiers={mockTiers} animation="scale" />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies slide-up animation", () => {
      render(<PricingGrid tiers={mockTiers} animation="slide-up" />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies slide-down animation", () => {
      render(<PricingGrid tiers={mockTiers} animation="slide-down" />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("disables animation when set to false", () => {
      render(<PricingGrid tiers={mockTiers} animation={false} />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("disables animation when set to 'none'", () => {
      render(<PricingGrid tiers={mockTiers} animation="none" />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies animation config object", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          animation={{
            enabled: true,
            type: "fade",
            duration: 0.8,
            staggerDelay: 0.2,
          }}
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("handles partial animation config", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          animation={{
            type: "slide",
          }}
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("uses default animation when not specified", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })
  })

  // Layout Tests (61-70)
  describe("Layout Options", () => {
    it("renders horizontal header layout for 2 tiers", () => {
      const twoTiers = mockTiers.slice(0, 2)
      render(<PricingGrid tiers={twoTiers} horizontalHeader />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("does not render horizontal layout for 3 tiers", () => {
      render(<PricingGrid tiers={mockTiers} horizontalHeader />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies scaleRecommended effect", () => {
      render(<PricingGrid tiers={mockTiers} scaleRecommended />)
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("disables scaleRecommended effect", () => {
      render(<PricingGrid tiers={mockTiers} scaleRecommended={false} />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("renders grid layout when scaleRecommended is false", () => {
      render(<PricingGrid tiers={mockTiers} scaleRecommended={false} />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies custom className", () => {
      const { container } = render(<PricingGrid tiers={mockTiers} className="custom-class" />)
      const section = container.querySelector("section")
      expect(section).toHaveClass("custom-class")
    })

    it("applies sectionBackgroundColor", () => {
      const { container } = render(
        <PricingGrid tiers={mockTiers} sectionBackgroundColor="bg-gray-100" />
      )
      const section = container.querySelector("section")
      expect(section).toHaveClass("bg-gray-100")
    })

    it("handles empty className", () => {
      render(<PricingGrid tiers={mockTiers} className="" />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("renders correctly with horizontalHeader and toggle", () => {
      const twoTiers = mockTiers.slice(0, 2)
      render(<PricingGrid tiers={twoTiers} horizontalHeader showToggle />)
      expect(screen.getByText("Monthly")).toBeInTheDocument()
    })

    it("handles layout with glassmorphism effect", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          sectionBackgroundImage="https://example.com/bg.jpg"
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })
  })


  // Edge Cases (76-80)
  describe("Edge Cases", () => {
    it("handles price without slash separator", () => {
      const tiersWithSimplePrice = [
        {
          name: "Simple",
          price: { monthly: "$10" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithSimplePrice} />)
      expect(screen.getByText("$10")).toBeInTheDocument()
    })

    it("handles very long tier names", () => {
      const tiersWithLongName = [
        {
          name: "Very Long Tier Name That Might Wrap",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithLongName} />)
      expect(screen.getByText("Very Long Tier Name That Might Wrap")).toBeInTheDocument()
    })

    it("handles very long descriptions", () => {
      const tiersWithLongDesc = [
        {
          name: "Plan",
          price: { monthly: "$10 /mo" },
          description: "This is a very long description that might wrap to multiple lines and test the layout",
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithLongDesc} />)
      expect(
        screen.getByText("This is a very long description that might wrap to multiple lines and test the layout")
      ).toBeInTheDocument()
    })

    it("handles many features", () => {
      const manyFeatures = Array.from({ length: 20 }, (_, i) => ({
        label: `Feature ${i + 1}`,
      }))
      const tiersWithManyFeatures = [
        {
          name: "Feature Rich",
          price: { monthly: "$10 /mo" },
          features: manyFeatures,
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithManyFeatures} />)
      expect(screen.getByText("Feature 1")).toBeInTheDocument()
      expect(screen.getByText("Feature 20")).toBeInTheDocument()
    })

    it("handles special characters in tier names", () => {
      const tiersWithSpecialChars = [
        {
          name: "Plan & More! @#$%",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithSpecialChars} />)
      expect(screen.getByText("Plan & More! @#$%")).toBeInTheDocument()
    })
  })

  // Price Display Tests (81-85)
  describe("Price Display Variations", () => {
    it("displays price with period correctly", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const periodElements = screen.getAllByText("/mo")
      expect(periodElements.length).toBeGreaterThan(0)
    })

    it("handles price without period separator", () => {
      const tiersWithoutPeriod = [
        {
          name: "Simple",
          price: { monthly: "$100" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$200" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithoutPeriod} />)
      expect(screen.getByText("$100")).toBeInTheDocument()
    })

    it("displays annual price when annual billing is selected", () => {
      render(<PricingGrid tiers={mockTiers} defaultBilling="annual" />)
      expect(screen.getByText("$7")).toBeInTheDocument()
      expect(screen.getByText("$23")).toBeInTheDocument()
    })

    it("falls back to monthly price when annual is not available", () => {
      const tiersWithoutAnnual = [
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithoutAnnual} defaultBilling="annual" />)
      expect(screen.getByText("$10")).toBeInTheDocument()
      expect(screen.getByText("$20")).toBeInTheDocument()
    })

    it("handles price format with different currencies", () => {
      const tiersWithCurrency = [
        {
          name: "Euro Plan",
          price: { monthly: "€10 /mo" },
          features: [{ label: "Feature A" }],
        },
        {
          name: "Pro",
          price: { monthly: "€20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithCurrency} />)
      expect(screen.getByText("€10")).toBeInTheDocument()
    })
  })

  // Animation Configuration Tests (86-90)
  describe("Animation Configuration Details", () => {
    it("applies custom animation duration", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          animation={{
            enabled: true,
            type: "fade",
            duration: 1.5,
          }}
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies custom stagger delay", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          animation={{
            enabled: true,
            type: "slide-up",
            staggerDelay: 0.3,
          }}
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies custom header delay", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          animation={{
            enabled: true,
            headerDelay: 0.5,
          }}
        />
      )
      expect(screen.getByText("Plans that scale")).toBeInTheDocument()
    })

    it("applies custom toggle delay", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          animation={{
            enabled: true,
            toggleDelay: 0.4,
          }}
        />
      )
      expect(screen.getByText("Monthly")).toBeInTheDocument()
    })

    it("applies custom features delay and stagger", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          animation={{
            enabled: true,
            featuresDelay: 0.3,
            featuresStagger: 0.1,
          }}
        />
      )
      expect(screen.getByText("Up to 3 projects")).toBeInTheDocument()
    })
  })

  // Global Color Customization Tests (91-95)
  describe("Global Color Customization", () => {
    it("applies custom titleColor", () => {
      render(
        <PricingGrid tiers={mockTiers} titleColor="text-blue-900" />
      )
      expect(screen.getByText("Plans that scale")).toBeInTheDocument()
    })

    it("applies custom descriptionColor", () => {
      render(
        <PricingGrid tiers={mockTiers} descriptionColor="text-gray-800" />
      )
      expect(
        screen.getByText("Start free, upgrade when you're ready. No hidden fees, cancel anytime.")
      ).toBeInTheDocument()
    })

    it("applies custom labelColor", () => {
      render(<PricingGrid tiers={mockTiers} labelColor="text-gray-600" />)
      expect(screen.getByText("PRICING")).toBeInTheDocument()
    })

    it("applies custom accentColor", () => {
      render(<PricingGrid tiers={mockTiers} accentColor="text-blue-600" />)
      expect(screen.getByText("with your growth")).toBeInTheDocument()
    })

    it("applies custom toggleActiveColor", () => {
      render(<PricingGrid tiers={mockTiers} toggleActiveColor="bg-blue-600" />)
      expect(screen.getByText("Monthly")).toBeInTheDocument()
    })
  })

  // Layout Combination Tests (96-100)
  describe("Layout Combinations", () => {
    it("combines horizontalHeader with scaleRecommended", () => {
      const twoTiers = mockTiers.slice(0, 2)
      render(
        <PricingGrid
          tiers={twoTiers}
          horizontalHeader
          scaleRecommended
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("combines scaleRecommended with custom colors", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          scaleRecommended
          accentColor="text-blue-600"
        />
      )
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("combines horizontalHeader with background image", () => {
      const twoTiers = mockTiers.slice(0, 2)
      render(
        <PricingGrid
          tiers={twoTiers}
          horizontalHeader
          sectionBackgroundImage="https://example.com/bg.jpg"
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("combines scaleRecommended with animation disabled", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          scaleRecommended
          animation={false}
        />
      )
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("combines all layout options together", () => {
      const twoTiers = mockTiers.slice(0, 2)
      render(
        <PricingGrid
          tiers={twoTiers}
          horizontalHeader
          scaleRecommended
          sectionBackgroundImage="https://example.com/bg.jpg"
          animation="fade"
          accentColor="text-blue-600"
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })
  })

  // Glassmorphism Tests (101-105)
  describe("Glassmorphism Effects", () => {
    it("applies glassmorphism when section has background image", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          sectionBackgroundImage="https://example.com/bg.jpg"
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies white text when glassmorphism is active", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          sectionBackgroundImage="https://example.com/bg.jpg"
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("does not apply glassmorphism without section background image", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })

    it("applies glassmorphism with card background image", () => {
      const tiersWithCardImage = [
        {
          name: "Image Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundImage: "https://example.com/card.jpg",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(
        <PricingGrid
          tiers={tiersWithCardImage}
          sectionBackgroundImage="https://example.com/bg.jpg"
        />
      )
      expect(screen.getByText("Image Card")).toBeInTheDocument()
    })

    it("handles glassmorphism with overlay", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          sectionBackgroundImage="https://example.com/bg.jpg"
          sectionBackgroundOverlay="bg-black/30"
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
    })
  })

  // Comprehensive Color Tests (106-110)
  describe("Comprehensive Color Scenarios", () => {
    it("handles cardColor with recommended tier", () => {
      const tiersWithColor = [
        {
          name: "Pro",
          price: { monthly: "$29 /mo" },
          features: [{ label: "Feature A" }],
          cardColor: "blue",
          recommended: true,
        },
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature B" }],
          cardColor: "blue",
          recommended: false,
        },
      ]
      render(<PricingGrid tiers={tiersWithColor} />)
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("handles cardColor override with individual colors", () => {
      const tiersWithOverride = [
        {
          name: "Custom",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardColor: "blue",
          borderColor: "border-red-500",
          buttonColor: "bg-green-600",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithOverride} />)
      expect(screen.getByText("Custom")).toBeInTheDocument()
    })

    it("handles white buttons for cards with background images", () => {
      const tiersWithImage = [
        {
          name: "Image Plan",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundImage: "https://example.com/image.jpg",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithImage} />)
      expect(screen.getByText("Image Plan")).toBeInTheDocument()
    })

    it("handles badge color for recommended tier with background image", () => {
      const tiersWithImage = [
        {
          name: "Pro",
          price: { monthly: "$29 /mo" },
          features: [{ label: "Feature A" }],
          recommended: true,
          cardBackgroundImage: "https://example.com/image.jpg",
        },
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithImage} />)
      expect(screen.getByText("MOST POPULAR")).toBeInTheDocument()
    })

    it("handles multiple color schemes in same grid", () => {
      const multiColorTiers = [
        {
          name: "Blue Plan",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardColor: "blue",
        },
        {
          name: "Green Plan",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
          cardColor: "green",
        },
        {
          name: "Red Plan",
          price: { monthly: "$30 /mo" },
          features: [{ label: "Feature C" }],
          cardColor: "red",
        },
      ]
      render(<PricingGrid tiers={multiColorTiers} />)
      expect(screen.getByText("Blue Plan")).toBeInTheDocument()
      expect(screen.getByText("Green Plan")).toBeInTheDocument()
      expect(screen.getByText("Red Plan")).toBeInTheDocument()
    })
  })

  // Toggle Interaction Tests (111-115)
  describe("Toggle Interaction Scenarios", () => {
    it("toggles between monthly and annual multiple times", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const monthlyButton = screen.getByText("Monthly")
      const annualButton = screen.getByText("Annual")

      fireEvent.click(annualButton)
      expect(screen.getByText("$7")).toBeInTheDocument()

      fireEvent.click(monthlyButton)
      expect(screen.getByText("$9")).toBeInTheDocument()

      fireEvent.click(annualButton)
      expect(screen.getByText("$7")).toBeInTheDocument()
    })

    it("maintains correct prices after multiple toggles", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const annualButton = screen.getByText("Annual")
      const monthlyButton = screen.getByText("Monthly")

      fireEvent.click(annualButton)
      fireEvent.click(monthlyButton)
      fireEvent.click(annualButton)

      expect(screen.getByText("$7")).toBeInTheDocument()
      expect(screen.getByText("$23")).toBeInTheDocument()
    })

    it("calls onCtaClick with correct billing after toggle", () => {
      render(<PricingGrid tiers={mockTiers} onCtaClick={onCtaClick} />)
      const annualButton = screen.getByText("Annual")
      fireEvent.click(annualButton)

      const buttons = screen.getAllByRole("button")
      const ctaButton = buttons.find((btn) => btn.textContent === "Get Started")
      if (ctaButton) {
        fireEvent.click(ctaButton)
        expect(onCtaClick).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Starter" }),
          "annual"
        )
      }
    })

    it("displays discount indicator in annual button", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("-20%")).toBeInTheDocument()
    })

    it("handles toggle click when showToggle is true", () => {
      render(<PricingGrid tiers={mockTiers} showToggle />)
      const annualButton = screen.getByText("Annual")
      fireEvent.click(annualButton)
      expect(screen.getByText("$7")).toBeInTheDocument()
    })
  })

  // Feature List Tests (116-120)
  describe("Feature List Rendering", () => {
    it("renders all features for each tier", () => {
      render(<PricingGrid tiers={mockTiers} />)
      expect(screen.getByText("Up to 3 projects")).toBeInTheDocument()
      expect(screen.getByText("1 GB storage")).toBeInTheDocument()
      expect(screen.getByText("Basic analytics")).toBeInTheDocument()
      expect(screen.getByText("Unlimited projects")).toBeInTheDocument()
      expect(screen.getByText("50 GB storage")).toBeInTheDocument()
    })

    it("renders unavailable features with correct styling", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const unavailableFeature = screen.getByText("Dedicated support")
      expect(unavailableFeature).toBeInTheDocument()
    })

    it("renders check icons for available features", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const checkIcons = screen.getAllByTestId("check-icon")
      expect(checkIcons.length).toBeGreaterThan(0)
    })

    it("handles features with explicit available: true", () => {
      const tiersWithExplicitAvailable = [
        {
          name: "Plan",
          price: { monthly: "$10 /mo" },
          features: [
            { label: "Feature A", available: true },
            { label: "Feature B", available: false },
          ],
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature C" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithExplicitAvailable} />)
      expect(screen.getByText("Feature A")).toBeInTheDocument()
      expect(screen.getByText("Feature B")).toBeInTheDocument()
    })

    it("renders WHAT'S INCLUDED heading for each tier", () => {
      render(<PricingGrid tiers={mockTiers} />)
      const headings = screen.getAllByText("WHAT'S INCLUDED")
      expect(headings.length).toBe(3)
    })
  })

  // Section Background Tests (121-125)
  describe("Section Background Customization", () => {
    it("applies sectionBackgroundColor when no image", () => {
      const { container } = render(
        <PricingGrid tiers={mockTiers} sectionBackgroundColor="bg-gray-50" />
      )
      const section = container.querySelector("section")
      expect(section).toHaveClass("bg-gray-50")
    })

    it("applies sectionBackgroundImage with inline style", () => {
      const { container } = render(
        <PricingGrid tiers={mockTiers} sectionBackgroundImage="https://example.com/bg.jpg" />
      )
      const section = container.querySelector("section")
      expect(section).toHaveStyle({ backgroundImage: expect.stringContaining("example.com") })
    })

    it("applies sectionBackgroundOverlay when image is present", () => {
      const { container } = render(
        <PricingGrid
          tiers={mockTiers}
          sectionBackgroundImage="https://example.com/bg.jpg"
          sectionBackgroundOverlay="bg-black/20"
        />
      )
      expect(container.querySelector(".bg-black\\/20")).toBeTruthy()
    })

    it("does not apply overlay when no section background image", () => {
      const { container } = render(
        <PricingGrid tiers={mockTiers} sectionBackgroundOverlay="bg-black/20" />
      )
      const overlay = container.querySelector(".bg-black\\/20")
      expect(overlay).toBeFalsy()
    })

    it("handles CSS color value for sectionBackgroundColor", () => {
      const { container } = render(
        <PricingGrid tiers={mockTiers} sectionBackgroundColor="#f5f5f5" />
      )
      const section = container.querySelector("section")
      expect(section).toBeTruthy()
    })
  })

  // Card Background Tests (126-130)
  describe("Card Background Customization", () => {
    it("applies cardBackgroundImage with inline style", () => {
      const tiersWithImage = [
        {
          name: "Image Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundImage: "https://example.com/card.jpg",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      const { container } = render(<PricingGrid tiers={tiersWithImage} />)
      const card = container.querySelector('[style*="background-image"]')
      expect(card).toBeTruthy()
    })

    it("applies cardBackgroundOverlay when image is present", () => {
      const tiersWithOverlay = [
        {
          name: "Overlay Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundImage: "https://example.com/image.jpg",
          cardBackgroundOverlay: "bg-black/50",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithOverlay} />)
      expect(screen.getByText("Overlay Card")).toBeInTheDocument()
    })

    it("applies cardBackgroundColor when no image", () => {
      const tiersWithBg = [
        {
          name: "Background Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundColor: "bg-gray-100",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithBg} />)
      expect(screen.getByText("Background Card")).toBeInTheDocument()
    })

    it("handles CSS color value for cardBackgroundColor", () => {
      const tiersWithColor = [
        {
          name: "Color Card",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundColor: "#ffffff",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithColor} />)
      expect(screen.getByText("Color Card")).toBeInTheDocument()
    })

    it("does not apply overlay when no card background image", () => {
      const tiersWithoutImage = [
        {
          name: "No Image",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          cardBackgroundOverlay: "bg-black/50",
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
        },
      ]
      render(<PricingGrid tiers={tiersWithoutImage} />)
      expect(screen.getByText("No Image")).toBeInTheDocument()
    })
  })

  // Comprehensive Integration Tests (131-135)
  describe("Comprehensive Integration Scenarios", () => {
    it("handles full customization with all props", () => {
      render(
        <PricingGrid
          tiers={mockTiers}
          title="Custom Title"
          titleHighlight="Custom Highlight"
          description="Custom description"
          showToggle
          defaultBilling="annual"
          onCtaClick={onCtaClick}
          className="custom-class"
          accentColor="text-blue-600"
          toggleActiveColor="bg-blue-600"
          titleColor="text-gray-900"
          descriptionColor="text-gray-600"
          labelColor="text-gray-500"
          sectionBackgroundColor="bg-white"
          animation="fade"
          scaleRecommended
        />
      )
      expect(screen.getByText("Custom Title")).toBeInTheDocument()
      expect(screen.getByText("Custom Highlight")).toBeInTheDocument()
      expect(screen.getByText("Custom description")).toBeInTheDocument()
    })

    it("handles two-tier layout with all features", () => {
      const twoTiers = mockTiers.slice(0, 2)
      render(
        <PricingGrid
          tiers={twoTiers}
          horizontalHeader
          scaleRecommended
          sectionBackgroundImage="https://example.com/bg.jpg"
          animation={{
            enabled: true,
            type: "slide-up",
            duration: 0.6,
          }}
        />
      )
      expect(screen.getByText("Starter")).toBeInTheDocument()
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("handles three-tier layout with recommended in middle", () => {
      const threeTiers = [
        {
          name: "Basic",
          price: { monthly: "$10 /mo" },
          features: [{ label: "Feature A" }],
          recommended: false,
        },
        {
          name: "Pro",
          price: { monthly: "$20 /mo" },
          features: [{ label: "Feature B" }],
          recommended: true,
        },
        {
          name: "Enterprise",
          price: { monthly: "$30 /mo" },
          features: [{ label: "Feature C" }],
          recommended: false,
        },
      ]
      render(<PricingGrid tiers={threeTiers} scaleRecommended />)
      expect(screen.getByText("MOST POPULAR")).toBeInTheDocument()
      expect(screen.getByText("Pro")).toBeInTheDocument()
    })

    it("handles all animation types with custom config", () => {
      const animationTypes = ["fade", "slide", "scale", "slide-up", "slide-down"]
      animationTypes.forEach((type) => {
        const { unmount } = render(
          <PricingGrid
            tiers={mockTiers}
            animation={{
              enabled: true,
              type: type as any,
              duration: 0.8,
              staggerDelay: 0.15,
            }}
          />
        )
        expect(screen.getByText("Starter")).toBeInTheDocument()
        unmount()
      })
    })

    it("handles complex scenario with mixed configurations", () => {
      const complexTiers = [
        {
          name: "Starter",
          price: { monthly: "$9 /mo", annual: "$7 /mo" },
          description: "Perfect for getting started",
          features: [
            { label: "Up to 3 projects" },
            { label: "1 GB storage" },
            { label: "Basic analytics" },
          ],
          ctaLabel: "Get Started",
          recommended: false,
          cardColor: "blue",
        },
        {
          name: "Pro",
          price: { monthly: "$29 /mo", annual: "$23 /mo" },
          description: "For growing teams",
          features: [
            { label: "Unlimited projects" },
            { label: "50 GB storage" },
            { label: "Advanced analytics" },
            { label: "Priority support" },
          ],
          ctaLabel: "Start Free Trial",
          recommended: true,
          cardColor: "purple",
          cardBackgroundImage: "https://example.com/pro.jpg",
        },
        {
          name: "Enterprise",
          price: { monthly: "$99 /mo" },
          description: "For organizations",
          features: [
            { label: "Everything in Pro" },
            { label: "Custom integrations" },
            { label: "Dedicated support", available: false },
          ],
          ctaLabel: "Contact Sales",
          recommended: false,
          cardColor: "green",
        },
      ]
      render(
        <PricingGrid
          tiers={complexTiers}
          title="Choose Your Plan"
          titleHighlight="Today"
          description="Select the perfect plan for your needs"
          showToggle
          defaultBilling="monthly"
          onCtaClick={onCtaClick}
          accentColor="text-purple-600"
          toggleActiveColor="bg-purple-600"
          animation="slide-up"
          scaleRecommended
          sectionBackgroundColor="bg-gray-50"
        />
      )
      expect(screen.getByText("Choose Your Plan")).toBeInTheDocument()
      expect(screen.getByText("Today")).toBeInTheDocument()
      expect(screen.getByText("MOST POPULAR")).toBeInTheDocument()
    })
  })
})

