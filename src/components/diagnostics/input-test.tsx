"use client"

import { useState, useEffect, useRef } from "react"
import { Keyboard, Mouse, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InputTestProps {
    mode?: "keyboard" | "mouse" | "gamepad" | "all"
}

export function InputTest({ mode = "all" }: InputTestProps) {
    // OS Detection
    const [os, setOs] = useState<'windows' | 'mac' | 'linux'>('windows')

    // Keyboard State
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
    const [historyKeys, setHistoryKeys] = useState<Set<string>>(new Set())
    const [showNumpad, setShowNumpad] = useState(false)

    // Mouse State
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mouseStats, setMouseStats] = useState({ x: 0, y: 0, buttons: 0, scroll: 0 })

    // Auto-detect OS and keyboard layout
    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('mac') !== -1) {
            setOs('mac')
        } else if (userAgent.indexOf('linux') !== -1) {
            setOs('linux')
        } else {
            setOs('windows')
        }

        // Auto-detect numpad based on screen width
        const hasLargeScreen = window.innerWidth >= 1440
        setShowNumpad(hasLargeScreen)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault()
            const code = e.code
            setActiveKeys(prev => new Set(prev).add(code))
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
    }, [mode])

    // Realistic key component with proper sizing
    const Key = ({ code, label, width = 1 }: { code: string, label: string, width?: number }) => {
        const isPressed = activeKeys.has(code)
        const wasPressed = historyKeys.has(code)

        return (
            <button
                className={`
                    h-12 rounded flex items-center justify-center text-xs font-semibold transition-all
                    ${isPressed ? 'bg-neutral-800 border-2 border-green-500 text-white scale-95' :
                        wasPressed ? 'bg-neutral-900 border-2 border-green-700 text-green-200' :
                            'bg-neutral-900 border border-neutral-700 text-neutral-400 hover:border-neutral-600'}
                `}
                style={{ width: `${width * 3}rem` }}
                disabled
            >
                {label}
            </button>
        )
    }

    // Mouse Canvas Logic
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || (mode !== 'all' && mode !== 'mouse')) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = '#09090b'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const draw = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            setMouseStats(prev => ({ ...prev, x: Math.round(x), y: Math.round(y), buttons: e.buttons }))

            if (e.buttons > 0) {
                ctx.fillStyle = e.button === 2 ? '#ef4444' : '#22c55e'
                ctx.beginPath()
                ctx.arc(x, y, 4, 0, Math.PI * 2)
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
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mousedown', draw)
            canvas.removeEventListener('wheel', handleScroll)
            canvas.removeEventListener('contextmenu', e => e.preventDefault())
        }
    }, [mode])

    const resetKeyboard = () => {
        setHistoryKeys(new Set())
        setActiveKeys(new Set())
    }

    const showKeyboard = mode === "all" || mode === "keyboard"
    const showMouse = mode === "all" || mode === "mouse"

    return (
        <div className="space-y-8">
            {showKeyboard && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button
                                variant={!showNumpad ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowNumpad(false)}
                                className={!showNumpad ? "bg-white text-black" : ""}
                            >
                                Laptop (TKL)
                            </Button>
                            <Button
                                variant={showNumpad ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowNumpad(true)}
                                className={showNumpad ? "bg-white text-black" : ""}
                            >
                                Desktop (Full)
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span>Detected: {os === 'mac' ? '🍎 macOS' : os === 'linux' ? '🐧 Linux' : '🪟 Windows'}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetKeyboard}>
                            <RotateCcw className="mr-2 h-3 w-3" /> Reset
                        </Button>
                    </div>

                    <div className="flex gap-6 items-start">
                        {/* Main Keyboard - Realistic Layout */}
                        <div className="flex-1 p-6 bg-black rounded-xl border border-neutral-800">
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
                                    <Key code="Backquote" label="`" />
                                    <Key code="Digit1" label="1" />
                                    <Key code="Digit2" label="2" />
                                    <Key code="Digit3" label="3" />
                                    <Key code="Digit4" label="4" />
                                    <Key code="Digit5" label="5" />
                                    <Key code="Digit6" label="6" />
                                    <Key code="Digit7" label="7" />
                                    <Key code="Digit8" label="8" />
                                    <Key code="Digit9" label="9" />
                                    <Key code="Digit0" label="0" />
                                    <Key code="Minus" label="-" />
                                    <Key code="Equal" label="=" />
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
                                    <Key code="BracketLeft" label="[" />
                                    <Key code="BracketRight" label="]" />
                                    <Key code="Backslash" label="\\" width={1.5} />
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
                                    <Key code="Semicolon" label=";" />
                                    <Key code="Quote" label="'" />
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
                                    <Key code="Comma" label="," />
                                    <Key code="Period" label="." />
                                    <Key code="Slash" label="/" />
                                    <Key code="ShiftRight" label="SHIFT" width={2.75} />
                                </div>

                                {/* Row 6: Bottom Row */}
                                <div className="flex gap-1.5">
                                    <Key code="ControlLeft" label={os === 'mac' ? '⌃' : 'CTRL'} width={1.25} />
                                    <Key code="MetaLeft" label={os === 'mac' ? '⌘' : 'WIN'} width={1.25} />
                                    <Key code="AltLeft" label={os === 'mac' ? '⌥' : 'ALT'} width={1.25} />
                                    <Key code="Space" label="SPACE" width={6.25} />
                                    <Key code="AltRight" label={os === 'mac' ? '⌥' : 'ALT'} width={1.25} />
                                    <Key code="MetaRight" label="FN" width={1.25} />
                                    <Key code="ControlRight" label={os === 'mac' ? '⌃' : 'CTRL'} width={1.25} />
                                </div>
                            </div>
                        </div>

                        {/* Numpad */}
                        {showNumpad && (
                            <div className="p-6 bg-black rounded-xl border border-neutral-800">
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
            )}

            {showMouse && (
                <div className="space-y-4">
                    <div className="flex gap-4 text-sm font-mono text-neutral-400">
                        <span>X: {mouseStats.x}</span>
                        <span>Y: {mouseStats.y}</span>
                        <span>Buttons: {mouseStats.buttons}</span>
                        <span className="text-blue-400">Scroll: {mouseStats.scroll}px</span>
                    </div>
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={400}
                        className="w-full h-[400px] border border-neutral-800 rounded bg-black cursor-crosshair touch-none"
                    />
                    <div className="text-center text-xs text-neutral-500">
                        Left Click = Green • Right Click = Red • Scroll to test wheel
                    </div>
                </div>
            )}
        </div>
    )
}
