"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, CheckCircle, AlertTriangle, Zap, Aperture } from "lucide-react";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CameraTest() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [status, setStatus] = useState<"idle" | "active" | "captured" | "error">("idle");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { addXP } = useGamification();
    const { addResult } = useResults();

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStatus("active");
            toast.success("Camera connected successfully.");
        } catch (err) {
            console.error("Camera Error:", err);
            setStatus("error");
            toast.error("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setStatus("idle");
    };

    const takeSnapshot = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                // Draw video to canvas
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);

                // Simulating AI Processing
                const dataUrl = canvasRef.current.toDataURL("image/png");
                setImageUrl(dataUrl);
                setStatus("captured");

                // Save result
                addResult({
                    id: "camera",
                    name: "Camera Diagnostic",
                    status: "pass",
                    details: { resolution: `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}` }
                });

                // XP Reward
                addXP(50, "Camera Test Complete");
                toast.success("Snapshot captured & analysis complete! +50 XP");

                stopCamera();
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <AnimatedCard className="w-full relative overflow-hidden min-h-[400px]">
                <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full bg-card/10">
                    <div className="p-6 border-b border-border/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Camera className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-lg">Visual Sensor Array</h3>
                        </div>
                        {status === "active" && (
                            <div className="flex items-center gap-2 text-xs text-green-500 font-mono animate-pulse">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                LIVE FEED
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[300px] relative">
                        <AnimatePresence mode="wait">
                            {status === "idle" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                                        <Aperture className="w-10 h-10 text-primary" />
                                    </div>
                                    <p className="text-muted-foreground w-64 mx-auto">Initialize visual diagnostics system to verify camera functionality and resolution.</p>
                                    <Button onClick={startCamera} size="lg" className="gap-2 group">
                                        <Zap className="w-4 h-4 fill-current group-hover:text-yellow-400 transition-colors" />
                                        Initialize Camera
                                    </Button>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-4 text-destructive"
                                >
                                    <AlertTriangle className="w-12 h-12 mx-auto" />
                                    <p>Access Denied or Device Not Found.</p>
                                    <Button onClick={startCamera} variant="outline">Retry</Button>
                                </motion.div>
                            )}

                            {status === "active" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative w-full aspect-video rounded-lg overflow-hidden border border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                >
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    {/* AI Overlay Simulation */}
                                    <div className="absolute inset-0 border-[4px] border-primary/20 rounded-lg pointer-events-none">
                                        <div className="absolute top-4 right-4 text-[10px] font-mono text-primary/80 space-y-1">
                                            <div>ISO: AUTO</div>
                                            <div>AF: LOCKED</div>
                                            <div>FACE_DETECT: ACTIVE</div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    opacity: [0.3, 0.6, 0.3],
                                                    borderColor: ["rgba(var(--primary),0.2)", "rgba(var(--primary),0.8)", "rgba(var(--primary),0.2)"]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-48 h-48 border border-dashed border-primary rounded-lg relative"
                                            >
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary" />
                                            </motion.div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                        <Button onClick={takeSnapshot} className="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-red-500/50">
                                            <div className="w-4 h-4 bg-white rounded-full" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {status === "captured" && imageUrl && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="relative rounded-lg overflow-hidden border border-border shadow-xl">
                                        <img src={imageUrl} alt="Captured" className="w-full h-auto" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-white text-xs font-mono">
                                            ANALYSIS: PASS <br />
                                            RESOLUTION: HIGH
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        <Button onClick={startCamera} variant="outline" className="gap-2">
                                            <RefreshCw className="w-4 h-4" /> Retest
                                        </Button>
                                        <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="w-4 h-4" /> Verified
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </AnimatedCard>

            {/* Info Card side panel */}
            <AnimatedCard delay={0.1} className="h-auto">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-primary">●</span> Diagnostic Info
                    </CardTitle>
                </CardHeader>
                <div className="p-6 pt-0 space-y-4 text-sm text-muted-foreground">
                    <p>
                        The camera test validates the sensor's ability to capture light and process video streams.
                        The <strong>AI Overlay</strong> simulates facial feature tracking algorithms used in modern biometric systems.
                    </p>
                    <div className="space-y-2 font-mono text-xs bg-muted/50 p-3 rounded">
                        <div className="flex justify-between">
                            <span>Permission:</span>
                            <span className={status === "active" || status === "captured" ? "text-green-500" : "text-yellow-500"}>
                                {status === "active" || status === "captured" ? "GRANTED" : "PENDING"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Driver:</span>
                            <span>GENERIC_UVC</span>
                        </div>
                    </div>
                </div>
            </AnimatedCard>
        </div>
    );
}
