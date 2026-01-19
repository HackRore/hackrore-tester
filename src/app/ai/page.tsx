"use client"
import { useState } from "react"
import { Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
    role: "user" | "assistant" | "system",
    content: string
}

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your AI Technician Assistant. How can I help you diagnose a device today?" }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMsg: Message = { role: "user", content: input }
        setMessages(prev => [...prev, newMsg])
        setInput("")
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, newMsg] })
            })
            const data = await res.json()
            if (data.content) {
                setMessages(prev => [...prev, data])
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to the brain. Please check your network or API configuration." }])
            }
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-100px)] p-4 max-w-4xl mx-auto">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> AI Diagnostic Assistant</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full p-4">
                        <div className="space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="text-sm text-muted-foreground animate-pulse">Thinking...</div>}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 pt-2 gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Describe the problem..."
                    />
                    <Button onClick={sendMessage} disabled={loading}><Send className="h-4 w-4" /></Button>
                </CardFooter>
            </Card>
        </div>
    )
}
