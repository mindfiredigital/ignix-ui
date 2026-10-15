import React, { useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { AnimatedPieChart } from "@site/src/components/UI/animated-pie-chart";
import VariantSelector from "./VariantSelector";

const BROWSER_DATA = [
  { label: "Chrome", value: 63.4, color: "#6366f1" },
  { label: "Safari", value: 19.7, color: "#ec4899" },
  { label: "Firefox", value: 4.1, color: "#10b981" },
  { label: "Edge", value: 3.9, color: "#f59e0b" },
  { label: "Other", value: 8.9, color: "#3b82f6" },
];

const REVENUE_DATA = [
  { label: "Product A", value: 44000, color: "#6366f1" },
  { label: "Product B", value: 31000, color: "#ec4899" },
  { label: "Product C", value: 21000, color: "#10b981" },
  { label: "Services", value: 12000, color: "#f59e0b" },
];

export default function AnimatedPieChartDemo() {
  const [variant, setVariant] = useState<"default" | "dark" | "glass" | "minimal">("default");
  const [isDonut, setIsDonut] = useState(false);
  const [showPct, setShowPct] = useState(false);
  const [useRevenue, setUseRevenue] = useState(false);

  const wrapperCls = variant === "dark"
    ? "bg-neutral-950 border-neutral-900 border"
    : variant === "glass"
    ? "bg-gradient-to-br from-black via-red-950 to-neutral-900"
    : "bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800";

  const chartData = useRevenue ? REVENUE_DATA : BROWSER_DATA;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          type="Variant"
          variants={["default", "dark", "glass", "minimal"]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as any)}
          variantLabels={{ default: "Default", dark: "Dark", glass: "Glass", minimal: "Minimal" }}
        />
        <label className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold cursor-pointer">
          <input type="checkbox" checked={isDonut} onChange={(e) => setIsDonut(e.target.checked)} className="cursor-pointer" />
          Donut Mode
        </label>
        <label className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold cursor-pointer">
          <input type="checkbox" checked={showPct} onChange={(e) => setShowPct(e.target.checked)} className="cursor-pointer" />
          Show Percentages
        </label>
        <label className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold cursor-pointer">
          <input type="checkbox" checked={useRevenue} onChange={(e) => setUseRevenue(e.target.checked)} className="cursor-pointer" />
          Revenue Data
        </label>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className={`p-6 rounded-xl transition-all ${wrapperCls}`}>
            <AnimatedPieChart
              data={chartData}
              title={useRevenue ? "Revenue Breakdown" : "Browser Market Share"}
              subtitle={useRevenue ? "By product category" : "Global usage — Q2 2024"}
              variant={variant}
              donutRatio={isDonut ? 0.55 : 0}
              centerLabel={isDonut && useRevenue ? "$108K" : isDonut ? "Share" : undefined}
              centerSubLabel={isDonut ? "Total" : undefined}
              showLegend
              showPercentages={showPct}
            />
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
}
