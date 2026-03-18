// RadioGroupDemo.tsx
import React, { useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { RadioGroup } from "@site/src/components/UI/radio";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const animations = ["bounce", "scale", "pulse", "glow", "shake", "flip", "nina"] as const;
const variants = ["default", "primary", "success", "warning", "danger", "outline", "neon"] as const;
const labelPositions = ["left", "right"] as const 
const checkedVariants = ["default", "classic", "surface"] as const

type RadioSizes = typeof sizes[number];
type RadioAnimations = typeof animations[number];
type RadioVariants = typeof variants[number];
type RadioPositions = typeof labelPositions[number];
type RadioCheckedVariant = typeof checkedVariants[number];
 
const options = [
  { value: "one", label: "Option One" },
  { value: "two", label: "Option Two" },
];

const RadioGroupDemo = () => {
  const [variant, setVariant] = useState<RadioVariants>("default");
  const [size, setSize] = useState<RadioSizes>("md");
  const [animation, setAnimation] = useState<RadioAnimations>("bounce");
  const [labelPosition, setLabelPosition] = useState<RadioPositions>("right");
  const [checkedVariant, setCheckedVariant] = useState<RadioCheckedVariant>("surface");
  const [value, setValue] = useState<string>("one");
  const [disabled, setDisabled] = useState<boolean>(false);

  const codeString = `
  const options = [
    { value: "one", label: "Option One" },
    { value: "two", label: "Option Two" },
  ];
  const [disabled, setDisabled] = React.useState(${disabled});
  
  <RadioGroup
    options={options}
    value="${value}"
    labelPosition="${labelPosition}"
    size="${size}"
    checkedVariant="${checkedVariant}"
    variant="${variant}"
    animationVariant="${animation}"
    disabled={disabled}
  />
`;
 
  return (
    <div className="space-y-8 mb-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={[...variants]}
            selectedVariant={variant}
            onSelectVariant={(v) => setVariant(v as RadioVariants)}
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...sizes]}
            selectedVariant={size}
            onSelectVariant={(v) => setSize(v as RadioSizes)}
            type="Size"
          />
        </div>

         <div className="space-y-2">
          <VariantSelector
            variants={[...checkedVariants]}
            selectedVariant={checkedVariant}
            onSelectVariant={(v) => setCheckedVariant(v as RadioCheckedVariant)}
            type="Checked Variant"
          />
        </div>
        
        <div className="space-y-2">
          <VariantSelector
            variants={[...animations]}
            selectedVariant={animation}
            onSelectVariant={(v) => setAnimation(v as RadioAnimations)}
            type="Animation"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...labelPositions]}
            selectedVariant={labelPosition}
            onSelectVariant={(v) => setLabelPosition(v as RadioPositions)}
            type="Label Position"
          />
        </div>
        <div className="flex items-center justify-between">
        {/* Disabled Toggle */}
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />
          Disabled
        </label>
      </div>
      </div>
      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border border-gray-300 rounded-lg mt-4">
            <div className="flex flex-col gap-6 items-center">
              {/* Basic RadioGroup */}
              <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">RadioGroup</h4>
                  <RadioGroup
                    options={options}
                    value={value}
                    onChange={setValue}
                    labelPosition={labelPosition}
                    size={size}
                    checkedVariant={checkedVariant}
                    variant={variant}
                    animationVariant={animation}
                    disabled={disabled}
                  />
              </div>

             
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

// // Group RadioGroup Demo
const RadioGroupGroupDemo = () => {
  return (
    <div className="space-y-2">
      <div className="p-6 border border-gray-300 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sizes.map((size) => (
            <div
              key={size}
              className="flex flex-col items-center gap-3 cursor-pointer"
            >
              <span className="text-sm font-medium">
                {size.toUpperCase()}
              </span>

              <RadioGroup
                options={[{ value: "demo", label: "" }]}
                value="demo"
                size={size}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// // Advanced Animation Demo
const RadioGroupAnimationDemo = () => {
  const [ticks, setTicks] = useState<Record<string, number>>({});

  const replay = (key: string) => {
    setTicks((prev) => ({
      ...prev,
      [key]: (prev[key] ?? 0) + 1,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 border border-gray-300 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {animations.map((animation) => (
            <div
              key={animation}
              className="flex flex-col items-center gap-3 cursor-pointer"
              onClick={() => replay(animation)}
            >
              <span className="text-sm font-medium">
                {animation.toUpperCase()}
              </span>

              <RadioGroup
                key={`${animation}-${ticks[animation] ?? 0}`}
                options={[{ value: "demo", label: "" }]}
                value="demo"
                size="lg"
                animationVariant={animation}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { RadioGroupDemo, RadioGroupGroupDemo, RadioGroupAnimationDemo }
