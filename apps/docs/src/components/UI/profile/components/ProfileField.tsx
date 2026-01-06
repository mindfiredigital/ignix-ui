import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Typography } from '../../typography';
import { AnimatedInput } from '../../input';
import { type ProfileFieldProps } from '../types';

/**
 * ProfileField Component
 * 
 * A versatile field component that can display as either read-only text or
 * an editable input based on the editing state. Supports various input types
 * including text, textarea, email, tel, and url.
 * 
 * @component
 * @example
 * ```tsx
 * <ProfileField
 *   label="Email"
 *   value="user@example.com"
 *   isEditing={true}
 *   onChange={(value) => console.log(value)}
 *   type="email"
 *   readOnly={false}
 *   placeholder="Enter your email"
 *   icon={Mail}
 * />
 * ```
 */
export const ProfileField: React.FC<ProfileFieldProps> = ({
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
}) => {
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