"use client"
import { InputTest } from "@/components/diagnostics/input-test"

export default function InputPage() {
    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Input Device Diagnostics</h1>
            <InputTest />
        </div>
    )
}
