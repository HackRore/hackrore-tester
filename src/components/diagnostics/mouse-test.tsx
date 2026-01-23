"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MousePointer2, Move, Target, Smartphone, RefreshCw, CheckCircle, Trophy } from "lucide-react";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamification } from "@/context/GamificationContext";
import { useResults } from "@/context/ResultsContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MouseTest() {
    const { addXP } = useGamification();
    const { addResult } = useResults();

    // --- Button & Scroll State ---
    const [buttons, setButtons] = useState({
        left: false,
        middle: false,
        right: false,
        double: false,
        scrollUp: false,
        scrollDown: false,
    });

    // --- Polling Rate State ---
    const [pollingRate, setPollingRate] = useState(0);
    const lastMouseTime = useRef(performance.now());
    const mouseEvents = useRef<number[]>([]);

    // --- Canvas / Drawing State ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // --- Accuracy Game State ---
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

    // --- Event Listeners for Buttons/Scroll/Polling ---
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            setButtons(prev => ({
                ...prev,
                left: prev.left || e.button === 0,
                middle: prev.middle || e.button === 1,
                right: prev.right || e.button === 2,
            }));
        };

        const handledblClick = () => {
            setButtons(prev => ({ ...prev, double: true }));
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY < 0) setButtons(prev => ({ ...prev, scrollUp: true }));
            else if (e.deltaY > 0) setButtons(prev => ({ ...prev, scrollDown: true }));
        };

        const handleMouseMove = () => {
            const now = performance.now();
            // Calculate standard polling rate (approx)
            mouseEvents.current.push(now);
            // Keep only last second
            const cutoff = now - 1000;
            mouseEvents.current = mouseEvents.current.filter(t => t > cutoff);
            setPollingRate(mouseEvents.current.length);
        };

        // Only attach global listeners if specific tab is active? 
        // For simplicity, we'll attach to window but use state to control UI updates
        // Prevent context menu to test right click freely
        const preventContext = (e: MouseEvent) => e.preventDefault();

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("dblclick", handledblClick);
        window.addEventListener("wheel", handleWheel);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("contextmenu", preventContext);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("dblclick", handledblClick);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("contextmenu", preventContext);
        };
    }, []);

    // --- Canvas Drawing Logic ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        resize();
        window.addEventListener('resize', resize);

        const startDraw = (e: MouseEvent | TouchEvent) => {
            setIsDrawing(true);
            const { x, y } = getPos(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return;
            const { x, y } = getPos(e);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "#10b981"; // Primary/Green color
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const endDraw = () => setIsDrawing(false);

        const getPos = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            let cx, cy;
            if ('touches' in e) {
                cx = e.touches[0].clientX;
                cy = e.touches[0].clientY;
            } else {
                cx = (e as MouseEvent).clientX;
                cy = (e as MouseEvent).clientY;
            }
            return { x: cx - rect.left, y: cy - rect.top };
        };

        // We need to attach these to the *canvas* specifically to avoid drawing everywhere
        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", endDraw);
        canvas.addEventListener("mouseleave", endDraw);

        canvas.addEventListener("touchstart", startDraw);
        canvas.addEventListener("touchmove", draw);
        canvas.addEventListener("touchend", endDraw);

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener("mousedown", startDraw);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", endDraw);
            canvas.removeEventListener("mouseleave", endDraw);
            canvas.removeEventListener("touchstart", startDraw);
            canvas.removeEventListener("touchmove", draw);
            canvas.removeEventListener("touchend", endDraw);
        };
    }, [isDrawing]);

    // --- Game Logic ---
    const currTargetIdRef = useRef(0);

    const startGame = () => {
        setGameActive(true);
        setScore(0);
        setTimeLeft(15);
        setTargets([]);
        spawnTarget();

        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        gameTimerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const endGame = () => {
        setGameActive(false);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);

        let xp = 0;
        if (score > 20) xp = 100;
        else if (score > 10) xp = 50;
        else if (score > 1) xp = 10;

        if (xp > 0) {
            addXP(xp, `Accuracy Game: ${score} targets`);
            toast.success(`Game Over! Score: ${score}. Earned +${xp} XP!`);
        } else {
            toast(`Game Over. Score: ${score}`);
        }

        addResult({ id: "mouse-accuracy", name: "Mouse Accuracy Test", status: "pass", details: `Score: ${score}` });
    };

    const spawnTarget = () => {
        if (!gameContainerRef.current) return;
        const { clientWidth, clientHeight } = gameContainerRef.current;
        const size = 60;
        const x = Math.random() * (clientWidth - size);
        const y = Math.random() * (clientHeight - size);

        setTargets(prev => [...prev, { id: currTargetIdRef.current++, x, y }]);
    };

    const hitTarget = (id: number) => {
        setTargets(prev => prev.filter(t => t.id !== id));
        setScore(prev => prev + 1);
        spawnTarget(); // Spawn new one immediately
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        };
    }, []);


    return (
        <div className="flex flex-col gap-6 p-4">
            <Tabs defaultValue="buttons" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="buttons">Buttons & Scroll</TabsTrigger>
                    <TabsTrigger value="touch">Touch & Draw</TabsTrigger>
                    <TabsTrigger value="game">Accuracy Game</TabsTrigger>
                </TabsList>

                <TabsContent value="buttons" className="mt-0">
                    <AnimatedCard>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-6 text-primary">
                                <MousePointer2 className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Input Detection</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <ButtonState label="Left Click" active={buttons.left} />
                                        <ButtonState label="Middle" active={buttons.middle} />
                                        <ButtonState label="Right Click" active={buttons.right} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ButtonState label="Double Click" active={buttons.double} />
                                        <div className="flex flex-col gap-2">
                                            <ButtonState label="Scroll Up" active={buttons.scrollUp} />
                                            <ButtonState label="Scroll Down" active={buttons.scrollDown} />
                                        </div>
                                    </div>
                                </div>

                                {/* Graphic Representation */}
                                <div className="relative flex items-center justify-center bg-secondary/10 rounded-xl p-8 border border-border/50">
                                    <div className="w-40 h-64 border-4 border-foreground/20 rounded-[3rem] relative bg-background">
                                        {/* Left Btn */}
                                        <div className={`absolute top-0 left-0 w-1/2 h-20 border-r-2 border-b-2 border-foreground/20 rounded-tl-[2.6rem] transition-colors duration-200 ${buttons.left ? 'bg-primary' : ''}`} />
                                        {/* Right Btn */}
                                        <div className={`absolute top-0 right-0 w-1/2 h-20 border-b-2 border-foreground/20 rounded-tr-[2.6rem] transition-colors duration-200 ${buttons.right ? 'bg-primary' : ''}`} />
                                        {/* Wheel */}
                                        <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-8 h-12 border-2 border-foreground/20 rounded-full transition-colors duration-200 ${buttons.middle ? 'bg-primary' : ''} ${buttons.scrollUp || buttons.scrollDown ? 'bg-primary/50' : ''}`} />
                                        {/* Body */}
                                        <div className="absolute top-24 left-0 w-full h-full flex flex-col items-center pt-8">
                                            <div className="text-4xl font-mono font-bold">{pollingRate}</div>
                                            <div className="text-xs text-muted-foreground">POLLING RATE (Hz)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setButtons({
                                        left: false, middle: false, right: false,
                                        double: false, scrollUp: false, scrollDown: false
                                    })}
                                >
                                    <RefreshCw className="mr-2 w-4 h-4" /> Reset Status
                                </Button>
                            </div>
                        </div>
                    </AnimatedCard>
                </TabsContent>

                <TabsContent value="touch" className="mt-0">
                    <AnimatedCard className="h-[500px] flex flex-col">
                        <div className="p-4 border-b border-border/10 flex justify-between items-center bg-background/50 backdrop-blur">
                            <div className="flex items-center gap-2 text-primary">
                                <Move className="w-5 h-5" />
                                <h3 className="font-bold">Touch Digitizer Test</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mr-auto ml-4 hidden md:block">
                                Draw on the area below to verify touch linearity and dead zones.
                            </p>
                            <Button variant="ghost" size="sm" onClick={() => {
                                const canvas = canvasRef.current;
                                if (canvas) {
                                    const ctx = canvas.getContext('2d');
                                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                                }
                            }}>
                                Clear Canvas
                            </Button>
                        </div>
                        <div className="flex-1 bg-white/5 relative cursor-crosshair">
                            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
                            {!isDrawing && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/20 text-4xl font-bold select-none">
                                    START DRAWING
                                </div>
                            )}
                        </div>
                    </AnimatedCard>
                </TabsContent>

                <TabsContent value="game" className="mt-0">
                    <AnimatedCard className="h-[500px] relative overflow-hidden">
                        {!gameActive ? (
                            <div className="h-full flex flex-col items-center justify-center gap-6 z-10 relative">
                                <Trophy className="w-20 h-20 text-yellow-500 mb-2" />
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold">Accuracy Challenge</h2>
                                    <p className="text-muted-foreground max-w-sm">
                                        Hit as many targets as you can in 15 seconds. High accuracy earns extra XP!
                                    </p>
                                </div>
                                <Button onClick={startGame} size="lg" className="text-lg px-8 py-6 rounded-full">
                                    Start Challenge
                                </Button>
                                {score > 0 && <p className="text-xl font-bold">Last Score: {score}</p>}
                            </div>
                        ) : (
                            <div ref={gameContainerRef} className="absolute inset-0 bg-background cursor-crosshair">
                                <div className="absolute top-4 left-0 w-full flex justify-center pointer-events-none z-20">
                                    <div className="bg-primary/20 backdrop-blur px-6 py-2 rounded-full border border-primary/50 text-xl font-mono font-bold flex gap-8">
                                        <span>Time: {timeLeft}s</span>
                                        <span>Score: {score}</span>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {targets.map(t => (
                                        <motion.button
                                            key={t.id}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute w-14 h-14 bg-red-500 rounded-full border-4 border-white shadow-[0_0_15px_rgba(255,0,0,0.6)] hover:bg-red-400 active:scale-95 flex items-center justify-center"
                                            style={{ left: t.x, top: t.y }}
                                            onMouseDown={(e) => { e.stopPropagation(); hitTarget(t.id); }}
                                        >
                                            <Target className="w-8 h-8 text-white pointer-events-none" />
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </AnimatedCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ButtonState({ label, active }: { label: string; active: boolean }) {
    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${active
                ? 'bg-green-500/20 border-green-500/50 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : 'bg-secondary/50 border-border text-muted-foreground'
            }`}>
            <div className={`w-3 h-3 rounded-full ${active ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
            <span className="font-medium whitespace-nowrap">{label}</span>
            {active && <CheckCircle className="w-4 h-4 ml-auto" />}
        </div>
    );
}
