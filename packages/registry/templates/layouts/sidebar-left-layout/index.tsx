import * as React from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Menu, X } from "lucide-react";
import { SidebarProvider, useSidebar } from "@ignix-ui/sidebar";
import { cn } from "../../../utils/cn";

 /** -------------------------------- Interfaces -------------------------------- */
export interface SideBarLeftLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
 
  sidebarCollapsedWidth?: number;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  variant?: VariantProps<typeof LayoutVariants>["variant"];
  animation?: "none" | "slide" | "fade" | "scale" | "bounce";
  sidebarWidth?: "default" | "compact" | "wide" | "expanded";
  mobileBreakpoint?: "sm" | "md" | "lg";
  enableGestures?: boolean;
  overlay?: boolean;
  transitionDuration?: number;
  sidebarCollapsed?: boolean;
  sidebarPosition?: "left" | "right";
  onSidebarToggle?: (isOpen: boolean) => void;
 
  headerHeight?: number;
  footerHeight?: number;
  contentPadding?: string;
 
  zIndex?: {
    header?: number;
    sidebar?: number;
    footer?: number;
    overlay?: number;
  };
 
  className?: string;
}
 
/** -------------------------------- Variants -------------------------------- */
const LayoutVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      dark: "bg-card text-card-foreground",
      light: "bg-white text-gray-900 border-r",
      glass: "bg-white/10 backdrop-blur-lg text-foreground",
      gradient:
        "bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground",
    },
    sidebarPosition: {
      left: "",
      right: "",
    },
  },
  defaultVariants: {
    variant: "default",
    sidebarPosition: "left",
 
  },
});
 
