import { BenchmarkTest } from "@/components/diagnostics/benchmark-test"

export default function BenchmarkPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Benchmark</h1>
                <p className="text-neutral-400">Stress test your CPU and GPU capabilities.</p>
            </div>
            <BenchmarkTest />
        </div>
    )
}
