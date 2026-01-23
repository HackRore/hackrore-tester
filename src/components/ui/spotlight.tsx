"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const Spotlight = ({
    className,
    fill = "white",
}: {
    className?: string;
    fill?: string;
}) => {
    return (
        <svg
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1]  h-[169%] w-[138%] lg:w-[84%] opacity-0",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter="url(#filter0_f_0_1)">
                <ellipse
                    cx="1924.71"
                    cy="273.501"
                    rx="1924.71"
                    ry="273.501"
                    transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                    fill={fill}
                    fillOpacity="0.21"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_0_1"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur_0_1"
                    />
                </filter>
            </defs>
        </svg>
    );
};

type SpotlightProps = {
    children: React.ReactNode;
    className?: string;
};

export function SpotlightEffect({ children, className = "" }: SpotlightProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPosition({ x, y });

        // Calculate tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max -10 to 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 text-slate-200 shadow-2xl transition-transform duration-200 ease-out will-change-transform",
                className
            )}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
            }}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-30"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
}
