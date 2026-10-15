import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { PortfolioPage } from "@site/src/components/UI/portfolio-page";

// Matches Storybook's own "Default" story exactly - <PortfolioPage /> with
// no props at all, so this demo and Storybook never drift into showing two
// different "defaults".
const defaultCode = `
import { PortfolioPage } from "@ignix-ui/portfolio-page";

export function Example() {
  return <PortfolioPage />;
}
`.trim();

// heroTone="bold" gives the hero its own always-dark treatment, and
// projectsVariant="masonry" arranges the project gallery in CSS columns
// instead of a uniform grid - together the most visually distinct
// combination this template offers.
const boldCode = `
import { PortfolioPage } from "@ignix-ui/portfolio-page";

export function BoldExample() {
  return (
    <PortfolioPage
      brandName="Jordan Kim"
      heroTone="bold"
      heroEyebrow="Available for freelance"
      heroHeadline="Building products that matter"
      heroSubheadline="Product designer & frontend engineer - here's a look at what I've been working on."
      projectsVariant="masonry"
    />
  );
}
`.trim();

/**
 * PortfolioPageDemo
 *
 * Preview + code demo for the Portfolio & Showcase Page template - a plain
 * "Default" example, and a "Bold" example showing the always-dark hero
 * treatment and the masonry project gallery layout.
 */
const PortfolioPageDemo = () => {
  return (
    <div className="flex flex-col space-y-6 mb-8">
      <Tabs>
        <TabItem value="default" label="Default">
          <Tabs>
            <TabItem value="preview" label="Preview">
              <div className="border rounded-lg overflow-y-auto max-h-[800px]">
                <PortfolioPage />
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
        <TabItem value="bold" label="Bold">
          <Tabs>
            <TabItem value="preview" label="Preview">
              <div className="border rounded-lg overflow-y-auto max-h-[800px]">
                <PortfolioPage
                  brandName="Jordan Kim"
                  heroTone="bold"
                  heroEyebrow="Available for freelance"
                  heroHeadline="Building products that matter"
                  heroSubheadline="Product designer & frontend engineer - here's a look at what I've been working on."
                  projectsVariant="masonry"
                />
              </div>
            </TabItem>
            <TabItem value="code" label="Code">
              <CodeBlock
                language="tsx"
                className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll"
              >
                {boldCode}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default PortfolioPageDemo;
