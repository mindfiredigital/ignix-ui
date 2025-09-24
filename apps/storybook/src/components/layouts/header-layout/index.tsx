import * as React from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../../utils/cn";
import { Menu, X } from "lucide-react";
import { SidebarProvider, useSidebar } from "../../sidebar";

export interface HeaderLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;

  // layout + behavior
  sidebarWidth?: number; // px
  sidebarCollapsedWidth?: number; // px
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  variant?: VariantProps<typeof headerLayoutVariants>["variant"];
  animation?: "none" | "slide" | "fade" | "scale" | "bounce";
  sidebarPosition?: "left" | "right";
  mobileBreakpoint?: "sm" | "md" | "lg";
  enableGestures?: boolean;
  overlay?: boolean;
  transitionDuration?: number;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (isOpen: boolean) => void;

  // sizing via CSS vars (pixels)
  headerHeight?: number;
  footerHeight?: number;

  // spacing
  contentPadding?: string;

  zIndex?: {
    header?: number;
    sidebar?: number;
    footer?: number;
    overlay?: number;
  };

  className?: string;
}


const headerLayoutVariants = cva("min-h-screen", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      dark: "bg-card text-card-foreground",
      light: "bg-white text-gray-900 border-r",
      glass: "bg-white/10 backdrop-blur-lg text-foreground",
      gradient: "bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground",
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

const HeaderLayoutContent: React.FC<HeaderLayoutProps> = ({
  header,
  sidebar,
  footer,
  children,
  sidebarWidth = 250,
  sidebarCollapsedWidth = 64,
  className,
  stickyFooter = false,
  variant = "default",
  sidebarPosition = "left",
  mobileBreakpoint = "md",
  enableGestures = true,
  overlay = true,
  transitionDuration = 0.3,
  sidebarCollapsed = false,
  onSidebarToggle,
  headerHeight = 64, // px
  footerHeight = 64, // px
  contentPadding = "p-4 lg:p-6",
  zIndex = { header: 100, sidebar: 90, footer: 50, overlay: 80 },
}) => {
  const { isOpen, setIsOpen } = useSidebar();
  const [isMobile, setIsMobile] = React.useState(false);

  // breakpoint width
  const bp = mobileBreakpoint === "sm" ? 640 : mobileBreakpoint === "md" ? 768 : 1024;

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

  const toggleSidebar = React.useCallback((open?: boolean) => {
    const next = open !== undefined ? open : !isOpen;
    setIsOpen(next);
  }, [isOpen, setIsOpen]);

  // gesture support for mobile overlay sidebar
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

  const sidebarOnLeft = sidebarPosition === "left";
  const sidebarOnRight = sidebarPosition === "right";

  // CSS vars for consistent offsets
  const rootStyle: React.CSSProperties = {
    ["--header-h" as unknown as string]: `${headerHeight}px`,
    ["--footer-h" as unknown as string]: `${footerHeight}px`,
    ["--sidebar-w" as unknown as string]: `${sidebarWidth}px`,
    ["--sidebar-w-collapsed" as unknown as string]: `${sidebarCollapsedWidth}px`,
  };

  return (
    <div
      className={cn(headerLayoutVariants({ variant, sidebarPosition }), className)}
      style={rootStyle}
    >
      {/* Fixed header with reserved space via padding on the main shell */}
      {header && (
        <header
          className="fixed inset-x-0 top-0"
          style={{ height: headerHeight, zIndex: zIndex.header }}
        >
          {header}
        </header>
      )}

      <div
        className={cn(
          "pt-[var(--header-h)]",
          // Desktop grid: sidebar + content
          "md:grid md:min-h-screen",
          sidebar && !sidebarCollapsed ? "md:grid-cols-[auto_1fr]" : "md:grid-cols-1"
        )}
      >
        {/* Desktop sidebar (sticky under header) */}
        {sidebar && !isMobile && (
          <motion.aside
            className={cn(
              "hidden md:block",
              sidebarOnLeft && "order-1",
              sidebarOnRight && "order-2",
              "sticky",
            )}
            style={{
              top: headerHeight,
              height: `calc(100dvh - ${headerHeight}px)`,
              zIndex: zIndex.sidebar,
              width: !sidebarCollapsed ? sidebarWidth : 0,
              marginRight: !sidebarCollapsed && sidebarOnLeft && isOpen ? 0 : 70,
            }}
            initial={false}
            animate={{
              width: !sidebarCollapsed && isOpen ? sidebarWidth : 0,
            }}
            transition={{ duration: transitionDuration }}
          >
            {sidebar}
          </motion.aside>
        )}

        {/* Main content area */}
        <main
          className={cn(
            "min-h-[calc(100dvh-var(--header-h))]",
            contentPadding,
            sidebarOnLeft && "md:order-2",
            sidebarOnRight && "md:order-1"
          )}
          style={{
            paddingBottom: stickyFooter ? footerHeight : undefined,
          }}
        >
          {children}
        </main>
      </div>

      {/* Mobile off-canvas sidebar + overlay */}
      {sidebar && isMobile && (
        <>
          <AnimatePresence>
            {overlay && (
              <motion.div
                className="fixed inset-0"
                style={{ zIndex: zIndex.overlay }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: transitionDuration }}
                onClick={() => toggleSidebar(false)}
              />
            )}
          </AnimatePresence>

          <motion.aside
            className={cn(
              "fixed inset-y-0 w-[var(--sidebar-w)]",
              sidebarOnLeft && "left-0" ,
              sidebarOnRight && "right-0"
            )}
            style={{
              zIndex: (zIndex.sidebar ?? 90) + 10,
            }}
            initial={false}
            animate={{
              x: !sidebarCollapsed ? 0 : (sidebarOnLeft ? -sidebarWidth : sidebarWidth),
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
              "fixed z-[999] p-2 rounded-lg bg-background shadow-lg",
              sidebarOnLeft && "left-4 top-1/2 -translate-y-1/2",
              sidebarOnRight && "right-4 top-1/2 -translate-y-1/2"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </>
      )}

      {/* Footer (sticky or normal) */}
      {footer && (
        <footer
          className={cn(
            stickyFooter ? "fixed inset-x-0 bottom-0" : "w-full",
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

export const HeaderLayout: React.FC<HeaderLayoutProps> = (props) => {
  return (
    <SidebarProvider initialOpen={!props.sidebarCollapsed}>
      <HeaderLayoutContent {...props} />
    </SidebarProvider>
  );
};

HeaderLayout.displayName = "HeaderLayout";
