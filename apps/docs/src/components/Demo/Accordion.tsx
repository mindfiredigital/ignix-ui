

import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@site/src/components/UI/accordion';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const animationVariants = [
  'fade',
  'slideDown',
  'slideUp',
  'scaleIn',
  'rotate',
  'bounce',
  'flip',
  'zoomIn',
  'elastic',
  'springy',
];

const AccordionDemo = () => {
  const [variant, setVariant] = useState('fade');

  const codeString = `
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent variant="${variant}">
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent variant="${variant}">
      Yes. It comes with default styles that matches the other
      components' aesthetics.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Is it animated?</AccordionTrigger>
    <AccordionContent variant="${variant}">
      Yes! It's animated by default, but you can disable it if you
      prefer.
    </AccordionContent>
  </AccordionItem>
</Accordion>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <VariantSelector variants={animationVariants} selectedVariant={variant} onSelectVariant={setVariant} />
       <Tabs>
        <TabItem value="preview" label="Preview">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent variant={variant as any}>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent variant={variant as any}>
                Yes. It comes with default styles that matches the other
                components' aesthetics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent variant={variant as any}>
                Yes! It's animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AccordionDemo;

