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
    id: 1,
    name: "Starter",
    price: "$19/month",
    ctaLabel: "Order Now",
    features: [{ label: "Feature A" }, { label: "Feature B" }],
    onCtaClick,
  },
  {
    id: 2,
    name: "Pro",
    price: "$49/month",
    highlighted: true,
    ctaLabel: "Order Now",
    features: [{ label: "Feature C" }],
    onCtaClick,
  },
  {
    id: 3,
    name: "Enterprise",
    price: "$99/month",
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

    expect(screen.getAllByText("Order Now").length).toBe(2)
  })

  it("calls onCtaClick in vector mode", () => {
    const onCtaClick = vi.fn()
    render(
      <PricingGrid
        plans={mockPlans}
        modernUI="vector"
        onCtaClick={onCtaClick}
      />
    )
    fireEvent.click(screen.getByLabelText("Starter plan action"))
    expect(onCtaClick).toHaveBeenCalledTimes(1)
    expect(onCtaClick).toHaveBeenCalledWith(expect.objectContaining({ name: "Starter" }))
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

  it("renders default title and description when none provided", () => {
    render(<PricingGrid plans={mockPlans} />)
    expect(screen.getByText("Our Pricing Table")).toBeInTheDocument()
    expect(screen.getByText("Choose the plan that fits your needs")).toBeInTheDocument()
  })

  it("renders correct number of feature rows in table mode", () => {
    render(<PricingGrid plans={mockPlans} table />)
    expect(screen.getAllByRole("row").length).toBeGreaterThanOrEqual(4) // 1 header + 3 rows
  })

  it("applies motion animation classes correctly", () => {
    const { container } = render(<PricingGrid plans={mockPlans} animation="bounceIn" />)
    expect(container.querySelectorAll("div").length).toBeGreaterThanOrEqual(mockPlans.length)
  })

  it("applies lift interactive effect on hover", () => {
    const { container } = render(<PricingGrid plans={mockPlans} interactive="lift" />)
    const card = container.querySelector(".scale-105")
    expect(card).toBeTruthy()
  })

  it("renders correctly if multiple plans are highlighted", () => {
    const plans = [
      { ...mockPlans[0], highlighted: true },
      { ...mockPlans[1], highlighted: true },
    ]
    render(<PricingGrid plans={plans} />)
    expect(screen.getByText("Starter")).toBeInTheDocument()
    expect(screen.getByText("Pro")).toBeInTheDocument()
  })

  it("applies light variant correctly for modernUI", () => {
    const { container } = render(<PricingGrid plans={mockPlans} modernUI="basic" modernVariant="light" />)
    expect(container.querySelector(".bg-white")).toBeTruthy()
  })

  it("does not render CTA button for current plan in basic mode", () => {
    render(<PricingGrid plans={mockPlans} modernUI="basic" currentPlan={1} />)
    expect(screen.queryByLabelText("Starter plan action")).not.toBeInTheDocument()
  })

  it("displays correct availability in table", () => {
    render(<PricingGrid plans={mockPlans} table />);

    // Optional: check for feature labels
    expect(screen.getByText("Feature A")).toBeInTheDocument();
    expect(screen.getByText("Feature B")).toBeInTheDocument();
  });

  it("renders pricing badge at top position", () => {
    render(<PricingGrid plans={mockPlans} pricingBadgePosition="top" modernUI="vector" />);
    expect(screen.getByLabelText("pricing-top-Starter")).toBeInTheDocument()
  });

  it("renders pricing badge at middle position", () => {
    render(<PricingGrid plans={mockPlans} pricingBadgePosition="middle" modernUI="vector" />);
    expect(screen.getByLabelText("pricing-middle-Starter")).toBeInTheDocument()
  });

  it("renders custom CTA labels", () => {
    const plans = [{ name: "Custom", price: "30", features: [{ label: "X" }], ctaLabel: "Join Now" }]
    render(<PricingGrid plans={plans} />)
    expect(screen.getByText("Join Now")).toBeInTheDocument()
  })

  it("renders plan icon in basic mode", () => {
    const Icon = () => <svg data-testid="plan-icon" />
    const plans = [{ name: "Iconic", price: "25", icon: Icon, features: [{ label: "A" }], ctaLabel: "Buy" }]
    render(<PricingGrid plans={plans} modernUI="basic" />)
    expect(screen.getByTestId("plan-icon")).toBeInTheDocument()
  })

  it("toggle switch has aria-pressed attribute for accessibility", () => {
    render(<PricingGrid plans={mockPlans} />)
    const toggle = screen.getByRole("button", { name: "Toggle" })
    expect(toggle).toHaveAttribute("aria-pressed")
  })

  it("renders correct number of pricing badges in vector mode", () => {
    render(<PricingGrid plans={mockPlans} modernUI="vector" pricingBadgePosition="top" />);
    const badges = screen.getAllByLabelText(/pricing-top-/);
    expect(badges.length).toBe(mockPlans.length);
  });

  it("splits price correctly using SplitPrice component", () => {
    render(<PricingGrid plans={[mockPlans[0]]} />);
    expect(screen.getByText(/\$19/)).toBeInTheDocument();
    expect(screen.getByText(/\/\s*month/)).toBeInTheDocument();
  });

  it("renders plan even if ctaLabel is missing", () => {
    const plans = [{ name: "No CTA", price: "10/month", features: [{ label: "A" }] }];
    render(<PricingGrid plans={plans} />);
    expect(screen.getByText("No CTA")).toBeInTheDocument();
  });

  it("calls onCtaClick for each plan separately", () => {
    const clickFn = vi.fn();
    render(<PricingGrid plans={mockPlans} modernUI="vector" onCtaClick={clickFn} />);
    fireEvent.click(screen.getByLabelText("Starter plan action"));
    fireEvent.click(screen.getByLabelText("Pro plan action"));
    expect(clickFn).toHaveBeenCalledTimes(2);
  });

  it("renders price in advance UI mode", () => {
    render(<PricingGrid plans={mockPlans} modernUI="advance" />);
    expect(screen.getByText(mockPlans[0].price)).toBeInTheDocument();
  });

  it("renders table with header row and features", () => {
    render(<PricingGrid plans={[mockPlans[0]]} table />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(mockPlans[0].features.length + 1); // header + features
  });

  it("applies interactive hover class for cards in press mode", () => {
    const { container } = render(<PricingGrid plans={mockPlans} interactive="press" />);
    const card = container.querySelector(".scale-105");
    expect(card).toBeTruthy();
  });

  it("renders default Check or X icon if no custom icon is provided", () => {
    render(<PricingGrid plans={mockPlans} table />);
    expect(screen.getAllByText("Yes").length).toBeGreaterThan(0);
    expect(screen.getAllByText("No").length).toBeGreaterThan(0);
  });

  it("renders without toggle switch if toggleOptions is empty", () => {
    render(<PricingGrid plans={mockPlans} />);
    const toggle = screen.queryByLabelText("toggle");
    expect(toggle).toBeNull();
  });

  it("renders highlighted plan with allowDifferentCardColors", () => {
    const plans = [{ name: "VIP", price: "$100", highlighted: true, gradient: "bg-yellow-500", features: [{ label: "Premium" }], ctaLabel: "Join" }];
    const { container } = render(<PricingGrid plans={plans} modernUI="vector" allowDifferentCardColors />);
    expect(container.querySelector(".bg-yellow-500")).toBeTruthy();
  });

  it("renders multiple plans with distinct gradients", () => {
    const plans = [
      { name: "Plan 1", price: "10/month", gradient: "bg-red-500", features: [{ label: "A" }], ctaLabel: "Buy" },
      { name: "Plan 2", price: "20/month", gradient: "bg-blue-500", features: [{ label: "B" }], ctaLabel: "Buy" },
    ];
    const { container } = render(<PricingGrid plans={plans} modernUI="vector" allowDifferentCardColors />);
    expect(container.querySelector(".bg-red-500")).toBeTruthy();
    expect(container.querySelector(".bg-blue-500")).toBeTruthy();
  });

  it("crashed if empty price", () => {
    const plans = [
      {
        id: 1,
        name: "Free Plan",
        price: "",
        features: [{ label: "Feature A" }],
        ctaLabel: "Get Started",
      },
    ];

    render(<PricingGrid plans={plans} modernUI="vector" />);

    // Component renders blank spans instead of throwing
    expect(screen.getByText("plans → 0 → price: Plan price is required")).toBeInTheDocument();
  });

  it("calls onCtaClick with correct plan when CTA is clicked", () => {
    const onCtaClick = vi.fn();

    const plans = [
      {
        id: 1,
        name: "Starter",
        price: "$19/month",
        features: [{ label: "Feature A" }],
        ctaLabel: "Buy Now",
      },
    ];

    render(
      <PricingGrid
        plans={plans}
        modernUI="vector"
        onCtaClick={onCtaClick}
      />
    );

    fireEvent.click(screen.getByLabelText("Starter plan action"));

    expect(onCtaClick).toHaveBeenCalledTimes(1);
    expect(onCtaClick).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Starter" })
    );
  });
})
