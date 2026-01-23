"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CheatSheets() {
    return (
        <Card className="h-full bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-white">Technician Reference</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border border-neutral-800 p-4">
                    <div className="space-y-6 text-sm">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Common Motherboard Screws</h3>
                            <ul className="space-y-1 text-neutral-300">
                                <li><strong className="text-white">Phillips #000</strong>: Most internal components</li>
                                <li><strong className="text-white">Pentalobe P2</strong>: iPhone bottom case</li>
                                <li><strong className="text-white">Tri-point Y000</strong>: iPhone 7+ internal</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Beep Codes (Dell/Generic)</h3>
                            <ul className="space-y-1 text-neutral-300">
                                <li><strong className="text-white">1 Beep</strong>: BIOS ROM failure</li>
                                <li><strong className="text-white">2 Beeps</strong>: No RAM detected</li>
                                <li><strong className="text-white">3 Beeps</strong>: Motherboard failure</li>
                                <li><strong className="text-white">4 Beeps</strong>: RAM read/write failure</li>
                                <li><strong className="text-white">5 Beeps</strong>: CMOS battery failure</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Network Ports</h3>
                            <ul className="space-y-1 text-neutral-300">
                                <li><strong className="text-white">80/443</strong>: HTTP/HTTPS</li>
                                <li><strong className="text-white">22</strong>: SSH</li>
                                <li><strong className="text-white">3389</strong>: RDP</li>
                                <li><strong className="text-white">53</strong>: DNS</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Soldering Temps</h3>
                            <ul className="space-y-1 text-neutral-300">
                                <li><strong className="text-white">Leaded</strong>: 183°C (Melting) - 300-350°C (Iron)</li>
                                <li><strong className="text-white">Lead-Free</strong>: 217°C (Melting) - 350-400°C (Iron)</li>
                            </ul>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
