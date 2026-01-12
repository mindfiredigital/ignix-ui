import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import CodeBlock from "@theme/CodeBlock";
import { useState, useEffect } from "react";
import VariantSelector from "./VariantSelector";
import { NotificationSettingsPage } from "../UI/notification-settings";

const themeVariants = ["light", "dark", "auto"] as const;
const layoutVariants = ["grid", "list"] as const;

const NotificationSettingsPageDemo = () => {
  const [variant, setVariant] = useState<(typeof themeVariants)[number]>("dark");
  const [layout, setLayout] = useState<(typeof layoutVariants)[number]>("grid");

  const codeString = `
<NotificationSettingsPage
  title="Notifications"
  description="Manage your notification preferences and stay informed about what matters to you."
  variant="${variant}"
  layout="${layout}"
/>`;

  useEffect(() => {
    setVariant("auto");
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
            <NotificationSettingsPage
              title="Notifications"
              description="Manage your notification preferences and stay informed about what matters to you."
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

export default NotificationSettingsPageDemo;

