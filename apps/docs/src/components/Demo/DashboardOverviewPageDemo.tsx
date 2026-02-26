import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
  Dashboard,
  DashboardHeader,
  DashboardKPICards,
  DashboardMetrics,
  DashboardLastActivity,
  type KPICard,
  type KeyMetric,
  type ActivityItem,
} from "@site/src/components/UI/dashboard-overview";

const kpiCards: KPICard[] = [
  { id: "revenue", label: "Revenue", value: "$124.5k", trend: "up", trendLabel: "+12.5% vs last period" },
  { id: "users", label: "Active Users", value: "12,345", trend: "up", trendLabel: "+8.2% vs last period" },
  { id: "conversion", label: "Conversion Rate", value: "3.24%", trend: "down", trendLabel: "-0.4% vs last period" },
  { id: "orders", label: "Orders", value: "1,892", trend: "up", trendLabel: "+15.1% vs last period" },
];

const keyMetrics: KeyMetric[] = [
  { id: "m1", label: "Page Views", value: "48.2k", trend: "up", trendValue: "+5.2%" },
  { id: "m2", label: "Avg. Session", value: "4m 32s", trend: "down", trendValue: "-2.1%" },
  { id: "m3", label: "Bounce Rate", value: "42%", trend: "down", trendValue: "-1.8%" },
  { id: "m4", label: "Sign-ups", value: "892", trend: "up", trendValue: "+12%" },
  { id: "m5", label: "Support Tickets", value: "24", trend: "neutral", trendValue: "0%" },
  { id: "m6", label: "NPS Score", value: "72", trend: "up", trendValue: "+3" },
];

const activityItems: ActivityItem[] = [
  { id: "a1", title: "Payment received", subtitle: "Invoice #1024", timestamp: "2 min ago", status: "completed", amount: "+$1,250" },
  { id: "a2", title: "New user sign-up", subtitle: "john@example.com", timestamp: "15 min ago", status: "completed" },
  { id: "a3", title: "Order shipped", subtitle: "Order #8821", timestamp: "1 hour ago", status: "completed", amount: "$89.00" },
  { id: "a4", title: "Support ticket closed", subtitle: "#4421", timestamp: "2 hours ago", status: "completed" },
  { id: "a5", title: "Subscription renewed", subtitle: "Premium plan", timestamp: "3 hours ago", status: "completed", amount: "$29/mo" },
];

/**
 * DashboardOverviewPageDemo
 *
 * Composable preview + code demo for the Dashboard Overview Page sections.
 */
const DashboardOverviewPageDemo = () => {
  const codeString = `
import {
  Dashboard,
  DashboardHeader,
  DashboardKPICards,
  DashboardMetrics,
  DashboardLastActivity,
} from "@ignix-ui/dashboard-overview-page";

const kpiCards = [/* ...KPICard[] */];
const keyMetrics = [/* ...KeyMetric[] */];
const activityItems = [/* ...ActivityItem[] */];

export function Example() {
  return (
    <Dashboard>
      <DashboardHeader
        title="Dashboard Overview"
        description="Monitor key metrics and recent activity"
        onDateRangeChange={(range) => console.log("Range:", range)}
        onExportReport={() => console.log("Export report")}
        onViewDetails={() => console.log("View details")}
      />
      <DashboardKPICards cards={kpiCards} />
      <DashboardMetrics metrics={keyMetrics} />
      <DashboardLastActivity items={activityItems} pageSize={5} />
    </Dashboard>
  );
}
`.trim();

  return (
    <div className="flex flex-col space-y-6 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4 dark">
            <Dashboard>
              <DashboardHeader
                title="Dashboard Overview"
                description="Monitor key metrics and recent activity"
                onDateRangeChange={(range) => console.log("Range:", range)}
                onExportReport={() => console.log("Export report")}
                onViewDetails={() => console.log("View details")}
              />
              <DashboardKPICards cards={kpiCards} />
              <DashboardMetrics metrics={keyMetrics} />
              <DashboardLastActivity items={activityItems} pageSize={5} />
            </Dashboard>
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

