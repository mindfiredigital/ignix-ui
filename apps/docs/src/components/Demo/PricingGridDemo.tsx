import React, { useEffect, useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { PricingGrid } from "@site/src/components/UI/pricing-grid";
import type { PricingTier } from "@site/src/components/UI/pricing-grid";

const animations = ["none", "fade", "slide", "scale", "slide-up", "slide-down"];

const PricingGridBasicDemo = () => {
  const tiers: PricingTier[] = [
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

  const [animation, setAnimation] = useState<string>("slide-up");
  const [showToggle, setShowToggle] = useState<boolean>(false);
  const [showBackgroundImage, setShowBackgroundImage] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0)
  const [scaleRecommended, setScaleRecommended] = useState<boolean>(false);

  useEffect(() => {
    setAnimationKey((k) => k + 1)
  }, [animation, scaleRecommended, showToggle, showBackgroundImage])

  const codeString = `
  const tiers = [
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

  <PricingGrid 
    title="Plans that scale"
    titleHighlight="with your growth"
    description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
    tiers={tiers}${showToggle ? `\n    showToggle`: ''}
    defaultBilling="monthly"${scaleRecommended ? `\n    scaleRecommended`: ''}
    animation="${animation}"${showBackgroundImage ? `\n    sectionBackgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"` : ''}
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={animations}
            selectedVariant={animation}
            onSelectVariant={setAnimation}
            type="Animation"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="scaleRecommended"
            checked={scaleRecommended}
            onChange={() => setScaleRecommended(!scaleRecommended)}
          />
          <label htmlFor="scaleRecommended">Scale Recommended</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showToggle"
            checked={showToggle}
            onChange={() => setShowToggle(!showToggle)}
          />
          <label htmlFor="showToggle">Show Toggle</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showBackgroundImage"
            checked={showBackgroundImage}
            onChange={() => setShowBackgroundImage(!showBackgroundImage)}
          />
          <label htmlFor="showBackgroundImage">Show BackgroundImage</label>
        </div>
      </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="p-4">
              <PricingGrid 
                key={animationKey}
                scaleRecommended={scaleRecommended}
                title="Plans that scale"
                titleHighlight="with your growth"
                description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
                tiers={tiers}
                showToggle={showToggle}
                defaultBilling="monthly"
                animation={animation === "none" ? false : (animation as any)}
                sectionBackgroundImage={
                  showBackgroundImage
                    ? "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"
                    : undefined
                }
              />
            </div>
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

const PricingGridHorizontalDisplay = () => {
  const tiers: PricingTier[] = [
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
      ],
      ctaLabel: "Subscribe",
      recommended: true,
    }
  ];

  const [showBackgroundImage, setShowBackgroundImage] = useState<boolean>(false);

  const codeString = `
  const tiers = [
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
      ],
      ctaLabel: "Subscribe",
      recommended: true,
    }
  ];

  <PricingGrid
    title="Plans that scale"
    titleHighlight="with your growth"
    description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
    tiers={tiers}
    defaultBilling="monthly"
    horizontalHeader${showBackgroundImage ? `\n    sectionBackgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"` : ''}
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showBackgroundImage"
            checked={showBackgroundImage}
            onChange={() => setShowBackgroundImage(!showBackgroundImage)}
          />
          <label htmlFor="showBackgroundImage">Show BackgroundImage</label>
        </div>
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="p-4">
            <PricingGrid 
              title="Plans that scale"
              titleHighlight="with your growth"
              description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
              tiers={tiers}
              horizontalHeader
              showToggle={true}
              defaultBilling="monthly"
              sectionBackgroundImage={
                showBackgroundImage
                  ? "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"
                  : undefined
              }
            />
            </div>
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


const PricingGridWithCardImages = () => {
 
  const tiers= [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
        cardBackgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
        cardBackgroundOverlay: 'bg-black/50',
        buttonColor: 'bg-gray-100 hover:bg-gray-200',
        buttonTextColor: 'text-black',
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
        cardBackgroundImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        cardBackgroundOverlay: 'bg-black/50',
        badgeColor: 'bg-white text-gray-900',
        buttonColor: 'bg-gray-100 hover:bg-gray-200',
        buttonTextColor: 'text-black',
      },
    ];

  const codeString = `
  const tiers = [
    {
      name: 'STARTER',
      price: {
        monthly: '$9 /mo',
      },
      description: 'Perfect for side projects and experiments.',
      features: [
        { label: 'Up to 3 projects' },
        { label: '1 GB storage' },
        { label: 'Basic analytics' },
      ],
      ctaLabel: 'Get Started',
      recommended: false,
      cardBackgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
      cardBackgroundOverlay: 'bg-black/50',
      buttonColor: 'bg-gray-100 hover:bg-gray-200',
      buttonTextColor: 'text-black',
    },
    {
      name: 'PRO',
      price: {
        monthly: '$29 /mo',
      },
      description: 'For growing teams that need more power.',
      features: [
        { label: 'Unlimited projects' },
        { label: '50 GB storage' },
        { label: 'Advanced analytics' },
        { label: 'Priority email support' },
      ],
      ctaLabel: 'Start Free Trial',
      recommended: true,
      cardBackgroundImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      cardBackgroundOverlay: 'bg-black/50',
      badgeColor: 'bg-white text-gray-900',
      buttonColor: 'bg-gray-100 hover:bg-gray-200',
      buttonTextColor: 'text-black',
    }
  ];

  <PricingGrid 
    title="Plans that scale"
    titleHighlight="with your growth"
    horizontalHeader
    description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
    tiers={tiers}
    showToggle={true}
    defaultBilling="monthly"
    scaleRecommended={true}
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
              <PricingGrid 
                title="Plans that scale"
                titleHighlight="with your growth"
                horizontalHeader
                description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
                tiers={tiers}
                showToggle={true}
                defaultBilling="monthly"
                scaleRecommended={true}
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

export { PricingGridBasicDemo, PricingGridHorizontalDisplay, PricingGridWithCardImages };
