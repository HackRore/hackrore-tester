"use client"

import { useState, useEffect, useRef } from "react"
import { Battery, BatteryCharging, BatteryLow, AlertCircle, Download, Upload, FileText, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

interface BatteryInfo {
    level: number
    charging: boolean
    chargingTime: number
    dischargingTime: number
    health?: string
    cycles?: number
    designCapacity?: number
    fullChargeCapacity?: number
}

export default function BatteryPage() {
    const [battery, setBattery] = useState<BatteryInfo | null>(null)
    const [batteryReport, setBatteryReport] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [os, setOs] = useState<'windows' | 'mac' | 'linux' | 'unknown'>('unknown')

    useEffect(() => {
        // Detect OS
        const userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.includes('win')) setOs('windows')
        else if (userAgent.includes('mac')) setOs('mac')
        else if (userAgent.includes('linux')) setOs('linux')

        // Get Battery Info
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((b: any) => {
                updateBattery(b)
                b.addEventListener('levelchange', () => updateBattery(b))
                b.addEventListener('chargingchange', () => updateBattery(b))
                b.addEventListener('chargingtimechange', () => updateBattery(b))
                b.addEventListener('dischargingtimechange', () => updateBattery(b))
            })
        }
    }, [])

    const updateBattery = (b: any) => {
        setBattery({
            level: b.level,
            charging: b.charging,
            chargingTime: b.chargingTime,
            dischargingTime: b.dischargingTime
        })
    }

    const formatTime = (seconds: number) => {
        if (seconds === Infinity || !seconds) return 'N/A'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    const calculateHealth = (level: number, charging: boolean) => {
        if (level >= 0.9) return { status: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/10' }
        if (level >= 0.7) return { status: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10' }
        if (level >= 0.5) return { status: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
        if (level >= 0.3) return { status: 'Poor', color: 'text-orange-400', bg: 'bg-orange-500/10' }
        return { status: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10' }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsAnalyzing(true)
        const reader = new FileReader()
        
        reader.onload = (event) => {
            const content = event.target?.result as string
            setBatteryReport(content)
            parseBatteryReport(content)
            setIsAnalyzing(false)
        }
        
        reader.readAsText(file)
    }

    const parseBatteryReport = (html: string) => {
        // Parse Windows battery report HTML
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        
        // Extract key information from battery report
        const text = doc.body.textContent || ''
        
        // Look for design capacity and full charge capacity
        const designMatch = text.match(/DESIGN CAPACITY\s+(\d+)\s+mWh/i)
        const fullMatch = text.match(/FULL CHARGE CAPACITY\s+(\d+)\s+mWh/i)
        const cycleMatch = text.match(/CYCLE COUNT\s+(\d+)/i)
        
        if (designMatch && fullMatch && battery) {
            const design = parseInt(designMatch[1])
            const full = parseInt(fullMatch[1])
            const healthPercent = (full / design) * 100
            
            setBattery({
                ...battery,
                health: `${healthPercent.toFixed(1)}%`,
                designCapacity: design,
                fullChargeCapacity: full,
                cycles: cycleMatch ? parseInt(cycleMatch[1]) : undefined
            })
        }
    }

    const health = battery ? calculateHealth(battery.level, battery.charging) : null

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
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <Battery className="h-8 w-8 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                                Battery Health Test
                            </h1>
                            <p className="text-neutral-400 mt-2">
                                Check battery status, health, and detailed diagnostics
                            </p>
                        </div>
                    </div>
                </div>

                {/* Browser Battery Info */}
                {battery ? (
                    <div className="grid gap-6 md:grid-cols-2 mb-6">
                        <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    {battery.charging ? (
                                        <BatteryCharging className="h-5 w-5 text-green-400" />
                                    ) : (
                                        <Battery className="h-5 w-5 text-yellow-400" />
                                    )}
                                    Current Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-400">Charge Level</span>
                                        <span className="text-2xl font-bold text-white">{(battery.level * 100).toFixed(0)}%</span>
                                    </div>
                                    <Progress value={battery.level * 100} className="h-3" />
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                    <span className="text-sm text-neutral-400">Status</span>
                                    <Badge 
                                        variant="outline" 
                                        className={battery.charging ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}
                                    >
                                        {battery.charging ? "Charging" : "Discharging"}
                                    </Badge>
                                </div>

                                {battery.charging && battery.chargingTime !== Infinity && (
                                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                        <span className="text-sm text-neutral-400">Time to Full</span>
                                        <span className="text-sm font-mono text-white">{formatTime(battery.chargingTime)}</span>
                                    </div>
                                )}

                                {!battery.charging && battery.dischargingTime !== Infinity && (
                                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                        <span className="text-sm text-neutral-400">Time Remaining</span>
                                        <span className="text-sm font-mono text-white">{formatTime(battery.dischargingTime)}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Zap className="h-5 w-5 text-blue-400" />
                                    Health Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {health && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-neutral-400">Overall Health</span>
                                            <Badge className={`${health.bg} ${health.color} border-0`}>
                                                {health.status}
                                            </Badge>
                                        </div>
                                        
                                        {battery.health && (
                                            <>
                                                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                                    <span className="text-sm text-neutral-400">Battery Health</span>
                                                    <span className="text-lg font-bold text-white">{battery.health}</span>
                                                </div>
                                                {battery.designCapacity && battery.fullChargeCapacity && (
                                                    <div className="space-y-2 pt-2 border-t border-neutral-800">
                                                        <div className="flex justify-between text-xs text-neutral-500">
                                                            <span>Design: {battery.designCapacity.toLocaleString()} mWh</span>
                                                            <span>Current: {battery.fullChargeCapacity.toLocaleString()} mWh</span>
                                                        </div>
                                                        <Progress value={parseFloat(battery.health)} className="h-2" />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {battery.cycles && (
                                            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                                <span className="text-sm text-neutral-400">Charge Cycles</span>
                                                <span className="text-sm font-mono text-white">{battery.cycles.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-200 mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Battery API Not Available</AlertTitle>
                        <AlertDescription>
                            Your browser doesn't support the Battery API, or you're on a desktop without a battery.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Windows Battery Report Section */}
                {os === 'windows' && (
                    <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800 mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <FileText className="h-5 w-5 text-purple-400" />
                                Detailed Battery Report (Windows)
                            </CardTitle>
                            <CardDescription className="text-neutral-400">
                                Generate a comprehensive battery health report using Windows powercfg command
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3">
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-2">Step 1: Generate Battery Report</h4>
                                    <p className="text-xs text-neutral-400 mb-3">
                                        Open PowerShell or Command Prompt as Administrator and run:
                                    </p>
                                    <code className="block bg-black/50 border border-neutral-800 rounded p-3 text-sm text-green-400 font-mono">
                                        powercfg /batteryreport
                                    </code>
                                    <p className="text-xs text-neutral-500 mt-2">
                                        This will create a battery-report.html file in your user directory (usually C:\Users\YourUsername\)
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-2">Step 2: Upload Report</h4>
                                    <p className="text-xs text-neutral-400 mb-3">
                                        Upload the battery-report.html file to analyze detailed health metrics:
                                    </p>
                                    <div className="flex gap-3">
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".html,.htm"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="battery-report-upload"
                                        />
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            variant="outline"
                                            className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Battery Report
                                        </Button>
                                        {isAnalyzing && (
                                            <span className="text-sm text-neutral-400 flex items-center">
                                                Analyzing...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {batteryReport && (
                                <Alert className="bg-green-500/10 border-green-500/20 text-green-200">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Report Loaded</AlertTitle>
                                    <AlertDescription>
                                        Battery report has been analyzed. Health metrics are displayed above.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Alternative Methods */}
                <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Alternative Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-neutral-400">
                            <div>
                                <strong className="text-white">macOS:</strong> System Information → Power → Check "Cycle Count" and "Condition"
                            </div>
                            <div>
                                <strong className="text-white">Linux:</strong> Check <code className="bg-neutral-950 px-1 rounded">/sys/class/power_supply/BAT0/</code> for battery information
                            </div>
                            <div>
                                <strong className="text-white">General:</strong> Most laptops have built-in battery diagnostics in BIOS/UEFI settings
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
