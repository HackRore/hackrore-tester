"use client"

import { useState, useEffect } from "react"
import { Battery, BatteryCharging, BatteryWarning, Zap, Clock, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface BatteryManager extends EventTarget {
    charging: boolean
    chargingTime: number
    dischargingTime: number
    level: number
    addEventListener: (type: string, listener: (event: Event) => void) => void
    removeEventListener: (type: string, listener: (event: Event) => void) => void
}

export function BatteryTest() {
    const [battery, setBattery] = useState<BatteryManager | null>(null)
    const [level, setLevel] = useState(0)
    const [charging, setCharging] = useState(false)
    const [chargingTime, setChargingTime] = useState(0)
    const [dischargingTime, setDischargingTime] = useState(0)
    const [supported, setSupported] = useState(true)

    useEffect(() => {
        // Navigator interface augmentation for Battery API which is somewhat experimental
        const nav = navigator as any
        if (!nav.getBattery) {
            setSupported(false)
            return
        }

        nav.getBattery().then((bat: BatteryManager) => {
            setBattery(bat)
            setLevel(bat.level)
            setCharging(bat.charging)
            setChargingTime(bat.chargingTime)
            setDischargingTime(bat.dischargingTime)

            const updateBattery = () => {
                setLevel(bat.level)
                setCharging(bat.charging)
                setChargingTime(bat.chargingTime)
                setDischargingTime(bat.dischargingTime)
            }

            bat.addEventListener('chargingchange', updateBattery)
            bat.addEventListener('levelchange', updateBattery)
            bat.addEventListener('chargingtimechange', updateBattery)
            bat.addEventListener('dischargingtimechange', updateBattery)

            return () => {
                bat.removeEventListener('chargingchange', updateBattery)
                bat.removeEventListener('levelchange', updateBattery)
                bat.removeEventListener('chargingtimechange', updateBattery)
                bat.removeEventListener('dischargingtimechange', updateBattery)
            }
        })
    }, [])

    const formatTime = (seconds: number) => {
        if (seconds === Infinity) return "Calculating..."
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        return `${h}h ${m}m`
    }

    if (!supported) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="p-6 rounded-full bg-secondary/30">
                    <BatteryWarning className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">Battery API Not Supported</h3>
                <p className="text-muted-foreground max-w-sm">
                    Your browser or device does not support the Battery Status API.
                    This is common on desktop computers without batteries or restrictive browsers.
                </p>
            </div>
        )
    }

    const percentage = Math.round(level * 100)
    const color = percentage > 20 ? (charging ? "text-green-400" : "text-primary") : "text-red-500"

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4">

            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Main Status Card */}
                <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                    {/* Background glow */}
                    <div className={cn("absolute inset-0 opacity-10 blur-3xl",
                        charging ? "bg-green-500" : percentage < 20 ? "bg-red-500" : "bg-blue-500"
                    )} />

                    <div className="relative z-10 text-center space-y-2">
                        <div className="relative inline-block">
                            {charging ? (
                                <BatteryCharging className={cn("h-32 w-32 animate-pulse", color)} />
                            ) : (
                                <Battery className={cn("h-32 w-32", color)} />
                            )}
                            {/* Level Fill (Visual Hack inside icon if possible, but svg path is static. Using overlay text instead) */}
                        </div>

                        <div className="space-y-1">
                            <div className="text-6xl font-black tracking-tighter text-foreground">
                                {percentage}%
                            </div>
                            <div className={cn("text-lg font-bold uppercase tracking-widest", color)}>
                                {charging ? "Charging" : "Discharging"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Time Status */}
                    <div className="bg-card/30 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-secondary/50 rounded-full">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Time Remaining</div>
                            <div className="text-xl font-mono font-bold">
                                {charging
                                    ? (chargingTime === Infinity ? "Fully Charged" : formatTime(chargingTime))
                                    : (dischargingTime === Infinity ? "Calculating..." : formatTime(dischargingTime))
                                }
                            </div>
                        </div>
                    </div>

                    {/* Power Status */}
                    <div className="bg-card/30 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-secondary/50 rounded-full">
                            <Zap className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Power Source</div>
                            <div className="text-xl font-bold">
                                {charging ? "AC Adapter" : "Battery"}
                            </div>
                        </div>
                    </div>

                    {/* Health / Usage Hint */}
                    <div className="bg-card/30 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-secondary/50 rounded-full">
                            <TrendingDown className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Discharge Rate</div>
                            <div className="text-xl font-mono">
                                {dischargingTime !== Infinity && !charging ? "Active" : "Stable"}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
