import React, { useState, useRef } from 'react';
import { AIStreamingText } from '../UI/ai-streaming-text';
import type { AIStreamingTextRef } from '../UI/ai-streaming-text';
import { Button } from '../UI/button';
import { Slider } from '../UI/slider';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Play, Square, RotateCcw } from 'lucide-react';

const AIStreamingTextDemo = (): React.JSX.Element => {
  const ref = useRef<AIStreamingTextRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [mode, setMode] = useState<'char' | 'word' | 'sentence'>('char');
  const [speed, setSpeed] = useState(30);
  const [textKey, setTextKey] = useState(0);

  const handleStop = (): void => {
    ref.current?.stop();
    setIsPlaying(false);
  };

  const handleResume = (): void => {
    ref.current?.resume();
    setIsPlaying(true);
    setCompleted(false);
  };

  const handleReset = (): void => {
    ref.current?.reset();
    setIsPlaying(false);
    setCompleted(false);
  };

  const restartStream = (): void => {
    setTextKey((prev) => prev + 1);
    setIsPlaying(true);
    setCompleted(false);
  };

  const handleComplete = (): void => {
    setCompleted(true);
    setIsPlaying(false);
  };

  const sampleText = 
    "Ignix UI leverages Framer Motion and clean CSS configurations to deliver ultra-smooth micro-animations. Components are registered, modular, and optimized for both dark modes and light modes.";

  const codeString = `
import { AIStreamingText } from '@mindfiredigital/ignix-ui';

function TypewriterEffect() {
  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-neutral-900">
      <AIStreamingText
        text="${sampleText}"
        mode="${mode}"
        speed={${speed}}
        isStreaming={true}
        showCursor={true}
      />
    </div>
  );
}
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          {completed ? (
            <Button
              size="sm"
              onClick={restartStream}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={12} /> Restart
            </Button>
          ) : !isPlaying ? (
            <Button
              size="sm"
              onClick={handleResume}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={12} /> Resume
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer"
            >
              <Square size={12} /> Stop
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <RotateCcw size={12} /> Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={restartStream}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 border border-blue-100 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30 dark:hover:bg-blue-950/50 cursor-pointer"
          >
            Restart
          </Button>
        </div>

        
        <div className="flex flex-wrap items-center gap-4">
          <VariantSelector
            type="Mode"
            variants={['char', 'word', 'sentence']}
            selectedVariant={mode}
            onSelectVariant={(v): void => {
              const nextMode = v as 'char' | 'word' | 'sentence';
              setMode(nextMode);
              if (nextMode === 'char') setSpeed(30);
              else if (nextMode === 'word') setSpeed(120);
              else setSpeed(500);
              restartStream();
            }}
            variantLabels={{
              char: 'Character Speed',
              word: 'Word Speed',
              sentence: 'Sentence Speed',
            }}
          />

          <div className="flex items-center gap-2 min-w-[150px]">
            <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">Delay ({speed}ms):</span>
            <Slider
              min={10}
              max={mode === 'sentence' ? 1500 : 500}
              step={10}
              value={[speed]}
              onValueChange={(val): void => {
                setSpeed(val[0]);
                restartStream();
              }}
              className="w-28 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-5 border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 min-h-[120px] flex items-center text-sm font-medium text-neutral-800 dark:text-neutral-200">
            <AIStreamingText
              key={textKey}
              ref={ref}
              text={sampleText}
              mode={mode}
              speed={speed}
              isStreaming={isPlaying}
              showCursor={true}
              onComplete={handleComplete}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default AIStreamingTextDemo;
