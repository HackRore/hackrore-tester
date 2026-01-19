"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Mic, Volume2, StopCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AudioVideoTest() {
    const [stream, setStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedCamera, setSelectedCamera] = useState<string>("")

    // Initialize devices
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devs) => {
            setDevices(devs)
            const cams = devs.filter(d => d.kind === 'videoinput')
            if (cams.length > 0) setSelectedCamera(cams[0].deviceId)
        })
        return () => {
            stopCamera()
        }
    }, [])

    // Video stream binding
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    const startCamera = async () => {
        try {
            stopCamera()
            // Force strict constraint to ensure correct device
            const constraints = {
                video: {
                    deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            }
            const s = await navigator.mediaDevices.getUserMedia(constraints)
            setStream(s)
        } catch (err) {
            console.error("Error accessing camera:", err)
            alert("Could not access camera. Please check permissions.")
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }

    const testSpeaker = (channel: 'left' | 'right' | 'both') => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        // Use separate logic if StereoPanner is not supported (rare, but good for robust fallback)
        if (ctx.createStereoPanner) {
            const panner = ctx.createStereoPanner()
            if (channel === 'left') panner.pan.value = -1
            else if (channel === 'right') panner.pan.value = 1
            else panner.pan.value = 0

            osc.connect(gain)
            gain.connect(panner)
            panner.connect(ctx.destination)
        } else {
            // Fallback for older browsers (unlikely needed for Next.js app but safe)
            osc.connect(gain)
            gain.connect(ctx.destination)
        }

        // Frequencies: Left=Low(300), Right=High(600), Both=Standard(440)
        osc.frequency.value = channel === 'both' ? 440 : (channel === 'left' ? 300 : 600)
        osc.type = 'sine'

        osc.start()
        gain.gain.setValueAtTime(0.5, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1)
        osc.stop(ctx.currentTime + 1)
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" /> Camera Test</CardTitle>
                    <CardDescription>Check webcam functionality.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center relative bg-black">
                        {stream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full"
                                style={{ transform: 'scaleX(-1)' }} // Mirror effect for natural feel
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Camera className="h-10 w-10 opacity-20" />
                                <p>Camera is off</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Camera" />
                            </SelectTrigger>
                            <SelectContent>
                                {devices
                                    .filter(d => d.kind === 'videoinput')
                                    .map((d, i) => (
                                        <SelectItem key={d.deviceId || `cam-${i}`} value={d.deviceId || `cam-${i}`}>
                                            {d.label || `Camera ${i + 1}`}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {!stream ? (
                            <Button onClick={startCamera}>Start Camera</Button>
                        ) : (
                            <Button variant="destructive" onClick={stopCamera}>Stop Camera</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Volume2 className="h-5 w-5" /> Audio Test</CardTitle>
                    <CardDescription>Test speakers stereo separation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 border rounded-md space-y-4">
                        <h4 className="font-medium">Speaker Channels</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <Button onClick={() => testSpeaker('left')} variant="outline">
                                <Volume2 className="mr-2 h-4 w-4 rotate-180" /> Left
                            </Button>
                            <Button onClick={() => testSpeaker('both')} variant="outline">
                                <Volume2 className="mr-2 h-4 w-4" /> Both
                            </Button>
                            <Button onClick={() => testSpeaker('right')} variant="outline">
                                Right <Volume2 className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Left: 300Hz | Both: 440Hz | Right: 600Hz
                        </p>
                    </div>

                    <div className="p-4 border rounded-md">
                        <h4 className="font-medium mb-2">Microphone Test</h4>
                        <p className="text-sm text-muted-foreground">Microphone visualization coming soon.</p>
                        <Button disabled variant="secondary" className="w-full mt-2">
                            <Mic className="mr-2 h-4 w-4" /> Start Mic Test
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
