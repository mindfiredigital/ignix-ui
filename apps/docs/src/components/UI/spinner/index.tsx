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
  color = "border-gray-500",
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
    const gap = dotSize * 1.5;

    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ gap: `${gap}px` }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: color,
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
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
