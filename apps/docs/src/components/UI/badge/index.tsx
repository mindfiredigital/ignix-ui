import React from "react";
import { motion, Variants} from "framer-motion";
import { cn } from "../../../utils/cn";

interface BadgeProps {
    text: string;
    type?: "primary" | "secondary" | "success" | "warning" | "error";
    variant?: "pulse" | "bounce" | "tinypop";
    className?: string;
    children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
    text,
    type = "primary",
    className,
    variant = "tinypop",
    children
}) => {
    const types = {
        primary: "bg-blue-500 text-white",
        secondary: "bg-gray-500 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-black",
        error: "bg-red-500 text-white",
    };
    const animationVariants: {'pulse': Variants, 'bounce': Variants, tinypop: Variants} = {
        pulse: {
            initial: {
                scale: 1,
                boxShadow: "0 0 0 0 rgba(255, 0, 0, 0.7)",
              },
              animate: {
                scale: 1.05,
                boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.5)",
                transition: {
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                  duration: 2,
                },
              },

        },
        bounce: {
            initial: { y: -50, opacity: 0 },
            animate: {
                y: [ -50, 0, -25,  0, -10, 0, -2, 0 ], 
                opacity: 1,
                transition: {
                    duration: 1.2,
                    ease: "easeInOut",
                },
            },
        },
        tinypop: {
            initial: { scale: 1 },
            animate: { scale: 1.2,
                transition:{ duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "loop",
                 }
             },           
        }
    };

    return (
        <div className="relative inline-flex items-center">
            {children}
            <motion.div
            variants={animationVariants[variant]}
                initial="initial"
                animate="animate"
                className={cn(
                    "absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs",
                    types[type],
                    className
                )}>
            {text}
        </motion.div>
        </div>
        
    );
};
Badge.displayName = "Badge"; // For better debugging and ref forwarding
export {Badge};