"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { AIMessages, type AIMessagesItem } from "../ai-messages";
import { AIChatInput } from "../ai-chat-input";
import { AISuggestedActions, type SuggestedAction } from "../ai-suggested-actions";

const chatContainerVariants = cva(
  "flex flex-col w-full h-[600px] border rounded-2xl overflow-hidden relative shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-card border-border text-card-foreground shadow-md",

        dark:
          "bg-[var(--color-dark-dropdown-bg)] border-[var(--color-dark-dropdown-border)] text-[var(--color-dark-dropdown-text)] shadow-lg",

        glass:
          "bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] backdrop-blur-xl backdrop-saturate-150 text-[var(--color-glass-text)] shadow-[var(--color-glass-shadow)]",

        minimal:
          "bg-transparent !border-transparent text-foreground shadow-none",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AIChatProps extends VariantProps<typeof chatContainerVariants> {
  messages: AIMessagesItem[];
  isThinking?: boolean;
  emptyState?: React.ReactNode;
  autoScroll?: boolean;
  showJumpToBottom?: boolean;

  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  inputPlaceholder?: string;
  disabled?: boolean;

  suggestedActions?: SuggestedAction[];
  onSuggestedActionClick?: (actionText: string) => void;
  suggestedActionsLayout?: "flex" | "grid";

  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  attachmentSlot?: React.ReactNode;

  className?: string;
  messagesClassName?: string;
  inputClassName?: string;
}

export const AIChat = React.forwardRef<HTMLDivElement, AIChatProps>(
  (
    {
      messages = [],
      isThinking = false,
      emptyState,
      autoScroll = true,
      showJumpToBottom = true,
      inputValue,
      onInputChange,
      onSend,
      onStop,
      isStreaming = false,
      inputPlaceholder = "Message...",
      disabled = false,
      suggestedActions = [],
      onSuggestedActionClick,
      suggestedActionsLayout = "grid",
      headerSlot,

      footerSlot,
      attachmentSlot,
      variant = "default",
      className,
      messagesClassName,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const handleSuggestedActionClick = (actionText: string) => {
      if (onSuggestedActionClick) {
        onSuggestedActionClick(actionText);
      } else {
        onInputChange(actionText);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(chatContainerVariants({ variant }), className)}
        {...props}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header Slot */}
          {headerSlot && (
            <div
              className={cn(
                "border-b p-3.5 flex items-center justify-between shrink-0",
                variant === "glass"
                  ? "border-white/10 text-white"
                  : "border-border"
              )}
            >
              {headerSlot}
            </div>
          )}

          {/* Main Body Section */}
          <div className="flex flex-1 min-h-0 relative overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0 relative">
              {messages.length > 0 ? (
                <AIMessages
                  messages={messages}
                  isThinking={isThinking}
                  emptyState={emptyState}
                  autoScroll={autoScroll}
                  showJumpToBottom={showJumpToBottom}
                  variant={variant}
                  className={cn("flex-1 p-4", messagesClassName)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 overflow-y-auto">
                  {emptyState ? (
                    emptyState
                  ) : (
                    <div className="space-y-2 max-w-sm">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold",
                        variant === "glass"
                          ? "bg-white/10 border border-white/20 text-white shadow-lg"
                          : "bg-primary/10 text-primary")}>
                        ✦
                      </div>
                      <h3
                        className={cn(
                          "text-sm font-bold tracking-tight",
                          variant === "glass" || variant === "dark"
                            ? "text-white"
                            : "text-card-foreground"
                        )}
                      >How can I help you today?</h3>
                      <p className={cn(
                        "text-xs leading-relaxed max-w-xs mx-auto",
                        variant === "glass" || variant === "dark"
                          ? "text-white/70"
                          : "text-muted-foreground")}>
                        Select a prompt starter suggestion below or enter a prompt inside the input message bar.
                      </p>
                    </div>
                  )}

                  {suggestedActions && suggestedActions.length > 0 && (
                    <div className="w-full max-w-md mx-auto pt-4">
                      <AISuggestedActions
                        actions={suggestedActions}
                        layout={suggestedActionsLayout}
                        variant={variant}
                        onActionClick={handleSuggestedActionClick}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Slot */}

          </div>

          {/* Footer Area Section */}
          <div className={cn(
            "p-4 border-t shrink-0 space-y-2",
            variant === "glass"
              ? "border-[var(--color-glass-border)]"
              : "border-border")}>
            <AIChatInput
              value={inputValue}
              onChange={onInputChange}
              onSend={onSend}
              onStop={onStop}
              isStreaming={isStreaming}
              placeholder={inputPlaceholder}
              disabled={disabled}
              attachmentSlot={attachmentSlot}
              variant={variant}
              className={inputClassName}
            />
            {footerSlot && (
              <div className={cn(
                "text-[10px] text-center font-medium",
                variant === "glass"
                  ? "text-white/60"
                  : "text-muted-foreground")}>
                {footerSlot}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AIChat.displayName = "AIChat";
