import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import {
    Camera,
    User,
    Edit3,
    Lock,
    Save,
    X,
    Loader2,
    Plus,
    Trash2,
    Link as LinkIcon,
    Twitter,
    Github,
    Linkedin,
    Mail,
    Briefcase,
    Globe as Earth,
    MapPin,
    CheckCircle
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Avatar } from '../avatar';
import { Button } from '../button';
import { AnimatedInput } from '../input';
import { Typography } from '../typography';

/* ============================================
   TYPES & INTERFACES
============================================ */

// Add notification type
interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

interface ProfileData {
    displayName: string;
    email: string;
    bio: string;
    avatarUrl: string | null;
    socialLinks: SocialLink[];
    location?: string;
    jobTitle?: string;
    website?: string;
    phone?: string;
}

interface AvatarUploaderProps {
    name: string;
    avatarUrl?: string;
    isEditing: boolean;
    onAvatarChange: (file: File | null, previewUrl: string | null) => void;
    shape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'star' | 'diamond' | 'pentagon' | 'octagon';
    size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    status?: 'online' | 'offline' | 'away' | 'busy' | undefined;
}

interface ProfileFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChange?: (value: string) => void;
    type?: 'text' | 'textarea' | 'email' | 'tel' | 'url';
    readOnly?: boolean;
    placeholder?: string;
    rows?: number;
    inputVariant?: string;
    icon?: React.ElementType;
}

interface SocialLinksListProps {
    links: SocialLink[];
    isEditing: boolean;
    onLinksChange: (links: SocialLink[]) => void;
}

interface SaveCancelBarProps {
    onSave: () => void;
    onCancel: () => void;
    isSaving?: boolean;
    saveButtonVariant?: string;
    cancelButtonVariant?: string;
}

interface ProfileProps {
    // Header customization
    headerTitle?: string;
    headerIcon?: React.ReactNode;

    // Initial profile data
    initialProfileData?: Partial<ProfileData>;

    // Callbacks
    onSave?: (data: ProfileData, avatarFile?: File | null) => Promise<void> | void;
    onCancel?: () => void;

    // Variants
    variant?: VariantProps<typeof ProfileVariants>["variant"];
    animationVariant?: "fadeUp" | "scaleIn" | "slideUp" | "slideLeft" | "slideRight";

    // Component variants
    avatarShape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'star';
    avatarSize?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    inputVariant?: string;
    buttonVariant?: string;
    buttonAnimationVariant?: string;

    // Custom content
    customHeader?: React.ReactNode;
    customAvatarSection?: React.ReactNode;
    customSocialLinks?: React.ReactNode;

    // Labels
    editButtonLabel?: string;
    // saveButtonLabel?: string;
    // cancelButtonLabel?: string;
    // savingButtonLabel?: string;

    // States
    isLoading?: boolean;
    showStatus?: boolean;
    status?: 'online' | 'offline' | 'away' | 'busy' | undefined;

    // Notification options
    showSaveNotification?: boolean;
    saveNotificationDuration?: number;
    saveNotificationMessage?: string;
    customNotification?: React.ReactNode;

    darkMode?: boolean;
}

/* ============================================
   VARIANTS
============================================ */

