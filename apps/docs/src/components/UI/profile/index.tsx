import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Mail, Briefcase, MapPin, Globe as Earth, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../button';
import { Typography } from '../typography';
import { type ProfileProps, type ProfileData, type Notification } from './types';
import { ProfileVariants, CardVariants, animationVariants } from './variants';
import { defaultProfileData } from './constants';
import { NotificationComponent } from './components/Notification';
import { ProfileField } from './components/ProfileField';
import { SocialLinksList } from './components/SocialLinksList';
import { SaveCancelBar } from './components/SaveCancelBar';
import { AvatarUploader } from './components/AvatarUploader';

/**
 * ProfilePage Component
 * 
 * A comprehensive user profile page with edit capabilities.
 * Features avatar upload, profile field editing, social links management,
 * and customizable styling options.
 * 
 * @component
 * @example
 * ```tsx
 * <ProfilePage
 *   headerTitle="My Profile"
 *   initialProfileData={{ displayName: "John Doe" }}
 *   onSave={(data) => saveProfile(data)}
 *   variant="glass"
 *   avatarShape="circle"
 *   avatarSize="3xl"
 *   showSaveNotification={true}
 * />
 * ```
 * 
 * @param {ProfileProps} props - Component props
 * @returns {JSX.Element} The rendered ProfilePage component
 */
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
    status = undefined,
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
    const [notification, setNotification] = useState<Notification | null>(null);

    const anim = animationVariants[animationVariant];

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

            if (showSaveNotification) {
                showNotification('success', saveNotificationMessage);
            }
        } catch (error) {
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen transition-all duration-300", ProfileVariants({ variant }), darkMode && "dark")}>
            {notification && (
                <NotificationComponent
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    duration={notification.duration}
                />
            )}

            {customNotification && isEditing && (
                <div className="fixed top-4 right-4 z-50">
                    {customNotification}
                </div>
            )}

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
                                    variant={buttonVariant}
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

            <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={anim.initial}
                    animate={anim.animate}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className={cn(
                        CardVariants({ variant: isEditing ? "border" : "default" }),
                        "transition-all duration-300"
                    )}>
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

                        <div className="p-6 md:p-8 space-y-8">
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