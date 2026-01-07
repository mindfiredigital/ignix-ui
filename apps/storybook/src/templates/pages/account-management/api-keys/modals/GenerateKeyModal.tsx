import { motion } from 'framer-motion';
import {
    Key,
    Copy,
    Check,
    AlertTriangle,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import { Button } from '../../../../../components/button';
import { AnimatedInput } from '../../../../../components/input';
import { Typography } from '../../../../../components/typography';
import type { ApiKey, ApiKeyScope, GenerateKeyModalProps } from '../types';
import { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { SCOPES } from '../constants';
import { cn } from '../../../../../../utils/cn';
import { ScopeBadge } from '../components/ScopeBadge';

export const GenerateKeyModal = ({
    isOpen,
    onClose,
    onGenerate,
    isLoading = false,
    badgeVariant = "tinypop",
    inputVariant = "clean",
    buttonVariant = "default",
    buttonAnimationVariant
}: GenerateKeyModalProps) => {
    const [step, setStep] = useState<'form' | 'result'>('form');
    const [formData, setFormData] = useState({
        name: '',
        scopes: [] as ApiKeyScope[],
        expiresAt: undefined as Date | undefined,
        description: ''
    });
    const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleClose = () => {
        setStep('form');
        setFormData({ name: '', scopes: [], expiresAt: undefined, description: '' });
        setGeneratedKey(null);
        setCopied(false);
        setErrors({});
        onClose();
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Key name is required';
        }

        if (formData.scopes.length === 0) {
            newErrors.scopes = 'Select at least one permission';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerate = async () => {
        if (!validateForm()) return;

        try {
            const key = await onGenerate(formData);
            setGeneratedKey(key);
            setStep('result');
        } catch (error) {
            setErrors({ submit: 'Failed to generate key' });
        }
    };

    const handleCopy = () => {
        if (generatedKey?.fullKey) {
            navigator.clipboard.writeText(generatedKey.fullKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const toggleScope = (scope: ApiKeyScope) => {
        setFormData(prev => ({
            ...prev,
            scopes: prev.scopes.includes(scope)
                ? prev.scopes.filter(s => s !== scope)
                : [...prev.scopes, scope]
        }));
        if (errors.scopes) setErrors(prev => ({ ...prev, scopes: '' }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal Container - centers the modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-lg"
                >
                    <div className="bg-card rounded-2xl shadow-2xl border border-border">
                        {step === 'form' ? (
                            <>
                                {/* Fixed Header */}
                                <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
                                    <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-foreground">
                                        <Key className="w-5 h-5" />
                                        Generate New API Key
                                    </Typography>
                                    <Typography variant="body-small" color="muted">
                                        Create a secure API key with specific permissions
                                    </Typography>
                                </div>

                                {/* Scrollable Content Area */}
                                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Key Name *
                                        </Typography>
                                        <AnimatedInput
                                            placeholder="e.g., Production API"
                                            value={formData.name}
                                            onChange={(value) => {
                                                setFormData(prev => ({ ...prev, name: value }));
                                                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                                            }}
                                            variant={inputVariant}
                                        />
                                        {errors.name && (
                                            <Typography variant="caption" color="error" className="mt-1">
                                                {errors.name}
                                            </Typography>
                                        )}
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Description
                                        </Typography>
                                        <AnimatedInput
                                            placeholder="Optional description for this key"
                                            value={formData.description}
                                            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                            variant={inputVariant}
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Permissions *
                                        </Typography>
                                        <div className="space-y-2">
                                            {SCOPES.map(scope => {
                                                const Icon = scope.icon;
                                                const isSelected = formData.scopes.includes(scope.id);
                                                return (
                                                    <div
                                                        key={scope.id}
                                                        onClick={() => toggleScope(scope.id)}
                                                        className={cn(
                                                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                            isSelected
                                                                ? "bg-primary/10 border-primary/30"
                                                                : "bg-secondary/30 border-border hover:border-primary/20"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-4 h-4 rounded border flex items-center justify-center",
                                                            isSelected
                                                                ? "bg-primary border-primary"
                                                                : "bg-background border-border"
                                                        )}>
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4 text-foreground" />
                                                                <Typography variant="body-small" weight="medium" color="default">
                                                                    {scope.name}
                                                                </Typography>
                                                                <ScopeBadge
                                                                    scope={scope.id}
                                                                    badgeVariant={badgeVariant}
                                                                    showIcon={false}
                                                                    className="text-xs"
                                                                />
                                                            </div>
                                                            <Typography variant="caption" color="muted">
                                                                {scope.description}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {errors.scopes && (
                                            <Typography variant="caption" color="error" className="mt-1">
                                                {errors.scopes}
                                            </Typography>
                                        )}
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Expiration (Optional)
                                        </Typography>
                                        <AnimatedInput
                                            placeholder="Select expiration date"
                                            value={formData.expiresAt ? formData.expiresAt.toISOString().split('T')[0] : ''}
                                            onChange={(value) => setFormData(prev => ({
                                                ...prev,
                                                expiresAt: value ? new Date(value) : undefined
                                            }))}
                                            variant={inputVariant}
                                            type="date"
                                        />
                                    </div>
                                </div>

                                {/* Fixed Footer */}
                                <div className="p-6 border-t border-border bg-card">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={handleClose}
                                            disabled={isLoading}
                                            animationVariant={buttonAnimationVariant}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={isLoading || !formData.name.trim()}
                                            variant={buttonVariant as any}
                                            animationVariant={buttonAnimationVariant}
                                            className="cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Key className="w-4 h-4 mr-2 " />
                                                    Generate Key
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Fixed Header */}
                                <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
                                    <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-success">
                                        <CheckCircle className="w-5 h-5" />
                                        API Key Generated
                                    </Typography>
                                </div>

                                {/* Scrollable Content Area */}
                                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                                            <div>
                                                <Typography variant="body-small" weight="medium" className="text-warning mb-1">
                                                    Important Security Notice
                                                </Typography>
                                                <Typography variant="caption" color="muted">
                                                    This key will only be shown once. Copy it now and store it securely. You won't be able to see it again.
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Your API Key
                                        </Typography>
                                        <div className="flex gap-2">
                                            <div className="flex-1 p-3 rounded-lg bg-secondary/30 border border-border font-mono text-sm break-all text-foreground">
                                                {generatedKey?.fullKey}
                                            </div>
                                            <Button
                                                variant={copied ? "success" : "outline"}
                                                size="icon"
                                                onClick={handleCopy}
                                                className="flex-shrink-0 cursor-pointer"
                                                animationVariant={buttonAnimationVariant}
                                            >
                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Typography variant="caption" color="muted">
                                                    Name
                                                </Typography>
                                                <Typography variant="body-small" color="default">
                                                    {generatedKey?.name}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption" color="muted">
                                                    Status
                                                </Typography>
                                                <div className="inline-block">
                                                    <StatusBadge
                                                        status="active"
                                                        badgeVariant={badgeVariant}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fixed Footer */}
                                <div className="p-6 border-t border-border bg-card">
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleClose}
                                            animationVariant={buttonAnimationVariant}
                                            className='cursor-pointer'
                                        >
                                            Done
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};