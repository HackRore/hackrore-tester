"use client";

import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Zap, AlertCircle } from "lucide-react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ControllerTest() {
    const { addXP } = useGamification();
    const { addResult } = useResults();

    const [gamepads, setGamepads] = useState<(Gamepad | null)[]>([]);
    const [activePadIndex, setActivePadIndex] = useState<number | null>(null);
    const requestRef = useRef<number>();

    useEffect(() => {
        const handleConnect = (e: GamepadEvent) => {
            toast.success(`Gamepad Connected: ${e.gamepad.id}`);
            updateGamepads();
            if (activePadIndex === null) {
                setActivePadIndex(e.gamepad.index);
            }
        };

        const handleDisconnect = (e: GamepadEvent) => {
            toast.error(`Gamepad Disconnected: ${e.gamepad.id}`);
            updateGamepads();
            if (activePadIndex === e.gamepad.index) {
                setActivePadIndex(null);
            }
        };

        window.addEventListener("gamepadconnected", handleConnect);
        window.addEventListener("gamepaddisconnected", handleDisconnect);

        // Polling is required for Gamepad API
        const scanGamepads = () => {
            updateGamepads();
            requestRef.current = requestAnimationFrame(scanGamepads);
        };
        requestRef.current = requestAnimationFrame(scanGamepads);

        return () => {
            window.removeEventListener("gamepadconnected", handleConnect);
            window.removeEventListener("gamepaddisconnected", handleDisconnect);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [activePadIndex]);

    const updateGamepads = () => {
        // connecting navigator.getGamepads() returns an object not a true array sometimes
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        setGamepads(Array.from(pads));

        // Auto-select first available if we lost selection
        if (activePadIndex === null && pads[0]) {
            setActivePadIndex(0);
        }
    };

    const vibrateController = () => {
        const pad = activePadIndex !== null ? gamepads[activePadIndex] : null;
        if (!pad) return;

        if (pad.vibrationActuator) {
            pad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 1000,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            }).then(() => {
                toast.success("Vibration Test Sent");
                addXP(20, "Haptic Feedback Test");
                addResult({ id: "controller", name: "Controller Vibration", status: "pass" });
            }).catch(err => {
                console.error(err);
                toast.error("Vibration failed (Not supported?)");
            });
        } else {
            toast.error("Vibration not supported on this device/browser.");
        }
    };

    const getActivePad = () => {
        if (activePadIndex === null) return null;
        // return freshly polled state
        return (navigator.getGamepads ? navigator.getGamepads() : [])[activePadIndex];
    };

    const activePad = getActivePad();

    return (
        <div className="flex flex-col gap-6">
            <AnimatedCard className="p-8 min-h-[400px]">
                <div className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Gamepad2 className="w-10 h-10 text-primary" />
                    </div>

                    <h2 className="text-2xl font-bold">Controller Input Mapper</h2>

                    {activePad ? (
                        <div className="w-full max-w-2xl space-y-8">
                            <div className="flex items-center justify-between border pl-4 pr-2 py-2 rounded-lg bg-secondary/20">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-sm truncate max-w-[200px] md:max-w-md">{activePad.id}</h3>
                                    <p className="text-xs text-muted-foreground">{activePad.buttons.length} Buttons • {activePad.axes.length} Axes</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={vibrateController}>
                                    <Zap className="w-4 h-4 mr-2" /> Vibrate
                                </Button>
                            </div>

                            {/* Visualizer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Axes */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-center">Analogue Sticks</h4>
                                    <div className="grid grid-cols-2 gap-8 justify-items-center">
                                        {/* Left Stick (Usually axes 0, 1) */}
                                        <div className="w-24 h-24 rounded-full border border-primary/30 relative bg-black/20">
                                            <div
                                                className="absolute w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] transition-none"
                                                style={{
                                                    left: `${(activePad.axes[0] * 50 + 50)}%`,
                                                    top: `${(activePad.axes[1] * 50 + 50)}%`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            />
                                            <span className="absolute -bottom-6 text-xs text-muted-foreground w-full text-center">Axes 0/1</span>
                                        </div>
                                        {/* Right Stick (Usually axes 2, 3) */}
                                        <div className="w-24 h-24 rounded-full border border-primary/30 relative bg-black/20">
                                            <div
                                                className="absolute w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] transition-none"
                                                style={{
                                                    left: `${(activePad.axes[2] * 50 + 50)}%`,
                                                    top: `${(activePad.axes[3] * 50 + 50)}%`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            />
                                            <span className="absolute -bottom-6 text-xs text-muted-foreground w-full text-center">Axes 2/3</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-center">Buttons</h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        {activePad.buttons.map((btn, i) => (
                                            <div key={i} className={`
                                            flex items-center justify-center p-2 rounded border text-xs font-mono transition-all duration-100
                                            ${btn.pressed ? 'bg-primary text-primary-foreground border-primary scale-95' : 'bg-secondary/10 border-border text-muted-foreground'}
                                          `}>
                                                <span>B{i}</span>
                                                {/* Show value for analogue triggers */}
                                                {typeof btn.value === 'number' && btn.value > 0 && btn.value < 1 && (
                                                    <div className="absolute bottom-0 left-0 h-1 bg-white/50" style={{ width: `${btn.value * 100}%` }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground animate-pulse">
                            <Gamepad2 className="w-16 h-16 opacity-20" />
                            <p>waiting for controller connection...</p>
                            <p className="text-xs max-w-xs text-center">Press any button on your controller to wake it up.</p>
                        </div>
                    )}
                </div>
            </AnimatedCard>
        </div>
    );
}
