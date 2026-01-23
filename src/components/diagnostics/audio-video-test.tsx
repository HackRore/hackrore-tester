"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Mic, Volume2, StopCircle, Play, AlertCircle, RefreshCw, Activity, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

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
    const [cameraStats, setCameraStats] = useState<{ width: number, height: number, fps: number | undefined } | null>(null)

    // Mic Visualization Refs
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

    const showCamera = mode === 'all' || mode === 'camera'
    const showMic = mode === 'all' || mode === 'mic'
    const showSpeakers = mode === 'all' || mode === 'speakers'

    useEffect(() => {
        const getDevices = async () => {
            try {
                // Request permissions first to populate labels
                // await navigator.mediaDevices.getUserMedia({ video: showCamera, audio: showMic }); 
                const devs = await navigator.mediaDevices.enumerateDevices()
                setDevices(devs)

                if (showCamera) {
                    const cams = devs.filter(d => d.kind === 'videoinput')
                    if (cams.length > 0 && !selectedDevice) setSelectedDevice(cams[0].deviceId)
                } else if (showMic) {
                    const mics = devs.filter(d => d.kind === 'audioinput')
                    if (mics.length > 0 && !selectedDevice) setSelectedDevice(mics[0].deviceId)
                }
            } catch (e) {
                console.warn("Permissions not granted or device enumeration failed", e);
            }
        }
        getDevices()

        return () => {
            stopMedia()
        }
    }, [mode, showCamera, showMic])

    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream

            // Extract Camera Settings
            const track = stream.getVideoTracks()[0]
            if (track) {
                const settings = track.getSettings()
                setCameraStats({
                    width: settings.width || 0,
                    height: settings.height || 0,
                    fps: settings.frameRate
                })
            }
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
                    deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
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
            setCameraStats(null)
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
        analyser.fftSize = 512
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

            // Dynamic Background
            canvasCtx.fillStyle = '#0a0a0a'
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

            // Grid
            canvasCtx.strokeStyle = '#262626'
            canvasCtx.beginPath()
            canvasCtx.moveTo(0, canvas.height / 2)
            canvasCtx.lineTo(canvas.width, canvas.height / 2)
            canvasCtx.stroke()

            const barWidth = (canvas.width / bufferLength) * 2.5
            let barHeight
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 1.2

                // Cyberpunk Gradient
                const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
                gradient.addColorStop(0, '#3b82f6') // Blue
                gradient.addColorStop(1, '#a855f7') // Purple

                canvasCtx.fillStyle = gradient
                canvasCtx.shadowBlur = 10
                canvasCtx.shadowColor = '#3b82f6'

                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

                // Reflection effect
                canvasCtx.fillStyle = 'rgba(59, 130, 246, 0.2)'
                canvasCtx.fillRect(x, canvas.height, barWidth, barHeight * 0.5)

                x += barWidth + 1
            }
            canvasCtx.shadowBlur = 0
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

        // Tone Logic - More pleasant "beep"
        const now = ctx.currentTime
        osc.frequency.setValueAtTime(channel === 'left' ? 440 : channel === 'right' ? 880 : 660, now)
        osc.type = 'sine'

        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.3, now + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

        osc.start(now)
        osc.stop(now + 0.5)
    }

    if (permissionError) {
        return (
            <Alert variant="destructive" className="bg-red-950/50 border-red-900/50 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    Please allow browser permissions to access camera and microphone.
                </AlertDescription>
                <Button onClick={startMedia} variant="secondary" size="sm" className="mt-4">Retry Access</Button>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            {/* Status Bar */}
            {(showCamera || showMic) && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-white/10 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${stream ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {stream ? <Activity className="w-4 h-4 text-green-500" /> : <StopCircle className="w-4 h-4 text-red-500" />}
                        </div>
                        <span className="text-neutral-400 text-sm font-mono">{statusmsg}</span>
                    </div>
                    {stream && <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 animate-pulse">LIVE FEED</Badge>}
                </div>
            )}

            {showCamera && (
                <Card className="bg-black border-neutral-800">
                    <CardHeader className="pb-4 border-b border-neutral-800">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-500" /> Video Feed
                            </CardTitle>
                            {cameraStats && (
                                <div className="text-xs font-mono text-neutral-500">
                                    {cameraStats.width}x{cameraStats.height} @ {cameraStats.fps?.toFixed(0) || 'N/A'} FPS
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative group">
                        {/* Video Canvas */}
                        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                            {/* Grid Overlay */}
                            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                            </div>

                            {stream ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-contain transform -scale-x-100"
                                />
                            ) : (
                                <div className="text-neutral-700 flex flex-col items-center animate-pulse">
                                    <Camera className="h-16 w-16 mb-4 opacity-50" />
                                    <span className="text-sm tracking-widest uppercase">Signal Lost</span>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex gap-4">
                            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                                <SelectTrigger className="w-[200px] bg-neutral-950 border-neutral-800 text-white">
                                    <SelectValue placeholder="Select Camera" />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    {devices.filter(d => d.kind === 'videoinput').map((d, i) => (
                                        <SelectItem key={d.deviceId || `cam-${i}`} value={d.deviceId || `cam-${i}`}>{d.label || `Camera ${i + 1}`}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={stream ? stopMedia : startMedia} className={stream ? "bg-red-600 hover:bg-red-700" : "bg-white text-black hover:bg-neutral-200"}>
                                {stream ? "Stop Feed" : "Start Camera"}
                            </Button>
                            {stream && (
                                <Button onClick={() => {
                                    if (videoRef.current) {
                                        const canvas = document.createElement('canvas')
                                        canvas.width = videoRef.current.videoWidth
                                        canvas.height = videoRef.current.videoHeight
                                        const ctx = canvas.getContext('2d')
                                        if (ctx) {
                                            ctx.save()
                                            ctx.scale(-1, 1) // Mirror effect
                                            ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height)
                                            ctx.restore()

                                            const link = document.createElement('a')
                                            link.download = `snapshot-${new Date().toISOString()}.png`
                                            link.href = canvas.toDataURL('image/png')
                                            link.click()
                                        }
                                    }
                                }} variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 ml-auto">
                                    <Camera className="w-4 h-4 mr-2" /> Snapshot
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {showMic && (
                <Card className="bg-neutral-950 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center gap-2"><Mic className="w-5 h-5 text-purple-500" /> Audio Input Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-[200px] bg-black rounded-lg border border-neutral-800 overflow-hidden relative shadow-inner">
                            <canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
                            {!stream && (
                                <div className="absolute inset-0 flex items-center justify-center text-neutral-700">
                                    <Activity className="w-12 h-12" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                                <SelectTrigger className="flex-1 bg-neutral-900 border-neutral-800 text-white">
                                    <SelectValue placeholder="Select Input Device" />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    {devices.filter(d => d.kind === 'audioinput').map((d, i) => (
                                        <SelectItem key={d.deviceId || `mic-${i}`} value={d.deviceId || `mic-${i}`}>{d.label || `Mic ${i + 1}`}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={stream ? stopMedia : startMedia} className={stream ? "bg-red-600 hover:bg-red-700 w-32" : "bg-purple-600 hover:bg-purple-700 text-white w-32"}>
                                {stream ? "Stop" : "Listen"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {showSpeakers && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button onClick={() => testSpeaker('left')} variant="secondary" className="h-32 flex-col gap-4 bg-neutral-900/50 border border-white/5 hover:bg-blue-900/20 hover:border-blue-500/50 transition-all group">
                        <div className="p-4 bg-neutral-950 rounded-full text-neutral-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-colors"><Volume2 className="h-8 w-8 rotate-180" /></div>
                        <span className="font-bold text-neutral-400 group-hover:text-blue-400">LEFT CHANNEL</span>
                    </Button>
                    <Button onClick={() => testSpeaker('center')} variant="secondary" className="h-32 flex-col gap-4 bg-neutral-900/50 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                        <div className="p-4 bg-neutral-950 rounded-full text-neutral-500 group-hover:text-white group-hover:bg-white/10 transition-colors"><Volume2 className="h-8 w-8" /></div>
                        <span className="font-bold text-neutral-400 group-hover:text-white">CENTER</span>
                    </Button>
                    <Button onClick={() => testSpeaker('right')} variant="secondary" className="h-32 flex-col gap-4 bg-neutral-900/50 border border-white/5 hover:bg-red-900/20 hover:border-red-500/50 transition-all group">
                        <div className="p-4 bg-neutral-950 rounded-full text-neutral-500 group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors"><Volume2 className="h-8 w-8" /></div>
                        <span className="font-bold text-neutral-400 group-hover:text-red-400">RIGHT CHANNEL</span>
                    </Button>
                    <Button onClick={() => testSpeaker('both')} variant="secondary" className="h-32 flex-col gap-4 bg-neutral-900/50 border border-white/5 hover:bg-green-900/20 hover:border-green-500/50 transition-all group">
                        <span className="text-xl font-black text-neutral-600 group-hover:text-green-500">STEREO CHECK</span>
                    </Button>
                </div>
            )}
        </div>
    )
}
