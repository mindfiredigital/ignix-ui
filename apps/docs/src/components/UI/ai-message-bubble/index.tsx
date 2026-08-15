import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "../../../utils/cn";
import { Avatar } from "../avatar";

const bubbleVariants = cva(
  "relative px-4 py-3 text-sm leading-6 transition-colors shadow-sm",
  {
    variants: {
      role: {
        user: "",
        assistant: "",
        system: "text-center border border-dashed",
      },
      variant: {
        default: "",
        minimal: "shadow-none px-0 py-0 border-none bg-transparent dark:bg-transparent",
        glass: "backdrop-blur-md",
      },
    },
    compoundVariants: [
      {
        role: "user",
        variant: "default",
        className: "bg-neutral-950 border border-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-200",
      },
      {
        role: "assistant",
        variant: "default",
        className: "bg-neutral-100 border border-neutral-200/50 text-neutral-900 dark:bg-neutral-800/80 dark:border-neutral-700/50 dark:text-neutral-100",
      },
      {
        role: "system",
        variant: "default",
        className: "bg-neutral-50 border-neutral-200 text-neutral-500 dark:bg-neutral-900/30 dark:border-neutral-800 dark:text-neutral-400",
      },
      {
        role: "user",
        variant: "minimal",
        className: "text-neutral-900 dark:text-neutral-100",
      },
      {
        role: "assistant",
        variant: "minimal",
        className: "text-neutral-900 dark:text-neutral-100",
      },
      {
        role: "system",
        variant: "minimal",
        className: "text-neutral-500 dark:text-neutral-400",
      },
      {
        role: "assistant",
        variant: "glass",
        className:
          "bg-white/10 border border-white/20 text-white backdrop-blur-xl",
      },
      {
        role: "user",
        variant: "glass",
        className:
          "bg-white/10 border border-white/20 text-white backdrop-blur-xl",
      },
      {
        role: "system",
        variant: "glass",
        className:
          "bg-white/5 border border-white/10 text-white/70 backdrop-blur-xl",
      },
    ],
    defaultVariants: {
      role: "assistant",
      variant: "default",
    },
  }
);

const bubbleShapeVariants = cva("", {
  variants: {
    role: {
      user: "",
      assistant: "",
      system: "",
    },
    shape: {
      bubble: "",
      card: "",
      pill: "",
      flat: "",
    },
  },

  compoundVariants: [
    {
      role: "user",
      shape: "bubble",
      className: "rounded-2xl rounded-tr-none",
    },
    {
      role: "assistant",
      shape: "bubble",
      className: "rounded-2xl rounded-tl-none",
    },
    {
      role: "system",
      shape: "bubble",
      className: "rounded-lg",
    },

    {
      role: "user",
      shape: "card",
      className: "rounded-lg",
    },
    {
      role: "assistant",
      shape: "card",
      className: "rounded-lg",
    },
    {
      role: "system",
      shape: "card",
      className: "rounded-md",
    },
    {
      role: "assistant",
      shape: "pill",
      className:
        "rounded-[36px] rounded-tl-2xl px-7 py-4 max-w-full break-words leading-7",
    },
    {
      role: "user",
      shape: "pill",
      className:
        "rounded-[36px] rounded-tr-2xl px-7 py-4 max-w-full break-words leading-7",
    },
    {
      role: "system",
      shape: "pill",
      className:
        "rounded-[28px] px-6 py-3 leading-6",
    },

    // Flat
    {
      role: "user",
      shape: "flat",
      className: "rounded-none px-3 py-2",
    },
    {
      role: "assistant",
      shape: "flat",
      className: "rounded-none px-3 py-2",
    },
    {
      role: "system",
      shape: "flat",
      className: "rounded-none px-3 py-2",
    },
  ],

  defaultVariants: {
    shape: "bubble",
  },
});

export interface AIMessageBubbleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content" | "role">,
  VariantProps<typeof bubbleVariants>,
  VariantProps<typeof bubbleShapeVariants> {
  content: React.ReactNode;
  avatar?: React.ReactNode;
  senderName?: string;
  timestamp?: string;
  actions?: React.ReactNode;
  showCopy?: boolean;
  animateEntry?: boolean;
}

const AIMessageBubble = React.forwardRef<HTMLDivElement, AIMessageBubbleProps>(
  (
    {
      className,
      role = "assistant",
      variant = "default",
      shape = "bubble",
      content,
      avatar,
      senderName,
      timestamp,
      actions,
      showCopy = false,
      animateEntry = true,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      if (copied || typeof content !== "string") return;
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    };

    const containerVariants = {
      hidden: { opacity: 0, y: 12, scale: 0.98 },
      visible: { opacity: 1, y: 0, scale: 1 },
    };

    const isUser = role === "user";
    const isSystem = role === "system";

    const bubbleContent = (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-start gap-3 p-4 group select-text",
          isUser ? "flex-row-reverse" : isSystem ? "justify-center" : "flex-row",
          className
        )}
        {...props}
      >
        {!isSystem && avatar && (
          <div className="flex-shrink-0 select-none">
            {typeof avatar === "string" ? (
              <Avatar
                src={avatar}
                alt={senderName || role || undefined}
                size="sm"
                shape="circle"
              />
            ) : (
              avatar
            )}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col max-w-[85%] sm:max-w-[75%]",
            isUser ? "items-end" : isSystem ? "items-center w-full" : "items-start"
          )}
        >
          {!isSystem && (senderName || timestamp) && (
            <div className="flex items-center gap-2 mb-1 text-xs text-neutral-500 dark:text-neutral-400 select-none">
              {senderName && <span className="font-semibold">{senderName}</span>}
              {timestamp && <span>{timestamp}</span>}
            </div>
          )}

          <div
            className={cn(
              bubbleVariants({ role, variant }),
              bubbleShapeVariants({ role, shape })
            )}
          >            {typeof content === "string" ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            content
          )}
          </div>

          {!isSystem && (showCopy || actions) && (
            <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 select-none">
              {showCopy && typeof content === "string" && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                  title="Copy message"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              )}
              {actions}
            </div>
          )}
        </div>
      </div>
    );

    if (animateEntry) {
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {bubbleContent}
        </motion.div>
      );
    }

    return bubbleContent;
  }
);

AIMessageBubble.displayName = "AIMessageBubble";

export { AIMessageBubble, bubbleVariants };
