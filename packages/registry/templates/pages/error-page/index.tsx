// ─────────────────────────────────────────────────────────────────────────────
// ErrorPage Component - Composable Error Page with Sub-components
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { Search } from "lucide-react";
import { Button } from "@ignix-ui/button";
import { Typography } from "@ignix-ui/typography";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface ErrorPageProps extends ErrorPageClassProps,
  VariantProps<typeof containerVariants> {
  /** Custom background image URL */
  backgroundImage?: string;
}

export interface ErrorPageClassProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ErrorPageErrorCodeProps extends ErrorPageClassProps{
  /** Error code to display */
  errorCode?: string;
}

export interface ErrorPageHeadingProps extends ErrorPageClassProps{
  /** Main error title */
  title?: string;
}

export interface ErrorPageDescProps extends ErrorPageClassProps{
  /** Error description message */
  description?: string;
}

export interface ErrorPageIllustrationProps extends ErrorPageClassProps{
  /** Custom illustration - Can be React node, image URL, or component */
  illustration?: React.ReactNode | string;

  /** Illustration position */
  position?: "left" | "right";
}

export interface ErrorPageSearchProps extends ErrorPageClassProps{
  /** Show search bar */
  showSearch?: boolean;

  /** Search placeholder text */
  searchPlaceholder?: string;

  /** Search handler */
  onSearch?: (query: string) => void;

  /** Search button text */
  searchButtonText?: string;
}

export interface ErrorPageLinksProps extends ErrorPageClassProps{
  /** Layout direction */
  direction?: "row" | "column";
}

// ─────────────────────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = cva("min-h-screen w-full flex items-center justify-center",
  {
    variants: {
      variant: {
          default: "bg-gradient-to-br from-background via-muted/30 to-background",
          minimal: "bg-background",
          gradient: "bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10",
          dark: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Illustration Renderer
// ─────────────────────────────────────────────────────────────────────────────

const renderIllustration = (
  illustration: React.ReactNode | string | undefined,
): React.ReactNode => {

  if (typeof illustration === "string") {
    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={illustration}
          alt="Error illustration"
          className="max-w-full h-full"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {illustration}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPage Context
// ─────────────────────────────────────────────────────────────────────────────

const ErrorPageContext = React.createContext<{ 
  variant?: "default" | "minimal" | "gradient" | "dark";
  backgroundImage?: string;
}>({
  variant: "default",
  backgroundImage: undefined,
});

// ─────────────────────────────────────────────────────────────────────────────
// Main ErrorPage Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPage: React.FC<ErrorPageProps> = React.memo(({
  children,
  variant = "default",
  backgroundImage,
  className,
}) => {
  // For centered layout, separate illustration from content
  const childrenArray = React.useMemo(() => React.Children.toArray(children), [children]);
  
  const illustrationChild = React.useMemo(() => 
    childrenArray.find(
      (child) => React.isValidElement(child) && child.type === ErrorPageIllustration
    ) as React.ReactElement<ErrorPageIllustrationProps> | undefined,
    [childrenArray]
  );
  
  // Separate absolute positioned divs (backgrounds) from content
  const backgroundChildren = React.useMemo(() => 
    childrenArray.filter((child) => {
      if (React.isValidElement(child) && typeof child.type === 'string' && child.type === 'div') {
        const divElement = child as React.ReactElement<{ className?: string }>;
        return typeof divElement.props?.className === 'string' && divElement.props.className.includes('absolute');
      }
      return false;
    }),
    [childrenArray]
  );
  
  const contentChildren = React.useMemo(() =>
    childrenArray.filter(
      (child) => {
        if (!React.isValidElement(child)) return true;
        if (child.type === ErrorPageIllustration) return false;
        if (typeof child.type === 'string' && child.type === 'div') {
          const divElement = child as React.ReactElement<{ className?: string }>;
          return !(typeof divElement.props?.className === 'string' && divElement.props.className.includes('absolute'));
        }
        return true;
      }
    ),
    [childrenArray]
  );

  // Get illustration position (default to "left")
  const illustrationPosition = React.useMemo(() => 
    illustrationChild?.props?.position || "left",
    [illustrationChild]
  );
  const isRight = illustrationPosition === "right";

  const backgroundStyle = React.useMemo(() => 
    backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    } : undefined,
    [backgroundImage]
  );

  const contextValue = React.useMemo(() => ({ 
    variant: variant || "default",
    backgroundImage 
  }), [variant, backgroundImage]);

  return (
    <ErrorPageContext.Provider value={contextValue}>
      <motion.div
        className={cn(containerVariants({ variant }), className)}
        role="main"
        aria-label="Error page"
        style={backgroundStyle}
      >
        {/* Background overlay for better text readability when background image is present */}
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
        )}
        
        {/* Render absolute positioned background elements */}
        {backgroundChildren}
        
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <motion.div
            className={cn(
              "flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16",
              isRight && "lg:flex-row-reverse"
            )}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Illustration - Top on mobile/tablet, Side on desktop */}
            {illustrationChild && (
              <motion.div
                className={cn(
                  "flex-shrink-0 w-full lg:w-auto",
                  "flex items-center justify-center",
                  "mb-8 lg:mb-0"
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                  {illustrationChild}
                </div>
              </motion.div>
            )}
            
            {/* Content wrapper for non-illustration children */}
            {contentChildren.length > 0 && (
              <div className="flex-1 w-full max-w-xl space-y-2 text-center lg:text-left">
                {contentChildren}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </ErrorPageContext.Provider>
  );
});

ErrorPage.displayName = "ErrorPage";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageHead Component (Wrapper)
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageHead: React.FC<ErrorPageClassProps> = React.memo(({
  children,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        "flex-1 w-full max-w-xl space-y-2 text-center lg:text-left",
        className
      )}
      variants={itemAnimation}
    >
      {children}
    </motion.div>
  );
});

