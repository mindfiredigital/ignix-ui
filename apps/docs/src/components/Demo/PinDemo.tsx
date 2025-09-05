import React, { ReactElement, useState } from "react";
import Pin from "@site/src/components/UI/pin";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const positions = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

const offsets = ["none", "small", "normal", "large", "xl"];
const zIndexes = ["low", "normal", "high"];

const PinDemo = (): ReactElement => {
  const [position, setPosition] = useState("top-right");
  const [offset, setOffset] = useState("normal");
  const [zIndex, setZIndex] = useState("high");

  const codeString = `
<div className="relative p-10 w-40 sm:w-96 m-auto border rounded-lg min-h-[200px]">
  <Pin to="${position}" offset="${offset}" zIndex="${zIndex}">
    <button className="bg-red-600 text-white w-6 h-6 rounded-full shadow">✕</button>
  </Pin>
  <p>Card Content</p>
</div>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Variant selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={positions.map((p) => p.value)}
            selectedVariant={position}
            onSelectVariant={setPosition}
            type="Position"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={offsets}
            selectedVariant={offset}
            onSelectVariant={setOffset}
            type="Offset"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={zIndexes}
            selectedVariant={zIndex}
            onSelectVariant={setZIndex}
            type="zIndex"
          />
        </div>
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border p-6 rounded-lg">
            <div className="relative p-10 w-40 sm:w-96 m-auto border rounded-lg min-h-[200px]">
              <Pin
                to={position as "top-left" | "top-right" | "bottom-left" | "bottom-right"}
                offset={offset as "none" | "small" | "normal" | "large" | "xl"}
                zIndex={zIndex as "low" | "normal" | "high"} mobile={undefined} className={undefined}            >
                <button className="bg-red-600 text-white w-6 h-6 rounded-full shadow">
                  ✕
                </button>
              </Pin>
              <p className="mt-8 text-gray-700">Pinned button inside a card</p>
            </div>
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

export default PinDemo;
