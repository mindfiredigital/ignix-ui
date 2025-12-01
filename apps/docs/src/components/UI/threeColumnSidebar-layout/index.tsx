import * as React from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { SidebarProvider, useSidebar } from "../threeColumnSidebar";
import { cn } from "@site/src/utils/cn";
import { Menu, X } from "lucide-react";

export interface ThreeColumnSidebarLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  sidebarLeftPosition?: 'left';
  sidebarRightPosition?: 'right';
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;

  stickyHeader?: boolean;
  stickyFooter?: boolean;

  variant?: VariantProps<typeof ThreeColumnSidebarLayoutVariants>["variant"];
  mobileBreakpoint?: "sm" | "md" | "lg";
  sidebarLayoutMode?: "OVERLAY_ONLY" | "BOTTOM_DOCKED"| "OVERLAY_WITH_PANE";
  sidebarCollapsed?: boolean;
  rightSidebarCollapsed?: boolean;
  overlay?: boolean;
  enableGestures?: boolean;

  transitionDuration?: number;
  headerHeight?: number;
  footerHeight?: number;

  zIndex?: {
    header?: number;
    sidebar?: number;
    footer?: number;
    overlay?: number; 
  };

  className?: string;
  theme?:
    | "light"
    | "dark"
    | "corporate"
    | "custom"
    | "glass"
    | "modern"
    | "ocean"
    | "forest"
    | "solarized";
}

