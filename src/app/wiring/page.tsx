"use client"

import { useState } from "react"
import { Cpu, Zap, Server, HardDrive, Monitor, MousePointer } from "lucide-react"

export default function WiringPage() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null)

    const nodes = [
        { id: "cpu", x: 400, y: 100, label: "CPU Unit", icon: Cpu, color: "text-blue-500" },
        { id: "mobo", x: 400, y: 300, label: "Motherboard", icon: Server, color: "text-green-500" },
        { id: "pwr", x: 150, y: 300, label: "Power Supply", icon: Zap, color: "text-yellow-500" },
        { id: "gpu", x: 650, y: 300, label: "GPU Unit", icon: Monitor, color: "text-purple-500" },
        { id: "storage", x: 400, y: 500, label: "SSD / HDD", icon: HardDrive, color: "text-red-500" },
    ]

    const connections = [
        { from: "pwr", to: "mobo", label: "24-pin ATX" },
        { from: "pwr", to: "cpu", label: "8-pin EPS" },
        { from: "pwr", to: "gpu", label: "6+2 PCIe" },
        { from: "cpu", to: "mobo", label: "Socket AM4/LGA" },
        { from: "gpu", to: "mobo", label: "PCIe x16" },
        { from: "storage", to: "mobo", label: "M.2 / SATA" },
    ]

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Interactive Wiring Diagrams</h1>
                <p className="text-muted-foreground">Mainboard Component Interconnect Map</p>
            </div>

            <div className="w-full h-[600px] border border-border rounded-2xl bg-card relative shadow-sm overflow-hidden group">

                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

                {/* Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
                        </marker>
                    </defs>
                    {connections.map((conn, i) => {
                        const start = nodes.find(n => n.id === conn.from)!
                        const end = nodes.find(n => n.id === conn.to)!
                        return (
                            <g key={i}>
                                <line
                                    x1={start.x} y1={start.y}
                                    x2={end.x} y2={end.y}
                                    className="stroke-muted-foreground/30 stroke-2"
                                    markerEnd="url(#arrowhead)"
                                />
                                <text
                                    x={(start.x + end.x) / 2}
                                    y={(start.y + end.y) / 2}
                                    className="text-[10px] fill-muted-foreground text-center"
                                    textAnchor="middle"
                                    dy="-5"
                                >
                                    {conn.label}
                                </text>
                            </g>
                        )
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map((node) => (
                    <button
                        key={node.id}
                        onClick={() => setSelectedNode(node.id)}
                        className="absolute w-16 h-16 -ml-8 -mt-8 bg-background border-2 border-primary rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all z-10"
                        style={{ left: node.x, top: node.y }}
                    >
                        <node.icon className={`h-8 w-8 ${node.color}`} />
                        <div className="absolute -bottom-6 text-xs font-bold whitespace-nowrap bg-background/80 px-2 py-0.5 rounded-full border border-border">
                            {node.label}
                        </div>
                    </button>
                ))}

                {/* Info Panel */}
                {selectedNode && (
                    <div className="absolute top-4 right-4 w-64 p-4 bg-background/95 backdrop-blur border border-border rounded-xl shadow-xl z-20">
                        <h3 className="font-bold flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            {nodes.find(n => n.id === selectedNode)?.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2">
                            Detailed pinout and voltage information for this component would be displayed here.
                        </p>
                        <button
                            onClick={() => setSelectedNode(null)}
                            className="mt-4 text-xs font-bold text-primary hover:underline"
                        >
                            Close Details
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}
