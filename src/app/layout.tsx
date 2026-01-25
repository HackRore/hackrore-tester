import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GamificationProvider } from "@/context/GamificationContext";
import { ResultsProvider } from "@/context/ResultsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackRore Suite",
  description: "Professional laptop diagnostics and repair workflow management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProviderWrapper>
            <GamificationProvider>
              <ResultsProvider>
                <DashboardLayout>
                  {children}
                </DashboardLayout>
              </ResultsProvider>
            </GamificationProvider>
          </ThemeProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
