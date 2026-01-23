"use client"

import Link from "next/link"
import { Wrench } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <span className="hidden font-bold sm:inline-block">
                        Smart Technician Suite
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
