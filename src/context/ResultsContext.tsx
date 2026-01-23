"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface TestResult {
    id: string; // e.g., 'keyboard', 'camera'
    name: string;
    status: "pending" | "pass" | "fail" | "warning";
    timestamp: number;
    details?: Record<string, any>; // Flexible payload for specific test data
}

interface ResultsContextType {
    results: Record<string, TestResult>;
    history: TestResult[];
    addResult: (result: Omit<TestResult, "timestamp">) => void;
    clearResults: () => void;
    getOverallStatus: () => "pass" | "fail" | "warning" | "pending";
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export function ResultsProvider({ children }: { children: React.ReactNode }) {
    const [results, setResults] = useState<Record<string, TestResult>>({});
    const [history, setHistory] = useState<TestResult[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedResults = localStorage.getItem("test_results");
        const savedHistory = localStorage.getItem("test_history");
        if (savedResults) setResults(JSON.parse(savedResults));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("test_results", JSON.stringify(results));
        localStorage.setItem("test_history", JSON.stringify(history));
    }, [results, history]);

    const addResult = (result: Omit<TestResult, "timestamp">) => {
        const newResult = { ...result, timestamp: Date.now() };

        setResults((prev) => ({
            ...prev,
            [result.id]: newResult,
        }));

        setHistory((prev) => [newResult, ...prev].slice(0, 100)); // Keep last 100
    };

    const clearResults = () => {
        setResults({});
        setHistory([]);
        localStorage.removeItem("test_results");
        localStorage.removeItem("test_history");
    };

    const getOverallStatus = () => {
        const allResults = Object.values(results);
        if (allResults.some((r) => r.status === "fail")) return "fail";
        if (allResults.some((r) => r.status === "warning")) return "warning";
        if (allResults.length > 0 && allResults.every((r) => r.status === "pass")) return "pass";
        return "pending";
    };

    return (
        <ResultsContext.Provider
            value={{ results, history, addResult, clearResults, getOverallStatus }}
        >
            {children}
        </ResultsContext.Provider>
    );
}

export const useResults = () => {
    const context = useContext(ResultsContext);
    if (!context) {
        throw new Error("useResults must be used within a ResultsProvider");
    }
    return context;
};
