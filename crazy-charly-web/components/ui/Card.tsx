import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: "glass" | "white" | "dark" | "outline";
}

export function Card({ children, className = "", variant = "glass", ...props }: CardProps) {
    const variants = {
        glass: "glass",
        white: "bg-white border border-white shadow-sm",
        dark: "glass-dark",
        outline: "bg-transparent border border-text-primary/10"
    };

    return (
        <div className={`rounded-3xl p-6 ${variants[variant]} ${className}`} {...props}>
            {children}
        </div>
    );
}
