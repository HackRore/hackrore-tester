"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, User, BookOpen, Settings, Zap, Terminal, Activity, LogOut } from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle"; // Assuming this exists or will be created/verified

const NAV_ITEMS = [
    { title: "Dashboard", url: "/dashboard", icon: Home, xpFactor: 10 },
    // xpFactor is a visual placeholder for 'mastery' or progress in that section if we wanted per-section tracking
    { title: "Portfolio", url: "/portfolio", icon: User, xpFactor: 45 },
    { title: "Resources", url: "/resources", icon: BookOpen, xpFactor: 20 },
    { title: "Wiring", url: "/wiring", icon: Terminal, xpFactor: 5 }, // Example new item from context
    { title: "Settings", url: "/settings", icon: Settings, xpFactor: 0 },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { xp, level, getProgressToNextLevel } = useGamification();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const { progress: levelProgress, nextLevelThreshold } = getProgressToNextLevel();

    return (
        <Sidebar collapsible="icon" className="border-r border-border/40 bg-sidebar/95 backdrop-blur-xl">
            <SidebarHeader className="p-4 border-b border-border/10">
                <div className="flex items-center gap-3 font-bold text-xl tracking-tighter text-sidebar-foreground overflow-hidden">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Zap className="w-6 h-6 fill-current" />
                        <motion.div
                            className="absolute inset-0 rounded-lg bg-primary/20 blur-md"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
                        className="whitespace-nowrap overflow-hidden"
                    >
                        <span className="text-primary">STS</span> v2.0
                    </motion.div>
                </div>
            </SidebarHeader>

            <SidebarContent className="py-4 px-2">
                <SidebarMenu>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                        return (
                            <SidebarMenuItem key={item.url} className="mb-1">
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.title}
                                    className={`
                                        relative overflow-hidden group h-12 transition-all duration-300 rounded-xl
                                        ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-primary/5" : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"}
                                    `}
                                >
                                    <Link href={item.url} className="flex items-center gap-4 w-full px-3">

                                        {/* Icon Container with XP Ring */}
                                        <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
                                            {/* Show XP Ring only on hover or active to reduce noise, or always for 'gamified' feel */}
                                            {/* Let's show a subtle ring always, and glow on active */}
                                            <CircularProgress
                                                value={isActive ? 100 : (item.xpFactor || 0)} // Visual filler
                                                size={36}
                                                strokeWidth={2}
                                                color={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground)/0.3)"}
                                                trackColor="transparent"
                                                className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
                                            />

                                            <item.icon className={`w-5 h-5 z-10 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />

                                            {isActive && (
                                                <motion.div
                                                    layoutId="icon-glow"
                                                    className="absolute inset-0 bg-primary/20 blur-lg rounded-full"
                                                />
                                            )}
                                        </div>

                                        <span className="font-medium tracking-tight truncate">
                                            {item.title}
                                        </span>

                                        {/* Active Indicator Line (Desktop) */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            />
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border/10 bg-sidebar-accent/5">
                {/* User Profile & Level Widget */}
                {isCollapsed ? (
                    <div className="flex flex-col items-center gap-4">
                        <ThemeToggle />
                        <div className="relative">
                            <CircularProgress value={levelProgress} size={32} strokeWidth={3} color="hsl(var(--primary))" />
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                                {level}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-border">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-primary/10 text-primary">TR</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground">Tech. Rogan</span>
                                    <span className="text-xs text-muted-foreground">Certified Master</span>
                                </div>
                            </div>
                            <ThemeToggle />
                        </div>

                        {/* XP Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end text-xs">
                                <span className="font-semibold text-primary">Level {level}</span>
                                <span className="text-muted-foreground">{Math.floor(xp)} / {nextLevelThreshold} XP</span>
                            </div>
                            <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-purple-500 relative"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${levelProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

// Global keyframe for shimmer (can also be in global CSS)
// .animate-[shimmer_2s_infinite] { animation: shimmer 2s infinite linear; }
// @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

