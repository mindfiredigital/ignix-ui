import React, { useState } from "react";
import AutoGrid from "@site/src/components/UI/auto-grid";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const AutoGridDemo = () => {
  const [minItemWidth, setMinItemWidth] = useState("200px");
  const [maxColumns, setMaxColumns] = useState(4);
  const [gap, setGap] = useState("normal");
  const [balanced, setBalanced] = useState(false);

  const gaps = ["none", "small", "normal", "comfortable", "large"];
  const widths = ["120px", "160px", "200px", "240px", "300px"];
  const maxCols = ["2", "3", "4", "5", "6"];

  const colors = [
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
  ];

  const codeString = `
<AutoGrid 
  minItemWidth="${minItemWidth}" 
  maxColumns={${maxColumns}} 
  gap="${gap}" 
  balanced={${balanced}}
>
  {items.map((item, i) => (
    <div key={i} className="bg-gray-200 p-6 rounded-lg shadow text-center">
      Item {i + 1}
    </div>
  ))}
</AutoGrid>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Variant selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Gap */}
        <div className="space-y-2">
          <VariantSelector
            variants={gaps}
            selectedVariant={gap}
            onSelectVariant={setGap}
            type="Gap"
          />
        </div>

        {/* Min Item Width */}
        <div className="space-y-2">
          <VariantSelector
            variants={widths}
            selectedVariant={minItemWidth}
            onSelectVariant={setMinItemWidth}
            type="Min Item Width"
          />
        </div>

        {/* Max Columns */}
        <div className="space-y-2">
          <VariantSelector
            variants={maxCols}
            selectedVariant={String(maxColumns)}
            onSelectVariant={(val) => setMaxColumns(Number(val))}
            type="Max Columns"
          />
        </div>

        {/* Balanced */}
        <div className="space-y-2">
          <VariantSelector
            variants={["true", "false"]}
            selectedVariant={String(balanced)}
            onSelectVariant={(val) => setBalanced(val === "true")}
            type="Balanced"
          />
        </div>
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border p-6 rounded-lg">
            <AutoGrid
              minItemWidth={minItemWidth}
              maxColumns={maxColumns}
              gap={gap as "none" | "small" | "normal" | "comfortable" | "large"}
              balanced={balanced}
            >
              {colors.map((color, i) => (
                <div
                  key={i}
                  className={`${color} text-white p-6 rounded-lg shadow-md text-center`}
                >
                  Item {i + 1}
                </div>
              ))}
            </AutoGrid>
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

export default AutoGridDemo;
