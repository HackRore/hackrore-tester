"use client"

import { Calendar, Home, Inbox, Search, Settings, Wrench, Activity, FileText, Bot, Globe } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Diagnostics",
        url: "/diagnostics",
        icon: Activity,
    },
    {
        title: "Workflow Helpers",
        url: "/workflow",
        icon: FileText,
    },
    {
        title: "AI Utilities",
        url: "/ai",
        icon: Bot,
    },
    {
        title: "Tools & Info",
        url: "/tools",
        icon: Globe,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Smart Technician</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
                <p className="text-xs text-muted-foreground">v0.1.0 MVP</p>
            </SidebarFooter>
        </Sidebar>
    )
}