ErrorPageHead.displayName = "ErrorPageHead";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageErrorCode Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ErrorPageErrorCodeProps extends ErrorPageClassProps {
  /** Error code to display */
  errorCode?: string;

  /** Animation type for the error code */
  animationType?: "pulse" | "bounce" | "glow" | "shake" | "rotate" | "none";
}

// Animation variants for error code (moved outside component for better performance)
const animationVariants = {
  pulse: {
    initial: { opacity: 1, scale: 1 },
    animate: {
      opacity: [1, 0.7, 1],
      scale: [1, 1.05, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  bounce: {
    initial: { y: 0 },
    animate: {
        y: [0, -10, 0],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  glow: {
    initial: { opacity: 1, filter: "brightness(1)" },
    animate: {
      opacity: [1, 0.8, 1],
      filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  shake: {
    initial: { x: 0 },
    animate: {
      x: [0, -5, 5, -5, 5, 0],
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  rotate: {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, -5, 5, -5, 0],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  none: {
    initial: {},
    animate: {},
    transition: {},
  },
};

export const ErrorPageErrorCode: React.FC<ErrorPageErrorCodeProps> = React.memo(({
  errorCode,
  children,
  className,
  animationType = "none",
}) => {
  const { variant, backgroundImage } = React.useContext(ErrorPageContext);
  const isDark = variant === "dark";
  const hasBackgroundImage = !!backgroundImage;

  const selectedAnimation = React.useMemo(() => 
    animationVariants[animationType],
    [animationType]
  );

  const ariaLabel = React.useMemo(() => 
    `Error code ${errorCode || (children ? String(children).trim() : "404")}`,
    [errorCode, children]
  );

  const textColorClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-white" : "text-primary",
    [isDark, hasBackgroundImage]
  );

  if (children) {
    return (
      <motion.div
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        transition={selectedAnimation.transition}
      >
        <Typography
          variant="h1"
          className={cn(
            "text-center text-7xl sm:text-8xl lg:text-9xl font-bold mb-4 tracking-tight",
            textColorClass,
            className
          )}
          aria-label={ariaLabel}
        >
          {children}
        </Typography>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={selectedAnimation.transition}
    >
      <Typography
        variant="h1"
        className={cn(
          "text-center text-7xl sm:text-8xl lg:text-9xl font-bold mb-4 tracking-tight",
          textColorClass,
          className
        )}
        aria-label={ariaLabel}
      >
        {errorCode || "404"}
      </Typography>
    </motion.div>
  );
});

ErrorPageErrorCode.displayName = "ErrorPageErrorCode";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageHeading Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageHeading: React.FC<ErrorPageHeadingProps> = React.memo(({
  title,
  children,
  className,
}) => {
  const { variant, backgroundImage } = React.useContext(ErrorPageContext);
  const isDark = variant === "dark";
  const hasBackgroundImage = !!backgroundImage;
  const textColorClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-white" : "text-primary",
    [isDark, hasBackgroundImage]
  );

  if (children) {
    return (
      <motion.div variants={itemAnimation}>
        <Typography variant="h2" className={cn("text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-4", textColorClass, className)}>
          {children}
        </Typography>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemAnimation}>
      <Typography variant="h2" className={cn("text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-4", textColorClass, className)}>
      {title || "Page Not Found"}
      </Typography>
    </motion.div>
  );
});

ErrorPageHeading.displayName = "ErrorPageHeading";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageDesc Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageDesc: React.FC<ErrorPageDescProps> = React.memo(({
  description,
  children,
  className,
}) => {
  const { variant, backgroundImage } = React.useContext(ErrorPageContext);
  const isDark = variant === "dark";
  const hasBackgroundImage = !!backgroundImage;
  const textColorClass = React.useMemo(() => 
    isDark || hasBackgroundImage ? "text-white" : "text-muted-foreground",
    [isDark, hasBackgroundImage]
  );

  if (children) {
    return (
      <motion.div variants={itemAnimation}>
        <Typography
          variant="body-large"
          className={cn(
            "text-center mb-8 leading-relaxed",
            textColorClass,
            className
          )}
        >
          {children}
        </Typography>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemAnimation}>
      <Typography variant="body-large" className={cn("text-center mb-8 leading-relaxed", textColorClass, className)}>
        {description}
      </Typography>
    </motion.div>
  );
});

ErrorPageDesc.displayName = "ErrorPageDesc";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageIllustration Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageIllustration: React.FC<ErrorPageIllustrationProps> = React.memo(({
  illustration,
  position: _position = "left",
  children,
  className,
}) => {
  const content = React.useMemo(() => 
    children || renderIllustration(illustration),
    [children, illustration]
  );

  return (
    <motion.div
      className={cn("flex-shrink-0", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
});

ErrorPageIllustration.displayName = "ErrorPageIllustration";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageContent Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageContent: React.FC<ErrorPageClassProps> = React.memo(({
  children,
  className,
}) => {
  return (
    <motion.div className={cn("flex-1 w-full max-w-xl space-y-2 text-center lg:text-left",className)} variants={itemAnimation}>
      {children}
    </motion.div>
  );
});

ErrorPageContent.displayName = "ErrorPageContent";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageSearch Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageSearch: React.FC<ErrorPageSearchProps> = React.memo(({
  showSearch = true,
  searchPlaceholder = "Search for content...",
  onSearch,
  searchButtonText = "Search",
  className,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  const handleSearchSubmit = React.useCallback(() => {
    onSearch?.(searchQuery);
  }, [onSearch, searchQuery]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  if (!showSearch) return null;

  return (
    <motion.div variants={itemAnimation} className={cn("mb-6", className)}>
      <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-border/60 bg-background/90 backdrop-blur-sm shadow-sm focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        {/* Search Icon */}
        <div className="pl-4 pr-2 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-12 px-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
        />
        
        {/* Search Button - Hidden on mobile */}
        <Button
          variant="default"
          size="lg"
          onClick={handleSearchSubmit}
          className="hidden sm:block rounded-l-none h-12 px-6 bg-primary hover:bg-primary/90 text-white font-medium"
        >
          {searchButtonText}
        </Button>
      </div>
    </motion.div>
  );
});

ErrorPageSearch.displayName = "ErrorPageSearch";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageFooter Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageFooter: React.FC<ErrorPageClassProps> = React.memo(({
  children,
  className,
}) => {
  if (!children) return null;

  return (
    <motion.div variants={itemAnimation} className={cn("pt-8 border-t border-border text-center", className)}>
      {children}
    </motion.div>
  );
});

ErrorPageFooter.displayName = "ErrorPageFooter";

// ─────────────────────────────────────────────────────────────────────────────
// ErrorPageLinks Component
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorPageLinks: React.FC<ErrorPageLinksProps> = React.memo(({
  direction = "row",
  children,
  className,
}) => {
  // If children are provided, render them directly (allows passing ButtonWithIcon components)
  if (children) {
    return (
      <motion.div variants={itemAnimation}
        className={cn("flex gap-3",
          direction === "row" ? "flex-row flex-wrap justify-center" : "flex-col",
          className
        )}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            // Clone the child to ensure it has a key
            return React.cloneElement(child, { key: index });
          }
          return child;
        })}
      </motion.div>
    );
  }
});

ErrorPageLinks.displayName = "ErrorPageLinks";