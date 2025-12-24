import type { StatsOverviewProps } from "../types";
import {
    Key,
    Clock,
    Activity,
    Ban,
    CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../../../../utils/cn';
import { Typography } from "../../../../../components/typography";
import { NewBadge } from "./NewBadge";

export const StatsOverview = ({ stats, isLoading, badgeVariant = "tinypop" }: StatsOverviewProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-secondary/30 animate-pulse" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Keys',
            value: stats.totalKeys,
            icon: Key,
            type: 'primary' as const,
            change: '+2 this month',
            badgeText: '+2'
        },
        {
            label: 'Active Keys',
            value: stats.activeKeys,
            icon: CheckCircle,
            type: 'success' as const,
            change: `${Math.round((stats.activeKeys / stats.totalKeys) * 100)}% active`,
            badgeText: `${Math.round((stats.activeKeys / stats.totalKeys) * 100)}%`
        },
        {
            label: 'Total Calls',
            value: stats.totalCalls.toLocaleString(),
            icon: Activity,
            type: 'warning' as const,
            change: '+12% from last month',
            badgeText: '+12%'
        },
        {
            label: 'Calls Today',
            value: stats.callsToday.toLocaleString(),
            icon: Clock,
            type: 'primary' as const,
            change: 'Live data',
            badgeText: 'Live'
        },
        {
            label: 'Revoked Keys',
            value: stats.revokedKeys,
            icon: Ban,
            type: 'error' as const,
            change: 'Security audit',
            badgeText: 'Audit'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                        "relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                        "bg-card border border-border shadow-sm hover:shadow-md"
                    )}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            stat.type === 'primary' && "bg-primary/10 text-primary",
                            stat.type === 'success' && "bg-success/10 text-success",
                            stat.type === 'warning' && "bg-warning/10 text-warning",
                            stat.type === 'error' && "bg-destructive/10 text-destructive"
                        )}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="relative">
                            <NewBadge
                                text={stat.badgeText}
                                type={stat.type}
                                variant={badgeVariant}
                                className="text-xs"
                            />
                        </div>
                    </div>
                    <Typography variant="h3" weight="bold" className="mb-1">
                        {stat.value}
                    </Typography>
                    <Typography variant="body-small" color="muted">
                        {stat.label}
                    </Typography>
                </motion.div>
            ))}
        </div>
    );
};