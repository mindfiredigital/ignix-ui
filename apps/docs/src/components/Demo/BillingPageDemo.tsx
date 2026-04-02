import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import CodeBlock from "@theme/CodeBlock";
import { useState } from "react";
import { X, CreditCard, Wallet, Banknote, Coins } from "lucide-react";
import { BillingPage } from "@site/src/components/UI/billing-page";
import { Card } from "@site/src/components/UI/card";
import { Typography } from "@site/src/components/UI/typography";
import { Button } from "@site/src/components/UI/button";

const BillingPageDemo = () => {
  const [open, setOpen] = useState<boolean>(false)

  const AVAILABLE_PAYMENT_METHODS = [
    {
      id: "visa",
      label: "Visa",
      icon: CreditCard,
    },
    {
      id: "mastercard",
      label: "Mastercard",
      icon: Wallet,
    },
    {
      id: "amex",
      label: "American Express",
      icon: Banknote,
    },
    {
      id: "paypal",
      label: "PayPal",
      icon: Coins,
    },
  ]
   const plans = [
      {
        name: "Starter",
        price: {
          monthly: "$FREE /mo",
        },
        description: "Perfect for getting started",
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
        ],
        ctaLabel: "Sign Up",
        recommended: false,
      },
      {
        name: "Standard",
        price: {
          monthly: "$19.99 /mo",
          annual: "$15.99 /mo",
        },
        description: "For growing teams",
        features: [
          { label: "Storage 20GB" },
          { label: "Databases 20" },
          { label: "License" },
          { label: "Email Accounts" },
        ],
        ctaLabel: "Subscribe",
        recommended: true,
      },
      {
        name: "Enterprise",
        price: {
          monthly: "$29.99 /mo",
          annual: "$23.99 /mo",
        },
        description: "For organizations",
        features: [
          { label: "Storage 50GB" },
          { label: "Databases 50" },
          { label: "License" },
          { label: "Email Accounts" },
        ],
        ctaLabel: "Check Now",
        recommended: false,
      }
    ];

  const codeString = `
    import { BillingPage } from "@ignix-ui/billingpage";
    const plans = [
      {
        name: "Starter",
        price: {
          monthly: "$FREE /mo",
        },
        description: "Perfect for getting started",
        features: [
          { label: "Disk Space 128 GB" },
          { label: "Bandwidth 15 GB" },
          { label: "Databases 1" },
          { label: "License", available: false },
        ],
        ctaLabel: "Sign Up",
        recommended: false,
      },
      {
        name: "Standard",
        price: {
          monthly: "$19.99 /mo",
          annual: "$15.99 /mo",
        },
        description: "For growing teams",
        features: [
          { label: "Storage 20GB" },
          { label: "Databases 20" },
          { label: "License" },
          { label: "Email Accounts" },
        ],
        ctaLabel: "Subscribe",
        recommended: true,
      },
      {
        name: "Enterprise",
        price: {
          monthly: "$29.99 /mo",
          annual: "$23.99 /mo",
        },
        description: "For organizations",
        features: [
          { label: "Storage 50GB" },
          { label: "Databases 50" },
          { label: "License" },
          { label: "Email Accounts" },
        ],
        ctaLabel: "Check Now",
        recommended: false,
      }
    ];
    <BillingPage
      renewalDate={new Date("2025-03-21")}
      currentPlanIndex={1}
      subscriptionStatus="active"
      billingCycle="monthly"
      plans={plans}
      invoices={[
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
          status: "Paid",
        },
        {
          id: "3",
          plan: "Pro Annual",
          date: "Dec 21, 2024",
          amount: "$23",
          status: "Failed",
        },
        {
          id: "4",
          plan: "Pro Annual",
          date: "Dec 21, 2024",
          amount: "$24",
          status: "Paid",
        },
        {
          id: "5",
          plan: "Pro Annual",
          date: "Dec 21, 2024",
          amount: "$25",
          status: "Paid",
        },
        {
          id: "6",
          plan: "Pro Annual",
          date: "Dec 21, 2024",
          amount: "$26",
          status: "Paid",
        },
      ]}
      apiUsage={{
        label: "API Calls",
        used: 41000,
        total: 50000,
        unit: "",
      }}
      storageUsage={{
        label: "Storage",
        used: 45,
        total: 100,
        unit: "GB",
      }}
      seatsUsage={{
        label: "Active Seats",
        used: 8,
        total: 10,
      }}
      card={{
        brand: CreditCard,
        cardNumber: "4242424242424242",
        expiryMonth: "12",
        expiryYear: "26",
        cardHolderName: "John Doe",
      }}
      onUpdatePaymentMethod={() => setOpen(true)}
      renderUpdatePaymentMethod={() =>
        open ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setOpen(false)}   
          >
            <Card
              className="w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">Select Payment Method</Typography>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:cursor-pointer"
                  onClick={() => setOpen(false)}   
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {AVAILABLE_PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      className="w-full flex items-center gap-4 rounded-lg border p-3 hover:bg-muted transition hover:cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="font-medium">{method.label}</span>
                    </button>
                  )
                })}
              </div>

              <Typography variant="body-small" className="mt-4 text-zinc-500">
                This is a demo selector for open-source usage.
                No real payment data is collected.
              </Typography>
            </Card>
          </div>
        ) : null
      }
    />
  `;

  return (
    <div className="space-y-6 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden p-4">
            <BillingPage
              renewalDate={new Date("2025-03-21")}
              currentPlanIndex={1}
              subscriptionStatus="active"
              billingCycle="monthly"
              plans={plans}
              invoices={[
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
                  status: "Paid",
                },
                {
                  id: "3",
                  plan: "Pro Annual",
                  date: "Dec 21, 2024",
                  amount: "$23",
                  status: "Failed",
                },
                {
                  id: "4",
                  plan: "Pro Annual",
                  date: "Dec 21, 2024",
                  amount: "$24",
                  status: "Paid",
                },
                {
                  id: "5",
                  plan: "Pro Annual",
                  date: "Dec 21, 2024",
                  amount: "$25",
                  status: "Paid",
                },
                {
                  id: "6",
                  plan: "Pro Annual",
                  date: "Dec 21, 2024",
                  amount: "$26",
                  status: "Paid",
                },
              ]}
              apiUsage={{
                label: "API Calls",
                used: 41000,
                total: 50000,
                unit: "",
              }}
              storageUsage={{
                label: "Storage",
                used: 45,
                total: 100,
                unit: "GB",
              }}
              seatsUsage={{
                label: "Active Seats",
                used: 8,
                total: 10,
              }}
              card={{
                brand: CreditCard,
                cardNumber: "4242424242424242",
                expiryMonth: "12",
                expiryYear: "26",
                cardHolderName: "John Doe",
              }}
              onUpdatePaymentMethod={() => setOpen(true)}
              renderUpdatePaymentMethod={() =>
                open ? (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setOpen(false)}   // backdrop close
                  >
                    <Card
                      className="w-full max-w-md p-6"
                      onClick={(e) => e.stopPropagation()} // prevent click-through
                    >
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6">Select Payment Method</Typography>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:cursor-pointer"
                          onClick={() => setOpen(false)}   // ❗ REQUIRED
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {AVAILABLE_PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon
                          return (
                            <button
                              key={method.id}
                              className="w-full flex items-center gap-4 rounded-lg border p-3 hover:bg-muted transition hover:cursor-pointer"
                              onClick={() => setOpen(false)}
                            >
                              <Icon className="w-8 h-8" />
                              <span className="font-medium">{method.label}</span>
                            </button>
                          )
                        })}
                      </div>

                      <Typography variant="body-small" className="mt-4 text-zinc-500">
                        This is a demo selector for open-source usage.
                        No real payment data is collected.
                      </Typography>
                    </Card>
                  </div>
                ) : null
              }
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default BillingPageDemo;
