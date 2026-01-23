"use client";

import React, { useState } from "react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        toast.success("Message Sent Successfully!");
    };

    if (sent) {
        return (
            <AnimatedCard className="p-12 text-center bg-green-500/5 border-green-500/20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Message Received!</h2>
                    <p className="text-muted-foreground max-w-md">
                        Thanks for reaching out. I usually respond within 24 hours. Check your email for a confirmation.
                    </p>
                    <Button variant="outline" onClick={() => setSent(false)}>Send Another</Button>
                </div>
            </AnimatedCard>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedCard className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <div className="h-full flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
                        <p className="text-muted-foreground mb-8">
                            I'm currently available for freelance repair projects, custom PC builds, and technical consultation.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded bg-background/50 flex items-center justify-center">📧</div>
                                <span>hello@hackrore.dev</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded bg-background/50 flex items-center justify-center">📅</div>
                                <span>Mon - Fri, 9am - 6pm PST</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-background/30 rounded-lg">
                        <div className="text-xs font-mono text-primary mb-2">Simulated Chat Response Time</div>
                        <div className="text-2xl font-bold">~15 Mins</div>
                    </div>
                </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1} className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm font-medium">Send a Message</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Your Name</label>
                        <Input placeholder="John Doe" required className="bg-secondary/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
                        <Input type="email" placeholder="john@example.com" required className="bg-secondary/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Project Details</label>
                        <Textarea placeholder="I have a broken MacBook Pro..." required className="min-h-[150px] bg-secondary/20" />
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2">
                        <Send className="w-4 h-4" /> Send Inquiry
                    </Button>
                </form>
            </AnimatedCard>
        </div>
    );
}
