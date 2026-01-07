import type { Meta, StoryObj } from "@storybook/react-vite"
import { PricingGrid } from "."
import {
  HardDrive,
  Database,
  Mail,
  LifeBuoy,
  Users,
  Settings2,
  BarChart3,
  CreditCard,
  Lightbulb,
} from "lucide-react"

const meta: Meta<typeof PricingGrid> = {
  title: "Templates/Section/Content/PricingGrid",
  component: PricingGrid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "dark", "light", "glass", "gradient"],
      description: "Visual theme variant for the layout",
    },
    allowDifferentCardColors: {
      control: { type: "boolean" },
      description: "Visual theme variant for the layout",
    },
    pricingBadgePosition: {
      control: { type: "select" },
      options: [ "none", "top", "middle" ],
      description: "Visual theme variant for the layout",
    },
    modernUI : {
      control: { type: "select" },
      options: [ "basic", "vector", "advance"],
      description: "Modern UI for Pricing Card"
    },
    animation: {
      control: "select",
      options: ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"],
    },
    interactive: {
      control: "select",
      options: ["none", "hover", "press", "lift", "tilt", "glow"],
    },
    modernVariant: {
      control: { type: "select" },
      options: ["default", "dark", "light"],
      description: "Visual theme variant for the layout",
    },
    table: {
      control: { type: "boolean" },
      description: "Visual theme variant for the layout",
    },
  }
}

export default meta

type Story = StoryObj<typeof PricingGrid>

export const Default: Story = {
  render: () => {
   const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
        gradient: "from-yellow-900 to-orange-500",
        icon: Lightbulb,
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
          { label: "Email Accounts", available: false },
          { label: "24 Hours Support", available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        id:1,
        name: "Standard",
        price: "$19.99 /month",
        highlighted: true,
        icon: CreditCard,
        gradient: "from-purple-500 to-fuchsia-500",
        features: [
          { label: "Storage 20GB", icon: HardDrive },
          { label: "Databases 20", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users, available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        id:2,
        name: "Enterprise",
        price: "$29.99 /month",
        gradient: "from-teal-500 to-emerald-500",
        icon: BarChart3,
        features: [
          { label: "Storage 50GB", icon: HardDrive },
          { label: "Databases 50", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users },
        ],
        ctaLabel: "Check Now"
      }
    ]

    return <PricingGrid plans={plans} currentPlan={2} modernVariant="default" modernUI="basic"/>
  },
}

export const ModernUI: Story = {
  render: () => {
    const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
        icon: Lightbulb,
        ctaLabel: "Check",
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
          { label: "Email Accounts", available: false },
          { label: "24 Hours Support", available: false },
        ],
      },
      {
        name: "Standard",
        price: "$ 19.99/month",
        highlighted: true,
        icon: CreditCard,
        ctaLabel: "Check",
        features: [
          { label: "Storage 20GB", icon: HardDrive },
          { label: "Databases 20", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users, available: false },
        ],
      },
      {
        name: "Enterprise",
        price: "$29.99/month",
        icon: BarChart3,
        ctaLabel: "Check",
        features: [
          { label: "Storage 50GB", icon: HardDrive },
          { label: "Databases 50", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users },
        ],
      }
    ]

    return <PricingGrid title="Pricing Plans For Everyone" description="Lorem ipsum dolor sit amet, consectetur adipiscing" plans={plans} variant="dark" modernUI="vector"/>

  },
}

