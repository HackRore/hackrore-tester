"use client"
import { useEffect, useState } from "react"
import { Battery, Cpu, MemoryStick, Monitor, HardDrive, Wifi, Globe, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function SystemTest() {
    const [battery, setBattery] = useState<any>(null)
    const [systemInfo, setSystemInfo] = useState<any>(null)

    useEffect(() => {
        // Battery API
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((b: any) => {
                setBattery(b)
                updateBattery(b)
                b.addEventListener('levelchange', () => updateBattery(b))
                b.addEventListener('chargingchange', () => updateBattery(b))
            })
        }

        // System Information
        const info: any = {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: (navigator as any).deviceMemory || 'Unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            screenColorDepth: window.screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
        }

        // Detect OS
        const ua = navigator.userAgent.toLowerCase()
        if (ua.includes('win')) info.os = 'Windows'
        else if (ua.includes('mac')) info.os = 'macOS'
        else if (ua.includes('linux')) info.os = 'Linux'
        else if (ua.includes('android')) info.os = 'Android'
        else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) info.os = 'iOS'
        else info.os = 'Unknown'

        // Detect Browser
        if (ua.includes('chrome') && !ua.includes('edg')) info.browser = 'Chrome'
        else if (ua.includes('firefox')) info.browser = 'Firefox'
        else if (ua.includes('safari') && !ua.includes('chrome')) info.browser = 'Safari'
        else if (ua.includes('edg')) info.browser = 'Edge'
        else info.browser = 'Unknown'

        setSystemInfo(info)
    }, [])

    const updateBattery = (b: any) => {
        setBattery({
            level: b.level,
            charging: b.charging,
            chargingTime: b.chargingTime,
            dischargingTime: b.dischargingTime
        })
    }

    const InfoRow = ({ label, value, icon: Icon }: { label: string, value: string | number, icon?: any }) => (
        <div className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-neutral-500" />}
                <span className="text-sm text-neutral-400">{label}</span>
            </div>
            <span className="text-sm font-mono font-semibold text-white">{value}</span>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* System Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Cpu className="h-5 w-5 text-blue-400" />
                            Processor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="CPU Cores" value={systemInfo?.hardwareConcurrency || 'N/A'} />
                        <InfoRow label="Memory" value={systemInfo?.deviceMemory ? `${systemInfo.deviceMemory} GB` : 'Unknown'} />
                        <InfoRow label="Platform" value={systemInfo?.platform || 'N/A'} />
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Monitor className="h-5 w-5 text-purple-400" />
                            Display
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Resolution" value={systemInfo ? `${systemInfo.screenWidth} × ${systemInfo.screenHeight}` : 'N/A'} />
                        <InfoRow label="Color Depth" value={systemInfo ? `${systemInfo.screenColorDepth} bit` : 'N/A'} />
                        <InfoRow label="Pixel Ratio" value={systemInfo?.pixelRatio || 'N/A'} />
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Globe className="h-5 w-5 text-green-400" />
                            Browser
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Browser" value={systemInfo?.browser || 'Unknown'} />
                        <InfoRow label="Language" value={systemInfo?.language || 'N/A'} />
                        <InfoRow label="Online" value={systemInfo?.onLine ? 'Yes' : 'No'} />
                    </CardContent>
                </Card>
            </div>

            {/* Battery Status */}
            {battery && (
                <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Battery className={`h-5 w-5 ${battery.charging ? 'text-green-400' : 'text-yellow-400'}`} />
                            Battery Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-400">Charge Level</span>
                                <span className="text-lg font-bold text-white">{(battery.level * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={battery.level * 100} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                            <span className="text-sm text-neutral-400">Status</span>
                            <Badge variant={battery.charging ? "default" : "secondary"} className={battery.charging ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}>
                                {battery.charging ? "Charging" : "Discharging"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Detailed System Info */}
            <Card className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-white">
                        <HardDrive className="h-5 w-5 text-orange-400" />
                        System Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow label="Operating System" value={systemInfo?.os || 'Unknown'} />
                    <InfoRow label="Touch Points" value={systemInfo?.maxTouchPoints || 0} icon={Smartphone} />
                    <InfoRow label="Timezone" value={systemInfo?.timezone || 'N/A'} />
                    <InfoRow label="Cookies Enabled" value={systemInfo?.cookieEnabled ? 'Yes' : 'No'} />
                    <div className="pt-2 mt-2 border-t border-neutral-800">
                        <div className="text-xs text-neutral-500 mb-1">User Agent</div>
                        <code className="text-xs text-neutral-400 break-all bg-neutral-950 p-2 rounded block">
                            {systemInfo?.userAgent || 'N/A'}
                        </code>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
