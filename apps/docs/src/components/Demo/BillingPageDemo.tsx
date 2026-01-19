import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import CodeBlock from "@theme/CodeBlock";
import { useEffect, useState } from "react";
import VariantSelector from "./VariantSelector";
import { BillingPage } from "../UI/billing-page";
import { Crown, Gem, X } from "lucide-react";
import { FaCcAmex, FaCcMastercard, FaCcPaypal, FaCcVisa } from "react-icons/fa";
import { Card } from "../UI/card";
import { Typography } from "../UI/typography";
import { Button } from "../UI/button";

const variants = [ "default", "dark", "light"];
const animations = ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"];

const BillingPageDemo = () => {
  const [animation, setAnimation] = useState<string>("fadeIn");
  const [variant, setVariant] = useState<string>("default");
  const [open, setOpen] = useState<boolean>(false)
  const [animationKey, setAnimationKey] = useState<number>(0)

  useEffect(() => {
    setAnimationKey((k) => k + 1)
  }, [animation])

  const AVAILABLE_PAYMENT_METHODS = [
    {
      id: "visa",
      label: "Visa",
      icon: FaCcVisa,
    },
    {
      id: "mastercard",
      label: "Mastercard",
      icon: FaCcMastercard,
    },
    {
      id: "amex",
      label: "American Express",
      icon: FaCcAmex,
    },
    {
      id: "paypal",
      label: "PayPal",
      icon: FaCcPaypal,
    },
  ]
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
    },
  ];

  const codeString = `
    const AVAILABLE_PAYMENT_METHODS = [
      {
        id: "visa",
        label: "Visa",
        icon: FaCcVisa,
      },
      {
        id: "mastercard",
        label: "Mastercard",
        icon: FaCcMastercard,
      },
      {
        id: "amex",
        label: "American Express",
        icon: FaCcAmex,
      },
      {
        id: "paypal",
        label: "PayPal",
        icon: FaCcPaypal,
      },
    ]
    <BillingPage
      renewalDate={new Date("2025-03-21")}
      animation="${animation}"
      variant="${variant}"
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
      onInvoiceView={(invoice) => console.log("View", invoice.id)}
      onInvoiceDownload={(invoice) => console.log("Download", invoice.id)}
      onInvoiceDelete={(invoice) => console.log("Delete", invoice.id)}
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
      onCancelSubscription={() => {
        console.log("Cancel subscription")
      }}
      card={{
        brand: FaCcVisa,
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
      <div className="flex flex-wrap gap-3 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={variants}
            selectedVariant={variant}
            onSelectVariant={setVariant}
            type="Variant"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={animations}
            selectedVariant={animation}
            onSelectVariant={setAnimation}
            type="Animation"
          />
        </div>

      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4">
            <BillingPage
              key={animationKey}
              animation={animation as any}
              renewalDate={new Date("2025-03-21")}
              variant={variant as any}
              plans={plans}
              features={features}
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
              onInvoiceView={(invoice) => console.log("View", invoice.id)}
              onInvoiceDownload={(invoice) => console.log("Download", invoice.id)}
              onInvoiceDelete={(invoice) => console.log("Delete", invoice.id)}
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
              onCancelSubscription={() => {
                console.log("Cancel subscription")
              }}
              card={{
                brand: FaCcVisa,
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
