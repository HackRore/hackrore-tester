"use client"
import { AudioVideoTest } from "@/components/diagnostics/audio-video-test"

export default function CameraPage() {
    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Camera & Audio Diagnostics</h1>
            <AudioVideoTest />
        </div>
    )
}
