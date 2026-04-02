import type { Meta, StoryObj } from "@storybook/react-vite"
import { BillingPage } from "."
import { 
  Home, 
  Settings2, 
  Proportions, 
  Crown, 
  CreditCard,
} from "lucide-react"

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
    currentPlanId: 2,
    renewalDate: new Date("2025-03-21"),
    subscriptionStatus: "active",
    billingCycle: "monthly",

    showUsageOverview: true,
    showPricing: true,
    showBillingTable: true,

    invoices: [
      {
        id: "1",
        plan: "Pro Annual",
        date: "Jan 21, 2025",
        amount: "$29.00",
        status: "Pending",
        invoiceNumber: "INV-2025-001",
      },
      {
        id: "2",
        plan: "Pro Annual",
        date: "Dec 21, 2024",
        amount: "$29.00",
        status: "Failed",
        invoiceNumber: "INV-2024-012",
      },
      {
        id: "5",
        plan: "Pro Annual",
        date: "Nov 21, 2024",
        amount: "$29.00",
        status: "Paid",
        invoiceNumber: "INV-2024-011",
      },
      {
        id: "3",
        plan: "Pro Annual",
        date: "Oct 21, 2024",
        amount: "$29.00",
        status: "Paid",
        invoiceNumber: "INV-2024-010",
      },
      {
        id: "4",
        plan: "Pro Annual",
        date: "Sep 21, 2024",
        amount: "$29.00",
        status: "Paid",
        invoiceNumber: "INV-2024-009",
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
      brand: CreditCard,
      cardNumber: "4242424242424242",
      expiryMonth: "12",
      expiryYear: "26",
      cardHolderName: "John Doe",
    },
  },

  argTypes: {
    animation: {
      control: "select",
      options: ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"],
    },
    subscriptionStatus: {
      control: "select",
      options: ["active", "trial", "canceled", "past_due", "expired", "pending"],
      description: "Current subscription status",
    },
    billingCycle: {
      control: "select",
      options: ["monthly", "yearly"],
      description: "Billing cycle frequency",
    },
  },
}

export default meta
type Story = StoryObj<typeof BillingPage>

/* -------------------------------------------------------------------------------------------------
 * Stories
 * ------------------------------------------------------------------------------------------------- */

export const LazyLoadingDemo: Story = {
  args: {
    ...meta.args,
    headerTitle: "Lazy Loading Demo",
    headerIcon: Crown,
    currentPlanId: 2,
    subscriptionStatus: "active",
    billingCycle: "monthly",
    renewalDate: new Date("2025-04-15"),
    showUsageOverview: true,
    showPricing: true,
    showBillingTable: true,
    apiUsage: {
      label: "API Calls",
      used: 25000,
      total: 50000,
      unit: "",
    },
    storageUsage: {
      label: "Storage",
      used: 50,
      total: 100,
      unit: "GB",
    },
    seatsUsage: {
      label: "Active Seats",
      used: 5,
      total: 10,
    },
    invoices: [
      {
        id: "1",
        plan: "Pro Monthly",
        date: "Mar 21, 2025",
        amount: "$29.00",
        status: "Paid",
        invoiceNumber: "INV-2025-003",
      },
      {
        id: "2",
        plan: "Pro Monthly",
        date: "Feb 21, 2025",
        amount: "$29.00",
        status: "Paid",
        invoiceNumber: "INV-2025-002",
      },
      {
        id: "3",
        plan: "Pro Monthly",
        date: "Jan 21, 2025",
        amount: "$29.00",
        status: "Paid",
        invoiceNumber: "INV-2025-001",
      },
    ],
    plans: [
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
    ],
    features: [
      { id: 1, label: "Projects" },
      { id: 2, label: "Support" },
      { id: 3, label: "Integrations" },
    ],
  }
}

export const SkeletonLoaders: Story = {
  args: {
    ...meta.args,
    isLoading: true,
    headerTitle: "Loading State",
    headerIcon: Crown,
    showUsageOverview: true,
    showPricing: true,
    showBillingTable: true,
  }
}

export const Default: Story = {
  args: {},
}

export const DifferentSubscriptionStatus: Story = {
  args: {
    ...meta.args,
    subscriptionStatus: "trial",
    currentPlanId: 1,
    renewalDate: new Date("2025-04-15"),
  },
}

export const CanceledSubscription: Story = {
  args: {
    ...meta.args,
    subscriptionStatus: "canceled",
    currentPlanId: 2,
  },
}

export const NoPricingSection: Story = {
  args: {
    ...meta.args,
    showPricing: false,
  },
}

export const NoUsageOverview: Story = {
  args: {
    ...meta.args,
    showUsageOverview: false,
  },
}

export const NoBillingTable: Story = {
  args: {
    ...meta.args,
    showBillingTable: false,
  },
}

// export const DarkTheme: Story = {
//   args: {
//     ...meta.args,
//     headerTitle: "Billing Dashboard",
//     headerIcon: Crown,
//   },
//   parameters: {
//     backgrounds: {
//       default: "dark",
//     },
//   },
//   decorators: [
//     (Story) => (
//       <div className="dark bg-slate-950 min-h-screen">
//         <Story />
//       </div>
//     ),
//   ],
// }