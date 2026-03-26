import React, { ReactNode, useState, useEffect } from "react";

type BreakpointType = "mobile" | "tablet" | "desktop";

type BreakpointProps = {
  show?: BreakpointType;
  hide?: BreakpointType;
  from?: BreakpointType;
  to?: BreakpointType;
  children: ReactNode;
};

const breakpointValues: Record<
  BreakpointType,
  { min: number; max: number }
> = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: Infinity },
};

function useBreakpoint(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export const Breakpoint: React.FC<BreakpointProps> = ({
  show,
  hide,
  from,
  to,
  children,
}) => {
  let query = "";

  if (show) {
    const { min, max } = breakpointValues[show];
    query =
      max === Infinity
        ? `(min-width: ${min}px)`
        : `(min-width: ${min}px) and (max-width: ${max}px)`;
  } else if (hide) {
    const { min, max } = breakpointValues[hide];
    query =
      max === Infinity
        ? `not (min-width: ${min}px)`
        : `not (min-width: ${min}px) and (max-width: ${max}px)`;
  } else if (from && to) {
    const min = breakpointValues[from].min;
    const max = breakpointValues[to].max;

    query =
      max === Infinity
        ? `(min-width: ${min}px)`
        : `(min-width: ${min}px) and (max-width: ${max}px)`;
  } else if (from) {
    const min = breakpointValues[from].min;
    query = `(min-width: ${min}px)`;
  } else if (to) {
    const max = breakpointValues[to].max;
    query = `(max-width: ${max}px)`;
  }
  const matches = useBreakpoint(query);

  return matches ? <>{children}</> : null;
};