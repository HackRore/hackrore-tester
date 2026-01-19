"use client"
import { DisplayTest } from "@/components/diagnostics/display-test"

export default function DisplayPage() {
    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Display Capabilities</h1>
            <DisplayTest />
        </div>
    )
}
