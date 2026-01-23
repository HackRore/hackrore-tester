"use client";

import React from "react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const BEEP_CODES = [
    { code: "1 Short", mean: "System OK / POST Pass" },
    { code: "2 Short", mean: "CMOS Setting Error" },
    { code: "1 Long, 1 Short", mean: "Motherboard / RAM Error" },
    { code: "1 Long, 2 Short", mean: "Video Card Error" },
    { code: "1 Long, 3 Short", mean: "Keyboard Controller Error" },
    { code: "Continuous Short", mean: "Power Supply Voltage Error" },
];

const BSOD_CODES = [
    { code: "0x0000007B", name: "INACCESSIBLE_BOOT_DEVICE", fix: "Check SATA/NVMe mode (AHCI/RAID), Driver issue" },
    { code: "0x0000000A", name: "IRQL_NOT_LESS_OR_EQUAL", fix: "Bad Driver, Overclocking, RAM" },
    { code: "0x0000003B", name: "SYSTEM_SERVICE_EXCEPTION", fix: "Corrupt System Files, Update Drivers" },
    { code: "0x00000050", name: "PAGE_FAULT_IN_NONPAGED_AREA", fix: "Faulty RAM (Run MemTest), VRAM, or Drive" },
];

const CMD_COMMANDS = [
    { cmd: "sfc /scannow", desc: "Repair system files" },
    { cmd: "dism /online /cleanup-image /restorehealth", desc: "Fix Windows Image" },
    { cmd: "ipconfig /flushdns", desc: "Clear DNS Resolver" },
    { cmd: "netsh winsock reset", desc: "Reset Network Stack" },
    { cmd: "wmic diskdrive get status", desc: "Check HDD SMART Status" },
];

export function CheatSheets({ search }: { search: string }) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard: " + text);
    };

    return (
        <AnimatedCard className="p-6">
            <h2 className="text-xl font-bold mb-6">Technician Quick Reference</h2>

            <Tabs defaultValue="bios" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 space-x-6">
                    <TabsTrigger value="bios" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2">BIOS Beep Codes</TabsTrigger>
                    <TabsTrigger value="bsod" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2">BSOD Hex Codes</TabsTrigger>
                    <TabsTrigger value="cmd" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2">Command Line</TabsTrigger>
                </TabsList>

                <TabsContent value="bios">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Beep Pattern</TableHead>
                                <TableHead>Meaning / Diagnosis</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BEEP_CODES.filter(x => x.mean.toLowerCase().includes(search.toLowerCase()) || x.code.toLowerCase().includes(search.toLowerCase()))
                                .map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-bold font-mono">{item.code}</TableCell>
                                        <TableCell>{item.mean}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="bsod">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Hex Code</TableHead>
                                <TableHead>Error Name</TableHead>
                                <TableHead>Potential Fix</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BSOD_CODES.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.code.toLowerCase().includes(search.toLowerCase()))
                                .map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-bold font-mono">{item.code}</TableCell>
                                        <TableCell className="text-red-400 font-semibold">{item.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.fix}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="cmd">
                    <div className="space-y-2">
                        {CMD_COMMANDS.filter(x => x.cmd.includes(search) || x.desc.toLowerCase().includes(search.toLowerCase()))
                            .map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-border/50 group hover:border-primary/30 transition-colors">
                                    <div>
                                        <div className="font-mono font-bold text-primary group-hover:text-primary/80">{item.cmd}</div>
                                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.cmd)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                    </div>
                </TabsContent>
            </Tabs>
        </AnimatedCard>
    );
}
