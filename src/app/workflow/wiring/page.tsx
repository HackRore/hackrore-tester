"use client"

import { WiringBuilder } from "@/components/workflow/wiring-builder"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function WiringPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-4">Wiring Diagram Builder</h1>
        <p className="text-gray-400 mb-8">
          Create custom wiring diagrams for your repairs.
        </p>
        <div className="h-[600px] w-full">
          <WiringBuilder />
        </div>
      </div>
    </div>
  )
}
