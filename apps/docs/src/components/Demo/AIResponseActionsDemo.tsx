import React, { useState } from "react";
import { AIResponseActions } from "../UI/ai-response-actions";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const AIResponseActionsDemo: React.FC = () => {
  const [variant, setVariant] = useState<"default" | "dark" | "glass" | "minimal">("default");
  const [size, setSize] = useState<"sm" | "md">("sm");


  const [hasRegenerate, setHasRegenerate] = useState(true);
  const [hasFeedback, setHasFeedback] = useState(true);
  const [hasShare, setHasShare] = useState(true);
  const [hasBookmark, setHasBookmark] = useState(true);


  const [feedbackVal, setFeedbackVal] = useState<"up" | "down" | null>(null);
  const [bookmarkedVal, setBookmarkedVal] = useState(false);

  const responseText = `Here is a custom React hook that synchronizes component state with your router:

\`\`\`typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useUrlState<T>(key: string, initialValue: T) {
  const router = useRouter();
  // State synchronization logic...
}
\`\`\``;

  const codeString = `
import { AIResponseActions } from '@mindfiredigital/ignix-ui';

function MessageActions() {
  return (
    <AIResponseActions
      content={\`\${responseText}\`}
      variant="${variant}"
      size="${size}"
      ${hasRegenerate ? "onRegenerate={() => regenerate()}" : ""}
      ${hasFeedback ? `feedback={feedback}\n      onFeedback={(type) => setFeedback(type)}` : ""}
      ${hasShare ? "onShare={() => share()}" : ""}
      ${hasBookmark ? `isBookmarked={bookmarked}\n      onBookmark={() => toggleBookmark()}` : ""}
    />
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* Configuration Panel */}
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

        <VariantSelector
          type="Size"
          variants={["sm", "md"]}
          selectedVariant={size}
          onSelectVariant={(v) => setSize(v as any)}
          variantLabels={{
            sm: "Small (Compact)",
            md: "Medium",
          }}
        />

        {/* Feature Switches */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-500">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasRegenerate}
              onChange={(e) => setHasRegenerate(e.target.checked)}
              className="cursor-pointer"
            />
            Regenerate
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasFeedback}
              onChange={(e) => setHasFeedback(e.target.checked)}
              className="cursor-pointer"
            />
            Feedback
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasShare}
              onChange={(e) => setHasShare(e.target.checked)}
              className="cursor-pointer"
            />
            Share
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasBookmark}
              onChange={(e) => setHasBookmark(e.target.checked)}
              className="cursor-pointer"
            />
            Bookmark
          </label>
        </div>
      </div>

      {/* Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div
            className={`p-6 border rounded-xl min-h-[220px] flex items-center justify-center transition-all ${variant === "dark"
              ? "bg-neutral-950 border-neutral-900"
              : variant === "glass"
                ? "bg-gradient-to-br from-black via-red-950 to-neutral-900 border-transparent text-white"
                : "bg-white dark:bg-neutral-950 dark:border-neutral-800"
              }`}
          >
            <div
              className={`max-w-lg w-full p-5 border rounded-2xl shadow-sm space-y-4 ${variant === "dark"
                ? "bg-neutral-900 border-neutral-800 text-white"
                : variant === "glass"
                  ? "bg-white/10 border-white/20 backdrop-blur-xl text-white"
                  : "bg-neutral-50/50 border-neutral-100 dark:bg-neutral-900/50 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
                }`}
            >
              {/* Message header */}
              <div className="flex items-center gap-2 select-none">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                  AI
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${variant === "glass" ? "text-white/80" : "text-neutral-400 dark:text-neutral-550"
                  }`}>
                  Code Assistant
                </span>
              </div>

              
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {responseText}
              </div>

              
              <div className={`flex justify-between items-center border-t pt-3 select-none ${variant === "glass" ? "border-white/10" : "border-neutral-100 dark:border-neutral-800"
                }`}>
                <span className={`text-[10px] font-semibold ${variant === "glass" ? "text-white/60" : "text-neutral-400 dark:text-neutral-500"
                  }`}>
                  Helpful?
                </span>
                <AIResponseActions
                  content={responseText}
                  variant={variant}
                  size={size}
                  onRegenerate={hasRegenerate ? () => alert("Regenerating response...") : undefined}
                  onFeedback={hasFeedback ? (type) => setFeedbackVal((prev) => (prev === type ? null : type)) : undefined}
                  feedback={hasFeedback ? feedbackVal : undefined}
                  onBookmark={hasBookmark ? () => setBookmarkedVal((prev) => !prev) : undefined}
                  isBookmarked={hasBookmark ? bookmarkedVal : undefined}
                  onShare={hasShare ? () => alert("Link copied to clipboard!") : undefined}
                />
              </div>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div >
  );
};

export default AIResponseActionsDemo;
