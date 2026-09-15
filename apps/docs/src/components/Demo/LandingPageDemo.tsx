import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { LandingPage } from "@site/src/components/UI/landing-page";

// Matches Storybook's own "Default" story exactly - <LandingPage /> with no
// props at all, so this demo and Storybook never drift into showing two
// different "defaults".
const defaultCode = `
import { LandingPage } from "@ignix-ui/landing-page";

export function Example() {
  return <LandingPage />;
}
`.trim();

// Every section entrance-animates in (fade/slide + stagger) via framer-motion
// - heroTone="bold" and featuresVariant="showcase" additionally give the
// hero and feature sections their own dramatic, always-dark, alternating
// panel treatment, so the animation is easiest to see in this variant.
const animatedCode = `
import { LandingPage } from "@ignix-ui/landing-page";

export function AnimatedExample() {
  return (
    <LandingPage
      brandName="Nova"
      heroTone="bold"
      heroEyebrow="Now in public beta"
      heroHeadline="Newsletters. Products. One platform."
      heroSubheadline="The all-in-one toolkit for shipping, growing, and monetizing your SaaS - start in seconds."
      heroPrimaryCtaLabel="Start building"
      heroSecondaryCtaLabel="Talk to sales"
      featuresVariant="showcase"
      testimonialsVariant="spotlight"
      onHeroPrimaryCtaClick={() => console.log("Primary CTA")}
    />
  );
}
`.trim();

/**
 * LandingPageDemo
 *
 * Preview + code demo for the Landing Page template - a plain "Default"
 * example, and an "Animated" example showing the bold, dark hero +
 * alternating showcase-panel feature layout with every section's
 * entrance animation.
 */
const LandingPageDemo = () => {
  return (
    <div className="flex flex-col space-y-6 mb-8">
      <Tabs>
        <TabItem value="default" label="Default">
          <Tabs>
            <TabItem value="preview" label="Preview">
              <div className="border rounded-lg overflow-y-auto max-h-[800px]">
                <LandingPage />
              </div>
            </TabItem>
            <TabItem value="code" label="Code">
              <CodeBlock
                language="tsx"
                className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll"
              >
                {defaultCode}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </TabItem>
        <TabItem value="animated" label="Animated">
          <Tabs>
            <TabItem value="preview" label="Preview">
              <div className="border rounded-lg overflow-y-auto max-h-[800px]">
                <LandingPage
                  brandName="Nova"
                  heroTone="bold"
                  heroEyebrow="Now in public beta"
                  heroHeadline="Newsletters. Products. One platform."
                  heroSubheadline="The all-in-one toolkit for shipping, growing, and monetizing your SaaS - start in seconds."
                  heroPrimaryCtaLabel="Start building"
                  heroSecondaryCtaLabel="Talk to sales"
                  featuresVariant="showcase"
                  testimonialsVariant="spotlight"
                />
              </div>
            </TabItem>
            <TabItem value="code" label="Code">
              <CodeBlock
                language="tsx"
                className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll"
              >
                {animatedCode}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default LandingPageDemo;
