"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Sparkles } from "lucide-react";

type Message = {
    id: number;
    role: "ai" | "user";
    text: string;
};

export function AiAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "ai", text: "Hello! I'm your Diagnostic AI Assistant. Describe the symptoms or paste an error code, and I'll suggest potential fixes." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg: Message = {
                id: Date.now() + 1,
                role: "ai",
                text: generateResponse(userMsg.text)
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (text: string) => {
        const t = text.toLowerCase();
        if (t.includes("beep") || t.includes("sound")) return "For beep codes, please check the 'Cheat Sheets' tab. Generally, 1 short beep means POST passed, while continuous beeps indicate a power supply or memory failure.";
        if (t.includes("blue") || t.includes("bsod")) return "It sounds like a Blue Screen of Death. Can you provide the Hex code (e.g., 0x0000007B)? Most BSODs are caused by driver conflicts or faulty RAM.";
        if (t.includes("slow") || t.includes("lag")) return "Slow performance is often HDD related. Have you run the 'Storage Test' to check read speeds? I also recommend checking for thermal throttling.";
        if (t.includes("black screen")) return "Black screen with fans spinning usually points to RAM reseating needed or a GPU failure. Try connecting an external monitor to isolate the display panel.";
        return "I've noted that symptom. Based on my database, I recommend running the Full Diagnostic Suite from the Dashboard to rule out hardware failures. Would you like me to guide you there?";
    };

    return (
        <AnimatedCard className="h-[600px] flex flex-col p-0 overflow-hidden border-primary/20 bg-background/50 backdrop-blur">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-secondary/10">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                    <Bot className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                    <h3 className="font-bold">Tech Assistant AI</h3>
                    <div className="flex items-center gap-1.5 text-xs text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'ai' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-primary/10 text-primary'}`}>
                            {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'ai'
                                ? 'bg-secondary/40 border border-white/5 rounded-tl-none'
                                : 'bg-primary text-primary-foreground rounded-tr-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-cyan-500" />
                        </div>
                        <div className="bg-secondary/40 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-secondary/5">
                <form onSubmit={handleSend} className="flex gap-3">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-background border-white/10 focus:border-primary/50"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </AnimatedCard>
    );
}
