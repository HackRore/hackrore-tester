import { ControllerTest } from "@/components/diagnostics/controller-test"

export default function ControllerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gamepad Tester</h1>
                <p className="text-neutral-400">Visualize buttons, triggers, and thumbsticks.</p>
            </div>
            <ControllerTest />
        </div>
    )
}
