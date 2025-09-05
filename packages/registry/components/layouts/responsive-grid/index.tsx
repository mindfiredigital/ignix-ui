import React, { ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Columns = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

type Gap = "small" | "normal" | "large" | string;

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: Columns;
  gap?: Gap;
  minItemWidth?: string;
  equalHeight?: boolean;
  animation?: "none" | "fade" | "stagger" | "scale";
  className?: string;
}

const gapMap: Record<"small" | "normal" | "large", string> = {
  small: "0.5rem",
  normal: "1rem",
  large: "2rem",
};

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  gap = "normal",
  minItemWidth = "0px",
  equalHeight = false,
  animation = "none",
  className = "",
}) => {
  const computedGap = gapMap[gap as keyof typeof gapMap] || gap;

  const baseClass = "responsive-grid";

  const style: CSSProperties = {
    display: "grid",
    gap: computedGap,
    alignItems: equalHeight ? "stretch" : "start",
  };

  // Create a unique class so multiple grids don’t clash
  const uniqueClass = `${baseClass}-${Math.random().toString(36).substring(2, 9)}`;

  // Build CSS for responsive breakpoints
  const gridStyles = `
    .${uniqueClass} {
      grid-template-columns: repeat(${columns.mobile ?? 1}, minmax(${minItemWidth}, 1fr));
    }
    @media (min-width: 640px) {
      .${uniqueClass} {
        grid-template-columns: repeat(${columns.tablet ?? columns.mobile ?? 1}, minmax(${minItemWidth}, 1fr));
      }
    }
    @media (min-width: 1024px) {
      .${uniqueClass} {
        grid-template-columns: repeat(${columns.desktop ?? columns.tablet ?? columns.mobile ?? 1}, minmax(${minItemWidth}, 1fr));
      }
    }
  `;

  const variants = {
    hidden: { opacity: 0, scale: animation === "scale" ? 0.9 : 1 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <style>{gridStyles}</style>
      <div
        key={`${gap}-${animation}-${equalHeight}-${columns.mobile}-${columns.tablet}-${columns.desktop}`}
        style={style}
        className={`${baseClass} ${uniqueClass} ${className}`}
      >
        <AnimatePresence>
          {React.Children.map(children, (child: any, index: number) => {
            if (animation === "none") return child;

            return (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants}
                transition={{
                  duration: 0.3,
                  delay: animation === "stagger" ? index * 0.1 : 0,
                }}
              >
                {child}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </>
  );
};

export default ResponsiveGrid;
