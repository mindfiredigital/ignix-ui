import type { Meta, StoryObj } from "@storybook/react-vite"
import { PricingGridPage } from "."
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

const meta: Meta<typeof PricingGridPage> = {
  title: "Templates/Section/Content/PricingGridPage",
  component: PricingGridPage,
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
    priceBadgeVariant: {
      control: { type: "select" },
      options: [ "float", "glow", "ripple" ],
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
      options: ["default", "dark"],
      description: "Visual theme variant for the layout",
    },
    table: {
      control: { type: "boolean" },
      description: "Visual theme variant for the layout",
    },
  }
}

export default meta

type Story = StoryObj<typeof PricingGridPage>

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

    return <PricingGridPage plans={plans} variant="gradient" priceBadgeVariant="float"/>

  },
}

export const DifferntColorsCard: Story = {
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
        name: "Enterprise",
        price: "$29.99",
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

    return <PricingGridPage plans={plans} allowDifferentCardColors />

  },
}

export const PriceBadgePosition: Story = {
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

    return <PricingGridPage plans={plans} pricingBadgePosition="top"/>

  },
}

export const ModernUI: Story = {
  render: () => {
    const plans = [
      {
        name: "Starter",
        price: "$FREE",
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
      },
      {
        name: "Standard",
        price: "$ 19.99/month",
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
      },
      {
        name: "Enterprise",
        price: "$29.99/month",
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
      }
    ]

    return <PricingGridPage title="Pricing Plans For Everyone" description="Lorem ipsum dolor sit amet, consectetur adipiscing" plans={plans} variant="gradient" modernUI="vector" modernVariant="dark"/>

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
    return <PricingGridPage plans={plans} modernUI="basic" animation="fadeUp" table/>

  },
}

export const Interactive :  Story = {
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

    return <PricingGridPage plans={plans} modernVariant="default" modernUI="advance" animation="fadeUp" interactive="press"/>

  },
}

 
