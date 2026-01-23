"use client";

import React, { useState, useEffect } from "react";
import { Battery, BatteryCharging, Navigation, Compass, Monitor, Cpu } from "lucide-react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { toast } from "sonner";

export default function SensorInfo() {
    const { addXP } = useGamification();
    const { addResult } = useResults();

    const [battery, setBattery] = useState<any>(null);
    const [location, setLocation] = useState<GeolocationPosition | null>(null);
    const [locError, setLocError] = useState<string | null>(null);
    const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0, depth: 0 });

    useEffect(() => {
        // Battery
        if ((navigator as any).getBattery) {
            (navigator as any).getBattery().then((batt: any) => {
                setBattery({
                    level: batt.level,
                    charging: batt.charging,
                    chargingTime: batt.chargingTime,
                    dischargingTime: batt.dischargingTime
                });

                batt.addEventListener('levelchange', () => setBattery((prev: any) => ({ ...prev, level: batt.level })));
                batt.addEventListener('chargingchange', () => setBattery((prev: any) => ({ ...prev, charging: batt.charging })));
            });
        }

        // Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation(pos);
                    addXP(20, "Geolocation Access");
                    addResult({ id: "sensor-gps", name: "Geolocation", status: "pass", details: `Lat: ${pos.coords.latitude.toFixed(2)}, Lng: ${pos.coords.longitude.toFixed(2)}` });
                },
                (err) => {
                    setLocError(err.message);
                    addResult({ id: "sensor-gps", name: "Geolocation", status: "fail", details: err.message });
                }
            );
        } else {
            setLocError("Geolocation not supported.");
        }

        // Device Orientation
        const handleOrientation = (event: DeviceOrientationEvent) => {
            setOrientation({
                alpha: event.alpha || 0,
                beta: event.beta || 0,
                gamma: event.gamma || 0
            });
        };
        window.addEventListener("deviceorientation", handleOrientation);

        // Screen
        setScreenInfo({
            width: window.screen.width,
            height: window.screen.height,
            depth: window.screen.colorDepth
        });

        // Complete basic sensor sweep xp
        addXP(10, "Sensor Sweep");

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, [addXP, addResult]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Battery Card */}
            <AnimatedCard>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-500">
                        {battery?.charging ? <BatteryCharging className="w-6 h-6" /> : <Battery className="w-6 h-6" />}
                        <h3 className="font-bold text-lg">Power Status</h3>
                    </div>
                    {battery ? (
                        <div className="space-y-2">
                            <div className="text-4xl font-mono font-bold">{(battery.level * 100).toFixed(0)}%</div>
                            <div className="text-sm text-muted-foreground">
                                {battery.charging ? "Charging" : "Discharging"}
                                {battery.chargingTime !== Infinity && battery.chargingTime > 0 && ` • Full in ${(battery.chargingTime / 60).toFixed(0)} min`}
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${battery.level * 100}%` }} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-muted-foreground">Battery API not supported or unavailable.</div>
                    )}
                </div>
            </AnimatedCard>

            {/* Location Card */}
            <AnimatedCard delay={0.1}>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-blue-500">
                        <Navigation className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Geolocation</h3>
                    </div>
                    {location ? (
                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase">Latitude</div>
                                    <div className="font-mono text-xl">{location.coords.latitude.toFixed(4)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase">Longitude</div>
                                    <div className="font-mono text-xl">{location.coords.longitude.toFixed(4)}</div>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground pt-2">Accuracy: ±{location.coords.accuracy.toFixed(0)} meters</div>
                        </div>
                    ) : (
                        <div className="text-muted-foreground">{locError || "Requesting location..."}</div>
                    )}
                </div>
            </AnimatedCard>

            {/* Device Orientation Card */}
            <AnimatedCard delay={0.2}>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-purple-500">
                        <Compass className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Gyroscope / Orientation</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-secondary/20 p-2 rounded">
                            <div className="text-xs text-muted-foreground">Alpha (Z)</div>
                            <div className="font-mono font-bold">{orientation.alpha.toFixed(0)}°</div>
                        </div>
                        <div className="bg-secondary/20 p-2 rounded">
                            <div className="text-xs text-muted-foreground">Beta (X)</div>
                            <div className="font-mono font-bold">{orientation.beta.toFixed(0)}°</div>
                        </div>
                        <div className="bg-secondary/20 p-2 rounded">
                            <div className="text-xs text-muted-foreground">Gamma (Y)</div>
                            <div className="font-mono font-bold">{orientation.gamma.toFixed(0)}°</div>
                        </div>
                    </div>
                </div>
            </AnimatedCard>

            {/* System Info Card */}
            <AnimatedCard delay={0.3}>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-orange-500">
                        <Monitor className="w-6 h-6" />
                        <h3 className="font-bold text-lg">System Display & Core</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-muted-foreground uppercase">Resolution</div>
                            <div className="font-mono">{screenInfo.width} x {screenInfo.height}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase">Color Depth</div>
                            <div className="font-mono">{screenInfo.depth}-bit</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase">CPU Cores</div>
                            <div className="font-mono">{navigator.hardwareConcurrency || "?"} Threads</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase">Platform</div>
                            <div className="font-mono text-xs truncate max-w-[150px]" title={navigator.userAgent}>
                                {navigator.platform}
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedCard>
        </div>
    );
}
