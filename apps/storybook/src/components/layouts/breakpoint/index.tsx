import React, { type ReactNode, useEffect, useState } from "react";

type BreakpointProps = {
  show?: "mobile" | "tablet" | "desktop";
  hide?: "mobile" | "tablet" | "desktop";
  from?: "mobile" | "tablet" | "desktop";
  to?: "mobile" | "tablet" | "desktop";
  children: ReactNode;
};

const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
};

function useBreakpoint(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

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
    query = breakpoints[show];
  } else if (hide) {
    query = `not ${breakpoints[hide]}`;
  } else if (from && to) {
    query = `${breakpoints[from]} and ${breakpoints[to]}`;
  } else if (from) {
    query = breakpoints[from];
  } else if (to) {
    query = breakpoints[to];
  }

  const matches = useBreakpoint(query);

  return matches ? <>{children}</> : null;
};