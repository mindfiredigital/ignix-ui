'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '@ignix-ui/button';

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface PricingFeature {
  label: string;
  available?: boolean;
}

export interface PricingTier {
  name: string;
  price: {
    monthly: string;
    annual?: string;
  };
  description?: string;
  features: PricingFeature[];
  ctaLabel?: string;
  recommended?: boolean;
  // Color customization
  cardColor?: string; // Color name (e.g., 'blue', 'purple', 'green') - automatically generates borderColor, buttonColor, buttonTextColor
  borderColor?: string; // Tailwind color class for border (e.g., 'border-purple-200', 'border-blue-300') - overrides cardColor
  buttonColor?: string; // Tailwind color classes for button (e.g., 'bg-purple-600 hover:bg-purple-700') - overrides cardColor
  buttonTextColor?: string; // Tailwind color class for button text (e.g., 'text-white', 'text-purple-700') - overrides cardColor
  badgeColor?: string; // Tailwind color classes for badge (e.g., 'bg-purple-600 text-white')
  // Background customization
  cardBackgroundColor?: string; // Tailwind color class or CSS color (e.g., 'bg-white', 'bg-gray-50', '#ffffff')
  cardBackgroundImage?: string; // URL to background image
  cardBackgroundOverlay?: string; // Tailwind class for overlay (e.g., 'bg-black/10', 'bg-white/80')
}

export type AnimationType = 'fade' | 'slide' | 'scale' | 'slide-up' | 'slide-down' | 'none';

export interface AnimationConfig {
  enabled?: boolean; // Enable/disable all animations
  type?: AnimationType; // Animation type for cards
  duration?: number; // Animation duration in seconds
  staggerDelay?: number; // Delay between each card animation (in seconds)
  headerDelay?: number; // Delay before header animation starts (in seconds)
  toggleDelay?: number; // Delay before toggle animation starts (in seconds)
  featuresDelay?: number; // Base delay for feature list items (in seconds)
  featuresStagger?: number; // Stagger delay between feature items (in seconds)
}

export interface PricingGridProps {
  title?: string;
  titleHighlight?: string;
  description?: string;
  tiers: PricingTier[];
  showToggle?: boolean;
  defaultBilling?: 'monthly' | 'annual';
  onCtaClick?: (tier: PricingTier, billing: 'monthly' | 'annual') => void;
  className?: string;
  // Global color customization
  accentColor?: string; // Tailwind color class for title highlight and toggle (e.g., 'text-purple-600', 'text-blue-600')
  toggleActiveColor?: string; // Tailwind color classes for active toggle button (e.g., 'bg-purple-600')
  titleColor?: string; // Tailwind color class for main title (e.g., 'text-gray-900', 'text-white')
  descriptionColor?: string; // Tailwind color class for description text (e.g., 'text-gray-600', 'text-gray-300')
  labelColor?: string; // Tailwind color class for "PRICING" label (e.g., 'text-gray-500', 'text-gray-400')
  // Background customization
  sectionBackgroundColor?: string; // Tailwind color class or CSS color (e.g., 'bg-white', 'bg-gray-50', '#f5f5f5')
  sectionBackgroundImage?: string; // URL to background image
  sectionBackgroundOverlay?: string; // Tailwind class for overlay (e.g., 'bg-black/10', 'bg-white/80')
  // Animation customization
  animation?: AnimationType | AnimationConfig | false; // Animation type string, full config object, or false to disable
  // Layout customization
  scaleRecommended?: boolean; // Scale recommended card and place others behind it (carousel effect)
  horizontalHeader?: boolean; // Display title and description horizontally (for two-tier layouts)
}

/* -------------------------------------------------------------------------- */
/*                            COLOR HELPERS                                   */
/* -------------------------------------------------------------------------- */

/**
 * Generate color classes from a color name
 */
const getColorClasses = (colorName: string, isRecommended: boolean) => {
  const color = colorName.toLowerCase();
  
  return {
    borderColor: `border-${color}-200/60`,
    buttonColor: isRecommended 
      ? `bg-${color}-600 hover:bg-${color}-700`
      : `bg-${color}-100 hover:bg-${color}-200`,
    buttonTextColor: isRecommended 
      ? 'text-white'
      : `text-${color}-700`,
    badgeColor: `bg-${color}-600 text-white`,
    cardBackgroundColor: `bg-${color}-50`,
  };
};

