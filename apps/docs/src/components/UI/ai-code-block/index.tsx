"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { Copy, Check, ChevronDown, ChevronUp, WrapText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "function"
  | "operator"
  | "punctuation"
  | "tag"
  | "attr"
  | "class"
  | "property"
  | "builtin"
  | "plain";

interface Token {
  type: TokenType;
  value: string;
}

interface Rule {
  type: TokenType;
  regex: RegExp;
}

const RULES: Record<string, Rule[]> = {
  typescript: [
    { type: "comment", regex: /^\/\/.*|^\/\*[\s\S]*?\*\// },
    { type: "string", regex: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'|^`(?:[^`\\]|\\.)*`/ },
    { type: "number", regex: /^0x[\da-fA-F]+\b|^\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ },
    { type: "keyword", regex: /^(?:const|let|var|function|return|import|export|from|default|class|extends|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|typeof|instanceof|async|await|yield|interface|type|public|private|protected|readonly|as|namespace|keyof|in|of|null|undefined|true|false|void|never|any|unknown|abstract|enum|declare|override)\b/ },
    { type: "builtin", regex: /^(?:console|Math|Array|Object|String|Number|Boolean|Promise|Error|Map|Set|JSON|Date|RegExp|Symbol|Proxy|Reflect|globalThis|process|Buffer|setTimeout|setInterval|clearTimeout|clearInterval|fetch)\b/ },
    { type: "function", regex: /^[a-zA-Z_$][\w$]*(?=\s*\((?!.*?=>))/ },
    { type: "class", regex: /^[A-Z][\w$]*/ },
    { type: "operator", regex: /^[+\-*/%=<>!&|^~?:;.,@#]+/ },
    { type: "punctuation", regex: /^[{}()[\]]+/ },
    { type: "plain", regex: /^[^\s{}()[\]+\-*/%=<>!&|^~?:;.,@#"'`]+|^\s+/ },
  ],
  python: [
    { type: "comment", regex: /^#.*/ },
    { type: "string", regex: /^f?"""[\s\S]*?"""|^r?"""[\s\S]*?"""|^f?'''[\s\S]*?'''|^r?'''[\s\S]*?'''|^f?"(?:[^"\\]|\\.)*"|^r?"(?:[^"\\]|\\.)*"|^f?'(?:[^'\\]|\\.)*'|^r?'(?:[^'\\]|\\.)*'/ },
    { type: "number", regex: /^\b\d+(?:\.\d+)?\b/ },
    { type: "keyword", regex: /^(?:def|class|return|import|from|as|if|elif|else|for|while|try|except|finally|raise|assert|with|in|is|not|and|or|lambda|None|True|False|pass|break|continue|global|nonlocal|del|yield|async|await|property)\b/ },
    { type: "builtin", regex: /^(?:print|len|range|enumerate|zip|map|filter|sorted|list|dict|tuple|set|str|int|float|bool|open|type|isinstance|issubclass|getattr|setattr|hasattr|input|super)\b/ },
    { type: "function", regex: /^[a-zA-Z_]\w*(?=\s*\()/ },
    { type: "operator", regex: /^[+\-*/%=<>!&|^~?:;.,@#]+/ },
    { type: "punctuation", regex: /^[{}()[\]]+/ },
    { type: "plain", regex: /^[^\s{}()[\]+\-*/%=<>!&|^~?:;.,@#"'`]+|^\s+/ },
  ],
  html: [
    { type: "comment", regex: /^<!--[\s\S]*?-->/ },
    { type: "punctuation", regex: /^<\/?[a-zA-Z0-9:-]*\b|^\/?>/ },
    { type: "attr", regex: /^[a-zA-Z_:][a-zA-Z0-9_.:-]*(?=\s*=)/ },
    { type: "operator", regex: /^=/ },
    { type: "string", regex: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/ },
    { type: "plain", regex: /^[^\s<>=]+|^\s+/ },
  ],
  css: [
    { type: "comment", regex: /^\/\*[\s\S]*?\*\/|^\/\/.*/ },
    { type: "keyword", regex: /^@[\w-]+|^!important\b/ },
    { type: "class", regex: /^[.#][a-zA-Z_][\w-]*/ },
    { type: "number", regex: /^\b\d+(?:px|em|rem|%|vh|vw|ms|s|deg|fr)?\b/ },
    { type: "function", regex: /^[a-zA-Z_][\w-]*(?=\s*\()/ },
    { type: "property", regex: /^[a-zA-Z_-]+(?=\s*:)/ },
    { type: "operator", regex: /^[:;.,()]+/ },
    { type: "plain", regex: /^[^\s:;.,()#.@]+|^\s+/ },
  ],
  json: [
    { type: "attr", regex: /^"[^"\\]*"\s*(?=:)/ },
    { type: "string", regex: /^"(?:[^"\\]|\\.)*"/ },
    { type: "number", regex: /^-?\d+(?:\.\d+)?\b/ },
    { type: "keyword", regex: /^(?:true|false|null)\b/ },
    { type: "punctuation", regex: /^[{}()[\]:,]+/ },
    { type: "plain", regex: /^[^\s{}()[\]:,"]+|^\s+/ },
  ],
  bash: [
    { type: "comment", regex: /^#.*/ },
    { type: "builtin", regex: /^\$[\w@#?*!0-9-]+|\$\{\w+\}/ },
    { type: "keyword", regex: /^(?:echo|exit|cd|ls|mkdir|rm|cp|mv|if|then|else|fi|for|in|do|done|while|until|case|esac|function|sudo|chmod|chown|git|pnpm|npm|yarn|node|npx|export|source|grep|sed|awk|curl|wget|cat|touch|find|which|alias|unset|set)\b/ },
    { type: "string", regex: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/ },
    { type: "operator", regex: /^[+\-*/%=<>!&|^~?:;.,@#]+/ },
    { type: "plain", regex: /^[^\s$#"'`+-]+|^\s+/ },
  ],
};

function tokenizeLine(line: string, lang: string): Token[] {
  const language = lang.toLowerCase();
  let rules = RULES.typescript;

  if (language === "html" || language === "xml" || language === "jsx" || language === "tsx") {
    rules = RULES.html;
  } else if (language === "python" || language === "py") {
    rules = RULES.python;
  } else if (language === "css" || language === "scss" || language === "sass" || language === "less") {
    rules = RULES.css;
  } else if (language === "json") {
    rules = RULES.json;
  } else if (language === "bash" || language === "sh" || language === "shell" || language === "zsh") {
    rules = RULES.bash;
  }

  const tokens: Token[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let matched = false;
    for (const rule of rules) {
      const m = rule.regex.exec(remaining);
      if (m) {
        tokens.push({ type: rule.type, value: m[0] });
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ type: "plain", value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}


const LIGHT_COLORS: Record<TokenType, string> = {
  keyword: "text-[#cf222e]",
  string: "text-[#0a3069]",
  comment: "text-[#6e7781] italic",
  number: "text-[#0550ae]",
  function: "text-[#8250df]",
  operator: "text-[#24292f]",
  punctuation: "text-[#24292f]",
  tag: "text-[#116329]",
  attr: "text-[#0550ae]",
  class: "text-[#953800]",
  property: "text-[#0550ae]",
  builtin: "text-[#0550ae]",
  plain: "text-[#24292f]",
};

const DARK_COLORS: Record<TokenType, string> = {
  keyword: "text-[#ff7b72]",
  string: "text-[#a5d6ff]",
  comment: "text-[#8b949e] italic",
  number: "text-[#79c0ff]",
  function: "text-[#d2a8ff]",
  operator: "text-[#e6edf3]",
  punctuation: "text-[#e6edf3]",
  tag: "text-[#7ee787]",
  attr: "text-[#79c0ff]",
  class: "text-[#ffa657]",
  property: "text-[#79c0ff]",
  builtin: "text-[#79c0ff]",
  plain: "text-[#e6edf3]",
};


const LANG_LABELS: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  bash: "Bash",
  sh: "Shell",
  tsx: "TSX",
  jsx: "JSX",
};


export interface AICodeBlockProps {
  code: string;
  language?: string;
  streaming?: boolean;
  streamSpeed?: number;
  showLineNumbers?: boolean;
  lineNumberToggle?: boolean;
  collapsible?: boolean;
  maxLines?: number;
  onCopy?: (code: string) => void;
  className?: string;
  variant?: "default" | "dark" | "glass" | "minimal";
}


export const AICodeBlock = React.forwardRef<HTMLDivElement, AICodeBlockProps>(
  (
    {
      code = "",
      language = "typescript",
      streaming = false,
      streamSpeed = 8,
      showLineNumbers: showLineNumbersProp = false,
      lineNumberToggle = true,
      collapsible = true,
      maxLines = 18,
      onCopy,
      className,
      variant = "default",
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [showLines, setShowLines] = React.useState(showLineNumbersProp);
    const [expanded, setExpanded] = React.useState(false);

    const [displayedCode, setDisplayedCode] = React.useState(streaming ? "" : code);
    const frameRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      if (!streaming) { setDisplayedCode(code); return; }
      let idx = 0;
      setDisplayedCode("");
      const tick = () => {
        idx = Math.min(idx + streamSpeed, code.length);
        setDisplayedCode(code.slice(0, idx));
        if (idx < code.length) frameRef.current = setTimeout(tick, 16);
      };
      frameRef.current = setTimeout(tick, 16);
      return () => { if (frameRef.current) clearTimeout(frameRef.current); };
    }, [code, streaming, streamSpeed]);

    React.useEffect(() => {
      setShowLines(showLineNumbersProp);
    }, [showLineNumbersProp]);

    const lines = React.useMemo(() => displayedCode.split(/\r?\n/), [displayedCode]);
    const lang = language.toLowerCase();
    const label = LANG_LABELS[lang] || language;

    const isCollapsible = collapsible && lines.length > maxLines;
    const visibleLines = isCollapsible && !expanded ? lines.slice(0, maxLines) : lines;

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      setTimeout(() => setCopied(false), 2000);
    };

    const forceDarkTokens = variant === "dark" || variant === "glass";

    const containerClasses = cn(
      "w-full rounded-lg overflow-hidden font-mono text-[13px] leading-[1.6] transition-all",

      variant === "default" &&
      "border border-border bg-card text-card-foreground shadow-md",

      variant === "dark" &&
      "border border-[var(--color-dark-dropdown-border)] bg-[var(--color-dark-dropdown-bg)] text-[var(--color-dark-dropdown-text)] shadow-lg",

      variant === "glass" &&
      "border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] backdrop-blur-xl backdrop-saturate-150 text-[var(--color-glass-text)] shadow-[var(--color-glass-shadow)]",

      variant === "minimal" &&
      "border-transparent bg-transparent shadow-none text-foreground",

      className
    );

    const headerClasses = cn(
      "flex items-center justify-between px-4 py-2 border-b",

      variant === "default" &&
      "bg-muted/40 border-border",

      variant === "dark" &&
      "bg-[var(--color-dark-dropdown-bg)] border-[var(--color-dark-dropdown-border)]",

      variant === "glass" &&
      "bg-white/5 border-[var(--color-glass-border)] backdrop-blur-xl",

      variant === "minimal" &&
      "border-border"
    );

    const headerTextClasses = cn(
      "text-xs font-medium tracking-wide",

      variant === "default" &&
      "text-muted-foreground",

      variant === "dark" &&
      "text-[var(--color-dark-dropdown-text)]/70",

      variant === "glass" &&
      "text-[var(--color-glass-muted)]",

      variant === "minimal" &&
      "text-muted-foreground"
    );

    const buttonClasses = (active: boolean) => cn(
      "flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer",
      variant === "default" && (active
        ? "text-[#0969da] bg-[#0969da10] [[data-theme=dark]_&]:text-[#58a6ff] [[data-theme=dark]_&]:bg-[#58a6ff15] [.dark_&]:text-[#58a6ff] [.dark_&]:bg-[#58a6ff15]"
        : "text-[#57606a] hover:text-[#24292f] hover:bg-[#d8dee4] [[data-theme=dark]_&]:text-[#8b949e] [[data-theme=dark]_&]:hover:text-[#e6edf3] [[data-theme=dark]_&]:hover:bg-[#21262d] [.dark_&]:text-[#8b949e] [.dark_&]:hover:text-[#e6edf3] [.dark_&]:hover:bg-[#21262d]"),
      variant === "dark" && (active
        ? "text-[#58a6ff] bg-[#58a6ff15]"
        : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"),
      variant === "glass" && (active
        ? "text-white bg-white/15"
        : "text-white/60 hover:text-white hover:bg-white/10"),
      variant === "minimal" && (active
        ? "text-[#0969da] bg-[#0969da10] [[data-theme=dark]_&]:text-[#58a6ff] [[data-theme=dark]_&]:bg-[#58a6ff15] [.dark_&]:text-[#58a6ff] [.dark_&]:bg-[#58a6ff15]"
        : "text-[#57606a] hover:text-[#24292f] [[data-theme=dark]_&]:text-[#8b949e] [[data-theme=dark]_&]:hover:text-[#e6edf3] [.dark_&]:text-[#8b949e] [.dark_&]:hover:text-[#e6edf3]")
    );

    const gutterClasses = cn(
      "select-none mr-5 text-right w-5 shrink-0 inline-block",

      variant === "default" &&
      "text-muted-foreground",

      variant === "dark" &&
      "text-white/30",

      variant === "glass" &&
      "text-[var(--color-glass-muted)]",

      variant === "minimal" &&
      "text-muted-foreground"
    );

    const footerClasses = cn(
      "w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors cursor-pointer border-t",

      variant === "default" &&
      "text-primary border-border hover:bg-muted",

      variant === "dark" &&
      "text-primary border-[var(--color-dark-dropdown-border)] hover:bg-white/5",

      variant === "glass" &&
      "text-[var(--color-glass-text)] border-[var(--color-glass-border)] hover:bg-white/10",

      variant === "minimal" &&
      "text-primary border-border hover:bg-muted"
    );

    return (
      <div ref={ref} className={containerClasses}>
        <div className={headerClasses}>
          <span className={headerTextClasses}>{label}</span>

          <div className="flex items-center gap-1.5">
            {lineNumberToggle && (
              <button
                onClick={() => setShowLines(!showLines)}
                title={showLines ? "Hide line numbers" : "Show line numbers"}
                className={buttonClasses(showLines)}
              >
                <WrapText size={12} />
                <span className="hidden sm:inline">{showLines ? "Lines on" : "Lines off"}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className={buttonClasses(copied)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1"
                  >
                    <Check size={12} /> Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1"
                  >
                    <Copy size={12} /> Copy code
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="overflow-x-auto">
            <pre
              className="m-0 p-4 text-[13px] leading-[1.6] font-mono"
              style={{ background: "transparent", color: "inherit", border: "none", boxShadow: "none" }}
            >
              <code
                className="font-mono"
                style={{ background: "transparent", color: "inherit", border: "none", padding: 0 }}
              >
                {visibleLines.map((line, idx) => {
                  const tokens = tokenizeLine(line, lang);
                  return (
                    <div key={idx} className="flex min-w-max">
                      {showLines && (
                        <span
                          className={gutterClasses}
                          style={{ minWidth: `${String(lines.length).length}ch` }}
                        >
                          {idx + 1}
                        </span>
                      )}
                      <span>
                        {tokens.map((tok, tIdx) => {
                          const lightClass = LIGHT_COLORS[tok.type];
                          const darkClass = DARK_COLORS[tok.type];

                          if (forceDarkTokens) {
                            return (
                              <span key={tIdx} className={darkClass}>
                                {tok.value}
                              </span>
                            );
                          }

                          const combinedClass = LIGHT_TO_DARK_PAIR[tok.type] ?? lightClass;
                          return (
                            <span key={tIdx} className={combinedClass}>
                              {tok.value}
                            </span>
                          );
                        })}
                        {streaming && idx === visibleLines.length - 1 && displayedCode.length < code.length && (
                          <span
                            className={cn(
                              "inline-block w-[2px] h-[1.15em] ml-1 align-middle animate-pulse",
                              variant === "glass"
                                ? "bg-[var(--color-glass-text)]"
                                : "bg-primary"
                            )}
                            style={{ animationDuration: "0.8s" }}
                          />
                        )}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>

          {isCollapsible && !expanded && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-24 pointer-events-none",
                variant === "default" &&
                "bg-gradient-to-t from-card to-transparent",
                variant === "dark" && "bg-gradient-to-t from-[var(--color-dark-dropdown-bg)] to-transparent",
                variant === "glass" && "bg-gradient-to-t from-[var(--color-glass-bg)] to-transparent",
                variant === "minimal" && "hidden"
              )}
            />
          )}
        </div>

        {isCollapsible && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={footerClasses}
          >
            {expanded ? (
              <><ChevronUp size={13} /> Show less</>
            ) : (
              <><ChevronDown size={13} /> Show {lines.length - maxLines} more lines</>
            )}
          </button>
        )}
      </div>
    );
  }
);

AICodeBlock.displayName = "AICodeBlock";

const LIGHT_TO_DARK_PAIR: Record<TokenType, string> = {
  keyword: "text-[#cf222e] [[data-theme=dark]_&]:text-[#ff7b72] [.dark_&]:text-[#ff7b72]",
  string: "text-[#0a3069] [[data-theme=dark]_&]:text-[#a5d6ff] [.dark_&]:text-[#a5d6ff]",
  comment: "text-[#6e7781] [[data-theme=dark]_&]:text-[#8b949e] [.dark_&]:text-[#8b949e] italic",
  number: "text-[#0550ae] [[data-theme=dark]_&]:text-[#79c0ff] [.dark_&]:text-[#79c0ff]",
  function: "text-[#8250df] [[data-theme=dark]_&]:text-[#d2a8ff] [.dark_&]:text-[#d2a8ff]",
  operator: "text-[#24292f] [[data-theme=dark]_&]:text-[#e6edf3] [.dark_&]:text-[#e6edf3]",
  punctuation: "text-[#24292f] [[data-theme=dark]_&]:text-[#e6edf3] [.dark_&]:text-[#e6edf3]",
  tag: "text-[#116329] [[data-theme=dark]_&]:text-[#7ee787] [.dark_&]:text-[#7ee787]",
  attr: "text-[#0550ae] [[data-theme=dark]_&]:text-[#79c0ff] [.dark_&]:text-[#79c0ff]",
  class: "text-[#953800] [[data-theme=dark]_&]:text-[#ffa657] [.dark_&]:text-[#ffa657]",
  property: "text-[#0550ae] [[data-theme=dark]_&]:text-[#79c0ff] [.dark_&]:text-[#79c0ff]",
  builtin: "text-[#0550ae] [[data-theme=dark]_&]:text-[#79c0ff] [.dark_&]:text-[#79c0ff]",
  plain: "text-[#24292f] [[data-theme=dark]_&]:text-[#e6edf3] [.dark_&]:text-[#e6edf3]",
};

export { };
