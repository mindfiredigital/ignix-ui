import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import {
    Linkedin,
    Github,
    Twitter,
    Globe,
    Mail,
    MapPin,
    Award,
    ChevronRight,
    X
} from 'lucide-react';
import { cn } from '@site/src/utils/cn';
import { Typography } from '@site/src/components/UI/typography';
import { Button } from '@site/src/components/UI/button';

/* ============================================
   TYPES & INTERFACES
============================================ */

export interface SocialLink {
    platform: 'linkedin' | 'github' | 'twitter' | 'website' | 'email' | 'other';
    url: string;
    label?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    photo?: string;
    photoAlt?: string;
    socialLinks?: SocialLink[];
    department?: string;
    location?: string;
    expertise?: string[];
    awards?: string[];
    joinDate?: string;
    email?: string;
}

interface TeamContextType {
    theme: 'light' | 'dark';
    cardVariant: 'default' | 'minimal' | 'elevated' | 'bordered';
    showBio: boolean;
    showSocialLinks: boolean;
    showDepartment: boolean;
    showLocation: boolean;
    showExpertise: boolean;
    showAwards: boolean;
    showJoinDate: boolean;
    enableHover: boolean;
    isVisible: boolean;
    animationType: 'fade' | 'slide' | 'scale' | 'stagger';
    animationDelay: number;
    onSocialClick?: (member: TeamMember, platform: string, url: string) => void;
    onMemberClick?: (member: TeamMember) => void;
    setSelectedMember?: (member: TeamMember | null) => void;
}

const TeamContext = React.createContext<TeamContextType | undefined>(undefined);

const useTeam = () => {
    const context = React.useContext(TeamContext);
    if (!context) {
        throw new Error('Team components must be used within TeamProfiles');
    }
    return context;
};

/* ============================================
   SOCIAL ICON COMPONENT
============================================ */

export const SocialIcon: React.FC<{ platform: string; className?: string }> = ({
    platform,
    className
}) => {
    const iconProps = { className: cn("w-4 h-4 cursor-pointer", className) };

    switch (platform.toLowerCase()) {
        case 'linkedin':
            return <Linkedin {...iconProps} />;
        case 'github':
            return <Github {...iconProps} />;
        case 'twitter':
            return <Twitter {...iconProps} />;
        case 'website':
            return <Globe {...iconProps} />;
        case 'email':
            return <Mail {...iconProps} />;
        default:
            return <Globe {...iconProps} />;
    }
};

/* ============================================
   MEMBER CARD COMPONENTS (Compound)
============================================ */

// Member Card Container
export const MemberCard: React.FC<{
    member: TeamMember;
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}> = ({ member, children, className, onClick }) => {
    const {
        theme,
        cardVariant,
        enableHover,
        isVisible,
        // animationType,
        animationDelay,
        onMemberClick,
        setSelectedMember
    } = useTeam();

    const getAnimationProps = () => {
        // In a real scenario, index would come from context or parent
        // Using a simple fade animation as default
        return {
            initial: { opacity: 0, y: 20 },
            animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
            transition: { duration: 0.5, delay: animationDelay }
        };
    };

    const cardVariants = cva(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        {
            variants: {
                variant: {
                    default: "rounded-xl shadow-sm hover:shadow-md",
                    minimal: "rounded-lg",
                    elevated: "rounded-2xl shadow-lg hover:shadow-xl",
                    bordered: "rounded-xl border-2 hover:border-primary",
                },
                theme: {
                    light: "bg-white text-gray-900",
                    dark: "bg-gray-800 text-gray-50",
                },
            },
            compoundVariants: [
                // Light theme variants
                { theme: "light", variant: "default", className: "bg-white" },
                { theme: "light", variant: "minimal", className: "bg-transparent" },
                { theme: "light", variant: "elevated", className: "bg-white" },
                { theme: "light", variant: "bordered", className: "bg-white border-gray-200" },
                // Dark theme variants
                { theme: "dark", variant: "default", className: "bg-gray-800" },
                { theme: "dark", variant: "minimal", className: "bg-transparent" },
                { theme: "dark", variant: "elevated", className: "bg-gray-800" },
                { theme: "dark", variant: "bordered", className: "bg-gray-800 border-gray-700" },
            ],
            defaultVariants: {
                variant: "default",
                theme: "light",
            },
        }
    );

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        if (onMemberClick) {
            onMemberClick(member);
        }
        if (setSelectedMember) {
            setSelectedMember(member);
        }
    };

    return (
        <motion.div
            {...getAnimationProps()}
            className={cn(
                cardVariants({ variant: cardVariant, theme }),
                enableHover && "hover:scale-101 hover:-translate-y-1",
                className
            )}
            onClick={handleClick}
            role="article"
            aria-label={`Team member: ${member.name}`}
        >
            {children}
        </motion.div>
    );
};

