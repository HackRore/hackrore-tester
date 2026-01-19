"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize, RotateCcw } from "lucide-react"

export function TouchTest() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Grid tracking
    const ROWS = 10
    const COLS = 5 // Adjust for deeper rectangle
    const [grid, setGrid] = useState<boolean[]>(new Array(ROWS * COLS).fill(false))

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true))
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false))
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener("resize", resize)
        resize()

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Touch handling
        const handleTouch = (e: TouchEvent) => {
            e.preventDefault()
            // Logic for drawing would go here for multi-touch visualization
            // For now, we focus on the "Grid Logic"

            for (let i = 0; i < e.touches.length; i++) {
                const t = e.touches[i]
                checkGrid(t.clientX, t.clientY)
                drawDot(ctx, t.clientX, t.clientY, i)
            }
        }

        const handleMouse = (e: MouseEvent) => {
            if (e.buttons > 0) {
                checkGrid(e.clientX, e.clientY)
                drawDot(ctx, e.clientX, e.clientY, 0)
            }
        }

        const drawDot = (context: CanvasRenderingContext2D, x: number, y: number, id: number) => {
            const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"]
            context.beginPath()
            context.arc(x, y, 20, 0, Math.PI * 2)
            context.fillStyle = colors[id % colors.length]
            context.fill()
        }

        const checkGrid = (x: number, y: number) => {
            const w = window.innerWidth / COLS
            const h = window.innerHeight / ROWS
            const col = Math.floor(x / w)
            const row = Math.floor(y / h)
            const index = row * COLS + col

            if (index >= 0 && index < grid.length) {
                setGrid(prev => {
                    const newGrid = [...prev]
                    newGrid[index] = true
                    return newGrid
                })
            }
        }

        canvas.addEventListener("touchstart", handleTouch, { passive: false })
        canvas.addEventListener("touchmove", handleTouch, { passive: false })
        canvas.addEventListener("mousemove", handleMouse)

        return () => {
            window.removeEventListener("resize", resize)
            canvas.removeEventListener("touchstart", handleTouch)
            canvas.removeEventListener("touchmove", handleTouch)
            canvas.removeEventListener("mousemove", handleMouse)
        }
    }, []) // Grid dependency omitted intentionally for performance, need Ref for grid if strict

    return (
        <div className={`relative w-full h-screen bg-black overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
            {/* Grid Overlay */}
            <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
                {grid.map((visited, i) => (
                    <div key={i} className={`border border-white/10 transition-colors duration-500 ${visited ? "bg-green-500/30" : "bg-transparent"}`} />
                ))}
            </div>

            <canvas ref={canvasRef} className="absolute inset-0 touch-none" />

            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" onClick={() => setGrid(new Array(ROWS * COLS).fill(false))}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button onClick={toggleFullscreen}>
                    <Maximize className="mr-2 h-4 w-4" /> Fullscreen
                </Button>
            </div>

            {!isFullscreen && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded pointer-events-none">
                    Touch/Drag across the screen to turn boxes green.
                </div>
            )}
        </div>
    )
}
