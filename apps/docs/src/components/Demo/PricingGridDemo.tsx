import React, { useState } from "react";
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
const variants = [ "default", "dark" ];
const animations = ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"];
const interactives = ["none", "hover", "press", "lift", "tilt", "glow"];
const modernUIs = ["vector", "", "advance"];

const PricingGridBasicDemo = () => {
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
      ctaLabel: "Sign Up"
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
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "from-teal-500 to-emerald-500",
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

  const [pricingBadgePosition, setPricingBadgePosition] = useState("middle");
  const [animation, setAnimation] = useState("fadeIn");
  const [interactive, setInteractive] = useState("press");
  const [variant, setVariant] = useState("dark");
  const [differentColors, setDifferentColors] = useState(false); // ✅ new state

  const codeString = `
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
      ctaLabel: "Sign Up"
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
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "from-teal-500 to-emerald-500",
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
    pricingBadgePosition="${pricingBadgePosition}"
    ${differentColors ? "allowDifferentCardColors" : ""}
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
            variants={pricingBadgePositions}
            selectedVariant={pricingBadgePosition}
            onSelectVariant={setPricingBadgePosition}
            type="Pricing Badge Position"
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

        {/* ✅ Checkbox for Different Colors */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="differentColors"
            checked={differentColors}
            onChange={() => setDifferentColors(!differentColors)}
          />
          <label htmlFor="differentColors">Allow Different Colors</label>
        </div>
      </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <PricingGrid 
              plans={plans} 
              variant={variant as any}
              animation={animation as any}
              interactive={interactive as any}
              pricingBadgePosition={pricingBadgePosition as any}
              allowDifferentCardColors={differentColors} // ✅ pass prop
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
      ctaLabel: "Sign Up"
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
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "from-teal-500 to-emerald-500",
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
  const [modernUI, setmodernUI] = useState("vector");

  const codeString = `
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
      ctaLabel: "Sign Up"
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
      ctaLabel: "Subscribe"
    },
    {
      name: "Enterprise",
      price: "$29.99 /month",
      gradient: "from-teal-500 to-emerald-500",
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
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <PricingGrid 
              plans={plans} 
              modernUI={modernUI as any} // ✅ pass prop
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
