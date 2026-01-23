"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const REFURBISHED_ITEMS = [
    {
        id: 1,
        name: "Vintage IBM Model M",
        type: "Peripheral",
        price: "$250",
        rating: 5,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        status: "Restored"
    },
    {
        id: 2,
        name: "GameBoy Classic Mod",
        type: "Console",
        price: "$180",
        rating: 5,
        image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&q=80",
        status: "IPS Screen Mod"
    },
    {
        id: 3,
        name: "ThinkPad T480 (Maxed)",
        type: "Laptop",
        price: "$450",
        rating: 4,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
        status: "Refurbished"
    },
    {
        id: 4,
        name: "Sony Trinitron PVM",
        type: "Display",
        price: "$800",
        rating: 5,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
        status: "Calibrated"
    }
];

export function RefurbishedGallery() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((p) => (p + 1) % REFURBISHED_ITEMS.length);
    const prev = () => setCurrentIndex((p) => (p - 1 + REFURBISHED_ITEMS.length) % REFURBISHED_ITEMS.length);

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden py-10">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform scale-150" />

            <div className="relative w-full max-w-4xl flex items-center justify-center perspective-1000">
                <AnimatePresence initial={false} mode="popLayout">
                    {REFURBISHED_ITEMS.map((item, index) => {
                        // Simple logic for 3 visible items: prev, current, next
                        const offset = (index - currentIndex + REFURBISHED_ITEMS.length) % REFURBISHED_ITEMS.length;
                        // Center = 0, Left = length-1, Right = 1

                        let x = 0;
                        let z = 0;
                        let opacity = 0;
                        let scale = 1;
                        let rotateY = 0;
                        let zIndex = 0;

                        if (index === currentIndex) {
                            zIndex = 10;
                            opacity = 1;
                            scale = 1.1;
                        } else if (index === (currentIndex - 1 + REFURBISHED_ITEMS.length) % REFURBISHED_ITEMS.length) {
                            x = -250;
                            z = -100;
                            opacity = 0.6;
                            scale = 0.8;
                            rotateY = 30;
                            zIndex = 5;
                        } else if (index === (currentIndex + 1) % REFURBISHED_ITEMS.length) {
                            x = 250;
                            z = -100;
                            opacity = 0.6;
                            scale = 0.8;
                            rotateY = -30;
                            zIndex = 5;
                        } else {
                            opacity = 0; // Hide others
                        }

                        if (opacity === 0) return null;

                        return (
                            <motion.div
                                key={item.id}
                                className="absolute top-0 w-80 md:w-96 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    x,
                                    opacity,
                                    scale,
                                    zIndex,
                                    rotateY,
                                    transition: { duration: 0.5, type: "spring", stiffness: 100 }
                                }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className="relative h-64">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground font-bold">{item.price}</Badge>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{item.type}</p>
                                            <h3 className="text-xl font-bold">{item.name}</h3>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="border-green-500/50 text-green-500">{item.status}</Badge>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4 z-20">
                <button onClick={prev} className="p-3 rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground transition-colors border border-border shadow-lg">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={next} className="p-3 rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground transition-colors border border-border shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
