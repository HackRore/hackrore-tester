"use client";

import React, { useRef, useState, useEffect } from "react";
import { Mic, Square, Play, RefreshCw, CheckCircle, Volume2, Activity } from "lucide-react";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MicrophoneTest() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const requestRef = useRef<number>();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "recording" | "review" | "success">("idle");

    const { addXP } = useGamification();
    const { addResult } = useResults();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
            microphoneRef.current.connect(analyserRef.current);

            // Visualizer setup
            analyserRef.current.fftSize = 256;
            drawVisualizer();

            // Recorder setup
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setStatus("review");
                // Stop stream tracks
                stream.getTracks().forEach(track => track.stop());
                cancelAnimationFrame(requestRef.current!);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setStatus("recording");
            toast("Recording... Speak into the microphone.");

        } catch (err) {
            console.error("Mic Error:", err);
            toast.error("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        }
    };

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestRef.current = requestAnimationFrame(draw);
            analyserRef.current!.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                const r = barHeight + 25 * (i / bufferLength);
                const g = 250 * (i / bufferLength);
                const b = 50;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };
        draw();
    };

    const togglePlayback = () => {
        if (!audioUrl) return;
        const audio = new Audio(audioUrl);

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            audio.play();
            audio.onended = () => setIsPlaying(false);
        }
    };

    const confirmWorking = () => {
        setStatus("success");
        addResult({
            id: "microphone",
            name: "Microphone Diagnostic",
            status: "pass",
        });
        addXP(50, "Mic Test Passed");
        toast.success("Microphone confirmed working! +50 XP");
    };

    const resetTest = () => {
        setAudioUrl(null);
        setStatus("idle");
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <AnimatedCard className="w-full min-h-[400px]">
                <div className="p-6 border-b border-border/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Mic className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Audio Input Sensor</h3>
                    </div>
                    {status === "recording" && (
                        <div className="flex items-center gap-2 text-xs text-red-500 font-mono animate-pulse">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            RECORDING
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-8">
                    <AnimatePresence mode="wait">
                        {status === "idle" && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                                    <Activity className="w-10 h-10 text-primary" />
                                </div>
                                <p className="text-muted-foreground max-w-xs mx-auto">Click below to start recording. Speak clearly to verify input levels.</p>
                                <Button onClick={startRecording} size="lg" className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20">
                                    <Mic className="w-6 h-6 text-white" />
                                </Button>
                            </motion.div>
                        )}

                        {status === "recording" && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="w-full flex flex-col items-center gap-6"
                            >
                                <canvas
                                    ref={canvasRef}
                                    width={300}
                                    height={150}
                                    className="w-full max-w-sm bg-black/50 rounded-lg border border-primary/30 shadow-inner"
                                />
                                <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2 animate-pulse">
                                    <Square className="w-4 h-4 fill-current" /> Stop Recording
                                </Button>
                            </motion.div>
                        )}

                        {status === "review" && audioUrl && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center space-y-6"
                            >
                                <div className="flex items-center gap-4 justify-center">
                                    <Button onClick={togglePlayback} size="lg" className="rounded-full w-14 h-14 p-0" variant={isPlaying ? "secondary" : "default"}>
                                        {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                                    </Button>
                                    <div className="text-left">
                                        <p className="font-semibold">Playback Check</p>
                                        <p className="text-xs text-muted-foreground">{isPlaying ? "Playing..." : "Click to listen"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-center pt-4">
                                    <Button onClick={resetTest} variant="ghost" className="gap-2">
                                        <RefreshCw className="w-4 h-4" /> Retry
                                    </Button>
                                    <Button onClick={confirmWorking} className="gap-2 bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="w-4 h-4" /> Confirm Working
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-4 text-green-500"
                            >
                                <CheckCircle className="w-16 h-16" />
                                <h4 className="text-xl font-bold">Diagnostic Passed</h4>
                                <div className="flex gap-2">
                                    <Button onClick={resetTest} variant="outline" size="sm">Test Again</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-primary">●</span> Audio Analysis
                    </CardTitle>
                </CardHeader>
                <div className="p-6 pt-0 space-y-4 text-sm text-muted-foreground">
                    <p>This test analyzes the frequency response and input gain of the connected microphone.</p>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <Volume2 className="w-6 h-6 text-primary" />
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Gain Check</p>
                            <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-green-500"
                                    animate={{ width: status === "recording" ? ["20%", "80%", "40%"] : "0%" }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedCard>
        </div>
    );
}
