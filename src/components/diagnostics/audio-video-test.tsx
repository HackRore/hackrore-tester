"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Mic, Volume2, StopCircle, Play, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AudioVideoTestProps {
    mode?: 'camera' | 'mic' | 'speakers' | 'all'
}

export function AudioVideoTest({ mode = 'all' }: AudioVideoTestProps) {
    const [stream, setStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedDevice, setSelectedDevice] = useState<string>("")
    const [permissionError, setPermissionError] = useState(false)
    const [statusmsg, setStatusMsg] = useState("Ready to test.")

    // Mic Visualization Refs
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

    const showCamera = mode === 'all' || mode === 'camera'
    const showMic = mode === 'all' || mode === 'mic'
    const showSpeakers = mode === 'all' || mode === 'speakers'

    useEffect(() => {
        const getDevices = async () => {
            const devs = await navigator.mediaDevices.enumerateDevices()
            setDevices(devs)

            if (showCamera) {
                const cams = devs.filter(d => d.kind === 'videoinput')
                if (cams.length > 0) setSelectedDevice(cams[0].deviceId)
            } else if (showMic) {
                const mics = devs.filter(d => d.kind === 'audioinput')
                if (mics.length > 0) setSelectedDevice(mics[0].deviceId)
            }
        }
        getDevices()

        return () => {
            stopMedia()
        }
    }, [mode])

    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
    }, [stream, showCamera])

    const startMedia = async () => {
        try {
            stopMedia()
            setPermissionError(false)
            setStatusMsg("Initializing hardware...")

            const constraints: MediaStreamConstraints = {}
            if (showCamera) {
                constraints.video = {
                    deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            }
            if (showMic) {
                constraints.audio = {
                    deviceId: selectedDevice ? { exact: selectedDevice } : undefined
                }
            }

            const s = await navigator.mediaDevices.getUserMedia(constraints)
            setStream(s)
            setStatusMsg("Hardware active.")

            if (showMic) {
                startVisualizer(s)
            }

        } catch (err) {
            console.error("Error accessing media:", err)
            setPermissionError(true)
            setStatusMsg("Access denied or device error.")
        }
    }

    const stopMedia = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
            setStatusMsg("Session ended.")
        }

        if (animationRef.current) cancelAnimationFrame(animationRef.current)
        if (audioContextRef.current) audioContextRef.current.close()
        audioContextRef.current = null
    }

    const startVisualizer = (stream: MediaStream) => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        audioContextRef.current = ctx

        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyserRef.current = analyser

        const source = ctx.createMediaStreamSource(stream)
        source.connect(analyser)
        sourceRef.current = source

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        const canvas = canvasRef.current
        if (!canvas) return
        const canvasCtx = canvas.getContext('2d')
        if (!canvasCtx) return

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw)
            analyser.getByteFrequencyData(dataArray)

            canvasCtx.fillStyle = '#09090b' // zinc-950 base
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

            const barWidth = (canvas.width / bufferLength) * 2.5
            let barHeight
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 1.5
                // Pro Green gradient
                const r = barHeight + 25 * (i / bufferLength);
                const g = 250 * (i / bufferLength);
                const b = 50;

                canvasCtx.fillStyle = `rgb(50, 200, 100)`
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
                x += barWidth + 1
            }
        }
        draw()
    }

    const testSpeaker = (channel: 'left' | 'right' | 'center' | 'both') => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        // Pan logic
        if (ctx.createStereoPanner) {
            const panner = ctx.createStereoPanner()
            if (channel === 'left') panner.pan.value = -1
            else if (channel === 'right') panner.pan.value = 1
            else panner.pan.value = 0

            osc.connect(gain).connect(panner).connect(ctx.destination)
        } else {
            osc.connect(gain).connect(ctx.destination)
        }

        // Arpeggio / Tone Logic
        if (channel === 'center' || channel === 'both') {
            // Chord or dual tone? Just Arpeggio sweep from 300 to 800
            osc.frequency.setValueAtTime(300, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5)
        } else if (channel === 'left') {
            // Low sweep
            osc.frequency.setValueAtTime(200, ctx.currentTime)
            osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.5)
        } else {
            // High sweep
            osc.frequency.setValueAtTime(1000, ctx.currentTime)
            osc.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.5)
        }

        osc.type = 'sine'
        osc.start()

        // Envelope
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6)

        osc.stop(ctx.currentTime + 0.6)
    }

    if (permissionError) {
        return (
            <Alert variant="destructive" className="bg-red-950 border-red-900 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    Please allow permissions to continue.
                </AlertDescription>
                <Button onClick={startMedia} variant="secondary" className="mt-2">Retry Access</Button>
            </Alert>
        )
    }

    return (
        <div className="space-y-8">
            {/* Status Bar */}
            {(showCamera || showMic) && (
                <div className="flex items-center justify-between p-3 rounded-md bg-neutral-900 border border-neutral-800">
                    <span className="text-neutral-400 text-sm font-mono">{statusmsg}</span>
                    {stream && <span className="flex items-center gap-2 text-green-500 text-xs uppercase font-bold tracking-wider"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span> Live</span>}
                </div>
            )}

            {showCamera && (
                <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative border border-neutral-800 shadow-2xl">
                        {stream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-contain transform -scale-x-100"
                            />
                        ) : (
                            <div className="text-neutral-600 flex flex-col items-center">
                                <Camera className="h-16 w-16 mb-4 opacity-20" />
                                <span className="text-lg">Camera is inactive</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                            <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white">
                                <SelectValue placeholder="Select Camera" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                {devices.filter(d => d.kind === 'videoinput').map((d, i) => (
                                    <SelectItem key={d.deviceId || `cam-${i}`} value={d.deviceId || `cam-${i}`}>{d.label || `Camera ${i + 1}`}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button size="lg" onClick={stream ? stopMedia : startMedia} className={stream ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white text-black hover:bg-neutral-200"}>
                            {stream ? "Stop Camera" : "Start Camera"}
                        </Button>
                    </div>
                </div>
            )}

            {showMic && (
                <div className="space-y-4">
                    <div className="h-[200px] bg-neutral-950 rounded-lg border border-neutral-800 p-1">
                        <canvas ref={canvasRef} width={800} height={200} className="w-full h-full rounded bg-black" />
                    </div>
                    <div className="flex gap-4">
                        <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                            <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white">
                                <SelectValue placeholder="Select Microphone" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                {devices.filter(d => d.kind === 'audioinput').map((d, i) => (
                                    <SelectItem key={d.deviceId || `mic-${i}`} value={d.deviceId || `mic-${i}`}>{d.label || `Mic ${i + 1}`}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button size="lg" onClick={stream ? stopMedia : startMedia} className={stream ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white text-black hover:bg-neutral-200"}>
                            {stream ? <StopCircle className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                            {stream ? "Stop" : "Test Mic"}
                        </Button>
                    </div>
                </div>
            )}

            {showSpeakers && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button size="xl" onClick={() => testSpeaker('left')} variant="secondary" className="h-32 flex-col gap-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Volume2 className="h-6 w-6 rotate-180" /></div>
                        <span className="font-bold">LEFT</span>
                    </Button>
                    <Button size="xl" onClick={() => testSpeaker('center')} variant="secondary" className="h-32 flex-col gap-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800">
                        <div className="p-3 bg-white/10 rounded-full text-white"><Volume2 className="h-6 w-6" /></div>
                        <span className="font-bold">CENTER</span>
                    </Button>
                    <Button size="xl" onClick={() => testSpeaker('right')} variant="secondary" className="h-32 flex-col gap-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800">
                        <div className="p-3 bg-red-500/10 rounded-full text-red-500"><Volume2 className="h-6 w-6" /></div>
                        <span className="font-bold">RIGHT</span>
                    </Button>
                    <Button size="xl" onClick={() => testSpeaker('both')} variant="secondary" className="h-32 flex-col gap-4 bg-white/5 border border-white/10 hover:bg-white/10">
                        <span className="text-xl font-bold">ALL</span>
                    </Button>
                </div>
            )}
        </div>
    )
}
