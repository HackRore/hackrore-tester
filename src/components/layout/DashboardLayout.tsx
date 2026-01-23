"use client";

import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { useThemeContext } from "@/context/ThemeContext";
import { SystemStatusWidget } from "@/components/dashboard/SystemStatusWidget";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { currentThemeClass } = useThemeContext();

    return (
        <SidebarProvider>
            <div className={`flex min-h-screen w-full ${currentThemeClass} bg-background text-foreground transition-colors duration-500`}>
                <AppSidebar />
                <SidebarInset className="relative flex flex-col min-h-screen overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/80 backdrop-blur-xl px-6 sticky top-0 z-50 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                            <div className="h-6 w-px bg-border hidden md:block" />
                            {/* Breadcrumbs or Title could go here */}
                        </div>

                        <div className="flex items-center gap-4">
                            <SystemStatusWidget />
                            {/* Additional topbar actions */}
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative">
                        {/* Background elements for themes */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                        </div>
                        <div className="relative z-10">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
