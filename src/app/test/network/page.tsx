"use client"
import { NetworkTest } from "@/components/diagnostics/network-test"

export default function NetworkPage() {
    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Network Speed Test</h1>
            <NetworkTest />
        </div>
    )
}
