'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedInputProps {
  placeholder: string;
  variant: string;
  inputClassName?: string;
  labelClassName?: string;
}

interface InputVariant {
  label: Variants;
  input: Variants;
  extra?: Variants;
}

const borderBeamVariants: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  placeholder,
  variant,
  inputClassName = '',
  labelClassName = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const variants = inputVariants[variant as keyof typeof inputVariants];

  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant === 'particleField' && particleRef.current) {
      const createParticle = () => {
        if (!particleRef.current) return;
        const particle = document.createElement('div');
        particle.className = 'particle absolute w-1 h-1 bg-blue-400 rounded-full';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particleRef.current.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
      };

      const interval = setInterval(createParticle, 100);
      return () => clearInterval(interval);
    }
  }, [variant]);

  return (
    <motion.div
      className="relative mb-4"
      initial="initial"
      animate={isFocused || value ? 'animate' : 'initial'}
      style={{ perspective: 2000 }}
    >
      <motion.label
        className={`absolute left-2 text-gray-600 pointer-events-none ${labelClassName}`}
        variants={variants.label}
      >
        {placeholder}
      </motion.label>
      <div className="relative">
        <motion.input
          type="text"
          className={`w-full px-3 py-2 bg-white border-2 rounded-md focus:outline-none ${inputClassName}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          variants={variants.input}
          style={{
            ...(variant === 'borderBeam' && {
              border: '2px solid #e2e8f0',
            }),
          }}
        />
        {variant === 'borderBeam' && (isFocused || value) && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: 'translate(-2px, -2px)',
              width: 'calc(100% + 4px)',
              height: 'calc(100% + 4px)',
              zIndex: 10,
            }}
          >
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              rx="6"
              initial="initial"
              animate="animate"
              variants={borderBeamVariants}
            />
            <defs>
              <linearGradient
                id="borderGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        )}
        {variant === 'particles' && (isFocused || value) && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${15 + i * 15}%`,
                  top: '50%',
                }}
                variants={variants.extra}
                custom={i * 0.2}
                animate="animate"
                initial="initial"
              />
            ))}
          </div>
        )}
      </div>
      {variant === 'particleField' && (
        <motion.div
          ref={particleRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

const inputVariants: Record<string, InputVariant> = {
  clean: {
    label: {
      initial: { y: 0, scale: 1 },
      animate: { y: -24, scale: 0.8 },
    },
    input: {
      initial: { borderColor: '#e2e8f0' },
      animate: { borderColor: '#3b82f6' },
    },
  },
  underline: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: { borderWidth: '0 0 2px 0', borderRadius: '0' },
      animate: { borderColor: '#3b82f6' },
    },
  },
  floating: {
    label: {
      initial: { y: 0, scale: 1 },
      animate: { y: -24, scale: 0.8, transition: { type: 'spring', stiffness: 300 } },
    },
    input: {
      initial: { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
      animate: { boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)' },
    },
  },
  borderGlow: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
      animate: { boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
    },
  },
  shimmer: {
    label: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -24, opacity: 0.7 },
    },
    input: {
      initial: { backgroundPosition: '200% 0' },
      animate: {
        backgroundPosition: '-200% 0',
        backgroundImage:
          'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
        transition: { repeat: Infinity, duration: 3 },
      },
    },
  },
  particles: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: { borderColor: '#e2e8f0' },
      animate: { borderColor: '#3b82f6' },
    },
    extra: {
      initial: {
        scale: 0.6,
        opacity: 0,
        y: 0,
      },
      animate: {
        scale: [0.6, 1, 0.6],
        opacity: [0, 1, 0],
        y: -20,
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        },
      },
    },
  },
  slide: {
    label: {
      initial: { x: 0, y: 0 },
      animate: { x: 0, y: -25, scale: 0.8 },
    },
    input: {
      initial: { borderColor: '#4a5568' },
      animate: { borderColor: '#3b82f6' },
    },
  },
  scale: {
    label: {
      initial: { scale: 1, y: 0 },
      animate: { scale: 0.8, y: -25 },
    },
    input: {
      initial: { scale: 1 },
      animate: { scale: 1.05 },
    },
  },
  rotate: {
    label: {
      initial: { rotate: 0, y: 0 },
      animate: { rotate: -10, y: -25, scale: 0.8 },
    },
    input: {
      initial: { rotate: 0 },
      animate: { rotate: 2 },
    },
  },
  bounce: {
    label: {
      initial: { y: 0 },
      animate: { y: -25, transition: { type: 'spring', stiffness: 300, damping: 10 } },
    },
    input: {
      initial: { y: 0 },
      animate: { y: [0, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1 } },
    },
  },
  elastic: {
    label: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [-10, 10, -5, 5, 0],
        y: -25,
        transition: { type: 'spring', stiffness: 500, damping: 10 },
      },
    },
    input: {
      initial: { scaleX: 1 },
      animate: { scaleX: [1, 1.05, 0.95, 1.02, 1], transition: { duration: 0.5 } },
    },
  },
  glow: {
    label: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -25, opacity: 0.6 },
    },
    input: {
      initial: { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
      animate: { boxShadow: '0 0 15px rgba(59, 130, 246, 0.7)' },
    },
  },
  shake: {
    label: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [-2, 2, -1, 1, 0],
        y: -25,
        transition: { type: 'spring', stiffness: 300, damping: 10 },
      },
    },
    input: {
      initial: { x: 0 },
      animate: {
        x: [-2, 2, -1, 1, 0],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5, repeatDelay: 2 },
      },
    },
  },
  wave: {
    label: {
      initial: { y: 0 },
      animate: (i: number) => ({
        y: -25,
        transition: { delay: i * 0.05, type: 'spring', stiffness: 300, damping: 10 },
      }),
    },
    input: {
      initial: { y: 0 },
      animate: {
        y: [0, -3, 0, 3, 0],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: 'linear' },
      },
    },
  },
  typewriter: {
    label: {
      initial: { width: '100%', x: 0, y: 0 },
      animate: { width: 0, x: -50, y: -25, transition: { duration: 0.5 } },
    },
    input: {
      initial: { width: 0 },
      animate: { width: '100%', transition: { delay: 0.5, duration: 0.5 } },
    },
  },
  magnetic: {
    label: {
      initial: { y: 0 },
      animate: { y: -25 },
    },
    input: {
      initial: { backgroundPosition: '0% 50%' },
      animate: {
        backgroundPosition: '100% 50%',
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 1, ease: 'linear' },
      },
    },
  },
  pulse: {
    label: {
      initial: { scale: 1, y: 0 },
      animate: { scale: 0.8, y: -25 },
    },
    input: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.02, 1],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
      },
    },
  },
  flip: {
    label: {
      initial: { rotateX: 0, y: 0 },
      animate: { rotateX: 180, y: -25, opacity: 0.7 },
    },
    input: {
      initial: { rotateX: 0 },
      animate: { rotateX: [0, 180, 360], transition: { duration: 1 } },
    },
  },
  morph: {
    label: {
      initial: { borderRadius: '0%', y: 0 },
      animate: { borderRadius: '50%', y: -25, scale: 0.8 },
    },
    input: {
      initial: { borderRadius: '0%' },
      animate: {
        borderRadius: ['0%', '25%', '0%'],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
      },
    },
  },
  spotlight: {
    label: {
      initial: { y: 0, filter: 'brightness(1)' },
      animate: { y: -25, filter: 'brightness(1.5)' },
    },
    input: {
      initial: { backgroundPosition: '0% 50%' },
      animate: {
        backgroundPosition: '100% 50%',
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
      },
    },
    extra: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          repeatType: 'reverse' as const,
        },
      },
    },
  },
  liquid: {
    label: {
      initial: { y: 0 },
      animate: { y: -25 },
    },
    input: {
      initial: { borderRadius: '4px' },
      animate: {
        borderRadius: ['4px', '20px', '4px'],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
      },
    },
  },
  neon: {
    label: {
      initial: { textShadow: '0 0 0px #fff' },
      animate: { textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff', y: -25 },
    },
    input: {
      initial: { boxShadow: '0 0 0px #fff' },
      animate: {
        boxShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de',
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          repeatType: 'reverse' as const,
        },
      },
    },
  },
  origami: {
    label: {
      initial: { rotateY: 0, y: 0 },
      animate: { rotateY: 180, y: -25 },
    },
    input: {
      initial: { rotateY: 0 },
      animate: {
        rotateY: [0, -90, 0],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 2, repeatDelay: 1 },
      },
    },
  },
  glitch: {
    label: {
      initial: { skewX: 0, y: 0 },
      animate: {
        skewX: [-5, 5, -2, 2, 0],
        y: -25,
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 },
      },
    },
    input: {
      initial: { skewX: 0 },
      animate: {
        skewX: [0, -2, 2, -1, 1, 0],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 },
      },
    },
  },
  hologram: {
    label: {
      initial: { opacity: 1, y: 0 },
      animate: {
        opacity: [1, 0.5, 1],
        y: -25,
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
      },
    },
    input: {
      initial: { opacity: 0.7 },
      animate: {
        opacity: [0.7, 1, 0.7],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
      },
    },
    extra: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 0.5, 0],
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
      },
    },
  },
  cosmic: {
    label: {
      initial: { scale: 1, y: 0, rotate: 0 },
      animate: {
        scale: 0.8,
        y: -25,
        rotate: 360,
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
      },
    },
    input: {
      initial: { backgroundPosition: '0% 50%' },
      animate: {
        backgroundPosition: '100% 50%',
        transition: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
      },
    },
  },
  borderBeam: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: {
        borderColor: '#e2e8f0',
      },
      animate: {
        borderColor: '#e2e8f0',
      },
    },
  },
  gradientBorder: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: {
        border: '2px solid transparent',
        backgroundImage: `
          linear-gradient(white, white),
          linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)
        `,
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'padding-box, border-box',
        backgroundSize: '100% 100%, 200% 100%',
        backgroundPosition: '0 0, 100% 0',
      },
      animate: {
        backgroundPosition: ['0 0, 100% 0', '0 0, -100% 0'],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    },
  },
  ripple: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: { borderColor: '#e2e8f0' },
      animate: { borderColor: '#3b82f6' },
    },
    extra: {
      initial: { scale: 0, opacity: 0.5 },
      animate: {
        scale: 2,
        opacity: 0,
        transition: {
          repeat: Infinity,
          duration: 1,
          ease: 'easeOut',
        },
      },
    },
  },
  materialFloat: {
    label: {
      initial: { y: 0, scale: 1 },
      animate: {
        y: -24,
        scale: 0.85,
        color: '#3b82f6',
        transition: { type: 'spring', stiffness: 300 },
      },
    },
    input: {
      initial: { borderWidth: '0 0 2px 0', borderRadius: '0', borderColor: '#e2e8f0' },
      animate: {
        borderColor: '#3b82f6',
        transition: { type: 'spring', stiffness: 300 },
      },
    },
  },
  neonPulse: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: {
        boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
        borderColor: '#e2e8f0',
      },
      animate: {
        boxShadow: [
          '0 0 5px rgba(59, 130, 246, 0.5)',
          '0 0 10px rgba(59, 130, 246, 0.3)',
          '0 0 15px rgba(59, 130, 246, 0.2)',
          '0 0 5px rgba(59, 130, 246, 0.5)',
        ],
        borderColor: '#3b82f6',
        transition: {
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
      },
    },
  },
  typewriterReveal: {
    label: {
      initial: { y: 0, opacity: 0 },
      animate: {
        y: -24,
        opacity: 1,
        transition: { type: 'spring', stiffness: 400 },
      },
    },
    input: {
      initial: { width: '0%' },
      animate: {
        width: '100%',
        transition: { duration: 0.5, ease: 'easeOut' },
      },
    },
  },
  morphing: {
    label: {
      initial: { y: 0, borderRadius: '4px' },
      animate: { y: -24, borderRadius: '12px' },
    },
    input: {
      initial: { borderRadius: '4px' },
      animate: {
        borderRadius: ['4px', '12px', '4px'],
        transition: { repeat: Infinity, duration: 2 },
      },
    },
  },
  liquidBorder: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: { borderRadius: '4px' },
      animate: {
        borderRadius: ['4px', '16px 4px 16px 4px', '4px 16px 4px 16px', '4px'],
        transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
      },
    },
  },
  particleField: {
    label: {
      initial: { y: 0 },
      animate: { y: -24 },
    },
    input: {
      initial: {
        borderColor: '#e2e8f0',
        boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
      },
      animate: {
        borderColor: '#3b82f6',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
      },
    },
    extra: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          duration: 0.1,
        },
      },
    },
  },
};

export default AnimatedInput;
