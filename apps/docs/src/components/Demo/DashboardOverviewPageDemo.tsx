import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { DashboardOverviewPage } from "@site/src/components/UI/dashboard-overview";

/**
 * DashboardOverviewPageDemo
 *
 * Simple preview + code demo for the Dashboard Overview Page.
 */
const DashboardOverviewPageDemo = () => {
  const codeString = `
import { DashboardOverviewPage } from "@ignix-ui/dashboard-overview-page";

export function Example() {
  return (
    <DashboardOverviewPage
      onExportReport={() => console.log("Export report")}
      onViewDetails={() => console.log("View details")}
    />
  );
}
`.trim();

  return (
    <div className="flex flex-col space-y-6 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4 dark">
            <DashboardOverviewPage />
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

export default DashboardOverviewPageDemo;

