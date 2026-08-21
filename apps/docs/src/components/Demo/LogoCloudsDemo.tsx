import React, { useState } from "react";
import { LogoClouds } from "@site/src/components/UI/logo-clouds";
import type { LogoCloudItem } from "@site/src/components/UI/logo-clouds";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItemTheme from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const variantOptions = ["grid", "marquee"] as const;

const Wordmark = ({ label }: { label: string }) => (
  <span className="flex h-8 items-center rounded-md bg-foreground/10 px-3 text-sm font-bold tracking-tight text-foreground">
    {label}
  </span>
);

const demoLogos: LogoCloudItem[] = [
  { id: "acme", name: "Acme Corp", icon: <Wordmark label="Acme" /> },
  { id: "globex", name: "Globex", icon: <Wordmark label="Globex" /> },
  { id: "initech", name: "Initech", icon: <Wordmark label="Initech" /> },
  { id: "umbrella", name: "Umbrella", icon: <Wordmark label="Umbrella" /> },
  { id: "soylent", name: "Soylent", icon: <Wordmark label="Soylent" /> },
  { id: "hooli", name: "Hooli", icon: <Wordmark label="Hooli" /> },
];

const LogoCloudsDemo = () => {
  const [variant, setVariant] = useState<(typeof variantOptions)[number]>("grid");
  const [grayscale, setGrayscale] = useState<boolean>(true);
  const [bordered, setBordered] = useState<boolean>(false);

  const codeLines: string[] = [
    "import { LogoClouds } from '@ignix-ui/logoclouds';",
    "",
    "const logos = [",
    "  { id: 'acme', name: 'Acme Corp', src: '/logos/acme.svg' },",
    "  { id: 'globex', name: 'Globex', src: '/logos/globex.svg' },",
    "  // ...",
    "];",
    "",
    "<LogoClouds",
    "  logos={logos}",
    '  title="Trusted by teams at"',
    `  variant="${variant}"`,
    `  grayscale={${grayscale}}`,
    bordered && "  bordered",
    "/>",
  ].filter(Boolean as unknown as (v: string | false) => v is string);

  const codeString = codeLines.join("\n");

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={variantOptions as unknown as string[]}
            selectedVariant={variant}
            onSelectVariant={(v) => setVariant(v as (typeof variantOptions)[number])}
            type="Layout"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={grayscale}
            onChange={(e) => setGrayscale(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Grayscale</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={bordered}
            onChange={(e) => setBordered(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Bordered</span>
        </label>
      </div>

      <Tabs>
        <TabItemTheme value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden mt-4">
            <LogoClouds
              logos={demoLogos}
              title="Trusted by teams at"
              variant={variant}
              grayscale={grayscale}
              bordered={bordered}
            />
          </div>
        </TabItemTheme>
        <TabItemTheme value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItemTheme>
      </Tabs>
    </div>
  );
};

export { LogoCloudsDemo };
