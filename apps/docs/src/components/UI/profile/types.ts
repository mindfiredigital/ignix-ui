/* ============================================
   TYPES & INTERFACES
============================================ */
// Or define a shared type
export type ButtonVariant = 
    | "default" 
    | "glass" 
    | "primary" 
    | "secondary" 
    | "success" 
    | "warning" 
    | "danger" 
    | "outline" 
    | "ghost" 
    | "link" 
    | "subtle" 
    | "elevated" 
    | "neon" 
    | "pill" 
    | "none";

// Add notification type
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

export interface ProfileData {
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

export interface AvatarUploaderProps {
    name: string;
    avatarUrl?: string;
    isEditing: boolean;
    onAvatarChange: (file: File | null, previewUrl: string | null) => void;
    shape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'star' | 'diamond' | 'pentagon' | 'octagon';
    size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    status?: 'online' | 'offline' | 'away' | 'busy' | undefined;
}

export interface ProfileFieldProps {
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

export interface SocialLinksListProps {
    links: SocialLink[];
    isEditing: boolean;
    onLinksChange: (links: SocialLink[]) => void;
}



export interface SaveCancelBarProps {
    onSave: () => void;
    onCancel: () => void;
    isSaving?: boolean;
    saveButtonVariant?: ButtonVariant;
    cancelButtonVariant?: ButtonVariant;
}

export interface ProfileProps {
    // Header customization
    headerTitle?: string;
    headerIcon?: React.ReactNode;

    // Initial profile data
    initialProfileData?: Partial<ProfileData>;

    // Callbacks
    onSave?: (data: ProfileData, avatarFile?: File | null) => Promise<void> | void;
    onCancel?: () => void;

    // Variants
    variant?: 'default' | 'gradient' | 'card' | 'glass' | 'dark';
    animationVariant?: "fadeUp" | "scaleIn" | "slideUp" | "slideLeft" | "slideRight";

    // Component variants
    avatarShape?: 'circle' | 'square' | 'rounded' | 'hexagon' | 'star';
    avatarSize?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    inputVariant?: string;
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;

    // Custom content
    customHeader?: React.ReactNode;
    customAvatarSection?: React.ReactNode;
    customSocialLinks?: React.ReactNode;

    // Labels
    editButtonLabel?: string;

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


export interface NotificationProps {
    type: Notification['type'];
    message: string;
    onClose: () => void;
    duration?: number;
}