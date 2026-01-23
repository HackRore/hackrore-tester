"use client";

import React, { useState, useEffect, useRef } from "react";
import { Speaker, Volume2, Music, CheckCircle, RefreshCw, AlertCircle, Play } from "lucide-react";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { motion } from "framer-motion";

export default function SpeakerTest() {
    const [isPlaying, setIsPlaying] = useState<"none" | "left" | "right" | "both">("none");
    const [verified, setVerified] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
    const audioContextRef = useRef<AudioContext | null>(null);

    const { addXP } = useGamification();
    const { addResult } = useResults();

    const playTone = (channel: "left" | "right" | "both") => {
        if (isPlaying !== "none") return;

        try {
            const Ctx = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new Ctx();
            audioContextRef.current = ctx;

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const panner = ctx.createStereoPanner();

            oscillator.type = "sine";
            oscillator.frequency.value = channel === "left" ? 440 : channel === "right" ? 554.37 : 659.25; // A4, C#5, E5

            // Panning
            if (channel === "left") panner.pan.value = -1;
            else if (channel === "right") panner.pan.value = 1;
            else panner.pan.value = 0;

            oscillator.connect(gainNode);
            gainNode.connect(panner);
            panner.connect(ctx.destination);

            oscillator.start();
            setIsPlaying(channel);

            // Ramp down to avoid clicks
            gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

            oscillator.stop(ctx.currentTime + 1.5);
            setTimeout(() => {
                setIsPlaying("none");
                ctx.close();
            }, 1500);

        } catch (err) {
            console.error("Audio Error:", err);
            toast.error("Audio Playback Error");
        }
    };

    const markVerified = (channel: "left" | "right") => {
        setVerified(prev => ({ ...prev, [channel]: true }));
        toast.success(`${channel.toUpperCase()} Channel Verified`);
    };

    const finishTest = () => {
        if (verified.left && verified.right) {
            addResult({ id: "speaker", name: "Speaker Diagnostic", status: "pass" });
            addXP(50, "Speaker Test Complete");
            toast.success("Audio Output Verified! +50 XP");
        } else {
            toast.error("Please verify both channels first.");
        }
    };

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <AnimatedCard className="min-h-[400px]">
                <div className="p-6 border-b border-border/10 flex items-center gap-2">
                    <Speaker className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Audio Output Diagnostic</h3>
                </div>

                <div className="p-8 flex flex-col items-center justify-center gap-8">
                    <div className="flex gap-8 justify-center items-center">
                        {/* Left Speaker */}
                        <div className="flex flex-col items-center gap-3">
                            <motion.div
                                animate={{ scale: isPlaying === "left" ? [1, 1.1, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-colors ${verified.left ? "border-green-500 bg-green-500/10" : "border-primary/20 bg-card"}`}
                            >
                                <Volume2 className={`w-8 h-8 ${isPlaying === "left" ? "text-primary" : "text-muted-foreground"}`} />
                            </motion.div>
                            <p className="font-mono text-sm">LEFT_CH</p>
                            <div className="flex gap-2">
                                <Button onClick={() => playTone("left")} disabled={isPlaying !== "none"} variant="outline" size="sm">
                                    <Play className="w-3 h-3 mr-1" /> Test
                                </Button>
                                <Button onClick={() => markVerified("left")} disabled={!isPlaying && verified.left} variant={verified.left ? "secondary" : "default"} size="sm">
                                    <CheckCircle className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Center Graphic */}
                        <div className="h-32 w-px bg-border/50 hidden md:block" />

                        {/* Right Speaker */}
                        <div className="flex flex-col items-center gap-3">
                            <motion.div
                                animate={{ scale: isPlaying === "right" ? [1, 1.1, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-colors ${verified.right ? "border-green-500 bg-green-500/10" : "border-primary/20 bg-card"}`}
                            >
                                <Volume2 className={`w-8 h-8 ${isPlaying === "right" ? "text-primary" : "text-muted-foreground"}`} />
                            </motion.div>
                            <p className="font-mono text-sm">RIGHT_CH</p>
                            <div className="flex gap-2">
                                <Button onClick={() => playTone("right")} disabled={isPlaying !== "none"} variant="outline" size="sm">
                                    <Play className="w-3 h-3 mr-1" /> Test
                                </Button>
                                <Button onClick={() => markVerified("right")} disabled={!isPlaying && verified.right} variant={verified.right ? "secondary" : "default"} size="sm">
                                    <CheckCircle className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-sm border-t border-border/20 pt-6 mt-2 flex flex-col gap-4">
                        <Button onClick={() => playTone("both")} disabled={isPlaying !== "none"} variant="ghost" className="w-full">
                            Test Stereo Separation (Both)
                        </Button>

                        {verified.left && verified.right && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Button onClick={finishTest} className="w-full bg-green-600 hover:bg-green-700 font-bold gap-2">
                                    <CheckCircle className="w-4 h-4" /> Sign Off Diagnostics
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
                <CardHeader>
                    <CardTitle className="text-lg">Signal Logic</CardTitle>
                </CardHeader>
                <div className="p-6 pt-0 space-y-4 text-sm text-muted-foreground">
                    <p>This module generates synthesized sine waves to verify speaker integrity and stereo separation.</p>
                    <ul className="space-y-2 list-disc pl-4">
                        <li><span className="font-mono text-xs bg-muted p-1 rounded">LEFT</span> : 440Hz (A4) - Standard tuning pitch.</li>
                        <li><span className="font-mono text-xs bg-muted p-1 rounded">RIGHT</span> : 554.37Hz (C#5) - Major third interval.</li>
                    </ul>
                    <div className="rounded-lg bg-yellow-500/10 text-yellow-500 p-3 text-xs flex gap-2 mt-4 items-start">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>If sound is heard from the wrong side, the audio channels may be reversed or mono-summed by the driver.</p>
                    </div>
                </div>
            </AnimatedCard>
        </div>
    );
}
