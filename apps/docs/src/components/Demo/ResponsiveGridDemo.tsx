import React, { useState } from "react";
import ResponsiveGrid from "@site/src/components/UI/responsive-grid";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

const ResponsiveGridDemo = () => {
  const [columns, setColumns] = useState({ mobile: 1, tablet: 2, desktop: 3 });
  const [gap, setGap] = useState("normal");
  const [equalHeight, setEqualHeight] = useState(false);
  const [animation, setAnimation] = useState("none");

  const gaps = ["small", "normal", "large"];
  const animations = ["none", "fade", "stagger", "scale"];
  const columnOptions = ["1", "2", "3", "4"];

  const colors = [
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
    "bg-red-600",
  ];

  const codeString = `
<ResponsiveGrid 
  columns={{ mobile: ${columns.mobile}, tablet: ${columns.tablet}, desktop: ${columns.desktop} }}
  gap="${gap}"
  equalHeight={${equalHeight}}
  animation="${animation}"
>
  {items.map((item, i) => (
    <div key={i} className="bg-gray-200 p-6 rounded-lg shadow text-center">
      Item {i + 1}
    </div>
  ))}
</ResponsiveGrid>
`;

  return (
    <div className="space-y-6 mb-8">
      {/* Variant selectors */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {/* Gap */}
        <div className="space-y-2">
          <VariantSelector
            variants={gaps}
            selectedVariant={gap}
            onSelectVariant={setGap}
            type="Gap"
          />
        </div>

        {/* Animation */}
        <div className="space-y-2">
          <VariantSelector
            variants={animations}
            selectedVariant={animation}
            onSelectVariant={setAnimation}
            type="Animation"
          />
        </div>

        {/* Equal Height */}
        <div className="space-y-2">
          <VariantSelector
            variants={["true", "false"]}
            selectedVariant={String(equalHeight)}
            onSelectVariant={(val) => setEqualHeight(val === "true")}
            type="Equal Height"
          />
        </div>

        {/* Columns */}
        <div className="space-y-2">
          <VariantSelector
            variants={columnOptions}
            selectedVariant={String(columns.mobile)}
            onSelectVariant={(val) =>
              setColumns({ ...columns, mobile: Number(val) })
            }
            type="Mobile Columns"
          />
        </div>
        <div className="space-y-2">
          <VariantSelector
            variants={columnOptions}
            selectedVariant={String(columns.tablet)}
            onSelectVariant={(val) =>
              setColumns({ ...columns, tablet: Number(val) })
            }
            type="Tablet Columns"
          />
        </div>
        <div className="space-y-2">
          <VariantSelector
            variants={columnOptions}
            selectedVariant={String(columns.desktop)}
            onSelectVariant={(val) =>
              setColumns({ ...columns, desktop: Number(val) })
            }
            type="Desktop Columns"
          />
        </div>
      </div>

      {/* Tabs for preview/code */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border p-6 rounded-lg">
            <ResponsiveGrid
              columns={columns}
              gap={gap as "small" | "normal" | "large"}
              equalHeight={equalHeight}
              animation={animation as "none" | "fade" | "stagger" | "scale"}
            >
              {colors.map((color, i) => (
                <div
                  key={i}
                  className={`${color} text-white p-6 rounded-lg shadow-md text-center`}
                >
                  Item {i + 1}
                </div>
              ))}
            </ResponsiveGrid>
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

export default ResponsiveGridDemo;
