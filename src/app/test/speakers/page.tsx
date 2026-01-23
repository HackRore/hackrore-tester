"use client"

import { AudioVideoTest } from "@/components/diagnostics/audio-video-test"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Volume2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950 text-white">
      <div className="container mx-auto p-4 sm:p-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="inline-block mb-6">
            <Button variant="outline" className="bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
              <Volume2 className="h-8 w-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Speaker Test
              </h1>
              <p className="text-neutral-400 mt-2">
                Test stereo output, channel separation, and audio quality
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Audio Output Testing</CardTitle>
            <CardDescription className="text-neutral-400">
              Click the buttons below to test different audio channels. Make sure your speakers are connected and volume is at a comfortable level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AudioVideoTest mode="speakers" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
