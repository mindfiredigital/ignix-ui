import React, { useEffect, useRef, useState } from "react";

export interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  threshold?: string; // e.g. "100px"
  placeholder?: React.ReactNode;
  once?: boolean;
  animation?: "fade" | "slide" | "none";
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  className,
  threshold = "0px",
  placeholder = null,
  once = true,
  animation = "none",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.disconnect(); // unobserve after first load
            }
          } else if (!once) {
            setIsVisible(false); // re-hide if once=false
          }
        });
      },
      { rootMargin: threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, once]);

  // Animation classes
  const animationClass =
    animation === "fade"
      ? "transition-opacity duration-700 ease-in-out opacity-0 data-[visible=true]:opacity-100"
      : animation === "slide"
      ? "transition-transform duration-700 ease-in-out translate-y-4 opacity-0 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
      : "";

  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${animationClass}`}
      data-visible={isVisible}
    >
      {isVisible ? children : placeholder}
    </div>
  );
};
