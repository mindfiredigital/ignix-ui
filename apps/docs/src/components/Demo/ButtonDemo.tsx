
import React, { useState } from 'react';
import { Button } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const buttonVariants = [
  { value: 'default', label: 'Default' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'link', label: 'Link' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'glass', label: 'Glass' },
  { value: 'neon', label: 'Neon' },
  { value: 'pill', label: 'Pill' },
  { value: 'none', label: 'None' },
];

const buttonSizes = [
  { value: 'xs', label: 'Extra Small (xs)' },
  { value: 'sm', label: 'Small (sm)' },
  { value: 'md', label: 'Medium (md)' },
  { value: 'lg', label: 'Large (lg)' },
  { value: 'xl', label: 'Extra Large (xl)' },
  { value: 'icon', label: 'Icon' },
  { value: 'pill', label: 'Pill' },
  { value: 'block', label: 'Block' },
  { value: 'compact', label: 'Compact' },
  { value: 'wide', label: 'Wide' },
];

const animationVariants = [
  { value: '', label: 'None' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'bounceSlow', label: 'Bounce Slow' },
  { value: 'bounceFast', label: 'Bounce Fast' },
  { value: 'bounceSmooth', label: 'Bounce Smooth' },
  { value: 'bounceJelly', label: 'Bounce Jelly' },
  { value: 'rotateClockwiseSlow', label: 'Rotate Clockwise Slow' },
  { value: 'rotateClockwiseFast', label: 'Rotate Clockwise Fast' },
  { value: 'rotateAntiClockwiseSlow', label: 'Rotate Anti-Clockwise Slow' },
  { value: 'rotateAntiClockwiseFast', label: 'Rotate Anti-Clockwise Fast' },
  { value: 'rotatePingPong', label: 'Rotate Ping Pong' },
  { value: 'scaleUp', label: 'Scale Up' },
  { value: 'scaleDown', label: 'Scale Down' },
  { value: 'scalePulse', label: 'Scale Pulse' },
  { value: 'scaleExpandContract', label: 'Scale Expand/Contract' },
  { value: 'scaleHeartbeat', label: 'Scale Heartbeat' },
  { value: 'flipX', label: 'Flip X' },
  { value: 'flipY', label: 'Flip Y' },
  { value: 'flipCard', label: 'Flip Card' },
  { value: 'fadeBlink', label: 'Fade Blink' },
  { value: 'fadeInOut', label: 'Fade In/Out' },
  { value: 'press3D', label: '3D Press' },
  { value: 'press3DSoft', label: '3D Press Soft' },
  { value: 'press3DHard', label: '3D Press Hard' },
  { value: 'press3DPop', label: '3D Press Pop' },
  { value: 'press3DDepth', label: '3D Press Depth' },
  { value: 'spinSlow', label: 'Spin Slow' },
  { value: 'spinFast', label: 'Spin Fast' },
  { value: 'wobble', label: 'Wobble' },
  { value: 'tilt3D', label: 'Tilt 3D' },
];

const ButtonDemo = () => {
  const [variant, setVariant] = useState('default');
  const [size, setSize] = useState('md');
  const [animationVariant, setAnimationVariant] = useState('');

  const codeString = `
<Button 
  variant="${variant}" 
  size="${size}" 
  ${animationVariant ? `animationVariant="${animationVariant}"` : ''}
>
  Click me
</Button>
`;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <VariantSelector
            variants={buttonVariants.map(v => v.value)}
            selectedVariant={variant}
            onSelectVariant={setVariant}
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={buttonSizes.map(s => s.value)}
            selectedVariant={size}
            onSelectVariant={setSize}
            type="Size"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={animationVariants.map(a => a.value)}
            selectedVariant={animationVariant || 'none'}
            onSelectVariant={(value) => setAnimationVariant(value === 'none' ? '' : value)}
            type="Animation"
          />
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4 bg-white dark:bg-gray-800">
            <div className="flex flex-wrap gap-4 items-center justify-center p-4">
              <Button 
                variant={variant as any} 
                size={size as any}
                animationVariant={animationVariant as any}
              >
                Click me
              </Button>
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

export default ButtonDemo;
