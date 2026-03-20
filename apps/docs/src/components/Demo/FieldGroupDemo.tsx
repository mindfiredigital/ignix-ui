import React, { SetStateAction, useState } from "react";
import FieldGroup from "@site/src/components/UI/field-group";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const FieldGroupDemo = () => {
  const [columns, setColumns] = useState<number | "auto">("auto");
  const [spacing, setSpacing] = useState<"none" | "small" | "normal" | "large">("normal");
  const [border, setBorder] = useState(true);

  const columnOptions: (number | "auto")[] = ["auto", 1, 2, 3];
  const spacings: ("none" | "small" | "normal" | "large")[] = [
    "none",
    "small",
    "normal",
    "large",
  ];

  const codeString = `
import FieldGroup from '@ignix-ui/fieldgroup';

<FieldGroup
  title="Personal Information"
  columns={${typeof columns === "number" ? columns : `"${columns}"`}}
  spacing="${spacing}"
  border={${border}}
>
  <div>
    <label htmlFor="name">Full Name</label>
    <input id="name" type="text" placeholder="John Doe" />
  </div>
  <div>
    <label htmlFor="email">Email Address</label>
    <input id="email" type="email" placeholder="john@example.com" />
  </div>
</FieldGroup>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Variant selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Columns */}
        <div className="space-y-2">
          <VariantSelector
            variants={columnOptions.map(String)} // show as strings in UI
            selectedVariant={String(columns)}
            onSelectVariant={(val) =>
              setColumns(val === "auto" ? "auto" : Number(val))
            }
            type="Columns"
          />
        </div>

        {/* Spacing */}
        <div className="space-y-2">
          <VariantSelector
            variants={spacings}
            selectedVariant={spacing}
            onSelectVariant={(value)=>setSpacing(value as SetStateAction<"small" | "none" | "normal" | "large">)}
            type="Spacing"
          />
        </div>

        {/* Border toggle */}
        <div className="space-y-2">
          <button
            onClick={() => setBorder((prev) => !prev)}
            className={`px-3 py-1 rounded-md border ${
              border ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {border ? "Border: On" : "Border: Off"}
          </button>
        </div>
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border p-6 rounded-lg">
            <FieldGroup
              title="Personal Information"
              columns={columns}
              spacing={spacing}
              border={border}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </FieldGroup>
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

export default FieldGroupDemo;
