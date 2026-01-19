"use client"
import { useEffect, useState } from "react"
import { Battery, Cpu } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SystemTest() {
    const [battery, setBattery] = useState<any>(null)

    useEffect(() => {
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((b: any) => {
                setBattery(b)
                updateBattery(b)
                b.addEventListener('levelchange', () => updateBattery(b))
                b.addEventListener('chargingchange', () => updateBattery(b))
            })
        }
    }, [])

    const updateBattery = (b: any) => {
        setBattery({
            level: b.level,
            charging: b.charging
        })
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Battery className="h-5 w-5" /> Battery Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {battery ? (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Level</span>
                                <span className="font-bold">{(battery.level * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className={`font-bold ${battery.charging ? "text-green-500" : ""}`}>
                                    {battery.charging ? "Charging" : "Discharging"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Battery API not supported in this browser.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5" /> System Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform</span>
                        <span className="font-mono text-sm">{typeof navigator !== 'undefined' ? navigator.platform : '?'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Cores</span>
                        <span className="font-bold">{typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : "?"}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
