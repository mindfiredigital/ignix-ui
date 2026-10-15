import React, { useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { AnimatedBarChart } from "@site/src/components/UI/animated-bar-chart";
import VariantSelector from "./VariantSelector";

const MONTHLY_DATA = [
  { label: "Jan", value: 3200, color: "#6366f1" },
  { label: "Feb", value: 4100, color: "#8b5cf6" },
  { label: "Mar", value: 5800, color: "#ec4899" },
  { label: "Apr", value: 4700, color: "#10b981" },
  { label: "May", value: 6900, color: "#f59e0b" },
  { label: "Jun", value: 7200, color: "#3b82f6" },
];

const GROUPED_SERIES = [
  {
    name: "Online",
    color: "#6366f1",
    data: [
      { label: "Q1", value: 12000 },
      { label: "Q2", value: 18000 },
      { label: "Q3", value: 15000 },
      { label: "Q4", value: 22000 },
    ],
  },
  {
    name: "In-Store",
    color: "#10b981",
    data: [
      { label: "Q1", value: 9000 },
      { label: "Q2", value: 11000 },
      { label: "Q3", value: 14000 },
      { label: "Q4", value: 16000 },
    ],
  },
];

export default function AnimatedBarChartDemo(): React.ReactElement {
  const [variant, setVariant] = useState<"default" | "dark" | "glass" | "minimal">("default");
  const [showValues, setShowValues] = useState(false);
  const [grouped, setGrouped] = useState(false);

  const wrapperCls = variant === "dark"
    ? "bg-neutral-950 border-neutral-900 border"
    : variant === "glass"
    ? "bg-gradient-to-br from-black via-red-950 to-neutral-900"
    : "bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800";

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          type="Variant"
          variants={["default", "dark", "glass", "minimal"]}
          selectedVariant={variant}
          onSelectVariant={(v: string): void => setVariant(v as "default" | "dark" | "glass" | "minimal")}
          variantLabels={{ default: "Default", dark: "Dark", glass: "Glass", minimal: "Minimal" }}
        />
        <label className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={showValues}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setShowValues(e.target.checked)}
            className="cursor-pointer"
          />
          Value Labels
        </label>
        <label className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={grouped}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setGrouped(e.target.checked)}
            className="cursor-pointer"
          />
          Grouped Series
        </label>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className={`p-6 rounded-xl transition-all ${wrapperCls}`}>
            <AnimatedBarChart
              data={grouped ? [] : MONTHLY_DATA}
              series={grouped ? GROUPED_SERIES : undefined}
              title={grouped ? "Quarterly Sales" : "Monthly Revenue"}
              subtitle={grouped ? "Online vs In-Store" : "Jan – Jun 2024"}
              variant={variant}
              showValues={showValues}
              showLegend={grouped}
            />
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
}
