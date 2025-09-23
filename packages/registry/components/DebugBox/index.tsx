import React, { useState, useEffect, useRef } from "react";

type DebugBoxProps = {
    children: React.ReactNode;
    defaultShowGrid?: boolean;
    defaultShowSpacing?: boolean;
    defaultShowBreakpoints?: boolean;
    defaultShowDimensions?: boolean;
};

const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

export const DebugBox: React.FC<DebugBoxProps> = ({
    children,
    defaultShowGrid = true,
    defaultShowSpacing = true,
    defaultShowBreakpoints = true,
    defaultShowDimensions = true,
}) => {
    if (process.env.NODE_ENV === "production") {
        return <>{children}</>; // Production me sirf children
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("");

    // Overlay state toggles
    const [showGrid, setShowGrid] = useState(defaultShowGrid);
    const [showSpacing, setShowSpacing] = useState(defaultShowSpacing);
    const [showBreakpoints, setShowBreakpoints] = useState(defaultShowBreakpoints);
    const [showDimensions, setShowDimensions] = useState(defaultShowDimensions);

    // Detect current breakpoint
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < breakpoints.sm) setCurrentBreakpoint("xs");
            else if (width < breakpoints.md) setCurrentBreakpoint("sm");
            else if (width < breakpoints.lg) setCurrentBreakpoint("md");
            else if (width < breakpoints.xl) setCurrentBreakpoint("lg");
            else setCurrentBreakpoint("xl");
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Track component dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return (
        <div style={{ position: "relative" }} ref={containerRef}>
            {children}

            {/* Grid Overlay */}
            {showGrid && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        backgroundSize: "40px 40px",
                        backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
                    }}
                />
            )}

            {/* Spacing Overlay */}
            {showSpacing && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        border: "3px dashed rgba(255, 99, 71, 0.5)",
                        borderRadius: "4px",
                    }}
                />
            )}

            {/* Breakpoint Badge */}
            {showBreakpoints && (
                <div
                    style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        padding: "4px 8px",
                        background: "rgba(25, 118, 210, 0.8)",
                        color: "#fff",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                    }}
                >
                    {currentBreakpoint.toUpperCase()}
                </div>
            )}

            {/* Dimensions Badge */}
            {showDimensions && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        padding: "4px 8px",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                    }}
                >
                    {dimensions.width}px × {dimensions.height}px
                </div>
            )}

            {/* Toggle Panel */}
            <div
                style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(0,0,0,0.6)",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    fontSize: "12px",
                    color: "#fff",
                    pointerEvents: "auto",
                }}
            >
                <label>
                    <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={() => setShowGrid(!showGrid)}
                    />{" "}
                    Grid
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showSpacing}
                        onChange={() => setShowSpacing(!showSpacing)}
                    />{" "}
                    Spacing
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showBreakpoints}
                        onChange={() => setShowBreakpoints(!showBreakpoints)}
                    />{" "}
                    Breakpoints
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showDimensions}
                        onChange={() => setShowDimensions(!showDimensions)}
                    />{" "}
                    Dimensions
                </label>
            </div>
        </div>
    );
};
