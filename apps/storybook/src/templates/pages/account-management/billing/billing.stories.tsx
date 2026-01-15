import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { BillingPage } from "."
import { Home, Settings2, Proportions, X, Crown } from "lucide-react"
import { FaCcAmex, FaCcMastercard, FaCcPaypal, FaCcVisa } from "react-icons/fa"

import { Card } from "../../../../components/card"
import { Typography } from "../../../../components/typography"
import { Button } from "../../../../components/button"

/* -------------------------------------------------------------------------------------------------
 * Comparison-first data (single source of truth)
 * ------------------------------------------------------------------------------------------------- */

  const features =  [
    { id: 1, label: "Projects" },
    { id: 2, label: "Support" },
    { id: 3, label: "Integrations" },
  ]

  const plans= [
    {
      id: 1,
      name: "Starter",
      price: "$0/month",
      icon: Home,
      ctaLabel: "Get Started",
      featureMap: {
        1: "email",
        2: false,
        3: false,
      },
    },
    {
      id: 2,
      name: "Pro",
      price: "$29/month",
      icon: Settings2,
      ctaLabel: "Upgrade",
      featureMap: {
        1: true,
        2: true,
        3: false,
      },
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$99/month",
      icon: Proportions,
      recommended: true,
      ctaLabel: "Contact Sales",
      featureMap: {
        1: true,
        2: true,
        3: true,
      },
    },
  ]

/* -------------------------------------------------------------------------------------------------
 * Meta
 * ------------------------------------------------------------------------------------------------- */

const meta: Meta<typeof BillingPage> = {
  title: "Templates/Pages/Account Management/BillingPage",
  component: BillingPage,
  tags: ["autodocs"],
  args: {
    headerTitle: "OpenSrc",
    headerIcon: Crown,

    features: features,
    plans: plans,
    currentPlanId: 1,
    renewalDate: new Date("2025-03-21"),

    showUsageOverview: true,
    showPricing: true,
    showBillingTable: true,

    invoices: [
      {
        id: "1",
        plan: "Pro Annual",
        date: "Jan 21, 2025",
        amount: "$21",
        status: "Pending",
      },
      {
        id: "2",
        plan: "Pro Annual",
        date: "Dec 21, 2024",
        amount: "$22",
        status: "Failed",
      },
      {
        id: "5",
        plan: "Pro Annual",
        date: "Dec 21, 2024",
        amount: "$22",
        status: "Paid",
      },
        {
        id: "3",
        plan: "Pro Annual",
        date: "Dec 21, 2024",
        amount: "$22",
        status: "Paid",
      },
      {
        id: "4",
        plan: "Pro Annual",
        date: "Dec 21, 2024",
        amount: "$22",
        status: "Paid",
      },
    ],

    apiUsage: {
      label: "API Calls",
      used: 41000,
      total: 50000,
      unit: "",
    },

    storageUsage: {
      label: "Storage",
      used: 45,
      total: 100,
      unit: "GB",
    },

    seatsUsage: {
      label: "Active Seats",
      used: 8,
      total: 10,
    },

    card: {
      brand: FaCcVisa,
      cardNumber: "4242424242424242",
      expiryMonth: "12",
      expiryYear: "26",
    },

    onInvoiceView: invoice => console.log("View", invoice.id),
    onInvoiceDownload: invoice => console.log("Download", invoice.id),
    onInvoiceDelete: invoice => console.log("Delete", invoice.id),

    onCancelSubscription: () => console.log("Cancel subscription"),
  },

  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "light"],
    },
    animation: {
      control: "select",
      options: ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"],
    },
  },
}

export default meta
type Story = StoryObj<typeof BillingPage>

/* -------------------------------------------------------------------------------------------------
 * Stories
 * ------------------------------------------------------------------------------------------------- */

export const Default: Story = {
  args: { variant: "default" },
}

export const Minimal: Story = {
  args: { 
    variant: "default", 
    showPricing: false },
}

export const Dark: Story = {
  args: { variant: "dark" },
}

export const Light: Story = {
  args: { variant: "light" },
}

/* -------------------------------------------------------------------------------------------------
 * Modal example (headless / consumer-controlled)
 * ------------------------------------------------------------------------------------------------- */

export const Modal: Story = {
  render: args => {
    const [open, setOpen] = React.useState(false)

    const AVAILABLE_PAYMENT_METHODS = [
      { id: "visa", label: "Visa", icon: FaCcVisa },
      { id: "mastercard", label: "Mastercard", icon: FaCcMastercard },
      { id: "amex", label: "American Express", icon: FaCcAmex },
      { id: "paypal", label: "PayPal", icon: FaCcPaypal },
    ]

    return (
      <>
        <BillingPage
          {...args}
          onUpdatePaymentMethod={() => setOpen(true)}
          renderUpdatePaymentMethod={() =>
            open ? (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={() => setOpen(false)}
              >
                <Card
                  className="w-full max-w-md p-6"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6">Select Payment Method</Typography>
                    <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {AVAILABLE_PAYMENT_METHODS.map(method => {
                      const Icon = method.icon
                      return (
                        <button
                          key={method.id}
                          className="w-full flex items-center gap-4 rounded-lg border p-3 hover:bg-muted"
                          onClick={() => setOpen(false)}
                        >
                          <Icon className="w-8 h-8" />
                          <span className="font-medium">{method.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  <Typography variant="body-small" className="mt-4 text-zinc-500">
                    Demo selector — no real payment data.
                  </Typography>
                </Card>
              </div>
            ) : null
          }
        />
      </>
    )
  },
}

export const onCancelSubscription: Story = {
  args: { variant: "default" },
}