/* -------------------------------------------------------------------------- */
/*                            ANIMATION HELPERS                               */
/* -------------------------------------------------------------------------- */

/**
 * Normalize animation prop - converts string/false to AnimationConfig format
 */
const normalizeAnimationConfig = (
  animation: AnimationType | AnimationConfig | false | undefined
): AnimationConfig => {
  // If false, disable animations
  if (animation === false) {
    return { enabled: false };
  }
  
  // If string, use it as animation type with defaults
  if (typeof animation === 'string') {
    return {
      enabled: animation !== 'none',
      type: animation,
    };
  }
  
  // If object, return as-is (may be partial)
  if (animation && typeof animation === 'object') {
    return animation;
  }
  
  // Default: enabled with slide-up
  return {
    enabled: true,
    type: 'slide-up',
  };
};

const getCardAnimationVariants = (
  animationType: AnimationType,
  duration: number,
  delay: number
) => {
  if (animationType === 'none') {
    return {};
  }

  const baseTransition = { duration, delay };

  switch (animationType) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: baseTransition,
      };
    case 'slide':
      return {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: baseTransition,
      };
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: baseTransition,
      };
    case 'slide-up':
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: baseTransition,
      };
    case 'slide-down':
      return {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: baseTransition,
      };
    default:
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: baseTransition,
      };
  }
};

const getHeaderAnimationVariants = (
  enabled: boolean,
  duration: number,
  delay: number
) => {
  if (!enabled) {
    return {};
  }
  return {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay },
  };
};

const getBadgeAnimationVariants = (enabled: boolean) => {
  if (!enabled) {
    return {};
  }
  return {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { type: 'spring' as const, stiffness: 200, damping: 15 },
  };
};

const getFeatureAnimationVariants = (
  enabled: boolean,
  baseDelay: number,
  stagger: number,
  index: number
) => {
  if (!enabled) {
    return {};
  }
  return {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: baseDelay + index * stagger },
  };
};

/* -------------------------------------------------------------------------- */
/*                              PRICE DISPLAY                                 */
/* -------------------------------------------------------------------------- */

