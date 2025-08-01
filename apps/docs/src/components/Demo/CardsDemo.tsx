import React, { useState } from 'react';
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

const cardVariants = [
  { value: 'default', label: 'Default' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'glass', label: 'Glass' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'neon', label: 'Neon' },
  { value: 'outline', label: 'Outline' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'premium', label: 'Premium' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'info', label: 'Info' },
];

const cardSizes = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const cardAnimations = [
  { value: 'none', label: 'None' },
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'slideUp', label: 'Slide Up' },
  { value: 'scaleIn', label: 'Scale In' },
  { value: 'flipIn', label: 'Flip In' },
  { value: 'bounceIn', label: 'Bounce In' },
  { value: 'floatIn', label: 'Float In' },
];

const cardInteractions = [
  { value: 'none', label: 'None' },
  { value: 'hover', label: 'Hover' },
  { value: 'press', label: 'Press' },
  { value: 'lift', label: 'Lift' },
  { value: 'tilt', label: 'Tilt' },
  { value: 'glow', label: 'Glow' },
];

const CardsDemo = () => {
  const [variant, setVariant] = useState('default');
  const [size, setSize] = useState('md');
  const [animation, setAnimation] = useState('none');
  const [interaction, setInteraction] = useState('none');
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation key when animation prop changes
  const handleAnimationChange = (newAnimation: string) => {
    setAnimation(newAnimation);
    setAnimationKey((prevKey) => prevKey + 1);
  };

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
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={cardVariants.map((v) => v.value)}
            selectedVariant={variant}
            onSelectVariant={setVariant}
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={cardSizes.map((s) => s.value)}
            selectedVariant={size}
            onSelectVariant={setSize}
            type="Size"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={cardAnimations.map((a) => a.value)}
            selectedVariant={animation}
            onSelectVariant={handleAnimationChange}
            type="Animation"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={cardInteractions.map((i) => i.value)}
            selectedVariant={interaction}
            onSelectVariant={setInteraction}
            type="Interaction"
          />
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4">
            <div className="flex flex-wrap gap-4 items-center justify-center p-4">
              <Card
                key={`card-${animationKey}`}
                variant={variant as any}
                size={size as any}
                animation={animation as any}
                interactive={interaction as any}
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
    <div className="p-6 border rounded-lg mt-4">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="flex flex-wrap gap-4 items-center justify-center p-4">
            <FeatureCard icon={<Star className="h-8 w-8 text-primary" />} variant="elevated">
              <CardTitle>Amazing Feature</CardTitle>
              <CardDescription>This feature will blow your mind</CardDescription>
            </FeatureCard>
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
    <div className="p-6 border rounded-lg mt-4">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="flex flex-wrap gap-4 items-center justify-center p-4">
            <StatCard
              value="99.9%"
              label="Uptime"
              trend="up"
              trendValue="+2.1%"
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
export { CardsDemo, FeatureCardDemo, StatCardDemo };
