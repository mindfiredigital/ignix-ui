import React, { useMemo, useState } from "react";
import { TabNavigation } from "@site/src/components/UI/tab-navigation";
import type { TabItem } from "@site/src/components/UI/tab-navigation";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItemTheme from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { FileText, BarChart3, Settings, Palette } from "lucide-react";
import { Typography } from "@site/src/components/UI/typography";

const indicatorOptions = ["underline", "pill"] as const;
const iconPositionOptions = ["mixed", "left", "right", "top"] as const;

const TabNavigationDemo = () => {
  const [indicatorVariant, setIndicatorVariant] = useState<"underline" | "pill">("underline");
  const [iconPositionVariant, setIconPositionVariant] = useState<(typeof iconPositionOptions)[number]>("mixed");
  const [showIcons, setShowIcons] = useState<boolean>(true);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  const resolveIconPosition = (defaultPosition: "left" | "right" | "top"): "left" | "right" | "top" => {
    if (iconPositionVariant === "mixed") return defaultPosition;
    return iconPositionVariant;
  };

  const baseTabs: TabItem[] = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        ...(showIcons && { icon: FileText, iconPosition: resolveIconPosition("left") }),
        ...(showBadges && { badge: { count: 3, shape: "pill" as const } }),
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Overview
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              This is the overview content. Tabs switch content when you click or use the keyboard.
              Use Arrow Left/Right to move between tabs and Enter or Space to activate.
            </Typography>
          </div>
        ),
      },
      {
        id: "analytics",
        label: "Analytics",
        ...(showIcons && { icon: BarChart3, iconPosition: resolveIconPosition("top") }),
        ...(showBadges && { badge: { count: 12, shape: "circle" as const } }),
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Analytics
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              View charts and reports here. The active tab indicator shows clearly which tab is selected.
            </Typography>
          </div>
        ),
      },
      {
        id: "settings",
        label: "Settings",
        ...(showIcons && { icon: Settings, iconPosition: resolveIconPosition("right") }),
        ...(showBadges && { badge: { label: "New", shape: "square" as const } }),
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Settings
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Configure your preferences and options in this panel.
            </Typography>
          </div>
        ),
      },
      {
        id: "appearance",
        label: "Appearance",
        ...(showIcons && { icon: Palette, iconPosition: resolveIconPosition("left") }),
        content: (
          <div className="space-y-2">
            <Typography variant="h3" weight="semibold">
              Appearance
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Customize theme and layout options.
            </Typography>
          </div>
        ),
      },
    ],
    [showIcons, showBadges, iconPositionVariant]
  );

  const effectiveIconPositionForCode =
    iconPositionVariant === "mixed" ? "left" : iconPositionVariant;

  const codeLines: string[] = [
    "const tabs = [",
    "  {",
    "    id: 'overview',",
    "    label: 'Overview',",
    showIcons && "    icon: FileText,",
    showIcons && `    iconPosition: '${effectiveIconPositionForCode}',`,
    showBadges && "    badge: { count: 3, shape: 'pill' },",
    "    content: <div>Overview content...</div>,",
    "  },",
    "  { id: 'analytics', label: 'Analytics', content: <div>Analytics...</div> },",
    "  { id: 'settings', label: 'Settings', content: <div>Settings...</div> },",
    "];",
    "",
    "<TabNavigation",
    "  tabs={tabs}",
    `  indicatorVariant="${indicatorVariant}"`,
    '  defaultActiveId="overview"',
    "/>",
  ].filter(Boolean as unknown as (v: string | false) => v is string);

  const codeString = codeLines.join("\n");

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={indicatorOptions as unknown as string[]}
            selectedVariant={indicatorVariant}
            onSelectVariant={(v) => setIndicatorVariant(v as "underline" | "pill")}
            type="Indicator"
          />
        </div>
        <div className="space-y-2">
          <VariantSelector
            variants={iconPositionOptions as unknown as string[]}
            selectedVariant={iconPositionVariant}
            onSelectVariant={(v) => {
              setIconPositionVariant(v as (typeof iconPositionOptions)[number]);
              setShowIcons(true);
            }}
            type="Icon Position"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showIcons}
            onChange={(e) => setShowIcons(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Icons</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showBadges}
            onChange={(e) => setShowBadges(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Badges</span>
        </label>
      </div>

      <Tabs>
        <TabItemTheme value="preview" label="Preview">
          <div className="border border-gray-300 p-4 rounded-lg overflow-hidden mt-4">
            <TabNavigation
              tabs={baseTabs}
              indicatorVariant={indicatorVariant}
              defaultActiveId="overview"
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

export { TabNavigationDemo };