// Member Photo
export const MemberPhoto: React.FC<{
    src?: string;
    alt?: string;
    initials?: string;
    className?: string;
}> = ({ src, alt, initials, className }) => {
    const [imageError, setImageError] = useState(false);

    if (src && !imageError) {
        return (
            <div className={cn("relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700", className)}>
                <img
                    src={src}
                    alt={alt || "Team member"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div className={cn(
            "relative aspect-square overflow-hidden flex items-center justify-center",
            "bg-gradient-to-br from-primary/20 to-secondary/20",
            className
        )}>
            <Typography variant="h2" weight="bold" className="text-primary">
                {initials || "TM"}
            </Typography>
        </div>
    );
};

// Member Content
export const MemberContent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div className={cn("p-5", className)}>
            {children}
        </div>
    );
};

// Member Name
export const MemberName: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { theme } = useTeam();

    return (
        <Typography
            variant="h4"
            weight="semibold"
            className={cn(
                "mb-1",
                theme === 'dark' ? 'text-white' : 'text-gray-900',
                className
            )}
        >
            {children}
        </Typography>
    );
};

// Member Role
export const MemberRole: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { theme } = useTeam();

    return (
        <Typography
            variant="body"
            className={cn(
                "mb-2 text-sm",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
                className
            )}
        >
            {children}
        </Typography>
    );
};

// Member Department
export const MemberDepartment: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { theme } = useTeam();

    return (
        <div className={cn("flex items-center gap-1 mb-2", className)}>
            <Award className={cn(
                "w-3 h-3",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )} />
            <Typography
                variant="small"
                className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
            >
                {children}
            </Typography>
        </div>
    );
};

// Member Location
export const MemberLocation: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { theme } = useTeam();

    return (
        <div className={cn("flex items-center gap-1 mb-2", className)}>
            <MapPin className={cn(
                "w-3 h-3",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )} />
            <Typography
                variant="small"
                className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
            >
                {children}
            </Typography>
        </div>
    );
};

// Member Bio
export const MemberBio: React.FC<{
    children: React.ReactNode;
    className?: string;
    lines?: number;
}> = ({ children, className, lines = 2 }) => {
    const { theme } = useTeam();

    return (
        <Typography
            variant="small"
            className={cn(
                `line-clamp-${lines}`,
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
                className
            )}
        >
            {children}
        </Typography>
    );
};

// Member Join Date
export const MemberJoinDate: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { theme } = useTeam();

    return (
        <Typography
            variant="small"
            className={cn(
                "mt-2 text-xs",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
                className
            )}
        >
            Joined {children}
        </Typography>
    );
};

// Member Expertise Tags
export const MemberExpertise: React.FC<{
    items: string[];
    limit?: number;
    className?: string;
}> = ({ items, limit = 3, className }) => {
    const { theme } = useTeam();
    const displayItems = items.slice(0, limit);
    const remaining = items.length - limit;

    if (!items.length) return null;

    return (
        <div className={cn("flex flex-wrap gap-1 mt-3", className)}>
            {displayItems.map((skill, idx) => (
                <span
                    key={idx}
                    className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        theme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-700'
                    )}
                >
                    {skill}
                </span>
            ))}
            {remaining > 0 && (
                <span className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    theme === 'dark'
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-700'
                )}>
                    +{remaining}
                </span>
            )}
        </div>
    );
};

