import { StorageTest } from "@/components/diagnostics/storage-test"

export default function StoragePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Storage Speed Test</h1>
                <p className="text-neutral-400">Measure browser storage read/write performance.</p>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                    <StorageTest />
                </div>
            </div>
        </div>
    )
}
