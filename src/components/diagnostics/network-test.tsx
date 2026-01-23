"use client";

import React, { useState, useEffect, useRef } from "react";
import { Wifi, Globe, Activity, ArrowDown, ArrowUp, Trophy, RefreshCw } from "lucide-react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function NetworkTest() {
    const { addXP } = useGamification();
    const { addResult } = useResults();

    const [testing, setTesting] = useState(false);
    const [progress, setProgress] = useState(0);

    const [stats, setStats] = useState({
        ping: 0,
        download: 0,
        jitter: 0,
        ip: "Loading..."
    });

    const [networkInfo, setNetworkInfo] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Load history
    useEffect(() => {
        const saved = localStorage.getItem("net_test_history");
        if (saved) setHistory(JSON.parse(saved));

        // Get basic connection info
        if ((navigator as any).connection) {
            setNetworkInfo((navigator as any).connection);
        }

        // IP (mock or fetch)
        fetch("https://api.ipify.org?format=json")
            .then(res => res.json())
            .then(data => setStats(s => ({ ...s, ip: data.ip })))
            .catch(() => setStats(s => ({ ...s, ip: "Unknown" })));

    }, []);

    const runTest = async () => {
        setTesting(true);
        setProgress(0);
        setStats(prev => ({ ...prev, ping: 0, download: 0, jitter: 0 }));

        try {
            // 1. Ping Test (Simulated by fetching a small resource repeatedly)
            const pings = [];
            for (let i = 0; i < 5; i++) {
                const start = performance.now();
                await fetch("/favicon.ico?t=" + Date.now(), { cache: "no-store" });
                const end = performance.now();
                pings.push(end - start);
                setProgress(10 + i * 5); // up to 35%
            }

            const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
            const minPing = Math.min(...pings);
            const maxPing = Math.max(...pings);
            const jitter = maxPing - minPing;

            setStats(prev => ({ ...prev, ping: Math.round(avgPing), jitter: Math.round(jitter) }));

            // 2. Download Test (Fetch a larger image)
            // Using a 2MB image from reliable source or local public
            // We'll use a reliable CDN image for test
            const startTime = performance.now();
            const testImage = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=2000&q=80"; // Approx 500kb-1MB depending on compression

            const response = await fetch(testImage + "&t=" + Date.now());
            const blob = await response.blob();
            const endTime = performance.now();
            const duration = (endTime - startTime) / 1000; // seconds
            const sizeBits = blob.size * 8;
            const speedMbps = (sizeBits / duration) / 1000000;

            setStats(prev => ({ ...prev, download: parseFloat(speedMbps.toFixed(2)) }));
            setProgress(100);

            // Complete
            const newResult = {
                date: new Date().toISOString(),
                ping: Math.round(avgPing),
                download: parseFloat(speedMbps.toFixed(2)),
                jitter: Math.round(jitter)
            };

            const newHistory = [newResult, ...history].slice(0, 5);
            setHistory(newHistory);
            localStorage.setItem("net_test_history", JSON.stringify(newHistory));

            addXP(50, `Network Scan: ${speedMbps.toFixed(0)} Mbps`);
            addResult({
                id: "network",
                name: "Network Speed Test",
                status: "pass",
                details: `Ping: ${Math.round(avgPing)}ms, Down: ${speedMbps.toFixed(2)}Mbps`
            });
            toast.success("Network Analysis Complete");

        } catch (err) {
            console.error(err);
            toast.error("Network Test Failed - check interface");
            addResult({ id: "network", name: "Network Speed Test", status: "fail" });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Latency"
                    value={stats.ping > 0 ? `${stats.ping} ms` : "--"}
                    icon={<Activity className="text-blue-500" />}
                    description={`Jitter: ${stats.jitter} ms`}
                />
                <MetricCard
                    title="Download"
                    value={stats.download > 0 ? `${stats.download} Mbps` : "--"}
                    icon={<ArrowDown className="text-green-500" />}
                    description={networkInfo ? `${networkInfo.effectiveType} Connection` : "Direct Connection"}
                />
                <MetricCard
                    title="IP Address"
                    value={stats.ip}
                    icon={<Globe className="text-purple-500" />}
                    description="Public Identity"
                />
            </div>

            <AnimatedCard className="p-8">
                <div className="flex flex-col items-center justify-center gap-8">
                    <div className="relative">
                        {/* Animated Rings */}
                        {testing && (
                            <>
                                <motion.div
                                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="absolute inset-0 bg-primary/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    className="absolute inset-0 bg-primary/20 rounded-full"
                                />
                            </>
                        )}

                        <div className="w-40 h-40 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)] relative z-10">
                            <div className="flex flex-col items-center">
                                {testing ? (
                                    <span className="text-3xl font-bold font-mono animate-pulse">{Math.round(progress)}%</span>
                                ) : (
                                    <Wifi className="w-16 h-16 text-primary" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md space-y-2">
                        {testing && <Progress value={progress} className="h-2" />}
                        <Button
                            onClick={runTest}
                            disabled={testing}
                            size="lg"
                            className={`w-full text-lg h-14 rounded-full ${testing ? 'opacity-80' : ''}`}
                        >
                            {testing ? "Analyzing..." : "Start Network Diagnostics"}
                        </Button>
                    </div>
                </div>
            </AnimatedCard>

            {/* Leaderboard / History */}
            {history.length > 0 && (
                <AnimatedCard delay={0.2} className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Trophy className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Recent Benchmarks</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50 text-left text-muted-foreground">
                                    <th className="pb-2 pl-2">Time</th>
                                    <th className="pb-2">Ping</th>
                                    <th className="pb-2">Download</th>
                                    <th className="pb-2">Jitter</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((run, i) => (
                                    <tr key={i} className="border-b border-border/10 last:border-0 hover:bg-secondary/20 transition-colors">
                                        <td className="py-3 pl-2 text-muted-foreground">{new Date(run.date).toLocaleTimeString()}</td>
                                        <td className="py-3 font-mono">{run.ping} ms</td>
                                        <td className="py-3 font-mono text-green-500 font-bold">{run.download} Mbps</td>
                                        <td className="py-3 font-mono text-muted-foreground">{run.jitter} ms</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AnimatedCard>
            )}
        </div>
    );
}
