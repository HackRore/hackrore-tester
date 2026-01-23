"use client"

import { useState, useEffect, useRef } from "react"
import { Keyboard, Mouse, RotateCcw, Zap, Activity, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface InputTestProps {
    mode?: "keyboard" | "mouse" | "gamepad" | "all"
}

export function InputTest({ mode = "all" }: InputTestProps) {
    // OS Detection
    const [os, setOs] = useState<'windows' | 'mac' | 'linux'>('windows')

    // Keyboard State
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
    const [historyKeys, setHistoryKeys] = useState<Set<string>>(new Set())
    const [maxRollover, setMaxRollover] = useState(0)
    const [showNumpad, setShowNumpad] = useState(false)

    // Mouse State
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mouseStats, setMouseStats] = useState({ x: 0, y: 0, buttons: 0, scroll: 0, pollingRate: 0 })
    const lastMouseMoveRef = useRef<number>(0)

    // Auto-detect OS and keyboard layout
    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        setOs(userAgent.includes('mac') ? 'mac' : userAgent.includes('linux') ? 'linux' : 'windows')
        setShowNumpad(window.innerWidth >= 1440)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault()
            const code = e.code
            setActiveKeys(prev => {
                const newSet = new Set(prev).add(code)
                if (newSet.size > maxRollover) setMaxRollover(newSet.size)
                return newSet
            })
            setHistoryKeys(prev => new Set(prev).add(code))
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            e.preventDefault()
            setActiveKeys(prev => {
                const next = new Set(prev)
                next.delete(e.code)
                return next
            })
        }

        if (mode === 'all' || mode === 'keyboard') {
            window.addEventListener("keydown", handleKeyDown)
            window.addEventListener("keyup", handleKeyUp)
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [mode, maxRollover])

    // Detect polling rate
    useEffect(() => {
        const updatePolling = () => {
            // Reset if no movement for a while
            if (Date.now() - lastMouseMoveRef.current > 100) {
                setMouseStats(s => ({ ...s, pollingRate: 0 }))
            }
        }

        const interval = setInterval(updatePolling, 500)
        return () => clearInterval(interval)
    }, [])


    // Realistic key component with 3D effect
    const Key = ({ code, label, width = 1, subLabel }: { code: string, label: string, width?: number, subLabel?: string }) => {
        const isPressed = activeKeys.has(code)
        const wasPressed = historyKeys.has(code)

        return (
            <div
                className={`
                    relative rounded-md flex flex-col items-center justify-center text-xs font-bold transition-all duration-75 select-none
                    ${isPressed
                        ? 'bg-blue-600 text-white translate-y-1 shadow-none border-t-0'
                        : wasPressed
                            ? 'bg-neutral-800 text-green-400 border-b-4 border-neutral-950 hover:bg-neutral-700'
                            : 'bg-neutral-900 text-neutral-500 border-b-4 border-black hover:bg-neutral-800'}
                `}
                style={{
                    width: `${width * 3}rem`,
                    height: '3.5rem',
                    boxShadow: isPressed ? `0 0 15px var(--primary)` : 'none'
                }}
            >
                {subLabel && <span className="absolute top-1 right-2 text-[10px] opacity-60">{subLabel}</span>}
                <span>{label}</span>
            </div>
        )
    }

    // Mouse Canvas Logic
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || (mode !== 'all' && mode !== 'mouse')) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set initial background
        ctx.fillStyle = '#171717' // neutral-900
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Grid lines
        ctx.strokeStyle = '#262626'
        ctx.lineWidth = 1
        for (let i = 0; i < canvas.width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
        for (let i = 0; i < canvas.height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

        const draw = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Calculate polling rate
            const now = Date.now()
            const diff = now - lastMouseMoveRef.current
            lastMouseMoveRef.current = now
            const rate = diff > 0 ? Math.round(1000 / diff) : 0

            setMouseStats(prev => ({
                ...prev,
                x: Math.round(x),
                y: Math.round(y),
                buttons: e.buttons,
                pollingRate: rate > 0 ? rate : prev.pollingRate
            }))

            if (e.buttons > 0) {
                // Paint brush effect
                ctx.shadowBlur = 10
                ctx.shadowColor = e.button === 2 ? '#ef4444' : '#22c55e'
                ctx.fillStyle = e.button === 2 ? '#ef4444' : '#22c55e'
                ctx.beginPath()
                ctx.arc(x, y, 6, 0, Math.PI * 2)
                ctx.fill()
                ctx.shadowBlur = 0
            } else {
                // Cursor trail effect (temporary)
                ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
                ctx.beginPath()
                ctx.arc(x, y, 2, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const handleScroll = (e: WheelEvent) => {
            e.preventDefault()
            setMouseStats(prev => ({ ...prev, scroll: prev.scroll + e.deltaY }))
        }

        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mousedown', draw)
        canvas.addEventListener('wheel', handleScroll, { passive: false })
        canvas.addEventListener('contextmenu', e => e.preventDefault())

        return () => {
            // Cleanup listeners
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mousedown', draw)
            canvas.removeEventListener('wheel', handleScroll)
            canvas.removeEventListener('contextmenu', e => e.preventDefault())
        }
    }, [mode])

    const resetKeyboard = () => {
        setHistoryKeys(new Set())
        setActiveKeys(new Set())
        setMaxRollover(0)
    }

    const showKeyboard = mode === "all" || mode === "keyboard"
    const showMouse = mode === "all" || mode === "mouse"

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {showKeyboard && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/50 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Keyboard className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Keyboard Matrix</h3>
                                <p className="text-xs text-neutral-400">Low-latency input detection</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="text-right px-4 py-1 bg-neutral-950 rounded border border-neutral-800">
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Active Keys</div>
                                <div className="text-xl font-mono text-blue-400 font-bold">{activeKeys.size}</div>
                            </div>
                            <div className="text-right px-4 py-1 bg-neutral-950 rounded border border-neutral-800">
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Max Rollover</div>
                                <div className="text-xl font-mono text-green-400 font-bold">{maxRollover > 0 ? `${maxRollover}KRO` : '-'}</div>
                            </div>
                            <Button variant="outline" size="sm" onClick={resetKeyboard} className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:text-white">
                                <RotateCcw className="mr-2 h-3 w-3" /> Reset
                            </Button>
                        </div>
                    </div>

                    <div className="flex sm:justify-center overflow-x-auto pb-4">
                        <div className="flex gap-6 items-start min-w-max p-1">
                            {/* Main Keyboard - Realistic Layout */}
                            <div className="p-6 bg-black/80 rounded-2xl border border-neutral-800 shadow-2xl relative">
                                {/* Decor */}
                                <div className="absolute top-0 right-10 w-20 h-1 bg-blue-500 rounded-b-full opacity-50 blur-sm"></div>

                                <div className="space-y-2">
                                    {/* Row 1: Function Keys */}
                                    <div className="flex gap-1.5">
                                        <Key code="Escape" label="ESC" width={1.2} />
                                        <div className="w-4" />
                                        <Key code="F1" label="F1" />
                                        <Key code="F2" label="F2" />
                                        <Key code="F3" label="F3" />
                                        <Key code="F4" label="F4" />
                                        <div className="w-2" />
                                        <Key code="F5" label="F5" />
                                        <Key code="F6" label="F6" />
                                        <Key code="F7" label="F7" />
                                        <Key code="F8" label="F8" />
                                        <div className="w-2" />
                                        <Key code="F9" label="F9" />
                                        <Key code="F10" label="F10" />
                                        <Key code="F11" label="F11" />
                                        <Key code="F12" label="F12" />
                                    </div>

                                    {/* Row 2: Numbers */}
                                    <div className="flex gap-1.5">
                                        <Key code="Backquote" label="`" subLabel="~" />
                                        <Key code="Digit1" label="1" subLabel="!" />
                                        <Key code="Digit2" label="2" subLabel="@" />
                                        <Key code="Digit3" label="3" subLabel="#" />
                                        <Key code="Digit4" label="4" subLabel="$" />
                                        <Key code="Digit5" label="5" subLabel="%" />
                                        <Key code="Digit6" label="6" subLabel="^" />
                                        <Key code="Digit7" label="7" subLabel="&" />
                                        <Key code="Digit8" label="8" subLabel="*" />
                                        <Key code="Digit9" label="9" subLabel="(" />
                                        <Key code="Digit0" label="0" subLabel=")" />
                                        <Key code="Minus" label="-" subLabel="_" />
                                        <Key code="Equal" label="=" subLabel="+" />
                                        <Key code="Backspace" label="BACKSPACE" width={2} />
                                    </div>

                                    {/* Row 3: QWERTY */}
                                    <div className="flex gap-1.5">
                                        <Key code="Tab" label="TAB" width={1.5} />
                                        <Key code="KeyQ" label="Q" />
                                        <Key code="KeyW" label="W" />
                                        <Key code="KeyE" label="E" />
                                        <Key code="KeyR" label="R" />
                                        <Key code="KeyT" label="T" />
                                        <Key code="KeyY" label="Y" />
                                        <Key code="KeyU" label="U" />
                                        <Key code="KeyI" label="I" />
                                        <Key code="KeyO" label="O" />
                                        <Key code="KeyP" label="P" />
                                        <Key code="BracketLeft" label="[" subLabel="{" />
                                        <Key code="BracketRight" label="]" subLabel="}" />
                                        <Key code="Backslash" label="\\" width={1.5} subLabel="|" />
                                    </div>

                                    {/* Row 4: ASDF */}
                                    <div className="flex gap-1.5">
                                        <Key code="CapsLock" label="CAPS" width={1.75} />
                                        <Key code="KeyA" label="A" />
                                        <Key code="KeyS" label="S" />
                                        <Key code="KeyD" label="D" />
                                        <Key code="KeyF" label="F" />
                                        <Key code="KeyG" label="G" />
                                        <Key code="KeyH" label="H" />
                                        <Key code="KeyJ" label="J" />
                                        <Key code="KeyK" label="K" />
                                        <Key code="KeyL" label="L" />
                                        <Key code="Semicolon" label=";" subLabel=":" />
                                        <Key code="Quote" label="'" subLabel='"' />
                                        <Key code="Enter" label="ENTER" width={2.25} />
                                    </div>

                                    {/* Row 5: ZXCV */}
                                    <div className="flex gap-1.5">
                                        <Key code="ShiftLeft" label="SHIFT" width={2.25} />
                                        <Key code="KeyZ" label="Z" />
                                        <Key code="KeyX" label="X" />
                                        <Key code="KeyC" label="C" />
                                        <Key code="KeyV" label="V" />
                                        <Key code="KeyB" label="B" />
                                        <Key code="KeyN" label="N" />
                                        <Key code="KeyM" label="M" />
                                        <Key code="Comma" label="," subLabel="<" />
                                        <Key code="Period" label="." subLabel=">" />
                                        <Key code="Slash" label="/" subLabel="?" />
                                        <Key code="ShiftRight" label="SHIFT" width={2.75} />
                                    </div>

                                    {/* Row 6: Bottom Row */}
                                    <div className="flex gap-1.5">
                                        <Key code="ControlLeft" label={os === 'mac' ? '⌃' : 'CTRL'} width={1.25} />
                                        <Key code="MetaLeft" label={os === 'mac' ? '⌘' : 'WIN'} width={1.25} />
                                        <Key code="AltLeft" label={os === 'mac' ? '⌥' : 'ALT'} width={1.25} />
                                        <Key code="Space" label="" width={6.25} />
                                        <Key code="AltRight" label={os === 'mac' ? '⌥' : 'ALT'} width={1.25} />
                                        <Key code="MetaRight" label="FN" width={1.25} />
                                        <Key code="ControlRight" label={os === 'mac' ? '⌃' : 'CTRL'} width={1.25} />
                                    </div>

                                    {/* Navigation Block */}
                                    {/* Simplified for TKL layout compatibility, integrated into logical rows if space permitted, 
                                        but for now focusing on 60% + F-keys core for visual clarity, users request full functionality 
                                        so we should ideally support Nav keys, but layout constraint was mentioned. 
                                        Keeping it clean for now as per "TheTest.com" usually focuses on main block.
                                     */}
                                </div>
                            </div>

                            {/* Numpad */}
                            {showNumpad && (
                                <div className="p-6 bg-black/80 rounded-2xl border border-neutral-800 shadow-2xl">
                                    <div className="space-y-2">
                                        <div className="flex gap-1.5">
                                            <Key code="NumLock" label="NUM" />
                                            <Key code="NumpadDivide" label="/" />
                                            <Key code="NumpadMultiply" label="*" />
                                            <Key code="NumpadSubtract" label="-" />
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Key code="Numpad7" label="7" />
                                            <Key code="Numpad8" label="8" />
                                            <Key code="Numpad9" label="9" />
                                            <div className="flex flex-col gap-1.5">
                                                <Key code="NumpadAdd" label="+" />
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Key code="Numpad4" label="4" />
                                            <Key code="Numpad5" label="5" />
                                            <Key code="Numpad6" label="6" />
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Key code="Numpad1" label="1" />
                                            <Key code="Numpad2" label="2" />
                                            <Key code="Numpad3" label="3" />
                                            <div className="flex flex-col gap-1.5">
                                                <Key code="NumpadEnter" label="↵" />
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Key code="Numpad0" label="0" width={2} />
                                            <Key code="NumpadDecimal" label="." />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Size toggle manually if needed */}
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNumpad(!showNumpad)}
                            className="text-xs text-neutral-600 hover:text-white"
                        >
                            {showNumpad ? "Hide Numpad" : "Show Numpad"}
                        </Button>
                    </div>
                </div>
            )}

            {showMouse && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/50 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Mouse className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Mouse Performance</h3>
                                <p className="text-xs text-neutral-400">Sensor tracking & polling rate</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="text-right px-4 py-1 bg-neutral-950 rounded border border-neutral-800">
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Coordinates</div>
                                <div className="text-sm font-mono text-neutral-300 font-bold">X:{mouseStats.x} Y:{mouseStats.y}</div>
                            </div>
                            <div className="text-right px-4 py-1 bg-neutral-950 rounded border border-neutral-800">
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Est. Polling</div>
                                <div className="text-xl font-mono text-purple-400 font-bold">{mouseStats.pollingRate} <span className="text-xs text-neutral-600">Hz</span></div>
                            </div>
                            <div className="text-right px-4 py-1 bg-neutral-950 rounded border border-neutral-800">
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Scroll</div>
                                <div className="text-xl font-mono text-blue-400 font-bold">{mouseStats.scroll}<span className="text-xs text-neutral-600">px</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="relative border border-neutral-800 rounded-xl overflow-hidden bg-[#171717] shadow-inner">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={400}
                            className="w-full h-[400px] cursor-none touch-none"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-500 bg-black/50 px-3 py-1 rounded-full backdrop-blur">
                            Left Click = Green • Right Click = Red • Scroll to test wheel
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


