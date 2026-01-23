"use client"
import { TouchTest } from "@/components/diagnostics/touch-test"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Smartphone } from "lucide-react"

export default function TouchPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950 text-white">
            <div className="container mx-auto p-4 sm:p-8">
                <div className="mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <Button variant="outline" className="bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800">
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Smartphone className="h-8 w-8 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                Touch Screen Test
                            </h1>
                            <p className="text-neutral-400 mt-2">
                                Find dead zones with multi-touch support
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-[calc(100vh-200px)]">
                    <TouchTest />
                </div>
            </div>
        </div>
    )
}
