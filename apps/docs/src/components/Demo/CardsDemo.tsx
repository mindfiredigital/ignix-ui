import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  FeatureCard,
  StatCard,
} from '@site/src/components/UI/card';
import { Button } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Star } from 'lucide-react';

const cardVariants = ['default','elevated','glass','gradient','neon','outline','minimal','premium','success','warning','error','info'] as const;

const cardSizes = ['sm', 'md', 'lg', 'xl'] as const;

const cardAnimations = ['none','fadeIn','slideUp','scaleIn','flipIn','bounceIn','floatIn'] as const;

const cardInteractions = ['none','hover','press','lift','tilt','glow'] as const;

type CardVariants = typeof cardVariants[number];
type CardAnimations = typeof cardAnimations[number];
type CardSizes = typeof cardSizes[number];
type CardInteractions = typeof cardInteractions[number];

const CardsDemo = () => {
  const [variant, setVariant] = useState<CardVariants>('default');
  const [size, setSize] = useState<CardSizes>('md');
  const [animation, setAnimation] = useState<CardAnimations>('none');
  const [interaction, setInteraction] = useState<CardInteractions>('none');
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Reset animation key when animation prop changes
  useEffect(() => {
    setAnimationKey((k) => k + 1);
  },[animation]);

  const codeString = `
<Card 
  variant="${variant}" 
  size="${size}" 
  animation="${animation}"
  interactive="${interaction}"
>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
`;

  return (
    <div className="space-y-6 mb-8 mt-4">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={[...cardVariants]}
            selectedVariant={variant}
            onSelectVariant={(v) => setVariant(v as 'default'|'elevated'|'glass'|'gradient'|'neon'|'outline'|'minimal'|'premium'|'success'|'warning'|'error'|'info')}
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...cardSizes]}
            selectedVariant={size}
            onSelectVariant={(v) => setSize(v as 'sm'| 'md'| 'lg'| 'xl')}
            type="Size"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...cardAnimations]}
            selectedVariant={animation}
            onSelectVariant={(v) => setAnimation(v as 'none'|'fadeIn'|'slideUp'|'scaleIn'|'flipIn'|'bounceIn'|'floatIn')}
            type="Animation"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...cardInteractions]}
            selectedVariant={interaction}
            onSelectVariant={(v) => setInteraction(v as 'none'|'hover'|'press'|'lift'|'tilt'|'glow')}
            type="Interaction"
          />
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border border-gray-300 rounded-lg mt-4">
            <div className="flex flex-wrap gap-4 items-center justify-center p-4">
              <Card
                key={`card-${animationKey}`}
                variant={variant}
                size={size}
                animation={animation}
                interactive={interaction}
              >
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus nec
                    ante feugiat placerat. Nullam nec metus nec ante feugiat placerat.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>
            </div>
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

const FeatureCardDemo = () => {
  const codeString = `
<FeatureCard icon={<Star className="h-8 w-8 text-primary" />} variant="elevated">
  <CardTitle>Amazing Feature</CardTitle>
  <CardDescription>This feature will blow your mind</CardDescription>
</FeatureCard>
`;
  return (
    <div className="space-y-6 mb-8 mt-4">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border border-gray-300 rounded-lg mt-4">
            <div className="flex flex-wrap gap-4 items-center justify-center p-4">
              <FeatureCard icon={<Star className="h-8 w-8 text-primary" />} variant="elevated">
                <CardTitle>Amazing Feature</CardTitle>
                <CardDescription>This feature will blow your mind</CardDescription>
              </FeatureCard>
            </div>
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

const StatCardDemo = () => {
  const codeString = `
<StatCard value="99.9%" label="Uptime" trend="up" trendValue="+2.1%"/>
`;
  return (
    <div className="space-y-6 mb-8 mt-4">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border border-gray-300 rounded-lg mt-4">
            <div className="flex flex-wrap gap-4 items-center justify-center p-4">
              <StatCard
                value="99.9%"
                label="Uptime"
                trend="up"
                trendValue="+2.1%"
              />
            </div>
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
export { CardsDemo, FeatureCardDemo, StatCardDemo };
