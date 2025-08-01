import React, { useState } from 'react';
import {
  DialogAnimationTypes,
  DialogProvider,
  DialogTypes,
} from '@site/src/components/UI/dialog-box';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Button } from '@site/src/components/UI/button';
import { useDialog } from '../UI/dialog-box/use-dialog';

const dialogAnimations = [
  'popIn',
  'springPop',
  'backdropZoom',
  'flip3D',
  'skewSlide',
  'glassBlur',
  'skyDrop',
];

const dialogTypes = ['alert', 'confirm', 'error', 'success'];

const DialogBoxDemo = () => {
  const [animation, setAnimation] = useState('popIn');
  const [type, setType] = useState('alert');
  const { openDialog } = useDialog();

  const codeString = `
<Button 
  onClick={() => openDialog({
    title: 'Alert',
    content: 'This is an alert dialog.',
    dialogType: '${type}',
    animationKey: '${animation}',
  })}
>
  Show Alert Dialog
</Button>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 sm:justify-end justify-start ">
        <VariantSelector
          variants={dialogAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="Animation"
        />
        <VariantSelector variants={dialogTypes} selectedVariant={type} onSelectVariant={setType} type="Type" />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-4 border rounded-lg mt-4">
            <Button
              onClick={() =>
                openDialog({
                  title: 'Alert',
                  content: 'This is an alert dialog.',
                  dialogType: type as DialogTypes,
                  animationKey: animation as DialogAnimationTypes,
                })
              }
            >
              Show Alert Dialog
            </Button>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

const DialogBoxDemoWrapper = () => (
  <DialogProvider>
    <DialogBoxDemo />
  </DialogProvider>
);

export default DialogBoxDemoWrapper;
