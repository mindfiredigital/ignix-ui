import React, { useState } from "react";
import {LazyLoad} from "@site/src/components/UI/lazyload";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const LazyLoadDemo = () => {
  const [threshold, setThreshold] = useState("0px");
  const [animation, setAnimation] = useState("fade");
  const [once, setOnce] = useState(false);

  const thresholds = ["0px", "100px", "200px", "400px"];
  const animations = ["none", "fade", "slide"];
  const onceOptions = ["true", "false"];

  const colors = [
    "bg-blue-600 p-12",
    "bg-green-600 p-20",
    "bg-pink-600 p-16",
    "bg-purple-600 p-24",
    "bg-yellow-600 p-14",
  ];

  const codeString = `
<LazyLoad 
  threshold="${threshold}"
  animation="${animation}"
  once={${once}}
  placeholder={<div className="p-6 text-center">Loading...</div>}
>
  <div className="bg-gray-200 rounded-lg shadow text-center p-10">
    Your Content
  </div>
</LazyLoad>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Uniform controls */}
      <div className="flex flex-wrap gap-6 justify-start sm:justify-end">
        <VariantSelector
          variants={thresholds}
          selectedVariant={threshold}
          onSelectVariant={setThreshold}
          type="Threshold"
        />
        <VariantSelector
          variants={animations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="Animation"
        />
        <VariantSelector
          variants={onceOptions}
          selectedVariant={String(once)}
          onSelectVariant={(val) => setOnce(val === "true")}
          type="Once"
        />
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border p-6 rounded-lg space-y-6">
            {colors.map((color, i) => (
              <LazyLoad
                key={`${animation}-${threshold}-${once}-${i}`}
                threshold={threshold}
                animation={animation as "fade" | "slide" | "none"}
                once={once}
                placeholder={
                  <div className="p-6 text-center bg-gray-100 rounded-lg shadow">
                    Loading...
                  </div>
                }
              >
                <div
                  className={`${color} text-white rounded-lg shadow-md text-center`}
                >
                  Item {i + 1}
                </div>
              </LazyLoad>
            ))}
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

export default LazyLoadDemo;
