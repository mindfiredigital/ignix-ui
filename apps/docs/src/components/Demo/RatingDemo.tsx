import React, { useEffect, useState } from "react";
import { Rating } from "@site/src/components/UI/rating";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { Star, StarIcon } from "lucide-react";

type ColorScheme = typeof colorSchemes[number];
type Size = typeof sizes[number];
type Animations = typeof animations[number];

const colorSchemes = ["yellow", "red", "blue", "green", "purple", "pink", "orange","amber"] as const;
const sizes = ["xs","sm", "md", "lg", "xl"] as const;
const animations = ["bounce", "pulse"  , "fade"  , "slide"  , "rotate"  , "scale"  , "elastic"  , "spring" , "glow" , "shimmer" , "none"] as const;

const RatingDemo = () => {
  const [size, setSize] = useState<Size>("md");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("yellow");
  const [interactive, setInteractive] = useState<boolean>(true);
  const [allowHalf, setAllowHalf] = useState<boolean>(false);
  const [value, setValue] = useState<number>(2);
  const [max, setMax] = useState<number>(5);

  const props = [
    `value={${value}}`,
    `max={${max}}`,
    `size="${size}"`,
    `colorScheme="${colorScheme}"`,
    `iconType={StarIcon}`,
    interactive && "interactive",
    allowHalf && "allowHalf",
  ].filter(Boolean);

  const codeString = `
  <Rating
  ${props.join("\n  ")}
/>`;

  return (
    <div className="space-y-2 mb-2">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={[...sizes]}
            selectedVariant={size}
            onSelectVariant={(v) => setSize(v as "xs"|"sm"| "md"| "lg"| "xl")}
            type="Size"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...colorSchemes]}
            selectedVariant={colorScheme}
            onSelectVariant={(v) => setColorScheme(v as "yellow"| "red"| "blue"| "green"| "purple"| "pink"| "orange"|"amber")}
            type="Color Scheme"
          />
        </div>
      </div>

      {/* Additional Controls */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={interactive}
            onChange={(e) => setInteractive(e.target.checked)}
          />
          Interactive
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={allowHalf}
            onChange={(e) => setAllowHalf(e.target.checked)}
          />
          Allow Half
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Max:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border border-gray-300 rounded-lg mt-4">
              <div className="flex items-center justify-center mb-4 w-full">
                <Rating
                  value={value}
                  max={max}
                  size={size}
                  colorScheme={colorScheme}
                  iconType={StarIcon}
                  interactive={interactive}
                  allowHalf={allowHalf}
                  onChange={setValue}
                />
              </div>
                {interactive && (
                  <p className="text-sm text-muted-foreground text-center">
                    Current rating: {value.toFixed(allowHalf ? 1 : 0)} / {max}
                  </p>
                )}
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

// All Sizes Showcase
const RatingSizesDemo = () => {
  return (
    <div className="space-y-6 mb-8">
      <h3 className="text-lg font-semibold">All Sizes</h3>
      <div className="p-6 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-6">
          {sizes.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className="w-32 text-sm text-muted-foreground">
                {s.toUpperCase()}
              </div>
              <Rating value={5} size={s} iconType={Star} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// All Color Schemes Showcase
const RatingColorsDemo = () => {
  return (
    <div className="space-y-6 mb-8">
      <h3 className="text-lg font-semibold">All Color Schemes</h3>
      <div className="p-6 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-4">
          {colorSchemes.map((c) => (
            <div key={c} className="flex items-center gap-4">
              <div className="w-32 text-sm text-muted-foreground">
                {c.toUpperCase()}
              </div>
              <Rating value={5} colorScheme={c} iconType={Star} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Emoji Rating Demo
const EmojiRatingDemo = () => {
  const [value, setValue] = useState<number>(0);
  const [animationType, setAnimationType] = useState<Animations>("spring");
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Force remount and reset value when animation type changes to show initial animation
  useEffect(() => {
    setValue(0);
    setAnimationKey((k) => k + 1);
    const timer = setTimeout(() => {
      setValue(2);
    }, 800); 
    return () => clearTimeout(timer);
  }, [animationType]);

    const codeString = `
  <Rating
    value={${value}}
    max={5}
    size="xl"
    interactive
    animationType="${animationType}"
    emojis={["😡", "😠", "😐", "😊", "😍"]}
  />`;

  return (
    <div className="space-y-6 mb-8">
      <div className="space-y-2">
        <VariantSelector
          variants={[...animations]}
          selectedVariant={animationType}
          onSelectVariant={(v) => setAnimationType(v as "bounce"| "pulse"  | "fade"  | "slide"  | "rotate"  | "scale"  | "elastic"  | "spring" | "glow" | "shimmer" | "none")}
          type="Animation"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
        <h3 className="text-lg font-semibold">Emoji Rating with Animations</h3>
        <div className="p-6 border border-gray-300 rounded-lg">
          <div className="space-y-4 flex items-center justify-center mb-3">
            <Rating
              key={`emoji-rating-${animationType}-${animationKey}`}
              value={value}
              max={5}
              size="xl"
              interactive
              animationType={animationType}
              emojis={["😡", "😠", "😐", "😊", "😍"]}
              onChange={setValue}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Current rating: {value} / 5
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Animation Type: <span className="font-semibold">{animationType}</span> • Try clicking and hovering!
          </p>
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

export { RatingDemo, RatingSizesDemo, RatingColorsDemo, EmojiRatingDemo };
