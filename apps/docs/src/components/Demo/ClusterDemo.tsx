import React, { useState } from "react";
import { Cluster, ClusterAlign, ClusterJustify, ClusterSpacing } from "@site/src/components/UI/cluster";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const spacingOptions = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
];

const alignOptions = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
  { value: "stretch", label: "Stretch" },
  { value: "baseline", label: "Baseline" },
];

const justifyOptions = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
  { value: "between", label: "Space Between" },
  { value: "around", label: "Space Around" },
  { value: "evenly", label: "Space Evenly" },
];

const ClusterDemo = () => {
  const [spacing, setSpacing] = useState("normal");
  const [align, setAlign] = useState("center");
  const [justify, setJustify] = useState("start");

  const items = [1, 2, 3, 4, 5];

  const codeString = `
<Cluster 
  spacing="${spacing}"
  align="${align}"
  justify="${justify}"
>
  {items.map((item) => (
    <div 
      key={item} 
    >
      Item {item}
    </div>
  ))}
</Cluster>
`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 justify-end">
          <VariantSelector
            variants={spacingOptions.map((option) => option.value)}
            selectedVariant={spacing}
            onSelectVariant={setSpacing}
            type="Spacing"
          />
          <VariantSelector
            variants={alignOptions.map((option) => option.value)}
            selectedVariant={align}
            onSelectVariant={setAlign}
            type="Alignment"
          />
          <VariantSelector
            variants={justifyOptions.map((option) => option.value)}
            selectedVariant={justify}
            onSelectVariant={setJustify}
            type="Justification"
          />
        </div>

        <Tabs>
          <TabItem value="preview" label="Preview" default>
            <div className="p-4 border rounded-lg min-h-[200px] border-gray-200">
              <Cluster 
                spacing={spacing as ClusterSpacing} 
                align={align as ClusterAlign} 
                justify={justify as ClusterJustify}
              >
                {items.map((item) => (
                  <div
                    key={item}
                    className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors ${
                      item % 2 === 0 ? 'h-16' : 'h-10'
                    } flex items-center justify-center min-w-[100px]`}
                  >
                    Item {item}
                  </div>
                ))}
              </Cluster>
            </div>
          </TabItem>
          <TabItem value="code" label="Code">
            <CodeBlock language="tsx" className="mt-4">
              {codeString}
            </CodeBlock>
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
};

export default ClusterDemo;