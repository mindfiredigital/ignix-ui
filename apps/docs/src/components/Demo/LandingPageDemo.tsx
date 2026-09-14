import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { LandingPage } from "@site/src/components/UI/landing-page";

/**
 * LandingPageDemo
 *
 * Preview + code demo for the Landing Page template.
 */
const LandingPageDemo = () => {
  const codeString = `
import { LandingPage } from "@ignix-ui/landing-page";

export function Example() {
  return (
    <LandingPage
      brandName="Nova"
      heroEyebrow="Now in public beta"
      heroHeadline="The fastest way to launch your SaaS"
      heroSubheadline="Everything you need to go from idea to production in days, not months."
      heroPrimaryCtaLabel="Start building"
      heroSecondaryCtaLabel="Talk to sales"
      onHeroPrimaryCtaClick={() => console.log("Primary CTA")}
    />
  );
}
`.trim();

  return (
    <div className="flex flex-col space-y-6 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-y-auto max-h-[800px]">
            <LandingPage
              brandName="Nova"
              heroEyebrow="Now in public beta"
              heroHeadline="The fastest way to launch your SaaS"
              heroSubheadline="Everything you need to go from idea to production in days, not months."
              heroPrimaryCtaLabel="Start building"
              heroSecondaryCtaLabel="Talk to sales"
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock
            language="tsx"
            className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll"
          >
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default LandingPageDemo;
