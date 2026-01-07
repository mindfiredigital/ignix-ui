import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { cn } from '../../../../../../utils/cn';
import { Avatar } from '../../../../../components/avatar';
import { Button } from '../../../../../components/button';
import { type AvatarUploaderProps } from '../types';

/**
 * AvatarUploader Component
 * 
 * A component for uploading and displaying user avatars with edit capabilities.
 * Supports various shapes, sizes, and status indicators.
 * 
 * @component
 * @example
 * ```tsx
 * <AvatarUploader
 *   name="John Doe"
 *   avatarUrl="/path/to/avatar.jpg"
 *   isEditing={true}
 *   onAvatarChange={(file, previewUrl) => console.log(file, previewUrl)}
 *   shape="circle"
 *   size="xl"
 *   status="online"
 * />
 * ```
 */

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
    name,
    avatarUrl,
    isEditing,
    onAvatarChange,
    shape = 'circle',
    size = '9xl',
    status = undefined,
}) => {
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