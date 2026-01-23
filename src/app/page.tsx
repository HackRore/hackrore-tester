"use client"

import Link from "next/link"
import {
  Camera, Mic, Volume2, Keyboard, Mouse, Smartphone, Monitor, Wifi,
  FileText, Workflow, Cpu, Battery, Search, ArrowRight,
  Activity, Database, Gamepad2, Briefcase, BookOpen, Zap
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnimatedCard } from "@/components/shared/AnimatedCard"
import { Badge } from "@/components/ui/badge"

// Consolidated Tool Data
const ALL_TOOLS = [
  { id: "camera", title: "Camera", icon: Camera, desc: "Webcam & Face ID check", href: "/test/camera", category: "hardware" },
  { id: "mic", title: "Microphone", icon: Mic, desc: "Input frequency check", href: "/test/mic", category: "hardware" },
  { id: "speakers", title: "Speakers", icon: Volume2, desc: "Stereo sound synthesis", href: "/test/speakers", category: "hardware" },
  { id: "keyboard", title: "Keyboard", icon: Keyboard, desc: "Key press verification", href: "/test/keyboard", category: "hardware" },
  { id: "mouse", title: "Mouse", icon: Mouse, desc: "Click & sensor polling", href: "/test/mouse", category: "hardware" },
  { id: "touch", title: "Touch Screen", icon: Smartphone, desc: "Digitizer test", href: "/test/touch", category: "hardware" },
  { id: "display", title: "Display", icon: Monitor, desc: "Dead pixel cycler", href: "/test/display", category: "hardware" },
  { id: "network", title: "Network", icon: Wifi, desc: "Connectivity status", href: "/test/network", category: "hardware" },
  { id: "battery", title: "Battery", icon: Battery, desc: "Health & cycles", href: "/test/battery", category: "hardware" },
  { id: "system", title: "System", icon: Cpu, desc: "Hardware specifications", href: "/test/system", category: "hardware" },
  { id: "benchmark", title: "Benchmark", icon: Activity, desc: "CPU/GPU Stress Test", href: "/test/benchmark", category: "hardware", featured: true },
  { id: "storage", title: "Storage", icon: Database, desc: "Read/Write Speed", href: "/test/storage", category: "hardware" },
  { id: "controller", title: "Controller", icon: Gamepad2, desc: "Gamepad Input", href: "/test/controller", category: "hardware" },
  { id: "portfolio", title: "Portfolio", icon: Briefcase, desc: "Technician Profile", href: "/portfolio", category: "workflow" },
  { id: "resources", title: "Resources", icon: BookOpen, desc: "Knowledge Base", href: "/resources", category: "workflow" },
]

const QUICK_LINKS = ALL_TOOLS.filter(t => ["network", "display", "benchmark", "portfolio"].includes(t.id));

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTools = ALL_TOOLS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hardwareTools = filteredTools.filter(t => t.category === "hardware")
  const workflowTools = filteredTools.filter(t => t.category === "workflow")

  if (!mounted) return null

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-20">

      {/* Hero Section */}
      <section className="relative text-center space-y-6 pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4"
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Professional Grade</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-foreground"
        >
          Smart Technician <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Suite</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          The ultimate diagnostic toolkit for modern hardware. <br />
          Test, verify, and document repairs with gamified precision.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-md mx-auto mt-8 group"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tools (e.g. 'Dead Pixel', 'Speed Test')..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/50 focus:bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 transition-all font-medium shadow-sm hover:shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
      </section>

      {/* Quick Access Grid (Only show if no search) */}
      {!searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_LINKS.map((tool, index) => (
              <AnimatedCard key={tool.id} delay={index * 0.1} className="h-full bg-primary/5 border-primary/20 hover:border-primary/50">
                <Link href={tool.href} className="flex flex-col gap-3 p-4 h-full">
                  <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary">
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{tool.desc}</p>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Grid */}
      <section className="space-y-8">
        {/* Hardware Tools */}
        {hardwareTools.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-xl font-bold tracking-tight">Diagnostics</h2>
              <Badge variant="secondary" className="font-mono text-xs">{hardwareTools.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hardwareTools.map((tool, idx) => (
                <ToolGridItem key={tool.id} tool={tool} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Workflow Tools */}
        {workflowTools.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-xl font-bold tracking-tight">Workflow & Resources</h2>
              <Badge variant="secondary" className="font-mono text-xs">{workflowTools.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workflowTools.map((tool, idx) => (
                <ToolGridItem key={tool.id} tool={tool} index={idx} />
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  )
}

function ToolGridItem({ tool, index }: { tool: any, index: number }) {
  return (
    <AnimatedCard delay={index * 0.05} className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-colors">
      <Link href={tool.href} className="flex flex-col h-full p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
            <tool.icon className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-auto space-y-1">
          <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">{tool.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{tool.desc}</p>
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
      </Link>

      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </AnimatedCard>
  )
}