// Member Awards
export const MemberAwards: React.FC<{
    items: string[];
    limit?: number;
    className?: string;
}> = ({ items, limit = 1, className }) => {
    const { theme } = useTeam();
    const displayItems = items.slice(0, limit);
    const remaining = items.length - limit;

    if (!items.length) return null;

    return (
        <div className={cn("mt-2", className)}>
            <Typography
                variant="small"
                weight="medium"
                className={cn(
                    "text-xs uppercase tracking-wider",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}
            >
                Awards
            </Typography>
            <div className="mt-1 space-y-1">
                {displayItems.map((award, idx) => (
                    <Typography
                        key={idx}
                        variant="small"
                        className={cn(
                            "text-xs line-clamp-1",
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        )}
                    >
                        🏆 {award}
                    </Typography>
                ))}
                {remaining > 0 && (
                    <Typography
                        variant="small"
                        className={cn(
                            "text-xs",
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        )}
                    >
                        +{remaining} more
                    </Typography>
                )}
            </div>
        </div>
    );
};

// Member Social Links
export const MemberSocialLinks: React.FC<{
    links: SocialLink[];
    memberId?: string;
    memberName?: string;
    className?: string;
}> = ({ links, memberId, memberName, className }) => {
    const { theme, onSocialClick } = useTeam();

    if (!links.length) return null;

    const handleClick = (link: SocialLink, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSocialClick && memberId && memberName) {
            onSocialClick({ id: memberId, name: memberName } as TeamMember, link.platform, link.url);
        }
        window.open(link.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={cn(
            "flex items-center gap-2 mt-4 pt-3 border-t",
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
            className
        )}>
            {links.map((link, idx) => (
                <button
                    key={idx}
                    onClick={(e) => handleClick(link, e)}
                    className={cn(
                        "p-2 rounded-full transition-all duration-200",
                        theme === 'dark'
                            ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                            : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                    )}
                    aria-label={link.label || `Social link`}
                >
                    <SocialIcon platform={link.platform} />
                </button>
            ))}
        </div>
    );
};

// Member Card Hover Overlay
export const MemberCardOverlay: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div className={cn(
            "absolute inset-0 bg-black/50 opacity-0  transition-opacity duration-300 flex items-center justify-center",
            className
        )}>
            {children || (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-white border-white hover:bg-white/20"
                >
                    View Profile
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            )}
        </div>
    );
};

/* ============================================
   GRID COMPONENTS
============================================ */

export const TeamGrid: React.FC<{
    children: React.ReactNode;
    columns?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
        wide?: number;
    };
    gap?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}> = ({ children, columns = { mobile: 1, tablet: 2, desktop: 3, wide: 4 }, gap = 'md', className }) => {
    const gridVariants = cva(
        "grid",
        {
            variants: {
                gap: {
                    sm: "gap-3 md:gap-4",
                    md: "gap-4 md:gap-6",
                    lg: "gap-6 md:gap-8",
                    xl: "gap-8 md:gap-10",
                },
            },
            defaultVariants: {
                gap: 'md',
            },
        }
    );

    const getColumnsClass = () => {
        return cn(
            `grid-cols-${columns.mobile || 1}`,
            columns.tablet && `sm:grid-cols-${columns.tablet}`,
            columns.desktop && `lg:grid-cols-${columns.desktop}`,
            columns.wide && `xl:grid-cols-${columns.wide}`
        );
    };

    return (
        <div className={cn(getColumnsClass(), gridVariants({ gap }), className)}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement<Record<string, unknown>>(child)) {
                    return React.cloneElement(child, {
                        ...child.props,
                        // Pass index for animation if needed
                        'data-index': index
                    });
                }
                return child;
            })}
        </div>
    );
};

/* ============================================
   HEADER COMPONENTS
============================================ */

