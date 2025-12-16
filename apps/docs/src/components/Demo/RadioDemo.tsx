// RadioGroupDemo.tsx
import React, { useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { RadioGroup } from "../UI/radio";

const radioVariants = [
  { value: "default", label: "Default" },
  { value: "primary", label: "Primary" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "danger", label: "Danger" },
  { value: "outline", label: "Outline" },
  { value: "subtle", label: "Subtle" },
  { value: "glass", label: "Glass" },
  { value: "neon", label: "Neon" },
];

type RadioAnimation =
  | "bounce"
  | "scale"
  | "pulse"
  | "glow"
  | "shake"
  | "flip"
  | "nina";

const radioAnimations: {
  value: RadioAnimation;
  label: string;
}[] = [
  { value: "bounce", label: "Bounce" },
  { value: "scale", label: "Scale" },
  { value: "pulse", label: "Pulse" },
  { value: "glow", label: "Glow" },
  { value: "shake", label: "Shake" },
  { value: "flip", label: "Flip" },
  { value: "nina", label: "Nina" },
];

const radioSizes = [
  { value: "xs", label: "Extra Small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

const labelPositions = ["left", "right"]

const checkedVariants = ["default", "classic", "surface"]

const options = [
  { value: "one", label: "Option One" },
  { value: "two", label: "Option Two" },
];

const RadioGroupDemo = () => {
  const [variant, setVariant] = useState("default");
  const [size, setSize] = useState("md");
  const [animation, setAnimation] = useState("bounce");
  const [labelPosition, setLabelPosition] = useState("right");
  const [checkedVariant, setCheckedVariant] = useState("surface");
  const [value, setValue] = useState("one");
  const [disabled, setDisabled] = React.useState(false);

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
            variants={radioVariants.map((v) => v.value)}
            selectedVariant={variant}
            onSelectVariant={setVariant}
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={radioSizes.map((s) => s.value)}
            selectedVariant={size}
            onSelectVariant={setSize}
            type="Size"
          />
        </div>

         <div className="space-y-2">
          <VariantSelector
            variants={checkedVariants}
            selectedVariant={checkedVariant}
            onSelectVariant={setCheckedVariant}
            type="Checked Variant"
          />
        </div>
        
        <div className="space-y-2">
          <VariantSelector
            variants={radioAnimations.map((a) => a.value)}
            selectedVariant={animation}
            onSelectVariant={setAnimation}
            type="Animation"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={labelPositions}
            selectedVariant={labelPosition}
            onSelectVariant={setLabelPosition}
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
          <div className="p-6 border rounded-lg mt-4">
            <div className="flex flex-col gap-6 items-center">
              {/* Basic RadioGroup */}
              <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">RadioGroup</h4>
                  <RadioGroup
                    options={options}
                    value={value}
                    onChange={setValue}
                    labelPosition={labelPosition as any}
                    size={size as any}
                    checkedVariant={checkedVariant as any}
                    variant={variant as any}
                    animationVariant={animation as any}
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
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Sizes Variants</h3>
      <p className="text-lg font-semibold">Use the <span className="text-red-500">size</span> prop to control the radio button size.</p>
      <div className="p-6 border rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {radioSizes.map((animation) => (
            <div
              key={animation.value}
              className="flex flex-col items-center gap-3 cursor-pointer"
            >
              <span className="text-sm font-medium">
                {animation.label}
              </span>

              <RadioGroup
                options={[{ value: "demo", label: "" }]}
                value="demo"
                size={animation.value as any}
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
    <div className="space-y-6 mt-4">
      <h3 className="text-lg font-semibold">Animation Variants</h3>
      <p className="text-lg font-semibold">Use the <span className="text-red-500">animationVariant</span> prop to control the radio button animation.</p>
      <div className="p-6 border rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {radioAnimations.map((animation) => (
            <div
              key={animation.value}
              className="flex flex-col items-center gap-3 cursor-pointer"
              onClick={() => replay(animation.value)}
            >
              <span className="text-sm font-medium">
                {animation.label}
              </span>

              <RadioGroup
                key={`${animation.value}-${ticks[animation.value] ?? 0}`}
                options={[{ value: "demo", label: "" }]}
                value="demo"
                size="lg"
                animationVariant={animation.value}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { RadioGroupDemo, RadioGroupGroupDemo, RadioGroupAnimationDemo }