export const Animation :  Story = {
  render: () => {
    const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
        gradient: "from-yellow-900 to-orange-500",
        icon: Lightbulb,
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
          { label: "Email Accounts", available: false },
          { label: "24 Hours Support", available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        name: "Standard",
        price: "$ 19.99 /month",
        highlighted: true,
        icon: CreditCard,
        gradient: "from-purple-500 to-fuchsia-500",
        features: [
          { label: "Storage 20GB", icon: HardDrive },
          { label: "Databases 20", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users, available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        name: "Enterprise",
        price: "29.99",
        gradient: "from-teal-500 to-emerald-500",
        icon: BarChart3,
        features: [
          { label: "Storage 50GB", icon: HardDrive },
          { label: "Databases 50", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users },
        ],
        ctaLabel: "Check Now"
      }
    ]
    return <PricingGrid plans={plans} modernUI="basic" animation="slideUp" table/>

  },
}

export const DifferentColorsCard: Story = {
   render: () => {
   const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
        gradient: "bg-gradient-to-br from-yellow-500 to-orange-400 text-white",
        icon: Lightbulb,
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
          { label: "Email Accounts", available: false },
          { label: "24 Hours Support", available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        name: "Standard",
        price: "$19.99 /month",
        highlighted: true,
        icon: CreditCard,
        gradient: "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white",
        features: [
          { label: "Storage 20GB", icon: HardDrive },
          { label: "Databases 20", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users, available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        name: "Enterprise",
        price: "$29.99 /month",
        gradient: "bg-gradient-to-br from-teal-500 to-emerald-500 text-white",
        icon: BarChart3,
        features: [
          { label: "Storage 50GB", icon: HardDrive },
          { label: "Databases 50", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users },
        ],
        ctaLabel: "Check Now"
      }
    ]

    return <PricingGrid plans={plans} modernUI="vector" allowDifferentCardColors/>

  },
}

export const PriceBadgePosition: Story = {
   render: () => {
    const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
        icon: Lightbulb,
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
          { label: "Email Accounts", available: false },
          { label: "24 Hours Support", available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        name: "Standard",
        price: "$19.99 /month",
        highlighted: true,
        icon: CreditCard,
        currentPlan: true,
        features: [
          { label: "Storage 20GB", icon: HardDrive },
          { label: "Databases 20", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users, available: false },
        ],
        ctaLabel: "Check Now"
      },
      {
        name: "Enterprise",
        price: "$29.99 /month",
        icon: BarChart3,
        features: [
          { label: "Storage 50GB", icon: HardDrive },
          { label: "Databases 50", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users },
        ],
        ctaLabel: "Check Now"
      }
    ]

    return <PricingGrid plans={plans} pricingBadgePosition="top" modernUI="vector" variant="default"/>

  },
}

export const Interactive :  Story = {
  render: () => {
    const plans = [
      {
        id: 3,
        name: "Starter",
        price: "$FREE /month",
        currentPlan: true,
        gradient: "bg-gradient-to-br from-yellow-900 to-orange-500",
        icon: Lightbulb,
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
          { label: "Email Accounts", available: false },
          { label: "24 Hours Support", available: false },
        ],
        ctaLabel: "Tell me More"
      },
      {
        id: 2,
        name: "Standard",
        price: "$19.99 /month",
        highlighted: true,
        icon: CreditCard,
        gradient: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
        features: [
          { label: "Storage 20GB", icon: HardDrive },
          { label: "Databases 20", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users, available: false },
        ],
        ctaLabel: "Tell me More"
      },
      {
        id: 1,
        name: "Enterprise",
        price: "$29.99 /month",
        gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
        icon: BarChart3,
        features: [
          { label: "Storage 50GB", icon: HardDrive },
          { label: "Databases 50", icon: Database },
          { label: "License", icon: Settings2  },
          { label: "Email Accounts", icon: Mail },
          { label: "24/7 Support", icon: LifeBuoy },
          { label: "Agent Support", icon: Users },
        ],
        ctaLabel: "Tell me More"
      }
    ]

    return <PricingGrid  toggleOptions={[
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ]}
  onValueChange={(v) => console.log(v)}
  plans={plans} variant="dark" modernUI="advance" animation="flipIn" interactive="press"  onCtaClick={(plan) => console.log(`/checkout/${plan.id}`)}/>
  },
}

 
