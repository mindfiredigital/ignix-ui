import React, { useEffect, useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { PricingGrid } from "../UI/pricing-grid";
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

const pricingBadgePositions = [ "none", "top", "middle" ];
const variants = [ "default", "dark", "light" ];
const animations = ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"];
const interactives = ["none", "hover", "press", "lift", "tilt", "glow"];
const modernUIs = ["vector", "", "advance"];

const PricingGridBasicDemo = () => {
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
      ctaLabel: "Sign Up"
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
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
      icon: BarChart3,
      features: [
        { label: "Storage 50GB", icon: HardDrive },
        { label: "Databases 50", icon: Database },
        { label: "License", icon: Settings2 },
        { label: "Email Accounts", icon: Mail },
        { label: "24/7 Support", icon: LifeBuoy },
        { label: "Agent Support", icon: Users },
      ],
      ctaLabel: "Check Now"
    }
  ];

  const [animation, setAnimation] = useState<string>("fadeIn");
  const [interactive, setInteractive] = useState<string>("press");
  const [variant, setVariant] = useState<string>("dark");
  const [animationKey, setAnimationKey] = useState<number>(0)

  useEffect(() => {
    setAnimationKey((k) => k + 1)
  }, [animation])

  const codeString = `
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
      ctaLabel: "Sign Up"
    },
    {
      name: "Standard",
      price: "$19.99 /month",
      highlighted: true,
      icon: CreditCard,
      currentPlan: true,
      gradient: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
      features: [
        { label: "Storage 20GB", icon: HardDrive },
        { label: "Databases 20", icon: Database },
        { label: "License", icon: Settings2  },
        { label: "Email Accounts", icon: Mail },
        { label: "24/7 Support", icon: LifeBuoy },
        { label: "Agent Support", icon: Users, available: false },
      ],
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
      icon: BarChart3,
      features: [
        { label: "Storage 50GB", icon: HardDrive },
        { label: "Databases 50", icon: Database },
        { label: "License", icon: Settings2 },
        { label: "Email Accounts", icon: Mail },
        { label: "24/7 Support", icon: LifeBuoy },
        { label: "Agent Support", icon: Users },
      ],
      ctaLabel: "Check Now"
    }
  ];
  <PricingGrid 
    plans={plans} 
    variant="${variant}"
    animation="${animation}"
    interactive="${interactive}"
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
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

        <div className="space-y-2">
          <VariantSelector
            variants={interactives}
            selectedVariant={interactive}
            onSelectVariant={setInteractive}
            type="Interactive"
          />
        </div>
    </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <PricingGrid 
              key={animationKey}
              plans={plans} 
              modernUI="basic"
              modernVariant={variant as any}
              animation={animation as any}
              interactive={interactive as any}
            />
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

const PricingGridModernDemo = () => {
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
      ctaLabel: "Sign Up"
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
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
      icon: BarChart3,
      features: [
        { label: "Storage 50GB", icon: HardDrive },
        { label: "Databases 50", icon: Database },
        { label: "License", icon: Settings2 },
        { label: "Email Accounts", icon: Mail },
        { label: "24/7 Support", icon: LifeBuoy },
        { label: "Agent Support", icon: Users },
      ],
      ctaLabel: "Check Now"
    }
  ];
  const [modernUI, setmodernUI] = useState<string>("advance");
  const [pricingBadgePosition, setPricingBadgePosition] = useState<string>("middle");
  const [differentColors, setDifferentColors] = useState<boolean>(false);
  const [table, setTable] = useState<boolean>(false);

  let vectorOnlyProps = "";

  if (modernUI === "vector") {
    vectorOnlyProps += `pricingBadgePosition="${pricingBadgePosition}" `;

    if (differentColors) {
      vectorOnlyProps += `allowDifferentCardColors `;
    }

    if(table) {
      vectorOnlyProps += `table`;
    }
  }

  const codeString = `
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
      ctaLabel: "Sign Up"
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
        { label: "License", icon: Settings2 },
        { label: "Email Accounts", icon: Mail },
        { label: "24/7 Support", icon: LifeBuoy },
        { label: "Agent Support", icon: Users, available: false },
      ],
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
      icon: BarChart3,
      features: [
        { label: "Storage 50GB", icon: HardDrive },
        { label: "Databases 50", icon: Database },
        { label: "License", icon: Settings2 },
        { label: "Email Accounts", icon: Mail },
        { label: "24/7 Support", icon: LifeBuoy },
        { label: "Agent Support", icon: Users },
      ],
      ctaLabel: "Check Now"
    }
  ];

  <PricingGrid
    plans={plans}
    modernUI="${modernUI}"
    ${vectorOnlyProps}
  />
  `;

 
  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={modernUIs}
            selectedVariant={modernUI}
            onSelectVariant={setmodernUI}
            type="Modern UI"
          />
        </div>

        {/* ✅ Checkbox for Different Colors */}
        {modernUI === "vector" && (
        <>
          <div className="space-y-2">
            <VariantSelector
              variants={pricingBadgePositions}
              selectedVariant={pricingBadgePosition}
              onSelectVariant={setPricingBadgePosition}
              type="Pricing Badge Position"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="differentColors"
              checked={differentColors}
              onChange={() => setDifferentColors(!differentColors)}
            />
            <label htmlFor="differentColors">Allow Different Colors</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="table"
              checked={table}
              onChange={() => setTable(!table)}
            />
            <label htmlFor="table">Feature in table</label>
          </div>
        </>
      )}

      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <PricingGrid 
              plans={plans} 
              modernUI={modernUI as any} // ✅ pass prop
              pricingBadgePosition={pricingBadgePosition as any}
              allowDifferentCardColors={differentColors}
              table={table}
            />
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};


export { PricingGridBasicDemo, PricingGridModernDemo };
