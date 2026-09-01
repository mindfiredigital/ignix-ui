/**
 * @file developer-playground-layout.stories.tsx
 * @description Storybook stories for the DeveloperPlaygroundLayout template. Covers the file tab
 * strip, the editor/preview split (draggable and keyboard-resizable), the collapsible console,
 * vertical orientation, and controlled vs. uncontrolled state.
 */

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeveloperPlaygroundLayout, type PlaygroundFile } from ".";
import { Sparkles, Github, Play } from "lucide-react";

const meta: Meta<typeof DeveloperPlaygroundLayout> = {
  title: "Templates/Layouts/DeveloperPlaygroundLayout",
  component: DeveloperPlaygroundLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A code-playground shell - the shape behind in-browser coding environments (CodeSandbox, StackBlitz, CodePen). A file tab strip sits above an editor pane, a draggable/keyboard-resizable divider splits it from a live preview pane, and an optional collapsible console sits along the bottom.",
      },
    },
  },
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    minSplitPercentage: { control: { type: "number", min: 0, max: 50, step: 5 } },
    maxSplitPercentage: { control: { type: "number", min: 50, max: 100, step: 5 } },
  },
};

export default meta;

type Story = StoryObj<typeof DeveloperPlaygroundLayout>;

const FILES: PlaygroundFile[] = [{ name: "App.tsx" }, { name: "styles.css" }, { name: "package.json" }];

const FILE_CONTENTS: Record<string, string> = {
  "App.tsx": `export default function App() {\n  return <h1>Hello, playground!</h1>;\n}\n`,
  "styles.css": `h1 {\n  color: #6366f1;\n  font-family: sans-serif;\n}\n`,
  "package.json": `{\n  "name": "playground-app",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}\n`,
};

const CodeEditor: React.FC<{ content: string }> = ({ content }) => (
  <pre className="h-full w-full overflow-auto bg-[var(--muted)] p-4 text-sm text-[var(--foreground)]">
    <code>{content}</code>
  </pre>
);

const PreviewFrame: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center bg-white">
    <h1 style={{ color: "#6366f1", fontFamily: "sans-serif" }}>Hello, playground!</h1>
  </div>
);

const DEFAULT_LOGS = ["> Compiled successfully.", "> Listening on http://localhost:3000"];

const ConsolePanel: React.FC<{ logs: string[] }> = ({ logs }) => (
  <div className="space-y-1 p-3 font-mono text-xs text-[var(--muted-foreground)]">
    {logs.length === 0 ? <p className="italic">Console cleared.</p> : logs.map((log, i) => <p key={i}>{log}</p>)}
  </div>
);

/** Wires up the controlled active-file state a story needs to be interactive. */
function usePlaygroundState(initialFile: string) {
  const [activeFileName, setActiveFileName] = React.useState(initialFile);
  return { activeFileName, setActiveFileName };
}

/** Wires up console log state and a clear handler, so the clear-console button has real effect. */
function useConsoleState() {
  const [logs, setLogs] = React.useState<string[]>(DEFAULT_LOGS);
  return { logs, onClearConsole: () => setLogs([]) };
}

export const Default: Story = {
  render: (args) => {
    const state = usePlaygroundState(FILES[0].name);
    const consoleState = useConsoleState();
    return (
      <DeveloperPlaygroundLayout
        {...args}
        files={FILES}
        activeFileName={state.activeFileName}
        onActiveFileChange={state.setActiveFileName}
        editor={<CodeEditor content={FILE_CONTENTS[state.activeFileName]} />}
        preview={<PreviewFrame />}
        consoleContent={<ConsolePanel logs={consoleState.logs} />}
        onClearConsole={consoleState.onClearConsole}
      />
    );
  },
};

export const WithHeaderAndActions: Story = {
  render: (args) => {
    const state = usePlaygroundState(FILES[0].name);
    return (
      <DeveloperPlaygroundLayout
        {...args}
        files={FILES}
        activeFileName={state.activeFileName}
        onActiveFileChange={state.setActiveFileName}
        editor={<CodeEditor content={FILE_CONTENTS[state.activeFileName]} />}
        preview={<PreviewFrame />}
        header={
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Sparkles className="h-4 w-4" />
            My Playground
          </div>
        }
        actions={
          <>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </button>
            <a href="#" aria-label="GitHub" className="rounded-md p-2 hover:bg-[var(--accent)]">
              <Github className="h-4 w-4" />
            </a>
          </>
        }
      />
    );
  },
};

export const WithoutConsole: Story = {
  render: (args) => {
    const state = usePlaygroundState(FILES[0].name);
    return (
      <DeveloperPlaygroundLayout
        {...args}
        files={FILES}
        activeFileName={state.activeFileName}
        onActiveFileChange={state.setActiveFileName}
        editor={<CodeEditor content={FILE_CONTENTS[state.activeFileName]} />}
        preview={<PreviewFrame />}
      />
    );
  },
};

export const VerticalOrientation: Story = {
  render: (args) => {
    const state = usePlaygroundState(FILES[0].name);
    const consoleState = useConsoleState();
    return (
      <DeveloperPlaygroundLayout
        {...args}
        orientation="vertical"
        files={FILES}
        activeFileName={state.activeFileName}
        onActiveFileChange={state.setActiveFileName}
        editor={<CodeEditor content={FILE_CONTENTS[state.activeFileName]} />}
        preview={<PreviewFrame />}
        consoleContent={<ConsolePanel logs={consoleState.logs} />}
        onClearConsole={consoleState.onClearConsole}
      />
    );
  },
};

export const SingleFile: Story = {
  render: (args) => (
    <DeveloperPlaygroundLayout
      {...args}
      editor={<CodeEditor content={FILE_CONTENTS["App.tsx"]} />}
      preview={<PreviewFrame />}
    />
  ),
};

export const CustomSplitBounds: Story = {
  args: {
    minSplitPercentage: 30,
    maxSplitPercentage: 70,
    defaultSplitPercentage: 30,
  },
  render: (args) => {
    const state = usePlaygroundState(FILES[0].name);
    return (
      <DeveloperPlaygroundLayout
        {...args}
        files={FILES}
        activeFileName={state.activeFileName}
        onActiveFileChange={state.setActiveFileName}
        editor={<CodeEditor content={FILE_CONTENTS[state.activeFileName]} />}
        preview={<PreviewFrame />}
      />
    );
  },
};
