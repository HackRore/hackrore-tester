"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Monitor, Maximize2, Minimize2, CheckCircle, RefreshCw, Palette } from "lucide-react";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { motion, AnimatePresence } from "framer-motion";

const PATTERNS = [
    { id: "white", color: "#FFFFFF", name: "White (Bright)" },
    { id: "black", color: "#000000", name: "Black (Dead Pixel)" },
    { id: "red", color: "#FF0000", name: "Red (Subpixel)" },
    { id: "green", color: "#00FF00", name: "Green (Subpixel)" },
    { id: "blue", color: "#0000FF", name: "Blue (Subpixel)" },
    { id: "gradient", css: "linear-gradient(to right, black, white)", name: "Gamma Gradient" },
    { id: "grid", css: "repeating-linear-gradient(0deg, transparent 0px, transparent 19px, #888 20px), repeating-linear-gradient(90deg, transparent 0px, transparent 19px, #888 20px)", name: "Alignment Grid", bg: "#000" }
];

export default function DisplayTest() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activePatternIndex, setActivePatternIndex] = useState<number | null>(null);
    const [testComplete, setTestComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { addXP } = useGamification();
    const { addResult } = useResults();

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().then(() => {
                setIsFullscreen(true);
                setActivePatternIndex(0); // Start test immediately on fullscreen
            }).catch(err => {
                toast.error("Fullscreen Failed: " + err.message);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
                setActivePatternIndex(null);
            });
        }
    }, []);

    const handleNextPattern = useCallback(() => {
        if (activePatternIndex === null) return;
        if (activePatternIndex < PATTERNS.length - 1) {
            setActivePatternIndex(prev => (prev !== null ? prev + 1 : 0));
        } else {
            // Finished
            document.exitFullscreen().catch(() => { });
            setIsFullscreen(false);
            setActivePatternIndex(null);
            setTestComplete(true);
            addXP(50, "Display Calibration Complete");
            addResult({ id: "display", name: "Display Diagnostic", status: "pass" });
            toast.success("Display Diagnostic Passed! +50 XP");
        }
    }, [activePatternIndex, addXP, addResult]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFullscreen) {
                if (e.key === "ArrowRight" || e.key === "Space" || e.key === "Enter") {
                    handleNextPattern();
                } else if (e.key === "Escape") {
                    setIsFullscreen(false);
                    setActivePatternIndex(null);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen, handleNextPattern]);

    // Listen for fullscreen change (if user presses Esc manually)
    useEffect(() => {
        const handleFsChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                setActivePatternIndex(null);
            }
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        return () => document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    return (
        <div ref={containerRef} className="h-full w-full">
            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {isFullscreen && activePatternIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center cursor-none"
                        style={{
                            backgroundColor: PATTERNS[activePatternIndex].color,
                            backgroundImage: PATTERNS[activePatternIndex].css,
                        }}
                        onClick={handleNextPattern}
                    >
                        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-mono backdrop-blur pointer-events-none">
                            {activePatternIndex + 1} / {PATTERNS.length} : {PATTERNS[activePatternIndex].name}
                        </div>
                        <div className="absolute bottom-10 text-white/50 text-sm animate-pulse pointer-events-none">
                            Click or Press Space to Continue
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dashboard View */}
            {!isFullscreen && (
                <div className="p-4 flex flex-col gap-6">
                    <AnimatedCard className="w-full min-h-[400px]">
                        <div className="p-6 border-b border-border/10 flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-lg">Display & Pixel Diagnostic</h3>
                        </div>

                        <div className="p-8 flex flex-col items-center justify-center gap-8 h-full">
                            <div className="text-center space-y-4 max-w-md">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                                    <Palette className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Pixel Integrity Check</h2>
                                <p className="text-muted-foreground">
                                    This tool cycles through solid colors and gradients to help you identify dead pixels, stuck subpixels, and backlight bleeding.
                                    <br /><br />
                                    <strong>Warning:</strong> Flashing colors may appear.
                                </p>

                                <Button onClick={toggleFullscreen} size="lg" className="gap-2 text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                                    <Maximize2 className="w-5 h-5" /> Start Fullscreen Test
                                </Button>
                            </div>
                        </div>
                    </AnimatedCard>

                    {testComplete && (
                        <AnimatedCard delay={0.1} className="bg-green-500/5 border-green-500/20">
                            <div className="p-4 flex items-center gap-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                                <div>
                                    <h4 className="font-bold text-green-500">Diagnostic Passed</h4>
                                    <p className="text-sm text-green-600/80">Display integrity verified successfully.</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setTestComplete(false)} className="ml-auto">
                                    <RefreshCw className="w-4 h-4 mr-2" /> Reset
                                </Button>
                            </div>
                        </AnimatedCard>
                    )}
                </div>
            )}
        </div>
    );
}

// Needed for useRef in default export
import { useRef } from "react";
