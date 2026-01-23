"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { ResultsProvider } from "@/context/ResultsContext";
import { GamificationProvider } from "@/context/GamificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ThemeProviderWrapper>
                <GamificationProvider>
                    <ResultsProvider>
                        {children}
                    </ResultsProvider>
                </GamificationProvider>
            </ThemeProviderWrapper>
        </NextThemesProvider>
    );
}
