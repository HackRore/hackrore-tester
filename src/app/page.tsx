"use client"

import {
  Camera, Mic, Volume2, Keyboard, Mouse, Smartphone, Monitor, Wifi,
  FileText, Workflow, Bot, Info, Globe, Shield, Terminal, Settings,
  Cpu, Battery, Share2
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Diagnostic Components
import { AudioVideoTest } from "@/components/diagnostics/audio-video-test"
import { InputTest } from "@/components/diagnostics/input-test"
import { TouchTest } from "@/components/diagnostics/touch-test"
import { DisplayTest } from "@/components/diagnostics/display-test"
import { NetworkTest } from "@/components/diagnostics/network-test"
import { SystemTest } from "@/components/diagnostics/system-test"

// Workflow Components
import { CaseLogForm } from "@/components/workflow/case-log-form"
import { CheatSheets } from "@/components/workflow/cheat-sheets"
import { WiringBuilder } from "@/components/workflow/wiring-builder"

function ChatWrapper() {
  return (
    <iframe src="/ai" className="w-full h-[600px] border-none" title="AI Assistant" />
  )
}

function IPWrapper() {
  return (
    <iframe src="/tools" className="w-full h-[400px] border-none" title="Public IP" />
  )
}

export default function Home() {
  const tools = [
    {
      title: "Camera", icon: Camera, color: "text-white", bg: "bg-blue-600",
      desc: "Test webcam and functionality.",
      component: <AudioVideoTest mode="camera" />
    },
    {
      title: "Microphone", icon: Mic, color: "text-white", bg: "bg-purple-600",
      desc: "Check input levels and visualize audio.",
      component: <AudioVideoTest mode="mic" />
    },
    {
      title: "Speakers", icon: Volume2, color: "text-white", bg: "bg-pink-600",
      desc: "Test stereo output and channels.",
      component: <AudioVideoTest mode="speakers" />
    },
    {
      title: "Keyboard", icon: Keyboard, color: "text-white", bg: "bg-orange-600",
      desc: "Check key presses and ghosting.",
      component: <InputTest mode="keyboard" />
    },
    {
      title: "Mouse", icon: Mouse, color: "text-white", bg: "bg-green-600",
      desc: "Test buttons, scroll, and tracking.",
      component: <InputTest mode="mouse" />
    },
    {
      title: "Touch Screen", icon: Smartphone, color: "text-white", bg: "bg-cyan-600",
      desc: "Find dead zones with multi-touch.",
      component: <TouchTest />
    },
    {
      title: "Display", icon: Monitor, color: "text-white", bg: "bg-yellow-600",
      desc: "Dead pixel and color uniformity check.",
      component: <DisplayTest />
    },
    {
      title: "Network", icon: Wifi, color: "text-white", bg: "bg-indigo-600",
      desc: "Speed test and connection info.",
      component: <NetworkTest />
    },
    {
      title: "Case Logs", icon: FileText, color: "text-white", bg: "bg-slate-600",
      desc: "Document repairs and export PDF.",
      component: <div className="h-[600px] overflow-y-auto"><CaseLogForm /></div>
    },
    {
      title: "Wiring", icon: Workflow, color: "text-white", bg: "bg-red-600",
      desc: "Create custom wiring diagrams.",
      component: <div className="h-[600px] w-full"><WiringBuilder /></div>
    },
    {
      title: "AI Helper", icon: Bot, color: "text-white", bg: "bg-emerald-600",
      desc: "Ask Gemini for repair advice.",
      component: <ChatWrapper />
    },
    {
      title: "System Info", icon: Cpu, color: "text-white", bg: "bg-teal-600",
      desc: "View battery and OS details.",
      component: <SystemTest />
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <div className="container mx-auto py-16 px-4 space-y-12">

        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-500">
            Smart Technician
          </h1>
          <p className="text-xl text-neutral-400 font-medium max-w-2xl mx-auto">
            Professional hardware diagnostics. Simple. Fast. Effective.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((item) => (
            <Dialog key={item.title}>
              <DialogTrigger asChild>
                <Card className="group relative border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${item.bg.replace('/10', '')} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className={`p-3 rounded-xl ${item.bg} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-neutral-100">{item.title}</CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="w-full py-2 px-4 rounded bg-neutral-800 text-center text-sm font-semibold text-neutral-300 group-hover:bg-white group-hover:text-black transition-colors">
                      Start {item.title} Test
                    </div>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-7xl sm:max-w-7xl max-h-[95vh] overflow-y-auto bg-black border-neutral-800 text-white p-0">
                <DialogHeader className="p-6 border-b border-neutral-800 bg-neutral-900/50">
                  <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                    <item.icon className={`h-6 w-6 ${item.color.replace('text-', 'text-')}`} />
                    {item.title} Test
                  </DialogTitle>
                  <DialogDescription className="text-neutral-400">
                    {item.desc}
                  </DialogDescription>
                </DialogHeader>
                <div className="p-6">
                  {item.component}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="text-center text-sm text-neutral-600 pt-24 pb-8">
          <p>© 2026 Smart Technician Suite • Local Secure Environment</p>
        </div>
      </div>
    </div>
  )
}
