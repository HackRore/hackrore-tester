"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner"; // Assuming sonner is used or will be used, otherwise simple alert or console. For now, I'll use a simple placeholder if sonner isn't installed, but I should probably add it or use a custom toast. I'll stick to a simple state-based notification or console for now, or just logic. 
// Actually, I'll implement a simple internal notification state in this context or use window validation.

// Define unlockable themes/rewards
export interface Unlockable {
    id: string;
    name: string;
    type: "theme" | "badge";
    description: string;
    requiredLevel: number;
    unlocked: boolean;
}

interface GamificationContextType {
    xp: number;
    level: number;
    unlockables: Unlockable[];
    addXP: (amount: number, reason: string) => void;
    checkUnlock: (id: string) => boolean;
    getProgressToNextLevel: () => { progress: number; currentLevelThreshold: number; nextLevelThreshold: number; xpInLevel: number };
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]; // XP needed for levels 1-10

const INITIAL_UNLOCKABLES: Unlockable[] = [
    { id: "theme_cyberpunk", name: "Cyberpunk Glow", type: "theme", description: "Unlock the Cyberpunk theme.", requiredLevel: 3, unlocked: false },
    { id: "theme_blueprint", name: "Blueprint Grid", type: "theme", description: "Unlock the Blueprint theme.", requiredLevel: 5, unlocked: false },
    { id: "badge_novice", name: "Novice Technician", type: "badge", description: "Complete 5 tests.", requiredLevel: 2, unlocked: false },
];

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [unlockables, setUnlockables] = useState<Unlockable[]>(INITIAL_UNLOCKABLES);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load state
        const savedXP = localStorage.getItem("user_xp");
        const savedLevel = localStorage.getItem("user_level");
        const savedUnlocks = localStorage.getItem("user_unlocks");

        if (savedXP) setXp(parseInt(savedXP));
        if (savedLevel) setLevel(parseInt(savedLevel));
        if (savedUnlocks) setUnlockables(JSON.parse(savedUnlocks));
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("user_xp", xp.toString());
        localStorage.setItem("user_level", level.toString());
        localStorage.setItem("user_unlocks", JSON.stringify(unlockables));
    }, [xp, level, unlockables, mounted]);

    const addXP = (amount: number, reason: string) => {
        setXp((prev) => {
            const newXP = prev + amount;
            checkLevelUp(newXP);
            return newXP;
        });
        // Here we could trigger a toast: `+${amount} XP: ${reason}`
    };

    const checkLevelUp = (currentXP: number) => {
        let newLevel = 1;
        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (currentXP >= LEVEL_THRESHOLDS[i]) {
                newLevel = i + 1;
            } else {
                break;
            }
        }

        if (newLevel > level) {
            setLevel(newLevel);
            // Trigger Level Up Animation/Toast
            console.log("Level Up!", newLevel);
            checkUnlocks(newLevel);
        }
    };

    const checkUnlocks = (currentLevel: number) => {
        setUnlockables((prev) => {
            return prev.map(u => {
                if (!u.unlocked && currentLevel >= u.requiredLevel) {
                    console.log("Unlocked:", u.name);
                    return { ...u, unlocked: true };
                }
                return u;
            });
        });
    };

    const checkUnlock = (id: string) => {
        const item = unlockables.find(u => u.id === id);
        return item ? item.unlocked : false;
    };

    const getProgressToNextLevel = () => {
        const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
        const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

        const xpInLevel = xp - currentThreshold;
        const xpNeeded = nextThreshold - currentThreshold;

        let progress = 0;
        if (xpNeeded > 0) {
            progress = (xpInLevel / xpNeeded) * 100;
        } else {
            progress = 100; // Max level
        }

        return {
            progress: Math.min(100, Math.max(0, progress)),
            currentLevelThreshold: currentThreshold,
            nextLevelThreshold: nextThreshold,
            xpInLevel
        };
    };

    return (
        <GamificationContext.Provider value={{ xp, level, unlockables, addXP, checkUnlock, getProgressToNextLevel }}>
            {children}
        </GamificationContext.Provider>
    );
}

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) throw new Error("useGamification must be used within GamificationProvider");
    return context;
};
