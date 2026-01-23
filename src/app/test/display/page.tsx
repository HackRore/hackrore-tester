"use client"
import { DisplayTest } from "@/components/diagnostics/display-test"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Monitor } from "lucide-react"

export default function DisplayPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950 text-white">
            <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
                <div className="mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <Button variant="outline" className="bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800">
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <Monitor className="h-8 w-8 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                                Display Test
                            </h1>
                            <p className="text-neutral-400 mt-2">
                                Check for dead pixels, color accuracy, and sharpness
                            </p>
                        </div>
                    </div>
                </div>

                <DisplayTest />
            </div>
        </div>
    )
}
