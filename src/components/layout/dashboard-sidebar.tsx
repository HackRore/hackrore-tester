"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Activity, Briefcase, BookOpen, Settings, LayoutDashboard, Menu } from "lucide-react"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DashboardSidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/",
            active: pathname === "/",
        },
        {
            label: "Diagnostics",
            icon: Activity,
            href: "/test",
            active: pathname.startsWith("/test"),
        },
        {
            label: "Portfolio",
            icon: Briefcase,
            href: "/portfolio",
            active: pathname.startsWith("/portfolio"),
        },
        {
            label: "Resources",
            icon: BookOpen,
            href: "/resources",
            active: pathname.startsWith("/resources"),
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
            active: pathname.startsWith("/settings"),
        },
    ]

    const SidebarContent = () => (
        <div className="flex w-full flex-col py-4">
            <div className="px-3 py-2">
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Button
                            key={route.href}
                            variant={route.active ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", route.active && "bg-secondary font-bold")}
                            asChild
                            onClick={() => setOpen(false)}
                        >
                            <Link href={route.href}>
                                <route.icon className="mr-2 h-4 w-4" />
                                {route.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-14 left-4 z-40 bg-background/50 backdrop-blur border border-border/50">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 pt-10">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className={cn("hidden border-r bg-background/95 backdrop-blur md:block w-64 h-[calc(100vh-3.5rem)] sticky top-14", className)}>
                <ScrollArea className="h-full">
                    <SidebarContent />
                </ScrollArea>
            </div>
        </>
    )
}
