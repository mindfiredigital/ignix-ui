// config.ts
import { ShieldCheck, Zap, Users, Globe } from "lucide-react";

export const DEFAULT_FEATURES = [
    {
        text: "Enterprise-grade security & encryption",
        icon: <ShieldCheck className="w-5 h-5" />,
        iconColor: "text-blue-400",
        textClassName: "font-semibold text-white/95",
    },
    {
        text: "Lightning-fast performance",
        icon: <Zap className="w-5 h-5" />,
        iconColor: "text-yellow-400",
        textClassName: "font-semibold text-white/95",
    },
    {
        text: "Seamless team collaboration",
        icon: <Users className="w-5 h-5" />,
        iconColor: "text-green-400",
        textClassName: "font-semibold text-white/95",
    },
    {
        text: "Global availability",
        icon: <Globe className="w-5 h-5" />,
        iconColor: "text-purple-400",
        textClassName: "font-semibold text-white/95",
    },
];

export const DEFAULT_ANIMATION_CONFIG = {
    titleDelay: 0.2,
    descriptionDelay: 0.3,
    featuresDelay: 0.4,
    staggerChildren: 0.1
};

export const DEFAULT_COMPANY_NAME = "YourBrand";

export const DEFAULT_STRENGTH_LABELS = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
} as const;