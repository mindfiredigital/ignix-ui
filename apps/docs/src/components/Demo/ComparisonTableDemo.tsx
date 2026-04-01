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

const variants = [ "default", "dark", "light"] as const;
const animations = ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"] as const;
const interactives = ["none", "hover", "press", "lift", "tilt", "glow"] as const;
const mobileBreakpoints = ["sm", "md", "lg"] as const;

type ComparisonTableVariant = typeof variants[number];
type ComparisonTableAnimations = typeof animations[number];
type ComparisonTableInteractives = typeof interactives[number];
type ComparisonTableMobileBreakpoints = typeof mobileBreakpoints[number];

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
  const [animation, setAnimation] = useState<ComparisonTableAnimations>("fadeIn");
  const [interactive, setInteractive] = useState<ComparisonTableInteractives>("press");
  const [variant, setVariant] = useState<ComparisonTableVariant>("default");
  const [mobileBreakpoint, setMobileBreakpoint] = useState<ComparisonTableMobileBreakpoints>("md");

  const codeString = `
    import { ComparisonTable } from '@ignix-ui/comparisontable';

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
            variants={[...variants]}
            selectedVariant={variant}
            onSelectVariant={(v) => setVariant(v as ComparisonTableVariant)}
            type="Variant"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...animations]}
            selectedVariant={animation}
            onSelectVariant={(v) => setAnimation(v as ComparisonTableAnimations)}
            type="Animation"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...interactives]}
            selectedVariant={interactive}
            onSelectVariant={(v) => setInteractive(v as ComparisonTableInteractives)}
            type="Interactive"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...mobileBreakpoints]}
            selectedVariant={mobileBreakpoint}
            onSelectVariant={(v) => setMobileBreakpoint(v as ComparisonTableMobileBreakpoints)}
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
              variant={variant}
              animation={animation}
              interactive={interactive}
              mobileBreakpoint={mobileBreakpoint}
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
