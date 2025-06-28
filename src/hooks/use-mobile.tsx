import { useEffect, useState } from "react";

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS = "mobile") {
  const [isBreakpoint, setIsBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`);
    const onChange = () => setIsBreakpoint(mql.matches);
    mql.addEventListener("change", onChange);
    setIsBreakpoint(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isBreakpoint;
}

export function useIsMobile() {
  return useBreakpoint("mobile");
}

export function useIsTablet() {
  return useBreakpoint("tablet");
}

export function useIsDesktop() {
  return !useBreakpoint("desktop");
}
