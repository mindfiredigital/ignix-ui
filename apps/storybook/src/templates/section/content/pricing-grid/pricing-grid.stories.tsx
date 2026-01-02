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

    return <PricingGrid plans={plans} variant="gradient"/>

  },
}

export const BasicLight: Story = {
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

    return <PricingGrid plans={plans} modernVariant="light"/>

  },
}

export const Vector: Story = {
   render: () => {
   const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
        gradient: "bg-gradient-to-br from-yellow-900 to-orange-500",
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
        gradient: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
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
        price: "$29.99",
        gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
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

    return <PricingGrid plans={plans} modernUI="vector" />

  },
}

export const PriceBadgePosition: Story = {
   render: () => {
    const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
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
        ctaLabel: "Check Now"
      },
      {
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
        ctaLabel: "Check Now"
      },
      {
        name: "Enterprise",
        price: "29.99",
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
        ctaLabel: "Check Now"
      }
    ]
    return <PricingGrid plans={plans} modernUI="vector" animation="fadeIn" pricingBadgePosition="top"/>

  },
}

export const VectorTable: Story = {
   render: () => {
    const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
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
        ctaLabel: "Check Now"
      },
      {
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
        ctaLabel: "Check Now"
      },
      {
        name: "Enterprise",
        price: "29.99",
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
        ctaLabel: "Check Now"
      }
    ]
    return <PricingGrid plans={plans} modernUI="vector" animation="fadeIn" pricingBadgePosition="top" table/>
  },
}

export const DifferentColorsCard: Story = {
   render: () => {
   const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
        gradient: "bg-gradient-to-br from-yellow-900 to-orange-500",
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
        gradient: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
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
        price: "$29.99",
        gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
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

    return <PricingGrid plans={plans} modernUI="vector" allowDifferentCardColors />

  },
}

export const Animation :  Story = {
  render: () => {
    const plans = [
      {
        name: "Starter",
        price: "$FREE /month",
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
        ctaLabel: "Check Now"
      },
      {
        name: "Standard",
        price: "$ 19.99 /month",
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
        ctaLabel: "Check Now"
      },
      {
        name: "Enterprise",
        price: "29.99",
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
        ctaLabel: "Check Now"
      }
    ]

    return <PricingGrid plans={plans} pricingBadgePosition="top" modernUI="vector"/>

  },
}

export const Advance :  Story = {
  render: () => {
    const plans = [
      {
        id: 3,
        name: "Starter",
        price: "$FREE /month",
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

    return <PricingGrid plans={plans} modernVariant="default" modernUI="advance" animation="bounceIn" interactive="press"/>

  },
}

export const ErrorDisplay :  Story = {
  render: () => {
    const plans = [
      {
        id: 3,
        //name: "Starter",
        price: "$FREE /month",
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

    return <PricingGrid plans={plans} modernVariant="default" modernUI="advance" animation="bounceIn" interactive="press"/>

  },
}

 
