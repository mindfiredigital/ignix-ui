import React, { useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { ImageCard } from "../UI/image-card";
import { Play, SkipBack, SkipForward, Star } from "lucide-react";

type ImageCardPosition = typeof positions[number];
type ImageCardLayout = typeof layouts[number];
type ImageCardSizes = typeof sizes[number];

const layouts = ["overlay", "below"] as const;
const sizes = ["sm", "md", "lg", "xl"] as const;
const positions = ["top", "left", "right"] as const;

const ImageCardBasicDemo = () => {
  const [layout, setLayout] = useState<ImageCardLayout>("below");
  const [size, setSize] = useState<ImageCardSizes>("md");
  const [position, setPosition] = useState<ImageCardPosition>("top");

  const codeString = `
  <ImageCard
    image="https://picsum.photos/id/237/800/600"
    title="Explore Pets"
    description="A flexible image card component designed for modern interfaces. 
    Supports multiple layouts, media positions, and interactive actions."
    category="Nature"
    variant="red"
    layout="${layout}"
    size="${size}"
    button={[
      {
        label: "Documentation",
        href: "/docs",
      },
      {
        label: "Source Code",
        href: "https://github.com",
      },
      {
        href: "https://github.com",
        icon: Star,
        ariaLabel: "Star repository",
      },
    ]}
  />
  `;

  return (
    <div className="space-y-1 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={[...layouts]}
            selectedVariant={layout}
            onSelectVariant={(v) => setLayout(v as "below" | "overlay")}
            type="Layout"
          />
        </div>

        { layout === "below" && 
        <div className="space-y-2">
          <VariantSelector
            variants={[...positions]}
            selectedVariant={position}
            onSelectVariant={(v) => setPosition(v as "top" | "left" | "right")}
            type="Position"
          />
        </div>}

        <div className="space-y-2">
          <VariantSelector
            variants={[...sizes]}
            selectedVariant={size}
            onSelectVariant={(v) => setSize(v as "sm"| "md"| "lg"| "xl")}
            type="Sizes"
          />
        </div>
    </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4 flex justify-center">
            <ImageCard
              image="https://picsum.photos/id/237/800/600"
              title="Explore Pets"
              description="A flexible image card component designed for modern interfaces. 
              Supports multiple layouts, media positions, and interactive actions."
              category="Nature"
              variant="red"
              layout={layout}
              {...(layout === "below" && position
              ? { mediaPosition: position }
              : {})}
              size={size}
              button={[
                {
                  label: "Documentation",
                  href: "/docs",
                },
                {
                  label: "Source Code",
                  href: "https://github.com",
                },
                {
                  href: "https://github.com",
                  icon: Star,
                  ariaLabel: "Star repository",
                },
              ]}
            />
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

const ImageCardBelowDemo = () => {
  const [position, setPosition] = useState<ImageCardPosition>("left");
  const [size, setSize] = useState<ImageCardSizes>("sm");

  const codeString = `
   <ImageCard
    image="https://picsum.photos/id/237/800/600"
    title="Explore Pets"
    description="A flexible image card component designed for modern interfaces. 
    Supports multiple layouts, media positions, and interactive actions."
    variant="red"
    mediaPosition="${position}"
    layout="below"
    size="${size}"
    button={[
      {
        label: "Share",
        href: "/share",
      },
      {
        href: "https://github.com",
        icon: Star,
        ariaLabel: "Star repository",
      }
    ]}
  />
  `;

  return (
    <div className="space-y-0 mb-2">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">

        <div className="space-y-2">
          <VariantSelector
            variants={[...positions]}
            selectedVariant={position}
            onSelectVariant={(v) => setPosition(v as "top" | "left" | "right")}
            type="Layout"
          />
        </div>

      <div className="space-y-2">
        <VariantSelector
          variants={[...sizes]}
          selectedVariant={size}
          onSelectVariant={(v) => setSize(v as "sm"| "md"| "lg"| "xl")}
          type="Sizes"
        />
      </div>

    </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4 flex justify-center">
            <ImageCard
              image="https://picsum.photos/id/237/800/600"
              title="Explore Pets"
              description="A flexible image card component designed for modern interfaces. 
              Supports multiple layouts, media positions, and interactive actions."
              variant="red"
              mediaPosition={position}
              layout="below"
              size={size}
              button={[
                {
                  label: "Share",
                  href: "/share",
                },
                {
                  href: "https://github.com",
                  icon: Star,
                  ariaLabel: "Star repository",
                }
              ]}
            />
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

const ImageCardMediaDemo = () => {
  const [position, setPosition] = useState<ImageCardPosition>("top");
  const [size, setSize] = useState<ImageCardSizes>("lg");

  const codeString = `
  <ImageCard
    mode="media"
    image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
    title="Live From Space"
    description="Mac Miller"
    mediaPosition="${position}"
    size="${size}"
    button={[
      {
        icon: SkipBack,
        ariaLabel: "Previous track",
        onClick: () => alert("Previous"),
      },
      {
        icon: Play,
        ariaLabel: "Play",
        onClick: () => alert("Play"),
      },
      {
        icon: SkipForward,
        ariaLabel: "Next track",
        onClick: () => alert("Next"),
      },
    ]}
  />
`;

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">

        <div className="space-y-2">
          <VariantSelector
            variants={[...positions]}
            selectedVariant={position}
            onSelectVariant={(v) => setPosition(v as "top" | "left" | "right")}
            type="Layout"
          />
        </div>

      <div className="space-y-2">
        <VariantSelector
          variants={[...sizes]}
          selectedVariant={size}
          onSelectVariant={(v) => setSize(v as "sm"| "md"| "lg"| "xl")}
          type="Sizes"
        />
      </div>

    </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4 flex justify-center">
            <ImageCard
              mode="media"
              image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
              title="Live From Space"
              description="Mac Miller"
              mediaPosition={position}
              size={size}
              variant="red"
              button={[
                {
                  icon: SkipBack,
                  ariaLabel: "Previous track",
                  onClick: () => alert("Previous"),
                },
                {
                  icon: Play,
                  ariaLabel: "Play",
                  onClick: () => alert("Play"),
                },
                {
                  icon: SkipForward,
                  ariaLabel: "Next track",
                  onClick: () => alert("Next"),
                },
              ]}
            />
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

export { ImageCardBasicDemo, ImageCardBelowDemo, ImageCardMediaDemo };
