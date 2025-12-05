"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { cn } from "../../../utils/cn";

interface AnimatedInputProps {
  placeholder: string;
  variant: string;
  inputClassName?: string;
  labelClassName?: string;
  value: string;
  type?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  icon?: React.ElementType;
  showPasswordToggle?: boolean;
  size?: "sm" | "md" | "lg";
}

interface InputVariant {
  label: Variants;
  input: Variants;
  extra?: Variants;
  container?: Variants;
}

// Enhanced border beam variants with better animations
const borderBeamVariants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.3,
      },
    },
  },
};

// Enhanced particle creation with better physics
const createEnhancedParticles = (container: HTMLElement, count = 8) => {
  const particles: HTMLElement[] = [];
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = cn(
      "absolute rounded-full pointer-events-none",
      "bg-primary",
      "shadow-lg shadow-primary/50"
    );
    
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.boxShadow = `0 0 ${size * 2}px rgba(var(--color-background), 0.6)`;
    
    // Enhanced animation
    particle.style.animation = `particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(particle);
    particles.push(particle);
    
    setTimeout(() => {
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    }, 4000);
  }
  
  return particles;
};

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  placeholder,
  variant,
  inputClassName = "",
  labelClassName = "",
  value,
  onChange,
  type = "text",
  disabled = false,
  error,
  success,
  icon: Icon,
  showPasswordToggle = false,
  size = "md",
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced mouse tracking for premium effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [2, -2]));
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-2, 2]));

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.3);
    mouseY.set((e.clientY - centerY) * 0.3);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? "password" : "text");
  };

  const variants = inputVariants[variant as keyof typeof inputVariants];
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  // Size configurations
  const sizeConfig = {
    sm: { input: "h-9 px-3 text-sm", label: "text-sm", icon: "h-4 w-4" },
    md: { input: "h-11 px-4 text-base", label: "text-base", icon: "h-5 w-5" },
    lg: { input: "h-13 px-5 text-lg", label: "text-lg", icon: "h-6 w-6" }
  };

  // Enhanced particle effects for particleField
  useEffect(() => {
    if (variant === "particleField" && particleRef.current && isActive) {
      const interval = setInterval(() => {
        if (particleRef.current) {
          createEnhancedParticles(particleRef.current, 6);
        }
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [variant, isActive]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative mb-6 group",
        disabled && "opacity-60 cursor-not-allowed"
      )}
      initial="initial"
      animate={isActive ? "animate" : "initial"}
      style={{ 
        perspective: 2000,
        rotateX: variant === "tilt3D" ? rotateX : undefined,
        rotateY: variant === "tilt3D" ? rotateY : undefined
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      variants={variants.container}
    >
      {/* Enhanced Label */}
      <motion.label
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 z-10 origin-left",
          "text-muted-foreground group-focus-within:text-primary",
          error && "text-red-500",
          success && "text-emerald-500",
          sizeConfig[size].label,
          labelClassName
        )}
        variants={variants.label}
      >
        {placeholder}
      </motion.label>

      {/* Input Container */}
      <div className="relative">
        {/* Leading Icon */}
        {Icon && (
          <motion.div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 z-20",
              "text-muted-foreground group-focus-within:text-primary transition-colors duration-300",
              sizeConfig[size].icon
            )}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ 
              scale: isActive ? 1 : 0.8, 
              opacity: isActive ? 1 : 0.6,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className={sizeConfig[size].icon} />
          </motion.div>
        )}

        {/* Enhanced Input Field */}
        <motion.input
          ref={inputRef}
          type={inputType}
          className={cn(
            // Base enhanced styles
            "w-full bg-background/90 backdrop-blur-sm border border-border/60 rounded-xl",
            "text-foreground placeholder:text-transparent transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "shadow-sm hover:shadow-md focus:shadow-lg",
            "shadow-black/5 dark:shadow-white/5",
            
            // Size variants
            sizeConfig[size].input,
            
            // Icon padding
            Icon && "pl-10",
            (showPasswordToggle || error || success) && "pr-10",
            
            // Status variants
            error && "border-red-500/60 focus:border-red-500 focus:ring-red-500/20",
            success && "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/20",
            
            inputClassName
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          variants={variants.input}
          style={{
            ...(variant === "borderBeam" && {
              border: "2px solid transparent",
            }),
          }}
        />

        {/* Enhanced Border Beam Effect */}
        {variant === "borderBeam" && isActive && (
          <svg
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              transform: "translate(-2px, -2px)",
              width: "calc(100% + 4px)",
              height: "calc(100% + 4px)",
              zIndex: 5,
            }}
          >
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="url(#enhancedBorderGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              rx="12"
              initial="initial"
              animate="animate"
              variants={borderBeamVariants}
            />
            <defs>
              <linearGradient
                id="enhancedBorderGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="25%" stopColor="var(--primary)" />
                <stop offset="50%" stopColor="var(--primary)" />
                <stop offset="75%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Enhanced Particle Effects */}
        {variant === "particles" && isActive && (
          <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"
                style={{
                  left: `${15 + i * 10}%`,
                  top: "50%",
                }}
                variants={variants.extra}
                custom={i * 0.1}
                animate="animate"
                initial="initial"
              />
            ))}
          </div>
        )}

        {/* Enhanced Ripple Effect */}
        {variant === "ripple" && isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)"
            }}
          />
        )}

        {/* Trailing Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
          {error && <AlertCircle className="h-4 w-4 text-red-500" />}
          {success && <Check className="h-4 w-4 text-emerald-500" />}
          
          {showPasswordToggle && type === "password" && (
            <motion.button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.button>
          )}
        </div>
      </div>

      {/* Enhanced Particle Field */}
      {variant === "particleField" && (
        <motion.div
          ref={particleRef}
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Error/Success Message */}
      {(error || success) && (
        <motion.div
          className={cn(
            "mt-2 text-sm flex items-center gap-2",
            error ? "text-red-500" : "text-emerald-500"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {error || "Input validated successfully"}
        </motion.div>
      )}
    </motion.div>
  );
};

// Enhanced input variants (ALL original variants with premium improvements)
const inputVariants: Record<string, InputVariant> = {
  clean: {
    container: {
      initial: { scale: 1 },
      animate: { scale: 1.005 },
    },
    label: {
      initial: { y: 0, scale: 1, color: "var(--primary)" },
      animate: { 
        y: -32, 
        scale: 0.85, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { 
        borderColor: "rgb(226, 232, 240)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      },
      animate: { 
        borderColor: "var(--primary)",
      },
    },
  },

  underline: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { 
        borderWidth: "0 0 2px 0", 
        borderRadius: "4px 4px 0 0",
        borderColor: "rgb(226, 232, 240)",
        background: "rgba(0, 0, 0, 0.02)"
      },
      animate: { 
        borderColor: "var(--primary)",
        background: "rgba(var(--primary), 0.02)",
        boxShadow: "0 2px 0 0 rgba(var(--primary), 0.4)"
      },
    },
  },

  floating: {
    label: {
      initial: { y: 0, scale: 1, color: "var(--primary)" },
      animate: {
        y: -32,
        scale: 0.85,
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 400, damping: 25 },
      },
    },
    input: {
      initial: { 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transform: "translateY(0px)"
      },
      animate: { 
        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(0,0,0,0.1)",
        transform: "translateY(-2px)"
      },
    },
  },

  borderGlow: {
    label: {
      initial: { y: 0, color: "#6b7280" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        textShadow: "0 0 12px var(--primary)"
      },
    },
    input: {
      initial: { 
        boxShadow: "0 0 0 0 rgba(var(--primary), 0)",
        borderColor: "rgb(226, 232, 240)"
      },
      animate: { 
        boxShadow: "0 0 0 3px rgba(246, 134, 59, 0.3), 0 0 20px rgba(246, 134, 59, 0.2)",
        borderColor: "var(--primary)"
      },
    },
  },

  shimmer: {
    label: {
      initial: { y: 0, opacity: 1, color: "#6b7280" },
      animate: { 
        y: -32, 
        opacity: 0.9, 
        color: "var(--primary)",
        textShadow: "0 0 12px var(--primary)"
      },
    },
    input: {
      initial: { 
        backgroundPosition: "200% 0",
        borderColor: "rgb(226, 232, 240)"
      },
      animate: {
        backgroundPosition: "-200% 0",
        backgroundImage: "linear-gradient(90deg, transparent 0%, var(--primary) 50%, transparent 100%)",
        borderColor: "var(--primary)",
        boxShadow: "0 4px 12px var(--primary)",
        transition: { 
          backgroundPosition: { repeat: Infinity, duration: 2, ease: "linear" },
          borderColor: { duration: 0.3 },
          boxShadow: { duration: 0.3 }
        },
      },
    },
  },

  particles: {
    label: {
      initial: { y: 0, color: "#6b7280" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        textShadow: "0 0 8px var(--primary)"
      },
    },
    input: {
      initial: { borderColor: "rgb(226, 232, 240)" },
      animate: { 
        borderColor: "var(--primary)",
        boxShadow: "0 0 20px var(--primary)"
      },
    },
    extra: {
      initial: {
        scale: 0,
        opacity: 0,
        y: 0,
      },
      animate: (i: number) => ({
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
        y: [-20, -80, -120],
        x: [0, Math.sin(i) * 15, Math.cos(i) * 20],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          delay: i,
          ease: "easeOut",
        },
      }),
    },
  },

  slide: {
    label: {
      initial: { x: 0, y: 0, color: "var(--primary)" },
      animate: { 
        x: 0, 
        y: -32, 
        scale: 0.85, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { 
        borderColor: "var(--primary)",
        transform: "translateX(0px)"
      },
      animate: { 
        borderColor: "var(--primary)",
        transform: "translateX(3px)",
        boxShadow: "0 4px 15px var(--primary)"
      },
    },
  },

  scale: {
    label: {
      initial: { scale: 1, y: 0, color: "var(--primary)" },
      animate: { 
        scale: 0.85, 
        y: -32, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 400, damping: 25 }
      },
    },
    input: {
      initial: { scale: 1 },
      animate: { 
        scale: 1.02,
        boxShadow: "0 8px 25px var(--primary)",
        borderColor: "var(--primary)"
      },
    },
  },

  rotate: {
    label: {
      initial: { rotate: 0, y: 0, color: "var(--primary)" },
      animate: { 
        rotate: -8, 
        y: -32, 
        scale: 0.85, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { rotate: 0 },
      animate: { 
        rotate: 1,
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)"
      },
    },
  },

  bounce: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: {
        y: -32,
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 400, damping: 15 },
      },
    },
    input: {
      initial: { y: 0 },
      animate: {
        y: [0, -8, 0],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { 
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } 
        },
      },
    },
  },

  elastic: {
    label: {
      initial: { x: 0, y: 0, color: "var(--primary)" },
      animate: {
        x: [-15, 15, -8, 8, 0],
        y: -32,
        scale: 0.85,
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 500, damping: 15 },
      },
    },
    input: {
      initial: { scaleX: 1 },
      animate: {
        scaleX: [1, 1.08, 0.95, 1.03, 1],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { duration: 0.8 },
      },
    },
  },

  glow: {
    label: {
      initial: { y: 0, opacity: 1, color: "var(--primary)" },
      animate: { 
        y: -32, 
        opacity: 0.9, 
        color: "var(--primary)",
        textShadow: "0 0 15px var(--primary)"
      },
    },
    input: {
      initial: { boxShadow: "0 0 0 var(--primary)" },
      animate: { 
        boxShadow: "0 0 25px var(--primary), 0 0 50px var(--primary)",
        borderColor: "var(--primary)"
      },
    },
  },

  shake: {
    label: {
      initial: { x: 0, y: 0, color: "var(--primary)" },
      animate: {
        x: [-3, 3, -2, 2, 0],
        y: -32,
        scale: 0.85,
        color: "var(--primary)",
        transition: { 
          x: { duration: 0.5, ease: "easeInOut" },
          y: { type: "spring", stiffness: 300, damping: 15 },
          scale: { type: "spring", stiffness: 300, damping: 15 },
          color: { duration: 0.2 }
        },
      },
    },
    input: {
      initial: { x: 0 },
      animate: {
        x: [-2, 2, -1, 1, 0],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: {
          x: { 
            repeat: Infinity, 
            duration: 0.6, 
            ease: "easeInOut",
            repeatDelay: 3 
          },
          borderColor: { duration: 0.3 },
          boxShadow: { duration: 0.3 }
        },
      },
    },
  },

  wave: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: (i: number) => ({
        y: -32,
        color: "var(--primary)",
        transition: {
          delay: i * 0.03,
          type: "spring",
          stiffness: 300,
          damping: 15,
        },
      }),
    },
    input: {
      initial: { y: 0 },
      animate: {
        y: [0, -5, 0, 5, 0],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: {
          y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
        },
      },
    },
  },

  typewriter: {
    label: {
      initial: { width: "100%", x: 0, y: 0, color: "var(--primary)" },
      animate: { 
        width: 0, 
        x: -60, 
        y: -32, 
        scale: 0.85,
        color: "var(--primary)",
        transition: { duration: 0.6, ease: "easeInOut" } 
      },
    },
    input: {
      initial: { width: 0 },
      animate: { 
        width: "100%", 
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { delay: 0.6, duration: 0.6, ease: "easeOut" } 
      },
    },
  },

  magnetic: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        textShadow: "0 0 12px var(--primary)"
      },
    },
    input: {
      initial: { backgroundPosition: "0% 50%" },
      animate: {
        backgroundPosition: "100% 50%",
        backgroundImage: "linear-gradient(90deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: {
          backgroundPosition: { repeat: Infinity, duration: 1.5, ease: "linear" },
        },
      },
    },
  },

  pulse: {
    label: {
      initial: { scale: 1, y: 0, color: "var(--primary)" },
      animate: { 
        scale: 0.85, 
        y: -32, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.02, 1],
        borderColor: "var(--primary)",
        boxShadow: [
          "0 4px 15px var(--primary)",
          "0 4px 20px var(--primary)",
          "0 4px 15px var(--primary)"
        ],
        transition: { 
          scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        },
      },
    },
  },

  flip: {
    label: {
      initial: { rotateX: 0, y: 0, color: "var(--primary)" },
      animate: { 
        rotateX: 180, 
        y: -32, 
        scale: 0.85,
        color: "var(--primary)",
        transition: { duration: 0.6, ease: "easeInOut" }
      },
    },
    input: {
      initial: { rotateX: 0 },
      animate: { 
        rotateX: [0, 180, 360], 
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { duration: 1.2, ease: "easeInOut" } 
      },
    },
  },

  morph: {
    label: {
      initial: { borderRadius: "0%", y: 0, color: "var(--primary)" },
      animate: { 
        borderRadius: "50%", 
        y: -32, 
        scale: 0.85, 
        color: "var(--primary)",
        transition: { duration: 0.6, ease: "easeInOut" }
      },
    },
    input: {
      initial: { borderRadius: "12px" },
      animate: {
        borderRadius: ["12px", "30px", "12px"],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { 
          borderRadius: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } 
        },
      },
    },
  },

  spotlight: {
    label: {
      initial: { y: 0, filter: "brightness(1)", color: "var(--primary)" },
      animate: { 
        y: -32, 
        filter: "brightness(1.3) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))", 
        color: "var(--primary)"
      },
    },
    input: {
      initial: { backgroundPosition: "0% 50%" },
      animate: {
        backgroundPosition: "100% 50%",
        backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)",
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { 
          backgroundPosition: { repeat: Infinity, duration: 2, ease: "linear" }
        },
      },
    },
    extra: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          repeat: Infinity,
          duration: 2,
          repeatType: "reverse" as const,
        },
      },
    },
  },

  liquid: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { borderRadius: "12px" },
      animate: {
        borderRadius: ["12px", "25px", "12px"],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { 
          borderRadius: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } 
        },
      },
    },
  },

  neon: {
    label: {
      initial: { textShadow: "0 0 0px #fff", color: "var(--primary)" },
      animate: {
        textShadow: "0 0 12px #fff, 0 0 24px var(--primary), 0 0 36px var(--primary)",
        y: -32,
        color: "var(--primary)",
      },
    },
    input: {
      initial: { boxShadow: "0 0 0px #fff" },
      animate: {
        boxShadow: "0 0 8px var(--primary), 0 0 16px var(--primary), 0 0 24px var(--primary), 0 0 32px var(--primary)",
        borderColor: "var(--primary)",
        transition: {
          boxShadow: { repeat: Infinity, duration: 2, repeatType: "reverse" as const },
        },
      },
    },
  },

  origami: {
    label: {
      initial: { rotateY: 0, y: 0, color: "var(--primary)" },
      animate: { 
        rotateY: 180, 
        y: -32, 
        scale: 0.85,
        color: "var(--primary)",
        transition: { duration: 0.8, ease: "easeInOut" }
      },
    },
    input: {
      initial: { rotateY: 0 },
      animate: {
        rotateY: [0, -90, 0],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: {
          rotateY: { repeat: Infinity, duration: 3, repeatDelay: 1.5 },
        },
      },
    },
  },

  glitch: {
    label: {
      initial: { skew: 0, y: 0, color: "var(--primary)" },
      animate: {
        skew: [-8, 8, -4, 4, 0],
        y: -32,
        scale: 0.85,
        color: "var(--primary)",
        textShadow: "2px 0 #ff0000, -2px 0 #00ff00",
        transition: { 
          skew: { repeat: Infinity, duration: 0.6, repeatDelay: 2 },
          textShadow: { repeat: Infinity, duration: 0.1, repeatDelay: 2 }
        },
      },
    },
    input: {
      initial: { skew: 0 },
      animate: {
        skew: [0, -3, 3, -2, 2, 0],
        borderColor: "var(--primary)",
        boxShadow: "2px 0 8px var(--primary), -2px 0 8px var(--primary)",
        transition: { 
          skew: { repeat: Infinity, duration: 0.6, repeatDelay: 2 } 
        },
      },
    },
  },

  hologram: {
    label: {
      initial: { opacity: 1, y: 0, color: "var(--primary)" },
      animate: {
        opacity: [1, 0.6, 1],
        y: -32,
        scale: 0.85,
        color: "var(--primary)",
        textShadow: "0 0 15px var(--primary)",
        transition: { 
          opacity: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } 
        },
      },
    },
    input: {
      initial: { opacity: 0.8 },
      animate: {
        opacity: [0.8, 1, 0.8],
        borderColor: "var(--primary)",
        boxShadow: "0 0 20px var(--primary), inset 0 0 20px var(--primary)",
        transition: { 
          opacity: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } 
        },
      },
    },
    extra: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 0.6, 0],
        transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
      },
    },
  },

  cosmic: {
    label: {
      initial: { scale: 1, y: 0, rotate: 0, color: "var(--primary)" },
      animate: {
        scale: 0.85,
        y: -32,
        rotate: 360,
        color: "var(--primary)",
        textShadow: "0 0 15px var(--primary)",
        transition: { 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" } 
        },
      },
    },
    input: {
      initial: { backgroundPosition: "0% 50%" },
      animate: {
        backgroundPosition: "100% 50%",
        backgroundImage: "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))",
        borderColor: "var(--primary)",
        boxShadow: "0 0 25px var(--primary)",
        transition: { 
          backgroundPosition: { repeat: Infinity, duration: 4, ease: "linear" } 
        },
      },
    },
  },

  borderBeam: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        textShadow: "0 0 12px var(--primary)"
      },
    },
    input: {
      initial: {
        borderColor: "transparent",
        background: "rgb(255, 255, 255)",
      },
      animate: {
        borderColor: "transparent",
        background: "rgb(255, 255, 255)",
        boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)",
      },
    },
  },

  gradientBorder: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: {
        border: "2px solid transparent",
        backgroundImage: `
          linear-gradient(white, white),
          linear-gradient(90deg, var(--primary), var(--primary), var(--primary))
        `,
        backgroundClip: "padding-box, border-box",
        backgroundOrigin: "padding-box, border-box",
        backgroundSize: "100% 100%, 300% 100%",
        backgroundPosition: "0 0, 100% 0",
      },
      animate: {
        backgroundPosition: ["0 0, 100% 0", "0 0, -100% 0"],
        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.15)",
        transition: {
          backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
        },
      },
    },
  },

  ripple: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { borderColor: "rgb(226, 232, 240)" },
      animate: { 
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)"
      },
    },
  },

  materialFloat: {
    label: {
      initial: { y: 0, scale: 1, color: "#6b7280" },
      animate: {
        y: -32,
        scale: 0.85,
        color: "#3b82f6",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    },
    input: {
      initial: {
        borderWidth: "0 0 2px 0",
        borderRadius: "4px 4px 0 0",
        borderColor: "rgb(226, 232, 240)",
        background: "rgba(0, 0, 0, 0.04)",
      },
      animate: {
        borderColor: "var(--primary)",
        background: "var(--primary)",
        boxShadow: "0 2px 0 0 rgba(var(--primary), 0.4)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    },
  },

  neonPulse: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        textShadow: "0 0 15px var(--primary)"
      },
    },
    input: {
      initial: {
        boxShadow: "0 0 0 var(--primary)",
        borderColor: "rgb(226, 232, 240)",
      },
      animate: {
        boxShadow: [
          "0 0 8px var(--primary)",
          "0 0 16px var(--primary)",
          "0 0 24px var(--primary)",
          "0 0 8px var(--primary)",
        ],
        borderColor: "var(--primary)",
        transition: {
          boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        },
      },
    },
  },

  typewriterReveal: {
    label: {
      initial: { y: 0, opacity: 0, color: "var(--primary)" },
      animate: {
        y: -32,
        opacity: 1,
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 400, damping: 25 },
      },
    },
    input: {
      initial: { width: "0%" },
      animate: {
        width: "100%",
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { duration: 0.8, ease: "easeOut" },
      },
    },
  },

  morphing: {
    label: {
      initial: { y: 0, borderRadius: "4px", color: "var(--primary)" },
      animate: { 
        y: -32, 
        borderRadius: "16px", 
        color: "var(--primary)",
        transition: { duration: 0.6, ease: "easeInOut" }
      },
    },
    input: {
      initial: { borderRadius: "12px" },
      animate: {
        borderRadius: ["12px", "20px", "12px"],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { 
          borderRadius: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } 
        },
      },
    },
  },

  liquidBorder: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
    },
    input: {
      initial: { borderRadius: "12px" },
      animate: {
        borderRadius: ["12px", "20px 8px 20px 8px", "8px 20px 8px 20px", "12px"],
        borderColor: "var(--primary)",
        boxShadow: "0 4px 15px var(--primary)",
        transition: { 
          borderRadius: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } 
        },
      },
    },
  },

  particleField: {
    label: {
      initial: { y: 0, color: "#6b7280" },
      animate: { 
        y: -32, 
        color: "var(--primary)",
        textShadow: "0 0 12px var(--primary)"
      },
    },
    input: {
      initial: {
        borderColor: "var(--border)",
        boxShadow: "0 0 0 var(--primary)",
      },
      animate: {
        borderColor: "var(--primary)",
        boxShadow: "0 0 20px var(--primary)",
      },
    },
    extra: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: 0.2 },
      },
    },
  },

    glassmorphism: {
    container: {
      initial: { backdropFilter: "blur(0px)" },
      animate: { backdropFilter: "blur(20px)" },
    },
    label: {
      initial: { y: 0, scale: 1, color: "var(--primary)" },
      animate: {
        y: -28,
        scale: 0.85,
        color: "var(--primary)",
        transition: { type: "spring", stiffness: 300 },
      },
    },
    input: {
      initial: {
        background: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
      },
      animate: {
        background: "rgba(255, 255, 255, 0.15)",
        borderColor: "var(--primary)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      },
    },
  },

  holographic3D: {
    container: {
      initial: { rotateX: 0, rotateY: 0 },
      animate: { rotateX: 2, rotateY: 2 },
    },
    label: {
      initial: { 
        y: 0, 
        scale: 1, 
        color: "var(--primary)",
        textShadow: "none"
      },
      animate: {
        y: -28,
        scale: 0.85,
        color: "#3b82f6",
        textShadow: "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)",
      },
    },
    input: {
      initial: {
        borderColor: "var(--border)",
        boxShadow: "0 4px 6px var(--primary)",
      },
      animate: {
        borderColor: "var(--primary)",
        boxShadow: "0 0 20px var(--primary), 0 8px 16px var(--primary), inset 0 1px 0 var(--primary)",
        transform: "translateZ(10px)",
      },
    },
  },

  quantumParticles: {
    label: {
      initial: { y: 0, color: "var(--primary)" },
      animate: {
        y: -28,
        color: "var(--primary)",
        textShadow: "0 0 8px var(--primary)",
      },
    },
    input: {
      initial: { 
        borderColor: "rgb(226, 232, 240)",
        background: "linear-gradient(45deg, transparent 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)"
      },
      animate: {
        borderColor: "var(--primary)",
        boxShadow: "0 0 20px var(--primary)",
        background: "linear-gradient(45deg, rgba(var(--primary), 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(var(--primary), 0.05) 100%)",
      },
    },
    extra: {
      initial: {
        scale: 0,
        opacity: 0,
        rotate: 0,
      },
      animate: (i: number) => ({
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180, 360],
        y: [-20, -80],
        x: [0, Math.sin(i) * 20],
        transition: {
          duration: 3,
          repeat: Infinity,
          delay: i,
          ease: "easeInOut",
        },
      }),
    },
  },

  premiumGlass: {
    container: {
      initial: { scale: 1 },
      animate: { 
        scale: 1.01,
        transition: { type: "spring", stiffness: 300 }
      },
    },
    label: {
      initial: { 
        y: 0, 
        scale: 1, 
        color: "#6b7280",
        filter: "blur(0px)"
      },
      animate: {
        y: -28,
        scale: 0.85,
        color: "#3b82f6",
        filter: "blur(0px) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
      },
    },
    input: {
      initial: {
        background: "rgba(255, 255, 255, 0.05)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(5px)",
      },
      animate: {
        background: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.4)",
        backdropFilter: "blur(20px)",
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(59, 130, 246, 0.2)
        `,
      },
    },
  },

  luxuryShimmer: {
    label: {
      initial: { 
        y: 0, 
        scale: 1, 
        color: "#6b7280",
        backgroundImage: "none"
      },
      animate: {
        y: -28,
        scale: 0.85,
        backgroundImage: "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        color: "transparent",
        animation: "shimmer 2s linear infinite",
      },
    },
    input: {
      initial: {
        borderColor: "rgb(226, 232, 240)",
        background: "linear-gradient(90deg, #ffffff, #ffffff)",
      },
      animate: {
        borderColor: "rgb(59, 130, 246)",
        background: "linear-gradient(90deg, #ffffff, #f8fafc, #ffffff)",
        boxShadow: `
          0 4px 12px rgba(59, 130, 246, 0.15),
          0 0 0 1px rgba(59, 130, 246, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8)
        `,
      },
    },
  },

  materialRipple: {
    label: {
      initial: { y: 0, scale: 1, color: "#6b7280" },
      animate: {
        y: -28,
        scale: 0.85,
        color: "#3b82f6",
        transition: { type: "spring", stiffness: 400, damping: 25 },
      },
    },
    input: {
      initial: {
        borderWidth: "0 0 2px 0",
        borderRadius: "4px 4px 0 0",
        borderColor: "rgb(226, 232, 240)",
        background: "rgba(0, 0, 0, 0.04)",
      },
      animate: {
        borderColor: "rgb(59, 130, 246)",
        background: "rgba(59, 130, 246, 0.04)",
        boxShadow: "0 2px 0 0 rgba(59, 130, 246, 0.3)",
      },
    },
  },

  cosmicField: {
    container: {
      initial: { 
        background: "transparent",
      },
      animate: {
        background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
      },
    },
    label: {
      initial: { 
        y: 0, 
        scale: 1, 
        color: "#6b7280",
        filter: "hue-rotate(0deg)"
      },
      animate: {
        y: -28,
        scale: 0.85,
        color: "#8b5cf6",
        filter: "hue-rotate(360deg)",
        transition: { 
          filter: { duration: 3, repeat: Infinity, ease: "linear" }
        },
      },
    },
    input: {
      initial: {
        borderColor: "rgba(139, 92, 246, 0.2)",
        background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
      },
      animate: {
        borderColor: "rgba(139, 92, 246, 0.6)",
        background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 100%)",
        boxShadow: "0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)",
      },
    },
  },
  
  premiumGradient: {
    label: {
      initial: { 
        y: 0, 
        scale: 1,
        backgroundImage: "linear-gradient(90deg, #6b7280, #6b7280)",
        backgroundClip: "text",
        color: "transparent"
      },
      animate: {
        y: -28,
        scale: 0.85,
        backgroundImage: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
        backgroundSize: "300% 100%",
        backgroundPosition: "0% 50%",
        animation: "gradientShift 3s ease infinite",
      },
    },
    input: {
      initial: {
        background: "linear-gradient(90deg, #ffffff, #ffffff)",
        borderColor: "rgb(226, 232, 240)",
      },
      animate: {
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
        borderColor: "rgb(59, 130, 246)",
        boxShadow: `
          0 8px 25px rgba(59, 130, 246, 0.15),
          0 0 0 1px rgba(59, 130, 246, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.9)
        `,
      },
    },
  },

};

export default AnimatedInput;
