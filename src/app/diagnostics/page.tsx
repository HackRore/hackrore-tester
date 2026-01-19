"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AudioVideoTest } from "@/components/diagnostics/audio-video-test"
import { InputTest } from "@/components/diagnostics/input-test"
import { DisplayTest } from "@/components/diagnostics/display-test"
import { NetworkTest } from "@/components/diagnostics/network-test"
import { SystemTest } from "@/components/diagnostics/system-test"

export default function DiagnosticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Device Diagnostics</h2>
                <p className="text-muted-foreground">
                    Run tests to verify hardware and system functionality.
                </p>
            </div>

            <Tabs defaultValue="audio-video" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="audio-video">Audio & Video</TabsTrigger>
                    <TabsTrigger value="input">Input Devices</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value="audio-video" className="space-y-4">
                    <AudioVideoTest />
                </TabsContent>
                <TabsContent value="input" className="space-y-4">
                    <InputTest />
                </TabsContent>
                <TabsContent value="display" className="space-y-4">
                    <DisplayTest />
                </TabsContent>
                <TabsContent value="network" className="space-y-4">
                    <NetworkTest />
                </TabsContent>
                <TabsContent value="system" className="space-y-4">
                    <SystemTest />
                </TabsContent>
            </Tabs>
        </div>
    )
}
