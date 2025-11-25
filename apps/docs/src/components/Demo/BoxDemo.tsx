import React, { useState } from "react";
import { Box } from "@site/src/components/UI/box";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const widthOptions = ["auto", "small", "normal", "large", "full"];
const heightOptions = ["auto", "small", "normal", "large", "screen"];
const paddingOptions = ["none", "sm", "normal", "lg"];
const backgroundOptions = ["default","primary", "secondary", "muted"];
const roundedOptions = ["none", "sm", "md", "lg", "full"];
const shadowOptions = ["none", "subtle", "medium", "strong"];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BoxDemo = () => {
  const [width, setWidth] = useState("normal");
  const [height, setHeight] = useState("auto");
  const [padding, setPadding] = useState("normal");
  const [background, setBackground] = useState("default");
  const [rounded, setRounded] = useState("md");
  const [shadow, setShadow] = useState("subtle");

  const codeString = `
    <Box
      width="${width}"
      height="${height}"
      padding="${padding}"
      background="${background}"
      rounded="${rounded}"
      shadow="${shadow}"
    >
      <h2>Box Component Demo</h2>
      <p>
        width: <b>${width}</b>, height: <b>${height}</b>, padding: <b>${padding}</b>, background: <b>${background}</b>, rounded: <b>${rounded}</b>, shadow: <b>${shadow}</b>
      </p>
    </Box>
    `;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={widthOptions}
          selectedVariant={width}
          onSelectVariant={setWidth}
          type="Width"
        />
        <VariantSelector
          variants={heightOptions}
          selectedVariant={height}
          onSelectVariant={setHeight}
          type="Height"
        />
        <VariantSelector
          variants={paddingOptions}
          selectedVariant={padding}
          onSelectVariant={setPadding}
          type="Padding"
        />
        <VariantSelector
          variants={backgroundOptions}
          selectedVariant={background}
          onSelectVariant={setBackground}
          type="Background"
        />
        <VariantSelector
          variants={roundedOptions}
          selectedVariant={rounded}
          onSelectVariant={setRounded}
          type="Rounded"
        />
        <VariantSelector
          variants={shadowOptions}
          selectedVariant={shadow}
          onSelectVariant={setShadow}
          type="Shadow"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4 flex items-center justify-center">
            <Box
              width={width}
              height={height}
              padding={padding as "normal" | "none" | "sm" | "lg"}
              background={background}
              rounded={rounded as "none" | "sm" | "md" | "lg" | "full"}
              shadow={shadow as "none" | "subtle" | "medium" | "strong"}
            >
              <h2>Box Component Demo</h2>
              <p>
                width: <b>{width}</b>, height: <b>{height}</b>, padding:{" "}
                <b>{padding}</b>, background: <b>{background}</b>, rounded:{" "}
                <b>{rounded}</b>, shadow: <b>{shadow}</b>
              </p>
            </Box>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default BoxDemo;