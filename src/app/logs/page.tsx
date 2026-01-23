"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, FileText, Search, Download } from "lucide-react"

type Log = {
    id: string
    date: string
    client: string
    device: string
    issue: string
    status: "Pending" | "In Progress" | "Fixed"
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([])
    const [showForm, setShowForm] = useState(false)

    // Load initial stub data
    useEffect(() => {
        const savedCallback = localStorage.getItem("hackrore_logs")
        if (savedCallback) {
            setLogs(JSON.parse(savedCallback))
        } else {
            setLogs([
                { id: "1", date: "2024-03-15", client: "John Doe", device: "Dell XPS 15", issue: "Overheating", status: "Fixed" },
                { id: "2", date: "2024-03-16", client: "Jane Smith", device: "MacBook Air", issue: "Broken Screen", status: "In Progress" },
                { id: "3", date: "2024-03-18", client: "Acme Corp", device: "ThinkPad X1", issue: "Boot Loop", status: "Pending" },
            ])
        }
    }, [])

    useEffect(() => {
        if (logs.length > 0) {
            localStorage.setItem("hackrore_logs", JSON.stringify(logs))
        }
    }, [logs])

    const handleDelete = (id: string) => {
        setLogs(prev => prev.filter(l => l.id !== id))
    }

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", "technician_logs.json")
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Technician Logs</h1>
                    <p className="text-muted-foreground">Manage repair tickets and diagnostics history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-bold shadow-lg shadow-primary/25"
                    >
                        <Plus className="h-4 w-4" />
                        New Ticket
                    </button>
                </div>
            </div>

            {/* Search / Filter Toolbar */}
            <div className="flex items-center gap-4 bg-card p-2 rounded-xl border border-border">
                <Search className="h-5 w-5 text-muted-foreground ml-2" />
                <input
                    type="text"
                    placeholder="Search logs..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm h-10"
                />
            </div>

            {/* Logs Table */}
            <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">ID</th>
                            <th className="p-4 font-medium text-muted-foreground">Date</th>
                            <th className="p-4 font-medium text-muted-foreground">Client</th>
                            <th className="p-4 font-medium text-muted-foreground">Device</th>
                            <th className="p-4 font-medium text-muted-foreground">Issue Details</th>
                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4 font-mono text-xs">{log.id}</td>
                                <td className="p-4">{log.date}</td>
                                <td className="p-4 font-medium">{log.client}</td>
                                <td className="p-4 text-muted-foreground">{log.device}</td>
                                <td className="p-4 truncate max-w-xs">{log.issue}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === "Fixed" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" :
                                            log.status === "In Progress" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                                                "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                                        }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        No logs found. Create a new ticket to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
