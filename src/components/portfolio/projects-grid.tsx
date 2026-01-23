"use client";

import React from "react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";

const PROJECTS = [
    {
        id: 1,
        title: "MacBook Pro M1 Liquid Damage Repair",
        description: "Full logic board ultrasonic cleaning and trace reconstruction after coffee spill.",
        date: "Jan 2024",
        tags: ["Soldering", "Apple", "Hardware"],
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80"
    },
    {
        id: 2,
        title: "Custom Water-Cooled Gaming Rig",
        description: "Built a dual-loop hardline water cooling system for a high-end workstation.",
        date: "Nov 2023",
        tags: ["Build", "Custom", "Thermal"],
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80"
    },
    {
        id: 3,
        title: "RAID 5 Data Recovery",
        description: "Recovered 12TB of critical business data from a failed Synology NAS unit.",
        date: "Oct 2023",
        tags: ["Data Recovery", "Server", "Linux"],
        image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=800&q=80"
    },
    {
        id: 4,
        title: "Console HDMI Port Replacement",
        description: "Micro-soldering replacement of damaged HDMI 2.1 port on PS5.",
        date: "Sep 2023",
        tags: ["Soldering", "Console", "Repair"],
        image: "https://images.unsplash.com/photo-1606144042858-bc4d974f4c5b?w=800&q=80"
    }
];

export function ProjectsGrid() {
    return (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {PROJECTS.map((project, idx) => (
                <div key={project.id} className="break-inside-avoid mb-6">
                    <AnimatedCard delay={idx * 0.1} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />

                            <div className="absolute top-4 right-4">
                                <Badge variant="secondary" className="backdrop-blur bg-background/50">
                                    {project.date}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-6 relative">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs text-muted-foreground border-border/50">
                                        # {tag}
                                    </Badge>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                View Case Study <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>
                    </AnimatedCard>
                </div>
            ))}
        </div>
    );
}
