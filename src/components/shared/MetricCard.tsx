"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon?: LucideIcon;
    trend?: "up" | "down" | "neutral";
    className?: string;
}

export function MetricCard({ label, value, unit, icon: Icon, trend, className }: MetricCardProps) {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn("min-w-[140px]", className)}
        >
            <Card className="bg-card/40 border-primary/20 backdrop-blur-md">
                <CardContent className="p-4 flex items-center gap-4">
                    {Icon && (
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold tracking-tight font-mono">{value}</span>
                            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
