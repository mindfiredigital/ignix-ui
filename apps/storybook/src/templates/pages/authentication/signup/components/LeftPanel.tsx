// components/LeftPanel.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../../../../utils/cn";
import {
    DEFAULT_FEATURES,
    DEFAULT_ANIMATION_CONFIG,
    DEFAULT_COMPANY_NAME
} from "../config";
import { type LeftPanelProps } from "../types";
import { Check, Star } from "lucide-react";


/**
 * Left panel component for split layout that displays promotional content,
 * features, testimonials, and statistics alongside the registration form.
 * 
 * @component LeftPanel
 * @description Provides a visually appealing left panel for split layout
 * registration forms. Includes customizable content with animations,
 * features lists, testimonials, and statistics.
 * 
 * @param {LeftPanelProps} props - Component properties
 * @param {string} [props.companyName="YourBrand"] - Company/brand name
 * @param {React.ReactNode} [props.logo] - Custom logo component
 * @param {Object} [props.splitBackground] - Background customization
 * @param {Object} [props.leftPanelContent] - Content customization
 * @param {boolean} props.isDarkVariant - Whether dark theme is active
 * 
 * @returns {React.ReactElement} Left panel component
 * 
 * @example
 * // Basic usage
 * <LeftPanel
 *   companyName="MyApp"
 *   isDarkVariant={false}
 * />
 * 
 * @example
 * // With custom content
 * <LeftPanel
 *   companyName="Enterprise Corp"
 *   splitBackground={{
 *     gradient: "bg-gradient-to-br from-blue-900 to-purple-900",
 *     backgroundImage: "/background.jpg"
 *   }}
 *   leftPanelContent={{
 *     title: "Join Enterprise Corp",
 *     description: "Enterprise-grade solutions",
 *     features: [
 *       { text: "24/7 Support", icon: <Support /> },
 *       { text: "99.9% Uptime", icon: <Activity /> }
 *     ],
 *     statistics: [
 *       { value: "10K+", label: "Customers" },
 *       { value: "99%", label: "Satisfaction" }
 *     ]
 *   }}
 *   isDarkVariant={true}
 * />
 */
