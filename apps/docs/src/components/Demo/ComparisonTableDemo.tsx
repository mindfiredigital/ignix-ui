import React, { useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
  Gem,
  Crown,
} from "lucide-react"
import { ComparisonTable } from "../UI/comparison-table";

const variants = [ "default", "dark", "light"];
const animations = ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"];
const interactives = ["none", "hover", "press", "lift", "tilt", "glow"];
const mobileBreakpoints = ["sm", "md", "lg"];

const ComparisonTableDemo = () => {
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
  const [animation, setAnimation] = useState<string>("fadeIn");
  const [interactive, setInteractive] = useState<string>("press");
  const [variant, setVariant] = useState<string>("default");
  const [mobileBreakpoint, setMobileBreakpoint] = useState<string>("md");
  const handleClick = (plans) => {
    console.log(plans.name);
    // your plan action goes here
  };

  const codeString = `
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

  const handleClick = (plans) => {
    console.log(plans.name);
    // your plan action goes here
  };
  <ComparisonTable 
    features={features}
    plans={plans} 
    onCtaClick={(plans) => handleClick(plans)}
    variant="${variant}"
    animation="${animation}"
    interactive="${interactive}"
    mobileBreakpoint="${mobileBreakpoint}"
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

        <div className="space-y-2">
          <VariantSelector
            variants={mobileBreakpoints}
            selectedVariant={mobileBreakpoint}
            onSelectVariant={setMobileBreakpoint}
            type="Mobile Break Point"
          />
        </div>
    </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <ComparisonTable 
              key={`${animation}-${interactive}-${variant}`}
              features={features}
              plans={plans} 
              onCtaClick={(plans) => handleClick(plans)}
              variant={variant as any}
              animation={animation as any}
              interactive={interactive as any}
              mobileBreakpoint={mobileBreakpoint as any}
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

const ComparisonTableGradientDemo = () => {
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
      gradient: "bg-gray-200 text-gray-900",
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
      gradient: "bg-gray-300 text-gray-950",
      recommended: true,
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
      gradient: "bg-gray-200 text-gray-900",
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
      gradient: "bg-gray-200 text-gray-900",
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
      gradient: "bg-gray-300 text-gray-950",
      recommended: true,
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
      gradient: "bg-gray-200 text-gray-900",
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
  <ComparisonTable 
    features={features}
    plans={plans} 
    variant="light"
    featureGradient="bg-gray-200 text-gray-900"
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <ComparisonTable 
              featureGradient="bg-gray-200 text-gray-900"
              features={features}
              plans={plans} 
              variant="light"
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

const ComparisonTableRecommendedGradientDemo = () => {
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
      recommended: true,
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
  <ComparisonTable 
    features={features}
    plans={plans} 
    variant="light"
    recommendationGradient="bg-emerald-700/30 text-white"
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden">
            <ComparisonTable 
              features={features}
              plans={plans} 
              variant="light"
              recommendationGradient="bg-emerald-700/30 text-white"
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

export { ComparisonTableDemo, ComparisonTableGradientDemo, ComparisonTableRecommendedGradientDemo };
