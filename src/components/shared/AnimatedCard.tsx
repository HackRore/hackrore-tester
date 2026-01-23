"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
    children: React.ReactNode;
    delay?: number;
}

export function AnimatedCard({ className, children, delay = 0, ...props }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card className={cn("h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 border-border/50 bg-card/50 backdrop-blur-sm", className)} {...props}>
                {children}
            </Card>
        </motion.div>
    );
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