export const TeamHeader: React.FC<{
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
}> = ({ children, title, subtitle, className }) => {
    const { theme } = useTeam();

    if (children) {
        return <div className={cn("mb-8 md:mb-12 text-center", className)}>{children}</div>;
    }

    return (
        <div className={cn("mb-8 md:mb-12 text-center", className)}>
            {title && (
                <Typography
                    variant="h2"
                    weight="bold"
                    className={cn(
                        "mb-3",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}
                >
                    {title}
                </Typography>
            )}
            {subtitle && (
                <Typography
                    variant="lead"
                    className={cn(
                        "max-w-2xl mx-auto",
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}
                >
                    {subtitle}
                </Typography>
            )}
        </div>
    );
};

export const TeamFooter: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div className={cn("mt-8 md:mt-12", className)}>
            {children}
        </div>
    );
};

/* ============================================
   MODAL COMPONENTS
============================================ */

export const TeamModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    member: TeamMember | null;
    children?: React.ReactNode;
}> = ({ isOpen, onClose, member, children }) => {
    const { theme } = useTeam();

    if (!isOpen || !member) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getInitials = () => {
        return member.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={`Profile: ${member?.name}`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={cn(
                    "relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl",
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                )}
            >
                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-4 right-4 p-2 rounded-full z-10",
                        theme === 'dark'
                            ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    )}
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {children || (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/5">
                            {member.photo ? (
                                <img
                                    src={member.photo}
                                    alt={member.photoAlt || member.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <Typography variant="h1" weight="bold" className="text-primary">
                                        {getInitials()}
                                    </Typography>
                                </div>
                            )}
                        </div>
                        <div className="md:w-3/5 p-6">
                            <Typography variant="h2" weight="bold" className="mb-1">
                                {member.name}
                            </Typography>
                            <Typography variant="h4" className="mb-4 text-gray-600 dark:text-gray-300">
                                {member.role}
                            </Typography>
                            {member.department && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="w-4 h-4 text-gray-400" />
                                    <Typography variant="body">{member.department}</Typography>
                                </div>
                            )}
                            {member.location && (
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <Typography variant="body">{member.location}</Typography>
                                </div>
                            )}
                            <Typography variant="body" className="mb-6 leading-relaxed">
                                {member.bio}
                            </Typography>
                            {member.expertise && member.expertise.length > 0 && (
                                <div className="mb-6">
                                    <Typography variant="small" weight="bold" className="mb-2">
                                        Expertise
                                    </Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {member.expertise.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className={cn(
                                                    "px-3 py-1 text-sm rounded-full",
                                                    theme === 'dark'
                                                        ? 'bg-gray-700 text-gray-200'
                                                        : 'bg-gray-100 text-gray-700'
                                                )}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {member.socialLinks && member.socialLinks.length > 0 && (
                                <div className="flex items-center gap-3">
                                    {member.socialLinks.map((link, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => window.open(link.url, '_blank')}
                                            className={cn(
                                                "p-3 rounded-full transition-colors",
                                                theme === 'dark'
                                                    ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                                                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                                            )}
                                        >
                                            <SocialIcon platform={link.platform} className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

/* ============================================
   VARIANT DEFINITIONS
============================================ */

const sectionVariants = cva(
    "w-full transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                primary: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                accent: "bg-accent text-accent-foreground",
                muted: "bg-muted text-muted-foreground",
                gradient: "bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground",
                glass: "bg-background/80 backdrop-blur-md border border-border",
                dark: "bg-gray-950 text-gray-50",
                light: "bg-gray-50 text-gray-900",
            },
            padding: {
                none: "py-0",
                sm: "py-8 md:py-12",
                md: "py-12 md:py-16",
                lg: "py-16 md:py-20",
                xl: "py-20 md:py-24",
                '2xl': "py-24 md:py-32",
            },
        },
        defaultVariants: {
            variant: "default",
            padding: "lg",
        },
    }
);

/* ============================================
   MAIN COMPONENT
============================================ */

export interface TeamProfilesProps {
    // Layout & Variants
    variant?: VariantProps<typeof sectionVariants>['variant'];
    cardVariant?: 'default' | 'minimal' | 'elevated' | 'bordered';

    // Features
    showBio?: boolean;
    showSocialLinks?: boolean;
    showDepartment?: boolean;
    showLocation?: boolean;
    showExpertise?: boolean;
    showAwards?: boolean;
    showJoinDate?: boolean;
    enableModal?: boolean;
    enableHover?: boolean;

    // Styling
    theme?: 'light' | 'dark';
    forceTheme?: boolean;
    backgroundType?: 'solid' | 'gradient' | 'image';
    backgroundColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    backgroundImage?: string;

    // Animation
    animate?: boolean;
    animationDelay?: number;
    animationType?: 'fade' | 'slide' | 'scale' | 'stagger';

    // Spacing
    padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';

    // Actions
    onMemberClick?: (member: TeamMember) => void;
    onSocialClick?: (member: TeamMember, platform: string, url: string) => void;

    // Accessibility
    ariaLabel?: string;

    // Children
    children: React.ReactNode;
}

export const TeamProfiles: React.FC<TeamProfilesProps> = ({
    // Layout & Variants
    variant = "default",
    cardVariant = "default",

    // Features
    showBio = true,
    showSocialLinks = true,
    showDepartment = false,
    showLocation = false,
    showExpertise = false,
    showAwards = false,
    showJoinDate = false,
    enableModal = false,
    enableHover = true,

    // Styling
    theme,
    forceTheme = false,
    backgroundType = "solid",
    backgroundColor,
    gradientFrom,
    gradientTo,
    backgroundImage,

    // Animation
    animate = true,
    animationDelay = 0,
    animationType = "fade",

    // Spacing
    padding = "lg",

    // Actions
    onMemberClick,
    onSocialClick,

    // Accessibility
    ariaLabel = "Team profiles section",

    // Children
    children,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    // Determine theme
    const resolvedTheme = theme ||
        (variant === 'dark' ? 'dark' :
            variant === 'light' ? 'light' :
                variant === 'gradient' ? 'dark' : 'light');

    // Handle background styling
    const backgroundStyle: React.CSSProperties = {};
    if (backgroundType === 'gradient' && gradientFrom && gradientTo) {
        backgroundStyle.background = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;
    } else if (backgroundType === 'solid' && backgroundColor) {
        backgroundStyle.backgroundColor = backgroundColor;
    } else if (backgroundType === 'image' && backgroundImage) {
        backgroundStyle.backgroundImage = `url(${backgroundImage})`;
        backgroundStyle.backgroundSize = 'cover';
        backgroundStyle.backgroundPosition = 'center';
    }

    // Trigger animation
    React.useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [animate]);

    // Close modal
    const handleCloseModal = () => {
        setSelectedMember(null);
    };

    // Context value
    const contextValue: TeamContextType = {
        theme: resolvedTheme,
        cardVariant,
        showBio,
        showSocialLinks,
        showDepartment,
        showLocation,
        showExpertise,
        showAwards,
        showJoinDate,
        enableHover,
        isVisible,
        animationType,
        animationDelay,
        onSocialClick,
        onMemberClick,
        setSelectedMember: enableModal ? setSelectedMember : undefined,
    };

    return (
        <TeamContext.Provider value={contextValue}>
            <section
                className={cn(
                    sectionVariants({ variant, padding }),
                    forceTheme && resolvedTheme === 'dark' && 'dark',
                    "relative"
                )}
                style={backgroundStyle}
                aria-label={ariaLabel}
            >
                {/* Background overlay for image/gradient */}
                {backgroundType === 'image' && (
                    <div className="absolute inset-0 bg-black/40" />
                )}

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {children}
                </div>
            </section>

            {/* Modal */}
            {enableModal && selectedMember && (
                <TeamModal
                    isOpen={!!selectedMember}
                    onClose={handleCloseModal}
                    member={selectedMember}
                />
            )}
        </TeamContext.Provider>
    );
};