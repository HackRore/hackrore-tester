"use client";

import React, { useState, useEffect } from "react";
import { Battery, Wifi, Cpu, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function SystemStatusWidget() {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);
    const [networkType, setNetworkType] = useState<string>("Unknown");
    const [online, setOnline] = useState(true);

    useEffect(() => {
        // Battery API
        if ('getBattery' in navigator) {
            // @ts-ignore
            navigator.getBattery().then((battery: any) => {
                const updateBattery = () => {
                    setBatteryLevel(Math.floor(battery.level * 100));
                    setIsCharging(battery.charging);
                };
                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
                battery.addEventListener('chargingchange', updateBattery);
            });
        }

        // Network Status
        const updateNetwork = () => {
            setOnline(navigator.onLine);
            // @ts-ignore
            if (navigator.connection) {
                // @ts-ignore
                setNetworkType(navigator.connection.effectiveType || "4g");
            }
        };
        window.addEventListener('online', updateNetwork);
        window.addEventListener('offline', updateNetwork);
        updateNetwork();

        return () => {
            window.removeEventListener('online', updateNetwork);
            window.removeEventListener('offline', updateNetwork);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-4 py-2 bg-background/50 backdrop-blur-sm border border-border rounded-full shadow-sm text-xs font-mono text-muted-foreground"
        >
            {/* Battery */}
            <div className={`flex items-center gap-2 ${batteryLevel && batteryLevel < 20 && !isCharging ? "text-red-500 animate-pulse" : ""}`}>
                <Battery className={`w-3.5 h-3.5 ${isCharging ? "text-green-500" : ""}`} />
                <span>{batteryLevel !== null ? `${batteryLevel}%` : "--"}</span>
            </div>

            <div className="h-3 w-px bg-border" />

            {/* Network */}
            <div className="flex items-center gap-2">
                <Wifi className={`w-3.5 h-3.5 ${!online ? "text-red-500" : "text-blue-500"}`} />
                <span className="uppercase">{online ? networkType : "OFFLINE"}</span>
            </div>

            <div className="h-3 w-px bg-border" />

            {/* Simulated CPU Load (Just visual flavor) */}
            <div className="flex items-center gap-2 hidden sm:flex">
                <Cpu className="w-3.5 h-3.5" />
                <span>Sys: Normal</span>
            </div>
        </motion.div>
    );
}
