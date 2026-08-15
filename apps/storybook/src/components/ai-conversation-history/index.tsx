"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { Button } from "../button";
import AnimatedInput from "../input";
import { Search, Plus, Trash2, Edit3, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "../tooltip";

const sidebarVariants = cva(
  "flex flex-col w-full h-full relative transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-card border-r border-border text-card-foreground shadow-sm",

        dark:
          "bg-[var(--color-dark-dropdown-bg)] border-r border-[var(--color-dark-dropdown-border)] text-[var(--color-dark-dropdown-text)]",

        glass:
          "bg-[var(--color-glass-bg)] border-r border-[var(--color-glass-border)] backdrop-blur-xl backdrop-saturate-150 text-neutral-900 dark:text-white shadow-[var(--color-glass-shadow)]",

        minimal:
          "bg-transparent border-r-transparent text-foreground shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ConversationSession {
  id: string;
  title: string;
  timestamp: Date | string;
  summary?: string;
}

export interface AIConversationHistoryProps extends VariantProps<typeof sidebarVariants> {
  sessions: ConversationSession[];
  activeSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  onSessionRename?: (sessionId: string, newTitle: string) => void;
  onSessionDelete?: (sessionId: string) => void;
  onNewChat?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  footerSlot?: React.ReactNode;
  title?: string;
  className?: string;
}

export const AIConversationHistory = React.forwardRef<HTMLDivElement, AIConversationHistoryProps>(
  (
    {
      sessions = [],
      activeSessionId,
      onSessionSelect,
      onSessionRename,
      onSessionDelete,
      onNewChat,
      searchQuery,
      onSearchChange,
      footerSlot,
      title = "History",
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
    const [editingTitle, setEditingTitle] = React.useState("");

    const getGroupedSessions = React.useMemo(() => {
      const filtered = sessions.filter((session) =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const grouped: { [key: string]: ConversationSession[] } = {
        Today: [],
        Yesterday: [],
        "Last 7 Days": [],
        Older: [],
      };

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
      const startOfSevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;

      filtered.forEach((session) => {
        const time = new Date(session.timestamp).getTime();
        if (time >= startOfToday) {
          grouped["Today"].push(session);
        } else if (time >= startOfYesterday) {
          grouped["Yesterday"].push(session);
        } else if (time >= startOfSevenDaysAgo) {
          grouped["Last 7 Days"].push(session);
        } else {
          grouped["Older"].push(session);
        }
      });

      return Object.entries(grouped).filter(([_, items]) => items.length > 0);
    }, [sessions, searchQuery]);

    const handleRenameStart = (e: React.MouseEvent, id: string, currentTitle: string) => {
      e.stopPropagation();
      setEditingSessionId(id);
      setEditingTitle(currentTitle);
    };

    const handleRenameSave = (id: string) => {
      if (editingTitle.trim() && onSessionRename) {
        onSessionRename(id, editingTitle.trim());
      }
      setEditingSessionId(null);
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter") {
        handleRenameSave(id);
      } else if (e.key === "Escape") {
        setEditingSessionId(null);
      }
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (onSessionDelete) {
        onSessionDelete(id);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ variant }), className)}
        {...props}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          /* Styled custom scrollbar */
          .history-scrollbar-${variant}::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .history-scrollbar-${variant}::-webkit-scrollbar-track {
            background: transparent;
          }
          .history-scrollbar-${variant}::-webkit-scrollbar-thumb {
            background: ${variant === "dark" ? "rgba(255,255,255,0.15)" : variant === "glass" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"};
            border-radius: 2px;
          }
          .history-scrollbar-${variant}::-webkit-scrollbar-thumb:hover {
            background: ${variant === "dark" ? "rgba(255,255,255,0.25)" : variant === "glass" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"};
          }

          /* Search Input overrides for variant matches */
          .history-search-dark input {
            background: #171717 !important;
            border-color: #262626 !important;
            color: #ffffff !important;
          }
          .history-search-dark input:focus {
            border-color: #6366f1 !important;
          }
          .history-search-dark label {
            color: #737373 !important;
          }
          .history-search-dark svg {
            color: #737373 !important;
          }

          .history-search-glass input {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #ffffff !important;
            backdrop-filter: blur(12px) !important;
          }
          .history-search-glass input:focus {
            border-color: rgba(255, 255, 255, 0.4) !important;
            background: rgba(255, 255, 255, 0.12) !important;
          }
          .history-search-glass label {
            color: rgba(255, 255, 255, 0.5) !important;
          }
          .history-search-glass svg {
            color: rgba(255, 255, 255, 0.5) !important;
          }
        `}} />

        <div className="p-4 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                "text-sm font-bold tracking-tight",
                variant === "glass" && "!text-white"
              )}
            >
              {title}
            </h3>
            {onNewChat && (
              <Button
                onClick={onNewChat}
                variant={variant === "glass" ? "glass" : variant === "dark" ? "danger" : "outline"}
                size="compact"
                className={cn(
                  "rounded-lg flex items-center gap-1.5 cursor-pointer font-bold active:scale-95 transition-all text-xs",
                  variant === "glass"
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:bg-[var(--color-glass-hover)]" : "",
                  variant === "dark" ? "bg-neutral-800 hover:bg-neutral-700 border-neutral-850 text-white" : ""
                )}
              >
                <Plus size={14} />
                New
              </Button>
            )}
          </div>

          <div className={cn(
            "relative group/search",
            variant === "dark" && "history-search-dark",
            variant === "glass" && "history-search-glass"
          )}>
            <AnimatedInput
              placeholder="Search chat history..."
              variant="clean"
              value={searchQuery}
              onChange={onSearchChange}
              size="sm"
              icon={Search}
              className="w-full"
            />
          </div>
        </div>

        
        <div className={cn(
          "flex-1 overflow-y-auto px-3 pb-4 space-y-5 scrollbar-thin select-none",
          "history-scrollbar-" + variant
        )}>
          <AnimatePresence initial={false}>
            {getGroupedSessions.length === 0 ? (
              <div
                className={cn(
                  "text-center py-8",
                  variant === "glass"
                    ? "text-white/70"
                    : "text-neutral-400 dark:text-neutral-500"
                )}
              >                <MessageSquare size={20} className="mx-auto opacity-40" />
                <p className="text-xs font-medium">No sessions found</p>
              </div>
            ) : (
              getGroupedSessions.map(([groupName, items]) => (
                <div key={groupName} className="space-y-1.5">
                  <h4
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider pl-2",
                      variant === "glass"
                        ? "!text-white"
                        : "text-muted-foreground"
                    )}
                  >
                    {groupName}
                  </h4>
                  <div className="space-y-1">
                    {items.map((session) => {
                      const isActive = activeSessionId === session.id;
                      const isEditing = editingSessionId === session.id;

                      return (
                        <motion.div
                          key={session.id}
                          layoutId={session.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => !isEditing && onSessionSelect?.(session.id)}
                          className={cn(
                            "group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs font-medium transition-all relative overflow-hidden",
                            isActive
                              ? variant === "glass"
                                ? "bg-white/10 text-white border border-white/10 shadow-sm"
                                : variant === "dark"
                                  ? "bg-neutral-800 border border-neutral-850 text-white"
                                  : variant === "minimal"
                                    ? "bg-neutral-100 dark:bg-neutral-800 text-indigo-650 dark:text-indigo-400 font-bold"
                                    : "bg-indigo-500/10 border border-indigo-500/15 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 dark:border-indigo-400/15"
                              : variant === "glass"
                                ? "text-white/90 hover:bg-white/10 hover:text-white border border-transparent"
                                : variant === "dark"
                                  ? "text-neutral-400 hover:bg-neutral-900/60 hover:text-white border border-transparent"
                                  : "text-neutral-555 dark:text-neutral-455 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/40 hover:text-neutral-800 dark:hover:text-neutral-200 border border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0 relative z-10">
                            <MessageSquare size={13} className="shrink-0 opacity-60" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => handleRenameKeyDown(e, session.id)}
                                onBlur={() => handleRenameSave(session.id)}
                                autoFocus
                                className={cn(
                                  "bg-transparent text-xs w-full focus:outline-none border-b py-0.5",
                                  variant === "dark" || variant === "glass"
                                    ? "border-white/50 text-white"
                                    : "border-neutral-400 text-neutral-850 dark:text-neutral-150"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <Tooltip
                                content={session.title}
                                bg="dark"
                                rounded="md"
                              >
                                <span className="truncate pr-2 block">
                                  {session.title}
                                </span>
                              </Tooltip>
                            )}
                          </div>

                          {!isEditing && (
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 relative z-10">
                              <button
                                onClick={(e) => handleRenameStart(e, session.id, session.title)}
                                className={cn(
                                  "p-1 rounded transition-colors cursor-pointer",
                                  variant === "glass"
                                    ? "hover:bg-white/10 text-white/80"
                                    : variant === "dark"
                                      ? "hover:bg-neutral-700 text-neutral-300"
                                      : "hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 dark:text-neutral-500 hover:text-neutral-755 dark:hover:text-neutral-300"
                                )}
                                aria-label="Rename session"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, session.id)}
                                className="p-1 rounded transition-colors cursor-pointer hover:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:text-rose-600"
                                aria-label="Delete session"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </AnimatePresence>
        </div>

        {footerSlot && (
          <div
            className={cn(
              "p-3 border-t shrink-0 text-[10px]",
              variant === "glass"
                ? "border-[var(--color-glass-border)] text-white/70"
                : "border-border text-muted-foreground"
            )}
          >
            {footerSlot}
          </div>
        )}
      </div>
    );
  }
);

AIConversationHistory.displayName = "AIConversationHistory";
