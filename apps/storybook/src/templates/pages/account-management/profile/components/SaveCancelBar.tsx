import React from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { cn } from '../../../../../../utils/cn';
import { Button } from '../../../../../components/button';
import { type SaveCancelBarProps } from '../types';


/**
 * SaveCancelBar Component
 * 
 * A consistent action bar with Save and Cancel buttons for forms.
 * Includes loading states and visual feedback for save operations.
 * 
 * @component
 * @example
 * ```tsx
 * <SaveCancelBar
 *   onSave={() => console.log('Saved')}
 *   onCancel={() => console.log('Cancelled')}
 *   isSaving={false}
 *   saveButtonVariant="primary"
 *   cancelButtonVariant="outline"
 * />
 * ```
 */

export const SaveCancelBar: React.FC<SaveCancelBarProps> = ({
    onSave,
    onCancel,
    isSaving = false,
    saveButtonVariant = "primary",
    cancelButtonVariant = "outline"
}) => {
    return (
        <div className={cn(
            "flex items-center justify-end gap-3 pt-6",
            "border-t border-border animate-fade-in cursor-pointer"
        )}>
            <Button
                variant={cancelButtonVariant}
                onClick={onCancel}
                disabled={isSaving}
                className="min-w-[100px] cursor-pointer"
                animationVariant="press3DSoft"
            >
                <X className="w-4 h-4 mr-2" />
                Cancel
            </Button>
            <Button
                variant={saveButtonVariant}
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