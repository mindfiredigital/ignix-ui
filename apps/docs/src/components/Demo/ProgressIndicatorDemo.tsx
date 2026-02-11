import React, { useState } from 'react';
import {
  ProgressIndicator,
  type ProgressIndicatorType,
  type ProgressAnimationVariant,
  type LinearLabelPosition,
  type CircularLabelPosition,
} from '@site/src/components/UI/progress-indicator';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const progressTypes: ProgressIndicatorType[] = ['linear', 'circular'];

const animationVariants: ProgressAnimationVariant[] = [
  'none',
  'smooth',
  'snappy',
  'spring',
  'bounce',
];

const linearLabelPositions: LinearLabelPosition[] = [
  'top',
  'bottom',
  'inside-left',
  'inside-right',
  'inside-center',
  'outside-left',
  'outside-right',
];

const circularLabelPositions: CircularLabelPosition[] = [
  'inside-center',
  'outside-top',
  'outside-bottom',
  'outside-left',
  'outside-right',
];

const ProgressIndicatorDemo: React.FC = () => {
  const [type, setType] = useState<ProgressIndicatorType>('linear');
  const [value, setValue] = useState<number>(64);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [showPercentage, setShowPercentage] = useState<boolean>(true);
  const [animationVariant, setAnimationVariant] =
    useState<ProgressAnimationVariant>('smooth');

  const [linearLabelPosition, setLinearLabelPosition] =
    useState<LinearLabelPosition>('bottom');
  const [circularLabelPosition, setCircularLabelPosition] =
    useState<CircularLabelPosition>('inside-center');

  const currentLabelPosition =
    type === 'linear' ? linearLabelPosition : circularLabelPosition;

  const codeString = `import { ProgressIndicator } from './components/ui/progress-indicator';

function Example() {
  return (
    <ProgressIndicator
      type="${type}"
      value={${value}}
      indeterminate={${indeterminate}}
      showPercentage={${showPercentage}}
      animationVariant="${animationVariant}"
      labelPosition="${currentLabelPosition}"
    />
  );
}`;

  const handleTypeChange = (nextType: ProgressIndicatorType) => {
    setType(nextType);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const handleLinearLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLinearLabelPosition(event.target.value as LinearLabelPosition);
  };

  const handleCircularLabelChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCircularLabelPosition(event.target.value as CircularLabelPosition);
  };

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 sm:justify-end justify-start">
        <VariantSelector
          variants={progressTypes}
          selectedVariant={type}
          onSelectVariant={handleTypeChange}
          type="Type"
        />
        <VariantSelector
          variants={animationVariants}
          selectedVariant={animationVariant}
          onSelectVariant={(variant) => setAnimationVariant(variant as ProgressAnimationVariant)}
          type="Animation"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Value</span>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={handleValueChange}
          />
          <span className="w-10 text-right text-xs">{value}%</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={indeterminate}
            onChange={(event) => setIndeterminate(event.target.checked)}
          />
          <span>Indeterminate</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showPercentage}
            onChange={(event) => setShowPercentage(event.target.checked)}
          />
          <span>Show percentage</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Label position</span>
          {type === 'linear' ? (
            <select
              className="border rounded px-2 py-1 text-xs bg-background"
              value={linearLabelPosition}
              onChange={handleLinearLabelChange}
            >
              {linearLabelPositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          ) : (
            <select
              className="border rounded px-2 py-1 text-xs bg-background"
              value={circularLabelPosition}
              onChange={handleCircularLabelChange}
            >
              {circularLabelPositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 border rounded-lg mt-4">
            <div className="p-6 rounded-lg flex items-center justify-center">
              <ProgressIndicator
                type={type}
                value={value}
                indeterminate={indeterminate}
                showPercentage={showPercentage}
                animationVariant={animationVariant}
                labelPosition={currentLabelPosition}
                className={type === 'linear' ? 'w-full max-w-md' : undefined}
              />
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};


export default ProgressIndicatorDemo;

