"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

export type ThemeType = "system" | "light" | "dark" | "cyberpunk" | "blueprint";

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    currentThemeClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
    const { theme, setTheme: setNextTheme, resolvedTheme } = useNextTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSetTheme = (newTheme: ThemeType) => {
        setNextTheme(newTheme);
    };

    const getThemeClass = () => {
        if (!mounted) return "";
        if (theme === "cyberpunk") return "theme-cyberpunk";
        if (theme === "blueprint") return "theme-blueprint";
        return ""; // Default light/dark handled by next-themes class="dark"
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider
            value={{
                theme: (theme as ThemeType) || "system",
                setTheme: handleSetTheme,
                currentThemeClass: getThemeClass(),
            }}
        >
            <div className={getThemeClass()}>{children}</div>
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProviderWrapper");
    }
    return context;
};
