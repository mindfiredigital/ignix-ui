import * as React from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Menu, X } from "lucide-react";
import { cn } from "../../../../utils/cn";
import { SidebarProvider, useSidebar } from "../../../components/sidebar";
 
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
  sidebarPosition = "right",
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
  const bp =
    mobileBreakpoint === "sm"
      ? 640
      : mobileBreakpoint === "md"
      ? 768
      : 1024;
 
 
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
 
  const sidebarOnRight = sidebarPosition === "right";
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
 
  const rootStyle: React.CSSProperties = {
    ["--header-h" as string]: `${headerHeight}px`,
    ["--footer-h" as string]: `${footerHeight}px`,
    ["--sidebar-w" as string]: `${sidebarWidthPx}px`,
    ["--sidebar-w-collapsed" as string]: `${sidebarCollapsedWidth}px`,
  };
 
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
          className={cn(LayoutVariants({ variant }), "inset-x-0 top-0")}
          style={{
            height: headerHeight,
            zIndex: zIndex.header,
            position: "sticky",
          }}
        >
          {header}
        </header>
      )}
 
      {/* Main area */}
      <main
         className={cn(
        "relative flex flex-1 transition-all duration-300 ease-in-out")}
        style={{
          height: isMobile
            ? "auto"
            : `calc(100dvh - var(--header-h) - var(--footer-h))`,
            zIndex: zIndex.header
        }}
      >
        {/* Sidebar */}
      
        {/* Main content — grows automatically */}
       <motion.div
        className={cn("flex flex-col flex-1 overflow-y-auto")}
        animate={{
          marginRight:
            !isMobile && sidebarOnRight
              ? (sidebarCollapsed ? sidebarCollapsedWidth : 0)
              : 0,
        }}
        transition={{ duration: transitionDuration }}
        style={{
          transition: `margin-right ${transitionDuration}s ease-in-out`,
        }}
      >
        {children}
      </motion.div>
        {sidebar && !isMobile &&
          <motion.aside
          onPanEnd={handleDragEnd}
          className={cn(
            mobileBreakpoint === "sm" ? "w-20" : "w-64"
          )}
          animate={{ width: isOpen ? sidebarWidthPx: sidebarCollapsedWidth }}
          transition={{ duration: transitionDuration }}
          style={{
              zIndex: zIndex.sidebar,
              flexShrink: 0,
              height: `calc(100dvh - var(--header-h) - var(--footer-h))`,
          }}
          >
          {sidebar}
          </motion.aside>
        }
 
      </main>
 
     {sidebar && isMobile && (
        <>
          <AnimatePresence>
            {overlay && (
              <motion.div
                className="fixed inset-0 bg-black/50"
                style={{ zIndex: zIndex.overlay, pointerEvents: isOpen ? 'auto' : 'none' }}
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
              "fixed inset-y-0",
              sidebarOnRight && "right-0" ,
            )}
            style={{
              zIndex: (zIndex.sidebar ?? 90) + 10,
            }}
            initial={{
              x: sidebarOnRight ? -sidebarWidth : sidebarWidth
            }}
            animate={{
              x: isOpen ? 0 : (sidebarOnRight ? -sidebarWidth : sidebarWidth),
            }}
            exit={{
              x: sidebarOnRight ? -sidebarWidth : sidebarWidth
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
              "fixed z-[999] p-2 rounded-lg bg-background shadow-lg top-4 ml-2",
              sidebarOnRight && "right-4",
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </>
      )}
  
      {/* Footer */}
      {footer && (
        <footer
          className={cn(stickyFooter ? "fixed inset-x-0 bottom-0" : "w-full")}
          style={{
            height: footerHeight,
            zIndex: zIndex.footer,
          }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
};
 
export const SideBarRightLayout: React.FC<SideBarLeftLayoutProps> = (props) => {
  return (
    <SidebarProvider initialOpen={!props.sidebarCollapsed}>
      <SideBarLeftLayoutContent {...props} />
    </SidebarProvider>
  );
};
 
SideBarRightLayout.displayName = "SideBarRightLayout";