"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PDFDocument, rgb } from 'pdf-lib'

const formSchema = z.object({
    technician: z.string().min(2, "Technician name is required"),
    client: z.string().min(2, "Client name is required"),
    device: z.string().min(2, "Device model is required"),
    issue: z.string().min(5, "Issue description must be at least 5 characters"),
    notes: z.string().optional(),
})

export function CaseLogForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            technician: "",
            client: "",
            device: "",
            issue: "",
            notes: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const pdfDoc = await PDFDocument.create()
            const page = pdfDoc.addPage()
            const { width, height } = page.getSize()
            const fontSize = 12

            page.drawText('Service Case Log', { x: 50, y: height - 50, size: 24 })
            page.drawText(`Technician: ${values.technician}`, { x: 50, y: height - 100, size: fontSize })
            page.drawText(`Client: ${values.client}`, { x: 50, y: height - 120, size: fontSize })
            page.drawText(`Device: ${values.device}`, { x: 50, y: height - 140, size: fontSize })
            page.drawText(`Issue:`, { x: 50, y: height - 170, size: fontSize })
            page.drawText(values.issue, { x: 50, y: height - 190, size: fontSize })

            if (values.notes) {
                page.drawText(`Notes:`, { x: 50, y: height - 220, size: fontSize })
                page.drawText(values.notes, { x: 50, y: height - 240, size: fontSize })
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `case-log-${Date.now()}.pdf`
            link.click()
        } catch (e) {
            console.error(e)
            alert("Failed to generate PDF")
        }
    }

    return (
        <div className="max-w-xl mx-auto border p-6 rounded-md bg-card">
            <div className="mb-6">
                <h3 className="text-lg font-medium">New Service Case</h3>
                <p className="text-sm text-muted-foreground">Fill out the details to generate a service report.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="technician"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Technician Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="client"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jane Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="device"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device Model</FormLabel>
                                <FormControl>
                                    <Input placeholder="iPhone 13 Pro" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="issue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Issue Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Screen cracked, battery draining fast..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Additional Notes</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Parts ordered..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Download PDF Log</Button>
                </form>
            </Form>
        </div>
    )
}
