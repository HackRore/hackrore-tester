"use client"

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { SiteHeader } from "@/components/site-header" // Reusing site header if needed, or we incorporate it into sidebar/topbar.

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex flex-1">
                <DashboardSidebar className="top-14" />
                <main className="flex-1 md:ml-0 overflow-y-auto">
                    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto pt-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
