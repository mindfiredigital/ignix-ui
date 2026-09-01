import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIStreamingText } from "./index";
import type { AIStreamingTextRef } from "./index";
import { Button } from "../button";
import { Play, Square, RotateCcw } from "lucide-react";

const meta: Meta<typeof AIStreamingText> = {
  title: "Components/AI/AIStreamingText",
  component: AIStreamingText,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **AIStreamingText** component renders text streams dynamically. It supports simulating real-time typing transitions (typewriter effect) incrementally by character, word, or sentence. It can also directly consume and render native \`ReadableStream\` outputs, complete with a blinking cursor indicator and imperative control APIs (stop, reset, resume).
        `,
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["char", "word", "sentence", "direct"],
    },
    speed: {
      control: { type: "number", min: 0 },
    },
    isStreaming: {
      control: "boolean",
    },
    showCursor: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIStreamingText>;

const sampleParagraph = 
  "Artificial Intelligence is transformatively altering the way developers write software. By offloading cognitive load onto LLM assistant agents, developers can maintain flow state and build highly polished visual layouts directly.";

export const CharacterMode: Story = {
  args: {
    text: sampleParagraph,
    mode: "char",
    speed: 30,
    showCursor: true,
  },
};

export const WordMode: Story = {
  args: {
    text: sampleParagraph,
    mode: "word",
    speed: 150,
    showCursor: true,
  },
};

export const SentenceMode: Story = {
  args: {
    text: sampleParagraph,
    mode: "sentence",
    speed: 600,
    showCursor: true,
  },
};

const ControlPanelSimulator = (): React.JSX.Element => {
  const ref = useRef<AIStreamingTextRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleStop = (): void => {
    ref.current?.stop();
    setIsPlaying(false);
  };

  const handleResume = (): void => {
    ref.current?.resume();
    setIsPlaying(true);
  };

  const handleReset = (): void => {
    ref.current?.reset();
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col space-y-4 max-w-xl p-6 border rounded-2xl bg-neutral-50/30 dark:bg-neutral-900/30">
      <div className="flex gap-2">
        {!isPlaying ? (
          <Button
            size="sm"
            onClick={handleResume}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Play size={12} /> Resume
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStop}
            className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <Square size={12} /> Stop
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer"
        >
          <RotateCcw size={12} /> Reset
        </Button>
      </div>

      <div className="p-4 bg-white dark:bg-neutral-950 border dark:border-neutral-800 rounded-xl min-h-[100px] text-sm text-neutral-800 dark:text-neutral-200">
        <AIStreamingText
          ref={ref}
          text={sampleParagraph}
          mode="char"
          speed={40}
          isStreaming={isPlaying}
        />
      </div>
    </div>
  );
};

export const ImperativeControls: Story = {
  render: () => <ControlPanelSimulator />,
};

const StreamSimulator = (): React.JSX.Element => {
  const [stream, setStream] = useState<ReadableStream<string> | undefined>(undefined);
  const [streamingKey, setStreamingKey] = useState(0);

  const startStream = (): void => {
    const textChunks = [
      "Starting readable stream... ",
      "chunk #1 fetched. ",
      "Evaluating parameters... ",
      "chunk #2 loaded. ",
      "Streaming ingestion complete. Success!"
    ];

    const newStream = new ReadableStream<string>({
      async start(controller): Promise<void> {
        for (const chunk of textChunks) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          controller.enqueue(chunk);
        }
        controller.close();
      }
    });

    setStream(newStream);
    setStreamingKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col space-y-4 max-w-xl p-6 border rounded-2xl bg-neutral-50/30 dark:bg-neutral-900/30">
      <div>
        <Button size="sm" onClick={startStream} className="flex items-center gap-1 cursor-pointer">
          <Play size={12} /> Start ReadableStream Ingestion
        </Button>
      </div>

      <div className="p-4 bg-white dark:bg-neutral-950 border dark:border-neutral-800 rounded-xl min-h-[100px] text-sm text-neutral-800 dark:text-neutral-200 font-mono">
        {stream ? (
          <AIStreamingText
            key={streamingKey}
            stream={stream}
            showCursor={true}
          />
        ) : (
          <span className="text-neutral-400 italic">Click the button above to launch stream...</span>
        )}
      </div>
    </div>
  );
};

export const LiveReadableStream: Story = {
  render: () => <StreamSimulator />,
};
