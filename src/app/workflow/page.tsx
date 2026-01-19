"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CaseLogForm } from "@/components/workflow/case-log-form"
import { WiringBuilder } from "@/components/workflow/wiring-builder"
import { CheatSheets } from "@/components/workflow/cheat-sheets"

export default function WorkflowPage() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Workflow Helpers</h2>
                <p className="text-muted-foreground">
                    Tools to manage your technician tasks.
                </p>
            </div>

            <Tabs defaultValue="case-log" className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="case-log">Case Log</TabsTrigger>
                    <TabsTrigger value="wiring">Wiring Diagram</TabsTrigger>
                    <TabsTrigger value="cheatsheets">Cheat Sheets</TabsTrigger>
                </TabsList>

                <TabsContent value="case-log" className="flex-1">
                    <CaseLogForm />
                </TabsContent>
                <TabsContent value="wiring" className="flex-1 h-full min-h-[500px]">
                    <WiringBuilder />
                </TabsContent>
                <TabsContent value="cheatsheets" className="flex-1">
                    <CheatSheets />
                </TabsContent>
            </Tabs>
        </div>
    )
}
