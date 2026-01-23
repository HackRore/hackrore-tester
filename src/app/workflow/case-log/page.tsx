"use client"

import { CaseLogForm } from "@/components/workflow/case-log-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function CaseLogPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-4">Case Logs</h1>
        <p className="text-gray-400 mb-8">
          Document your repairs and export them to PDF.
        </p>
        <div className="h-[600px] overflow-y-auto">
          <CaseLogForm />
        </div>
      </div>
    </div>
  )
}