interface PriceDisplayProps {
  price: string;
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, className }) => {
  const textColor = className || 'text-gray-900';
  const periodColor = className ? 'text-white/80' : 'text-gray-600';
  
  if (!price.includes('/')) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <span className={cn('text-4xl font-bold tracking-tight', textColor)}>{price}</span>
      </div>
    );
  }
  
  const [amount, period] = price.split('/');
  
  return (
    <div className={cn('flex items-baseline justify-center gap-1', className)}>
      <span className={cn('text-5xl font-bold tracking-tight', textColor)}>{amount}</span>
      {period && (
        <span className={cn('text-lg', periodColor)}>/{period}</span>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              PRICING TOGGLE                                */
/* -------------------------------------------------------------------------- */

interface PricingToggleProps {
  billing: 'monthly' | 'annual';
  onBillingChange: (billing: 'monthly' | 'annual') => void;
  activeColor?: string; // Tailwind color classes for active toggle button
  animation?: AnimationType | AnimationConfig | false;
}

const PricingToggle: React.FC<PricingToggleProps> = ({
  billing,
  onBillingChange,
  activeColor = 'bg-purple-600',
  animation,
}) => {
  const animConfig = normalizeAnimationConfig(animation);
  const animEnabled = animConfig.enabled !== false;
  const toggleDelay = animConfig.toggleDelay || 0.2;
  
  const toggleAnimation = animEnabled ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: toggleDelay },
  } : {};

  return (
    <motion.div 
      {...toggleAnimation}
      className="flex items-center justify-center mb-12"
    >
      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
        <button
          onClick={() => onBillingChange('monthly')}
          className={cn(
            'px-6 py-2 rounded-md font-medium text-sm transition-all duration-200',
            billing === 'monthly'
              ? cn(activeColor, 'text-white shadow-sm')
              : 'bg-transparent text-gray-700 hover:bg-gray-50'
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => onBillingChange('annual')}
          className={cn(
            'px-6 py-2 rounded-md font-medium text-sm transition-all duration-200',
            billing === 'annual'
              ? cn(activeColor, 'text-white shadow-sm')
              : 'bg-transparent text-gray-700 hover:bg-gray-50'
          )}
        >
          Annual <span className="text-green-600 ml-1">-20%</span>
        </button>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              PRICING TIER CARD                             */
/* -------------------------------------------------------------------------- */

interface PricingTierCardProps {
  tier: PricingTier;
  billing: 'monthly' | 'annual';
  isRecommended: boolean;
  onCtaClick?: (tier: PricingTier, billing: 'monthly' | 'annual') => void;
  index: number;
  defaultBorderColor?: string;
  defaultButtonColor?: string;
  defaultButtonTextColor?: string;
  defaultBadgeColor?: string;
  defaultCardBackgroundColor?: string;
  animation?: AnimationType | AnimationConfig | false;
  isScaled?: boolean; // Whether this card should be scaled (recommended card in carousel mode)
  isBehind?: boolean; // Whether this card should be behind the recommended card
  hasGlassmorphism?: boolean; // Whether to apply glassmorphism effect (when section has background image)
}

const PricingTierCard: React.FC<PricingTierCardProps> = ({
  tier,
  billing,
  isRecommended,
  onCtaClick,
  index,
  defaultBorderColor = 'border-purple-200/60',
  defaultButtonColor,
  defaultButtonTextColor,
  defaultBadgeColor = 'bg-purple-600 text-white',
  defaultCardBackgroundColor = 'bg-white',
  animation,
  isScaled = false,
  isBehind = false,
  hasGlassmorphism = false,
}) => {
  // Normalize animation config
  const animConfig = normalizeAnimationConfig(animation);
  const animEnabled = animConfig.enabled !== false;
  const animType = animConfig.type || 'slide-up';
  const animDuration = animConfig.duration || 0.5;
  const animStaggerDelay = animConfig.staggerDelay || 0.1;
  const featuresDelay = animConfig.featuresDelay || 0.2;
  const featuresStagger = animConfig.featuresStagger || 0.05;
  const currentPrice = billing === 'annual' && tier.price.annual 
    ? tier.price.annual 
    : tier.price.monthly;

  const handleCtaClick = () => {
    onCtaClick?.(tier, billing);
  };

  // Generate colors from cardColor if provided, otherwise use individual props or defaults
  let borderColor: string;
  let buttonColor: string;
  let buttonTextColor: string;
  let badgeColor: string;
  let cardBackgroundColor: string;

  // If card has background image and no explicit button colors, use white buttons for visibility
  const needsLightButton = tier.cardBackgroundImage && !tier.buttonColor;

  if (tier.cardColor) {
    // Use cardColor to generate all color classes
    const colorClasses = getColorClasses(tier.cardColor, isRecommended);
    borderColor = tier.borderColor || colorClasses.borderColor;
    buttonColor = tier.buttonColor || (needsLightButton ? 'bg-white hover:bg-gray-100' : colorClasses.buttonColor);
    buttonTextColor = tier.buttonTextColor || (needsLightButton ? 'text-gray-900' : colorClasses.buttonTextColor);
    badgeColor = tier.badgeColor || (needsLightButton && isRecommended ? 'bg-white text-gray-900' : colorClasses.badgeColor);
    cardBackgroundColor = tier.cardBackgroundColor || colorClasses.cardBackgroundColor;
  } else {
    // Use individual color props or defaults
    borderColor = tier.borderColor || defaultBorderColor;
    badgeColor = tier.badgeColor || (needsLightButton && isRecommended ? 'bg-white text-gray-900' : defaultBadgeColor);
    cardBackgroundColor = tier.cardBackgroundColor || defaultCardBackgroundColor;
    
    // Button colors - use tier-specific or default based on recommended status
    if (tier.buttonColor) {
      buttonColor = tier.buttonColor;
      buttonTextColor = tier.buttonTextColor || (isRecommended ? 'text-white' : 'text-purple-700');
    } else {
      if (needsLightButton) {
        // White buttons for cards with background images
        buttonColor = 'bg-white hover:bg-gray-100';
        buttonTextColor = 'text-gray-900';
      } else if (isRecommended) {
        buttonColor = defaultButtonColor || 'bg-purple-600 hover:bg-purple-700';
        buttonTextColor = defaultButtonTextColor || 'text-white';
      } else {
        buttonColor = 'bg-purple-100 hover:bg-purple-200';
        buttonTextColor = 'text-purple-700';
      }
    }
  }

  const cardAnimation = getCardAnimationVariants(
    animEnabled ? animType : 'none',
    animDuration,
    index * animStaggerDelay
  );

  const badgeAnimation = getBadgeAnimationVariants(animEnabled);

  // Card background style for images
  const cardBackgroundStyle: React.CSSProperties = {};
  if (tier.cardBackgroundImage) {
    cardBackgroundStyle.backgroundImage = `url(${tier.cardBackgroundImage})`;
    cardBackgroundStyle.backgroundSize = 'cover';
    cardBackgroundStyle.backgroundPosition = 'center';
    cardBackgroundStyle.backgroundRepeat = 'no-repeat';
  }

  return (
    <motion.div
      {...cardAnimation}
      className={cn(
        'h-full relative transition-all duration-500 ease-out',
        isScaled && 'z-20 md:scale-110',
        isBehind && 'z-10 md:scale-90 md:opacity-70'
      )}
    >
      {/* Recommended Badge - positioned relative to motion.div wrapper */}
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
          <motion.div
            {...badgeAnimation}
            className={cn(
              'px-4 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap',
              badgeColor
            )}
          >
            MOST POPULAR
          </motion.div>
        </div>
      )}
      <div 
        className={cn(
          'relative h-full flex flex-col rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden',
          // Border color - use white/transparent for cards with background images
          tier.cardBackgroundImage ? 'border-white/30' : borderColor,
          // Glassmorphism effect when section has background image
          hasGlassmorphism && !tier.cardBackgroundImage && [
            'backdrop-blur-md bg-white/10 border-white/20',
            'shadow-lg shadow-black/10',
          ],
          // Regular background when no glassmorphism and no card image
          !hasGlassmorphism && !tier.cardBackgroundImage && cardBackgroundColor,
          // Background image utilities
          tier.cardBackgroundImage && 'bg-cover bg-center bg-no-repeat'
        )}
        style={tier.cardBackgroundImage ? cardBackgroundStyle : undefined}
      >
        {/* Background overlay if specified */}
        {tier.cardBackgroundImage && tier.cardBackgroundOverlay && (
          <div className={cn('absolute inset-0 z-0', tier.cardBackgroundOverlay)} />
        )}

        <div className="relative z-10 p-8 flex flex-col h-full">
          {/* Header */}
          <div className="text-center pb-6">
            <h3 className={cn(
              'text-2xl font-bold mb-2 uppercase tracking-wide',
              (hasGlassmorphism || tier.cardBackgroundImage) ? 'text-white' : 'text-gray-900'
            )}>
              {tier.name}
            </h3>
            {tier.description && (
              <p className={cn(
                'text-base',
                (hasGlassmorphism || tier.cardBackgroundImage) ? 'text-white/90' : 'text-gray-600'
              )}>
                {tier.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mb-8">
            <PriceDisplay price={currentPrice} className={(hasGlassmorphism || tier.cardBackgroundImage) ? 'text-white' : ''} />
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <Button
              variant="none"
              size="lg"
              className={cn(
                'w-full border-0',
                buttonColor,
                buttonTextColor,
                hasGlassmorphism && 'shadow-lg backdrop-blur-sm'
              )}
              onClick={handleCtaClick}
            >
              {tier.ctaLabel || 'Get Started'}
            </Button>
          </div>

          {/* Features List */}
          <div className="flex-1">
            <h4 className={cn(
              'text-sm font-semibold mb-4 uppercase tracking-wide',
              (hasGlassmorphism || tier.cardBackgroundImage) ? 'text-white' : 'text-gray-900'
            )}>
              WHAT'S INCLUDED
            </h4>
            <ul className="space-y-3">
              {tier.features.map((feature, idx) => {
                const featureAnimation = getFeatureAnimationVariants(
                  animEnabled,
                  featuresDelay,
                  featuresStagger,
                  idx
                );
                const hasImageBackground = hasGlassmorphism || tier.cardBackgroundImage;
                return (
                <motion.li
                  key={idx}
                  {...featureAnimation}
                  className={cn(
                    'flex items-start gap-3',
                    !feature.available && 'opacity-50'
                  )}
                >
                  {feature.available !== false ? (
                    <Check 
                      className={cn(
                        'h-5 w-5 mt-0.5 flex-shrink-0',
                        hasImageBackground ? 'text-white' : 'text-green-600'
                      )} 
                      aria-hidden="true"
                    />
                  ) : (
                    <span className={cn(
                      'h-5 w-5 mt-0.5 flex-shrink-0',
                      hasImageBackground ? 'text-white/50' : 'text-gray-400'
                    )}>×</span>
                  )}
                  <span className={cn(
                    'text-sm leading-relaxed',
                    hasImageBackground ? 'text-white/90' : 'text-gray-700'
                  )}>
                    {feature.label}
                  </span>
                </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export const PricingGrid: React.FC<PricingGridProps> = ({
  title = 'Plans that scale',
  titleHighlight = 'with your growth',
  description = 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
  tiers,
  showToggle = true,
  defaultBilling = 'monthly',
  onCtaClick,
  className,
  accentColor = 'text-purple-600',
  toggleActiveColor = 'bg-purple-600',
  titleColor = 'text-gray-900',
  descriptionColor = 'text-gray-600',
  labelColor = 'text-gray-500',
  sectionBackgroundColor = 'bg-white',
  sectionBackgroundImage,
  sectionBackgroundOverlay,
  animation,
  scaleRecommended = true,
  horizontalHeader = false,
}) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>(defaultBilling);

  // Guard against undefined/null tiers
  if (!tiers || !Array.isArray(tiers)) {
    return null;
  }

  // Normalize animation config
  const animConfig = normalizeAnimationConfig(animation);
  const animEnabled = animConfig.enabled !== false;
  const animDuration = animConfig.duration || 0.6;
  const headerDelay = animConfig.headerDelay || 0;

  // Default colors (used when tier doesn't specify its own)
  const defaultBorderColor = 'border-purple-200/60';
  const defaultButtonColor = 'bg-purple-600 hover:bg-purple-700';
  const defaultButtonTextColor = 'text-white';
  const defaultBadgeColor = 'bg-purple-600 text-white';
  const defaultCardBackgroundColor = 'bg-white';

  const headerAnimation = getHeaderAnimationVariants(animEnabled, animDuration, headerDelay);

  // Section background style for images
  const sectionStyle: React.CSSProperties = {};
  if (sectionBackgroundImage) {
    sectionStyle.backgroundImage = `url(${sectionBackgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  }

  return (
    <section 
      className={cn(
        'w-full py-16 px-4 sm:px-6 lg:px-8 relative',
        !sectionBackgroundImage && sectionBackgroundColor,
        sectionBackgroundImage && 'bg-cover bg-center bg-no-repeat',
        className
      )}
      style={sectionBackgroundImage ? sectionStyle : undefined}
    >
      {/* Section background overlay if specified */}
      {sectionBackgroundImage && sectionBackgroundOverlay && (
        <div className={cn('absolute inset-0 z-0', sectionBackgroundOverlay)} />
      )}
      <div className="relative z-10 max-w-7xl mx-auto">
        {horizontalHeader && tiers.length === 2 ? (
          /* Horizontal Layout: Title and Cards on same row */
          <motion.div
            {...headerAnimation}
            className="flex flex-col lg:flex-row lg:items-center lg:gap-12 mb-12"
          >
            {/* Left Side: Title and Description */}
            <div className="flex-1 mb-8 lg:mb-0">
              <p className={cn(
                'text-xs font-semibold uppercase tracking-wider mb-4',
                sectionBackgroundImage ? 'text-white' : labelColor
              )}>
                PRICING
              </p>
              <h2 className={cn(
                'font-bold tracking-tight mb-4 text-3xl md:text-4xl lg:text-5xl',
                sectionBackgroundImage ? 'text-white' : titleColor
              )}>
                {title}{' '}
                <span className={sectionBackgroundImage ? 'text-white' : accentColor}>{titleHighlight}</span>
              </h2>
              {description && (
                <p className={cn(
                  'text-lg',
                  sectionBackgroundImage ? 'text-white' : descriptionColor
                )}>
                  {description}
                </p>
              )}
              {/* Billing Toggle */}
              {showToggle && (
                <div className="mt-6">
                  <PricingToggle 
                    billing={billing} 
                    onBillingChange={setBilling}
                    activeColor={toggleActiveColor}
                    animation={animation}
                  />
                </div>
              )}
            </div>

            {/* Right Side: Cards */}
            <div className={cn(
              'flex-1',
              scaleRecommended 
                ? 'flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 lg:gap-4 relative overflow-visible' 
                : 'grid grid-cols-1 md:grid-cols-2 gap-8'
            )}>
              {tiers.map((tier, index) => {
                const isRecommended = tier.recommended || false;
                const isScaled = scaleRecommended && isRecommended;
                const isBehind = scaleRecommended && !isRecommended;
                
                return (
                  <PricingTierCard
                    key={tier.name}
                    tier={tier}
                    billing={billing}
                    isRecommended={isRecommended}
                    onCtaClick={onCtaClick}
                    index={index}
                    defaultBorderColor={defaultBorderColor}
                    defaultButtonColor={defaultButtonColor}
                    defaultButtonTextColor={defaultButtonTextColor}
                    defaultBadgeColor={defaultBadgeColor}
                    defaultCardBackgroundColor={defaultCardBackgroundColor}
                    animation={animation}
                    isScaled={isScaled}
                    isBehind={isBehind}
                    hasGlassmorphism={!!sectionBackgroundImage}
                  />
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Vertical Layout: Standard layout */
          <>
            {/* Header */}
            <motion.div
              {...headerAnimation}
              className={cn(
                'mb-12',
                horizontalHeader ? 'flex flex-col md:flex-row md:items-center md:justify-between md:gap-8' : 'text-center'
              )}
            >
              <div className={cn(horizontalHeader ? 'flex-1' : '')}>
                <p className={cn(
                  'text-xs font-semibold uppercase tracking-wider mb-4',
                  sectionBackgroundImage ? 'text-white' : labelColor
                )}>
                  PRICING
                </p>
                <h2 className={cn(
                  'font-bold tracking-tight mb-4',
                  horizontalHeader ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-5xl',
                  sectionBackgroundImage ? 'text-white' : titleColor
                )}>
                  {title}{' '}
                  <span className={sectionBackgroundImage ? accentColor : accentColor}>{titleHighlight}</span>
                </h2>
              </div>
              {description && (
                <p className={cn(
                  'text-lg',
                  horizontalHeader 
                    ? 'flex-1 text-left md:text-right' 
                    : 'max-w-2xl mx-auto',
                  sectionBackgroundImage ? 'text-white' : descriptionColor
                )}>
                  {description}
                </p>
              )}
            </motion.div>

            {/* Billing Toggle */}
            {showToggle && (
              <PricingToggle 
                billing={billing} 
                onBillingChange={setBilling}
                activeColor={toggleActiveColor}
                animation={animation}
              />
            )}

            {/* Pricing Tiers Grid */}
            <div className={cn(
              scaleRecommended 
                ? 'flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 lg:gap-4 relative overflow-visible' 
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            )}>
              {tiers.map((tier, index) => {
                const isRecommended = tier.recommended || false;
                const isScaled = scaleRecommended && isRecommended;
                const isBehind = scaleRecommended && !isRecommended;
                
                return (
                  <PricingTierCard
                    key={tier.name}
                    tier={tier}
                    billing={billing}
                    isRecommended={isRecommended}
                    onCtaClick={onCtaClick}
                    index={index}
                    defaultBorderColor={defaultBorderColor}
                    defaultButtonColor={defaultButtonColor}
                    defaultButtonTextColor={defaultButtonTextColor}
                    defaultBadgeColor={defaultBadgeColor}
                    defaultCardBackgroundColor={defaultCardBackgroundColor}
                    animation={animation}
                    isScaled={isScaled}
                    isBehind={isBehind}
                    hasGlassmorphism={!!sectionBackgroundImage}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};