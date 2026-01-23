"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { KnowledgeBase } from "@/components/resources/knowledge-base";
import { CheatSheets } from "@/components/resources/cheat-sheets";
import { AiAssistant } from "@/components/resources/ai-assistant";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, FileText, Bot, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ResourcesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20">

                {/* Header & Search */}
                <div className="flex flex-col items-center text-center space-y-4 py-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge variant="outline" className="mb-2 border-primary/20 text-primary">Technician's Library</Badge>
                        <h1 className="text-4xl font-bold tracking-tight">Resource Hub</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto mt-2 text-lg">
                            Access repair guides, error code databases, and AI-powered diagnostic assistance.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full max-w-lg mt-6 relative group"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search guides, error codes, or ask AI..."
                                className="pl-12 h-14 text-lg rounded-full bg-secondary/30 backdrop-blur-md border border-white/10 group-focus-within:border-primary/50 group-focus-within:bg-background ring-offset-0 focus-visible:ring-0 shadow-lg transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Categories */}
                <Tabs defaultValue="knowledge" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="bg-secondary/30 backdrop-blur border border-white/5 p-1 rounded-full h-auto flex-wrap justify-center">
                            <TabsTrigger value="knowledge" className="rounded-full px-4 py-2 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <BookOpen className="w-4 h-4" /> Knowledge Base
                            </TabsTrigger>
                            <TabsTrigger value="cheatsheets" className="rounded-full px-4 py-2 gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                                <FileText className="w-4 h-4" /> Cheat Sheets
                            </TabsTrigger>
                            <TabsTrigger value="ai" className="rounded-full px-4 py-2 gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                                <Bot className="w-4 h-4" /> AI Assistant
                            </TabsTrigger>
                            <TabsTrigger value="downloads" className="rounded-full px-4 py-2 gap-2">
                                <Download className="w-4 h-4" /> Downloads
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="knowledge">
                        <KnowledgeBase search={searchQuery} />
                    </TabsContent>

                    <TabsContent value="cheatsheets">
                        <CheatSheets search={searchQuery} />
                    </TabsContent>

                    <TabsContent value="ai">
                        <AiAssistant />
                    </TabsContent>

                    <TabsContent value="downloads">
                        <AnimatedCard className="p-12 text-center text-muted-foreground border-dashed border-2">
                            <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold">Download Center</h3>
                            <p>Schematics and Boardviews Coming Soon (Premium Feature)</p>
                        </AnimatedCard>
                    </TabsContent>
                </Tabs>

            </div>
        </DashboardLayout>
    );
}

// Ensure motion is imported for the header usage
import { motion } from "framer-motion";
