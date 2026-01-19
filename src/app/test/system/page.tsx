"use client"
import { SystemTest } from "@/components/diagnostics/system-test"

export default function SystemPage() {
    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6">System Information</h1>
            <SystemTest />
        </div>
    )
}
