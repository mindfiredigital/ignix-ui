import type { Meta, StoryObj } from "@storybook/react"
import { ComparisonTable, type ComparisonTableData } from "."
import { Star, Gem, Crown } from "lucide-react"

const dbData: ComparisonTableData = {
  title: "Pricing Plans",
  icon: Star,
  description: "Choose the plan that fits your needs",
  head: "Features",
  features: [
    { id: 1, label: "Components" },
    { id: 2, label: "Theme" },
    { id: 3, label: "Support" },
    { id: 4, label: "API Access" },
    { id: 5, label: "Customisation" },
    { id: 6, label: "SLA" },
  ],
  plans: [
    {
      id: 1,
      icon: Gem,
      name: "Basic",
      price: "$199",
      featureMap: {
        1: true,
        2: false,
        3: "Email",
        4: false,
        5: "Limited",
        6: null,
      },
    },
    {
      id: 2,
      name: "Standard",
      icon: Crown,
      price: "$399",
      featureMap: {
        1: true,
        2: true,
        3: "Chat",
        4: true,
        5: "Full",
        6: "24h",
      },
    },
    {
      id: 3,
      name: "Premium",
      price: "$899",
      recommended: true,
      featureMap: {
        1: true,
        2: true,
        3: "24/7 Priority",
        4: true,
        5: "Unlimited",
        6: "4h",
      },
    }
  ],
}

const meta: Meta<typeof ComparisonTable> = {
  title: "Templates/Section/Content/ComparisonTable",
  component: ComparisonTable,
  parameters: {
    layout: "fullscreen",
  },
  args: 
    dbData,
  argTypes: {
    mobileBreakpoint: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Breakpoint for mobile behavior",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "dark", "light"],
      description: "Visual theme variant for the layout",
    },
    interactive: {
      control: "select",
      options: ["none", "hover", "press", "lift", "tilt", "glow"],
    },
    animation: {
      control: "select",
      options: ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"],
    },
  },
}

export default meta

type Story = StoryObj<typeof ComparisonTable>

export const Default: Story = {}

export const Dark: Story = {
  args: {
    variant:"dark"
  }
}

export const Animation: Story = {
  args: {
    animation:"bounceIn",
    interactive:"tilt"
  }
}

export const Light: Story = {
  args: {
    variant:"light",
  }
}

export const RecommendedGradient: Story = {
  args: {
    variant:"light",
    recommendationGradient: "bg-emerald-700/60 text-white"
  }
}

export const DifferentCardColor: Story = {
  render: () => {
    const features = [
      { id: 1, label: "Components" },
      { id: 2, label: "Theme" },
      { id: 3, label: "Support" },
      { id: 4, label: "API Access" },
      { id: 5, label: "Customisation" },
      { id: 6, label: "SLA" },
    ]
    const plans = [
      {
        id: 1,
        icon: Gem,
        name: "Basic",
        price: "$199",
        gradient: "bg-blue-200 text-white",
        featureMap: {
          1: true,
          2: false,
          3: "Email",
          4: false,
          5: "Limited",
          6: null,
        },
      },
      {
        id: 2,
        name: "Standard",
        icon: Crown,
        price: "$399",
        gradient: "bg-teal-400 text-white",
        featureMap: {
          1: true,
          2: true,
          3: "Chat",
          4: true,
          5: "Full",
          6: "24h",
        },
      },
      {
        id: 3,
        name: "Premium",
        price: "$899",
        recommended: true,
        gradient: "bg-red-300 text-white",
        featureMap: {
          1: true,
          2: true,
          3: "24/7 Priority",
          4: true,
          5: "Unlimited",
          6: "4h",
        },
      },
    ];

    return <ComparisonTable featureGradient="bg-yellow-300 text-white" features={features} plans={plans} variant="light" onCtaClick={(plans) => console.log(`/checkout/${plans.id}`)}/>;
  },
};

// Mobile-Optimized Story
export const MobileOptimized: Story = {
  args: {
    mobileBreakpoint: "sm",
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

export const HighLightCurrentPlanId: Story = {
  args: {
    currentPlanId: 1,
  }  
};