const ProfileVariants = cva("", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            gradient: "bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5",
            card: "bg-card",
            glass: "bg-background/80 backdrop-blur-md",
            dark: "bg-gray-950 text-gray-50",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const CardVariants = cva("rounded-2xl overflow-hidden transition-smooth", {
    variants: {
        variant: {
            default: "bg-card shadow-lg",
            glass: "bg-card/80 backdrop-blur-md shadow-lg",
            border: "bg-card border-2 border-primary/10 shadow-lg",
            elevated: "bg-card shadow-xl",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

// Add notification variant
const NotificationVariants = cva(
    "fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-200 border transition-all duration-300",
    {
        variants: {
            type: {
                success: "bg-green-50 text-green-800 border-green-200",
                error: "bg-red-50 text-red-800 border-red-200",
                info: "bg-blue-50 text-blue-800 border-blue-200",
                warning: "bg-yellow-50 text-yellow-800 border-yellow-200"
            }
        }
    }
);

/* ============================================
   COMPONENTS
============================================ */

// 1. AvatarUploader (using Avatar component)
const AvatarUploader = ({
    name,
    avatarUrl,
    isEditing,
    onAvatarChange,
    shape = 'circle',
    size = '9xl',
    status = undefined,
}: AvatarUploaderProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreviewUrl(result);
                onAvatarChange(file, result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const displayUrl = previewUrl || avatarUrl;

    return (
        <div className="relative group">
            <div className="relative" onClick={handleClick}>
                <Avatar
                    src={displayUrl || undefined}
                    alt={name}
                    shape={shape}
                    size={size}
                    letters={name}
                    bordered
                    clickable={isEditing}
                    status={status}
                    className={cn(
                        "transition-all duration-300",
                        isEditing && "hover:scale-105 hover:ring-4 hover:ring-primary/20"
                    )}
                />

                {isEditing && (
                    <div className={cn(
                        "absolute inset-0 bg-black/40 rounded-full flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    )}>
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {isEditing && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClick}
                    className={cn(
                        "absolute -bottom-2 -right-2 w-10 h-10 rounded-full cursor-pointer",
                        "bg-primary text-primary-foreground",
                        "shadow-lg border-2 border-background",
                        "hover:bg-primary/90 transition-all"
                    )}
                >
                    <Camera className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

// 2. ProfileField (using AnimatedInput and Typography)
const ProfileField = ({
    label,
    value,
    isEditing,
    onChange,
    type = 'text',
    readOnly = false,
    placeholder,
    rows = 4,
    inputVariant = 'clean',
    icon: Icon,
}: ProfileFieldProps) => {
    const isEditable = isEditing && !readOnly;

    if (isEditable) {
        return (
            <div className="space-y-2 animate-fade-in">
                <Typography
                    variant="label"
                    color="muted"
                    className="flex items-center gap-2"
                >
                    {Icon && <Icon className="w-3 h-3" />}
                    {label}
                    {readOnly && <Lock className="w-3 h-3" />}
                </Typography>

                {type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder}
                        rows={rows}
                        className={cn(
                            "w-full px-4 py-3 rounded-lg transition-all duration-300",
                            "bg-background border border-input",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                            "resize-none",
                            "text-foreground",
                            "placeholder:text-muted-foreground"
                        )}
                    />
                ) : (
                    <AnimatedInput
                        placeholder={placeholder || label}
                        variant={inputVariant}
                        value={value}
                        onChange={onChange}
                        type={type}
                        icon={Icon}
                        disabled={readOnly}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Typography
                variant="label"
                color="muted"
                className="flex items-center gap-2"
            >
                {Icon && <Icon className="w-3 h-3" />}
                {label}
            </Typography>

            <div className={cn(
                "px-4 py-3 rounded-lg transition-all duration-300",
                "bg-secondary/30 border border-transparent",
                type === 'textarea' && "min-h-[100px] whitespace-pre-wrap",
                readOnly && "text-muted-foreground",
                !readOnly && "text-foreground"
            )}>
                <Typography
                    variant="body"
                    color={value ? "default" : "muted"}
                    className={!value ? "italic" : ""}
                >
                    {value || `No ${label.toLowerCase()} provided`}
                </Typography>
            </div>
        </div>
    );
};

// 3. SocialLinksList (using Button and Typography)
const SocialLinksList = ({
    links,
    isEditing,
    onLinksChange
}: SocialLinksListProps) => {
    const platformIcons: Record<string, React.ReactNode> = {
        twitter: <Twitter className="w-4 h-4" />,
        github: <Github className="w-4 h-4" />,
        linkedin: <Linkedin className="w-4 h-4" />,
        website: <Earth className="w-4 h-4" />,
        default: <LinkIcon className="w-4 h-4" />,
    };

    const getPlatformIcon = (url: string) => {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return platformIcons.twitter;
        if (lowerUrl.includes('github')) return platformIcons.github;
        if (lowerUrl.includes('linkedin')) return platformIcons.linkedin;
        if (lowerUrl.includes('http')) return platformIcons.website;
        return platformIcons.default;
    };

    const addLink = () => {
        const newLink: SocialLink = {
            id: Date.now().toString(),
            platform: '',
            url: '',
        };
        onLinksChange([...links, newLink]);
    };

    const updateLink = (id: string, field: 'platform' | 'url', value: string) => {
        onLinksChange(
            links.map(link =>
                link.id === id ? { ...link, [field]: value } : link
            )
        );
    };

    const removeLink = (id: string) => {
        onLinksChange(links.filter(link => link.id !== id));
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {/* <Typography variant="label" color="muted">
                Social Links
            </Typography> */}

            {links.length === 0 && !isEditing && (
                <div className="px-4 py-3 rounded-lg bg-secondary/30 text-muted-foreground/60 italic">
                    <Typography variant="body-small" color="muted">
                        No social links added
                    </Typography>
                </div>
            )}

            <div className="space-y-3">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                            isEditing ? "bg-accent/20 border border-primary/10" : "bg-secondary/30"
                        )}
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getPlatformIcon(link.url)}
                        </div>

                        {isEditing ? (
                            <>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <AnimatedInput
                                        placeholder="Platform name"
                                        variant="clean"
                                        value={link.platform}
                                        onChange={(value) => updateLink(link.id, 'platform', value)}
                                    />
                                    <AnimatedInput
                                        placeholder="https://..."
                                        variant="clean"
                                        value={link.url}
                                        onChange={(value) => updateLink(link.id, 'url', value)}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLink(link.id)}
                                    className="flex-shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="flex-1 min-w-0">
                                <Typography variant="body-small" weight="medium" className="truncate text-foreground">
                                    {link.platform || 'Unnamed'}
                                </Typography>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline truncate block"
                                >
                                    <Typography variant="caption" className="truncate">
                                        {link.url}
                                    </Typography>
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addLink}
                    className="w-full border-dashed hover:border-primary hover:text-primary cursor-pointer"
                    animationVariant="scaleUp"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                </Button>
            )}
        </div>
    );
};

// 4. SaveCancelBar (using Button component)
const SaveCancelBar = ({
    onSave,
    onCancel,
    isSaving = false,
    saveButtonVariant = "primary",
    cancelButtonVariant = "outline"
}: SaveCancelBarProps) => {
    return (
        <div className={cn(
            "flex items-center justify-end gap-3 pt-6",
            "border-t border-border animate-fade-in cursor-pointer"
        )}>
            <Button
                variant={cancelButtonVariant as any}
                onClick={onCancel}
                disabled={isSaving}
                className="min-w-[100px] cursor-pointer"
                animationVariant="press3DSoft"
            >
                <X className="w-4 h-4 mr-2" />
                Cancel
            </Button>
            <Button
                variant={saveButtonVariant as any}
                onClick={onSave}
                disabled={isSaving}
                className="min-w-[100px] cursor-pointer"
                animationVariant={isSaving ? "spinSlow" : "scaleHeartbeat"}
            >
                {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
    );
};

// 5. Notification Component (new)
const Notification = ({
    type = 'success',
    message,
    onClose,
    duration = 3000
}: {
    type: Notification['type'];
    message: string;
    onClose: () => void;
    duration?: number;
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <X className="w-5 h-5" />,
        info: <Loader2 className="w-5 h-5" />,
        warning: <Loader2 className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
                NotificationVariants({ type }),
                "top-4 right-4"
            )}
        >
            {icons[type]}
            <Typography variant="body-small" weight="medium">
                {message}
            </Typography>
            <button
                onClick={onClose}
                className="ml-4 text-current hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// 6. Main Profile Page Component
const defaultProfileData: ProfileData = {
    displayName: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    bio: 'Product designer with 8+ years of experience creating digital experiences. Passionate about user-centered design and building products that make a difference.',
    avatarUrl: null,
    socialLinks: [
        { id: '1', platform: 'Twitter', url: 'https://twitter.com/alexthompson' },
        { id: '2', platform: 'GitHub', url: 'https://github.com/alexthompson' },
    ],
    location: 'San Francisco, CA',
    jobTitle: 'Senior Product Designer',
    website: 'https://alexthompson.design',
    phone: '+1 (555) 123-4567',
};

export const ProfilePage: React.FC<ProfileProps> = ({
    headerTitle = "Profile Settings",
    headerIcon = <User className="w-4 h-4" />,
    initialProfileData = {},
    onSave,
    onCancel,
    variant = "default",
    animationVariant = "fadeUp",
    avatarShape = 'circle',
    avatarSize = '3xl',
    inputVariant = 'clean',
    buttonVariant = 'default',
    buttonAnimationVariant,
    customHeader,
    customAvatarSection,
    customSocialLinks,
    editButtonLabel = "Edit Profile",

    isLoading = false,
    // showStatus = true,
    status = undefined,

    // New notification props
    showSaveNotification = true,
    saveNotificationDuration = 3000,
    saveNotificationMessage = "Changes saved successfully!",
    customNotification,

    darkMode
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        ...defaultProfileData,
        ...initialProfileData,
    });
    const [editedData, setEditedData] = useState<ProfileData>({
        ...defaultProfileData,
        ...initialProfileData,
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        initialProfileData.avatarUrl || null
    );

    // Notification state
    const [notification, setNotification] = useState<Notification | null>(null);

    const animationVariants = {
        fadeUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
        },
        slideUp: {
            initial: { opacity: 0, y: 40 },
            animate: { opacity: 1, y: 0 },
        },
        slideLeft: {
            initial: { opacity: 0, x: -40 },
            animate: { opacity: 1, x: 0 },
        },
        slideRight: {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
        },
    };

    const handleEdit = () => {
        setEditedData(profileData);
        setAvatarPreview(profileData.avatarUrl);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedData(profileData);
        setAvatarPreview(profileData.avatarUrl);
        setAvatarFile(null);
        setIsEditing(false);
        onCancel?.();
    };

    const showNotification = (type: Notification['type'], message: string) => {
        setNotification({
            id: Date.now().toString(),
            type,
            message,
            duration: saveNotificationDuration
        });
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            if (onSave) {
                await onSave({
                    ...editedData,
                    avatarUrl: avatarPreview,
                }, avatarFile);
            } else {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                setProfileData({
                    ...editedData,
                    avatarUrl: avatarPreview,
                });
            }

            setIsEditing(false);
            setAvatarFile(null);

            // Show success notification
            if (showSaveNotification) {
                showNotification('success', saveNotificationMessage);
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            // Show error notification
            showNotification('error', 'Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = (file: File | null, previewUrl: string | null) => {
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
    };

    const currentData = isEditing ? editedData : profileData;
    const displayAvatarUrl = isEditing ? avatarPreview : profileData.avatarUrl;

    // Animation config
    const anim = animationVariants[animationVariant];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen transition-all duration-300", ProfileVariants({ variant }), darkMode && "dark")}>
            {/* Notification Area */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    duration={notification.duration}
                />
            )}

            {/* Custom Notification */}
            {customNotification && isEditing && (
                <div className="fixed top-4 right-4 z-50">
                    {customNotification}
                </div>
            )}
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {customHeader || (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                    {headerIcon}
                                </div>
                                <Typography variant="h6" weight="semibold" className="text-foreground">
                                    {headerTitle}
                                </Typography>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {!isEditing && (
                                <Button
                                    onClick={handleEdit}
                                    variant={buttonVariant as any}
                                    animationVariant={buttonAnimationVariant}
                                    className='cursor-pointer'
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    {editButtonLabel}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={anim.initial}
                    animate={anim.animate}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Profile Card */}
                    <div className={cn(
                        CardVariants({ variant: isEditing ? "border" : "default" }),
                        "transition-all duration-300"
                    )}>
                        {/* Avatar Section */}
                        <div className={cn(
                            "relative px-6 py-8 md:px-8 md:py-10",
                            "bg-gradient-to-br from-primary/5 via-accent/20 to-secondary"
                        )}>
                            {customAvatarSection || (
                                <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
                                    <AvatarUploader
                                        name={currentData.displayName}
                                        avatarUrl={displayAvatarUrl || undefined}
                                        isEditing={isEditing}
                                        onAvatarChange={handleAvatarChange}
                                        shape={avatarShape}
                                        size={avatarSize}
                                        status={status}
                                    />
                                    <div className="text-center sm:text-left">
                                        <Typography variant="h2" weight="bold" className="mb-2 text-foreground">
                                            {currentData.displayName || 'Your Name'}
                                        </Typography>
                                        <Typography variant="lead" color="muted" className="mb-4">
                                            {currentData.jobTitle || 'Your Title'}
                                        </Typography>
                                        <div className="flex flex-wrap gap-4">
                                            {currentData.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <Typography variant="body-small" color="muted">
                                                        {currentData.email}
                                                    </Typography>
                                                </div>
                                            )}
                                            {currentData.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <Typography variant="body-small" color="muted">
                                                        {currentData.location}
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Details */}
                        <div className="p-6 md:p-8 space-y-8">
                            {/* Basic Info Section */}
                            <section>
                                <Typography variant="h5" weight="semibold" className="mb-4 text-foreground">
                                    Basic Information
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileField
                                        label="Display Name"
                                        value={currentData.displayName}
                                        isEditing={isEditing}
                                        onChange={(value) => setEditedData({ ...editedData, displayName: value })}
                                        placeholder="Enter your display name"
                                        inputVariant={inputVariant}
                                        icon={User}
                                    />
                                    <ProfileField
                                        label="Email Address"
                                        value={currentData.email}
                                        isEditing={isEditing}
                                        type="email"
                                        readOnly
                                        inputVariant={inputVariant}
                                        icon={Mail}
                                    />
                                    <ProfileField
                                        label="Job Title"
                                        value={currentData.jobTitle || ''}
                                        isEditing={isEditing}
                                        onChange={(value) => setEditedData({ ...editedData, jobTitle: value })}
                                        placeholder="Enter your job title"
                                        inputVariant={inputVariant}
                                        icon={Briefcase}
                                    />
                                    <ProfileField
                                        label="Location"
                                        value={currentData.location || ''}
                                        isEditing={isEditing}
                                        onChange={(value) => setEditedData({ ...editedData, location: value })}
                                        placeholder="Enter your location"
                                        inputVariant={inputVariant}
                                        icon={MapPin}
                                    />
                                    <ProfileField
                                        label="Website"
                                        value={currentData.website || ''}
                                        isEditing={isEditing}
                                        type="url"
                                        onChange={(value) => setEditedData({ ...editedData, website: value })}
                                        placeholder="https://yourwebsite.com"
                                        inputVariant={inputVariant}
                                        icon={Earth}
                                    />
                                    <ProfileField
                                        label="Phone"
                                        value={currentData.phone || ''}
                                        isEditing={isEditing}
                                        type="tel"
                                        onChange={(value) => setEditedData({ ...editedData, phone: value })}
                                        placeholder="+1 (555) 123-4567"
                                        inputVariant={inputVariant}
                                    />
                                </div>
                            </section>

                            {/* Bio Section */}
                            <section>
                                <Typography variant="h5" weight="semibold" className="mb-4 text-foreground">
                                    About Me
                                </Typography>
                                <ProfileField
                                    label=""
                                    value={currentData.bio}
                                    isEditing={isEditing}
                                    onChange={(value) => setEditedData({ ...editedData, bio: value })}
                                    type="textarea"
                                    placeholder="Tell us a bit about yourself..."
                                    rows={4}
                                    inputVariant={inputVariant}
                                />
                            </section>

                            {/* Social Links Section */}
                            <section>
                                <Typography variant="h5" weight="semibold" className="mb-4 text-foreground">
                                    Connect
                                </Typography>
                                {customSocialLinks || (
                                    <SocialLinksList
                                        links={currentData.socialLinks}
                                        isEditing={isEditing}
                                        onLinksChange={(links) => setEditedData({ ...editedData, socialLinks: links })}
                                    />
                                )}
                            </section>

                            {/* Save/Cancel Bar */}
                            {isEditing && (
                                <SaveCancelBar
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    isSaving={isSaving}
                                    saveButtonVariant={buttonVariant}
                                />
                            )}
                        </div>
                    </div>

                </motion.div>
            </main>
        </div>
    );
};

// Export individual components as well
export {
    AvatarUploader,
    ProfileField,
    SocialLinksList,
    SaveCancelBar,
    type ProfileData,
    type SocialLink,
};
