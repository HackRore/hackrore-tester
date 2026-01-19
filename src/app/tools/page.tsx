"use client"
import { useState, useEffect } from "react"
import { Globe, Shield, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ToolsPage() {
    const [ipInfo, setIpInfo] = useState<any>(null)
    const [browserInfo, setBrowserInfo] = useState<any>(null)

    useEffect(() => {
        // Get IP
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setIpInfo(data))
            .catch(err => console.error(err))

        // Browser Info
        setBrowserInfo({
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            // @ts-ignore
            memory: (navigator as any).deviceMemory || 'Unknown',
            cores: navigator.hardwareConcurrency
        })
    }, [])

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Network Identity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Public IP</span>
                            <span className="font-bold">{ipInfo?.ip || "Loading..."}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Browser Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                    {browserInfo && (
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cookies</span>
                                <span className={browserInfo.cookiesEnabled ? "text-green-500" : "text-red-500"}>{browserInfo.cookiesEnabled ? "Enabled" : "Disabled"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Language</span>
                                <span>{browserInfo.language}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Memory</span>
                                <span>{browserInfo.memory} GB (Approx)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cores</span>
                                <span>{browserInfo.cores}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> User Agent</CardTitle>
                </CardHeader>
                <CardContent>
                    <code className="text-xs break-all bg-muted p-2 rounded block">
                        {browserInfo?.userAgent}
                    </code>
                </CardContent>
            </Card>
        </div>
    )
}