const LeftPanel: React.FC<LeftPanelProps> = ({
    companyName = DEFAULT_COMPANY_NAME,
    logo,
    splitBackground,
    leftPanelContent,
    isDarkVariant,
}) => {
    const getLeftPanelContent = () => {
        const {
            title,
            description,
            subtitle,
            features,
            testimonials,
            statistics,
            customContent,
            footerText,
            hideBranding = false,
            contentClassName,
            layout = {
                align: "center",
                maxWidth: "max-w-2xl",
                animate: true
            },
            animationConfig = DEFAULT_ANIMATION_CONFIG
        } = leftPanelContent || {};

        const mergedAnimationConfig = {
            ...DEFAULT_ANIMATION_CONFIG,
            ...animationConfig
        };

        const alignClass = {
            left: "items-start text-left",
            center: "items-center text-center",
            right: "items-end text-right"
        }[layout.align || "center"];

        const panelTitle = title || (
            <div className="space-y-4">
                <div className="text-5xl font-bold leading-tight tracking-tight">
                    Join Our Community
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    at {companyName}
                </div>
            </div>
        );

        const panelDescription = description || (
            <p className="text-lg leading-relaxed">
                Create your account to unlock exclusive features, personalized content,
                and join thousands of satisfied users worldwide.
            </p>
        );

        const panelFeatures = features || DEFAULT_FEATURES;

        return {
            panelTitle,
            panelDescription,
            subtitle,
            panelFeatures,
            testimonials,
            statistics,
            customContent,
            footerText,
            hideBranding,
            contentClassName,
            mergedAnimationConfig,
            layout,
            alignClass,
            maxWidth: layout.maxWidth || "max-w-2xl",
            shouldAnimate: layout.animate !== false,
        };
    };

    const getSplitLayoutStyles = () => {
        const defaultGradient = isDarkVariant
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600";

        const defaultTextColor = "text-white";
        const defaultCompanyNameColor = "text-white";
        const defaultDescriptionColor = "text-white/90";

        const backgroundStyle = splitBackground?.backgroundImage
            ? {
                backgroundImage: `url(${splitBackground.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }
            : {};

        const overlayStyle = splitBackground?.backgroundImage && splitBackground?.overlayColor
            ? {
                backgroundColor: splitBackground.overlayColor,
            }
            : {};

        return {
            leftPanelClasses: cn(
                "flex-1 flex flex-col p-8 md:p-12 lg:p-16 hidden lg:flex relative",
                splitBackground?.gradient || defaultGradient,
                splitBackground?.leftPanelClassName
            ),
            textColor: splitBackground?.textColor || defaultTextColor,
            companyNameColor: splitBackground?.companyNameColor || defaultCompanyNameColor,
            descriptionColor: splitBackground?.descriptionColor || defaultDescriptionColor,
            backgroundStyle,
            overlayStyle,
        };
    };

    const defaultLogo = (
        <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
            isDarkVariant
                ? "bg-gradient-to-br from-green-900/30 to-emerald-800/20 border border-emerald-700/30"
                : "bg-gradient-to-br from-green-100 to-emerald-50 border border-emerald-200"
        )}>
            <UserPlus className={cn(
                "w-8 h-8",
                isDarkVariant
                    ? "text-emerald-400 drop-shadow"
                    : "text-emerald-600"
            )} />
        </div>
    );

    const renderContent = () => {
        const {
            panelTitle,
            panelDescription,
            subtitle,
            panelFeatures,
            testimonials,
            statistics,
            customContent,
            footerText,
            hideBranding,
            contentClassName,
            mergedAnimationConfig,
            layout,
            alignClass,
            maxWidth,
            shouldAnimate,
        } = getLeftPanelContent();

        const splitStyles = getSplitLayoutStyles();

        if (customContent) {
            return customContent;
        }

        const MotionDiv = shouldAnimate ? motion.div : "div";

        return (
            <div className={cn("w-full h-full flex items-center justify-center relative z-10", contentClassName)}>
                <div className={cn(
                    "relative z-10 flex flex-col w-full",
                    alignClass,
                    maxWidth
                )}>
                    {/* Branding Section */}
                    {!hideBranding && (
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { x: -50, opacity: 0 },
                                animate: { x: 0, opacity: 1 },
                                transition: { duration: 0.6 }
                            } : {})}
                            className={cn(
                                "flex items-center gap-4 mb-12",
                                layout.align === "left" ? "justify-start" :
                                    layout.align === "right" ? "justify-end" : "justify-center"
                            )}
                        >
                            {logo || defaultLogo}
                            <span className={cn(
                                "text-2xl md:text-3xl font-bold tracking-tight",
                                splitStyles.companyNameColor
                            )}>
                                {companyName}
                            </span>
                        </MotionDiv>
                    )}

                    {/* Main Content */}
                    <div className="space-y-10">
                        {/* Title Section */}
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { y: 30, opacity: 0 },
                                animate: { y: 0, opacity: 1 },
                                transition: { delay: mergedAnimationConfig.titleDelay, duration: 0.6 }
                            } : {})}
                            className="space-y-6"
                        >
                            <div className={cn("space-y-4", splitStyles.textColor)}>
                                {panelTitle}
                            </div>

                            {/* Subtitle */}
                            {subtitle && (
                                <div className={cn(
                                    "text-xl md:text-2xl font-semibold leading-relaxed",
                                    splitStyles.descriptionColor
                                )}>
                                    {subtitle}
                                </div>
                            )}

                            {/* Description */}
                            <div className={cn(
                                "text-base md:text-lg leading-relaxed",
                                splitStyles.descriptionColor
                            )}>
                                {panelDescription}
                            </div>
                        </MotionDiv>

                        {/* Features List */}
                        {panelFeatures.length > 0 && (
                            <MotionDiv
                                {...(shouldAnimate ? {
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { delay: mergedAnimationConfig.featuresDelay, duration: 0.5 }
                                } : {})}
                                className={cn(
                                    "space-y-4",
                                    layout.align === "center" && "mx-auto",
                                    panelFeatures.length > 4 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""
                                )}
                            >
                                {panelFeatures.map((feature, index) => (
                                    <MotionDiv
                                        key={index}
                                        {...(shouldAnimate ? {
                                            initial: { x: -20, opacity: 0 },
                                            animate: { x: 0, opacity: 1 },
                                            transition: {
                                                delay: mergedAnimationConfig.featuresDelay + (index * mergedAnimationConfig.staggerChildren),
                                                duration: 0.4
                                            }
                                        } : {})}
                                        className="flex items-start gap-3 group"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                                            "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                                            "shadow-md",
                                            feature.iconColor || "bg-white/20"
                                        )}>
                                            {feature.icon || <Check className="w-5 h-5 text-white" />}
                                        </div>
                                        <span className={cn(
                                            "text-base leading-tight pt-1",
                                            feature.textClassName || "font-semibold text-white/95"
                                        )}>
                                            {feature.text}
                                        </span>
                                    </MotionDiv>
                                ))}
                            </MotionDiv>
                        )}

                        {/* Statistics */}
                        {statistics && statistics.length > 0 && (
                            <MotionDiv
                                {...(shouldAnimate ? {
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { delay: mergedAnimationConfig.featuresDelay + 0.2, duration: 0.5 }
                                } : {})}
                                className={cn(
                                    "grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/10",
                                    layout.align === "center" && "mx-auto"
                                )}
                            >
                                {statistics.map((stat, index) => (
                                    <MotionDiv
                                        key={index}
                                        {...(shouldAnimate ? {
                                            initial: { scale: 0.8, opacity: 0 },
                                            animate: { scale: 1, opacity: 1 },
                                            transition: {
                                                delay: mergedAnimationConfig.featuresDelay + 0.3 + (index * 0.1),
                                                duration: 0.4
                                            }
                                        } : {})}
                                        className="text-center space-y-1"
                                    >
                                        <div className={cn(
                                            "text-3xl md:text-4xl font-bold tracking-tight",
                                            splitStyles.companyNameColor
                                        )}>
                                            {stat.value}
                                        </div>
                                        <div className={cn(
                                            "text-sm font-semibold uppercase tracking-wider",
                                            splitStyles.descriptionColor
                                        )}>
                                            {stat.label}
                                        </div>
                                        {stat.subtext && (
                                            <div className={cn(
                                                "text-xs opacity-80",
                                                splitStyles.descriptionColor
                                            )}>
                                                {stat.subtext}
                                            </div>
                                        )}
                                    </MotionDiv>
                                ))}
                            </MotionDiv>
                        )}

                        {/* Testimonials */}
                        {testimonials && testimonials.length > 0 && (
                            <MotionDiv
                                {...(shouldAnimate ? {
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { delay: mergedAnimationConfig.featuresDelay + 0.4, duration: 0.5 }
                                } : {})}
                                className={cn(
                                    "pt-8",
                                    layout.align === "center" && "mx-auto"
                                )}
                            >
                                <div className="space-y-6">
                                    <div className={cn(
                                        "text-sm font-semibold uppercase tracking-wider mb-4",
                                        splitStyles.descriptionColor
                                    )}>
                                        Trusted by Industry Leaders
                                    </div>
                                    {testimonials.map((testimonial, index) => (
                                        <MotionDiv
                                            key={index}
                                            {...(shouldAnimate ? {
                                                initial: { opacity: 0, x: -20 },
                                                animate: { opacity: 1, x: 0 },
                                                transition: {
                                                    delay: mergedAnimationConfig.featuresDelay + 0.5 + (index * 0.1),
                                                    duration: 0.4
                                                }
                                            } : {})}
                                            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                </div>
                                                <div>
                                                    <p className={cn(
                                                        "text-sm md:text-base leading-relaxed italic",
                                                        splitStyles.descriptionColor
                                                    )}>
                                                        "{testimonial.quote}"
                                                    </p>
                                                    <div className={cn(
                                                        "text-sm mt-4 flex flex-col sm:flex-row sm:items-center gap-1",
                                                        splitStyles.descriptionColor
                                                    )}>
                                                        <span className="font-semibold">{testimonial.author}</span>
                                                        {testimonial.role && (
                                                            <>
                                                                <span className="hidden sm:inline mx-2 opacity-50">•</span>
                                                                <span className="opacity-75">{testimonial.role}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </MotionDiv>
                                    ))}
                                </div>
                            </MotionDiv>
                        )}
                    </div>

                    {/* Footer */}
                    {footerText !== null && (
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { y: 20, opacity: 0 },
                                animate: { y: 0, opacity: 1 },
                                transition: { delay: mergedAnimationConfig.featuresDelay + 0.6, duration: 0.5 }
                            } : {})}
                            className={cn(
                                "mt-12 pt-8 border-t border-white/10",
                                splitStyles.descriptionColor
                            )}
                        >
                            {footerText || (
                                <div className="text-sm">
                                    <span className="font-semibold">© 2024 {companyName}</span>
                                    <span className="opacity-70 ml-2">• All rights reserved</span>
                                </div>
                            )}
                        </MotionDiv>
                    )}
                </div>
            </div>
        );
    };

    const splitStyles = getSplitLayoutStyles();

    return (
        <div
            className={splitStyles.leftPanelClasses}
            style={splitStyles.backgroundStyle}
        >
            {/* Overlay for background image */}
            {splitStyles.backgroundStyle.backgroundImage && (
                <div
                    className="absolute inset-0"
                    style={splitStyles.overlayStyle}
                />
            )}
            {renderContent()}
        </div>
    );
};

// Add the missing import
import { UserPlus } from "lucide-react";

export { LeftPanel };