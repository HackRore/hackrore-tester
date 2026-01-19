"use client"
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const cheatsheetContent = `
# Common Motherboard Screws
- **Phillips #000**: Most internal components
- **Pentalobe P2**: iPhone bottom case
- **Tri-point Y000**: iPhone 7+ internal

# Beep Codes (Dell/Generic)
- **1 Beep**: BIOS ROM failure
- **2 Beeps**: No RAM detected
- **3 Beeps**: Motherboard failure
- **4 Beeps**: RAM read/write failure
- **5 Beeps**: CMOS battery failure

# Network Ports
- **80/443**: HTTP/HTTPS
- **22**: SSH
- **3389**: RDP
- **53**: DNS

# Soldering Temps
- **Leaded**: 183°C (Melting) - 300-350°C (Iron)
- **Lead-Free**: 217°C (Melting) - 350-400°C (Iron)
`

export function CheatSheets() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Technician Reference</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="prose dark:prose-invert">
                        <ReactMarkdown>{cheatsheetContent}</ReactMarkdown>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
