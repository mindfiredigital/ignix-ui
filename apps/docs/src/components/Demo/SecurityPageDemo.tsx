import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import CodeBlock from "@theme/CodeBlock";
import { useState, useEffect } from "react";
import VariantSelector from "./VariantSelector";
import { SecurityPage } from "../UI/security";

const themeVariants = ["light", "dark", "auto"] as const;
const layoutVariants = ["grid", "list"] as const;

const SecurityPageDemo = () => {
  const [variant, setVariant] = useState<(typeof themeVariants)[number]>("dark");
  const [layout, setLayout] = useState<(typeof layoutVariants)[number]>("grid");

  const codeString = `
<SecurityPage
  title="Security"
  description="Manage password, sessions, 2FA, recovery codes, and login activity."
  variant="${variant}"
  layout="${layout}"
/>`;

  useEffect(() => {
    setVariant("dark");
    setLayout("grid");
  }, []);

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-3 justify-start sm:justify-end">
        <VariantSelector
          variants={themeVariants as unknown as string[]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as (typeof themeVariants)[number])}
          type="Theme"
        />
        <VariantSelector
          variants={layoutVariants as unknown as string[]}
          selectedVariant={layout}
          onSelectVariant={(v) => setLayout(v as (typeof layoutVariants)[number])}
          type="Layout"
        />
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4">
            <SecurityPage
              title="Security"
              description="Manage password, sessions, 2FA, recovery codes, and login activity."
              variant={variant}
              layout={layout}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default SecurityPageDemo;




