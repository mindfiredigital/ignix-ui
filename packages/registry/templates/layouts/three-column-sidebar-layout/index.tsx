import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { SidebarProvider, useSidebar } from "@ignix-ui/threecolumnsidebar";

export interface ThreeColumnLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  mobileSidebar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  sidebarLeftPosition?: 'left';
  sidebarRightPosition?: 'right';
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;

  stickyHeader?: boolean;
  stickyFooter?: boolean;

  variant?: VariantProps<typeof ThreeColumnLayoutVariants>["variant"];
  mobileBreakpoint?: "sm" | "md" | "lg";

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

const ThreeColumnLayoutVariants = cva("w-full", {
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

const ThreeColumnLayoutContent: React.FC<ThreeColumnLayoutProps> = ({
  header,
  sidebar,
  rightSidebar,
  children,
  mobileSidebar,
  footer,

  sidebarWidth = 260,
  sidebarCollapsedWidth = 64,

  stickyFooter = false,
  stickyHeader = false,

  variant = "default",
  mobileBreakpoint = "md",

  sidebarCollapsed = false,
  rightSidebarCollapsed = false,

  headerHeight = 64,
  footerHeight = 64,

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


  return (
    <div
      className={cn(ThreeColumnLayoutVariants({ variant }), className,{
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
        {sidebar && !isMobile && (
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
          className="scrollbar-thin overflow-y-auto"
          style={{
            height: `calc(100dvh - ${headerHeight}px - ${footerHeight}px)`
          }}
        >
          {children}
        </main>

        {/* RIGHT SIDEBAR */}
        {rightSidebar && !isMobile && (
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
      {sidebar && isMobile && (
        <div
          className="sticky left-0 w-full bottom-0"
        >
          {mobileSidebar}
        </div>
      )}

      {/* FOOTER */}
      {footer && !isMobile && (
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

export const ThreeColumnSidebarLayout: React.FC<ThreeColumnLayoutProps> = (
  props
) => {
  return (
    <SidebarProvider initialState={{left: !props.sidebarCollapsed, right: !props.rightSidebarCollapsed,  bottomLeft: true, bottomRight: false}}>
      <ThreeColumnLayoutContent {...props} />
    </SidebarProvider>
  );
};

ThreeColumnSidebarLayout.displayName = "ThreeColumnSidebarLayout";
