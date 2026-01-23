import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { useEffect } from "react"

interface TestModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function TestModal({ isOpen, onClose, title, children }: TestModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [isOpen, onClose])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-7xl w-full h-[90vh] p-0 gap-0 overflow-hidden flex flex-col bg-white border border-slate-200 shadow-2xl sm:rounded-2xl z-[100]">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 relative bg-white">
                    {children}
                </div>

                {/* Footer hint */}
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-sm text-slate-500 flex items-center justify-between">
                    <span>Press <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-700 shadow-sm">ESC</kbd> to close</span>
                </div>
            </DialogContent>
        </Dialog>
    )
}
