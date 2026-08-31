import * as React from "react";
import { cn } from "../../../utils/cn";

export interface AIStreamingTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  text?: string;
  stream?: ReadableStream<Uint8Array | string>;
  mode?: "char" | "word" | "sentence" | "direct";
  speed?: number;
  isStreaming?: boolean;
  showCursor?: boolean;
  cursor?: React.ReactNode;
  onStart?: () => void;
  onChunk?: (text: string) => void;
  onComplete?: () => void;
}

export interface AIStreamingTextRef {
  stop: () => void;
  reset: () => void;
  resume: () => void;
}

const speedMap = {
  char: 20,
  word: 60,
  sentence: 200,
  direct: 0,
};

const AIStreamingText = React.forwardRef<AIStreamingTextRef, AIStreamingTextProps>(
  (
    {
      className,
      text = "",
      stream,
      mode = "char",
      speed,
      isStreaming = true,
      showCursor = true,
      cursor,
      onStart,
      onChunk,
      onComplete,
      ...props
    },
    ref
  ) => {
    const [displayedText, setDisplayedText] = React.useState("");
    const [active, setActive] = React.useState(isStreaming);
    const [isFinished, setIsFinished] = React.useState(false);
    
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);
    const streamReaderRef = React.useRef<ReadableStreamDefaultReader<Uint8Array | string> | null>(null);
    const cancelledStreamRef = React.useRef<ReadableStream<Uint8Array | string> | null>(null);
    const currentTextIndexRef = React.useRef(0);
    const onChunkRef = React.useRef(onChunk);
    const onCompleteRef = React.useRef(onComplete);
    const onStartRef = React.useRef(onStart);

    React.useEffect(() => {
      onChunkRef.current = onChunk;
      onCompleteRef.current = onComplete;
      onStartRef.current = onStart;
    }, [onChunk, onComplete, onStart]);

    React.useEffect(() => {
      setActive(isStreaming);
    }, [isStreaming]);

    const stop = React.useCallback((): void => {
      setActive(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (streamReaderRef.current) {
        streamReaderRef.current.cancel().catch(() => { /* ignore */ });
        streamReaderRef.current = null;
      }
      if (stream) {
        cancelledStreamRef.current = stream;
      }
    }, [stream]);

    const reset = React.useCallback((): void => {
      stop();
      setDisplayedText("");
      currentTextIndexRef.current = 0;
      setIsFinished(false);
      cancelledStreamRef.current = null;
    }, [stop]);

    const resume = React.useCallback((): void => {
      if (isFinished) return;
      if (stream && stream === cancelledStreamRef.current) return;
      setActive(true);
    }, [isFinished, stream]);

    React.useImperativeHandle(ref, () => ({
      stop,
      reset,
      resume,
    }));

    React.useEffect(() => {
      currentTextIndexRef.current = 0;
      setDisplayedText("");
      setIsFinished(false);
      cancelledStreamRef.current = null;
    }, [text, mode, stream]);

    React.useEffect(() => {
      if (stream || !text) return;
      if (!active || isFinished) return;

      const delay = speed !== undefined ? speed : speedMap[mode];

      if (mode === "direct" || delay <= 0) {
        onStartRef.current?.();
        setDisplayedText(text);
        onChunkRef.current?.(text);
        setIsFinished(true);
        onCompleteRef.current?.();
        return;
      }

      if (currentTextIndexRef.current === 0) {
        onStartRef.current?.();
      }

      const streamStep = (): void => {
        if (mode === "char") {
          const nextIndex = currentTextIndexRef.current + 1;
          const nextText = text.slice(0, nextIndex);
          setDisplayedText(nextText);
          onChunkRef.current?.(nextText);
          currentTextIndexRef.current = nextIndex;

          if (nextIndex >= text.length) {
            setIsFinished(true);
            onCompleteRef.current?.();
          } else {
            timerRef.current = setTimeout(streamStep, delay);
          }
        } else if (mode === "word") {
          const words = text.split(" ");
          const nextIndex = currentTextIndexRef.current + 1;
          const nextText = words.slice(0, nextIndex).join(" ");
          setDisplayedText(nextText);
          onChunkRef.current?.(nextText);
          currentTextIndexRef.current = nextIndex;

          if (nextIndex >= words.length) {
            setIsFinished(true);
            onCompleteRef.current?.();
          } else {
            timerRef.current = setTimeout(streamStep, delay);
          }
        } else if (mode === "sentence") {
          const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
          const nextIndex = currentTextIndexRef.current + 1;
          const nextText = sentences.slice(0, nextIndex).join("");
          setDisplayedText(nextText);
          onChunkRef.current?.(nextText);
          currentTextIndexRef.current = nextIndex;

          if (nextIndex >= sentences.length) {
            setIsFinished(true);
            onCompleteRef.current?.();
          } else {
            timerRef.current = setTimeout(streamStep, delay);
          }
        }
      };

      timerRef.current = setTimeout(streamStep, delay);

      return (): void => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [text, stream, mode, speed, active, isFinished]);

    React.useEffect(() => {
      if (!stream) return;
      if (!active || isFinished) return;

      onStartRef.current?.();
      const reader = stream.getReader();
      streamReaderRef.current = reader;
      const decoder = new TextDecoder();
      let streamAccumulator = "";

      const readStream = async (): Promise<void> => {
        try {
          let reading = true;
          while (reading) {
            const { value, done } = await reader.read();
            if (done) {
              setIsFinished(true);
              onCompleteRef.current?.();
              reading = false;
              break;
            }

            const chunk = typeof value === "string" ? value : decoder.decode(value, { stream: true });
            streamAccumulator += chunk;
            setDisplayedText(streamAccumulator);
            onChunkRef.current?.(streamAccumulator);
          }
        } catch (err) {
          // Ignore stream read errors
        } finally {
          reader.releaseLock();
          streamReaderRef.current = null;
        }
      };

      readStream();

      return (): void => {
        reader.cancel().catch(() => { /* ignore */ });
        streamReaderRef.current = null;
      };
    }, [stream, active, isFinished]);

    React.useEffect(() => {
      return (): void => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (streamReaderRef.current) streamReaderRef.current.cancel().catch(() => { /* ignore */ });
      };
    }, []);

    const isCurrentlyStreaming = active && !isFinished && (text.length > 0 || stream !== undefined);

    return (
      <span className={cn("inline select-text leading-relaxed", className)} {...props}>
        {displayedText}
        {showCursor && isCurrentlyStreaming && (
          <span 
            className="inline-block w-[3px] h-[1em] ml-1 bg-neutral-900 dark:bg-neutral-100 rounded-sm animate-pulse align-middle"
            style={{ animationDuration: "1s" }}
            aria-hidden="true"
          >
            {cursor}
          </span>
        )}
      </span>
    );
  }
);

AIStreamingText.displayName = "AIStreamingText";

export { AIStreamingText };
