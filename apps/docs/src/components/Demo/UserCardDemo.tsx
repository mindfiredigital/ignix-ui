import React, { useState } from "react";
import VariantSelector from "./VariantSelector";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import { UserCard } from "@site/src/components/UI/user-card";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Users, MessageCircle, Heart, TrendingUp } from "lucide-react";

type UserCardVariant = typeof variants[number];
type UserCardSize = typeof sizes[number];
type UserCardOrientation = typeof orientations[number];
type UserCardBackgroundPattern = typeof backgroundPatterns[number];
type UserCardAvatarShapes = typeof shapes[number];

const variants = ["default", "elevated", "glass", "outline", "minimal"] as const;
const sizes = ["sm", "md", "lg", "xl"] as const;
const orientations = ["vertical", "horizontal"] as const;
const backgroundPatterns = ["none", "gradient", "dots", "grid"] as const;
const shapes = ["circle", "square", "rounded", "decagon", "hexagon", "pentagon", "star", "diamond", "triangle", "triangle-down", "parallelogram", "rhombus", "cross", "octagon", "ellipse", "egg", "trapezoid"] as const;

const UserCardBasicDemo = () => {
  const [variant, setVariant] = useState<UserCardVariant>("default");
  const [size, setSize] = useState<UserCardSize>("md");
  const [orientation, setOrientation] = useState<UserCardOrientation>("vertical");
  const [shape, setShape] = useState<UserCardAvatarShapes>("circle");

  const codeString = `
  <UserCard
    name="Alex Thompson"
    username="alexthompson"
    role="Senior Frontend Developer"
    bio="Passionate about building beautiful and accessible user interfaces."
    avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    variant="${variant}"
    size="${size}"
    avatarShape="${shape}"
    orientation="${orientation}"
    socialLinks={[
      {
        platform: "github",
        url: "https://github.com",
        label: "GitHub",
        icon: FaGithub,
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com",
        label: "LinkedIn",
        icon: FaLinkedin,
      },
      {
        platform: "twitter",
        url: "https://twitter.com",
        label: "Twitter",
        icon: FaTwitter,
      },
    ]}
  />
  `;

  return (
    <div className="space-y-8 mb-8 mt-4">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={[...variants]}
            selectedVariant={variant}
            onSelectVariant={(v) => setVariant(v as "default" | "elevated" | "glass" | "outline" | "minimal")}
            type="Variant"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...sizes]}
            selectedVariant={size}
            onSelectVariant={(v) => setSize(v as "sm" | "md" | "lg" | "xl")}
            type="Size"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...orientations]}
            selectedVariant={orientation}
            onSelectVariant={(v) => setOrientation(v as "vertical" | "horizontal")}
            type="Orientation"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...shapes]}
            selectedVariant={shape}
            onSelectVariant={(v) => setShape(v as "circle"| "square"| "rounded"| "decagon"| "hexagon"| "pentagon"| "star"| "diamond"| "triangle"| "triangle-down"| "parallelogram"| "rhombus"| "cross"| "octagon"| "ellipse"| "egg"| "trapezoid")}
            type="Orientation"
          />
        </div>
      </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden p-4 flex justify-center">
            <UserCard
              name="Alex Thompson"
              username="alexthompson"
              role="Senior Frontend Developer"
              bio="Passionate about building beautiful and accessible user interfaces. Love working with React, TypeScript, and modern web technologies."
              avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
              avatarShape={shape}
              variant={variant}
              size={size}
              orientation={orientation}
              socialLinks={[
                {
                  platform: "github",
                  url: "https://github.com/alexthompson",
                  label: "GitHub",
                  icon: FaGithub,
                },
                {
                  platform: "linkedin",
                  url: "https://linkedin.com/in/alexthompson",
                  label: "LinkedIn",
                  icon: FaLinkedin,
                },
                {
                  platform: "twitter",
                  url: "https://twitter.com/alexthompson",
                  label: "Twitter",
                  icon: FaTwitter,
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

const UserCardAdvancedDemo = () => {
  const [backgroundPattern, setBackgroundPattern] = useState<UserCardBackgroundPattern>("gradient");
  const [badgeType, setBadgeType] = useState<"none" | "verified" | "premium" | "badge">("verified");
  const [customBadgeText, setCustomBadgeText] = useState<string>("Pro");

  const badgeOptions = ["none", "verified", "premium", "badge"] as const;

  const getBadgeProps = () => {
    switch (badgeType) {
      case "verified":
        return { verified: true };
      case "premium":
        return { premium: true };
      case "badge":
        return { badge: customBadgeText };
      default:
        return {};
    }
  };

  const getBadgeCode = () => {
    switch (badgeType) {
      case "verified":
        return "    verified";
      case "premium":
        return "    premium";
      case "badge":
        return `    badge="${customBadgeText}"`;
      default:
        return "";
    }
  };

  const codeString = `
  <UserCard
    advanced
    name="Sarah Johnson"
    username="sarahj"
    role="Senior UI/UX Designer"
    bio="Creating beautiful and intuitive user experiences."
    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
${getBadgeCode()}
    stats={[
      { label: "Projects", value: 124, icon: TrendingUp },
      { label: "Followers", value: "12.5K", icon: Users },
      { label: "Likes", value: "8.9K", icon: Heart },
    ]}
    actions={[
      { label: "Follow", variant: "default", icon: Users },
      { label: "Message", variant: "outline", icon: MessageCircle },
    ]}
    backgroundPattern="${backgroundPattern}"
    socialLinks={[
      {
        platform: "twitter",
        url: "https://twitter.com/sarahj",
        label: "Twitter",
        icon: FaTwitter,
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/sarahj",
        label: "LinkedIn",
        icon: FaLinkedin,
      },
      {
        platform: "github",
        url: "https://github.com/sarahj",
        label: "GitHub",
        icon: FaGithub,
      },
    ]}
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={[...backgroundPatterns]}
            selectedVariant={backgroundPattern}
            onSelectVariant={(v) => setBackgroundPattern(v as "none" | "gradient" | "dots" | "grid")}
            type="Background Pattern"
          />
        </div>
        <div className="space-y-2">
          <VariantSelector
            variants={[...badgeOptions]}
            selectedVariant={badgeType}
            onSelectVariant={(v) => setBadgeType(v as "none" | "verified" | "premium" | "badge")}
            type="Badge Type"
          />
        </div>
        {badgeType === "badge" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Badge Text:</label>
            <input
              type="text"
              value={customBadgeText}
              onChange={(e) => setCustomBadgeText(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              placeholder="Enter badge text"
            />
          </div>
        )}
      </div>

      {/* Demo */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden p-4 flex justify-center">
            <UserCard
              advanced
              name="Sarah Johnson"
              username="sarahj"
              role="Senior UI/UX Designer"
              bio="Creating beautiful and intuitive user experiences. Passionate about design systems, accessibility, and user-centered design."
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
              {...getBadgeProps()}
              stats={[
                { label: "Projects", value: 124, icon: TrendingUp },
                { label: "Followers", value: "12.5K", icon: Users },
                { label: "Likes", value: "8.9K", icon: Heart },
              ]}
              actions={[
                { label: "Follow", variant: "default", icon: Users },
                { label: "Message", variant: "outline", icon: MessageCircle },
              ]}
              backgroundPattern={backgroundPattern}
              socialLinks={[
                {
                  platform: "twitter",
                  url: "https://twitter.com/sarahj",
                  label: "Twitter",
                  icon: FaTwitter,
                },
                {
                  platform: "linkedin",
                  url: "https://linkedin.com/in/sarahj",
                  label: "LinkedIn",
                  icon: FaLinkedin,
                },
                {
                  platform: "github",
                  url: "https://github.com/sarahj",
                  label: "GitHub",
                  icon: FaGithub,
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

const UserCardExamplesDemo = () => {
    const codeString = `
  <UserCard
    advanced
    name="Emma Davis"
    username="emmadavis"
    role="Product Manager"
    bio="Leading product strategy and innovation."
    avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    headerImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    stats={[
      { label: "Projects", value: 124, icon: TrendingUp },
      { label: "Followers", value: "12.5K", icon: Users },
      { label: "Likes", value: "8.9K", icon: Heart },
    ]}
    actions={[
      { label: "Follow", variant: "default", icon: Users },
      { label: "Message", variant: "outline", icon: MessageCircle },
    ]}
    socialLinks={[
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/emmadavis",
        label: "LinkedIn",
        icon: FaLinkedin,
      },
      {
        platform: "twitter",
        url: "https://twitter.com/emmadavis",
        label: "Twitter",
        icon: FaTwitter,
      },
    ]}
  />
  `;

  return (
    <div className="space-y-8 mb-8">
      {/* Background Header Image Layout */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Background Header Image Layout</h4>
        <Tabs>
          <TabItem value="preview" label="Preview">
            <div className="border border-gray-300 rounded-lg overflow-hidden p-4 flex justify-center">
              <UserCard
                advanced
                name="Emma Davis"
                username="emmadavis"
                role="Product Manager"
                bio="Leading product strategy and innovation."
                avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
                headerImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                stats={[
                  { label: "Projects", value: 124, icon: TrendingUp },
                  { label: "Followers", value: "12.5K", icon: Users },
                  { label: "Likes", value: "8.9K", icon: Heart },
                ]}
                actions={[
                  { label: "Follow", variant: "default", icon: Users },
                  { label: "Message", variant: "outline", icon: MessageCircle },
                ]}
                socialLinks={[
                  {
                    platform: "linkedin",
                    url: "https://linkedin.com/in/emmadavis",
                    label: "LinkedIn",
                    icon: FaLinkedin,
                  },
                  {
                    platform: "twitter",
                    url: "https://twitter.com/emmadavis",
                    label: "Twitter",
                    icon: FaTwitter,
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
    </div>
  );
};

export { UserCardBasicDemo, UserCardAdvancedDemo, UserCardExamplesDemo };
