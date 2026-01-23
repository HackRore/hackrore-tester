"use client";

import React, { useState } from "react";
import { Database, Save, HardDrive, CheckCircle, AlertTriangle } from "lucide-react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { toast } from "sonner";

export default function StorageTest() {
    const { addXP } = useGamification();
    const { addResult } = useResults();

    const [testing, setTesting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState({
        lsWrite: 0,
        lsRead: 0,
        idbWrite: 0,
        idbRead: 0,
        quota: 0
    });

    // Helper: Geneate random string
    const generateData = (sizeInMB: number) => {
        const char = "A";
        return char.repeat(sizeInMB * 1024 * 1024);
    };

    const runStorageTest = async () => {
        setTesting(true);
        setProgress(0);

        try {
            // 1. LocalStorage Test (0.5 MB - small due to limits)
            // Chrome limit is usually 5MB per origin
            setProgress(10);
            const lsData = generateData(0.5);

            // Write LS
            const startLsWrite = performance.now();
            localStorage.setItem("speed_test", lsData);
            const lsWriteTime = performance.now() - startLsWrite;

            // Read LS
            const startLsRead = performance.now();
            localStorage.getItem("speed_test");
            const lsReadTime = performance.now() - startLsRead;

            // Clean LS
            localStorage.removeItem("speed_test");

            // Ops/sec isn't quite right for speed, let's do MB/s
            const lsWriteSpeed = (0.5 / (lsWriteTime / 1000));
            const lsReadSpeed = (0.5 / (lsReadTime / 1000));

            setResults(prev => ({ ...prev, lsWrite: parseFloat(lsWriteSpeed.toFixed(2)), lsRead: parseFloat(lsReadSpeed.toFixed(2)) }));
            setProgress(40);

            // 2. IndexedDB Test (5 MB)
            const idbData = new Blob([generateData(5)]);

            const dbName = "SpeedTestDB";
            const storeName = "data";

            // Open DB
            const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
                const req = indexedDB.open(dbName, 1);
                req.onupgradeneeded = (e: any) => {
                    e.target.result.createObjectStore(storeName);
                };
                req.onsuccess = (e: any) => resolve(e.target.result);
                req.onerror = reject;
            });

            const db = await dbPromise;

            // Write IDB
            setProgress(60);
            const startIdbWrite = performance.now();
            await new Promise<void>((resolve, reject) => {
                const tx = db.transaction(storeName, "readwrite");
                tx.objectStore(storeName).put(idbData, "blob");
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject();
            });
            const idbWriteTime = performance.now() - startIdbWrite;

            // Read IDB
            setProgress(80);
            const startIdbRead = performance.now();
            await new Promise<void>((resolve, reject) => {
                const tx = db.transaction(storeName, "readonly");
                const get = tx.objectStore(storeName).get("blob");
                get.onsuccess = () => resolve();
                get.onerror = () => reject();
            });
            const idbReadTime = performance.now() - startIdbRead;

            // Calculate IDB Speed (MB/s)
            const idbWriteSpeed = (5 / (idbWriteTime / 1000));
            const idbReadSpeed = (5 / (idbReadTime / 1000));

            setResults(prev => ({
                ...prev,
                idbWrite: parseFloat(idbWriteSpeed.toFixed(2)),
                idbRead: parseFloat(idbReadSpeed.toFixed(2))
            }));

            // Estimate Quota
            if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate();
                if (estimate.quota) {
                    setResults(prev => ({ ...prev, quota: Math.round(estimate.quota / (1024 * 1024)) })); // MB
                }
            }

            setProgress(100);
            addXP(50, "Storage Benchmark");
            addResult({
                id: "storage",
                name: "Storage Benchmark",
                status: "pass",
                details: `LS: ${lsWriteSpeed.toFixed(0)}MB/s, IDB: ${idbWriteSpeed.toFixed(0)}MB/s`
            });
            toast.success("Storage Benchmark Complete");

        } catch (err) {
            console.error(err);
            toast.error("Storage Test Failed (Quota exceeded?)");
            addResult({ id: "storage", name: "Storage Benchmark", status: "fail" });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                    title="LocalStorage Speed"
                    value={results.lsWrite ? `${results.lsWrite} MB/s` : "--"}
                    icon={<Save className="text-orange-500" />}
                    description={results.lsRead ? `Read: ${results.lsRead} MB/s` : "Testing Write/Read..."}
                />
                <MetricCard
                    title="IndexedDB Speed"
                    value={results.idbWrite ? `${results.idbWrite} MB/s` : "--"}
                    icon={<Database className="text-blue-500" />}
                    description={results.idbRead ? `Read: ${results.idbRead} MB/s` : "Testing Blob Storage..."}
                />
            </div>

            <AnimatedCard className="p-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <HardDrive className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Storage Performance</h2>
                        <p className="text-muted-foreground max-w-lg">
                            Benchmarks the browser's ability to store data locally. Tests LocalStorage (Synchronous) and IndexedDB (Asynchronous, Large Data).
                        </p>
                    </div>

                    {results.quota > 0 && (
                        <div className="bg-secondary/30 px-4 py-2 rounded-lg text-sm font-mono">
                            Estimated Available Quota: <span className="text-primary font-bold">{results.quota} MB</span>
                        </div>
                    )}

                    <div className="w-full max-w-md space-y-4">
                        {testing && <Progress value={progress} className="h-2" />}
                        <Button onClick={runStorageTest} disabled={testing} size="lg" className="w-full">
                            {testing ? "Running Benchmarks..." : "Run Storage Benchmark"}
                        </Button>
                    </div>
                </div>
            </AnimatedCard>
        </div>
    );
}
