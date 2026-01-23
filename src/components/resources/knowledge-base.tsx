"use client";

import React from "react";
import { AnimatedCard } from "@/components/shared/AnimatedCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const ARTICLES = [
    {
        id: "kb-1",
        title: "MacBook Pro No Power Troubleshooting (A2159)",
        category: "Apple",
        content: `
            1. **Check USB-C Ammeter**: 
               - 5V / 0A: Dead PMIC or charging circuit.
               - 20V / 0A: CPU Dead or Short to Ground on main rail.
            
            2. **PPBUS_G3H Measurement**:
               - Should be ~12.6V. If shorted (<1V), inject voltage (1V/1A) and check thermal camera.
            
            3. **DFU Mode**: 
               - Try putting device in DFU mode. If recognized, try Apple Configurator 2 revive.
        `,
        tags: ["Power", "Logic Board"]
    },
    {
        id: "kb-2",
        title: "PS5 HDMI Port Replacement Guide",
        category: "Console",
        content: `
            **Tools Needed**: Hot Air Station (450°C), Flux, Low-melt Solder.
            
            1. disassembly: Remove plates, fan, heat sink, and motherboard shield.
            2. Removal: Apply flux, mix low-melt solder on anchor legs. Use hot air to lift port.
            3. Prep: Wick old solder. cleaning with IPA.
            4. Install: Tin pads on board. Place new port. Heat until it settles.
        `,
        tags: ["Soldering", "HDMI"]
    },
    {
        id: "kb-3",
        title: "Windows 11 BSOD 'CRITICAL_PROCESS_DIED'",
        category: "Software",
        content: `
            This usually indicates a driver or system file corruption.
            
            **Steps**:
            1. Safe Mode: Boot into safe mode.
            2. SFC Scan: Run \`sfc /scannow\` in admin terminal.
            3. DISM: Run \`DISM /Online /Cleanup-Image /RestoreHealth\`.
            4. Drivers: Roll back recently updated drivers (GPU/Chipset).
        `,
        tags: ["Windows", "BSOD"]
    },
    {
        id: "kb-4",
        title: "iPhone Face ID Repair (Reflow)",
        category: "Mobile",
        content: `
            The dot projector crystal often cracks or disconnects.
            
            - Use a specialized Face ID jig.
            - Read data from original flex.
            - Write data to new flex tag.
            - Transfer sensor without overheating (keep under 200°C if possible).
        `,
        tags: ["FaceID", "Micro-soldering"]
    }
];

const CATEGORIES = ["All", "Apple", "Console", "Software", "Mobile", "Data Recovery"];

export function KnowledgeBase({ search }: { search: string }) {
    const [selectedCategory, setSelectedCategory] = React.useState("All");

    const filtered = ARTICLES.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.content.toLowerCase().includes(search.toLowerCase()) ||
            a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

        const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <AnimatedCard className="p-6 min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold">Repair Guides & SOPs</h2>

                {/* Animated Filter Chips */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300
                                ${selectedCategory === cat
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary"}
                            `}
                        >
                            {selectedCategory === cat && (
                                <motion.div
                                    layoutId="category-pill"
                                    className="absolute inset-0 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{filtered.length} Results</Badge>
                {search && <span>for "{search}"</span>}
            </div>

            {filtered.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    <motion.div layout>
                        {filtered.map((article) => (
                            <AccordionItem key={article.id} value={article.id}>
                                <AccordionTrigger className="hover:no-underline group hover:bg-secondary/10 px-4 rounded-lg transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center text-left gap-2 w-full pr-4">
                                        <span className="font-semibold text-lg">{article.title}</span>
                                        <div className="flex gap-2 ml-auto">
                                            <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                                            {article.tags.map(t => <Badge key={t} variant="outline" className="text-[10px] hidden sm:inline-flex">{t}</Badge>)}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-4 text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {article.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </motion.div>
                </Accordion>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No guides found matching filters.</p>
                </div>
            )}
        </AnimatedCard>
    );
}
