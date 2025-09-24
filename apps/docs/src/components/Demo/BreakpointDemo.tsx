import React, { useState } from "react";
import { Breakpoint } from "@site/src/components/UI/breakpoint";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const BreakpointDemo = () => {
  const [show, setShow] = useState<"mobile" | "tablet" | "desktop" | undefined>("desktop");
  const [hide, setHide] = useState<"mobile" | "tablet" | "desktop" | undefined>(undefined);
  const [from, setFrom] = useState<"mobile" | "tablet" | "desktop" | undefined>("desktop");
  const [to, setTo] = useState<"mobile" | "tablet" | "desktop" | undefined>("mobile");

  const breakpointOptions = [
    { value: "mobile", label: "📱 Mobile (0px - 640px)" },
    { value: "tablet", label: "💻 Tablet (641px - 1024px)" },
    { value: "desktop", label: "🖥️ Desktop (1025px+)" }
  ] as const;

  const codeString = `
<Breakpoint 
  ${show ? `show="${show}"` : ""}
  ${hide ? `hide="${hide}"` : ""}
  ${from ? `from="${from}"` : ""}
  ${to ? `to="${to}"` : ""}
>
  <p>This content is conditionally rendered based on the viewport size.</p>
</Breakpoint>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Variant selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Show */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpointOptions.map(b => b.value)]}
            selectedVariant={show || "none"}
            onSelectVariant={(val) => setShow(val === "none" ? undefined : (val as typeof show))}
            type="Show On"
          />
        </div>

        {/* Hide */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpointOptions.map(b => b.value)]}
            selectedVariant={hide || "none"}
            onSelectVariant={(val) => setHide(val === "none" ? undefined : (val as typeof hide))}
            type="Hide On"
          />
        </div>

        {/* From */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpointOptions.map(b => b.value)]}
            selectedVariant={from || "none"}
            onSelectVariant={(val) => setFrom(val === "none" ? undefined : (val as typeof from))}
            type="Show From"
          />
        </div>

        {/* To */}
        <div className="space-y-2">
          <VariantSelector
            variants={["none", ...breakpointOptions.map(b => b.value)]}
            selectedVariant={to || "none"}
            onSelectVariant={(val) => setTo(val === "none" ? undefined : (val as typeof to))}
            type="Show Until"
          />
        </div>
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview">
            <div className="border p-6 rounded-lg">
              <div className="space-y-4">
                <Breakpoint show={show} hide={hide} from={from} to={to}>
                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <p className="text-blue-700">
                      This content is visible when the viewport matches your selected breakpoint rules.
                    </p>
                  </div>
                </Breakpoint>

                {/* Responsive Navigation Example */}
                <div className="mt-8">
                  <h4 className="text-md font-medium mb-3">Example: Responsive Navigation</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Breakpoint from="desktop">
                      <nav className="bg-muted-foreground text-white p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-background">Logo</div>
                          <div className="flex space-x-6">
                            <span className="text-background">Home</span>
                            <span className="text-background">About</span>
                            <span className="text-background">Services</span>
                            <span className="text-background">Contact</span>
                          </div>
                          <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                            Sign In
                          </button>
                        </div>
                      </nav>
                    </Breakpoint>
                    
                    <Breakpoint to="mobile">
                      <nav className="bg-muted-foreground text-white p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-background">Logo</div>
                          <button className="p-2 hover:bg-gray-700 rounded text-background">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                          </button>
                        </div>
                      </nav>
                    </Breakpoint>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Resize your browser window to see the navigation change between mobile and desktop views.
                  </p>
                </div>
              </div>
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Usage</h4>
              <CodeBlock language="tsx" className="text-sm">
                {codeString.trim()}
              </CodeBlock>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Responsive Navigation Example</h4>
              <CodeBlock language="tsx" className="text-sm">
                {`// Desktop Navigation (shows on tablet and desktop)
<Breakpoint from="tablet">
  <nav className="bg-gray-800 text-white p-4">
    <div className="flex items-center justify-between">
      <div className="text-xl font-bold">Logo</div>
      <div className="flex space-x-6">
        <a href="#" className="hover:text-blue-300">Home</a>
        <a href="#" className="hover:text-blue-300">About</a>
        <a href="#" className="hover:text-blue-300">Services</a>
        <a href="#" className="hover:text-blue-300">Contact</a>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
        Sign In
      </button>
    </div>
  </nav>
</Breakpoint>

// Mobile Navigation (shows on mobile only)
<Breakpoint to="tablet">
  <nav className="bg-gray-800 text-white p-4">
    <div className="flex items-center justify-between">
      <div className="text-xl font-bold">Logo</div>
      <button className="p-2 hover:bg-gray-700 rounded">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </nav>
</Breakpoint>`}
              </CodeBlock>
            </div>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default BreakpointDemo;