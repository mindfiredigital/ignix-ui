import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

type SpinnerProps = {
  size?: number;
  color?: string;
  thickness?: number;
  variant?: "default" | "bars" | "dots-bounce";
  className?: string;
};

export const Spinner = ({
  size = 40,
  color = "primary",
  thickness = 4,
  variant = "default",
  className = "",
}: SpinnerProps) => {
  if (variant === "bars") {
    const bars = Array.from({ length: 8 });

    return (
      <div
        className={cn("relative", className)}
        style={{ width: size, height: size }}
      >
        {bars.map((_, i) => {
          const angle = (360 / bars.length) * i;
          const delay = i * 0.1;

          return (
            <motion.div
              key={i}
              className={cn(
                "absolute top-1/2 left-1/2 w-[10%] h-[30%] rounded-md",
                color
              )}
              style={{
                transform: `rotate(${angle}deg) translateY(-140%)`, // increased from -50% to -140%
                transformOrigin: "center",
              }}
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
                delay,
              }}
            />
          );
        })}
      </div>
    );
  }
  
  if (variant === "dots-bounce") {
    const dotSize = thickness;
    const gap = dotSize * 1.8;
    const dots = Array.from({ length: 5 }); // increased from 4 to 5

    return (
      <div
        className={cn("flex items-center justify-center relative", className)}
        style={{ gap: `${gap}px` }}
      >
        {/* Premium background glow */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `radial-gradient(ellipse, ${color} 0%, transparent 60%)`,
              filter: "blur(12px)",
              width: `${(dotSize * dots.length) + (gap * (dots.length - 1)) + 20}px`,
              height: `${dotSize + 20}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 0.8 * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

        {dots.map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full shadow-lg backdrop-blur-sm",
              color.startsWith('bg-') 
                ? color 
                : `bg-primary text-primary`
            )}
            style={{
              width: dotSize,
              height: dotSize,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}
            animate={{
              scale: [0.6, 1.4, 0.6],
              opacity: [0.4, 1, 0.4],
              y: [0, -dotSize * 1.5, 0],
              filter: [
                "brightness(0.8)",
                "brightness(1.3)",
                "brightness(0.8)"
              ]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: [0.68, -0.55, 0.265, 1.55], // Custom bounce easing
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        color,
        "border-t-transparent border-solid",
        className
      )}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
      }}
    />
  );
};
