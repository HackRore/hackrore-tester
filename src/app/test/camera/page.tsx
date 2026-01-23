"use client"

import { AudioVideoTest } from "@/components/diagnostics/audio-video-test"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Camera } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function CameraPage() {
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
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Camera className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Camera Test
              </h1>
              <p className="text-neutral-400 mt-2">
                Test webcam resolution, FPS, and functionality
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800 backdrop-blur-sm">
          <AudioVideoTest mode="camera" />
        </Card>
      </div>
    </div>
  )
}
