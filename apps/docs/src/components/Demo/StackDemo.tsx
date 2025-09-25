import React, { useState } from "react";
import { Stack } from '@site/src/components/UI/stack';
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { Button } from "@site/src/components/UI/button";

const directionOptions = ["vertical", "horizontal"];
const alignOptions = ["start", "center", "end", "stretch"];
const justifyOptions = ["start", "center", "end", "between", "around", "evenly"];
const spacingOptions = ["none", "xs", "sm", "normal", "lg", "xl"];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const StackDemo = () => {
  const [direction, setDirection] = useState("vertical");
  const [align, setAlign] = useState("stretch");
  const [justify, setJustify] = useState("start");
  const [spacing, setSpacing] = useState("normal");
  const [wrap, setWrap] = useState(false);

  const codeString = `
<Stack
  direction="${direction}"
  align="${align}"
  justify="${justify}"
  spacing="${spacing}"
  wrap={${wrap}}
  className = "${direction === "vertical" ? "h-64" : "w-full"}"
>
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</Stack>
`;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={directionOptions}
          selectedVariant={direction}
          onSelectVariant={setDirection}
          type="Direction"
        />
        <VariantSelector
          variants={alignOptions}
          selectedVariant={align}
          onSelectVariant={setAlign}
          type="Align"
        />
        <VariantSelector
          variants={justifyOptions}
          selectedVariant={justify}
          onSelectVariant={setJustify}
          type="Justify"
        />
        <VariantSelector
          variants={spacingOptions}
          selectedVariant={spacing}
          onSelectVariant={setSpacing}
          type="Spacing"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="wrap" className="text-sm font-medium">Wrap</label>
          <input
            id="wrap"
            type="checkbox"
            checked={wrap}
            onChange={() => setWrap(!wrap)}
          />
        </div>
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4 flex items-center justify-center">
            <Stack
              direction={direction as any}
              align={align as any}
              justify={justify as any}
              spacing={spacing as any}
              wrap={wrap}
              className={direction === "vertical" ? "h-64 w-full" : "w-full"}
            >
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </Stack>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default StackDemo;