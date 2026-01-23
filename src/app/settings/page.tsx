"use client"

import { useState } from "react"
import { User, Bell, Shield, Database, Palette, Save } from "lucide-react"

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        technicianName: "John Technician",
        shopName: "HackRore Repair Center",
        notifications: true,
        autoBackup: true,
        dataRetention: "90",
        theme: "system",
    })

    const handleSave = () => {
        localStorage.setItem("hackrore_settings", JSON.stringify(settings))
        alert("Settings saved successfully!")
    }

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-3xl">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Configure your technician workspace</p>
            </div>

            <div className="space-y-6">

                {/* Profile Settings */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <User className="h-5 w-5 text-primary" />
                        <h2 className="font-bold">Profile Information</h2>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Technician Name</label>
                            <input
                                type="text"
                                value={settings.technicianName}
                                onChange={(e) => setSettings({ ...settings, technicianName: e.target.value })}
                                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Shop/Business Name</label>
                            <input
                                type="text"
                                value={settings.shopName}
                                onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <Bell className="h-5 w-5 text-primary" />
                        <h2 className="font-bold">Notifications</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Enable Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive alerts for diagnostic results</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Data & Backup */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <Database className="h-5 w-5 text-primary" />
                        <h2 className="font-bold">Data Management</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Auto Backup</p>
                                <p className="text-sm text-muted-foreground">Automatically backup logs to cloud</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoBackup ? 'bg-primary' : 'bg-muted'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoBackup ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Data Retention (days)</label>
                            <select
                                value={settings.dataRetention}
                                onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                                <option value="180">180 days</option>
                                <option value="365">1 year</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="font-bold">Security & Privacy</h2>
                    </div>

                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-sm">
                            Change Password
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-sm">
                            Two-Factor Authentication
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-sm">
                            Clear All Local Data
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-bold shadow-lg shadow-primary/25"
                >
                    <Save className="h-5 w-5" />
                    Save Settings
                </button>

            </div>
        </div>
    )
}
