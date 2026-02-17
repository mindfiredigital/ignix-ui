import React, { useMemo, useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { LayoutDashboard, FileText, Settings, Users, HelpCircle, BookOpen, Code2, Zap, Shield, Globe } from "lucide-react";
import { MegaMenuMultiColumnDropdown, type MegaMenuColumn } from "@site/src/components/UI/mega-menu-multi-column-dropdown";
import VariantSelector from "./VariantSelector";

/**
 * @fileOverview Demo component for the Mega Menu Multi-Column Dropdown template.
 * Provides a live preview with basic controls (theme, alignment, nested links)
 * plus a generated code snippet users can copy into their projects.
 */

const alignOptions = ["left", "center", "right"] as const;
const themeOptions = ["light", "dark"] as const;

/** Basic column definitions reused across preview and code samples. */
const baseColumns: MegaMenuColumn[] = [
  {
    header: "Products",
    links: [
      { label: "Dashboard", href: "#dashboard", icon: LayoutDashboard },
      { label: "Documents", href: "#documents", icon: FileText },
      { label: "Settings", href: "#settings", icon: Settings },
    ],
  },
  {
    header: "Resources",
    links: [
      { label: "Help Center", href: "#help", icon: HelpCircle },
      { label: "Documentation", href: "#docs", icon: BookOpen },
      { label: "API Reference", href: "#api", icon: Code2 },
    ],
  },
  {
    header: "Company",
    links: [
      { label: "About Us", href: "#about", icon: Users },
      { label: "Careers", href: "#careers", icon: Zap },
      { label: "Security", href: "#security", icon: Shield },
      { label: "Contact", href: "#contact", icon: Globe },
    ],
  },
];

/** Optional nested version of the Products column to demonstrate n-level nesting. */
const nestedProductsColumn: MegaMenuColumn = {
  header: "Products",
  links: [
    {
      label: "Analytics",
      href: "#analytics",
      icon: LayoutDashboard,
      children: [
        {
          label: "Dashboards",
          href: "#analytics-dashboards",
          children: [
            { label: "Team Dashboard", href: "#analytics-dashboards-team" },
            { label: "Executive Overview", href: "#analytics-dashboards-exec" },
          ],
        },
        {
          label: "Reports",
          href: "#analytics-reports",
          children: [
            { label: "Weekly Reports", href: "#analytics-reports-weekly" },
            { label: "Custom Reports", href: "#analytics-reports-custom" },
          ],
        },
      ],
    },
    {
      label: "Workflows",
      href: "#workflows",
      icon: Settings,
      children: [
        { label: "Automation", href: "#workflows-automation" },
        { label: "Approvals", href: "#workflows-approvals" },
      ],
    },
  ],
};

const MegaMenuMultiColumnDropdownDemo = () => {
  const [align, setAlign] = useState<(typeof alignOptions)[number]>("left");
  const [theme, setTheme] = useState<(typeof themeOptions)[number]>("light");
  const [withNested, setWithNested] = useState<boolean>(true);
  const [withCta, setWithCta] = useState<boolean>(true);

  const columns = useMemo(() => {
    if (!withNested) return baseColumns;
    return [nestedProductsColumn, baseColumns[1], baseColumns[2]];
  }, [withNested]);

  const codeString = useMemo(() => {
    const nestedSnippet = withNested
      ? `
      // Nested children example
      {
        header: "Products",
        links: [
          {
            label: "Analytics",
            href: "#analytics",
            icon: LayoutDashboard,
            children: [
              {
                label: "Dashboards",
                href: "#analytics-dashboards",
                children: [
                  { label: "Team Dashboard", href: "#analytics-dashboards-team" },
                  { label: "Executive Overview", href: "#analytics-dashboards-exec" },
                ],
              },
              {
                label: "Reports",
                href: "#analytics-reports",
                children: [
                  { label: "Weekly Reports", href: "#analytics-reports-weekly" },
                  { label: "Custom Reports", href: "#analytics-reports-custom" },
                ],
              },
            ],
          },
        ],
      },`
      : `
      {
        header: "Products",
        links: [
          { label: "Dashboard", href: "#dashboard", icon: LayoutDashboard },
          { label: "Documents", href: "#documents", icon: FileText },
          { label: "Settings", href: "#settings", icon: Settings },
        ],
      },`;

    const ctaSnippet = withCta
      ? `
  cta={{
    label: "View all features",
    href: "#all-features",
    variant: "primary",
  }}`
      : "";

    return `import { MegaMenuMultiColumnDropdown } from "@ignix-ui/mega-menu-multi-column-dropdown";
import { LayoutDashboard, FileText, Settings, Users, HelpCircle, BookOpen, Code2, Zap, Shield, Globe } from "lucide-react";

const columns = [
  ${nestedSnippet}
  {
    header: "Resources",
    links: [
      { label: "Help Center", href: "#help", icon: HelpCircle },
      { label: "Documentation", href: "#docs", icon: BookOpen },
      { label: "API Reference", href: "#api", icon: Code2 },
    ],
  },
  {
    header: "Company",
    links: [
      { label: "About Us", href: "#about", icon: Users },
      { label: "Careers", href: "#careers", icon: Zap },
      { label: "Security", href: "#security", icon: Shield },
      { label: "Contact", href: "#contact", icon: Globe },
    ],
  },
];

export function PageWithMegaMenu() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="text-lg font-semibold text-gray-900">Acme Inc.</div>
        <nav className="flex items-center gap-4">
          <a href="#home" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Home
          </a>
          <MegaMenuMultiColumnDropdown
            triggerLabel="Products"
            theme="${theme}"
            align="${align}"
            columns={columns}${ctaSnippet}
          />
          <a href="#pricing" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Pricing
          </a>
          <button className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Sign in
          </button>
        </nav>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 md:flex-row">
        <section className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Build better navigation</h1>
          <p className="text-gray-600">
            Use the Mega Menu component to organize complex navigation into clear categories with icons, images,
            and nested options.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Multi-column layout with category headers</li>
            <li>Keyboard accessible (arrow keys, Escape)</li>
            <li>Supports n-level nested children</li>
          </ul>
        </section>

        <aside className="w-full max-w-sm space-y-3 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">Quick links</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><a href="#docs" className="hover:text-gray-900">Documentation</a></li>
            <li><a href="#api" className="hover:text-gray-900">API Reference</a></li>
            <li><a href="#support" className="hover:text-gray-900">Support</a></li>
          </ul>
        </aside>
      </main>
    </div>
  );
}`;
  }, [align, theme, withNested, withCta]);

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={Array.from(alignOptions)}
            selectedVariant={align}
            onSelectVariant={(value) => setAlign(value as (typeof alignOptions)[number])}
            type="Align"
          />
        </div>
        <div className="space-y-2">
          <VariantSelector
            variants={Array.from(themeOptions)}
            selectedVariant={theme}
            onSelectVariant={(value) => setTheme(value as (typeof themeOptions)[number])}
            type="Theme"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={withNested}
            onChange={(e) => setWithNested(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show nested children</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={withCta}
            onChange={(e) => setWithCta(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show CTA in panel</span>
        </label>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-y-auto mt-4 bg-gray-50 max-h-[32rem] min-h-[16rem]">
            <div className="flex flex-col">
              <header className="flex items-center justify-between border-b bg-white px-4 py-3">
                <div className="text-base font-semibold text-gray-900">Acme Inc.</div>
                <nav className="flex items-center gap-3">
                  <a
                    href="#home"
                    className="rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Home
                  </a>
                  <MegaMenuMultiColumnDropdown
                    triggerLabel="Products"
                    theme={theme}
                    align={align}
                    columns={columns}
                    cta={
                      withCta
                        ? {
                            label: "View all features",
                            href: "#all-features",
                            variant: "primary",
                          }
                        : undefined
                    }
                  />
                  <a
                    href="#pricing"
                    className="rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Pricing
                  </a>
                  <button className="hidden sm:inline-flex rounded-md bg-gray-900 px-3 py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-800">
                    Sign in
                  </button>
                </nav>
              </header>

              <main className="flex flex-col gap-6 px-4 py-6 md:flex-row">
                <section className="flex-1 space-y-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Mega menu for complex navigation
                  </h1>
                  <p className="text-sm text-gray-600">
                    This example shows the mega menu integrated into a standard page header with supporting content
                    below.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm text-gray-700">
                    <li>Multi-column dropdown with category headers</li>
                    <li>Nested children for deep navigation hierarchies</li>
                    <li>CTA button inside the panel for key actions</li>
                  </ul>
                </section>

                <aside className="w-full max-w-sm space-y-3 rounded-lg border bg-white p-4 shadow-sm">
                  <h2 className="text-sm font-semibold text-gray-800">On this page</h2>
                  <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <li>
                      <a href="#overview" className="hover:text-gray-900">
                        Overview
                      </a>
                    </li>
                    <li>
                      <a href="#usage" className="hover:text-gray-900">
                        Usage
                      </a>
                    </li>
                    <li>
                      <a href="#props" className="hover:text-gray-900">
                        Props
                      </a>
                    </li>
                  </ul>
                </aside>
              </main>
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

export { MegaMenuMultiColumnDropdownDemo };

