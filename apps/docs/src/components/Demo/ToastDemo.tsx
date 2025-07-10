
import React, { useState } from 'react';
import { ToastProvider } from '@site/src/components/UI/toast';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Button } from '@site/src/components/UI/button';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useToast } from '../UI/toast/use-toast';

const toastVariants = ['success', 'error', 'warning', 'info', 'default'];
const toastAnimations = ['slide', 'fade', 'bounce', 'pop'];
const toastAppearances = ['glow', 'gradient'];
const toastModes = ['light', 'dark'];

const ToastDemo = () => {
  const [variant, setVariant] = useState('info');
  const [animation, setAnimation] = useState('slide');
  const [appearance, setAppearance] = useState('glow');
  const [mode, setMode] = useState('light');
  const toast = useToast();

  const codeString = `
toast.addToast({
  message: "Hello from Toast!",
  variant: "${variant}",
  animation: "${animation}",
  appearance: "${appearance}",
  mode: "${mode}",
  icon: <InfoCircledIcon className="w-5 h-5" />
});
`;

  const showToast = () => {
    toast.addToast({
      message: 'Hello from Toast!',
      variant: variant as any,
      animation: animation as any,
      appearance: appearance as any,
      mode: mode as any,
      icon: <InfoCircledIcon className="w-5 h-5" />,
    });
  };

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <VariantSelector
          variants={toastVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="variant"
        />
        <VariantSelector
          variants={toastAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="animation"
        />
        <VariantSelector
          variants={toastAppearances}
          selectedVariant={appearance}
          onSelectVariant={setAppearance}
          type="appearance"
        />
        <VariantSelector variants={toastModes} selectedVariant={mode} onSelectVariant={setMode} type="mode" />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 rounded-lg border mt-4">
            <Button onClick={showToast}>Show Toast</Button>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

const ToastDemoWrapper = () => (
  <ToastProvider>
    <ToastDemo />
  </ToastProvider>
);

export default ToastDemoWrapper;
