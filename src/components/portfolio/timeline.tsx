"use client";

import React from "react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Briefcase, GraduationCap, Award } from "lucide-react";

export function Timeline() {
    const steps = [
        {
            year: "2024 - Present",
            title: "Senior Lead Technician",
            company: "TechFix Solutions",
            description: "Leading a team of 5 technicians. Specialized in BGA rework and microsoldering.",
            icon: <Briefcase className="w-5 h-5 text-white" />,
            color: "bg-blue-500"
        },
        {
            year: "2022 - 2024",
            title: "Certified Repair Specialist",
            company: "Phone & Laptop Hospital",
            description: "Performed 1000+ screen and battery replacements. Handled L1/L2 repairs.",
            icon: <Briefcase className="w-5 h-5 text-white" />,
            color: "bg-purple-500"
        },
        {
            year: "2022",
            title: "CompTIA A+ Certification",
            company: "CompTIA",
            description: "Achieved professional certification for IT technical support and operational roles.",
            icon: <Award className="w-5 h-5 text-white" />,
            color: "bg-yellow-500"
        },
        {
            year: "2018 - 2022",
            title: "B.S. Computer Engineering",
            company: "State University",
            description: "Focus on embedded systems and hardware architecture.",
            icon: <GraduationCap className="w-5 h-5 text-white" />,
            color: "bg-green-500"
        }
    ];

    return (
        <AnimatedCard className="p-8">
            <h2 className="text-2xl font-bold mb-8">Career Trajectory</h2>
            <div className="relative border-l-2 border-border/50 ml-4 space-y-12 pb-4">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative pl-8">
                        {/* Dot */}
                        <div className={`absolute -left-[11px] top-0 w-6 h-6 rounded-full border-4 border-background ${step.color} flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
                            <div className="scale-50">{step.icon}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-lg font-bold">{step.title}</h3>
                            <span className="text-xs font-mono text-muted-foreground bg-secondary/30 px-2 py-1 rounded">{step.year}</span>
                        </div>

                        <div className="text-sm font-medium text-primary mb-2">{step.company}</div>
                        <p className="text-sm text-muted-foreground max-w-lg">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </AnimatedCard>
    );
}
