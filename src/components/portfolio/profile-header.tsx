"use client";

import React from "react";
import { useGamification } from "@/context/GamificationContext";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wrench, Star, ShieldCheck, MapPin, Mail, Github, Linkedin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileHeader() {
    const { level, xp, getProgressToNextLevel } = useGamification();

    return (
        <AnimatedCard className="overflow-hidden relative bg-gradient-to-br from-background via-background to-secondary/10 border-primary/20">

            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-8 p-8 items-start md:items-center relative z-10">
                {/* Avatar Section with Level Ring */}
                <div className="relative group mx-auto md:mx-0">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 relative">
                        <Avatar className="w-full h-full">
                            <AvatarImage src="/avatar-placeholder.png" alt="Technician" />
                            <AvatarFallback className="bg-primary/10 text-primary text-4xl">TR</AvatarFallback>
                        </Avatar>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-background">
                            {level}
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">Tech Repair Wizard</h1>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                                <ShieldCheck className="w-3 h-3" /> Certified Pro
                            </Badge>
                        </div>
                        <p className="text-muted-foreground max-w-xl text-lg">
                            Full-stack hardware & software technician specializing in micro-soldering, data recovery, and performance optimization.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> San Francisco, CA
                        </div>
                        <div className="flex items-center gap-1">
                            <Wrench className="w-4 h-4" /> 500+ Repairs
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                            <Star className="w-4 h-4 fill-primary" /> 4.9/5 Rating
                        </div>
                    </div>

                    {/* Socials / Actions */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                        <Button size="sm" className="gap-2 rounded-full">
                            <Mail className="w-4 h-4" /> Contact Me
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Github className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Linkedin className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* XP / Stats Card */}
                <div className="bg-secondary/40 rounded-xl p-6 min-w-[240px] border border-white/5 backdrop-blur-sm self-stretch flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" /> Current Rank
                        </span>
                        <span className="font-bold text-primary">Level {level}</span>
                    </div>

                    <div className="space-y-1 mb-1">
                        <div className="flex justify-between text-xs">
                            <span>XP Progress</span>
                            <span>{Math.floor(getProgressToNextLevel())}%</span>
                        </div>
                        <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-out"
                                style={{ width: `${getProgressToNextLevel()}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground mt-1">
                        {xp} Total XP
                    </div>
                </div>
            </div>
        </AnimatedCard>
    );
}
