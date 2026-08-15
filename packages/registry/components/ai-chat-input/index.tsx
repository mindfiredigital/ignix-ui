import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Square } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { ButtonWithIcon } from '../buttonwithicon';

const chatInputVariants = cva(
  'flex w-full flex-col gap-2 rounded-2xl border p-3 transition-all duration-200',
  {
    variants: {
      variant: {
        default: "bg-background border-border text-foreground",
        dark: "bg-[var(--color-dark-dropdown-bg)] border-[var(--color-dark-dropdown-border)] text-[var(--color-dark-dropdown-text)]",
        glass: "bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] backdrop-blur-xl backdrop-saturate-150 shadow-[var(--color-glass-shadow)] text-[var(--color-glass-text)] hover:bg-[var(--color-glass-hover)] transition-all duration-200",
        minimal: "bg-transparent border-transparent shadow-none"
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const LINE_HEIGHT_PX = 24;

export interface AIChatInputProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange' | 'size' | 'rows' | 'onKeyDown'
  >,
  VariantProps<typeof chatInputVariants> {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  minRows?: number;
  maxRows?: number;
  attachmentSlot?: React.ReactNode;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

const AIChatInput = React.forwardRef<HTMLTextAreaElement, AIChatInputProps>(
  (
    {
      className,
      variant,
      value,
      onChange,
      onSend,
      onStop,
      isStreaming = false,
      minRows = 1,
      maxRows = 6,
      attachmentSlot,
      disabled,
      placeholder = 'Message...',
      onKeyDown,
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement);

    React.useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = 'auto';
      const maxHeight = LINE_HEIGHT_PX * maxRows;
      const nextHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${nextHeight}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [value, maxRows]);

    const trimmedValue = value.trim();

    const handleSend = () => {
      if (isStreaming || !trimmedValue) return;
      onSend(trimmedValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    };

    return (
      <div className={cn(chatInputVariants({ variant }), className)}>
        <textarea
          ref={innerRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={minRows}
          className={cn(
            'w-full resize-none bg-transparent text-sm leading-6 text-inherit outline-none focus:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!outline-none focus:!shadow-none focus-visible:!shadow-none',
            'placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50'
          )}
          style={{
            boxShadow: 'none',
            outline: 'none',
            ...props.style
          }}
          {...props}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">{attachmentSlot}</div>
          <AnimatePresence mode="wait" initial={false}>
            {isStreaming ? (
              <motion.div
                key="stop"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <ButtonWithIcon
                  type="button"
                  variant="outline"
                  size="icon"
                  icon={<Square className="fill-current" size={14} />}
                  iconPosition="only"
                  onClick={onStop}
                  aria-label="Stop generating"
                />
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <ButtonWithIcon
                  type="button"
                  size="icon"
                  icon={<Send size={16} />}
                  iconPosition="only"
                  onClick={handleSend}
                  disabled={disabled || !trimmedValue}
                  aria-label="Send message"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

AIChatInput.displayName = 'AIChatInput';

export { AIChatInput, chatInputVariants };
