"use client"

import { useState, useEffect } from "react"
import { Keyboard, Mouse, Gamepad2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function InputTest() {
    const [lastKey, setLastKey] = useState<string>("")
    const [mouseState, setMouseState] = useState<{ x: number, y: number, down: boolean }>({ x: 0, y: 0, down: false })

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => setLastKey(e.code)
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Keyboard className="h-5 w-5" /> Keyboard Test</CardTitle>
                    <CardDescription>Press any key to test.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-md bg-muted/50">
                        <span className="text-4xl font-mono font-bold">{lastKey || "Press Key"}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Mouse className="h-5 w-5" /> Mouse Test</CardTitle>
                    <CardDescription>Move and click in the area below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={`h-32 flex items-center justify-center border rounded-md transition-colors ${mouseState.down ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        onMouseMove={(e) => setMouseState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, down: (e.buttons > 0) })}
                        onMouseDown={() => setMouseState(prev => ({ ...prev, down: true }))}
                        onMouseUp={() => setMouseState(prev => ({ ...prev, down: false }))}
                    >
                        <div className="text-center">
                            <div>X: {mouseState.x} Y: {mouseState.y}</div>
                            <div>{mouseState.down ? "CLICKED" : "Idle"}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Gamepad2 className="h-5 w-5" /> Gamepad Test</CardTitle>
                    <CardDescription>Connect a controller to test.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground p-4 text-center">
                        Connect a gamepad and press buttons. (Implementation pending)
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
