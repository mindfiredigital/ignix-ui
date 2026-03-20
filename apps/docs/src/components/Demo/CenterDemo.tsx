import React, { ReactElement, useState } from "react";
import Center from "@site/src/components/UI/center";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const centerVariants = [
  { value: "flex", label: "Flex" },
  { value: "grid", label: "Grid" },
  { value: "absolute", label: "Absolute" },
];

const minHeights = [
  { value: "auto", label: "Auto" },
  { value: "xs", label: "XS (200px)" },
  { value: "small", label: "Small (400px)" },
  { value: "medium", label: "Medium (600px)" },
  { value: "large", label: "Large (800px)" },
  { value: "xl", label: "XL (1000px)" },
  { value: "screen", label: "Screen" },
  { value: "150px", label: "Custom (150px)" },
];

const CenterDemo = (): ReactElement => {
  const [variant, setVariant] = useState("flex");
  const [horizontal, setHorizontal] = useState(true);
  const [vertical, setVertical] = useState(true);
  const [minHeight, setMinHeight] = useState("150px");

  const codeString = `
import Center from '@ignix-ui/center';

<Center
  variant="${variant}"
  horizontal={${horizontal}}
  vertical={${vertical}}
  minHeight="${minHeight}"
>
  <div className="bg-red-800 text-white px-4 py-2 rounded-lg shadow">
    Centered Content
  </div>
</Center>
`;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={centerVariants.map((v) => v.value)}
            selectedVariant={variant}
            onSelectVariant={setVariant}
            type="Variant"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={["true", "false"]}
            selectedVariant={horizontal.toString()}
            onSelectVariant={(val): void => setHorizontal(val === "true")}
            type="Horizontal"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={["true", "false"]}
            selectedVariant={vertical.toString()}
            onSelectVariant={(val): void => setVertical(val === "true")}
            type="Vertical"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={minHeights.map((m) => m.value)}
            selectedVariant={minHeight}
            onSelectVariant={setMinHeight}
            type="MinHeight"
          />
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4 relative min-h-[200px]">
            <Center
              variant={variant as "flex" | "grid" | "absolute"}
              horizontal={horizontal}
              vertical={vertical}
              minHeight={minHeight as "flex" | "grid" | "absolute"}
            >
              <div className="bg-red-800 text-white px-4 py-2 rounded-lg shadow">
                Centered Content
              </div>
            </Center>
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

export default CenterDemo;
