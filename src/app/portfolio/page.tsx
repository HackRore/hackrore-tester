"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProfileHeader } from "@/components/portfolio/profile-header";
import { ProjectsGrid } from "@/components/portfolio/projects-grid";
import { RefurbishedGallery } from "@/components/portfolio/refurbished-gallery";
import { Timeline } from "@/components/portfolio/timeline";
import { ContactForm } from "@/components/portfolio/contact-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function PortfolioPage() {
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20">

                {/* technician identity block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProfileHeader />
                </motion.div>

                {/* content tabs */}
                <Tabs defaultValue="projects" className="w-full">
                    <div className="flex justify-center mb-8 overflow-x-auto">
                        <TabsList className="bg-secondary/30 backdrop-blur border border-white/5 p-1 rounded-full">
                            <TabsTrigger value="projects" className="rounded-full px-6">Repair Logs & Projects</TabsTrigger>
                            <TabsTrigger value="refurbished" className="rounded-full px-6">Refurbished Showcase</TabsTrigger>
                            <TabsTrigger value="timeline" className="rounded-full px-6">Career Timeline</TabsTrigger>
                            <TabsTrigger value="contact" className="rounded-full px-6">Contact / Hire</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="projects">
                        <ProjectsGrid />
                    </TabsContent>

                    <TabsContent value="refurbished">
                        <RefurbishedGallery />
                    </TabsContent>

                    <TabsContent value="timeline">
                        <Timeline />
                    </TabsContent>

                    <TabsContent value="contact">
                        <ContactForm />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
