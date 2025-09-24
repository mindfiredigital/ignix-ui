import React, { useEffect, useState, useRef } from "react";

export interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  threshold?: string;
  placeholder?: React.ReactNode;
  once?: boolean;
  animation?: "fade" | "slide" | "none";
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  className,
  threshold = "100px",
  placeholder = null,
  once = true,
  animation = "fade",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect(); // Stop observing if `once` is true
        }
      },
      { rootMargin: threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [threshold, once]);

  const getAnimationStyle = () => {
    switch (animation) {
      case "fade":
        return { opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease" };
      case "slide":
        return {
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease",
        };
      default:
        return {};
    }
  };

  return (
    <div ref={containerRef} className={className} style={getAnimationStyle()}>
      {isVisible ? children : placeholder}
    </div>
  );
};