/** -------------------------------- Main Content -------------------------------- */
const SideBarLeftLayoutContent: React.FC<SideBarLeftLayoutProps> = ({
  header,
  sidebar,
  footer,
  children,
  sidebarWidth = "default",
  sidebarCollapsedWidth = 80,
  className,
  stickyFooter = false,
  variant = "default",
  mobileBreakpoint = "md",
  enableGestures = true,
  overlay = true,
  transitionDuration = 0.3,
  sidebarCollapsed = false,
  sidebarPosition = "left",
  onSidebarToggle,
  headerHeight = 64,
  footerHeight = 64,
  zIndex = { header: 10, sidebar: 90, footer: 50, overlay: 80 },
}) => {
  const { isOpen, setIsOpen } = useSidebar();
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Map user-friendly widths to pixel values
  const sidebarWidths: Record<string, number> = {
    compact: 250,
    default: 270,
    wide: 320,
    expanded: 380,
  };
  
  const sidebarWidthPx = sidebarWidths[sidebarWidth] ?? sidebarWidths.default;
  // responsive breakpoint
  const bp = React.useMemo(() => {
    switch (mobileBreakpoint) {
      case "sm": return 640;
      case "md": return 768;
      case "lg": return 1024;
      default: return 768;
    }
  }, [mobileBreakpoint]);
 
  React.useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < bp;
      setIsMobile(mobile);
      setIsOpen(mobile ? false : !sidebarCollapsed);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [bp, sidebarCollapsed, setIsOpen]);
 
  React.useEffect(() => {
    onSidebarToggle?.(isOpen);
  }, [isOpen, onSidebarToggle]);
 
  const sidebarOnLeft = sidebarPosition === "left";

  const toggleSidebar = React.useCallback(
    (open?: boolean) => {
      const next = open !== undefined ? open : !isOpen;
      setIsOpen(next);
    },
    [isOpen, setIsOpen]
  );
 
  // Gesture handling for mobile
  const handleDragEnd = (_: Event, info: PanInfo) => {
    if (!enableGestures || !isMobile) return;
    const threshold = 60;
    const vx = info.velocity.x;
    const dx = info.offset.x;
    const shouldClose = dx > threshold || vx > 300;
    const shouldOpen = dx < -threshold || vx < -300;
    if (isOpen && shouldClose) toggleSidebar(false);
    else if (!isOpen && shouldOpen) toggleSidebar(true);
  };
 
  const rootStyle = React.useMemo<React.CSSProperties>(() => ({
    ["--header-h" as string]: `${headerHeight}px`,
    ["--footer-h" as string]: `${footerHeight}px`,
    ["--sidebar-w" as string]: `${sidebarWidthPx}px`,
    ["--sidebar-w-collapsed" as string]: `${sidebarCollapsedWidth}px`,
  }), [headerHeight, footerHeight, sidebarWidthPx, sidebarCollapsedWidth]);

  return (
    <div
      className={cn(
        LayoutVariants({ variant }),
        className
      )}
      style={rootStyle}
    >
      {/* Header */}
      {header && (
        <header
          className={cn(LayoutVariants({ variant }), "inset-x-0 top-0",`[h:var(--header-h)]`,
            zIndex.header && `z-[${zIndex.header}]`)}
        >
          {header}
        </header>
      )}
 
      {/* Main area */}
      <main
        className={cn(
          "relative flex flex-1 transition-all duration-300 ease-in-out p-4 md:p-0 md:pl-6",
          "max-h-[calc(100dvh-var(--header-h)-var(--footer-h))]",
          !isMobile && "h-[calc(100dvh-var(--header-h)-var(--footer-h))]",
          `z-[${zIndex.header}]`
        )}
      >
        {/* Sidebar */}
        {sidebar && !isMobile && (
          <motion.aside
            onPanEnd={handleDragEnd}
            className={cn(
              "shrink-0",
              "h-[calc(100dvh-var(--header-h)-var(--footer-h))]",
              `z-[${zIndex.sidebar}]`,
              isOpen
                ? "w-[var(--sidebar-w)]"
                : "w-[var(--sidebar-w-collapsed)]"
            )}
            animate={{ width: isOpen ? sidebarWidthPx : sidebarCollapsedWidth }}
            transition={{ duration: transitionDuration }}
          >
            {sidebar}
          </motion.aside>
        )}
        
        {/* Main content — grows automatically */}
       <motion.div
        className={cn("flex flex-col flex-1 overflow-y-auto transition-[margin-left] ease-in-out duration-300 ")}
        animate={{
          marginLeft:
            !isMobile && sidebarOnLeft
              ? (sidebarCollapsed ? sidebarCollapsedWidth : 0)
              : 0,
        }}
        transition={{ duration: transitionDuration }}
      >
        {children}
      </motion.div>
      </main>
 
     {sidebar && isMobile && (
        <>
          <AnimatePresence>
            {overlay && (
              <motion.div
              className={cn(
                "fixed inset-0 bg-black/50",
                isOpen ? "pointer-events-auto" : "pointer-events-none",
                `z-[${zIndex.overlay}]`
              )}
              initial={{ opacity: 0, pointerEvents: 'none' }}
              animate={{
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'auto' : 'none'
              }}
              exit={{ opacity: 0, pointerEvents: 'none' }}
              transition={{ duration: transitionDuration }}
              onClick={() => toggleSidebar(false)}
              />
            )}
          </AnimatePresence>
 
          <motion.aside
            className={cn(
              "fixed inset-y-0 left-0",
              `z-[${(zIndex.sidebar ?? 90) + 10}]`
            )}
            initial={{
              x: sidebarOnLeft ? -sidebarWidth : sidebarWidth
            }}
            animate={{
              x: isOpen ? 0 : (sidebarOnLeft ? -sidebarWidth : sidebarWidth),
            }}
            exit={{
              x: sidebarOnLeft ? -sidebarWidth : sidebarWidth
            }}
            transition={{ duration: transitionDuration, ease: "easeInOut" }}
            drag={enableGestures ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {sidebar}
          </motion.aside>
 
          <button
            className={cn(
              "fixed z-[999] p-2 rounded-lg bg-background shadow-lg top-4",
              sidebarOnLeft && "left-4",
              isOpen && "left-55"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X className="w-6 h-6 left-64" /> : <Menu className="w-6 h-6" />}
          </button>
        </>
      )}
  
      {/* Footer */}
      {footer && (
        <footer
          className={cn(
            stickyFooter ? "fixed inset-x-0 bottom-0" : "w-full",
            `[h:var(--footer-h)]`,
            `z-[${zIndex.footer}]`
          )}
        >
          {footer}
        </footer>
      )}
    </div>
  );
};
 
/** -------------------------------- SidebarLeftLayout -------------------------------- */
export const SideBarLeftLayout: React.FC<SideBarLeftLayoutProps> = (props) => {
  return (
    <SidebarProvider initialOpen={!props.sidebarCollapsed}>
      <SideBarLeftLayoutContent {...props} />
    </SidebarProvider>
  );
};
 
SideBarLeftLayout.displayName = "SideBarLeftLayout";