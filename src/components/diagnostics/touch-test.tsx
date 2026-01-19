"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize, RotateCcw } from "lucide-react"

export function TouchTest() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [touchCount, setTouchCount] = useState(0)

    // Grid tracking for dead zone detection
    const ROWS = 10
    const COLS = 5
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

        // Clear canvas with dark background
        const clearCanvas = () => {
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        const handleTouch = (e: TouchEvent) => {
            e.preventDefault()
            clearCanvas()
            setTouchCount(e.touches.length)

            for (let i = 0; i < e.touches.length; i++) {
                const t = e.touches[i]
                checkGrid(t.clientX, t.clientY)
                drawCircle(ctx, t.clientX, t.clientY, i)
            }
        }

        const handleMouse = (e: MouseEvent) => {
            if (e.buttons > 0) {
                clearCanvas()
                checkGrid(e.clientX, e.clientY)
                drawCircle(ctx, e.clientX, e.clientY, 0)
                setTouchCount(1)
            } else {
                setTouchCount(0)
            }
        }

        const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number, id: number) => {
            // Red circles with white outline (TheTest.com style)
            const radius = 35

            // Outer white stroke
            context.beginPath()
            context.arc(x, y, radius + 2, 0, Math.PI * 2)
            context.strokeStyle = '#ffffff'
            context.lineWidth = 3
            context.stroke()

            // Inner red fill
            context.beginPath()
            context.arc(x, y, radius, 0, Math.PI * 2)
            context.fillStyle = '#ef4444'
            context.fill()

            // Touch point number
            context.fillStyle = '#ffffff'
            context.font = 'bold 20px monospace'
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            context.fillText(`${id + 1}`, x, y)
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

        clearCanvas()

        canvas.addEventListener("touchstart", handleTouch, { passive: false })
        canvas.addEventListener("touchmove", handleTouch, { passive: false })
        canvas.addEventListener("touchend", () => { clearCanvas(); setTouchCount(0) }, { passive: false })
        canvas.addEventListener("mousemove", handleMouse)
        canvas.addEventListener("mousedown", handleMouse)
        canvas.addEventListener("mouseup", () => { clearCanvas(); setTouchCount(0) })

        return () => {
            window.removeEventListener("resize", resize)
            canvas.removeEventListener("touchstart", handleTouch)
            canvas.removeEventListener("touchmove", handleTouch)
            canvas.removeEventListener("touchend", () => { clearCanvas(); setTouchCount(0) })
            canvas.removeEventListener("mousemove", handleMouse)
            canvas.removeEventListener("mousedown", handleMouse)
            canvas.removeEventListener("mouseup", () => { clearCanvas(); setTouchCount(0) })
        }
    }, [])

    return (
        <div className={`relative w-full h-screen bg-black overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
            {/* Grid Overlay for Dead Zone Detection */}
            <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
                {grid.map((visited, i) => (
                    <div key={i} className={`border border-white/5 transition-colors duration-500 ${visited ? "bg-green-500/20" : "bg-transparent"}`} />
                ))}
            </div>

            <canvas ref={canvasRef} className="absolute inset-0 touch-none" />

            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" className="bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800" onClick={() => setGrid(new Array(ROWS * COLS).fill(false))}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset Grid
                </Button>
                <Button className="bg-white text-black hover:bg-neutral-200" onClick={toggleFullscreen}>
                    <Maximize className="mr-2 h-4 w-4" /> Fullscreen
                </Button>
            </div>

            {/* Touch Counter */}
            {touchCount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-black/80 border border-neutral-800 text-white px-4 py-2 rounded font-mono">
                    Active Touch Points: <span className="text-red-500 font-bold">{touchCount}</span>
                </div>
            )}

            {/* Instructions */}
            {!isFullscreen && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 border border-neutral-800 text-white px-6 py-3 rounded pointer-events-none text-center">
                    <div className="font-semibold mb-1">Multi-Touch Test</div>
                    <div className="text-sm text-neutral-400">Touch or drag across the screen. Green grid = working zones.</div>
                </div>
            )}
        </div>
    )
}
