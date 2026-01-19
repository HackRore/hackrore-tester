"use client"

import {
  Camera, Mic, Volume2, Keyboard, Mouse, Smartphone, Monitor, Wifi,
  FileText, Workflow, Bot, Info, Globe, Shield, Terminal
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const sections = [
    {
      title: "Device Tests",
      description: "Check your peripherals and hardware.",
      items: [
        { title: "Camera", icon: Camera, href: "/test/camera", desc: "Webcam functionality" },
        { title: "Microphone", icon: Mic, href: "/test/mic", desc: "Audio input check" },
        { title: "Speakers", icon: Volume2, href: "/test/camera", desc: "Sound output check" }, // Reusing component
        { title: "Keyboard", icon: Keyboard, href: "/test/keyboard", desc: "Key press tracker" },
        { title: "Mouse", icon: Mouse, href: "/test/keyboard", desc: "Pointer check" },
        { title: "Touch Screen", icon: Smartphone, href: "/test/touch", desc: "Digitizer dead zones" },
        { title: "Display", icon: Monitor, href: "/test/display", desc: "Dead pixel check" },
        { title: "Network", icon: Wifi, href: "/test/network", desc: "Speed simulation" },
      ]
    },
    {
      title: "Technician & Workflow",
      description: "Tools for repair documentation and assistance.",
      items: [
        { title: "Case Logs", icon: FileText, href: "/workflow", desc: "Generate PDF reports" },
        { title: "Wiring Diag.", icon: Workflow, href: "/workflow", desc: "Builder tool" },
        { title: "AI Assistant", icon: Bot, href: "/ai", desc: "Troubleshooting bot" },
        { title: "Cheat Sheets", icon: Info, href: "/workflow", desc: "Reference data" },
      ]
    },
    {
      title: "System Tools",
      description: "Browser and connectivity information.",
      items: [
        { title: "Public IP", icon: Globe, href: "/tools", desc: "Geolocation info" },
        { title: "System Info", icon: Terminal, href: "/test/system", desc: "Battery & OS" },
        { title: "Browser", icon: Shield, href: "/tools", desc: "Security & Caps" },
      ]
    }
  ]

  return (
    <div className="container mx-auto py-12 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Device Testing Suite</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional diagnostics, workflow tools, and AI assistance for modern technicians.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
            <p className="text-muted-foreground">{section.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.items.map((item) => (
              <Card key={item.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border-muted-foreground/10">
                <Link href={item.href} className="absolute inset-0 z-10">
                  <span className="sr-only">Open {item.title}</span>
                </Link>
                <CardHeader className="text-center pt-8 pb-2">
                  <div className="mx-auto bg-primary/5 p-4 rounded-full mb-4 group-hover:bg-primary/10 transition-colors">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <CardDescription className="mb-6">{item.desc}</CardDescription>
                  <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Start Test
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