const ThreeColumnSidebarLayoutVariants = cva("w-full", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      dark: "bg-card text-card-foreground",
      light: "bg-white text-gray-900",
      glass: "bg-white/10 backdrop-blur-lg",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-400 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const ThreeColumnSidebarLayoutContent: React.FC<ThreeColumnSidebarLayoutProps> = ({
  header,
  sidebar,
  rightSidebar,
  children,
  footer,

  sidebarWidth = 200,
  sidebarCollapsedWidth = 60,

  stickyFooter = false,
  stickyHeader = false,

  variant = "default",
  mobileBreakpoint = "md",
  sidebarLayoutMode='BOTTOM_DOCKED',

  sidebarCollapsed = false,
  rightSidebarCollapsed = false,

  headerHeight = 64,
  footerHeight = 64,
  enableGestures = true,
  overlay = true,
  transitionDuration = 0.3,

  zIndex = { header: 50, sidebar: 40, footer: 30 , overlay: 80},
  className,
  theme = "forest",
}) => {

  const { isOpen: leftOpen, setOpen: setLeftOpen } = useSidebar("left");
  const { isOpen: rightOpen, setOpen: setIsRightOpen } = useSidebar("right");

  const [isMobile, setIsMobile] = React.useState(false);

  const bp = mobileBreakpoint === "sm" ? 640 : mobileBreakpoint === "md" ? 768 : 1024;

  React.useEffect(() => {
  const check = () => {
    const mobile = window.innerWidth < bp
    setIsMobile(mobile)

    if (!mobile) {
      setLeftOpen(!sidebarCollapsed)
      setIsRightOpen(!rightSidebarCollapsed)
    } else {
      setLeftOpen(false)
    }
  }

  check()
  window.addEventListener("resize", check)
  return () => window.removeEventListener("resize", check)
  }, [bp, sidebarCollapsed, rightSidebarCollapsed])

  const layoutStyle: React.CSSProperties = {
    ["--header-h" as any]: `${headerHeight}px`,
    ["--footer-h" as any]: `${footerHeight}px`,
    ["--sidebar-w" as any]: `${sidebarWidth}px`,
    ["--sidebar-collapsed-w" as any]: `${sidebarCollapsedWidth}px`,
  };

  const gridCols = (() => {
    // MOBILE
    if (isMobile) {
      return "grid-cols-1";
    }

    // DESKTOP
    if (sidebar && rightSidebar) return "grid-cols-[auto_1fr_auto]";
    if (sidebar) return "grid-cols-[auto_1fr]";
    if (rightSidebar) return "grid-cols-[1fr_auto]";
    return "grid-cols-1";
  })();

    const toggleSidebar = React.useCallback((open?: boolean) => {

  const next = open !== undefined ? open : !leftOpen;

    setLeftOpen(next);

  }, [leftOpen, setLeftOpen]);



  // gesture support for mobile overlay sidebar

  const handleDragEnd = (_: Event, info: PanInfo) => {
    if (!enableGestures || !isMobile) return;
    const threshold = 60;
    const vx = info.velocity.x;
    const dx = info.offset.x;
    const shouldClose = dx > threshold || vx > 300;
    const shouldOpen = dx < -threshold || vx < -300;
    if (leftOpen && shouldClose) toggleSidebar(false);
    else if (!leftOpen && shouldOpen) toggleSidebar(true);
  };

  return (
    <div
      className={cn(ThreeColumnSidebarLayoutVariants({ variant }), className,{
      "bg-gray-200 !text-gray-800": theme === "light",
      "bg-gray-300 !text-gray-700": theme === "corporate",
      "bg-gray-700 !text-gray-200": theme === "dark",
      "bg-white/60 !text-gray-700": theme === "glass",
      "bg-gray-700/80 !text-gray-200": theme === "modern",
      "bg-teal-600/80 !text-gray-200": theme === "ocean",
      "bg-green-700/80 !text-gray-200": theme === "forest",
      "bg-[#e0dab5] !text-gray-700": theme === "solarized",
    })}
      style={layoutStyle}
    >
      {/* HEADER */}
      {header && (
        <header
          className={cn(
            "w-full top-0 inset-0",
            stickyHeader ? "sticky" : "relative"
          )}
          style={{ height: headerHeight, zIndex: zIndex.header }}
        >
          {header}
        </header>
      )}

      {/* BODY GRID */}
      <div
        className={cn(
          "grid w-full",gridCols)}
        style={{
          minHeight: `calc(100dvh - ${headerHeight}px - ${footerHeight}px)`,
        }}
      >
        {/* LEFT SIDEBAR */}
        {sidebar && !isMobile && bp !== 640 && (
          <motion.aside
            className={cn("sticky top-[var(--header-h)] overflow-hidden")}
            style={{
              height: `calc(100dvh - ${headerHeight}px - ${footerHeight}px)`,
              zIndex: zIndex.sidebar,
            }}
            initial={false}
            animate={{
              width: leftOpen && !sidebarCollapsed ? sidebarWidth : sidebarCollapsedWidth
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div
              className={cn(
                "h-full",
                {
                  "bg-gray-200 text-gray-800": theme === "light",
                  "bg-gray-300 text-gray-700": theme === "corporate",
                  "bg-gray-700 text-gray-200": theme === "dark",
                  "bg-white/60 text-gray-700": theme === "glass",
                  "bg-gray-700/80 text-gray-200": theme === "modern",
                  "bg-teal-600/80 text-gray-200": theme === "ocean",
                  "bg-green-700/80 text-gray-200": theme === "forest",
                  "bg-[#e0dab5] text-gray-700": theme === "solarized",
                }
              )}
            >
              {sidebar}
            </div>
          </motion.aside>
        )}

        {/** MAIN SECTION */}
        <main
          className="scrollbar-hidden overflow-y-auto"
          style={{
            height: `calc(100dvh - ${headerHeight}px - ${footerHeight}px)`
          }}
        >
          {children}
        </main>

        {/* RIGHT SIDEBAR */}
        {rightSidebar && !isMobile && bp !== 640 && (
          <motion.aside
            className="sticky top-[var(--header-h)] overflow-y-auto"
            style={{
              height: `calc(100dvh - ${headerHeight}px - ${footerHeight}px)`,
              zIndex: zIndex.sidebar,
            }}
            initial={false}
            animate={{
              width:
                rightOpen && !rightSidebarCollapsed ? sidebarWidth : sidebarCollapsedWidth
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div
            className={cn(
              "h-full",
              {
                "bg-gray-200 text-gray-800": theme === "light",
                "bg-gray-300 text-gray-700": theme === "corporate",
                "bg-gray-700 text-gray-200": theme === "dark",
                "bg-white/60 text-gray-700": theme === "glass",
                "bg-gray-700/80 text-gray-200": theme === "modern",
                "bg-teal-600/80 text-gray-200": theme === "ocean",
                "bg-green-700/80 text-gray-200": theme === "forest",
                "bg-[#e0dab5] text-gray-700": theme === "solarized",
              }
            )}
          >
            {rightSidebar}
          </div>
          </motion.aside>
        )}

      </div>

      {/* SIDE BAR IN MOBILE */}
      {(isMobile || bp === 640) && sidebarLayoutMode !=='OVERLAY_ONLY' && (
        <div
          className="sticky left-0 w-full bottom-0"
        >
         {sidebarLayoutMode === 'BOTTOM_DOCKED' ? sidebar : rightSidebar }
        </div>
      )}

      {/* Mobile off-canvas sidebar + overlay */}
      {sidebar && isMobile && (sidebarLayoutMode === 'OVERLAY_ONLY' ||  sidebarLayoutMode === 'OVERLAY_WITH_PANE') && (
        <>
          <AnimatePresence>
            {overlay && (
              <motion.div
                className="fixed inset-0 bg-black/50"
                style={{ zIndex: zIndex.overlay, pointerEvents: leftOpen ? 'auto' : 'none' }}
                initial={{ opacity: 0, pointerEvents: 'none' }}
                animate={{ 
                  opacity: leftOpen ? 1 : 0,
                  pointerEvents: leftOpen ? 'auto' : 'none'
                }}
                exit={{ opacity: 0, pointerEvents: 'none' }}
                transition={{ duration: transitionDuration }}
                onClick={() => toggleSidebar(false)}
              />
            )}
          </AnimatePresence>

          <motion.aside
            className={cn(
              "fixed inset-y-0 w-[var(--sidebar-w)]",
              sidebar && "left-0" ,
              {
                "bg-gray-200 text-gray-800": theme === "light",
                "bg-gray-300 text-gray-700": theme === "corporate",
                "bg-gray-700 text-gray-200": theme === "dark",
                "bg-white/60 text-gray-700": theme === "glass",
                "bg-gray-700/80 text-gray-200": theme === "modern",
                "bg-teal-600/80 text-gray-200": theme === "ocean",
                "bg-green-700/80 text-gray-200": theme === "forest",
                "bg-[#e0dab5] text-gray-700": theme === "solarized",
              }
            )}
            style={{
              zIndex: (zIndex.sidebar ?? 90) + 10,
            }}
            initial={{
              x: sidebar ? -sidebarWidth : sidebarWidth
            }}
            animate={{
              x: leftOpen ? 0 : (sidebar ? -sidebarWidth : sidebarWidth),
            }}
            exit={{
              x: sidebar ? -sidebarWidth : sidebarWidth
            }}
            transition={{ duration: transitionDuration, ease: "easeInOut" }}
            drag={enableGestures ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {sidebar}
          </motion.aside>

          {/* Mobile toggle button */}
          <button
            className={cn(
              "fixed z-999 p-2 rounded-lg bg-background shadow-lg top-4",
              sidebar && "left-4",
            )}
            onClick={() => setLeftOpen(!leftOpen)}
            aria-label={leftOpen ? "Close sidebar" : "Open sidebar"}
          >

            {leftOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}

          </button>

        </>

      )}

      {/* FOOTER */}
      {footer && !isMobile && bp !== 640 && (sidebarLayoutMode === 'OVERLAY_ONLY' || !isMobile )&& (
        <footer
          className={cn(
            stickyFooter ? "sticky bottom-0" : "relative",
            "w-full"
          )}
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

export const ThreeColumnSidebarLayout: React.FC<ThreeColumnSidebarLayoutProps> = (
  props
) => {
  return (
    <SidebarProvider initialState={{left: !props.sidebarCollapsed, right: !props.rightSidebarCollapsed,  bottomLeft: true, bottomRight: false}}>
      <ThreeColumnSidebarLayoutContent {...props} />
    </SidebarProvider>
  );
};

ThreeColumnSidebarLayout.displayName = "ThreeColumnSidebarLayout";
