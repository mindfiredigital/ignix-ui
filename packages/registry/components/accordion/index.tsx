'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const animations = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  },
  slideDown: {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1 } },
  },
  slideUp: {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1 } },
  },
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1 } },
  },
  rotate: {
    hidden: { rotateX: 90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1, transition: { duration: 1 } },
  },
  bounce: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 },
    },
  },
  flip: {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1, transition: { duration: 1 } },
  },
  zoomIn: {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1 } },
  },
  elastic: {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  },
  springy: {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 200 },
    },
  },
};

type AnimationVariants = keyof typeof animations;

const getAnimationVariant = (variant: AnimationVariants) => {
  return animations[variant] || animations.fade;
};
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b AccordionItem', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex AccordionHeader">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 AccordionTrigger',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 AccordionChevron" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

interface AccordionContentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
  variant?: AnimationVariants;
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant = 'fade', ...props }, ref) => {
  const animationVariant = getAnimationVariant(variant);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down AccordionContent"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>
        {' '}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={animationVariant}
          className="AccordionContentText"
        >
          {children}
        </motion.div>
      </div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
