"use client"
import { useState, useEffect } from "react"
import { Maximize, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DisplayTest() {
    const [fullscreen, setFullscreen] = useState(false)
    const [colorIndex, setColorIndex] = useState(0)
    const colors = ["bg-white", "bg-red-600", "bg-green-600", "bg-blue-600", "bg-black"]

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setFullscreen(true))
        } else {
            document.exitFullscreen().then(() => setFullscreen(false))
        }
    }

    const nextColor = () => {
        setColorIndex((prev) => (prev + 1) % colors.length)
    }

    useEffect(() => {
        const handleEsc = () => {
            if (!document.fullscreenElement) setFullscreen(false)
        }
        document.addEventListener("fullscreenchange", handleEsc)
        return () => document.removeEventListener("fullscreenchange", handleEsc)
    }, [])

    if (fullscreen) {
        return (
            <div
                className={`fixed inset-0 z-50 ${colors[colorIndex]} cursor-pointer flex items-center justify-center`}
                onClick={nextColor}
            >
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); document.exitFullscreen(); }}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <p className="opacity-50 text-xl font-bold mix-blend-difference text-white pointer-events-none">
                    Click to change color. Press ESC to exit.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4 p-8 border rounded-md">
            <Maximize className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Dead Pixel Check</h3>
            <p className="text-sm text-center text-muted-foreground max-w-sm">
                This test will enter fullscreen and cycle through solid colors (White, Red, Green, Blue, Black) to help you spot dead or stuck pixels.
            </p>
            <Button onClick={toggleFullscreen}>Start Display Test</Button>
        </div>
    )
}
