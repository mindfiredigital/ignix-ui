import React, { useState } from "react";
import { AICodeBlock } from "../UI/ai-code-block";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import VariantSelector from "./VariantSelector";
import { cn } from "@site/src/utils/cn";

const SAMPLES: Record<string, { language: string; code: string }> = {
  typescript: {
    language: "typescript",
    code: `import { useState, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (content: string) => {
    setLoading(true);
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });

    const { reply } = await res.json();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "assistant", content: reply },
    ]);
    setLoading(false);
  };

  return { messages, loading, send };
}`,
  },
  python: {
    language: "python",
    code: `from openai import OpenAI

client = OpenAI()

def stream_chat(prompt: str) -> None:
    """Stream a chat completion response."""
    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta is not None:
            print(delta, end="", flush=True)

stream_chat("Explain transformers in one paragraph.")`,
  },
  bash: {
    language: "bash",
    code: `#!/bin/bash
# Install and start the project

set -e

echo "Cloning ignix-ui..."
git clone https://github.com/mindfiredigital/ignix-ui
cd ignix-ui

echo "Installing packages..."
pnpm install

echo "Starting dev servers..."
pnpm docs:dev`,
  },
  json: {
    language: "json",
    code: `{
  "name": "@mindfiredigital/ignix-ui",
  "version": "1.2.0",
  "description": "Premium animated React UI components",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^3.0.0"
  }
}`,
  },
};

const AICodeBlockDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState("typescript");
  const [showLines, setShowLines] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [collapsible, setCollapsible] = useState(true);
  const [variant, setVariant] = useState<"default" | "dark" | "glass" | "minimal">("default");

  const sample = SAMPLES[activeTab];

  const usageCode = `import { AICodeBlock } from '@mindfiredigital/ignix-ui';

function ChatMessage() {
  const code = \`const greet = (name: string) => \\\`Hello, \\\${name}!\\\`;\`;
  
  return (
    <AICodeBlock
      code={code}
      language="typescript"
      variant="${variant}"
      streaming={${streaming}}
      showLineNumbers={${showLines}}
      collapsible={${collapsible}}
      maxLines={20}
      onCopy={(text) => console.log('Copied:', text)}
    />
  );
}`;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">

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
        {/* Dropdown for language selection */}
        <VariantSelector
          type="Language"
          variants={Object.keys(SAMPLES)}
          selectedVariant={activeTab}
          onSelectVariant={setActiveTab}
          getLabel={(lang) => lang.charAt(0).toUpperCase() + lang.slice(1)}
        />

        {/* Toggles */}
        <div className="flex items-center gap-4">
          {[
            { key: "streaming", label: "Streaming", value: streaming, set: setStreaming },
            { key: "showLines", label: "Line numbers", value: showLines, set: setShowLines },
            { key: "collapsible", label: "Collapsible", value: collapsible, set: setCollapsible },
          ].map(({ key, label, value, set }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => set(e.target.checked)}
                className="rounded cursor-pointer"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Preview / Code tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={cn(
              "p-6 rounded-xl border flex justify-center transition-all min-h-[250px] items-center",
              variant === "dark"
                ? "bg-neutral-950 border-neutral-900"
                : variant === 'glass'
                  ? 'bg-gradient-to-br from-black via-red-950 to-neutral-900'
                  : 'bg-white dark:bg-neutral-950'
            )}
          >
            <div className="w-full max-w-[600px]">
              <AICodeBlock
                key={`${activeTab}-${streaming}-${showLines}-${collapsible}-${variant}`}
                code={sample.code}
                language={sample.language}
                streaming={streaming}
                showLineNumbers={showLines}
                collapsible={collapsible}
                maxLines={12}
                variant={variant}
              />
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{usageCode}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AICodeBlockDemo;
