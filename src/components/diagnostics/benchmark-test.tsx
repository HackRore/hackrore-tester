"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Cpu, Zap, Activity, Play, Gauge } from "lucide-react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { toast } from "sonner";

export default function BenchmarkTest() {
    const { addXP } = useGamification();
    const { addResult } = useResults();

    const [testing, setTesting] = useState(false);
    const [stage, setStage] = useState<"idle" | "cpu" | "gpu" | "complete">("idle");
    const [progress, setProgress] = useState(0);

    const [results, setResults] = useState({
        cpuScore: 0,
        gpuScore: 0,
        totalScore: 0,
        fps: 0
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    // --- CPU Test: Matrix Multiplication & Primes ---
    const runCpuTest = async () => {
        setStage("cpu");
        setProgress(0);

        return new Promise<number>((resolve) => {
            let score = 0;
            let percent = 0;

            const interval = setInterval(() => {
                const start = performance.now();
                // Heavy math load
                for (let i = 0; i < 200000; i++) {
                    Math.sqrt(i) * Math.sin(i);
                }
                const end = performance.now();
                const duration = end - start;

                // Lower duration = Higher Score
                score += (1000 / (duration + 1));

                percent += 5;
                setProgress(percent);

                if (percent >= 100) {
                    clearInterval(interval);
                    resolve(Math.floor(score));
                }
            }, 100);
        });
    };

    // --- GPU Test: Canvas Particle Storm ---
    const runGpuTest = async () => {
        setStage("gpu");
        setProgress(0);

        const canvas = canvasRef.current;
        if (!canvas) return 0;

        const ctx = canvas.getContext('2d');
        if (!ctx) return 0;

        // Resize
        canvas.width = canvas.parentElement?.clientWidth || 300;
        canvas.height = 300;

        const particles: { x: number; y: number; vx: number; vy: number; color: string }[] = [];
        const particleCount = 2000; // Stressful count
        const colors = ['#22c55e', '#3b82f6', '#a855f7', '#ef4444'];

        // Init particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        return new Promise<number>((resolve) => {
            let frameCount = 0;
            let startTime = performance.now();
            let score = 0;

            const animate = () => {
                if (!ctx) return;

                // Clear with trail effect
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Bounce
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                });

                frameCount++;
                const now = performance.now();
                const elapsed = now - startTime;

                // Update FPS display live
                const currentFps = Math.round((frameCount / elapsed) * 1000);
                setResults(prev => ({ ...prev, fps: currentFps }));

                if (elapsed < 5000) { // Run for 5 seconds
                    setProgress((elapsed / 5000) * 100);
                    requestRef.current = requestAnimationFrame(animate);
                } else {
                    // Calculate final GPU score based on average FPS
                    const avgFps = (frameCount / 5); // frames / 5 seconds = fps
                    score = Math.floor(avgFps * 100); // 60fps = 6000 score
                    if (requestRef.current) cancelAnimationFrame(requestRef.current);
                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    resolve(score);
                }
            };

            requestRef.current = requestAnimationFrame(animate);
        });
    };

    const startBenchmark = async () => {
        setTesting(true);
        setResults({ cpuScore: 0, gpuScore: 0, totalScore: 0, fps: 0 }); // Reset

        try {
            const cpuPoints = await runCpuTest();
            setResults(prev => ({ ...prev, cpuScore: cpuPoints }));

            const gpuPoints = await runGpuTest();
            setResults(prev => ({ ...prev, gpuScore: gpuPoints }));

            const total = cpuPoints + gpuPoints;
            setResults(prev => ({ ...prev, totalScore: total }));
            setStage("complete");

            let xpReward = 100;
            if (total > 10000) xpReward = 500;
            else if (total > 5000) xpReward = 250;

            addXP(xpReward, `Benchmark: ${total} pts`);
            addResult({
                id: "benchmark",
                name: "System Performance Benchmark",
                status: "pass",
                details: `Score: ${total} (CPU: ${cpuPoints}, GPU: ${gpuPoints})`
            });
            toast.success(`Benchmark Complete! Score: ${total}`);

        } catch (err) {
            console.error(err);
            toast.error("Benchmark failed.");
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <AnimatedCard className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-md">
                        <div className="flex items-center gap-3 text-primary">
                            <Gauge className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">System Stress Test</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Evaluates computational power (CPU) and graphical rendering (GPU) capabilities through intense logical puzzles and particle simulations.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 text-center">
                                <div className="text-xs text-muted-foreground uppercase mb-1">CPU Score</div>
                                <div className="text-xl font-mono font-bold text-blue-500">
                                    {results.cpuScore || "--"}
                                </div>
                            </div>
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 text-center">
                                <div className="text-xs text-muted-foreground uppercase mb-1">GPU Score</div>
                                <div className="text-xl font-mono font-bold text-purple-500">
                                    {results.gpuScore || "--"}
                                </div>
                            </div>
                        </div>

                        {!testing && stage !== "complete" && (
                            <Button onClick={startBenchmark} size="lg" className="w-full mt-4 text-lg h-12 gap-2">
                                <Play className="w-5 h-5" /> Start Benchmark
                            </Button>
                        )}

                        {testing && (
                            <div className="space-y-2 mt-4">
                                <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground">
                                    <span>Status: {stage === 'cpu' ? 'Computing Primes...' : 'Rendering Particles...'}</span>
                                    {stage === 'gpu' && <span className="text-primary">{results.fps} FPS</span>}
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}
                    </div>

                    {/* Visualizer Area */}
                    <div className="w-full md:w-[400px] h-[300px] bg-black rounded-lg border border-border overflow-hidden relative shadow-2xl">
                        {stage === 'idle' && (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                <Activity className="w-24 h-24" />
                            </div>
                        )}

                        {stage === 'cpu' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/10">
                                <Cpu className="w-32 h-32 text-blue-500 animate-pulse" />
                                <div className="absolute font-mono text-blue-400 text-xs opacity-50 w-full h-full p-4 overflow-hidden break-all">
                                    {Array.from({ length: 200 }).map((_, i) => (
                                        <span key={i}>{Math.random() > 0.5 ? '1' : '0'}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <canvas
                            ref={canvasRef}
                            className={`w-full h-full block ${stage !== 'gpu' ? 'hidden' : ''}`}
                        />

                        {stage === 'complete' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                                <Trophy className="w-20 h-20 text-yellow-400 mb-4 animate-bounce" />
                                <h3 className="text-3xl font-bold text-white mb-2">{results.totalScore}</h3>
                                <p className="text-white/60">Total Score</p>
                                <Button variant="outline" size="sm" onClick={() => setStage("idle")} className="mt-6">
                                    <RefreshCw className="mr-2 w-4 h-4" /> Reset
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </AnimatedCard>
        </div>
    );
}
