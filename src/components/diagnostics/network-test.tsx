"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wifi } from "lucide-react"

export function NetworkTest() {
    const [status, setStatus] = useState<"idle" | "running" | "done">("idle")
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState<{ ping: number, down: number } | null>(null)

    const runTest = () => {
        setStatus("running")
        setProgress(0)

        let p = 0
        const interval = setInterval(() => {
            p += 5
            setProgress(p)
            if (p >= 100) {
                clearInterval(interval)
                setStatus("done")
                setResult({
                    ping: Math.floor(Math.random() * 50) + 10,
                    down: Math.floor(Math.random() * 500) + 50
                })
            }
        }, 100)
    }

    return (
        <div className="p-6 border rounded-md space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Wifi className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-medium">Network Speed Simulation</h3>
                    <p className="text-sm text-muted-foreground">Test connection stability and speed.</p>
                </div>
            </div>

            {status === "idle" && (
                <Button onClick={runTest}>Start Speed Test</Button>
            )}

            {status === "running" && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Testing...</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                </div>
            )}

            {status === "done" && result && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-md text-center">
                        <div className="text-2xl font-bold">{result.ping} ms</div>
                        <div className="text-xs text-muted-foreground uppercase">Ping</div>
                    </div>
                    <div className="p-4 bg-muted rounded-md text-center">
                        <div className="text-2xl font-bold">{result.down} Mbps</div>
                        <div className="text-xs text-muted-foreground uppercase">Download</div>
                    </div>
                    <Button variant="outline" className="col-span-2" onClick={runTest}>Run Again</Button>
                </div>
            )}
        </div>
    )
}
