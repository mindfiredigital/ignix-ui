import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {
  DeveloperPlaygroundLayout,
  type PlaygroundFile,
  type PlaygroundOrientation,
} from '@site/src/components/UI/developer-playground-layout';

const orientations = ['horizontal', 'vertical'];

const FILES: PlaygroundFile[] = [{ name: 'App.tsx' }, { name: 'styles.css' }];

const FILE_CONTENTS: Record<string, string> = {
  'App.tsx': `export default function App() {\n  return <h1>Hello, playground!</h1>;\n}\n`,
  'styles.css': `h1 {\n  color: #6366f1;\n  font-family: sans-serif;\n}\n`,
};

const codeString = `
import {
  DeveloperPlaygroundLayout,
  type PlaygroundFile,
} from '@ignix-ui/developer-playground-layout';

const files: PlaygroundFile[] = [{ name: 'App.tsx' }, { name: 'styles.css' }];

<DeveloperPlaygroundLayout
  files={files}
  activeFileName={activeFileName}
  onActiveFileChange={setActiveFileName}
  editor={<CodeEditor file={activeFileName} />}
  preview={<PreviewFrame />}
  consoleContent={logs.map((log, i) => <p key={i}>{log}</p>)}
  onClearConsole={() => setLogs([])}
/>
`;

const DEFAULT_LOGS = ['> Compiled successfully.', '> Listening on http://localhost:3000'];

const DeveloperPlaygroundLayoutDemo = () => {
  const [orientation, setOrientation] = useState<PlaygroundOrientation>('horizontal');
  const [activeFileName, setActiveFileName] = useState<string>(FILES[0].name);
  const [logs, setLogs] = useState<string[]>(DEFAULT_LOGS);

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={orientations}
          selectedVariant={orientation}
          onSelectVariant={(val) => setOrientation(val as PlaygroundOrientation)}
          type="Orientation"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="border border-gray-300 rounded-lg overflow-hidden mt-4" style={{ height: 480 }}>
            <DeveloperPlaygroundLayout
              orientation={orientation}
              files={FILES}
              activeFileName={activeFileName}
              onActiveFileChange={setActiveFileName}
              header={<span className="text-sm font-semibold tracking-tight">My Playground</span>}
              editor={
                <pre className="h-full w-full overflow-auto bg-[var(--muted)] p-4 text-sm text-[var(--foreground)]">
                  <code>{FILE_CONTENTS[activeFileName]}</code>
                </pre>
              }
              preview={
                <div className="flex h-full w-full items-center justify-center bg-white">
                  <h1 style={{ color: '#6366f1', fontFamily: 'sans-serif' }}>Hello, playground!</h1>
                </div>
              }
              consoleContent={
                <div className="space-y-1 p-3 font-mono text-xs text-[var(--muted-foreground)]">
                  {logs.length === 0 ? (
                    <p className="italic">Console cleared.</p>
                  ) : (
                    logs.map((log, i) => <p key={i}>{log}</p>)
                  )}
                </div>
              }
              onClearConsole={() => setLogs([])}
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

export default DeveloperPlaygroundLayoutDemo;
