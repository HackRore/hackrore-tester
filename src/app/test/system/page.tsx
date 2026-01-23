"use client"
import { SystemTest } from "@/components/diagnostics/system-test"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Cpu } from "lucide-react"

export default function SystemPage() {
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
                        <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
                            <Cpu className="h-8 w-8 text-teal-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                                System Information
                            </h1>
                            <p className="text-neutral-400 mt-2">
                                View detailed hardware, software, and system specifications
                            </p>
                        </div>
                    </div>
                </div>

                <SystemTest />
            </div>
        </div>
    )
}
