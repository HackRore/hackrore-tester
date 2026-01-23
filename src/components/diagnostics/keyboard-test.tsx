"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Keyboard, RefreshCw, Key, Zap, CheckCircle } from "lucide-react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Helper to map keys to layout (Simplified ANSI)
const KEYBOARD_LAYOUT = [
    ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
    ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
    ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
    ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
    ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight", "ContextMenu", "ControlRight"]
];

// Map codes to display labels
const KEY_LABELS: Record<string, string> = {
    "Backquote": "`", "Minus": "-", "Equal": "=", "BracketLeft": "[", "BracketRight": "]", "Backslash": "\\",
    "Semicolon": ";", "Quote": "'", "Comma": ",", "Period": ".", "Slash": "/", "ControlLeft": "Ctrl", "ControlRight": "Ctrl",
    "ShiftLeft": "Shift", "ShiftRight": "Shift", "Enter": "Enter", "Backspace": "Back", "Tab": "Tab", "CapsLock": "Caps",
    "AltLeft": "Alt", "AltRight": "Alt", "MetaLeft": "Win", "MetaRight": "Win", "Escape": "Esc", "Space": " ",
    "ArrowUp": "↑", "ArrowDown": "↓", "ArrowLeft": "←", "ArrowRight": "→"
};

export default function KeyboardTest() {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [keyHistory, setKeyHistory] = useState<Record<string, number>>({});
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
    const [testComplete, setTestComplete] = useState(false);

    const { addXP } = useGamification();
    const { addResult } = useResults();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        e.preventDefault();
        const code = e.code;

        setActiveKeys(prev => new Set(prev).add(code));
        setPressedKeys(prev => {
            const next = new Set(prev);
            next.add(code);
            // Check completion logic (e.g., specific number of unique keys or critical keys)
            if (next.size > 50 && !testComplete) {
                setTestComplete(true);
                addXP(100, "Keyboard Maven: 50+ Keys Verified");
                addResult({ id: "keyboard", name: "Keyboard Diagnostic", status: "pass", details: { keys_verified: next.size } });
                toast.success("Keyboard Test Passed! 50+ Keys Verified.");
            }
            return next;
        });

        setKeyHistory(prev => ({
            ...prev,
            [code]: (prev[code] || 0) + 1
        }));

        // Play click sound (Mechanical)
        // const audio = new Audio("/sounds/switch-blue.mp3"); // If assets existed
        // For now, minimal feedback via UI is enough.
    }, [addXP, addResult, testComplete]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        e.preventDefault();
        setActiveKeys(prev => {
            const next = new Set(prev);
            next.delete(e.code);
            return next;
        });
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    const resetTest = () => {
        setPressedKeys(new Set());
        setKeyHistory({});
        setActiveKeys(new Set());
        setTestComplete(false);
    };

    const getKeyColor = (code: string) => {
        if (activeKeys.has(code)) return "bg-primary text-primary-foreground transform scale-95 shadow-[0_0_15px_rgba(var(--primary),0.6)]";
        if (pressedKeys.has(code)) {
            const count = keyHistory[code] || 0;
            if (count > 10) return "bg-red-500/80 text-white"; // Hot!
            if (count > 5) return "bg-yellow-500/80 text-white"; // Warm
            return "bg-green-500/80 text-white"; // Tested
        }
        return "bg-card hover:bg-muted";
    };

    return (
        <div className="p-4 flex flex-col gap-6">
            <AnimatedCard className="w-full">
                <div className="p-6 border-b border-border/10 flex justify-between items-center bg-card/50">
                    <div className="flex items-center gap-2">
                        <Keyboard className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Input Matrix Diagnostic</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {activeKeys.size} Key(s) Active (N-Key Rollover)
                        </div>
                        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {pressedKeys.size} Unique Keys Tested
                        </div>
                        <Button onClick={resetTest} variant="ghost" size="sm">
                            <RefreshCw className="w-4 h-4 mr-1" /> Reset
                        </Button>
                    </div>
                </div>

                <div className="p-8 flex justify-center overflow-x-auto">
                    <div className="flex flex-col gap-1.5 p-4 bg-muted/20 rounded-xl border border-white/5 shadow-inner min-w-[900px]">
                        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1.5 justify-center">
                                {row.map((code) => {
                                    const label = KEY_LABELS[code] || code.replace("Key", "").replace("Digit", "");
                                    const isWide = ["Backspace", "Tab", "CapsLock", "Enter", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "MetaLeft", "MetaRight", "AltLeft", "AltRight", "Space"].includes(code);
                                    const widthClass =
                                        code === "Space" ? "w-64" :
                                            code === "ShiftLeft" || code === "ShiftRight" ? "w-24" :
                                                code === "Enter" || code === "CapsLock" || code === "Backspace" || code === "Tab" ? "w-20" :
                                                    code === "ControlLeft" || code === "ControlRight" ? "w-16" : "w-12";

                                    return (
                                        <motion.div
                                            key={code}
                                            className={`h-12 ${widthClass} rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-75 border border-white/5 cursor-pointer select-none shadow-sm ${getKeyColor(code)}`}
                                        >
                                            {label}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Navigation Cluster (Simplified placement) */}
                        <div className="flex gap-1.5 justify-center mt-2">
                            <div className={`h-12 w-12 rounded-md flex items-center justify-center border border-white/5 ${getKeyColor("ArrowUp")}`}>↑</div>
                        </div>
                        <div className="flex gap-1.5 justify-center">
                            <div className={`h-12 w-12 rounded-md flex items-center justify-center border border-white/5 ${getKeyColor("ArrowLeft")}`}>←</div>
                            <div className={`h-12 w-12 rounded-md flex items-center justify-center border border-white/5 ${getKeyColor("ArrowDown")}`}>↓</div>
                            <div className={`h-12 w-12 rounded-md flex items-center justify-center border border-white/5 ${getKeyColor("ArrowRight")}`}>→</div>
                        </div>
                    </div>
                </div>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatedCard delay={0.1}>
                    <CardHeader>
                        <CardTitle className="text-base">Heatmap Analysis</CardTitle>
                    </CardHeader>
                    <div className="p-6 pt-0 flex gap-4 text-xs font-mono">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded" /> 1-5 Presses</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded" /> 5-10 Presses</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded" /> 10+ Presses</div>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.2}>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Typing Stats
                        </CardTitle>
                    </CardHeader>
                    <div className="p-6 pt-0 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Keystrokes</span>
                            <span className="font-mono">{Object.values(keyHistory).reduce((a, b) => a + b, 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Most Pressed</span>
                            <span className="font-mono">
                                {Object.entries(keyHistory).sort(([, a], [, b]) => b - a)[0]?.[0] || "-"}
                            </span>
                        </div>
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
}
