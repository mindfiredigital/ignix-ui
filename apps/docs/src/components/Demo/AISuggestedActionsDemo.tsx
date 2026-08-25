import React, { useState } from "react";
import { AISuggestedActions, SuggestedAction } from "../UI/ai-suggested-actions";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { Sparkles, MessageSquare, Lightbulb, Code2 } from "lucide-react";

const AISuggestedActionsDemo: React.FC = () => {
  const [layout, setLayout] = useState<"flex" | "grid">("grid");
  const [variant, setVariant] = useState<"default" | "dark" | "glass" | "minimal">("default");
  const [inputValue, setInputValue] = useState("");

  const starters: SuggestedAction[] = [
    {
      label: "Analyze codebase performance",
      description: "Find bottlenecks, calculate complexity, and optimize modules.",
      actionText: "Analyze this codebase for performance bottlenecks and recommend optimizations.",
      icon: <Code2 size={16} />,
    },
    {
      label: "Brainstorm SaaS marketing ideas",
      description: "Formulate creative growth loops, SEO content structures, and ad campaigns.",
      actionText: "Help me brainstorm SaaS marketing growth strategies for a B2B product.",
      icon: <Lightbulb size={16} />,
    },
    {
      label: "Refactor legacy React components",
      description: "Migrate class structures to modern functional components with custom hooks.",
      actionText: "Can you help me migrate this legacy class component to hooks?",
      icon: <Sparkles size={16} />,
    },
    {
      label: "Draft client onboarding template",
      description: "Write email drafts, welcome cards, and onboarding checklists.",
      actionText: "Draft a friendly client onboarding email template for new software users.",
      icon: <MessageSquare size={16} />,
    },
  ];

  const codeString = `
import { AISuggestedActions } from '@mindfiredigital/ignix-ui';
import { Code2, Lightbulb, Sparkles, MessageSquare } from 'lucide-react';

function ChatPortal() {
  const starters = [...];
  const [input, setInput] = useState("");

  return (
    <div className="space-y-4">
      <AISuggestedActions
        actions={starters}
        layout="${layout}"
        variant="${variant}"
        onActionClick={(promptText) => setInput(promptText)}
      />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
    </div>
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          type="Layout"
          variants={["flex", "grid"]}
          selectedVariant={layout}
          onSelectVariant={(v) => setLayout(v as any)}
          variantLabels={{
            flex: "Inline Chips (Flex)",
            grid: "Action Cards (Grid)",
          }}
        />

        <VariantSelector
          type="Variant"
          variants={["default", "dark", "glass", "minimal"]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as any)}
          variantLabels={{
            default: "Default",
            dark: "Dark",
            glass: "Glass",
            minimal: "Minimal",
          }}
        />
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`p-6 border rounded-xl min-h-[220px] flex flex-col justify-center gap-6 transition-all ${variant === "dark"
              ? "bg-neutral-950 border-neutral-900"
              : variant === "glass"
                ? "bg-gradient-to-br from-black via-red-950 to-neutral-900 border-transparent"
                : "bg-white dark:bg-neutral-950 dark:border-neutral-800"
              }`}
          >
            <div className="w-full max-w-xl mx-auto">
              <AISuggestedActions
                actions={starters}
                layout={layout}
                variant={variant}
                onActionClick={(text) => setInputValue(text)}
              />
            </div>

            {inputValue && (
              <div className={`w-full max-w-xl mx-auto text-xs p-3 rounded-lg border text-center transition-all ${variant === "glass"
                ? "bg-white/10 border-white/20 text-white"
                : "bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}>
                Action Triggered: <span className="font-semibold">"{inputValue}"</span>
              </div>
            )}
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AISuggestedActionsDemo;
