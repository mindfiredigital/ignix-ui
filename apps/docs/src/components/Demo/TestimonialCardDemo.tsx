import React, { useEffect, useState } from 'react';
import { TestimonialCard, TestimonialCardAuthor, TestimonialCardQuote, TestimonialCardRating, TestimonialCardSocialLinks } from '@site/src/components/UI/testimonial-card';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { ButtonWithIcon } from '@site/src/components/UI/button-with-icon';
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const sizeOptions = ['sm', 'md', 'lg'] as const;
const variants = ["default", "minimal", "outline", "premium"] as const;
const animations = ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"] as const;
const positions = ["top", "bottom"] as const;

type CardSize = typeof sizeOptions[number];
type CardVariant = typeof variants[number];
type CardAnimation = typeof animations[number];
type CardPosition = typeof positions[number];


const TestimonialCardDemo = () => {
  const [size, setSize] = useState<CardSize>('md');
  const [animation, setAnimation] = useState<CardAnimation>('slideUp');
  const [variant, setVariant] = useState<CardVariant>('default');
  const [position, setPosition] = useState<CardPosition>('bottom');
  const [showBackgroundImage, setShowBackgroundImage] = useState<boolean>(false);
  const [showTopImage, setShowTopImage] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Reset animation key when animation prop changes
  useEffect(() => {
    setAnimationKey((k) => k + 1);
  },[animation]);

  const codeParts: string[] = [];

// Opening tag
codeParts.push(`<TestimonialCard`);
codeParts.push(`  size="${size}"`);

if (!showBackgroundImage) {
  codeParts.push(`  variant="${variant}"`);
}

codeParts.push(`  animation="${animation}"`);

if (!showBackgroundImage) {
  codeParts.push(`  avatarPosition="${position}"`);
}

if (showBackgroundImage) {
  codeParts.push(
    `  backgroundImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
  backgroundImageAlt="Modern interior design"`
  );
}

codeParts.push(`>`);

// Author
codeParts.push(`  <TestimonialCardAuthor
    name="Michael Chen"
    title="CEO"
    company="InnovateLabs"`);

if (showTopImage) {
  codeParts.push(
    `    fullImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
    fullImageAlt="Professional workspace"`
  );
}

codeParts.push(`    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    avatarAlt="Ryan P."
  />`);

// Social links
codeParts.push(`
  <TestimonialCardSocialLinks>
    <ButtonWithIcon variant="ghost" size="lg" icon={<FaFacebook />} />
    <ButtonWithIcon variant="ghost" size="lg" icon={<FaInstagram />} />
    <ButtonWithIcon variant="ghost" size="lg" icon={<FaLinkedin />} />
  </TestimonialCardSocialLinks>
`);

// Rating
codeParts.push(`  <TestimonialCardRating value={5} />`);

// Quote
codeParts.push(`
  <TestimonialCardQuote>
    This product has completely transformed how we work. The ease of use and powerful features make it indispensable for our team.
  </TestimonialCardQuote>
`);

// Closing
codeParts.push(`</TestimonialCard>`);

const codeString = codeParts.join('\n');

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {!showBackgroundImage && <div className="space-y-1">
          <VariantSelector
            variants={[...variants]}
            selectedVariant={variant}
            onSelectVariant={(value) => setVariant(value as CardVariant)}
            type="Variant"
          />
        </div>}
        <div className="space-y-1">
          <VariantSelector
            variants={[...sizeOptions]}
            selectedVariant={size}
            onSelectVariant={(value) => setSize(value as CardSize)}
            type="Size"
          />
        </div>
        <div className="space-y-1">
          <VariantSelector
            variants={[...animations]}
            selectedVariant={animation}
            onSelectVariant={(value) => setAnimation(value as CardAnimation)}
            type="Animation"
          />
        </div>
        {!showTopImage && !showBackgroundImage && <div className="space-y-1">
          <VariantSelector
            variants={[...positions]}
            selectedVariant={position}
            onSelectVariant={(value) => setPosition(value as CardPosition)}
            type="Position"
          />
        </div>}
      </div>

      <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
        {!showTopImage && <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showBackgroundImage}
            onChange={(e) => setShowBackgroundImage(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Background Image</span>
        </label>}
        {!showBackgroundImage && <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showTopImage}
            onChange={(e) => setShowTopImage(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Top Image</span>
        </label>}
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 p-4 rounded-lg overflow-hidden mt-4 flex justify-center">
            <TestimonialCard
              key={`card-${animationKey}`}
              size={size}
              {...(!showBackgroundImage && { variant })}
              animation={animation}
              {...(!showBackgroundImage && { avatarPosition: position })}
              {...(showBackgroundImage && {
                backgroundImage:
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
                backgroundImageAlt: "Modern interior design",
              })}
            >
              <TestimonialCardAuthor
                name="Michael Chen"
                title="CEO"
                company="InnovateLabs"
                {...(showTopImage && {
                  fullImage:
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
                  fullImageAlt: "Professional workspace",
                })}
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                avatarAlt="Ryan P."
              />
              <TestimonialCardSocialLinks>
                <ButtonWithIcon variant="ghost" iconPosition="only" icon={<FaFacebook />} className="text-primary">
                </ButtonWithIcon>
                <ButtonWithIcon variant="ghost" size="lg" iconPosition="only" icon={<FaInstagram />} className="text-primary">
                </ButtonWithIcon>
                <ButtonWithIcon variant="ghost" size="lg" iconPosition="only" icon={<FaLinkedin />} className="text-primary">
                </ButtonWithIcon>
              </TestimonialCardSocialLinks>
              <TestimonialCardRating value={5} />
              <TestimonialCardQuote>
                This product has completely transformed how we work. The ease of use and powerful features make it indispensable for our team.
              </TestimonialCardQuote>
            </TestimonialCard>
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

export { TestimonialCardDemo };

