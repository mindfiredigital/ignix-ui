import React, { useState } from "react";
import { Breakpoint } from "@site/src/components/UI/breakpoint";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const BreakpointDemo = () => {
  const [show, setShow] = useState<"mobile" | "tablet" | "desktop" | undefined>("mobile");
  const [hide, setHide] = useState<"mobile" | "tablet" | "desktop" | undefined>(undefined);
  const [from, setFrom] = useState<"mobile" | "tablet" | "desktop" | undefined>(undefined);
  const [to, setTo] = useState<"mobile" | "tablet" | "desktop" | undefined>(undefined);

  const breakpoints = ["mobile", "tablet", "desktop"];

  const codeString = `
<Breakpoint 
  ${show ? `show="${show}"` : ""}
  ${hide ? `hide="${hide}"` : ""}
  ${from ? `from="${from}"` : ""}
  ${to ? `to="${to}"` : ""}
>
  <p>This content is conditionally rendered based on the viewport size.</p>
</Breakpoint>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Variant selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Show */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpoints]}
            selectedVariant={show || "none"}
            onSelectVariant={(val) => setShow(val === "none" ? undefined : (val as typeof show))}
            type="Show"
          />
        </div>

        {/* Hide */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpoints]}
            selectedVariant={hide || "none"}
            onSelectVariant={(val) => setHide(val === "none" ? undefined : (val as typeof hide))}
            type="Hide"
          />
        </div>

        {/* From */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpoints]}
            selectedVariant={from || "none"}
            onSelectVariant={(val) => setFrom(val === "none" ? undefined : (val as typeof from))}
            type="From"
          />
        </div>

        {/* To */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpoints]}
            selectedVariant={to || "none"}
            onSelectVariant={(val) => setTo(val === "none" ? undefined : (val as typeof to))}
            type="To"
          />
        </div>
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border p-6 rounded-lg">
            <Breakpoint show={show} hide={hide} from={from} to={to}>
              <p className="text-sm text-blue-600">
                This content is conditionally rendered based on the viewport size.
              </p>
            </Breakpoint>
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString.trim()}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default BreakpointDemo;